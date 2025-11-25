import { columnKey } from '../../lib/kanban.js';
import { updateStatus } from '../../lib/kanban.js';
import { loadKanbanConfig } from '../../board/config.js';
import { makeEventLogManager } from '../../board/event-log/index.js';
import { createWIPLimitEnforcement } from '../../lib/wip-enforcement.js';
import type { Board } from '../../lib/types.js';
import { CommandUsageError } from '../errors.js';

import type { CliContext, CommandHandler } from '../types.js';

const requireArg = (value: string | undefined, label: string): string => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  throw new CommandUsageError(`Missing required ${label}.`);
};

const withBoard = async <T>(
  context: CliContext,
  effect: (board: Board) => Promise<T> | T,
): Promise<T> => {
  const { loadBoard } = await import('../../lib/kanban.js');
  const board = await loadBoard(context.boardFile, context.tasksDir);
  return effect(board as Board);
};

const findPreviousColumn = (
  currentColumnName: string,
  columns: ReadonlyArray<{ name: string }>,
) => {
  const workflowOrder = [
    'icebox',
    'incoming',
    'accepted',
    'breakdown',
    'blocked',
    'ready',
    'todo',
    'in_progress',
    'review',
    'document',
    'done',
    'rejected',
  ];
  const currentIndex = workflowOrder.findIndex(
    (col) => columnKey(col) === columnKey(currentColumnName),
  );

  if (currentIndex <= 0) return null;

  const previousColumnName = workflowOrder[currentIndex - 1];
  if (!previousColumnName) return null;
  return columns.find((col) => columnKey(col.name) === columnKey(previousColumnName)) || null;
};

const getPriorityNumeric = (priority: string | number | undefined): number => {
  if (typeof priority === 'number') return priority;
  if (typeof priority === 'string') {
    const match = priority.match(/P(\d+)/i);
    if (match?.[1]) return parseInt(match[1], 10);
    if (priority.toLowerCase() === 'critical') return 0;
    if (priority.toLowerCase() === 'high') return 1;
    if (priority.toLowerCase() === 'medium') return 2;
    if (priority.toLowerCase() === 'low') return 3;
  }
  return 3; // Default to low priority
};

export const handleEnforceWipLimits: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    const configResult = await loadKanbanConfig({
      argv: process.argv,
      env: process.env,
    });

    const eventLogManager = makeEventLogManager(configResult.config);
    const dryRun = !args.includes('--fix');
    const columnFilter = args.find((arg) => arg.startsWith('--column='))?.split('=')[1];

    console.log(`🚧 WIP Limits Enforcement ${dryRun ? '(DRY RUN)' : '(FIX MODE)'}`);
    if (columnFilter) {
      console.log(`📋 Filtering by column: ${columnFilter}`);
    }
    console.log('');

    let totalViolations = 0;
    let totalCorrections = 0;

    for (const column of board.columns) {
      if (columnFilter && columnKey(column.name) !== columnKey(columnFilter)) {
        continue;
      }

      if (column.limit && column.tasks.length > column.limit) {
        const violationCount = column.tasks.length - column.limit;
        totalViolations += violationCount;

        console.log(`🚨 WIP VIOLATION: ${column.name}`);
        console.log(
          `   Current: ${column.tasks.length}/${column.limit} (${violationCount} over limit)`,
        );

        const sortedTasks = [...column.tasks].sort((a, b) => {
          const priorityA = getPriorityNumeric(a.priority);
          const priorityB = getPriorityNumeric(b.priority);
          return priorityB - priorityA; // Reverse sort (higher priority first)
        });

        const tasksToMove = sortedTasks.slice(-violationCount);

        console.log(`   Tasks to move back: ${tasksToMove.length}`);

        for (const task of tasksToMove) {
          console.log(`   - "${task.title}" (${task.priority})`);

          if (!dryRun) {
            try {
              const previousColumn = findPreviousColumn(column.name, board.columns);
              if (previousColumn) {
                await updateStatus(
                  board as Board,
                  task.uuid,
                  previousColumn.name,
                  context.boardFile,
                  context.tasksDir,
                  undefined,
                  `WIP limit enforcement: moved from ${column.name} to ${previousColumn.name}`,
                  eventLogManager,
                  'system',
                );
                totalCorrections++;
                console.log(`     ✅ Moved to ${previousColumn.name}`);
              } else {
                console.log(`     ⚠️  No previous column found for ${column.name}`);
              }
            } catch (error) {
              console.log(`     ❌ Failed to move: ${error}`);
            }
          }
        }
        console.log('');
      }
    }

    console.log('📊 WIP ENFORCEMENT SUMMARY:');
    console.log(`   Total violations: ${totalViolations}`);
    console.log(`   Total corrections: ${totalCorrections}`);

    if (totalViolations > 0) {
      if (dryRun) {
        console.log('💡 Run with --fix to automatically move lowest priority tasks');
      } else {
        console.log('✅ WIP limits enforced');
      }
    } else {
      console.log('✅ No WIP limit violations found');
    }

    return { violations: totalViolations, corrections: totalCorrections, dryRun };
  });

