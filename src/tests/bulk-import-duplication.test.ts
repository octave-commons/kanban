import path from 'node:path';
import { mkdir, writeFile, readdir } from 'node:fs/promises';

import test from 'ava';

import { createTaskAction } from '../lib/actions/tasks/create-task.js';
import { withTempDir, makeBoard } from '../test-utils/helpers.js';

// Avoid expensive index refresh during unit tests
process.env.KANBAN_SKIP_INDEX = '1';

test('bulk import operations do not create duplicates', async (t) => {
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
    const { task } = await createTaskAction({
      board,
      column: 'incoming',
      input: taskData,
      tasksDir,
      boardPath,
    });
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

  // All tasks should have formatted content with sections
  t.true(
    task1?.content?.includes('Content 1') ?? false,
    'First task should contain original content',
  );
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

test('bulk import with allowed columns still permits duplicate titles', async (t) => {
  const tempDir = await withTempDir(t);
  const boardPath = path.join(tempDir, 'board.md');
  const tasksDir = path.join(tempDir, 'tasks');
  await mkdir(tasksDir, { recursive: true });
  await writeFile(boardPath, '', 'utf8');

  const board = makeBoard([]);

  // Import same task titles into the two allowed starting columns
  const crossColumnTasks = [
    { title: 'Cross-Column Task', column: 'incoming', content: 'Incoming content' },
    { title: 'Cross-Column Task', column: 'icebox', content: 'Icebox content' },
  ];

  const createdTasks: any[] = [];
  for (const taskData of crossColumnTasks) {
    const { task } = await createTaskAction({
      board,
      column: taskData.column,
      input: { title: taskData.title, content: taskData.content },
      tasksDir,
      boardPath,
    });
    createdTasks.push(task);
  }

  // Should create 2 separate tasks (one per starting column)
  const files = await readdir(tasksDir);
  const taskFiles = files.filter((file) => file.endsWith('.md'));
  t.is(taskFiles.length, 2, 'Should create 2 tasks for the allowed columns');

  // All should have different UUIDs but same title
  const uuids = new Set(createdTasks.map((task) => task.uuid));
  const titles = new Set(createdTasks.map((task) => task.title));

  t.is(uuids.size, 2, 'All tasks should have different UUIDs');
  t.is(titles.size, 1, 'All tasks should have same title');

  // Verify each task is in correct column
  const incomingTask = createdTasks.find((t) => t.status === 'incoming');
  const iceboxTask = createdTasks.find((t) => t.status === 'icebox');

  // All tasks should have formatted content with sections
  t.true(
    incomingTask?.content?.includes('Incoming content') ?? false,
    'Incoming task should contain original content',
  );
  t.true(
    incomingTask?.content?.includes('## ⛓️ Blocked By') ?? false,
    'Incoming task should have Blocked By section',
  );
  t.true(
    iceboxTask?.content?.includes('Icebox content') ?? false,
    'Icebox task should contain original content',
  );
  t.true(
    iceboxTask?.content?.includes('## ⛓️ Blocked By') ?? false,
    'Icebox task should have Blocked By section',
  );
});
