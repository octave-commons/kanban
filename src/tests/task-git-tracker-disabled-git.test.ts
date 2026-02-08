import test from 'ava';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { temporaryDirectory } from 'tempy';

import { TaskGitTracker } from '../lib/task-git-tracker.js';

const withEnv = async <T>(
  t: import('ava').ExecutionContext,
  key: string,
  value: string,
  run: () => Promise<T>,
): Promise<T> => {
  const original = process.env[key];
  process.env[key] = value;
  t.teardown(() => {
    if (original === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = original;
    }
  });
  return run();
};

test('TaskGitTracker.analyzeTaskStatus skips git when KANBAN_DISABLE_GIT=true', async (t) =>
  withEnv(t, 'KANBAN_DISABLE_GIT', 'true', async () => {
    const repoRoot = temporaryDirectory();
    const taskFilePath = path.join(repoRoot, 'task.md');
    await writeFile(taskFilePath, '---\nuuid: "task-1"\n---\n\nHello', 'utf8');

    const tracker = new TaskGitTracker({ repoRoot });
    const analysis = tracker.analyzeTaskStatus(
      {
        uuid: 'task-1',
        title: 'Test task',
        status: 'Todo',
      },
      taskFilePath,
    );

    t.is(analysis.isHealthy, true);
    t.is(analysis.isTrulyOrphaned, false);
    t.is(analysis.isUntracked, false);
    t.deepEqual(analysis.issues, []);
    t.deepEqual(analysis.recommendations, []);
  }));
