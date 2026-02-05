import path from 'node:path';
import { mkdir, writeFile, readdir } from 'node:fs/promises';

import test from 'ava';

import { createTask } from '../lib/kanban.js';
import { withTempDir, makeBoard } from '../test-utils/helpers.js';

// Avoid expensive index refresh during unit tests
process.env.KANBAN_SKIP_INDEX = '1';

const TIMEOUT_MS = 120_000;

// Skipped temporarily: createTask duplicate handling times out under coverage; track in spec/test-timeouts.md.
test.serial('bulk import operations do not create duplicates', async (t) => {
  t.timeout(TIMEOUT_MS);
  const tempDir = await withTempDir(t);
  const boardPath = path.join(tempDir, 'board.md');
  const tasksDir = path.join(tempDir, 'tasks');
  await mkdir(tasksDir, { recursive: true });
  await writeFile(boardPath, '', 'utf8');

  const board = makeBoard([]);

  // Simulate bulk import of tasks with potential duplicates
  const bulkTasks = [
    { title: 'Import Task 1', content: 'Content 1' },
    { title: 'Import Task 2', content: 'Content 2' },
    { title: 'Import Task 1', content: 'Duplicate Content 1' }, // Duplicate
    { title: 'Import Task 3', content: 'Content 3' },
    { title: 'import task 2', content: 'Case Insensitive Duplicate' }, // Case-insensitive duplicate
    { title: '  Import Task 3  ', content: 'Whitespace Duplicate' }, // Whitespace duplicate
  ];

  // Import all tasks
  const createdTasks: any[] = [];
  for (const taskData of bulkTasks) {
    const task = await createTask(board, 'incoming', taskData, tasksDir, boardPath);
    createdTasks.push(task);
  }

  // Should only have 3 unique tasks
  const files = await readdir(tasksDir);
  const taskFiles = files.filter((file) => file.endsWith('.md'));
  t.is(taskFiles.length, 3, 'Should only create 3 unique task files');

  // Verify unique tasks
  const uniqueTitles = new Set(createdTasks.map((task) => task.title.toLowerCase().trim()));
  t.is(uniqueTitles.size, 3, 'Should have 3 unique task titles');

  // Verify first occurrence is preserved
  const task1 = createdTasks.find((t) => t.title.toLowerCase().trim() === 'import task 1');
  const task2 = createdTasks.find((t) => t.title.toLowerCase().trim() === 'import task 2');
  const task3 = createdTasks.find((t) => t.title.toLowerCase().trim() === 'import task 3');

  t.true(
    task1?.content?.includes('## ⛓️ Blocked By') ?? false,
    'First task should have Blocked By section',
  );
  t.true(
    task2?.content?.includes('Content 2') ?? false,
    'Second task should contain original content',
  );
  t.true(
    task2?.content?.includes('## ⛓️ Blocked By') ?? false,
    'Second task should have Blocked By section',
  );
  t.true(
    task3?.content?.includes('Content 3') ?? false,
    'Third task should contain original content',
  );
  t.true(
    task3?.content?.includes('## ⛓️ Blocked By') ?? false,
    'Third task should have Blocked By section',
  );
});

// Skipped temporarily: cross-column duplicate createTask timing out; track in spec/test-timeouts.md.
test.serial('bulk import with allowed columns still permits duplicate titles', async (t) => {
  t.timeout(TIMEOUT_MS);
  const tempDir = await withTempDir(t);
  const boardPath = path.join(tempDir, 'board.md');
  const tasksDir = path.join(tempDir, 'tasks');
  await mkdir(tasksDir, { recursive: true });
  await writeFile(boardPath, '', 'utf8');

  const board = makeBoard([]);

  console.log('second test before first create');
  // Create first task in incoming
  const task1 = await createTask(
    board,
    'incoming',
    { title: 'Cross-Column Task', content: 'Incoming content' },
    tasksDir,
    boardPath,
  );
  console.log('second test after first create');

  // Create second task in icebox with same title
  console.log('second test before second create');
  const task2 = await createTask(
    board,
    'icebox',
    { title: 'Cross-Column Task', content: 'Icebox content' },
    tasksDir,
    boardPath,
  );
  console.log('second test after second create');

  // Basic checks - tasks should exist and have different UUIDs
  t.truthy(task1, 'First task should exist');
  t.truthy(task2, 'Second task should exist');
  t.not(task1.uuid, task2.uuid, 'Tasks should have different UUIDs');
  t.is(task1.title, task2.title, 'Tasks should have same title');
  t.is(task1.status, 'incoming', 'First task should be in incoming');
  t.is(task2.status, 'icebox', 'Second task should be in icebox');
});
