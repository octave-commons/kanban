import { promises as fs } from 'node:fs';
import { loadKanbanConfig } from '../board/config.js';
import type { Board, ColumnData, Task } from './types.js';
import { parseColumnsFromMarkdown } from './board-serialization.js';
import { readTasksFolder } from './task-files.js';
import { columnKey, normalizeColumnDisplayName } from './kanban-utils.js';

export const loadBoard = async (boardPath: string, tasksDir: string): Promise<Board> => {
  const { config } = await loadKanbanConfig();

  const md = await fs.readFile(boardPath, 'utf8').catch(() => '');
  const columns = parseColumnsFromMarkdown(md);
  if (columns.length > 0) {
    const enhancedColumns = columns.map((column) => ({
      ...column,
      limit: column.limit || config.wipLimits[column.name] || null,
    }));
    return { columns: enhancedColumns } as Board;
  }

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
  const cols: ColumnData[] = Array.from(statusGroups.values()).map(({ name, tasks: ts }) => ({
    name,
    count: ts.length,
    limit: config.wipLimits[name] || null,
    tasks: ts,
  }));
  return { columns: cols };
};

export const countTasks = (board: Board, column?: string): number => {
  if (!column) return board.columns.reduce((acc, c) => acc + c.count, 0);
  const targetKey = columnKey(column);
  const c = board.columns.find((col) => columnKey(col.name) === targetKey);
  return c ? c.count : 0;
};

export const getColumn = (board: Board, column: string): ColumnData => {
  const targetKey = columnKey(column);
  const c = board.columns.find((col) => columnKey(col.name) === targetKey);
  if (c) {
    c.name = normalizeColumnDisplayName(c.name);
    return c;
  }
  return {
    name: normalizeColumnDisplayName(column),
    count: 0,
    limit: null,
    tasks: [],
  };
};

export const getTasksByColumn = (board: Board, column: string): Task[] =>
  getColumn(board, column).tasks;

export const findTaskById = (board: Board, uuid: string): Task | undefined => {
  for (const col of board.columns) {
    const t = col.tasks.find((task) => task.uuid === uuid);
    if (t) return t;
  }
  return undefined;
};

export const findTaskByTitle = (board: Board, title: string): Task | undefined => {
  const needle = title.trim().toLowerCase();
  for (const col of board.columns) {
    const t = col.tasks.find((task) => task.title.trim().toLowerCase() === needle);
    if (t) return t;
  }
  return undefined;
};
