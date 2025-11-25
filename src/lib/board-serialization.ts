import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { loadKanbanConfig } from '../board/config.js';
import { refreshTaskIndex } from '../board/indexer.js';
import type { ColumnData, Task, EpicTask, Board } from './types.js';
import { calculateEpicStatus, getEpicSubtasks } from './epic.js';
import {
  ensureTaskFileBase,
  ensureUniqueFileBase,
  mergeColumnsCaseInsensitive,
  slugMatchesSourcePath,
} from './kanban-utils.js';

export const parseLimit = (header: string): number | null => {
  const match =
    header.match(/\((?:wip|limit)\s*[:=]\s*(\d+)\)/i) ??
    header.match(/\[\s*(?:wip|limit)\s*[:=]\s*(\d+)\s*\]/i) ??
    header.match(/(?:wip|limit)\s*[:=]\s*(\d+)/i);
  const numeric = match?.[1];
  return typeof numeric === 'string' ? parseInt(numeric, 10) : null;
};

export const parseColumnsFromMarkdown = (markdown: string): ColumnData[] => {
  const lines = markdown.split(/\r?\n/);

  const columns: ColumnData[] = [];
  let current: ColumnData | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (typeof line !== 'string') {
      continue;
    }

    const headingMatch = /^##\s+(.+)$/.exec(line);
    const headingValue = headingMatch?.[1];
    if (typeof headingValue === 'string') {
      const name = headingValue.trim();
      const limit = parseLimit(name);
      current = { name, count: 0, limit, tasks: [] };
      columns.push(current);
      continue;
    }

    if (!current) continue;

    const taskMatch = /^-\s+\[(x|\s)\]\s+(.+)$/.exec(line);
    const doneFlag = taskMatch?.[1];
    const rawTitle = taskMatch?.[2];
    if (typeof doneFlag === 'string' && typeof rawTitle === 'string') {
      const titlePart = rawTitle.trim();
      const uuidMatch = /\(uuid:([0-9a-fA-F-]{8,})\)/.exec(titlePart);
      const uuidCandidate = uuidMatch?.[1];
      const uuid = typeof uuidCandidate === 'string' ? uuidCandidate : randomUUID();
      const wikiMatch = /\[\[([^\]]+)\]\]/.exec(titlePart);
      let linkTarget: string | undefined;
      let displayFromWiki: string | undefined;
      if (wikiMatch) {
        const targetRaw = wikiMatch[1] ?? '';
        const [targetSlug, alias] = targetRaw.split('|', 2);
        const normalizedTarget = (targetSlug ?? '').trim();
        if (normalizedTarget.length > 0) {
          linkTarget = normalizedTarget;
        }
        const displayCandidate = (alias ?? targetSlug)?.trim();
        if (displayCandidate && displayCandidate.length > 0) {
          displayFromWiki = displayCandidate;
        }
      }
      const labels = Array.from(titlePart.matchAll(/#(\S+)/g))
        .map((match) => match[1])
        .filter((label): label is string => typeof label === 'string' && label.length > 0);
      const prioMatch = titlePart.match(/\bprio[:=]([^\s)]+)\b/i);
      const priority = prioMatch?.[1];
      const titleClean = titlePart
        .replace(/\(uuid:[^)]+\)/g, '')
        .replace(/\[\[[^\]]+\]\]/g, displayFromWiki ?? '')
        .replace(/#\S+/g, '')
        .replace(/\bprio[:=][^\s)]+\b/gi, '')
        .trim();
      const title =
        titleClean.length > 0
          ? titleClean
          : displayFromWiki ?? linkTarget ?? `Task ${uuid.slice(0, 8)}`;

      const done = doneFlag === 'x';
      const status = done ? 'Done' : current.name;

      const task: Task = {
        uuid,
        title,
        status,
        priority,
        labels,
        created_at: new Date().toISOString(),
        estimates: {},
        content: '',
        slug: linkTarget,
      };
      current.tasks.push(task);
      current.count += 1;
      continue;
    }
  }
  return mergeColumnsCaseInsensitive(columns);
};

const assignStableSlugs = (columns: ColumnData[]): Map<string, string> => {
  const ordered: { task: Task; locked: boolean; order: number }[] = [];
  let order = 0;
  for (const column of columns) {
    for (const task of column.tasks) {
      ordered.push({ task, locked: slugMatchesSourcePath(task), order });
      order += 1;
    }
  }
  ordered.sort((a, b) => {
    if (a.locked === b.locked) {
      return a.order - b.order;
    }
    return a.locked ? -1 : 1;
  });
  const used = new Map<string, string>();
  const finalSlugs = new Map<string, string>();
  for (const entry of ordered) {
    const baseName = ensureTaskFileBase(entry.task);
    const uniqueBase = ensureUniqueFileBase(baseName, used, entry.task.uuid);
    finalSlugs.set(entry.task.uuid, uniqueBase);
    used.set(uniqueBase, entry.task.uuid);
  }
  return finalSlugs;
};

