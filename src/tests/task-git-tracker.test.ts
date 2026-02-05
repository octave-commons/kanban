import test from 'ava';

import { TaskGitTracker } from '../lib/task-git-tracker.js';

const withEnv = <T>(t: import('ava').ExecutionContext, key: string, value: string, run: () => T): T => {
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

test('TaskGitTracker returns unknown when git is disabled', (t) => {
  const tracker = withEnv(t, 'KANBAN_DISABLE_GIT', 'true', () => new TaskGitTracker({ repoRoot: '/tmp' }));

  t.is(tracker.getCurrentCommitSha(), 'unknown');
  t.is(tracker.getLastCommitForFile('/tmp/task.md'), null);
});

test('createTaskCommitMessage formats operation details', (t) => {
  const tracker = new TaskGitTracker({ repoRoot: '/tmp' });

  const message = tracker.createTaskCommitMessage('task-123', 'status_change', 'Moved to done');
  t.is(message, 'Change task status: task-123 - Moved to done');
});

test('updateTaskCommitTracking returns original frontmatter when git is disabled', (t) => {
  const tracker = withEnv(t, 'KANBAN_DISABLE_GIT', 'true', () => new TaskGitTracker({ repoRoot: '/tmp' }));
  const frontmatter = { title: 'Task' };

  const updated = tracker.updateTaskCommitTracking(frontmatter, '/tmp/task.md', 'task-1', 'update');
  t.is(updated, frontmatter);
});

test('validateTaskCommitTracking reports missing fields and invalid entries', (t) => {
  const tracker = new TaskGitTracker({ repoRoot: '/tmp' });
  const result = tracker.validateTaskCommitTracking({ commitHistory: [{}] });

  t.false(result.isValid);
  t.true(result.issues.some((issue) => issue.includes('Missing lastCommitSha')));
  t.true(result.issues.some((issue) => issue.includes('commitHistory[0]')));
});

test('analyzeTaskStatus flags missing basic fields when git disabled', (t) => {
  const tracker = withEnv(t, 'KANBAN_DISABLE_GIT', 'true', () => new TaskGitTracker({ repoRoot: '/tmp' }));

  const analysis = tracker.analyzeTaskStatus({ uuid: '', title: '', status: '' });
  t.false(analysis.isHealthy);
  t.true(analysis.isTrulyOrphaned);
  t.true(analysis.recommendations.length > 0);
});

test('getCommitTrackingStats calculates orphanage rate', (t) => {
  const tracker = new TaskGitTracker({ repoRoot: '/tmp' });
  const stats = tracker.getCommitTrackingStats([
    { frontmatter: { lastCommitSha: 'abc', commitHistory: [] } },
    { frontmatter: { commitHistory: [] } },
  ]);

  t.is(stats.total, 2);
  t.is(stats.withCommitTracking, 1);
  t.is(stats.orphaned, 1);
  t.is(stats.orphanageRate, 50);
});
