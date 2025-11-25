import { Command } from 'commander';
import { loadKanbanConfig } from '../board/config.js';
import { printJSONL } from '../lib/jsonl.js';
import { printMarkdown } from '../lib/markdown-output.js';
import { processSync } from '../process/sync.js';
import { docguard } from '../process/docguard.js';
import {
  AVAILABLE_COMMANDS,
  CommandNotFoundError,
  CommandUsageError,
  executeCommand,
  type CliContext,
} from './command-handlers.js';
import { applyLegacyEnv } from './legacy.js';
import { loadCliExtensions } from './plugins.js';

const detectOutputType = (
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

const COMMAND_DESCRIPTIONS: Record<string, string> = {
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

const COMMAND_GROUPS: Record<string, { description: string; commands: string[] }> = {
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

const buildCommandToGroupMap = (): Map<string, string> => {
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

const registerCommand = (
  target: Command,
  name: string,
  context: CliContext,
  jsonRequested: boolean,
) => {
  const description = COMMAND_DESCRIPTIONS[name] || name;
  target
    .command(name)
    .argument('[args...]', 'Positional arguments for command')
    .description(description)
    .allowExcessArguments(true)
    .allowUnknownOption(true)
    .action(async (cmdArgs: string[] = []) => {
      try {
        const result = await executeCommand(name, cmdArgs, context);
        printResult(result, name, jsonRequested, cmdArgs);
      } catch (error) {
        if (error instanceof CommandUsageError || error instanceof CommandNotFoundError) {
          console.error(error.message);
          process.exitCode = 2;
          return;
        }
        throw error;
      }
    });
};

export const runCommanderCli = async (argv: string[]): Promise<void> => {
  const normalizedArgs = argv.slice(2);
  const jsonRequested = normalizedArgs.includes('--json');

  const { config, restArgs } = await loadKanbanConfig({
    argv: normalizedArgs,
    env: applyLegacyEnv(process.env),
  });

  const context: CliContext = {
    boardFile: config.boardFile,
    tasksDir: config.tasksDir,
    argv: normalizedArgs,
  };

  const program = new Command();
  program.name('kanban');
  program.option('--board-file <path>', 'Path to board file', config.boardFile);
  program.option('--tasks-dir <path>', 'Path to tasks directory', config.tasksDir);
  program.option('--json', 'Output JSONL', jsonRequested);
  program.allowExcessArguments(true);
  program.allowUnknownOption(true);
  program.showHelpAfterError();

  const commandToGroup = buildCommandToGroupMap();
  const groupCommands = new Map<string, Command>();
  for (const group of Object.keys(COMMAND_GROUPS)) {
    const groupCmd = program
      .command(group)
      .description(`${group} commands`)
      .allowExcessArguments(true)
      .allowUnknownOption(true);
    groupCommands.set(group, groupCmd);
  }

  const coreCommands = new Set<string>([...AVAILABLE_COMMANDS, 'init']);
  for (const name of coreCommands) {
    const group = commandToGroup.get(name);
    // Root alias
    registerCommand(program, name, context, jsonRequested);
    // Grouped alias
    if (group) {
      const target = groupCommands.get(group);
      if (target) {
        registerCommand(target, name, context, jsonRequested);
      }
    }
  }

  // Process-specific commands stay as dedicated handlers
  const processGroup = groupCommands.get('process');
  const attachProcess = (target: Command | undefined) => {
    if (!target) return;
    target
      .command('process_sync')
      .description('Synchronize processes from configuration')
      .action(async () => {
        const res = await processSync({
          processFile: process.env.KANBAN_PROCESS_FILE,
          owner: process.env.GITHUB_OWNER,
          repo: process.env.GITHUB_REPO,
          token: process.env.GITHUB_TOKEN,
        });
        printJSONL(res);
      });

    target
      .command('doccheck')
      .description('Run documentation guard for a PR')
      .argument('[pr]', 'Pull request number')
      .action(async (prArg?: string) => {
        const pr = prArg || process.env.PR_NUMBER;
        await docguard({
          pr,
          owner: process.env.GITHUB_OWNER,
          repo: process.env.GITHUB_REPO,
          token: process.env.GITHUB_TOKEN,
        });
      });
  };

  attachProcess(program);
  attachProcess(processGroup);

  // Plugin-based CLI extensions
  await loadCliExtensions(program, context, jsonRequested);

  program.exitOverride();
  try {
    await program.parseAsync(['node', 'kanban', ...restArgs], { from: 'user' });
  } catch (error: any) {
    if (error?.code === 'commander.unknownCommand' || error?.code === 'commander.helpDisplayed') {
      process.exitCode = 1;
      return;
    }
    throw error;
  }
};
