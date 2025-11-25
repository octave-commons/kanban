import type { Command } from 'commander';
import { executeCommand, type CliContext } from './command-handlers.js';

export type CliExecutor = (command: string, args: string[]) => Promise<unknown>;

export type CliExtension = (opts: {
  program: Command;
  context: CliContext;
  execute: CliExecutor;
  jsonRequested: boolean;
}) => Promise<void> | void;

const EXTENSION_MODULES = ['@promethean-os/kanban-plugin-heal', './extensions/advanced.js'];

export const loadCliExtensions = async (
  program: Command,
  context: CliContext,
  jsonRequested: boolean,
): Promise<void> => {
  const execute: CliExecutor = async (command, args) => executeCommand(command, args, context);

  for (const mod of EXTENSION_MODULES) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const imported = await import(mod);
      const register = (imported as any)?.registerCli as CliExtension | undefined;
      if (typeof register === 'function') {
        await register({ program, context, execute, jsonRequested });
      }
    } catch (error) {
      // Extension is optional; log quietly for debugging if needed
      if (process.env.KANBAN_DEBUG_EXTENSIONS === 'true') {
        console.error(`Failed to load CLI extension ${mod}:`, error);
      }
    }
  }
};
