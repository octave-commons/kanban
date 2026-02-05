import { promises as fs } from 'node:fs';
import { parseFrontmatter as parseMarkdownFrontmatter } from '@promethean-os/markdown/frontmatter';
import type { EventLogManager } from '../board/event-log/index.js';
import { loadKanbanConfig } from '../board/config.js';
import { indexTasks } from '../board/indexer.js';
import type { Board, ColumnData, Task } from './types.js';
import {
  applyTemplateReplacements,
  BLOCKED_BY_HEADING,
  BLOCKS_HEADING,
  columnKey,
  cryptoRandomUUID,
  ensureLabelsPresent,
  ensureSectionExists,
  ensureTaskContent,
  ensureTaskFileBase,
  ensureUniqueFileBase,
  mergeSectionItems,
  normalizeColumnDisplayName,
  NOW_ISO,
  sanitizeFileNameBase,
  setSectionItems,
  uniqueStrings,
  wikiLinkForTask,
} from './kanban-utils.js';
import { toFrontmatter, readTasksFolder, resolveTaskFilePath } from './task-files.js';
import { writeBoard } from './board-serialization.js';
import { persistBoardAndTasks } from './task-sync.js';
import { shouldSkipFileChecks, shouldSkipGitChecks } from './utils/env-utils.js';

export const validateStartingStatus = (column: string): void => {
  const validStartingStatuses = ['icebox', 'incoming'];
  const normalizedColumn = columnKey(column);

  if (!validStartingStatuses.includes(normalizedColumn)) {
    throw new Error(
      `Invalid starting status: "${column}". Tasks can only be created with starting statuses: ${validStartingStatuses.join(', ')}. ` +
        `Use --status flag to specify a valid starting status when creating tasks.`,
    );
  }
};

export const ensureColumn = (board: Board, column: string): ColumnData => {
  const key = columnKey(column);
  let existing = board.columns.find((col) => columnKey(col.name) === key);
  if (!existing) {
    existing = {
      name: normalizeColumnDisplayName(column),
      count: 0,
      limit: null,
      tasks: [],
    };
    board.columns = [...board.columns, existing];
  } else if (existing.name !== normalizeColumnDisplayName(existing.name)) {
    existing.name = normalizeColumnDisplayName(existing.name);
  }
  return existing;
};

export const locateTask = (
  board: Board,
  uuid: string,
): { column: ColumnData; index: number; task: Task } | undefined => {
  for (const column of board.columns) {
    const index = column.tasks.findIndex((task) => task.uuid === uuid);
    if (index >= 0) {
      return { column, index, task: column.tasks[index]! };
    }
  }
  return undefined;
};

