import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

import test from 'ava';

import { runCommanderCli } from '../cli/commander.js';
import { makeTask, withTempDir, writeTaskFile } from '../test-utils/helpers.js';

process.env.KANBAN_SKIP_INDEX = '1';

const writeConfig = async (filePath: string, overrides: Record<string, unknown>): Promise<void> => {
  const payload = {
    tasksDir: 'tasks',
    indexFile: '',
    boardFile: 'boards/board.md',
    cachePath: 'cache',
    exts: ['.md'],
    requiredFields: ['title', 'status', 'priority'],
    statusValues: ['incoming', 'review'],
    priorityValues: ['P0', 'P1', 'P2', 'P3'],
    wipLimits: { incoming: 5, review: 2 },
    ...overrides,
  };
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
};

test('CLI regeneration respects board path from kanban config', async (t) => {
  t.timeout(60_000);
  const tempDir = await withTempDir(t);
  const repoRoot = path.join(tempDir, 'repo');
  const tasksDir = path.join(repoRoot, 'custom', 'tasks');
  const boardPath = path.join(repoRoot, 'custom', 'boards', 'board.md');
  await mkdir(tasksDir, { recursive: true });
  await writeFile(path.join(repoRoot, 'pnpm-workspace.yaml'), 'packages: []\n', 'utf8');

  await writeConfig(path.join(repoRoot, 'promethean.kanban.json'), {
    tasksDir: path.relative(repoRoot, tasksDir),
    boardFile: path.relative(repoRoot, boardPath),
    statusValues: ['incoming'],
  });

  await writeTaskFile(
    tasksDir,
    makeTask({ uuid: 'cli-regen-1', title: 'CLI Task', status: 'incoming' }),
  );

  await runCommanderCli(['node', 'kanban', 'regenerate'], { cwd: repoRoot, env: {} });

  const boardContent = await readFile(boardPath, 'utf8');
  t.regex(boardContent, /CLI Task/);
});

test('CLI resolves config relative paths when executed from nested directories', async (t) => {
  t.timeout(60_000);
  const tempDir = await withTempDir(t);
  const repoRoot = path.join(tempDir, 'repo');
  const nestedDir = path.join(repoRoot, 'packages', 'nested');
  const configDir = path.join(repoRoot, 'configs');
  const configPath = path.join(configDir, 'promethean.kanban.json');
  const tasksDir = path.join(configDir, 'data', 'tasks');
  const boardPath = path.join(configDir, 'data', 'boards', 'generated.md');

  await mkdir(nestedDir, { recursive: true });
  await mkdir(tasksDir, { recursive: true });
  await writeFile(path.join(repoRoot, 'pnpm-workspace.yaml'), 'packages: []\n', 'utf8');

  await writeConfig(configPath, {
    tasksDir: 'data/tasks',
    boardFile: 'data/boards/generated.md',
    statusValues: ['review'],
  });

  await writeTaskFile(
    tasksDir,
    makeTask({ uuid: 'cli-regen-2', title: 'Nested CLI Task', status: 'review' }),
  );

  await runCommanderCli(['node', 'kanban', 'regenerate'], {
    cwd: nestedDir,
    env: { KANBAN_CONFIG: path.relative(nestedDir, configPath) },
  });

  const boardContent = await readFile(boardPath, 'utf8');
  t.regex(boardContent, /Nested CLI Task/);
});
