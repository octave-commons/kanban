import test from 'ava';
import path from 'node:path';
import { writeFile, mkdir, readFile } from 'node:fs/promises';

import { executeCommand, type CliContext } from '../cli/command-handlers.js';
import { withTempDir } from '../test-utils/helpers.js';

test('move_up - multiple moves in sequence', async (t) => {
  const tempDir = await withTempDir(t);
  const boardPath = path.join(tempDir, 'board.md');
  const tasksDir = path.join(tempDir, 'tasks');

  await mkdir(tasksDir, { recursive: true });
  await writeFile(boardPath, '', 'utf8');

  const context: CliContext = {
    boardFile: boardPath,
    tasksDir,
    argv: [],
  };

  // Create 5 tasks
  await executeCommand('create', ['Task 1', '--status=incoming'], context);
  await executeCommand('create', ['Task 2', '--status=incoming'], context);
  await executeCommand('create', ['Task 3', '--status=incoming'], context);
  await executeCommand('create', ['Task 4', '--status=incoming'], context);
  const task5 = (await executeCommand('create', ['Task 5', '--status=incoming'], context)) as any;

  // Move task5 up multiple times to get to position 0
  const result1 = (await executeCommand('move_up', [task5.uuid], context)) as any;
  t.truthy(result1);
  t.is(result1.rank, 3); // Should move from position 4 to 3

  const result2 = (await executeCommand('move_up', [task5.uuid], context)) as any;
  t.truthy(result2);
  t.is(result2.rank, 2); // Should move from position 3 to 2

  const result3 = (await executeCommand('move_up', [task5.uuid], context)) as any;
  t.truthy(result3);
  t.is(result3.rank, 1); // Should move from position 3 to 2

  const result4 = (await executeCommand('move_up', [task5.uuid], context)) as any;
  t.truthy(result4);
  t.is(result4.rank, 0); // Should move from position 1 to 0

  // Moving up again should be no-op
  const result5 = (await executeCommand('move_up', [task5.uuid], context)) as any;
  t.truthy(result5);
  t.is(result5.rank, 0); // Should still be at position 0
});

test('move_down - multiple moves in sequence', async (t) => {
  const tempDir = await withTempDir(t);
  const boardPath = path.join(tempDir, 'board.md');
  const tasksDir = path.join(tempDir, 'tasks');

  await mkdir(tasksDir, { recursive: true });
  await writeFile(boardPath, '', 'utf8');

  const context: CliContext = {
    boardFile: boardPath,
    tasksDir,
    argv: [],
  };

  // Create 5 tasks
  const task1 = (await executeCommand('create', ['Task 1', '--status=incoming'], context)) as any;
  await executeCommand('create', ['Task 2', '--status=incoming'], context);
  await executeCommand('create', ['Task 3', '--status=incoming'], context);
  await executeCommand('create', ['Task 4', '--status=incoming'], context);
  await executeCommand('create', ['Task 5', '--status=incoming'], context);

  // Move task1 down multiple times to get to position 4
  const result1 = (await executeCommand('move_down', [task1.uuid], context)) as any;
  t.truthy(result1);
  t.is(result1.rank, 1); // Should move from position 0 to 1

  const result2 = (await executeCommand('move_down', [task1.uuid], context)) as any;
  t.truthy(result2);
  t.is(result2.rank, 2); // Should move from position 1 to 2

  const result3 = (await executeCommand('move_down', [task1.uuid], context)) as any;
  t.truthy(result3);
  t.is(result3.rank, 3); // Should move from position 2 to 3

  const result4 = (await executeCommand('move_down', [task1.uuid], context)) as any;
  t.truthy(result4);
  t.is(result4.rank, 4); // Should move from position 3 to 4

  // Moving down again should be no-op
  const result5 = (await executeCommand('move_down', [task1.uuid], context)) as any;
  t.truthy(result5);
  t.is(result5.rank, 4); // Should still be at position 4
});

