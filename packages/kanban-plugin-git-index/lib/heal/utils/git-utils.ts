export type GitState = {
  headSha: string;
  branch: string;
  isClean: boolean;
  modifiedFiles: string[];
  untrackedFiles: string[];
};

export class GitUtils {
  constructor(private readonly repoPath: string) {
    void repoPath;
  }

  async getCurrentState(): Promise<GitState> {
    void this.repoPath;
    return {
      headSha: 'stub-sha',
      branch: 'main',
      isClean: true,
      modifiedFiles: [],
      untrackedFiles: [],
    };
  }

  async addFiles(files: string[]): Promise<{ success: boolean; data?: string }> {
    if (files.length === 0) {
      return { success: true, data: 'No files to add' };
    }
    return { success: true, data: `Added ${files.length} file(s)` };
  }

  async commit(_message: string, _allowEmpty = false): Promise<{ success: boolean; data?: { sha: string } }> {
    return { success: true, data: { sha: `commit-${Date.now()}` } };
  }

  async createTag(tag: string, _ref?: string, _message?: string): Promise<{ success: boolean; data?: string }> {
    return { success: true, data: tag };
  }

  async deleteTag(tag: string): Promise<{ success: boolean; data?: string }> {
    return { success: true, data: tag };
  }

  async getCommitSha(ref: string): Promise<string | null> {
    if (!ref) return null;
    return `sha-${ref}`;
  }

  async getDiff(_fromRef: string, _toRef?: string): Promise<string> {
    return '';
  }

  async getChangedFiles(_fromRef?: string): Promise<string[]> {
    return [];
  }

  async getCommitHistory(_fromRef?: string, _toRef?: string, limit = 10): Promise<
    Array<{ sha: string; message: string; author: string; date: Date }>
  > {
    const count = Math.max(1, limit);
    return Array.from({ length: count }, (_v, index) => ({
      sha: `sha-${index}`,
      message: `commit-${index}`,
      author: 'stub',
      date: new Date(),
    }));
  }

  async refExists(ref: string): Promise<boolean> {
    return Boolean(ref);
  }

  async reset(_ref: string, _mode: 'soft' | 'hard' | 'mixed' = 'mixed'):
    Promise<{ success: boolean; data?: string }> {
    return { success: true, data: 'reset' };
  }

  async stash(_message?: string): Promise<{ success: boolean; data?: string }> {
    return { success: true, data: 'stashed' };
  }

  async stashPop(): Promise<{ success: boolean; data?: string }> {
    return { success: true, data: 'popped' };
  }

  static createGitUtils(repoPath: string): GitUtils {
    return new GitUtils(repoPath);
  }
}