export const updateStatus = async (
  board: Board,
  uuid: string,
  newStatus: string,
  boardPath: string,
  tasksDir?: string,
  transitionRulesEngine?: import('./transition-rules.js').TransitionRulesEngine,
  correctionReason?: string,
  eventLogManager?: EventLogManager,
  actor: 'agent' | 'human' | 'system' = 'system',
): Promise<Task | undefined> => {
  let found: Task | undefined;
  for (const col of board.columns) {
    const idx = col.tasks.findIndex((t) => t.uuid === uuid);
    if (idx >= 0) {
      [found] = col.tasks.splice(idx, 1);
      col.count -= 1;
      break;
    }
  }
  if (!found) return undefined;

  const currentStatus = found.status;
  const normalizedStatus = normalizeColumnDisplayName(newStatus);

  try {
    const { validateP0SecurityTask } = await import('./validation/index.js');
    const p0Validation = await validateP0SecurityTask(found, currentStatus, normalizedStatus, {
      repoRoot: process.cwd(),
      tasksDir: tasksDir,
      skipGitChecks: shouldSkipGitChecks(),
      skipFileChecks: shouldSkipFileChecks(),
    });

    if (!p0Validation.valid) {
      let originalColumn = board.columns.find(
        (c) => columnKey(c.name) === columnKey(currentStatus),
      );
      if (originalColumn) {
        originalColumn.tasks = [...originalColumn.tasks, found];
        originalColumn.count += 1;
      }

      const errorMessage = `🚨 P0 Security Validation Failed:\n${p0Validation.errors.map((error) => `  ❌ ${error}`).join('\n')}`;
      const warningMessage =
        p0Validation.warnings.length > 0
          ? `\n⚠️  Warnings:\n${p0Validation.warnings.map((warning) => `  ⚡ ${warning}`).join('\n')}`
          : '';

      throw new Error(errorMessage + warningMessage);
    }

    if (p0Validation.warnings.length > 0) {
      console.warn(`⚠️  P0 Security Task Warnings:`);
      p0Validation.warnings.forEach((warning) => {
        console.warn(`  ⚡ ${warning}`);
      });
    }
  } catch (error) {
    let originalColumn = board.columns.find((c) => columnKey(c.name) === columnKey(currentStatus));
    if (originalColumn) {
      originalColumn.tasks = [...originalColumn.tasks, found];
      originalColumn.count += 1;
    }
    throw error;
  }

  if (transitionRulesEngine) {
    try {
      let enrichedTask = found;
      if (tasksDir) {
        try {
          const configResult = await loadKanbanConfig();
          const indexedTasks = await indexTasks({
            tasksDir: configResult.config.tasksDir,
            exts: configResult.config.exts,
            repoRoot: configResult.config.repo,
          });
          const fullTaskData = indexedTasks.find((task) => task.uuid === found.uuid);
          if (fullTaskData) {
            const convertedEstimates = fullTaskData.estimates
              ? {
                  complexity: fullTaskData.estimates.complexity,
                  scale: fullTaskData.estimates.scale
                    ? Number(fullTaskData.estimates.scale) || undefined
                    : undefined,
                  time_to_completion: fullTaskData.estimates.time_to_completion,
                }
              : undefined;

            enrichedTask = {
              ...found,
              content: fullTaskData.content,
              estimates: convertedEstimates,
            };
          }
        } catch (error) {
          console.warn('Warning: Failed to enrich task data for transition validation:', error);
        }
      }

      const transitionResult = await transitionRulesEngine.validateTransition(
        currentStatus,
        normalizedStatus,
        enrichedTask,
        board,
      );

      if (!transitionResult.allowed) {
        let originalColumn = board.columns.find(
          (c) => columnKey(c.name) === columnKey(currentStatus),
        );
        if (originalColumn) {
          originalColumn.tasks = [...originalColumn.tasks, found];
          originalColumn.count += 1;
        }

        const errorMessage = `❌ Transition blocked: ${transitionResult.reason}`;
        const suggestionMessage =
          transitionResult.suggestedAlternatives.length > 0
            ? `\n💡 Suggested alternatives: ${transitionResult.suggestedAlternatives.join(', ')}`
            : '';

        throw new Error(errorMessage + suggestionMessage);
      }

      if (transitionResult.warnings.length > 0) {
        console.warn(`⚠️  Transition warnings: ${transitionResult.warnings.join(', ')}`);
      }
    } catch (error) {
      let originalColumn = board.columns.find((c) => columnKey(c.name) === columnKey(currentStatus));
      if (originalColumn) {
        originalColumn.tasks = [...originalColumn.tasks, found];
        originalColumn.count += 1;
      }
      throw error;
    }
  }

  found.status = normalizedStatus;
  let target = board.columns.find((c) => columnKey(c.name) === columnKey(normalizedStatus));
  if (!target) {
    target = { name: normalizedStatus, count: 0, limit: null, tasks: [] };
    board.columns.push(target);
  } else if (target.name !== normalizeColumnDisplayName(target.name)) {
    target.name = normalizeColumnDisplayName(target.name);
  }

  try {
    const { createWIPLimitEnforcement } = await import('./wip-enforcement.js');
    const wipEnforcement = await createWIPLimitEnforcement();

    const wipValidation = await wipEnforcement.interceptStatusTransition(
      uuid,
      currentStatus,
      normalizedStatus,
      board,
      {
        force: false,
      },
    );

    if (wipValidation.blocked) {
      let originalColumn = board.columns.find((c) => columnKey(c.name) === columnKey(currentStatus));
      if (originalColumn) {
        originalColumn.tasks = [...originalColumn.tasks, found];
        originalColumn.count += 1;
      }

      const errorMessage = `🚫 WIP Limit Enforcement: ${wipValidation.reason}`;
      const suggestionMessage =
        wipValidation.suggestions && wipValidation.suggestions.length > 0
          ? `\n💡 Suggestions:\n${wipValidation.suggestions.map((s) => `  • ${s.description}`).join('\n')}`
          : '';

      throw new Error(errorMessage + suggestionMessage);
    }

    if (wipValidation.violation && wipValidation.violation.severity === 'warning') {
      console.warn(
        `⚠️  WIP Limit Warning: ${wipValidation.violation.severity} violation in ${newStatus}`,
      );
      if (wipValidation.suggestions && wipValidation.suggestions.length > 0) {
        console.warn('💡 Capacity Suggestions:');
        wipValidation.suggestions.forEach((suggestion) => {
          console.warn(`   • ${suggestion.description}`);
        });
      }
    }
  } catch (error) {
    console.warn('WIP enforcement engine failed, using fallback validation:', error);

    if (target.limit && target.count >= target.limit) {
      throw new Error(
        `WIP limit violation: Cannot move task to '${target.name}' - column has ${target.count} tasks (limit: ${target.limit})`,
      );
    }
  }

  target.tasks = [...target.tasks, found];
  target.count += 1;

  await writeBoard(boardPath, board);

  if (correctionReason && currentStatus === 'done' && normalizedStatus === 'review') {
    const corrections = found.corrections || { count: 0, history: [] };
    corrections.count += 1;
    corrections.history.push({
      timestamp: NOW_ISO(),
      from: currentStatus,
      to: normalizedStatus,
      reason: correctionReason,
    });
    found.corrections = corrections;

    console.log(`🔍 Audit correction logged: ${correctionReason}`);
  }

  if (eventLogManager) {
    try {
      await eventLogManager.logTransition(uuid, currentStatus, normalizedStatus, {
        actor,
        reason: correctionReason || `Status updated from ${currentStatus} to ${normalizedStatus}`,
        metadata: {
          boardPath,
          taskTitle: found.title,
          taskPriority: found.priority,
        },
      });
    } catch (error) {
      console.warn(`Warning: Could not log transition for ${uuid}: ${error}`);
    }
  }

  if (tasksDir) {
    try {
      const taskFilePath = await resolveTaskFilePath(found, tasksDir);
      if (taskFilePath) {
        const existingFileContent = await fs.readFile(taskFilePath, 'utf8');
        const parsed = parseMarkdownFrontmatter(existingFileContent);
        const existingContent = parsed.content ?? '';
        const existingCreatedAt = parsed.data?.created_at;

        const preservedCreatedAt = existingCreatedAt || found.created_at || NOW_ISO();

        const updatedTask: Task = {
          ...found,
          status: normalizedStatus,
          content: existingContent,
          created_at: preservedCreatedAt,
        };

        await fs.writeFile(taskFilePath, toFrontmatter(updatedTask), 'utf8');
      }
    } catch (error) {
      console.warn(`Warning: Could not update task file for ${uuid}: ${error}`);
    }
  }

  return found;
};

