export type { Task } from './types.js';

export {
  loadBoard,
  countTasks,
  getColumn,
  getTasksByColumn,
  findTaskById,
  findTaskByTitle,
} from './board-service.js';

export { readTasksFolder, toFrontmatter } from './task-files.js';

export {
  validateStartingStatus,
  updateStatus,
  moveTask,
  createTask,
  updateTaskDescription,
  renameTask,
  archiveTask,
  deleteTask,
  mergeTasks,
} from './task-lifecycle.js';

export {
  syncBoardAndTasks,
  pullFromTasks,
  pushToTasks,
  regenerateBoard,
  generateBoardByTags,
  indexForSearch,
} from './task-sync.js';

export { searchTasks } from './task-search.js';

export { analyzeTask, rewriteTask, breakdownTask } from './task-ai.js';

export { serializeBoard } from './board-serialization.js';
export { applyTemplateReplacements } from './kanban-utils.js';
