declare module '@promethean-os/kanban-plugin-heal' {
  export const healPluginMeta: any;
  export const healPlugin: any;
  export class GitTagManager {
    constructor(repoRoot: string, options?: any);
    createHealTag(reason: string, startSha?: string, metadata?: Record<string, any>): Promise<any>;
    pushTags(tags?: string[]): Promise<any>;
    storeScarRecord(scar: any): Promise<any>;
    getCommitsBetweenTags(startTag: string, endTag?: string): Promise<any>;
    loadScarHistory(): Promise<any>;
    getHealTags(): Promise<any>;
    deleteTag(tag: string): Promise<any>;
    getTagInfo(tag: string): Promise<any>;
    cleanupOldScars(): Promise<any>;
  }
  export function createGitTagManager(repoRoot: string, options?: any): GitTagManager;
  export const DEFAULT_GIT_TAG_MANAGER_OPTIONS: any;
  export type GitTagManagerOptions = any;
  export type TagCreationResult = any;
  export type ScarHistoryResult = any;
  export type ScarRecord = any;
  export type GitCommit = any;
}
