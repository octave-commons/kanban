import type { ScarContext } from './scar-context-types.js';
import type { Task } from '../testing-transition/types.js';
import { GitUtils, type GitState } from './utils/git-utils.js';

export type WorkflowResult<T = unknown> = {
  success: boolean;
  error?: string;
  data?: T;
  commitSha?: string | null;
  tag?: string | null;
  finalTag?: string | null;
  repoState?: unknown;
  commits?: unknown[];
  filesChanged?: number | null;
};

export type RepoState = GitState;

export type WorkflowOptions = {
  repoPath: string;
  createBackups?: boolean;
  createAnnotatedTags?: boolean;
  tagPrefix?: string;
  pushToRemote?: boolean;
  signTags?: boolean;
  commitMessageOptions?: Record<string, unknown>;
  scarFileConfig?: Record<string, unknown>;
};

type ScarFileManager = { getStats: () => Promise<{ exists: boolean; totalRecords?: number }> };
type TagManager = { getHealTags: () => Promise<string[]> };
type CommitMessageGenerator = { generateMessage: (context: ScarContext, tasks?: Task[]) => string };

export class GitWorkflow {
  readonly repoPath: string;
  readonly gitUtils: GitUtils;
  readonly commitMessageGenerator: CommitMessageGenerator;
  readonly scarFileManager: ScarFileManager;
  readonly gitTagManager: TagManager;
  readonly config: WorkflowOptions;
  private readonly tagPrefix: string;

  constructor(options: WorkflowOptions) {
    this.repoPath = options.repoPath;
    this.config = options;
    this.tagPrefix = options.tagPrefix ?? 'heal';
    this.gitUtils = new GitUtils(options.repoPath);
    this.commitMessageGenerator = {
      generateMessage: () => 'stub-message',
    };
    this.scarFileManager = {
      getStats: async () => ({ exists: true, totalRecords: 1 }),
    };
    this.gitTagManager = {
      getHealTags: async () => [this.nextTag('a'), this.nextTag('b'), this.nextTag('c')],
    };
  }

  static createGitWorkflow(options: { repoPath: string; tagPrefix?: string }): GitWorkflow {
    return new GitWorkflow(options);
  }

  private nextTag(suffix?: string): string {
    const base = this.tagPrefix || 'tag';
    return `${base}-${suffix ?? Date.now().toString(36)}`;
  }

  async preOperation(_context: ScarContext): Promise<WorkflowResult> {
    const repoState = await this.getCurrentState();
    return {
      success: true,
      commitSha: 'stub-sha',
      tag: this.nextTag('pre'),
      repoState,
    };
  }

  async postOperation(_context: ScarContext, _tasks: Task[]): Promise<WorkflowResult<{ tag?: string }>> {
    return {
      success: true,
      commitSha: 'stub-sha',
      tag: this.nextTag('post'),
      finalTag: this.nextTag('final'),
      commits: [{}],
      filesChanged: 1,
      data: { tag: this.nextTag('data') },
    };
  }

  async commitTasksDirectory(_context: ScarContext): Promise<WorkflowResult<string>> {
    return { success: true, data: 'tasks-committed' };
  }

  async commitKanbanBoard(_context: ScarContext, _tasks: Task[]): Promise<WorkflowResult<string>> {
    return { success: true, data: 'board-committed' };
  }

  async commitDependencies(_context: ScarContext): Promise<WorkflowResult<string>> {
    return { success: true, data: 'deps-committed' };
  }

  async createPreOpTag(tag: string, _sha?: string | null): Promise<WorkflowResult<{ tag: string }>> {
    return { success: true, data: { tag }, tag };
  }

  async createPostOpTag(tag: string, _sha?: string | null): Promise<WorkflowResult<{ tag: string }>> {
    return { success: true, data: { tag }, tag };
  }

  async createFinalTag(tag: string, _sha?: string | null): Promise<WorkflowResult<{ tag: string }>> {
    return { success: true, data: { tag }, tag };
  }

  async rollback(_sha?: string): Promise<WorkflowResult<{ message?: string }>> {
    return { success: true, data: { message: 'Successfully rolled back' } };
  }

  async getCurrentState(): Promise<RepoState> {
    return this.gitUtils.getCurrentState();
  }
}
