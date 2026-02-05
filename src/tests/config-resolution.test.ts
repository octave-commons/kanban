import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

import test from 'ava';

import { loadKanbanConfig } from '../board/config.js';
import { withTempDir } from '../test-utils/helpers.js';

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

test('loadKanbanConfig resolves repo root from nested package directories', async (t) => {
  const tempDir = await withTempDir(t);
  const repoRoot = path.join(tempDir, 'repo');
  const nestedDir = path.join(repoRoot, 'cli', 'kanban');
  await mkdir(nestedDir, { recursive: true });
  await writeFile(path.join(repoRoot, 'pnpm-workspace.yaml'), 'packages: []\n', 'utf8');
  await writeConfig(path.join(repoRoot, 'promethean.kanban.json'), {});

  const { config } = await loadKanbanConfig({ argv: [], env: {}, cwd: nestedDir });
  t.is(config.repo, repoRoot);
  t.is(config.tasksDir, path.join(repoRoot, 'tasks'));
  t.is(config.boardFile, path.join(repoRoot, 'boards', 'board.md'));
});

test('loadKanbanConfig resolves config-relative paths when invoked from nested directories', async (t) => {
  const tempDir = await withTempDir(t);
  const repoRoot = path.join(tempDir, 'repo');
  const nestedDir = path.join(repoRoot, 'packages', 'nested');
  const configPath = path.join(repoRoot, 'configs', 'promethean.kanban.json');
  await mkdir(nestedDir, { recursive: true });
  await writeFile(path.join(repoRoot, 'pnpm-workspace.yaml'), 'packages: []\n', 'utf8');
  await writeConfig(configPath, {
    tasksDir: 'docs/tasks',
    boardFile: 'docs/boards/generated.md',
  });

  const relativeConfigPath = path.relative(nestedDir, configPath);
  const { config } = await loadKanbanConfig({
    argv: [],
    env: { KANBAN_CONFIG: relativeConfigPath },
    cwd: nestedDir,
  });

  t.is(config.repo, repoRoot);
  t.is(config.tasksDir, path.join(path.dirname(configPath), 'docs', 'tasks'));
  t.is(config.boardFile, path.join(path.dirname(configPath), 'docs', 'boards', 'generated.md'));
});
