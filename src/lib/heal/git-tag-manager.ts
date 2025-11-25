/**
 * Git Tag Management for Kanban Healing Operations
 *
 * This file now proxies to the heal plugin implementation to keep CLI imports stable.
 */
export {
  GitTagManager,
  createGitTagManager,
  DEFAULT_GIT_TAG_MANAGER_OPTIONS,
} from '@promethean-os/kanban-plugin-heal';
export type {
  GitTagManagerOptions,
  TagCreationResult,
  ScarHistoryResult,
} from '@promethean-os/kanban-plugin-heal';
