import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parseFrontmatter as parseMarkdownFrontmatter } from '@promethean-os/markdown/frontmatter';
import type { Task } from './types.js';
import {
  NOW_ISO,
  fallbackFileBase,
  ensureLabelsPresent,
  sanitizeFileNameBase,
  resolveTaskSlug,
  isFallbackSlug,
} from './kanban-utils.js';

export type FM = Record<string, any>;

export const parseFrontmatter = (text: string): { fm: FM; body: string } => {
  const res = parseMarkdownFrontmatter<FM>(text);
  return { fm: (res.data ?? {}) as FM, body: res.content || '' };
};

const coerceString = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof value === 'number' || typeof value === 'bigint') {
    return String(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return undefined;
};

const pickString = (source: FM, keys: ReadonlyArray<string>): string | undefined => {
  for (const key of keys) {
    const candidate = coerceString((source as Record<string, unknown>)[key]);
    if (typeof candidate === 'string' && candidate.length > 0) {
      return candidate;
    }
  }
  return undefined;
};

const parseLabelList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => coerceString(entry))
      .filter((entry): entry is string => typeof entry === 'string')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }
  const text = coerceString(value);
  if (!text) {
    return [];
  }
  return text
    .split(/[\s,]+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

const mergeLabels = (...values: unknown[]): string[] => {
  const merged = new Set<string>();
  for (const value of values) {
    for (const entry of parseLabelList(value)) {
      merged.add(entry);
    }
  }
  return Array.from(merged);
};

const taskFromFM = (fm: FM, body: string): Task | null => {
  const uuid = pickString(fm, ['uuid', 'id', 'task-id', 'task_id', 'taskId']);
  const title = pickString(fm, ['title', 'name']);
  if (!uuid) return null;

  const finalTitle = title && title.trim().length > 0 ? title : fallbackFileBase(uuid);
  const slugValue = pickString(fm, ['slug']);
  const t: Task = {
    uuid,
    title: finalTitle,
    status: pickString(fm, ['status', 'state', 'column']) ?? String(fm.status ?? 'Todo'),
    priority: typeof fm.priority === 'number' ? fm.priority : pickString(fm, ['priority', 'prio']),
    labels: mergeLabels(fm.tags, fm.hashtags, fm.labels),
    created_at: fm.created_at ?? pickString(fm, ['created_at', 'created', 'txn']) ?? NOW_ISO(),
    estimates: fm.estimates ?? {},
    content: (body ?? '').trim() || undefined,
    slug: slugValue ? sanitizeFileNameBase(slugValue) : undefined,
  };
  return t;
};

const listFiles = async (dir: string): Promise<string[]> => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter((e) => e.isFile()).map((e) => `${dir}/${e.name}`);
  } catch {
    return [];
  }
};

export const normalizeFrontmatterForParsing = (raw: string): string => raw;

const quoteYamlString = (value: string | undefined | null): string => {
  if (typeof value === 'undefined' || value === null) {
    return '""';
  }
  return JSON.stringify(String(value));
};

const formatScalar = (value: unknown): string => {
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  return '""';
};

const formatLabels = (labels: ReadonlyArray<string> | undefined): string =>
  labels && labels.length > 0
    ? `[${labels.map((label) => JSON.stringify(label)).join(', ')}]`
    : '[]';

export const toFrontmatter = (t: Task): string => {
  const est = t.estimates ?? {};
  const lines: string[] = [
    '---',
    `uuid: ${quoteYamlString(t.uuid)}`,
    `title: ${quoteYamlString(t.title)}`,
  ];
  if (t.slug && t.slug.length > 0 && !isFallbackSlug(t.slug, t.uuid)) {
    lines.push(`slug: ${quoteYamlString(t.slug)}`);
  }
  lines.push(
    `status: ${quoteYamlString(t.status)}`,
    `priority: ${quoteYamlString(typeof t.priority === 'number' ? String(t.priority) : t.priority)}`,
    `labels: ${formatLabels(t.labels)}`,
    `created_at: ${quoteYamlString(t.created_at)}`,
    'estimates:',
    `  complexity: ${formatScalar(est.complexity)}`,
    `  scale: ${formatScalar(est.scale)}`,
    `  time_to_completion: ${formatScalar(est.time_to_completion)}`,
  );

  if (t.corrections && t.corrections.count > 0) {
    lines.push('corrections:');
    lines.push(`  count: ${t.corrections.count}`);
    lines.push('  history:');
    for (const correction of t.corrections.history) {
      lines.push('    -');
      lines.push(`      timestamp: ${quoteYamlString(correction.timestamp)}`);
      lines.push(`      from: ${quoteYamlString(correction.from)}`);
      lines.push(`      to: ${quoteYamlString(correction.to)}`);
      lines.push(`      reason: ${quoteYamlString(correction.reason)}`);
    }
  }

  if (t.lastCommitSha) {
    lines.push(`lastCommitSha: ${quoteYamlString(t.lastCommitSha)}`);
  }

  if (t.commitHistory && t.commitHistory.length > 0) {
    lines.push('commitHistory:');
    for (const commit of t.commitHistory) {
      lines.push('  -');
      lines.push(`    sha: ${quoteYamlString(commit.sha)}`);
      lines.push(`    timestamp: ${quoteYamlString(commit.timestamp)}`);
      lines.push(`    message: ${quoteYamlString(commit.message)}`);
      lines.push(`    author: ${quoteYamlString(commit.author)}`);
      lines.push(`    type: ${quoteYamlString(commit.type)}`);
    }
  }

  lines.push('---');

  const content = t.content?.trim();
  if (content) {
    lines.push('', content);
  }

  return lines.join('\n') + '\n';
};

