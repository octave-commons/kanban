import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import type { Board } from '../../lib/types.js';
import { columnKey, updateStatus, writeBoard } from '../../lib/kanban.js';
import {
  analyzeColumnNormalization,
  applyColumnNormalization,
} from '../../lib/pantheon/column-normalizer.js';
import { loadKanbanConfig } from '../../board/config.js';
import { makeEventLogManager } from '../../board/event-log/index.js';
import { TaskGitTracker } from '../../lib/task-git-tracker.js';
import { isGitDisabled } from '../../lib/utils/env-utils.js';
import type { CommandHandler } from '../types.js';
import { withBoard } from './shared.js';

async function findTaskFilePath(tasksDir: string, taskUuid: string): Promise<string | null> {
  try {
    const files = await readdir(tasksDir, { withFileTypes: true });

    for (const file of files) {
      if (!file.isFile() || !file.name.endsWith('.md')) {
        continue;
      }

      const filePath = path.join(tasksDir, file.name);
      try {
        const content = await readFile(filePath, 'utf8');
        if (content.includes(`uuid: "${taskUuid}"`) || content.includes(`uuid: '${taskUuid}'`)) {
          return filePath;
        }
      } catch {
        continue;
      }
    }

    return null;
  } catch {
    return null;
  }
}

const handleAudit: CommandHandler = (args, context) =>
  withBoard(context, async (board) => {
    const configResult = await loadKanbanConfig({ argv: process.argv, env: process.env });

    const eventLogManager = makeEventLogManager(configResult.config);
    const dryRun = !args.includes('--fix');
    const verbose = args.includes('--verbose');
    const columnFilter = args.find((arg) => arg.startsWith('--column='))?.split('=')[1];

    console.log(`🔍 Kanban Audit ${dryRun ? '(DRY RUN)' : '(FIX MODE)'}`);
    if (columnFilter) {
      console.log(`📋 Filtering by column: ${columnFilter}`);
    }
    console.log('');

    const allHistories = await eventLogManager.getAllTaskHistories();
    const allEvents = await eventLogManager.readEventLog();
    const gitTracker = new TaskGitTracker({ repoRoot: process.cwd() });

    console.log('🔍 Analyzing task state consistency...');

    const allTasks = board.columns.flatMap((column) => {
      if (columnFilter && columnKey(column.name) !== columnKey(columnFilter)) {
        return [];
      }
      return column.tasks.map((task) => ({ task, columnName: column.name }));
    });

    const totalTasks = allTasks.length;
    let processedTasks = 0;

    const taskAnalyses = await Promise.all(
      allTasks.map(async ({ task, columnName }) => {
        const [replayResult, taskFilePath] = await Promise.all([
          eventLogManager.replayTaskTransitions(task.uuid, task.status),
          findTaskFilePath(context.tasksDir, task.uuid),
        ]);

        const statusAnalysis = gitTracker.analyzeTaskStatus(
          task,
          taskFilePath || `${context.tasksDir}/${task.uuid}.md`,
        );

        processedTasks++;
        if (processedTasks % 50 === 0 || processedTasks === totalTasks) {
          process.stderr.write(
            `\r📊 Progress: ${processedTasks}/${totalTasks} (${Math.round((processedTasks / totalTasks) * 100)}%)`,
          );
        }

        return {
          task,
          columnName,
          replayResult,
          taskFilePath,
          statusAnalysis,
        };
      }),
    );

    process.stderr.write('\r✅ Analysis complete\n');

    const results = {
      inconsistencies: [] as Array<{
        task: any;
        current: string;
        expected: string;
        invalidEvent?: any;
      }>,
      orphanedTasks: [] as Array<{
        task: any;
        issues: string[];
        recommendations: string[];
      }>,
      untrackedTasks: [] as Array<{
        task: any;
        issues: string[];
        recommendations: string[];
      }>,
      tasksWithIssues: [] as Array<{
        task: any;
        issues: string[];
        recommendations: string[];
      }>,
      healthyTasks: 0,
    };

    for (const analysis of taskAnalyses) {
      const { task, replayResult, statusAnalysis } = analysis;

      if (statusAnalysis.isTrulyOrphaned) {
        results.orphanedTasks.push({
          task,
          issues: statusAnalysis.issues,
          recommendations: statusAnalysis.recommendations,
        });
      } else if (statusAnalysis.isUntracked) {
        results.untrackedTasks.push({
          task,
          issues: statusAnalysis.issues,
          recommendations: statusAnalysis.recommendations,
        });
      } else if (!statusAnalysis.isHealthy) {
        results.tasksWithIssues.push({
          task,
          issues: statusAnalysis.issues,
          recommendations: statusAnalysis.recommendations,
        });
      } else {
        results.healthyTasks++;
      }

      if (replayResult.finalStatus !== task.status) {
        results.inconsistencies.push({
          task,
          current: task.status,
          expected: replayResult.finalStatus,
          invalidEvent: replayResult.invalidEvent,
        });
      }
    }

    const inconsistenciesFound = results.inconsistencies.length;
    const illegalTransitionsFound = results.inconsistencies.filter(
      (inc) => inc.invalidEvent,
    ).length;
    const orphanedTasksFound = results.orphanedTasks.length;
    const untrackedTasksFound = results.untrackedTasks.length;
    const healthyTasksFound = results.healthyTasks;
    let inconsistenciesFixed = 0;

    if (!verbose) {
      console.log(`📊 AUDIT RESULTS:`);
      console.log(`   ✅ Healthy tasks: ${healthyTasksFound}`);
      if (inconsistenciesFound > 0) {
        console.log(`   ❌ Inconsistencies: ${inconsistenciesFound}`);
      }
      if (illegalTransitionsFound > 0) {
        console.log(`   🚨 Illegal transitions: ${illegalTransitionsFound}`);
      }
      if (orphanedTasksFound > 0) {
        console.log(`   🚨 Orphaned tasks: ${orphanedTasksFound}`);
      }
      if (untrackedTasksFound > 0) {
        console.log(`   ⚠️  Untracked tasks: ${untrackedTasksFound}`);
      }
      if (results.tasksWithIssues.length > 0) {
        console.log(`   ⚠️  Tasks with issues: ${results.tasksWithIssues.length}`);
      }
      console.log('');

      if (inconsistenciesFound > 0 || orphanedTasksFound > 0 || untrackedTasksFound > 0) {
        console.log('💡 Use --verbose for detailed breakdown');
        if (dryRun) {
          console.log('💡 Use --fix to automatically correct inconsistencies');
        }
      }
    } else {
      for (const orphaned of results.orphanedTasks) {
        console.log(`🚨 TRULY ORPHANED TASK: "${orphaned.task.title}"`);
        console.log(`   Task ID: ${orphaned.task.uuid}`);
        console.log(`   Status: ${orphaned.task.status}`);
        console.log(`   Issues: ${orphaned.issues.join(', ')}`);
        console.log('   Recommendations:');
        orphaned.recommendations.forEach((rec) => {
          console.log(`     • ${rec}`);
        });
        console.log('');
      }

      for (const untracked of results.untrackedTasks) {
        console.log(`⚠️  UNTRACKED TASK: "${untracked.task.title}"`);
        console.log(`   Task ID: ${untracked.task.uuid}`);
        console.log(`   Status: ${untracked.task.status}`);
        console.log(`   Issues: ${untracked.issues.join(', ')}`);
        console.log('   Recommendations:');
        untracked.recommendations.forEach((rec) => {
          console.log(`     • ${rec}`);
        });
        console.log('');
      }

      for (const issue of results.tasksWithIssues) {
        console.log(`⚠️  TASK WITH ISSUES: "${issue.task.title}"`);
        console.log(`   Task ID: ${issue.task.uuid}`);
        console.log(`   Status: ${issue.task.status}`);
        console.log(`   Issues: ${issue.issues.join(', ')}`);
        console.log('   Recommendations:');
        issue.recommendations.forEach((rec) => {
          console.log(`     • ${rec}`);
        });
        console.log('');
      }

      for (const inconsistency of results.inconsistencies) {
        console.log(`❌ INCONSISTENCY: Task "${inconsistency.task.title}"`);
        console.log(`   Current status: ${inconsistency.current}`);
        console.log(`   Expected status: ${inconsistency.expected}`);
        console.log(`   Task ID: ${inconsistency.task.uuid}`);

        if (inconsistency.invalidEvent) {
          console.log(
            `   🚨 ILLEGAL TRANSITION: ${inconsistency.invalidEvent.fromStatus} → ${inconsistency.invalidEvent.toStatus}`,
          );
          console.log(`   Event ID: ${inconsistency.invalidEvent.id}`);
          console.log(`   Timestamp: ${inconsistency.invalidEvent.timestamp}`);
        }

        if (!dryRun) {
          try {
            await updateStatus(
              board as Board,
              inconsistency.task.uuid,
              inconsistency.expected,
              context.boardFile,
              context.tasksDir,
              undefined,
              `Audit correction: Reset to last valid state from event log`,
              eventLogManager,
              'system',
            );
            inconsistenciesFixed++;
            console.log(`   ✅ FIXED: Status reset to ${inconsistency.expected}`);
          } catch (error) {
            console.log(`   ❌ FAILED TO FIX: ${error}`);
          }
        }
        console.log('');
      }
    }

    const boardTaskIds = new Set(allTasks.map(({ task }) => task.uuid));
    const orphanedEvents = Array.from(allHistories.entries())
      .filter(([taskId, events]) => !boardTaskIds.has(taskId) && events.length > 0)
      .map(([taskId, events]) => ({ taskId, events }));

    if (orphanedEvents.length > 0) {
      if (verbose) {
        for (const { taskId, events } of orphanedEvents) {
          console.log(
            `⚠️  ORPHANED EVENTS: Task ${taskId} has ${events.length} events but not in board`,
          );
          const lastEvent = events[events.length - 1];
          if (lastEvent) {
            console.log(`   Last event: ${lastEvent.toStatus} at ${lastEvent.timestamp}`);
          }
          console.log('');
        }
      } else {
        console.log(
          `⚠️  Orphaned events: ${orphanedEvents.length} tasks have events but not in board`,
        );
      }
    }

    if (!dryRun && untrackedTasksFound > 0) {
      console.log('🔧 UNTRACKED TASKS:');
      console.log('📝 Commit tracking will be updated automatically on next kanban operation');
      console.log('');

      if (verbose) {
        for (const untracked of results.untrackedTasks) {
          console.log(`⚠️  UNTRACKED TASK: "${untracked.task.title}"`);
          console.log(`   Task ID: ${untracked.task.uuid}`);
          console.log(`   Status: ${untracked.task.status}`);
          console.log('   Recommendation: Commit tracking will be updated on next operation');
          console.log('');
        }
      }
    }

    const canonicalStatuses = Array.from(configResult.config.statusValues ?? []);
    const columnAnalysis = await analyzeColumnNormalization(
      board.columns.map((col) => col.name),
      canonicalStatuses,
    );

    const actionableGroups = columnAnalysis.groups.filter((group) =>
      group.members.some((member) => member.action !== 'keep'),
    );

    if (actionableGroups.length > 0) {
      console.log('🧠 Pantheon Workflow: Column Normalization');
      for (const group of actionableGroups) {
        console.log(`   Canonical column "${group.canonicalName}":`);
        for (const member of group.members) {
          if (member.action === 'keep') continue;
          const verb = member.action === 'merge' ? 'merge into' : 'rename to';
          console.log(
            `     • ${member.originalName} → ${verb} ${group.canonicalName} (${member.reason})`,
          );
        }
      }

      if (dryRun) {
        console.log(
          '   💡 Run with --fix to apply these column normalization changes automatically',
        );
      } else {
        const applied = applyColumnNormalization(board as Board, columnAnalysis);
        if (applied > 0) {
          await writeBoard(context.boardFile, board as Board);
          console.log(
            `   ✅ Applied ${applied} column normalization ${applied === 1 ? 'update' : 'updates'}`,
          );
        } else {
          console.log('   ℹ️ Column names already aligned with canonical workflow states');
        }
      }
      console.log('');
    }

    const totalTasksAnalyzed = allTasks.length;
    console.log('📊 AUDIT SUMMARY:');
    console.log(`   Total tasks analyzed: ${totalTasksAnalyzed}`);
    console.log(`   Total events in log: ${allEvents.length}`);
    console.log(`   Inconsistencies found: ${inconsistenciesFound}`);
    console.log(`   Illegal transitions: ${illegalTransitionsFound}`);
    console.log('');
    console.log('🔍 TASK STATUS BREAKDOWN:');
    console.log(
      `   ✅ Healthy tasks: ${healthyTasksFound} (${((healthyTasksFound / totalTasksAnalyzed) * 100).toFixed(1)}%)`,
    );
    console.log(
      `   ⚠️  Untracked tasks: ${untrackedTasksFound} (${((untrackedTasksFound / totalTasksAnalyzed) * 100).toFixed(1)}%)`,
    );
    console.log(
      `   🚨 Truly orphaned tasks: ${orphanedTasksFound} (${((orphanedTasksFound / totalTasksAnalyzed) * 100).toFixed(1)}%)`,
    );

    if (!dryRun) {
      console.log(`   Inconsistencies fixed: ${inconsistenciesFixed}`);
    }

    console.log('');

    if (inconsistenciesFound > 0) {
      if (dryRun) {
        console.log('💡 Run with --fix to automatically correct these inconsistencies');
      } else {
        console.log('✅ Audit completed with automatic corrections');
      }
    } else {
      console.log('✅ No inconsistencies found - board state is consistent with event log');
    }

    const issues = [] as Array<{ type: 'error' | 'warning'; message: string }>;

    if (inconsistenciesFound > 0) {
      issues.push({
        type: 'error',
        message: `${inconsistenciesFound} status inconsistency${inconsistenciesFound === 1 ? '' : 'es'} found`,
      });
    }

    if (illegalTransitionsFound > 0) {
      issues.push({
        type: 'error',
        message: `${illegalTransitionsFound} illegal transition${illegalTransitionsFound === 1 ? '' : 's'} found`,
      });
    }

    if (orphanedTasksFound > 0) {
      issues.push({
        type: 'error',
        message: `${orphanedTasksFound} orphaned task${orphanedTasksFound === 1 ? '' : 's'} found`,
      });
    }

    if (untrackedTasksFound > 0) {
      issues.push({
        type: 'warning',
        message: `${untrackedTasksFound} untracked task${untrackedTasksFound === 1 ? '' : 's'} found`,
      });
    }

    if (results.tasksWithIssues.length > 0) {
      issues.push({
        type: 'warning',
        message: `${results.tasksWithIssues.length} task${results.tasksWithIssues.length === 1 ? '' : 's'} with issues`,
      });
    }

    return {
      issues,
      summary: {
        total: totalTasksAnalyzed,
        errors: inconsistenciesFound + illegalTransitionsFound + orphanedTasksFound,
        warnings: untrackedTasksFound + results.tasksWithIssues.length,
      },
      inconsistenciesFound,
      inconsistenciesFixed,
      illegalTransitionsFound,
      orphanedTasksFound,
      untrackedTasksFound,
      healthyTasksFound,
      dryRun,
    };
  });