export const moveTask = async (
  board: Board,
  uuid: string,
  delta: number,
  boardPath: string,
): Promise<{ uuid: string; column: string; rank: number } | undefined> => {
  for (const col of board.columns) {
    const idx = col.tasks.findIndex((t) => t.uuid === uuid);
    if (idx >= 0) {
      const newIdx = Math.max(0, Math.min(col.tasks.length - 1, idx + delta));
      if (newIdx !== idx) {
        const next = [...col.tasks];
        const [removed] = next.splice(idx, 1);
        if (!removed) {
          continue;
        }
        next.splice(newIdx, 0, removed);
        col.tasks = next;
      }
      await writeBoard(boardPath, board);
      return { uuid, column: col.name, rank: newIdx };
    }
  }
  return undefined;
};

export const updateTaskDescription = async (
  board: Board,
  uuid: string,
  content: string,
  tasksDir: string,
  boardPath: string,
): Promise<Task | undefined> => {
  const located = locateTask(board, uuid);
  if (!located) return undefined;
  const { column, index, task } = located;
  const updated: Task = { ...task, content };
  column.tasks = [...column.tasks.slice(0, index), updated, ...column.tasks.slice(index + 1)];
  await persistBoardAndTasks(board, boardPath, tasksDir);
  return updated;
};