const fallbackTaskFromRaw = (filePath: string, raw: string): Task | null => {
  if (!raw.startsWith('---')) {
    return null;
  }
  let cursor = 3;
  if (raw[cursor] === '\\r') {
    cursor += 1;
  }
  if (raw[cursor] === '\\n') {
    cursor += 1;
  }
  const closingIndexLF = raw.indexOf('\n---', cursor);
  const closingIndexCRLF = raw.indexOf('\r\n---', cursor);
  let boundaryIndex = closingIndexLF;
  let newlineLength = 1;
  if (closingIndexCRLF !== -1 && (closingIndexLF === -1 || closingIndexCRLF < closingIndexLF)) {
    boundaryIndex = closingIndexCRLF;
    newlineLength = 2;
  }
  if (boundaryIndex === -1) {
    return null;
  }
  const frontmatterContent = raw.slice(cursor, boundaryIndex);
  const bodyContent = raw.slice(boundaryIndex + newlineLength + 3);
  const getValue = (key: string): string | undefined => {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`^${escapedKey}\\s*:\\s*(.+)$`, 'im');
    const valueMatch = frontmatterContent.match(pattern);
    if (!valueMatch || valueMatch[1] == null) {
      return undefined;
    }
    return valueMatch[1];
  };

  const uuid = getValue('uuid');
  if (!uuid) {
    return null;
  }
  const baseName = path.basename(filePath, path.extname(filePath));
  const title = getValue('title') ?? sanitizeFileNameBase(baseName);
  const status = getValue('status') ?? 'Todo';
  const priority = getValue('priority');
  const labelsRaw = getValue('labels');
  const labels = labelsRaw
    ? labelsRaw
        .replace(/^\[/, '')
        .replace(/\]$/, '')
        .split(/[\s,]+/)
        .map((entry) => entry.replace(/^['"]|['"]$/g, '').trim())
        .filter((entry) => entry.length > 0)
    : [];
  const partialTask: Task = {
    uuid,
    title,
    status,
    priority,
    labels,
    created_at: getValue('created_at'),
    estimates: {},
    content: bodyContent.trim(),
  };
  const slug = resolveTaskSlug(partialTask, baseName);
  const baseTask: Task = {
    ...partialTask,
    slug,
    sourcePath: filePath,
  };
  return ensureLabelsPresent(baseTask, bodyContent);
};

export const readTasksFolder = async (dir: string): Promise<Task[]> => {
  const files = await listFiles(dir);
  const tasks: Task[] = [];
  for (const file of files) {
    if (!(file.endsWith('.md') || file.endsWith('.json'))) continue;
    const text = await fs.readFile(file, 'utf8');
    if (file.endsWith('.json')) {
      try {
        const data = JSON.parse(text);
        if (data && data.uuid && data.title) {
          const parsed = data as Task;
          const enriched = ensureLabelsPresent(parsed, parsed.content);
          const baseName = path.basename(file, path.extname(file));
          const normalizedSlug = resolveTaskSlug(enriched, baseName);
          tasks.push({ ...enriched, slug: normalizedSlug, sourcePath: file });
        }
      } catch {}
    } else {
      try {
        const normalized = normalizeFrontmatterForParsing(text);
        const { fm, body } = parseFrontmatter(normalized);
        const parsedTask = taskFromFM(fm, body);
        if (parsedTask) {
          const enriched = ensureLabelsPresent(parsedTask, body);
          const baseName = path.basename(file, path.extname(file));
          const normalizedSlug = resolveTaskSlug(enriched, baseName);
          tasks.push({ ...enriched, slug: normalizedSlug, sourcePath: file });
        }
      } catch (error) {
        console.error(
          `Failed to parse frontmatter for ${file}: ${error instanceof Error ? error.message : String(error)}`,
        );
        const fallback = fallbackTaskFromRaw(file, text);
        if (fallback) {
          tasks.push(fallback);
        }
      }
    }
  }
  return tasks;
};

export const resolveTaskFilePath = async (
  task: Task | undefined,
  tasksDir: string,
): Promise<string | undefined> => {
  if (!task) return undefined;
  if (!tasksDir) return undefined;
  if (task.sourcePath) {
    return task.sourcePath;
  }
  if (task.slug) {
    const candidate = path.join(tasksDir, `${task.slug}.md`);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {}
  }
  const tasks = await readTasksFolder(tasksDir).catch(() => [] as Task[]);
  const match = tasks.find((entry) => entry.uuid === task.uuid);
  return match?.sourcePath;
};
