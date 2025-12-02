import test from 'ava';
import { Command } from 'commander';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { loadCliExtensions, type CliExecutor } from '../cli/plugins.js';
import type { CliContext } from '../cli/command-handlers.js';
import { withTempDir } from '../test-utils/helpers.js';

type PluginFixture = {
  specifier: string;
  entryUrl: string;
  commandName: string;
};

const buildImporter = (specMap: Map<string, string>) => async (specifier: string) => {
  const target = specMap.get(specifier);
  if (!target) {
    throw new Error(`Missing plugin fixture for ${specifier}`);
  }
  return import(target);
};

const createPluginFixture = async (
  root: string,
  name: string,
  options: {
    asPackage?: boolean;
    specifier?: string;
    commandName?: string;
    skipExecute?: boolean;
  } = {},
): Promise<PluginFixture> => {
  const asPackage = options.asPackage ?? false;
  const commandName = options.commandName ?? `${name}-cmd`;
  const skipExecute = options.skipExecute ?? false;
  const specifier =
    options.specifier ??
    (asPackage ? name : pathToFileURL(path.join(root, 'extensions', `${name}.mjs`)).href);
  const baseDir = asPackage
    ? path.join(root, 'node_modules', name)
    : path.join(root, 'extensions', name);

  await mkdir(baseDir, { recursive: true });
  const entryPath = path.join(baseDir, 'index.mjs');

  if (asPackage) {
    await writeFile(
      path.join(baseDir, 'package.json'),
      JSON.stringify({ name, version: '0.0.0-test', type: 'module', main: './index.mjs' }),
      'utf8',
    );
  }

  const moduleSource = `
export const registrations = [];
export async function registerCli({ program, context, execute, jsonRequested }) {
  registrations.push({ context, jsonRequested, commandCount: program.commands.length });
  program.command('${commandName}').action(() => execute('${commandName}', ['from-${name}']));
  ${skipExecute ? '' : "await execute('register-call', ['" + name + "']);"}
}
`;

  await writeFile(entryPath, moduleSource, 'utf8');

  return { specifier, entryUrl: pathToFileURL(entryPath).href, commandName };
};

const createNonRegisteringPlugin = async (
  root: string,
  specifier: string,
): Promise<PluginFixture> => {
  const baseDir = path.join(root, 'extensions', specifier.replace(/[^a-zA-Z0-9_-]/g, ''));
  await mkdir(baseDir, { recursive: true });
  const entryPath = path.join(baseDir, 'index.mjs');
  await writeFile(entryPath, 'export const noop = true;\n', 'utf8');
  return { specifier, entryUrl: pathToFileURL(entryPath).href, commandName: 'noop' };
};

test('loadCliExtensions loads package and extension plugins with provided importer', async (t) => {
  const tempDir = await withTempDir(t);
  const context: CliContext = {
    boardFile: path.join(tempDir, 'board.md'),
    tasksDir: path.join(tempDir, 'tasks'),
    argv: ['--json'],
  };

  const packagePlugin = await createPluginFixture(tempDir, 'fixture-package', { asPackage: true });
  const extensionPlugin = await createPluginFixture(tempDir, 'fixture-extension', {
    specifier: './extensions/fixture-extension.mjs',
  });

  const specMap = new Map<string, string>([
    [packagePlugin.specifier, packagePlugin.entryUrl],
    [extensionPlugin.specifier, extensionPlugin.entryUrl],
  ]);
  const importer = buildImporter(specMap);

  const executed: Array<{ command: string; args: string[] }> = [];
  const executor: CliExecutor = async (command, args) => {
    executed.push({ command, args });
    return null;
  };

  const program = new Command();
  await loadCliExtensions(program, context, true, {
    modules: [packagePlugin.specifier, extensionPlugin.specifier],
    importer,
    executor,
  });

  const packageModule = await import(packagePlugin.entryUrl);
  const extensionModule = await import(extensionPlugin.entryUrl);

  t.is(packageModule.registrations.length, 1);
  t.is(extensionModule.registrations.length, 1);
  t.is(executed.length, 2);
  t.true(executed.every((entry) => entry.command === 'register-call'));
  t.truthy(program.commands.find((cmd) => cmd.name() === packagePlugin.commandName));
  t.truthy(program.commands.find((cmd) => cmd.name() === extensionPlugin.commandName));
  t.true(packageModule.registrations[0].jsonRequested);
  t.is(packageModule.registrations[0].context.boardFile, context.boardFile);
});

test('loadCliExtensions skips modules without registerCli and continues loading others', async (t) => {
  const tempDir = await withTempDir(t);
  const context: CliContext = {
    boardFile: path.join(tempDir, 'board.md'),
    tasksDir: path.join(tempDir, 'tasks'),
    argv: [],
  };

  const invalidPlugin = await createNonRegisteringPlugin(tempDir, './extensions/no-register.mjs');
  const validPlugin = await createPluginFixture(tempDir, 'valid-plugin', { asPackage: true });

  const specMap = new Map<string, string>([
    [invalidPlugin.specifier, invalidPlugin.entryUrl],
    [validPlugin.specifier, validPlugin.entryUrl],
  ]);
  const importer = buildImporter(specMap);

  const executed: Array<string> = [];
  const executor: CliExecutor = async (command) => {
    executed.push(command);
    return null;
  };

  const program = new Command();
  await loadCliExtensions(program, context, false, {
    modules: [invalidPlugin.specifier, validPlugin.specifier],
    importer,
    executor,
  });

  const validModule = await import(validPlugin.entryUrl);

  t.is(validModule.registrations.length, 1);
  t.deepEqual(executed, ['register-call']);
  t.truthy(program.commands.find((cmd) => cmd.name() === validPlugin.commandName));
});

test('loadCliExtensions logs failures when debug flag is enabled', async (t) => {
  const context: CliContext = { boardFile: '/tmp/board.md', tasksDir: '/tmp/tasks', argv: [] };
  const program = new Command();

  const errors: string[] = [];
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    errors.push(args.join(' '));
  };
  process.env.KANBAN_DEBUG_EXTENSIONS = 'true';

  try {
    await loadCliExtensions(program, context, false, {
      modules: ['missing-plugin'],
      importer: async () => {
        throw new Error('boom');
      },
      executor: async () => null,
    });
  } finally {
    console.error = originalError;
    delete process.env.KANBAN_DEBUG_EXTENSIONS;
  }

  t.true(errors.some((msg) => msg.includes('missing-plugin')));
  t.is(program.commands.length, 0);
});