export const renameTask = async (
  board: Board,
  uuid: string,
  newTitle: string,
  tasksDir: string,
  boardPath: string,
): Promise<Task | undefined> => {
  const located = locateTask(board, uuid);
  if (!located) return undefined;
  const title = newTitle.trim();
  if (title.length === 0) {
    return undefined;
  }
  const { column, index, task } = located;
  const updated: Task = {
    ...task,
    title,
    slug: undefined,
  };
  column.tasks = [...column.tasks.slice(0, index), updated, ...column.tasks.slice(index + 1)];
  await persistBoardAndTasks(board, boardPath, tasksDir);

  const finalLocated = locateTask(board, uuid);
  return finalLocated?.task;
};

export const createTask = async (
  board: Board,
  column: string,
  input: {
    title: string;
    content?: string;
    body?: string;
    labels?: string[];
    priority?: Task['priority'];
    estimates?: Task['estimates'];
    created_at?: string;
    uuid?: string;
    slug?: string;
    templatePath?: string;
    defaultTemplatePath?: string;
    blocking?: string[];
    blockedBy?: string[];
  },
  tasksDir: string,
  boardPath: string,
): Promise<Task> => {
  const uuid = input.uuid ?? cryptoRandomUUID();
  const baseTitle = input.title?.trim() ?? '';
  const title = baseTitle.length > 0 ? baseTitle : `Task ${uuid.slice(0, 8)}`;

  validateStartingStatus(column);

  const targetColumn = ensureColumn(board, column);

  const existingTasks = await readTasksFolder(tasksDir);
  const existingById = new Map(existingTasks.map((task) => [task.uuid, task]));
  const normalizedTitle = title.trim().toLowerCase();
  const targetColumnName = targetColumn.name.trim().toLowerCase();

  const existingTaskInColumn = existingTasks.find(
    (task) =>
      task.title.trim().toLowerCase() === normalizedTitle &&
      task.status.trim().toLowerCase() === targetColumnName,
  );

  if (existingTaskInColumn) {
    return existingTaskInColumn;
  }

  const boardTaskInColumn = targetColumn.tasks.find(
    (task) => task.title.trim().toLowerCase() === normalizedTitle,
  );

  if (boardTaskInColumn) {
    const fullTask = existingTasks.find((t) => t.uuid === boardTaskInColumn.uuid);
    if (fullTask) {
      return fullTask;
    }
  return boardTaskInColumn;
}

  const boardIndex = new Map<string, { column: ColumnData; index: number; task: Task }>();
  board.columns.forEach((col) => {
    col.tasks.forEach((task, index) => {
      boardIndex.set(task.uuid, { column: col, index, task });
    });
  });

  const templatePath = input.templatePath ?? input.defaultTemplatePath;
  let templateContent: string | undefined;
  if (templatePath) {
    templateContent = await fs.readFile(templatePath, 'utf8');
  }

  const bodyText = input.body ?? input.content ?? '';
  let contentFromTemplate =
    typeof templateContent === 'string'
      ? applyTemplateReplacements(templateContent, {
          TITLE: title,
          BODY: bodyText,
          UUID: uuid,
        })
      : input.content ?? bodyText;

  if (!contentFromTemplate) {
    contentFromTemplate = '';
  }

  let newTaskContent = ensureSectionExists(contentFromTemplate, BLOCKED_BY_HEADING);
  newTaskContent = ensureSectionExists(newTaskContent, BLOCKS_HEADING);

  const baseTask: Task = {
    uuid,
    title,
    status: targetColumn.name,
    priority: input.priority,
    labels: input.labels && input.labels.length > 0 ? [...input.labels] : undefined,
    created_at: input.created_at ?? NOW_ISO(),
    estimates: input.estimates ? { ...input.estimates } : {},
    content: newTaskContent,
    slug: input.slug ? sanitizeFileNameBase(input.slug) : undefined,
  };

  const usedSlugs = new Map<string, string>();
  board.columns.forEach((col) => {
    col.tasks.forEach((task) => {
      const base = ensureTaskFileBase(task);
      usedSlugs.set(base, task.uuid);
    });
  });

  const baseSlug = ensureTaskFileBase(baseTask);
  const uniqueSlug = ensureUniqueFileBase(baseSlug, usedSlugs, baseTask.uuid);
  if (uniqueSlug !== baseTask.slug) {
    baseTask.slug = uniqueSlug;
  }
  usedSlugs.set(uniqueSlug, baseTask.uuid);

  const blockingIds = uniqueStrings(input.blocking);
  const blockedByIds = uniqueStrings(input.blockedBy);

  const resolveBoardTask = (id: string): Task | undefined => {
    const entry = boardIndex.get(id);
    if (!entry) return undefined;
    const fallback = existingById.get(id);
    entry.task.content = ensureTaskContent(entry.task, fallback);
    return entry.task;
  };

  const blockingLinks: string[] = [];
  for (const id of blockingIds) {
    const target = resolveBoardTask(id);
    if (!target) continue;
    blockingLinks.push(wikiLinkForTask(target));
  }

  const blockedByLinks: string[] = [];
  for (const id of blockedByIds) {
    const target = resolveBoardTask(id);
    if (!target) continue;
    blockedByLinks.push(wikiLinkForTask(target));
  }

  newTaskContent = setSectionItems(newTaskContent, BLOCKED_BY_HEADING, blockedByLinks);
  newTaskContent = setSectionItems(newTaskContent, BLOCKS_HEADING, blockingLinks);

  const enriched = ensureLabelsPresent({ ...baseTask, content: newTaskContent }, newTaskContent);

  const newTaskLink = wikiLinkForTask(enriched);

  const updateLinkedTask = async (id: string, heading: string) => {
    const entry = boardIndex.get(id);
    if (entry) {
      const fallback = existingById.get(id);
      const updatedContent = mergeSectionItems(ensureTaskContent(entry.task, fallback), heading, [
        newTaskLink,
      ]);
      const nextTask: Task = {
        ...entry.task,
        content: updatedContent,
        sourcePath: fallback?.sourcePath ?? entry.task.sourcePath,
      };
      entry.column.tasks = [
        ...entry.column.tasks.slice(0, entry.index),
        nextTask,
        ...entry.column.tasks.slice(entry.index + 1),
      ];
      entry.column.count = entry.column.tasks.length;
      boardIndex.set(id, {
        column: entry.column,
        index: entry.index,
        task: nextTask,
      });
      return;
    }

    const existing = existingById.get(id);
    if (!existing?.sourcePath) return;
    const updatedContent = mergeSectionItems(ensureTaskContent(existing, existing), heading, [
      newTaskLink,
    ]);
    const nextTask: Task = {
      ...existing,
      content: updatedContent,
    };
    await fs.writeFile(
      existing.sourcePath,
      toFrontmatter({ ...nextTask, status: nextTask.status ?? 'Todo' }),
      'utf8',
    );
    existingById.set(id, nextTask);
  };

  for (const id of blockingIds) {
    await updateLinkedTask(id, BLOCKED_BY_HEADING);
  }

  for (const id of blockedByIds) {
    await updateLinkedTask(id, BLOCKS_HEADING);
  }

  const enrichedWithLabels = { ...enriched };

  targetColumn.tasks = [...targetColumn.tasks, enrichedWithLabels];
  targetColumn.count = targetColumn.tasks.length;

  await persistBoardAndTasks(board, boardPath, tasksDir);
  return enrichedWithLabels;
};

