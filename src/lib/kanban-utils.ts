import { randomUUID } from 'node:crypto';
import path from 'node:path';
import type { ColumnData, Task } from './types.js';

export const NOW_ISO = (): string => new Date().toISOString();

export const stripDiacritics = (value: string): string =>
  value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

export const sanitizeFileNameBase = (value: string): string => {
  const normalized = stripDiacritics(value)
    .replace(/[\u0000-\u001f]/g, ' ')
    .replace(/[<>:"/\\|?*]/g, ' ')
    .replace(/\r?\n/g, ' ')
    .trim();
  const singleSpaced = normalized.replace(/\s{2,}/g, ' ');
  return singleSpaced.replace(/\.$/, '');
};

export const STOPWORDS = new Set<string>([
  'the',
  'and',
  'for',
  'with',
  'from',
  'that',
  'this',
  'into',
  'using',
  'your',
  'their',
  'about',
  'after',
  'before',
  'into',
  'onto',
  'under',
  'over',
  'todo',
  'task',
  'auto',
]);

export const stripTrailingCount = (value: string): string =>
  value.replace(/\s*\(\s*\d+\s*\)\s*$/g, '').trim();

export const normalizeColumnDisplayName = (value: string): string => {
  const trimmed = stripTrailingCount(value.trim());
  return trimmed.length > 0 ? trimmed : 'Todo';
};

export const columnKey = (name: string): string =>
  normalizeColumnDisplayName(name)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z0-9_]+/g, '');

const tokenizeForLabels = (text: string): ReadonlyArray<string> =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));

const generateAutoLabels = (
  title: string,
  body: string | undefined,
  limit = 4,
): ReadonlyArray<string> => {
  const tokens = new Map<string, number>();
  const addTokens = (source: string, weight: number) => {
    for (const token of tokenizeForLabels(source)) {
      tokens.set(token, (tokens.get(token) ?? 0) + weight);
    }
  };
  addTokens(title, 3);
  if (body) {
    addTokens(body.slice(0, 500), 1);
  }
  const sorted = Array.from(tokens.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([token]) => token.replace(/\s+/g, '-'));
  return sorted.slice(0, limit);
};

export const ensureLabelsPresent = (task: Task, body: string | undefined): Task => {
  if (task.labels && task.labels.length > 0) {
    return task;
  }
  const generated = generateAutoLabels(task.title ?? '', body);
  if (generated.length === 0) {
    return task;
  }
  return { ...task, labels: [...generated] };
};

export const FALLBACK_SLUG_REGEX = /^task [0-9a-f]{8}(?: \d+)?$/i;

export const isFallbackSlug = (slug: string, uuid: string): boolean => {
  const normalizedSlug = slug.trim().toLowerCase();
  const normalizedUuid = uuid.replace(/[^0-9a-f]/gi, '').toLowerCase();
  const slugWithoutDelimiters = normalizedSlug.replace(/[^0-9a-f]/gi, '');
  return FALLBACK_SLUG_REGEX.test(normalizedSlug) || slugWithoutDelimiters === normalizedUuid;
};

export const fallbackFileBase = (uuid: string): string => `Task ${uuid.slice(0, 8)}`;

export const resolveTaskSlug = (task: Task, baseName: string): string => {
  const sanitizedBase = sanitizeFileNameBase(baseName);
  const explicitSlug =
    typeof task.slug === 'string' && task.slug.trim().length > 0 ? task.slug.trim() : undefined;
  const fallbackSource = sanitizedBase.length > 0 ? sanitizedBase : task.title ?? sanitizedBase;
  const slugSource = explicitSlug ?? fallbackSource;
  const normalized = sanitizeFileNameBase(slugSource ?? '');
  if (normalized.length > 0) {
    return normalized;
  }
  return fallbackFileBase(task.uuid);
};

export const deriveFileBaseFromTask = (task: Task): string => {
  const fromSlug = typeof task.slug === 'string' ? sanitizeFileNameBase(task.slug) : '';
  if (fromSlug.length > 0 && !isFallbackSlug(fromSlug, task.uuid)) {
    return fromSlug;
  }
  const fromTitle = sanitizeFileNameBase(task.title ?? '');
  if (fromTitle.length > 0) {
    return fromTitle;
  }
  return fallbackFileBase(task.uuid);
};

export const ensureTaskFileBase = (task: Task): string => {
  const base = deriveFileBaseFromTask(task);
  if (!task.slug || task.slug !== base) {
    task.slug = base;
  }
  return base;
};

export const slugMatchesSourcePath = (task: Task): boolean => {
  if (!task.sourcePath) {
    return false;
  }
  const normalizedSlug =
    typeof task.slug === 'string' && task.slug.length > 0 ? sanitizeFileNameBase(task.slug) : '';
  if (normalizedSlug.length === 0) {
    return false;
  }
  const normalizedSource = sanitizeFileNameBase(
    path.basename(task.sourcePath, path.extname(task.sourcePath)),
  );
  return normalizedSource.length > 0 && normalizedSlug === normalizedSource;
};

export const ensureUniqueFileBase = (
  base: string,
  used: Map<string, string>,
  uuid: string,
): string => {
  const MAX_BASENAME_LENGTH = 120;
  const initial = base.length > 0 ? base : fallbackFileBase(uuid);

  const truncateForAttempt = (baseStr: string, attemptNum: number) => {
    const suffix = attemptNum > 1 ? ` ${attemptNum}` : '';
    const allowed = Math.max(1, MAX_BASENAME_LENGTH - suffix.length);
    const trimmed = baseStr.trim();
    if (trimmed.length <= allowed) return trimmed;
    const head = Math.floor(allowed * 0.6);
    const tail = allowed - head;
    return `${trimmed.slice(0, head).trim()} ${trimmed.slice(-tail).trim()}`.trim();
  };

  let attempt = 1;
  let candidate = truncateForAttempt(initial, attempt);
  while (used.has(candidate) && used.get(candidate) !== uuid) {
    attempt += 1;
    candidate = truncateForAttempt(initial, attempt);
  }
  return candidate;
};