const handleCommitStats: CommandHandler = (_args, context) =>
  withBoard(context, async (board) => {
    const gitTracker = new TaskGitTracker({ repoRoot: process.cwd() });

    const allTasks: any[] = [];
    for (const column of board.columns) {
      for (const task of column.tasks) {
        allTasks.push({ frontmatter: task });
      }
    }

    const stats = gitTracker.getCommitTrackingStats(allTasks);

    console.log('📊 Kanban Commit Tracking Statistics');
    console.log('');
    console.log(`Total tasks: ${stats.total}`);
    console.log(`Tasks with commit tracking: ${stats.withCommitTracking}`);
    console.log(`Orphaned tasks: ${stats.orphaned}`);
    console.log(`Tracking coverage: ${(100 - stats.orphanageRate).toFixed(1)}%`);
    console.log('');

    if (isGitDisabled()) {
      console.log('⚠️  Git tracking is disabled (KANBAN_DISABLE_GIT=true)');
      console.log('   Commit stats reflect existing metadata only');
      console.log('');
    }

    if (stats.orphaned > 0) {
      console.log(`⚠️  Found ${stats.orphaned} orphaned task(s) lacking proper commit tracking`);
      console.log('   Run "pnpm kanban audit --fix" to add commit tracking to these tasks');
      console.log('');
    }

    if (stats.withCommitTracking > 0) {
      console.log('✅ Commit tracking is working for tracked tasks');
      console.log('   Task files include lastCommitSha and commitHistory fields');
      console.log('   Git tracking is experimental and requires KANBAN_DISABLE_GIT=false');
      console.log('');
    }

    return stats;
  });

export { handleAudit, handleCommitStats };
