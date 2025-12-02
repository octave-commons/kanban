export type CommitInfo = {
  hash: string;
  message: string;
  author: string;
  date: string;
  files: string[];
};

export class GitValidator {
  constructor(private readonly repoRoot: string) {}

  async getTaskCommits(input: {
    repoRoot: string;
    taskUuid?: string;
    taskTitle?: string;
    sinceDate?: string;
  }): Promise<CommitInfo[]> {
    const root = this.repoRoot || input.repoRoot;
    void root;
    return [];
  }

  async getRepoInfo(): Promise<{ branch?: string; remote?: string; isClean: boolean }> {
    return { branch: undefined, remote: undefined, isClean: true };
  }

  async validateRepoState(): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
    return { valid: true, errors: [], warnings: [] };
  }

  async getCommitFiles(_hash: string): Promise<string[]> {
    return [];
  }

  async hasSecurityFileChanges(_commits: CommitInfo[]): Promise<boolean> {
    return false;
  }
}

export async function hasTaskCodeChanges(input: {
  repoRoot: string;
  taskUuid?: string;
  taskTitle?: string;
  sinceDate?: string;
}): Promise<boolean> {
  void input;
  return false;
}
