import { Command } from 'commander';
import { loadKanbanConfig } from '../board/config.js';
import { printJSONL } from '../lib/jsonl.js';
import { processSync } from '../process/sync.js';
import { docguard } from '../process/docguard.js';
import {
  AVAILABLE_COMMANDS,
  executeCommand,
  type CliContext,
} from './command-handlers.js';
import {
  BASIC_COMMANDS,
  COMMAND_GROUPS,
  buildCommandToGroupMap,
  registerCommand,
} from './command-registry.js';
import { applyLegacyEnv } from './legacy.js';
import { loadCliExtensions } from './plugins.js';

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

  const coreCommands = new Set<string>(['init', ...BASIC_COMMANDS]);
  for (const name of coreCommands) {
    const group = commandToGroup.get(name);
    // Root alias
    registerCommand(program, name, context, jsonRequested, executeCommand);
    // Grouped alias
    if (group) {
      const target = groupCommands.get(group);
      if (target) {
        registerCommand(target, name, context, jsonRequested, executeCommand);
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