export const archiveTask = async (
  board: Board,
  uuid: string,
  tasksDir: string,
  boardPath: string,
  options?: { columnName?: string },
): Promise<Task | undefined> => {
  const located = locateTask(board, uuid);
  if (!located) return undefined;
  const archiveName = options?.columnName ?? 'Archive';
  const { column } = located;
  if (columnKey(column.name) === columnKey(archiveName)) {
    located.task.status = column.name;
    await persistBoardAndTasks(board, boardPath, tasksDir);
    return located.task;
  }
  const removed = located.task;
  column.tasks = column.tasks.filter((task) => task.uuid !== uuid);
  column.count = column.tasks.length;
  const target = ensureColumn(board, archiveName);
  const moved: Task = { ...removed, status: target.name };
  target.tasks = [...target.tasks, moved];
  target.count = target.tasks.length;
  await persistBoardAndTasks(board, boardPath, tasksDir);
  return moved;
};

export const deleteTask = async (
  board: Board,
  uuid: string,
  tasksDir: string,
  boardPath: string,
): Promise<boolean> => {
  const located = locateTask(board, uuid);
  if (!located) return false;
  const { column, task } = located;
  column.tasks = column.tasks.filter((entry) => entry.uuid !== uuid);
  column.count = column.tasks.length;
  const filePath = await resolveTaskFilePath(task, tasksDir);
  if (filePath) {
    await fs.unlink(filePath).catch(() => {});
  }
  await persistBoardAndTasks(board, boardPath, tasksDir);
  return true;
};