export const handleWipMonitor: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    const configResult = await loadKanbanConfig();
    const wipEnforcement = await createWIPLimitEnforcement({
      config: configResult.config,
    });

    const monitor = await wipEnforcement.getCapacityMonitor(board as Board);
    const watchMode = args.includes('--watch');
    const interval = parseInt(
      args.find((arg) => arg.startsWith('--interval='))?.split('=')[1] || '5000',
    );

    console.log('📊 Real-time WIP Capacity Monitor');
    console.log(`🕐 Last updated: ${new Date(monitor.timestamp).toLocaleString()}`);
    console.log('');

    const displayMonitor = (data: typeof monitor) => {
      console.clear();
      console.log('📊 Real-time WIP Capacity Monitor');
      console.log(`🕐 Last updated: ${new Date(data.timestamp).toLocaleString()}`);
      console.log(`🚨 Total violations: ${data.totalViolations}`);
      console.log(`📈 Average utilization: ${data.utilization.average.toFixed(1)}%`);
      console.log('');

      for (const column of data.columns) {
        const icon =
          column.status === 'critical'
            ? '🚨'
            : column.status === 'violation'
              ? '❌'
              : column.status === 'warning'
                ? '⚠️'
                : '✅';

        const utilizationBar = column.limit
          ? '█'.repeat(Math.floor(column.utilization / 10)) +
            '░'.repeat(10 - Math.floor(column.utilization / 10))
          : 'N/A';

        console.log(
          `${icon} ${column.name.padEnd(15)} ${column.current.toString().padStart(3)}/${
            column.limit?.toString().padStart(3) || '∞'
          } ${utilizationBar} ${column.utilization.toFixed(1)}%`,
        );
      }

      console.log('');
      if (data.totalViolations > 0) {
        console.log('💡 Run "kanban enforce-wip-limits --fix" to resolve violations');
      }
      if (watchMode) {
        console.log('🔄 Watching for changes... (Ctrl+C to stop)');
      }
    };

    if (watchMode) {
      console.log('🔄 Starting real-time monitoring...');
      const intervalId = setInterval(async () => {
        const freshMonitor = await wipEnforcement.getCapacityMonitor();
        displayMonitor(freshMonitor);
      }, interval);

      process.on('SIGINT', () => {
        clearInterval(intervalId);
        console.log('\n👋 Monitoring stopped');
        process.exit(0);
      });

      displayMonitor(monitor);
    } else {
      displayMonitor(monitor);
    }

    return monitor;
  });

export const handleWipCompliance: CommandHandler = (args) =>
  withBoard({} as any, async (_b) => {
    const configResult = await loadKanbanConfig();
    const wipEnforcement = await createWIPLimitEnforcement({
      config: configResult.config,
    });

    const timeframe = (args.find((arg) => arg.startsWith('--timeframe='))?.split('=')[1] ||
      '24h') as '24h' | '7d' | '30d';
    const format = args.includes('--json') ? 'json' : 'table';

    console.log(`📋 WIP Compliance Report (${timeframe})`);
    console.log('');

    const report = await wipEnforcement.generateComplianceReport(timeframe);

    if (format === 'json') {
      return report;
    }

    console.log(`📊 Summary:`);
    console.log(`   Total violations: ${report.totalViolations}`);
    console.log(`   Override rate: ${report.overrideRate.toFixed(1)}%`);
    console.log('');

    if (Object.keys(report.violationsByColumn).length > 0) {
      console.log('📊 Violations by Column:');
      for (const [column, count] of Object.entries(report.violationsByColumn)) {
        console.log(`   ${column}: ${count}`);
      }
      console.log('');
    }

    if (Object.keys(report.violationsBySeverity).length > 0) {
      console.log('🚨 Violations by Severity:');
      for (const [severity, count] of Object.entries(report.violationsBySeverity)) {
        const icon = severity === 'critical' ? '🚨' : severity === 'error' ? '❌' : '⚠️';
        console.log(`   ${icon} ${severity}: ${count}`);
      }
      console.log('');
    }

    if (report.topViolatedColumns.length > 0) {
      console.log('🔥 Top Violated Columns:');
      for (const { column, violations } of report.topViolatedColumns) {
        console.log(`   ${column}: ${violations} violations`);
      }
      console.log('');
    }

    if (report.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      for (const recommendation of report.recommendations) {
        console.log(`   ${recommendation}`);
      }
    }

    return report;
  });