export const mergeColumnsCaseInsensitive = (columns: ColumnData[]): ColumnData[] => {
  const merged = new Map<string, ColumnData>();
  for (const column of columns) {
    const displayName = normalizeColumnDisplayName(column.name);
    const key = columnKey(column.name);
    const normalizedTasks = column.tasks.map((task) => ({
      ...task,
      status: displayName,
    }));
    const existing = merged.get(key);
    if (existing) {
      const seenTasks = new Set(existing.tasks.map((task) => task.uuid));
      for (const task of normalizedTasks) {
        if (!seenTasks.has(task.uuid)) {
          existing.tasks.push(task);
          seenTasks.add(task.uuid);
        }
      }
      existing.count = existing.tasks.length;
      if (existing.limit == null && column.limit != null) {
        existing.limit = column.limit;
      }
      if (existing.name.length === 0 && displayName.length > 0) {
        existing.name = displayName;
      }
    } else {
      merged.set(key, {
        name: displayName,
        count: normalizedTasks.length,
        limit: column.limit,
        tasks: [...normalizedTasks],
      });
    }
  }
  return Array.from(merged.values()).map((col) => ({
    ...col,
    name: normalizeColumnDisplayName(col.name),
    count: col.tasks.length,
  }));
};

export const cryptoRandomUUID = (): string => randomUUID();

export const escapeRegExp = (value: string): string => value.replace(/[\\/\-^$*+?.()|[\]{}]/g, '\\$&');

export const BLOCKED_BY_HEADING = '## ⛓️ Blocked By';
export const BLOCKS_HEADING = '## ⛓️ Blocks';

export const formatSectionBlock = (heading: string, items: ReadonlyArray<string>): string => {
  const lines = items.length > 0 ? items.map((item) => `- ${item}`) : ['Nothing'];
  return `${heading}\n\n${lines.join('\n')}\n\n`;
};

export const setSectionItems = (
  content: string,
  heading: string,
  items: ReadonlyArray<string>,
): string => {
  const block = formatSectionBlock(heading, items);
  const pattern = new RegExp(`^${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=^##\\s+|$)`, 'm');
  if (pattern.test(content)) {
    return content.replace(pattern, () => block);
  }
  const trimmed = content.trimEnd();
  const prefix = trimmed.length > 0 ? `${trimmed}\n\n` : '';
  return `${prefix}${block}`;
};

export const ensureSectionExists = (content: string, heading: string): string => {
  const pattern = new RegExp(`^${escapeRegExp(heading)}\\s*$`, 'm');
  if (pattern.test(content)) {
    return content;
  }
  return setSectionItems(content, heading, []);
};

export const parseSectionItems = (content: string, heading: string): ReadonlyArray<string> => {
  const pattern = new RegExp(`^${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=^##\\s+|$)`, 'm');
  const match = pattern.exec(content);
  if (!match) return [];
  const sectionBody = match[1]?.trim() ?? '';
  if (sectionBody.length === 0 || /^nothing$/i.test(sectionBody)) {
    return [];
  }
  return sectionBody
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter((line) => line.length > 0);
};

export const mergeSectionItems = (
  content: string,
  heading: string,
  additions: ReadonlyArray<string>,
): string => {
  const existing = parseSectionItems(content, heading);
  const merged = new Set(existing);
  for (const item of additions) {
    if (item.trim().length > 0) {
      merged.add(item.trim());
    }
  }
  return setSectionItems(content, heading, Array.from(merged));
};

export const applyTemplateReplacements = (
  template: string,
  replacements: Record<string, string>,
): string => {
  if (typeof template !== 'string') {
    throw new Error('Template must be a string');
  }

  const sanitizedReplacements: Record<string, string> = {};
  for (const [key, value] of Object.entries(replacements)) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(key)) {
      throw new Error(`Invalid replacement key: ${key}`);
    }

    if (value === null || value === undefined) {
      sanitizedReplacements[key] = '';
    } else if (typeof value !== 'string') {
      sanitizedReplacements[key] = String(value);
    } else {
      sanitizedReplacements[key] = value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/`/g, '&#x60;')
        .replace(/javascript:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/on\w+/gi, '');
    }
  }

  return template.replace(/\{\{\s*([a-zA-Z_][a-zA-Z0-9_-]*)\s*\}\}/g, (_match, key: string) => {
    const replacement = sanitizedReplacements[key];
    return typeof replacement === 'string' ? replacement : '';
  });
};

export const uniqueStrings = (values: ReadonlyArray<string> | undefined): string[] =>
  Array.from(
    new Set(
      (values ?? [])
        .map((value) => value?.trim())
        .filter((value): value is string => Boolean(value) && value.length > 0),
    ),
  );

export const wikiLinkForTask = (task: Task): string => {
  const base = ensureTaskFileBase(task);
  const display = task.title && task.title.trim().length > 0 ? task.title.trim() : base;
  return `[[${base}|${display}]]`;
};

export const ensureTaskContent = (task: Task, fallback?: Task): string => {
  const baseContent =
    task.content && task.content.length > 0 ? task.content : fallback?.content ?? '';
  const withBlocked = ensureSectionExists(baseContent, BLOCKED_BY_HEADING);
  return ensureSectionExists(withBlocked, BLOCKS_HEADING);
};

export const tokenize = (s: string): string[] =>
  (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
