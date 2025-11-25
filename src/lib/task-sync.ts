import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parseFrontmatter as parseMarkdownFrontmatter } from '@promethean-os/markdown/frontmatter';
import { loadKanbanConfig } from '../board/config.js';
import { indexTasks, serializeTasks, writeIndexFile } from '../board/indexer.js';
import type { Board, ColumnData, Task } from './types.js';
import {
  columnKey,
  deriveFileBaseFromTask,
  ensureTaskFileBase,
  isFallbackSlug,
  normalizeColumnDisplayName,
  sanitizeFileNameBase,
} from './kanban-utils.js';
import { maybeRefreshIndex, writeBoard } from './board-serialization.js';
import { mergeColumnsCaseInsensitive } from './kanban-utils.js';
import { readTasksFolder, toFrontmatter } from './task-files.js';

export const pullFromTasks = async (
  board: Board,
  tasksDir: string,
  boardPath: string,
): Promise<{ added: number; moved: number }> => {
  board.columns = mergeColumnsCaseInsensitive(board.columns);
  const tasks = await readTasksFolder(tasksDir);
  let added = 0,
    moved = 0;
  const byId = new Map<string, { col: ColumnData; idx: number }>();
  board.columns.forEach((col) => col.tasks.forEach((t, idx) => byId.set(t.uuid, { col, idx })));

  const canonicalTitles = new Set<string>();
  const seenTaskIds = new Set<string>();

  for (const t of tasks) {
    const normalizedStatus = normalizeColumnDisplayName(String(t.status || 'Todo'));
    const statusKey = columnKey(normalizedStatus);
    const normalizedTask = { ...t, status: normalizedStatus };
    const titleKey = (normalizedTask.title ?? '').trim().toLowerCase();
    if (titleKey.length > 0) {
      canonicalTitles.add(titleKey);
    }
    seenTaskIds.add(normalizedTask.uuid);
    const loc = byId.get(t.uuid);
    if (!loc) {
      let col = board.columns.find((c) => columnKey(c.name) === statusKey);
      if (!col) {
        col = { name: normalizedStatus, count: 0, limit: null, tasks: [] };
        board.columns.push(col);
      } else if (col.name !== normalizeColumnDisplayName(col.name)) {
        col.name = normalizeColumnDisplayName(col.name);
      }
      col.tasks = [...col.tasks, normalizedTask];
      col.count = col.tasks.length;
      added++;
    } else {
      const currentTask = loc.col.tasks[loc.idx];
      loc.col.tasks[loc.idx] = {
        ...currentTask,
        ...normalizedTask,
        status: loc.col.name,
      };

      const currentKey = columnKey(loc.col.name);
      if (currentKey !== statusKey) {
        loc.col.tasks = loc.col.tasks.filter((x) => x.uuid !== t.uuid);
        loc.col.count = loc.col.tasks.length;
        let dest = board.columns.find((c) => columnKey(c.name) === statusKey);
        if (!dest) {
          dest = { name: normalizedStatus, count: 0, limit: null, tasks: [] };
          board.columns.push(dest);
        } else if (dest.name !== normalizeColumnDisplayName(dest.name)) {
          dest.name = normalizeColumnDisplayName(dest.name);
        }
        dest.tasks = [...dest.tasks, { ...normalizedTask, status: dest.name }];
        dest.count = dest.tasks.length;
        moved++;

        console.log(
          `📝 Pulled status change for task "${normalizedTask.title}": ${loc.col.name} → ${normalizedStatus}`,
        );
      }
    }
  }

  for (const column of board.columns) {
    const filteredTasks: Task[] = [];
    for (const task of column.tasks) {
      if (seenTaskIds.has(task.uuid)) {
        filteredTasks.push(task);
        continue;
      }

      const titleKey = (task.title ?? '').trim().toLowerCase();
      if (!canonicalTitles.has(titleKey)) {
        filteredTasks.push(task);
        continue;
      }

      const slugCandidate =
        typeof task.slug === 'string' && task.slug.length > 0
          ? sanitizeFileNameBase(task.slug)
          : deriveFileBaseFromTask(task);
      if (!slugCandidate || !slugCandidate.length || !task.uuid) {
        filteredTasks.push(task);
        continue;
      }
      if (!isFallbackSlug(slugCandidate, task.uuid)) {
        filteredTasks.push(task);
        continue;
      }
      // Skip stale duplicate entry that no longer exists on disk
    }
    column.tasks = filteredTasks;
    column.count = filteredTasks.length;
  }
  await writeBoard(boardPath, board);

  if (moved > 0) {
    console.log(`✅ Pulled ${moved} status change(s) from files to board`);
  }

  return { added, moved };
};

