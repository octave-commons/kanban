import { loadBoard } from '../../lib/kanban.js';
import type { Board } from '../../lib/types.js';
import type { CliContext } from '../types.js';
import { CommandUsageError } from '../errors.js';

export const requireArg = (value: string | undefined, label: string): string => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  throw new CommandUsageError(`Missing required ${label}.`);
};

export const parsePort = (value: string): number => {
  const trimmed = value.trim();
  const port = Number.parseInt(trimmed, 10);
  if (!Number.isInteger(port) || port <= 0 || port > 65_535) {
    throw new CommandUsageError(`Invalid port: ${value}`);
  }
  return port;
};

export const withBoard = async <T>(
  context: CliContext,
  effect: (board: Board) => Promise<T> | T,
): Promise<T> => {
  const board = await loadBoard(context.boardFile, context.tasksDir);
  return effect(board as Board);
};