export const handleWipViolations: CommandHandler = (args) =>
  withBoard({} as any, async (_b) => {
    const configResult = await loadKanbanConfig();
    const wipEnforcement = await createWIPLimitEnforcement({
      config: configResult.config,
    });

    const limit = parseInt(args.find((arg) => arg.startsWith('--limit='))?.split('=')[1] || '20');
    const column = args.find((arg) => arg.startsWith('--column='))?.split('=')[1];
    const severity = args.find((arg) => arg.startsWith('--severity='))?.split('=')[1] as
      | 'warning'
      | 'error'
      | 'critical'
      | undefined;
    const since = args.find((arg) => arg.startsWith('--since='))?.split('=')[1];

    console.log('🚨 WIP Limit Violations History');
    if (column) console.log(`📋 Column: ${column}`);
    if (severity) console.log(`🔍 Severity: ${severity}`);
    if (since) console.log(`📅 Since: ${since}`);
    console.log('');

    const violations = wipEnforcement.getViolationHistory({
      limit,
      column,
      severity,
      since,
    });

    if (violations.length === 0) {
      console.log('✅ No violations found matching the criteria');
      return [];
    }

    for (const violation of violations) {
      const icon =
        violation.severity === 'critical' ? '🚨' : violation.severity === 'error' ? '❌' : '⚠️';

      console.log(`${icon} ${new Date(violation.timestamp).toLocaleString()}`);
      console.log(`   Task: ${violation.taskTitle}`);
      console.log(`   Column: ${violation.column} (${violation.current}/${violation.limit})`);
      console.log(`   Utilization: ${violation.utilization.toFixed(1)}%`);
      console.log(`   Blocked: ${violation.blocked ? 'Yes' : 'No'}`);

      if (violation.overrideReason) {
        console.log(`   🔓 Override: ${violation.overrideReason} by ${violation.overrideBy}`);
      }

      if (violation.suggestions.length > 0) {
        console.log(`   💡 Suggestions:`);
        for (const suggestion of violation.suggestions) {
          console.log(`     • ${suggestion.description}`);
        }
      }
      console.log('');
    }

    return violations;
  });

export const handleWipSuggestions: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    const configResult = await loadKanbanConfig();
    const wipEnforcement = await createWIPLimitEnforcement({
      config: configResult.config,
    });

    const column = requireArg(args[0], 'column name');
    const apply = args.includes('--apply');

    console.log(`💡 Capacity Balancing Suggestions for "${column}"`);
    console.log('');

    const suggestions = await wipEnforcement.generateCapacitySuggestions(column, board as Board);

    if (suggestions.length === 0) {
      console.log('✅ No capacity balancing suggestions needed');
      return [];
    }

    for (const suggestion of suggestions) {
      const icon =
        suggestion.priority === 'high' ? '🔥' : suggestion.priority === 'medium' ? '⚡' : '💡';

      console.log(`${icon} ${suggestion.description}`);
      console.log(`   Priority: ${suggestion.priority}`);
      console.log(`   Impact: ${suggestion.impact.taskCount} tasks affected`);

      if (suggestion.tasks && suggestion.tasks.length > 0) {
        console.log(`   Tasks to move:`);
        for (const task of suggestion.tasks) {
          console.log(`     • ${task.title} (${task.priority})`);
        }
      }
      console.log('');
    }

    if (apply && suggestions.length > 0) {
      console.log('🔧 Applying suggestions...');
      console.log('⚠️  Auto-apply feature not yet implemented');
    }

    return suggestions;
  });
