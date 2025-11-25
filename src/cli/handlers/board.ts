import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Board } from '../../lib/types.js';
import {
  countTasks,
  getColumn,
  getTasksByColumn,
  findTaskById,
  findTaskByTitle,
  updateStatus,
  moveTask,
  pullFromTasks,
  pushToTasks,
  syncBoardAndTasks,
  regenerateBoard,
  generateBoardByTags,
  indexForSearch,
  searchTasks,
  createTask,
  deleteTask,
  updateTaskDescription,
  renameTask,
  columnKey,
} from '../../lib/kanban.js';
import { loadKanbanConfig } from '../../board/config.js';
import { makeEventLogManager, type EventLogManager } from '../../board/event-log/index.js';
import { TransitionRulesEngine, createTransitionRulesEngine } from '../../lib/transition-rules.js';
import type { CommandHandler } from '../types.js';
import { CommandUsageError } from '../errors.js';
import { requireArg, withBoard } from './shared.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Local alias for clarity
type LoadedBoard = Board;

type CreateTaskArgs = {
  title: string;
  content?: string;
  priority?: string;
  labels?: string[];
  status?: string;
};

type UpdateTaskArgs = {
  uuid: string;
  title?: string;
  content?: string;
  priority?: string;
  status?: string;
};

type DeleteTaskArgs = {
  uuid: string;
  confirm: boolean;
};

const handleCount: CommandHandler = (args, context) =>
  withBoard(context, (board) => {
    const mutableBoard = board as unknown as LoadedBoard;
    const column = args[0] !== undefined ? args[0] : '';
    const count = countTasks(mutableBoard, column);
    return { count };
  });

const handleGetColumn: CommandHandler = (args, context) =>
  withBoard(context, (board) => {
    const mutableBoard = board as unknown as LoadedBoard;
    const column = getColumn(mutableBoard, requireArg(args[0], 'column name'));
    return column;
  });

const handleGetByColumn: CommandHandler = (args, context) =>
  withBoard(context, (board) => {
    const mutableBoard = board as unknown as LoadedBoard;
    const tasks = getTasksByColumn(mutableBoard, requireArg(args[0], 'column name'));
    return tasks;
  });

const handleFind: CommandHandler = (args, context) =>
  withBoard(context, (board) => {
    const mutableBoard = board as unknown as LoadedBoard;
    const task = findTaskById(mutableBoard, requireArg(args[0], 'task id'));
    return task ?? null;
  });

const handleFindByTitle: CommandHandler = (args, context) =>
  withBoard(context, (board) => {
    const mutableBoard = board as unknown as LoadedBoard;
    const title = requireArg(args.join(' ').trim(), 'task title');
    const task = findTaskByTitle(mutableBoard, title);
    return task ?? null;
  });

const handleUpdateStatus: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    const mutableBoard = board as unknown as LoadedBoard;
    const id = requireArg(args[0], 'task id');
    const status = requireArg(args[1], 'new status');

    let reason: string | undefined;
    const reasonIndex = args.findIndex((arg) => arg === '--reason' || arg === '-r');
    if (reasonIndex >= 0 && args[reasonIndex + 1]) {
      reason = args[reasonIndex + 1];
    }

    let transitionRulesEngine: TransitionRulesEngine | undefined;
    const possiblePaths = [
      path.resolve(process.cwd(), 'promethean.kanban.json'),
      path.resolve(path.dirname(context.boardFile), '../promethean.kanban.json'),
      path.resolve(path.dirname(context.boardFile), '../../promethean.kanban.json'),
      path.resolve(path.dirname(context.boardFile), '../../../promethean.kanban.json'),
      path.resolve(__dirname, '../../promethean.kanban.json'),
      context.boardFile.replace('/boards/generated.md', '/promethean.kanban.json'),
    ];

    try {
      transitionRulesEngine = await createTransitionRulesEngine(possiblePaths);
    } catch (error) {
      console.warn(
        'Warning: Transition rules engine not available:',
        error instanceof Error ? error.message : String(error),
      );
    }

    let eventLogManager: EventLogManager | undefined;
    try {
      const configResult = await loadKanbanConfig({ argv: process.argv, env: process.env });
      eventLogManager = makeEventLogManager(configResult.config);
    } catch (error) {
      console.warn(
        'Warning: Event log manager not available:',
        error instanceof Error ? error.message : String(error),
      );
    }

    const updated = await updateStatus(
      mutableBoard,
      id,
      status,
      context.boardFile,
      context.tasksDir,
      transitionRulesEngine,
      reason,
      eventLogManager,
      'human',
    );
    return updated;
  });

