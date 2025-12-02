declare module '../lib/validation/git-integration.js' {
  export type CommitInfo = {
    hash: string;
    message: string;
    author: string;
    date: string;
    files: string[];
  };

  export class GitValidator {
    constructor(repoRoot: string);
    getTaskCommits(input: {
      repoRoot: string;
      taskUuid?: string;
      taskTitle?: string;
      sinceDate?: string;
    }): Promise<CommitInfo[]>;
    getRepoInfo(): Promise<{ branch?: string; remote?: string; isClean: boolean }>;
    validateRepoState(): Promise<{ valid: boolean; errors: string[]; warnings: string[] }>;
    getCommitFiles(hash: string): Promise<string[]>;
    hasSecurityFileChanges(commits: CommitInfo[]): Promise<boolean>;
  }

  export function hasTaskCodeChanges(input: {
    repoRoot: string;
    taskUuid?: string;
    taskTitle?: string;
    sinceDate?: string;
  }): Promise<boolean>;
}

declare module '../lib/git-sync.js' {
  export type SyncOptions = { workingDir: string; autoPush?: boolean; autoPull?: boolean };
  export type SyncCallbacks = {
    onSyncStart?: (op: string) => void;
    onSyncComplete?: (op: string) => void;
  };

  export class KanbanGitSync {
    constructor(options: SyncOptions, callbacks?: SyncCallbacks);
    initialize(): Promise<void>;
    isSyncInProgress(): boolean;
    getStatus(): unknown;
    autoPush(message?: string): Promise<void>;
    autoPull(): Promise<void>;
    syncWithRemote(): Promise<void>;
    checkForRemoteChanges(): Promise<boolean>;
    resolveConflicts(strategy?: string): Promise<boolean>;
  }
}

declare module '../lib/kanban.js' {
  export function indexForSearch(
    tasksDir: string,
    options?: { argv?: string[]; env?: Record<string, string | undefined> },
  ): Promise<{ started: boolean; tasksIndexed: number; wroteIndexFile: boolean }>;
}

declare module '../lib/heal/scar-context-types.js' {
  export interface ScarEvent {
    timestamp: Date;
    operation: string;
    details: Record<string, unknown>;
    severity: string;
  }

  export interface ScarContext {
    reason: string;
    eventLog: ScarEvent[];
    previousScars: unknown[];
    searchResults: Array<{
      taskId: string;
      title: string;
      relevance: number;
      snippet: string;
    }>;
    metadata: { tag: string; narrative?: string };
    llmOperations: Array<Record<string, unknown>>;
    gitHistory: unknown[];
  }
}

declare module '../lib/testing-transition/types.js' {
  export interface Task {
    uuid: string;
    title: string;
    status: string;
    priority: string;
    labels: string[];
    created_at: Date;
    updated_at: Date;
    estimates: Record<string, string>;
  }
}

declare module '../lib/heal/git-workflow.js' {
  import type { ScarContext } from '../lib/heal/scar-context-types.js';
  import type { Task } from '../lib/testing-transition/types.js';

  type WorkflowResult<T = unknown> = {
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

  type RepoState = {
    headSha: string;
    branch: string;
    isClean: boolean;
    modifiedFiles: string[];
    untrackedFiles: string[];
  };

  export class GitWorkflow {
    constructor(options: {
      repoPath: string;
      createBackups?: boolean;
      createAnnotatedTags?: boolean;
      tagPrefix?: string;
      pushToRemote?: boolean;
      signTags?: boolean;
      commitMessageOptions?: Record<string, unknown>;
      scarFileConfig?: Record<string, unknown>;
    });

    static createGitWorkflow(options: { repoPath: string; tagPrefix?: string }): GitWorkflow;

    preOperation(context: ScarContext): Promise<WorkflowResult>;
    postOperation(context: ScarContext, tasks: Task[]): Promise<WorkflowResult<{ tag?: string }>>;
    commitTasksDirectory(context: ScarContext): Promise<WorkflowResult<string>>;
    commitKanbanBoard(context: ScarContext, tasks: Task[]): Promise<WorkflowResult<string>>;
    commitDependencies(context: ScarContext): Promise<WorkflowResult<string>>;
    createPreOpTag(tag: string, sha?: string | null): Promise<WorkflowResult<{ tag: string }>>;
    createPostOpTag(tag: string, sha?: string | null): Promise<WorkflowResult<{ tag: string }>>;
    createFinalTag(tag: string, sha?: string | null): Promise<WorkflowResult<{ tag: string }>>;
    rollback(sha?: string): Promise<WorkflowResult<{ message?: string }>>;
    getCurrentState(): Promise<RepoState>;
  }
}

declare module '../test-utils/helpers.js' {
  export function withTempDir(t?: { context?: unknown }): Promise<string>;
}

declare module '../../../cli/kanban/src/lib/heal/utils/git-utils.js' {
  export type GitState = {
    headSha: string;
    branch: string;
    isClean: boolean;
    modifiedFiles: string[];
    untrackedFiles: string[];
  };

  export class GitUtils {
    constructor(repoPath: string);
    getCurrentState(): Promise<GitState>;
    addFiles(files: string[]): Promise<{ success: boolean; data?: string }>;
    commit(
      message: string,
      allowEmpty?: boolean,
    ): Promise<{ success: boolean; data?: { sha: string } }>;
    createTag(
      tag: string,
      ref?: string,
      message?: string,
    ): Promise<{ success: boolean; data?: string }>;
    deleteTag(tag: string): Promise<{ success: boolean; data?: string }>;
    getCommitSha(ref: string): Promise<string | null>;
    getDiff(fromRef: string, toRef?: string): Promise<string>;
    getChangedFiles(fromRef?: string): Promise<string[]>;
  }
}
