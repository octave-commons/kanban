export type SyncOptions = { workingDir: string; autoPush?: boolean; autoPull?: boolean };
export type SyncCallbacks = {
  onSyncStart?: (op: string) => void;
  onSyncComplete?: (op: string) => void;
};

export type SyncStatus = {
  files: string[];
  current: string;
  ahead: number;
  behind: number;
  conflicted: string[];
};

export class KanbanGitSync {
  private status: SyncStatus = { files: [], current: 'main', ahead: 0, behind: 0, conflicted: [] };
  private syncing = false;

  constructor(private readonly options: SyncOptions, private readonly callbacks: SyncCallbacks = {}) {
    void options;
  }

  async initialize(): Promise<void> {
    void this.options;
    this.status = { ...this.status };
  }

  isSyncInProgress(): boolean {
    return this.syncing;
  }

  getStatus(): SyncStatus {
    return { ...this.status };
  }

  private mark(op: string, fn?: (op: string) => void): void {
    fn?.(op);
  }

  async autoPush(_message?: string): Promise<void> {
    this.syncing = true;
    this.mark('push', this.callbacks.onSyncStart);
    this.status.ahead = 0;
    this.syncing = false;
    this.mark('push', this.callbacks.onSyncComplete);
  }

  async autoPull(): Promise<void> {
    this.syncing = true;
    this.mark('pull', this.callbacks.onSyncStart);
    this.status.behind = 0;
    this.syncing = false;
    this.mark('pull', this.callbacks.onSyncComplete);
  }

  async syncWithRemote(): Promise<void> {
    this.mark('sync', this.callbacks.onSyncStart);
    this.status.behind = 0;
    this.status.conflicted = [];
    this.mark('sync', this.callbacks.onSyncComplete);
  }

  async checkForRemoteChanges(): Promise<boolean> {
    return this.status.behind > 0;
  }

  async resolveConflicts(_strategy?: string): Promise<boolean> {
    this.status.conflicted = [];
    return true;
  }
}