const createMoveHandler =
  (offset: number): CommandHandler =>
  (args, context) =>
    withBoard(context, async (board) => {
      const mutableBoard = board as unknown as LoadedBoard;
      const id = requireArg(args[0], 'task id');
      const result = await moveTask(mutableBoard, id, offset, context.boardFile);
      return result;
    });

const handlePull: CommandHandler = (_args, context) =>
  withBoard(context, async (board) => {
    const mutableBoard = board as unknown as LoadedBoard;
    const result = await pullFromTasks(mutableBoard, context.tasksDir, context.boardFile);

    if (result.moved > 0) {
      console.log(
        `📝 Pull completed: ${result.added} added, ${result.moved} status changes from files`,
      );
    } else {
      console.log(`📋 Pull completed: ${result.added} added, ${result.moved} moved`);
    }

    return result;
  });

const handlePush: CommandHandler = (_args, context) =>
  withBoard(context, async (board) => {
    const mutableBoard = board as unknown as LoadedBoard;
    const result = await pushToTasks(mutableBoard, context.tasksDir);

    if (result.statusUpdated > 0) {
      console.log(
        `📝 Push completed: ${result.added} added, ${result.moved} moved, ${result.statusUpdated} manual edits preserved`,
      );
    } else {
      console.log(`📋 Push completed: ${result.added} added, ${result.moved} moved`);
    }

    return result;
  });

const handleSync: CommandHandler = (_args, context) =>
  withBoard(context, async (board) => {
    const mutableBoard = board as unknown as LoadedBoard;
    const result = await syncBoardAndTasks(mutableBoard, context.tasksDir, context.boardFile);

    const totalChanges =
      result.board.added +
      result.board.moved +
      result.tasks.added +
      result.tasks.moved +
      result.tasks.statusUpdated;
    const conflictCount = result.conflicting.length;

    if (conflictCount > 0) {
      console.log(`⚠️  Sync completed with ${conflictCount} conflict(s) resolved`);
    } else {
      console.log(`✅ Sync completed successfully`);
    }

    console.log(`📊 Board: ${result.board.added} added, ${result.board.moved} moved`);
    console.log(
      `📁 Files: ${result.tasks.added} added, ${result.tasks.moved} moved, ${result.tasks.statusUpdated} status updates`,
    );
    console.log(`🔄 Total changes: ${totalChanges}`);

    return result;
  });

const handleRegenerate: CommandHandler = (_args, context) =>
  regenerateBoard(context.tasksDir, context.boardFile);

const handleGenerateByTags: CommandHandler = (args, context) => {
  if (args.length === 0) {
    throw new CommandUsageError('generate-by-tags requires at least one tag');
  }

  const tags = args.map((arg) => arg.trim()).filter((tag) => tag.length > 0);
  if (tags.length === 0) {
    throw new CommandUsageError('No valid tags provided');
  }

  return generateBoardByTags(context.tasksDir, context.boardFile, tags);
};

const handleIndexForSearch: CommandHandler = (_args, context) => indexForSearch(context.tasksDir);

const handleSearch: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    const mutableBoard = board as unknown as LoadedBoard;
    const term = requireArg(args.join(' ').trim(), 'search term');
    const result = await searchTasks(mutableBoard, term);
    return result;
  });

