import type { Board } from '../../lib/types.js';
import {
  isEpic,
  getEpicSubtasks,
  addSubtaskToEpic,
  removeSubtaskFromEpic,
  createEpic,
  getAllEpics,
} from '../../lib/epic.js';
import { findTaskById } from '../../lib/kanban.js';
import type { CommandHandler } from '../types.js';
import { CommandUsageError } from '../errors.js';
import { requireArg, withBoard } from './shared.js';

const parseCreateEpicArgs = (args: ReadonlyArray<string>) => {
  if (args.length === 0) {
    throw new CommandUsageError('create-epic requires a title');
  }

  const title = requireArg(args[0], 'epic title');
  const content = args.find((arg) => arg.startsWith('--content='))?.slice(11);
  const subtaskUuids = args
    .filter((arg) => arg.startsWith('--subtask='))
    .map((arg) => arg.slice(10));

  return { title, content, subtaskUuids };
};

const handleCreateEpic: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    const mutableBoard = board as unknown as Board;
    const epicArgs = parseCreateEpicArgs(args);

    if (epicArgs.subtaskUuids.length > 0) {
      for (const subtaskUuid of epicArgs.subtaskUuids) {
        const subtask = findTaskById(mutableBoard, subtaskUuid);
        if (!subtask) {
          throw new CommandUsageError(`Subtask with UUID ${subtaskUuid} not found`);
        }
        if (isEpic(subtask)) {
          throw new CommandUsageError(`Cannot add epic ${subtaskUuid} as a subtask`);
        }
      }
    }

    const newEpic = createEpic(epicArgs.title, epicArgs.content, epicArgs.subtaskUuids);
    const incomingColumn = mutableBoard.columns.find((col) => col.name === 'incoming');
    if (incomingColumn) {
      incomingColumn.tasks.push(newEpic);
    }

    if (epicArgs.subtaskUuids.length > 0) {
      for (const subtaskUuid of epicArgs.subtaskUuids) {
        const result = addSubtaskToEpic(mutableBoard, newEpic.uuid, subtaskUuid);
        if (!result.success) {
          console.warn(`⚠️  Failed to link subtask ${subtaskUuid}: ${result.reason}`);
        }
      }
    }

    console.log(`✅ Created epic "${newEpic.title}" (${newEpic.uuid.slice(0, 8)}...)`);
    console.log(`   Status: ${newEpic.status}`);
    console.log(`   Epic Status: ${newEpic.epicStatus}`);
    if (epicArgs.subtaskUuids.length > 0) {
      console.log(`   Subtasks: ${epicArgs.subtaskUuids.length}`);
    }

    return newEpic;
  });

const parseAddTaskArgs = (args: ReadonlyArray<string>) => {
  if (args.length < 2) {
    throw new CommandUsageError('add-task requires epic UUID and task UUID');
  }

  const epicUuid = requireArg(args[0], 'epic UUID');
  const taskUuid = requireArg(args[1], 'task UUID');

  return { epicUuid, taskUuid };
};

const handleAddTask: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    const mutableBoard = board as unknown as Board;
    const taskArgs = parseAddTaskArgs(args);

    const result = addSubtaskToEpic(mutableBoard, taskArgs.epicUuid, taskArgs.taskUuid);

    if (!result.success) {
      throw new CommandUsageError(result.reason || 'Failed to add task to epic');
    }

    const epic = findTaskById(mutableBoard, taskArgs.epicUuid);
    const task = findTaskById(mutableBoard, taskArgs.taskUuid);

    console.log(`✅ Added task "${task?.title}" to epic "${epic?.title}"`);
    console.log(`   Epic UUID: ${taskArgs.epicUuid.slice(0, 8)}...`);
    console.log(`   Task UUID: ${taskArgs.taskUuid.slice(0, 8)}...`);

    return { success: true, epic, task };
  });

const parseRemoveTaskArgs = (args: ReadonlyArray<string>) => {
  if (args.length < 2) {
    throw new CommandUsageError('remove-task requires epic UUID and task UUID');
  }

  const epicUuid = requireArg(args[0], 'epic UUID');
  const taskUuid = requireArg(args[1], 'task UUID');

  return { epicUuid, taskUuid };
};

const handleRemoveTask: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    const mutableBoard = board as unknown as Board;
    const taskArgs = parseRemoveTaskArgs(args);

    const result = removeSubtaskFromEpic(mutableBoard, taskArgs.epicUuid, taskArgs.taskUuid);

    if (!result.success) {
      throw new CommandUsageError(result.reason || 'Failed to remove task from epic');
    }

    const epic = findTaskById(mutableBoard, taskArgs.epicUuid);
    const task = findTaskById(mutableBoard, taskArgs.taskUuid);

    console.log(`✅ Removed task "${task?.title}" from epic "${epic?.title}"`);
    console.log(`   Epic UUID: ${taskArgs.epicUuid.slice(0, 8)}...`);
    console.log(`   Task UUID: ${taskArgs.taskUuid.slice(0, 8)}...`);

    return { success: true, epic, task };
  });

const handleListEpics: CommandHandler = (_, context) =>
  withBoard(context, async (board) => {
    const mutableBoard = board as unknown as Board;
    const epics = getAllEpics(mutableBoard);

    if (epics.length === 0) {
      console.log('No epics found.');
      return { epics: [] };
    }

    console.log(`Found ${epics.length} epic(s):`);
    console.log('');

    for (const epic of epics) {
      const subtasks = getEpicSubtasks(mutableBoard, epic);
      console.log(`📋 ${epic.title}`);
      console.log(`   UUID: ${epic.uuid}`);
      console.log(`   Status: ${epic.status} (Epic: ${epic.epicStatus})`);
      console.log(`   Subtasks: ${subtasks.length}`);
      if (subtasks.length > 0) {
        console.log(`   Subtask breakdown:`);
        const statusCounts = subtasks.reduce(
          (acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );
        Object.entries(statusCounts).forEach(([status, count]) => {
          console.log(`     ${status}: ${count}`);
        });
      }
      console.log('');
    }

    return { epics };
  });

const handleEpicStatus: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    if (args.length === 0) {
      throw new CommandUsageError('epic-status requires an epic UUID');
    }

    const mutableBoard = board as unknown as Board;
    const epicUuid = requireArg(args[0], 'epic UUID');
    const epic = findTaskById(mutableBoard, epicUuid);

    if (!epic) {
      throw new CommandUsageError(`Epic with UUID ${epicUuid} not found`);
    }

    if (!isEpic(epic)) {
      throw new CommandUsageError(`Task ${epicUuid} is not an epic`);
    }

    const subtasks = getEpicSubtasks(mutableBoard, epic);

    console.log(`📋 Epic: ${epic.title}`);
    console.log(`   UUID: ${epic.uuid}`);
    console.log(`   Status: ${epic.status} (Epic: ${epic.epicStatus})`);
    console.log(`   Subtasks: ${subtasks.length}`);
    console.log('');

    if (subtasks.length > 0) {
      console.log('Subtasks:');
      for (const subtask of subtasks) {
        console.log(`   • ${subtask.title}`);
        console.log(`     UUID: ${subtask.uuid}`);
        console.log(`     Status: ${subtask.status}`);
        console.log('');
      }
    } else {
      console.log('No subtasks found for this epic.');
    }

    return { epic, subtasks };
  });

export { handleCreateEpic, handleAddTask, handleRemoveTask, handleListEpics, handleEpicStatus };
