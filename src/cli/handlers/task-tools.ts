import type { CommandHandler } from '../types.js';
import { CommandUsageError } from '../errors.js';
import { compareTasks, suggestTaskBreakdown, prioritizeTasks } from '../../lib/task-tools.js';

const handleCompareTasks: CommandHandler = async (args, context) => {
  if (args.length === 0) {
    throw new CommandUsageError('compare-tasks requires task UUIDs separated by commas');
  }

  const taskUuids = args[0]!.split(',');
  const comparisons = await compareTasks(taskUuids, context.boardFile, context.tasksDir);
  return comparisons;
};

const handleBreakdownTask: CommandHandler = async (args, context) => {
  if (args.length === 0) {
    throw new CommandUsageError('breakdown-task requires a task UUID');
  }

  const taskUuid = args[0]!;
  const breakdown = await suggestTaskBreakdown(taskUuid, context.tasksDir);
  return breakdown;
};

const handlePrioritizeTasks: CommandHandler = async (_args) => {
  if (_args.length === 0) {
    throw new CommandUsageError('prioritize-tasks requires task UUIDs separated by commas');
  }

  const taskUuids = _args[0]!.split(',');
  const priorities = await prioritizeTasks(taskUuids, {});
  return priorities;
};

export { handleCompareTasks, handleBreakdownTask, handlePrioritizeTasks };