test('move operations - tasks across different columns', async (t) => {
  const tempDir = await withTempDir(t);
  const boardPath = path.join(tempDir, 'board.md');
  const tasksDir = path.join(tempDir, 'tasks');

  await mkdir(tasksDir, { recursive: true });
  await writeFile(boardPath, '', 'utf8');

  const context: CliContext = {
    boardFile: boardPath,
    tasksDir,
    argv: [],
  };

  // Create tasks in different columns
  const incoming1 = (await executeCommand('create', ['Incoming Task 1', '--status=incoming'], context)) as any;
  const incoming2 = (await executeCommand('create', ['Incoming Task 2', '--status=incoming'], context)) as any;
  await executeCommand('create', ['Icebox Task 1', '--status=icebox'], context);
  const icebox2 = (await executeCommand('create', ['Icebox Task 2', '--status=icebox'], context)) as any;

  // Move tasks within each column
  const incomingResult = (await executeCommand('move_up', [incoming2.uuid], context)) as any;
  t.truthy(incomingResult);
  t.is(incomingResult.column, 'incoming');
  t.is(incomingResult.rank, 0);

  const iceboxResult = (await executeCommand('move_up', [icebox2.uuid], context)) as any;
  t.truthy(iceboxResult);
  t.is(iceboxResult.column, 'icebox');
  t.is(iceboxResult.rank, 0);

  // Moving the first incoming task up should be a no-op
  const noopResult = (await executeCommand('move_up', [incoming1.uuid], context)) as any;
  t.truthy(noopResult);
  t.is(noopResult.column, 'incoming');
  t.is(noopResult.rank, 0);
});


test('move operations - board persistence', async (t) => {
  const tempDir = await withTempDir(t);
  const boardPath = path.join(tempDir, 'board.md');
  const tasksDir = path.join(tempDir, 'tasks');

  await mkdir(tasksDir, { recursive: true });
  await writeFile(boardPath, '', 'utf8');

  const context: CliContext = {
    boardFile: boardPath,
    tasksDir,
    argv: [],
  };

  // Create tasks
  await executeCommand('create', ['Task 1', '--status=incoming'], context);
  const task2 = (await executeCommand('create', ['Task 2', '--status=incoming'], context)) as any;
  const task3 = (await executeCommand('create', ['Task 3', '--status=incoming'], context)) as any;

  // Move task2 up
  const moveResult = (await executeCommand('move_up', [task2.uuid], context)) as any;
  t.truthy(moveResult);

  // Verify the board file was updated
  const boardContent = await readFile(boardPath, 'utf8');
  t.truthy(boardContent);

  // Create a new context to simulate reloading
  const newContext: CliContext = {
    boardFile: boardPath,
    tasksDir,
    argv: [],
  };

  // Try to move task3 up - should work with persisted board
  const newMoveResult = (await executeCommand('move_up', [task3.uuid], newContext)) as any;
  t.truthy(newMoveResult);
  t.is(newMoveResult.rank, 1); // task3 should now be at position 1
});

test('move operations - performance with many tasks', async (t) => {
  const tempDir = await withTempDir(t);
  const boardPath = path.join(tempDir, 'board.md');
  const tasksDir = path.join(tempDir, 'tasks');

  await mkdir(tasksDir, { recursive: true });
  await writeFile(boardPath, '', 'utf8');

  const context: CliContext = {
    boardFile: boardPath,
    tasksDir,
    argv: [],
  };

  // Create 20 tasks
  const tasks: any[] = [];
  for (let i = 0; i < 20; i++) {
    const task = (await executeCommand(
      `create`,
      [`Task ${i + 1}`, '--status=incoming'],
      context,
    )) as any;
    tasks.push(task);
  }

  // Move the last task to the top
  const startTime = Date.now();
  const lastTask = tasks[tasks.length - 1];

  for (let i = 0; i < 19; i++) {
    const result = (await executeCommand('move_up', [lastTask.uuid], context)) as any;
    t.truthy(result);
  }

  const endTime = Date.now();
  const duration = endTime - startTime;

  // Should complete within reasonable time (less than 5 seconds)
  t.true(duration < 5000, `Move operations took ${duration}ms, expected < 5000ms`);

  // Verify final position
  const finalResult = (await executeCommand('move_up', [lastTask.uuid], context)) as any;
  t.truthy(finalResult);
  t.is(finalResult.rank, 0); // Should be at the top
});