const handleList: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    const defaultColumns = ['ready', 'todo', 'in_progress', 'in_review', 'document'];

    let columnsToShow = defaultColumns;
    const showAll = args.includes('--all') || args.includes('-a');

    if (showAll) {
      columnsToShow = board.columns.map((col) => columnKey(col.name));
    } else {
      const customColumns = args.filter((arg) => !arg.startsWith('--'));
      if (customColumns.length > 0) {
        columnsToShow = customColumns.map((col) => columnKey(col));
      }
    }

    console.log('📋 Kanban Board Status');
    console.log('');

    let totalViolations = 0;
    const allTasks: any[] = [];

    for (const columnName of columnsToShow) {
      const column = board.columns.find((col) => columnKey(col.name) === columnName);
      if (!column) continue;

      const displayName = column.name;
      const taskCount = column.tasks.length;
      const limit = column.limit;

      const wipViolation = limit && taskCount > limit;
      if (wipViolation) totalViolations++;

      let statusIcon = '✅';
      if (wipViolation) {
        statusIcon = '🚨';
      } else if (taskCount === 0) {
        statusIcon = '⭕';
      } else if (limit && taskCount >= limit * 0.8) {
        statusIcon = '⚠️';
      }

      console.log(`${statusIcon} ${displayName} (${taskCount}${limit ? `/${limit}` : ''})`);

      if (wipViolation) {
        console.log(`   ❌ WIP LIMIT VIOLATION: ${taskCount} > ${limit}`);
      }

      if (column.tasks.length > 0) {
        column.tasks.forEach((task) => {
          const priority = task.priority ? ` [${task.priority}]` : '';
          const uuid = task.uuid.slice(0, 8);
          console.log(`   • ${task.title}${priority} (${uuid}...)`);
        });
        allTasks.push(...column.tasks.slice());
      } else {
        console.log(`   (empty)`);
      }
      console.log('');
    }

    if (totalViolations > 0) {
      console.log(`🚨 ${totalViolations} process violation(s) found`);
    } else {
      console.log('✅ No process violations detected');
    }

    const limitedColumns = board.columns.filter((col) => col.limit);
    if (limitedColumns.length > 0) {
      console.log('');
      console.log('📊 WIP Limits Summary:');
      limitedColumns.forEach((col) => {
        const percentage = col.limit ? Math.round((col.tasks.length / col.limit) * 100) : 0;
        const status = percentage > 100 ? '🚨' : percentage > 80 ? '⚠️' : '✅';
        console.log(`   ${status} ${col.name}: ${col.tasks.length}/${col.limit} (${percentage}%)`);
      });
    }

    return { tasks: allTasks, violations: totalViolations };
  });

const parseCreateTaskArgs = (args: ReadonlyArray<string>): CreateTaskArgs => {
  if (args.length === 0) {
    throw new CommandUsageError('create requires a title');
  }

  const result: CreateTaskArgs = { title: '' };
  const titleParts: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;

    if (arg.startsWith('--title=')) {
      result.title = arg.slice('--title='.length) || '';
    } else if (arg.startsWith('--content=')) {
      result.content = arg.slice('--content='.length);
    } else if (arg.startsWith('--description=')) {
      result.content = arg.slice('--description='.length);
    } else if (arg === '--title' && i + 1 < args.length && args[i + 1]) {
      result.title = args[i + 1] || '';
      i++;
    } else if (arg === '--content' && i + 1 < args.length && args[i + 1]) {
      result.content = args[i + 1];
      i++;
    } else if (arg === '--description' && i + 1 < args.length && args[i + 1]) {
      result.content = args[i + 1];
      i++;
    } else if (arg.startsWith('--priority=')) {
      result.priority = arg.slice('--priority='.length);
    } else if (arg === '--priority' && i + 1 < args.length && args[i + 1]) {
      result.priority = args[i + 1];
      i++;
    } else if (arg.startsWith('--status=')) {
      result.status = arg.slice('--status='.length);
    } else if (arg === '--status' && i + 1 < args.length && args[i + 1]) {
      result.status = args[i + 1];
      i++;
    } else if (arg.startsWith('--labels=')) {
      const labelsStr = arg.slice('--labels='.length);
      result.labels = labelsStr
        .split(',')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
    } else if (arg === '--labels' && i + 1 < args.length && args[i + 1]) {
      const labelsStr = args[i + 1];
      if (labelsStr) {
        result.labels = labelsStr
          .split(',')
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
      }
      i++;
    } else {
      titleParts.push(arg);
    }
  }

  const titleFromParts = titleParts.join(' ').trim();
  if (titleFromParts.length > 0) {
    result.title = titleFromParts;
  }

  if (!result.title || result.title.trim().length === 0) {
    throw new CommandUsageError('create requires a title');
  }

  return result;
};

