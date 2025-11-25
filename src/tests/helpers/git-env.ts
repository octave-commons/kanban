import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

let initializedRepo: string | null = null;

export const ensureGitEnv = (): string => {
  if (initializedRepo && fs.existsSync(path.join(initializedRepo, '.git'))) {
    process.env.GIT_DIR = path.join(initializedRepo, '.git');
    process.env.GIT_WORK_TREE = initializedRepo;
    return initializedRepo;
  }

  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'kanban-test-git-'));
  execSync('git init', { cwd: repoRoot });
  execSync('git config user.name "Test User"', { cwd: repoRoot });
  execSync('git config user.email "test@example.com"', { cwd: repoRoot });

  initializedRepo = repoRoot;
  process.env.GIT_DIR = path.join(repoRoot, '.git');
  process.env.GIT_WORK_TREE = repoRoot;
  return repoRoot;
};