export const pushToTasks = async (
  board: Board,
  tasksDir: string,
): Promise<{ added: number; moved: number; statusUpdated: number }> => {
  let added = 0,
    moved = 0,
    statusUpdated = 0;
  const existingTasks = await readTasksFolder(tasksDir);

  const existingByUuid = new Map(existingTasks.map((task) => [task.uuid, task]));

  const usedNames = new Map<string, string>();
  for (const task of existingTasks) {
    const base = ensureTaskFileBase(task);
    usedNames.set(base, task.uuid);
  }

  await fs.mkdir(tasksDir, { recursive: true }).catch(() => {});

  const existingFiles = new Set<string>();
  try {
    const files = await fs.readdir(tasksDir);
    for (const file of files) {
      if (file.endsWith('.md')) {
        existingFiles.add(file);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read tasks directory ${tasksDir}: ${error}`);
  }

  for (const col of board.columns) {
    for (const task of col.tasks) {
      const baseName = ensureTaskFileBase(task);

      let finalTask = { ...task };
      const existingTaskForSlug = Array.from(existingByUuid.values()).find(
        (t) => t.slug === baseName || ensureTaskFileBase(t) === baseName,
      );

      if (existingTaskForSlug && existingTaskForSlug.uuid !== task.uuid) {
        console.log(
          `🔧 UUID mismatch detected: board has ${task.uuid} but file has ${existingTaskForSlug.uuid}. Using file UUID.`,
        );
        finalTask.uuid = existingTaskForSlug.uuid;
        finalTask.created_at = existingTaskForSlug.created_at;
        finalTask.content = existingTaskForSlug.content || finalTask.content;
      }

      const existingTask = existingByUuid.get(finalTask.uuid);
      const existingFileBase = existingTask ? ensureTaskFileBase(existingTask) : null;
      const existingFileName = existingFileBase ? `${existingFileBase}.md` : null;

      let boardStatus = col.name;
      let fileStatus = existingTask?.status;

      const normalizedBoardStatus = normalizeColumnDisplayName(boardStatus);
      const normalizedFileStatus = fileStatus ? normalizeColumnDisplayName(fileStatus) : null;

      if (existingTask && normalizedFileStatus && normalizedBoardStatus !== normalizedFileStatus) {
        statusUpdated++;
        console.log(
          `📝 Detected manual status change for task "${finalTask.title}": ${normalizedFileStatus} → ${normalizedBoardStatus}`,
        );
      }

      let targetBase = baseName;
      const conflictingFileName = `${baseName}.md`;

      if (existingFiles.has(conflictingFileName)) {
        const conflictingUuid = usedNames.get(baseName);

        if (conflictingUuid && conflictingUuid !== finalTask.uuid) {
          console.log(
            `🔄 Duplicate task detected: UUID ${finalTask.uuid} conflicts with existing UUID ${conflictingUuid}. Using existing file "${conflictingFileName}"`,
          );

          targetBase = baseName;
          finalTask.slug = targetBase;
        } else if (!conflictingUuid) {
          let attempt = 1;
          let uniqueCandidate = `${baseName} ${attempt}`;
          while (existingFiles.has(`${uniqueCandidate}.md`)) {
            attempt++;
            uniqueCandidate = `${baseName} ${attempt}`;
          }
          targetBase = uniqueCandidate;
          console.log(
            `👻 Ghost file detected: "${conflictingFileName}" has no frontmatter. Using "${targetBase}.md"`,
          );
        }
      } else if (existingFileName && existingFiles.has(existingFileName)) {
        if (existingTask && existingTask.title === finalTask.title) {
          targetBase = existingFileBase!;
        }
      }

      if (finalTask.slug !== targetBase) {
        finalTask.slug = targetBase;
      }

      usedNames.set(targetBase, finalTask.uuid);

      const filename = `${targetBase}.md`;
      const targetPath = path.join(tasksDir, filename);
      const previous = existingByUuid.get(finalTask.uuid);
      const previousPath = previous?.sourcePath;

      let finalTargetPath = targetPath;
      let shouldDeletePrevious = true;

      const conflictingUuid = usedNames.get(baseName);
      if (
        conflictingUuid &&
        conflictingUuid !== finalTask.uuid &&
        existingFiles.has(conflictingFileName)
      ) {
        finalTargetPath = path.join(tasksDir, conflictingFileName);
        shouldDeletePrevious = false;
        console.log(`🔗 Merging task ${finalTask.uuid} into existing file ${conflictingFileName}`);
      }

      let existingContent = '';
      let existingCreatedAt = '';
      if (previous && previousPath) {
        try {
          const existingFileContent = await fs.readFile(previousPath, 'utf8');
          const parsed = parseMarkdownFrontmatter(existingFileContent);
          existingContent = parsed.content ?? '';
          existingCreatedAt = parsed.data?.created_at ?? '';
        } catch (error) {
          console.warn(`Warning: Could not read existing task file ${previousPath}: ${error}`);
        }
      }

      let finalContent = finalTask.content || existingContent;
      if (finalTask.content) {
        finalContent = finalTask.content;
      }

      const preservedCreatedAt = existingCreatedAt || finalTask.created_at || new Date().toISOString();

      const taskForWrite: Task = {
        ...finalTask,
        status: normalizedBoardStatus,
        content: finalContent,
        created_at: preservedCreatedAt,
      };

      const content = toFrontmatter(taskForWrite);
      await fs.writeFile(finalTargetPath, content, 'utf8');

      if (!previous) {
        if (
          conflictingUuid &&
          conflictingUuid !== finalTask.uuid &&
          existingFiles.has(conflictingFileName)
        ) {
          console.log(`✅ Merged duplicate task, no new file created`);
        } else {
          added += 1;
        }
      } else {
        moved += 1;
        if (
          shouldDeletePrevious &&
          previousPath &&
          path.resolve(previousPath) !== path.resolve(finalTargetPath)
        ) {
          await fs.unlink(previousPath).catch(() => {});
        }
      }
      existingByUuid.delete(finalTask.uuid);
    }
  }

  if (statusUpdated > 0) {
    console.log(`✅ Preserved ${statusUpdated} manual status change(s) from board to files`);
  }

  return { added, moved, statusUpdated };
};

export const persistBoardAndTasks = async (
  board: Board,
  boardPath: string | undefined,
  tasksDir: string | undefined,
): Promise<{ tasks: { added: number; moved: number; statusUpdated: number } }> => {
  if (boardPath) {
    await writeBoard(boardPath, board);
  }
  let tasksResult = { added: 0, moved: 0, statusUpdated: 0 };
  if (tasksDir) {
    tasksResult = await pushToTasks(board, tasksDir);
  }
  return { tasks: tasksResult };
};

export const syncBoardAndTasks = async (
  board: Board,
  tasksDir: string,
  boardPath: string,
): Promise<{
  board: { added: number; moved: number };
  tasks: { added: number; moved: number; statusUpdated: number };
  conflicting: string[];
}> => {
  const taskFiles = await readTasksFolder(tasksDir);
  const boardById = new Map<string, Task>();
  for (const col of board.columns)
    for (const t of col.tasks) boardById.set(t.uuid, { ...t, status: col.name });
  const tasksById = new Map(taskFiles.map((t) => [t.uuid, t]));

  const conflicting: string[] = [];

  for (const [id, fileTask] of tasksById) {
    const boardTask = boardById.get(id);
    if (!boardTask) continue;

    const fileTitle = (fileTask.title ?? '').trim();
    const boardTitle = (boardTask.title ?? '').trim();
    const fileStatus = normalizeColumnDisplayName(String(fileTask.status ?? ''));
    const boardStatus = normalizeColumnDisplayName(String(boardTask.status ?? ''));

    if (fileTitle !== boardTitle) {
      conflicting.push(id);
      console.log(
        `⚠️  Title conflict for task ${id}: board="${boardTitle}" vs file="${fileTitle}"`,
      );
    }

    if (fileStatus !== boardStatus) {
      conflicting.push(id);
      console.log(
        `⚠️  Status conflict for task ${id}: board="${boardStatus}" vs file="${fileStatus}"`,
      );
    }
  }

  console.log('🔄 Sync: Pulling changes from files to board...');
  const boardRes = await pullFromTasks(board, tasksDir, boardPath);

  console.log('🔄 Sync: Pushing changes from board to files...');
  const tasksRes = await pushToTasks(board, tasksDir);

  if (boardPath) {
    await writeBoard(boardPath, board);
  }

  if (tasksRes.statusUpdated > 0) {
    console.log(`📝 Sync preserved ${tasksRes.statusUpdated} manual status change(s) from board`);
  }

  if (boardRes.moved > 0) {
    console.log(`📝 Sync applied ${boardRes.moved} status change(s) from files`);
  }

  if (conflicting.length > 0) {
    console.log(`⚠️  Resolved ${conflicting.length} conflict(s) during sync`);
  }

  const totalStatusUpdated = boardRes.moved + tasksRes.statusUpdated;
  const combinedTasksRes = { ...tasksRes, statusUpdated: totalStatusUpdated };

  return { board: boardRes, tasks: combinedTasksRes, conflicting };
};

export const regenerateBoard = async (
  tasksDir: string,
  boardPath: string,
): Promise<{ totalTasks: number }> => {
  const { config } = await loadKanbanConfig();
  const tasks = await readTasksFolder(tasksDir);

  const statusGroups = new Map<string, { name: string; tasks: Task[] }>();
  for (const task of tasks) {
    const statusRaw = String(task.status || 'Todo').trim();
    const displayName = normalizeColumnDisplayName(statusRaw);
    const key = columnKey(statusRaw);
    const existing = statusGroups.get(key);
    if (existing) {
      existing.tasks.push({ ...task, status: existing.name });
    } else {
      statusGroups.set(key, {
        name: displayName,
        tasks: [{ ...task, status: displayName }],
      });
    }
  }

  const configuredStatusKeys = new Set(Array.from(config.statusValues).map(columnKey));
  const configuredColumns: ColumnData[] = Array.from(config.statusValues).map((statusValue) => {
    const displayName = normalizeColumnDisplayName(statusValue);
    const key = columnKey(statusValue);
    const existingGroup = statusGroups.get(key);

    return {
      name: displayName,
      count: existingGroup?.tasks.length || 0,
      limit: config.wipLimits[statusValue] || null,
      tasks: existingGroup?.tasks || [],
    };
  });

  const additionalColumns: ColumnData[] = Array.from(statusGroups.entries())
    .filter(([key]) => !configuredStatusKeys.has(key))
    .map(([, group]) => ({
      name: group.name,
      count: group.tasks.length,
      limit: null,
      tasks: group.tasks,
    }));

  const columns = [...configuredColumns, ...additionalColumns];

  await maybeRefreshIndex(tasksDir);
  await writeBoard(boardPath, { columns });
  return { totalTasks: tasks.length };
};

export const generateBoardByTags = async (
  tasksDir: string,
  boardPath: string,
  tags: string[],
): Promise<{ totalTasks: number; filteredTags: string[] }> => {
  const { config } = await loadKanbanConfig();
  const allTasks = await readTasksFolder(tasksDir);

  const filteredTasks = allTasks.filter((task) => {
    const taskTags = task.labels || [];
    return tags.every((tag) => taskTags.includes(tag));
  });

  const statusGroups = new Map<string, { name: string; tasks: Task[] }>();
  for (const task of filteredTasks) {
    const statusRaw = String(task.status || 'Todo').trim();
    const displayName = normalizeColumnDisplayName(statusRaw);
    const key = columnKey(statusRaw);
    const existing = statusGroups.get(key);
    if (existing) {
      existing.tasks.push({ ...task, status: existing.name });
    } else {
      statusGroups.set(key, {
        name: displayName,
        tasks: [{ ...task, status: displayName }],
      });
    }
  }

  const columns: ColumnData[] = Array.from(config.statusValues).map((statusValue) => {
    const displayName = normalizeColumnDisplayName(statusValue);
    const key = columnKey(statusValue);
    const existingGroup = statusGroups.get(key);
    return {
      name: displayName,
      count: existingGroup?.tasks.length || 0,
      limit: config.wipLimits[statusValue] || null,
      tasks: existingGroup?.tasks || [],
    };
  });

  const tagSuffix = tags.length > 0 ? `-${tags.join('-').replace(/[^a-zA-Z0-9]/g, '_')}` : '';
  const boardDir = path.dirname(boardPath);
  const boardName = path.basename(boardPath, '.md');
  const taggedBoardPath = path.join(boardDir, `${boardName}${tagSuffix}.md`);

  await maybeRefreshIndex(tasksDir);
  await writeBoard(taggedBoardPath, { columns });
  return { totalTasks: filteredTasks.length, filteredTags: tags };
};

export const indexForSearch = async (
  _tasksDir: string,
  options?: Readonly<{
    readonly argv?: ReadonlyArray<string>;
    readonly env?: Readonly<NodeJS.ProcessEnv>;
  }>,
): Promise<
  Readonly<{
    readonly started: true;
    readonly tasksIndexed: number;
    readonly wroteIndexFile: boolean;
  }>
> => {
  const { config, restArgs } = await loadKanbanConfig({
    argv: options?.argv,
    env: options?.env,
  });
  const tasks = await indexTasks({
    tasksDir: config.tasksDir,
    exts: config.exts,
    repoRoot: config.repo,
  });
  const lines = serializeTasks(tasks);
  const shouldWrite = new Set(restArgs).has('--write');
  if (shouldWrite) {
    await writeIndexFile(config.indexFile, lines);
  }
  return Object.freeze({
    started: true,
    tasksIndexed: tasks.length,
    wroteIndexFile: shouldWrite,
  });
};
