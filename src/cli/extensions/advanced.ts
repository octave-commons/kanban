import { Command } from 'commander';
import { AVAILABLE_COMMANDS } from '../command-handlers.js';
import {
  BASIC_COMMANDS,
  COMMAND_GROUPS,
  buildCommandToGroupMap,
  registerCommand,
} from '../command-registry.js';
import type { CliExtension } from '../plugins.js';

const ensureGroupCommands = (program: Command): Map<string, Command> => {
  const groupCommands = new Map<string, Command>();
  for (const group of Object.keys(COMMAND_GROUPS)) {
    const existing = program.commands.find((cmd) => cmd.name() === group);
    const groupCmd =
      existing ??
      program
        .command(group)
        .description(`${group} commands`)
        .allowExcessArguments(true)
        .allowUnknownOption(true);
    groupCommands.set(group, groupCmd);
  }
  return groupCommands;
};

export const registerCli: CliExtension = async ({ program, context, execute, jsonRequested }) => {
  const commandToGroup = buildCommandToGroupMap();
  const groupCommands = ensureGroupCommands(program);
  const advancedCommands = AVAILABLE_COMMANDS.filter((cmd) => !BASIC_COMMANDS.has(cmd));

  const makeExecutor = (ctx: CliContext) =>
    (cmd: string, args: ReadonlyArray<string>) => execute(cmd, [...args], ctx) as Promise<unknown>;
  const executor = makeExecutor(context);

  for (const name of advancedCommands) {
    const group = commandToGroup.get(name);
    registerCommand(program, name, jsonRequested, executor);
    if (group) {
      const target = groupCommands.get(group);
      if (target) {
        registerCommand(target, name, jsonRequested, executor);
      }
    }
  }
};