const handleCreate: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    const mutableBoard = board as unknown as Board;
    const taskArgs = parseCreateTaskArgs(args);

    const newTask = await createTask(
      mutableBoard,
      taskArgs.status || 'incoming',
      {
        title: taskArgs.title,
        content: taskArgs.content,
        priority: taskArgs.priority,
        labels: taskArgs.labels,
      },
      context.tasksDir,
      context.boardFile,
    );

    console.log(`✅ Created task "${newTask.title}" (${newTask.uuid.slice(0, 8)}...)`);
    console.log(`   Status: ${newTask.status}`);
    if (newTask.priority) {
      console.log(`   Priority: ${newTask.priority}`);
    }
    if (newTask.labels && newTask.labels.length > 0) {
      console.log(`   Labels: ${newTask.labels.join(', ')}`);
    }
    if (newTask.lastCommitSha) {
      console.log(`   Commit: ${newTask.lastCommitSha.slice(0, 8)}...`);
    }

    return newTask;
  });

const parseUpdateTaskArgs = (args: ReadonlyArray<string>): UpdateTaskArgs => {
  if (args.length === 0) {
    throw new CommandUsageError('update requires a task UUID');
  }

  const uuid = requireArg(args[0], 'task UUID');
  const result: UpdateTaskArgs = { uuid };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;

    if (arg.startsWith('--title=')) {
      result.title = arg.slice('--title='.length);
    } else if (arg === '--title' && i + 1 < args.length && args[i + 1]) {
      result.title = args[i + 1];
      i++;
    } else if (arg.startsWith('--content=')) {
      result.content = arg.slice('--content='.length);
    } else if (arg.startsWith('--description=')) {
      result.content = arg.slice('--description='.length);
    } else if (arg === '--content' && i + 1 < args.length && args[i + 1]) {
      result.content = args[i + 1];
      i++;
    } else if (arg === '--description' && i + 1 < args.length && args[i + 1]) {
      result.content = args[i + 1];
      i++;
    } else if (arg.startsWith('--priority=')) {
      result.priority = arg.slice('--priority='.length);
    } else if (arg === '--priority' && i + 1 < args.length && args[i + 1]) {
      result.priority = args[i + 1];
      i++;
    }
  }

  return result;
};

const handleUpdate: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    const mutableBoard = board as unknown as Board;
    const updateArgs = parseUpdateTaskArgs(args);

    let updatedTask;

    if (updateArgs.title) {
      updatedTask = await renameTask(
        mutableBoard,
        updateArgs.uuid,
        updateArgs.title,
        context.tasksDir,
        context.boardFile,
      );
      if (updatedTask) {
        console.log(`✅ Updated title to "${updateArgs.title}"`);
      }
    }

    if (updateArgs.content) {
      updatedTask = await updateTaskDescription(
        mutableBoard,
        updateArgs.uuid,
        updateArgs.content,
        context.tasksDir,
        context.boardFile,
      );
      if (updatedTask) {
        console.log(`✅ Updated task description`);
      }
    }

    if (!updatedTask) {
      throw new CommandUsageError(`Task with UUID ${updateArgs.uuid} not found`);
    }

    return updatedTask;
  });

const parseDeleteTaskArgs = (args: ReadonlyArray<string>): DeleteTaskArgs => {
  if (args.length === 0) {
    throw new CommandUsageError('delete requires a task UUID');
  }

  const uuid = requireArg(args[0], 'task UUID');
  const confirm = args.includes('--confirm') || args.includes('-y');

  return { uuid, confirm };
};

const handleDelete: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    const mutableBoard = board as unknown as Board;
    const deleteArgs = parseDeleteTaskArgs(args);

    const task = findTaskById(mutableBoard, deleteArgs.uuid);
    if (!task) {
      throw new CommandUsageError(`Task with UUID ${deleteArgs.uuid} not found`);
    }

    if (!deleteArgs.confirm) {
      console.log(`⚠️  About to delete task:`);
      console.log(`   Title: ${task.title}`);
      console.log(`   UUID: ${task.uuid}`);
      console.log(`   Status: ${task.status}`);
      console.log('');
      console.log('This action cannot be undone. Use --confirm to proceed with deletion.');
      return { deleted: false, task };
    }

    const deleted = await deleteTask(
      mutableBoard,
      deleteArgs.uuid,
      context.tasksDir,
      context.boardFile,
    );

    if (deleted) {
      console.log(`✅ Deleted task "${task.title}" (${task.uuid.slice(0, 8)}...)`);
      return { deleted: true, task };
    } else {
      console.log(`❌ Failed to delete task with UUID ${deleteArgs.uuid}`);
      return { deleted: false, task };
    }
  });

export {
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
};
