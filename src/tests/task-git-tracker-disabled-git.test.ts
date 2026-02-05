import test from 'ava';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { temporaryDirectory } from 'tempy';

import { TaskGitTracker } from '../lib/task-git-tracker.js';

test('TaskGitTracker.analyzeTaskStatus skips git when KANBAN_DISABLE_GIT=true', async (t) => {
  t.is(process.env.KANBAN_DISABLE_GIT, 'true');

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
});