export const mergeTasks = async (
  board: Board,
  sourceUuids: string[],
  targetUuid: string,
  tasksDir: string,
  boardPath: string,
  options?: {
    mergeStrategy?: 'append' | 'combine' | 'replace';
    preserveSources?: boolean;
  },
): Promise<Task | undefined> => {
  const targetLocated = locateTask(board, targetUuid);
  if (!targetLocated) return undefined;

  const sourceTasks: Task[] = [];
  const sourceLocated: Array<{ column: ColumnData; task: Task }> = [];

  for (const id of sourceUuids) {
    const located = locateTask(board, id);
    if (located) {
      sourceLocated.push(located);
      sourceTasks.push(located.task);
    }
  }

  if (sourceTasks.length === 0) return targetLocated.task;

  const targetTask = targetLocated.task;
  let mergedContent = targetTask.content || '';
  const mergeStrategy = options?.mergeStrategy ?? 'append';

  for (const sourceTask of sourceTasks) {
    if (!sourceTask.content) continue;

    switch (mergeStrategy) {
      case 'append':
        mergedContent += `\n\n## Merged from: ${sourceTask.title || sourceTask.uuid}\n\n${sourceTask.content}`;
        break;
      case 'combine':
        mergedContent += `\n\n${sourceTask.content}`;
        break;
      case 'replace':
        mergedContent = sourceTask.content;
        break;
    }
  }

  const finalContent =
    mergedContent +
    `\n\n---\n**Merged**: ${sourceUuids.length} tasks merged using ${mergeStrategy} strategy (${NOW_ISO()})\n---`;
  const updatedTask: Task = {
    ...targetTask,
    content: finalContent,
  };

  const targetColumn = targetLocated.column;
  targetColumn.tasks = targetColumn.tasks.map((task) =>
    task.uuid === targetUuid ? updatedTask : task,
  );

  if (!options?.preserveSources) {
    for (const located of sourceLocated) {
      located.column.tasks = located.column.tasks.filter((task) => task.uuid !== located.task.uuid);
      located.column.count = located.column.tasks.length;

      const filePath = await resolveTaskFilePath(located.task, tasksDir);
      if (filePath) {
        await fs.unlink(filePath).catch(() => {});
      }
    }
  }

  await persistBoardAndTasks(board, boardPath, tasksDir);
  return updatedTask;
};
