import { Command } from 'commander';
import { printJSONL } from '../lib/jsonl.js';
import { printMarkdown } from '../lib/markdown-output.js';
import type { CliContext } from './types.js';

export const detectOutputType = (
  cmd: string,
): 'task' | 'tasks' | 'board' | 'search' | 'count' | 'audit' | 'table' => {
  switch (cmd) {
    case 'find':
      return 'task';
    case 'list':
    case 'pull':
    case 'push':
    case 'sync':
      return 'tasks';
    case 'regenerate':
    case 'ui':
      return 'board';
    case 'search':
      return 'search';
    case 'count':
      return 'count';
    case 'audit':
      return 'audit';
    default:
      return 'table';
  }
};

export const COMMAND_DESCRIPTIONS: Record<string, string> = {
  push: 'Push board state to task files',
  pull: 'Pull task file state to board',
  sync: 'Bidirectional sync with conflict detection',
  regenerate: 'Regenerate board from task files',
  count: 'Count tasks in columns',
  audit: 'Audit board consistency',
  find: 'Find task by UUID',
  search: 'Search tasks by content',
  list: 'List tasks with status',
  create: 'Create new task',
  update: 'Update existing task',
  delete: 'Delete task',
  heal: 'Heal board issues with git tag management',
  ui: 'Start web UI',
  dev: 'Start development server',
  init: 'Initialize a new kanban project',
  'enforce-wip-limits': 'Enforce WIP limits and move excess tasks',
  'wip-monitor': 'Real-time capacity monitoring',
  'wip-compliance': 'Generate WIP compliance reports',
  'wip-violations': 'View WIP violation history',
  'wip-suggestions': 'Get WIP capacity balancing suggestions',
};

export const COMMAND_GROUPS: Record<string, { description: string; commands: string[] }> = {
  board: {
    description: 'Board operations',
    commands: ['push', 'pull', 'sync', 'regenerate', 'count', 'audit', 'ui', 'dev'],
  },
  task: {
    description: 'Task operations',
    commands: ['create', 'update', 'delete', 'list', 'find', 'search'],
  },
  heal: {
    description: 'Healing and scar operations',
    commands: ['heal'],
  },
  wip: {
    description: 'Work-in-progress management',
    commands: [
      'enforce-wip-limits',
      'wip-monitor',
      'wip-compliance',
      'wip-violations',
      'wip-suggestions',
    ],
  },
};

export const BASIC_COMMANDS = new Set<string>([
  'push',
  'pull',
  'sync',
  'regenerate',
  'count',
  'list',
  'find',
  'update',
  'update_status',
  'update-status',
  'move_up',
  'move_down',
]);

export const buildCommandToGroupMap = (): Map<string, string> => {
  const map = new Map<string, string>();
  for (const [group, { commands }] of Object.entries(COMMAND_GROUPS)) {
    for (const cmd of commands) {
      map.set(cmd, group);
    }
  }
  return map;
};

const printResult = (
  result: unknown,
  cmd: string,
  jsonRequested: boolean,
  args: ReadonlyArray<string>,
): void => {
  if (typeof result === 'undefined' || result === null) return;
  if (jsonRequested) {
    printJSONL(result);
  } else {
    printMarkdown(result, detectOutputType(cmd), { query: args[0] || '' });
  }
};

export const registerCommand = (
  target: Command,
  name: string,
  context: CliContext,
  jsonRequested: boolean,
  executor: (command: string, args: ReadonlyArray<string>) => Promise<unknown>,
): void => {
  const description = COMMAND_DESCRIPTIONS[name] || name;
  target
    .command(name)
    .argument('[args...]', 'Positional arguments for command')
    .description(description)
    .allowExcessArguments(true)
    .allowUnknownOption(true)
    .action(async (cmdArgs: string[] = []) => {
      try {
        const result = await executor(name, cmdArgs, context);
        printResult(result, name, jsonRequested, cmdArgs);
      } catch (error) {
        // Avoid importing CommandUsageError/CommandNotFoundError to keep this helper lightweight
        const message = (error as Error | undefined)?.message;
        if (message) {
          console.error(message);
          process.exitCode = 2;
          return;
        }
        throw error;
      }
    });
};
