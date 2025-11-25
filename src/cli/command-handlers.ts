import type { CommandHandler, CommandResult, CliContext } from './types.js';
import { CommandNotFoundError } from './errors.js';
import {
  handleCount,
  handleGetColumn,
  handleGetByColumn,
  handleFind,
  handleFindByTitle,
  handleUpdateStatus,
  createMoveHandler,
  handlePull,
  handlePush,
  handleSync,
  handleRegenerate,
  handleGenerateByTags,
  handleIndexForSearch,
  handleSearch,
  handleList,
  handleCreate,
  handleUpdate,
  handleDelete,
} from './handlers/board.js';
import { handleProcess, handleShowProcess } from './handlers/process.js';
import { handleUi } from './handlers/ui.js';
import { handleDev } from './handlers/dev.js';
import {
  handleCreateEpic,
  handleAddTask,
  handleRemoveTask,
  handleListEpics,
  handleEpicStatus,
} from './handlers/epics.js';
import { handleAudit, handleCommitStats } from './handlers/audit.js';
import { handleShowTransitions } from './handlers/transitions.js';
import { handleHeal } from './handlers/heal.js';
import {
  handleCompareTasks,
  handleBreakdownTask,
  handlePrioritizeTasks,
} from './handlers/task-tools.js';
import { handleInit } from './handlers/init.js';
import { handleRebuildEventLog } from './handlers/rebuild-event-log.js';
import {
  handleEnforceWipLimits,
  handleWipMonitor,
  handleWipCompliance,
  handleWipViolations,
  handleWipSuggestions,
} from './handlers/wip.js';

export type { CliContext, CommandHandler, CommandResult } from './types.js';
export { CommandNotFoundError, CommandUsageError } from './errors.js';

export const COMMAND_HANDLERS: Readonly<Record<string, CommandHandler>> = Object.freeze({
  heal: handleHeal,
  count: handleCount,
  getColumn: handleGetColumn,
  getByColumn: handleGetByColumn,
  find: handleFind,
  'find-by-title': handleFindByTitle,
  update_status: handleUpdateStatus,
  'update-status': handleUpdateStatus,
  move_up: createMoveHandler(-1),
  move_down: createMoveHandler(1),
  pull: handlePull,
  push: handlePush,
  sync: handleSync,
  regenerate: handleRegenerate,
  'generate-by-tags': handleGenerateByTags,
  indexForSearch: handleIndexForSearch,
  search: handleSearch,
  ui: handleUi,
  dev: handleDev,
  process: handleProcess,
  'show-process': handleShowProcess,
  'show-transitions': handleShowTransitions,
  'compare-tasks': handleCompareTasks,
  'breakdown-task': handleBreakdownTask,
  'prioritize-tasks': handlePrioritizeTasks,
  list: handleList,
  audit: handleAudit,
  'enforce-wip-limits': handleEnforceWipLimits,
  'wip-monitor': handleWipMonitor,
  'wip-compliance': handleWipCompliance,
  'wip-violations': handleWipViolations,
  'wip-suggestions': handleWipSuggestions,
  'commit-stats': handleCommitStats,
  create: handleCreate,
  update: handleUpdate,
  delete: handleDelete,
  'create-epic': handleCreateEpic,
  'add-task': handleAddTask,
  'remove-task': handleRemoveTask,
  'list-epics': handleListEpics,
  'epic-status': handleEpicStatus,
  init: handleInit,
  'rebuild-event-log': handleRebuildEventLog,
});

export const AVAILABLE_COMMANDS: ReadonlyArray<string> = Object.freeze(
  Object.keys(COMMAND_HANDLERS),
);

export const REMOTE_COMMANDS: ReadonlyArray<string> = Object.freeze(
  AVAILABLE_COMMANDS.filter((command) => command !== 'ui'),
);

export const executeCommand = async (
  command: string,
  args: ReadonlyArray<string>,
  context: CliContext,
): Promise<CommandResult> => {
  const handler = COMMAND_HANDLERS[command];
  if (!handler) {
    throw new CommandNotFoundError(command);
  }
  return handler(args, context);
};