export const serializeBoard = (board: Board): string => {
  const lines: string[] = ['---', 'kanban-plugin: board', '---', ''];
  const columns = mergeColumnsCaseInsensitive(board.columns);
  const finalSlugs = assignStableSlugs(columns);
  for (const col of columns) {
    lines.push(`## ${col.name}`);
    lines.push('');
    for (const task of col.tasks) {
      const done = /done/i.test(col.name) ? 'x' : ' ';
      const linkTarget = finalSlugs.get(task.uuid) ?? ensureTaskFileBase(task);
      if (task.slug !== linkTarget) {
        task.slug = linkTarget;
      }
      const displayTitle =
        task.title && task.title.trim().length > 0 ? task.title.trim() : linkTarget;
      const wikiLink =
        displayTitle === linkTarget ? `[[${linkTarget}]]` : `[[${linkTarget}|${displayTitle}]]`;
      const labelSegment =
        (task.labels ?? []).length > 0
          ? (task.labels ?? []).map((label) => `#${label}`).join(' ')
          : '';
      const priorityValue =
        typeof task.priority === 'number' || typeof task.priority === 'string'
          ? String(task.priority).trim()
          : '';
      const prioritySegment = priorityValue.length > 0 ? `prio:${priorityValue}` : '';

      let epicSegment = '';
      if (task.type === 'epic') {
        const subtasks = getEpicSubtasks(board, task as EpicTask);
        const epicStatus = calculateEpicStatus(subtasks);
        epicSegment = `📋 epic:${epicStatus} (${subtasks.length} tasks)`;
      } else if (task.epicId) {
        epicSegment = `🔗 subtask of:${task.epicId.slice(0, 8)}...`;
      }

      const segments = [`- [${done}]`, wikiLink];
      if (epicSegment.length > 0) {
        segments.push(epicSegment);
      }
      if (labelSegment.length > 0) {
        segments.push(labelSegment);
      }
      if (prioritySegment.length > 0) {
        segments.push(prioritySegment);
      }
      segments.push(`(uuid:${task.uuid})`);
      lines.push(segments.filter((segment) => segment.length > 0).join(' '));
    }
    lines.push('');
  }
  return lines.join('\n');
};

const KANBAN_SETTINGS_PATTERN = /^\s*%%\s*kanban:settings\b/m;
const DEFAULT_KANBAN_FOOTER = [
  '%% kanban:settings',
  '```',
  '{"kanban-plugin":"board","list-collapse":[false,false,true,false,false,false,false,false,false,false,false,true,false,false,false],"new-note-template":"docs/agile/templates/task.stub.template.md","new-note-folder":"docs/agile/tasks","metadata-keys":[{"metadataKey":"tags","label":"","shouldHideLabel":false,"containsMarkdown":false},{"metadataKey":"hashtags","label":"","shouldHideLabel":false,"containsMarkdown":false}]}',
  '```',
  '%%',
].join('\n');

export const resolveKanbanFooter = async (boardPath: string): Promise<string> => {
  try {
    const existing = await fs.readFile(boardPath, 'utf8');
    const idx = existing.search(KANBAN_SETTINGS_PATTERN);
    if (idx >= 0) {
      const footer = existing.slice(idx).trim();
      if (footer.length > 0) {
        return footer;
      }
    }
  } catch {}
  return DEFAULT_KANBAN_FOOTER;
};

export const maybeRefreshIndex = async (tasksDir: string): Promise<void> => {
  try {
    const { config } = await loadKanbanConfig();
    const resolvedInput = path.resolve(tasksDir);
    const resolvedConfig = path.resolve(config.tasksDir);
    if (resolvedInput !== resolvedConfig) {
      return;
    }
    await refreshTaskIndex(config);
  } catch {
    // ignore
  }
};

export const writeBoard = async (boardPath: string, board: Board): Promise<void> => {
  const md = serializeBoard(board).trimEnd();
  const footer = await resolveKanbanFooter(boardPath);
  const segments: string[] = [];
  if (md.length > 0) {
    segments.push(md);
  }
  segments.push(footer.trimEnd());
  const output = `${segments.join('\n\n')}\n`;
  await fs.mkdir(path.dirname(boardPath), { recursive: true }).catch(() => {});
  await fs.writeFile(boardPath, output, 'utf8');
};
