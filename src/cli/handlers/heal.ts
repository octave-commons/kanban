import type { CommandHandler } from '../types.js';
import { CommandUsageError } from '../errors.js';

function parseArgValue(argv: ReadonlyArray<string>, flag: string, defaultValue: any): any {
  const index = argv.indexOf(flag);
  if (index === -1 || index === argv.length - 1) {
    return defaultValue;
  }

  const value = argv[index + 1];
  if (!value) {
    return defaultValue;
  }

  const numValue = Number.parseInt(value, 10);
  if (!Number.isNaN(numValue)) {
    return numValue;
  }

  return value;
}

function parseArgValues(argv: ReadonlyArray<string>, flag: string): string[] {
  const values: string[] = [];
  let index = argv.indexOf(flag);

  while (index !== -1 && index < argv.length - 1) {
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) {
      break;
    }
    values.push(value);
    index = argv.indexOf(flag, index + 1);
  }

  return values;
}

const handleHeal: CommandHandler = (args, context) =>
  (async () => {
    const { createHealCommand } = await import('../../lib/heal/heal-command.js');

    if (args.length === 0) {
      throw new CommandUsageError('heal command requires a reason for healing operation');
    }

    const reason = args.join(' ');
    const healCommand = createHealCommand(context.boardFile, context.tasksDir);
    const argv = context.argv || [];

    const options = {
      reason,
      dryRun: argv.includes('--dry-run'),
      createTags: !argv.includes('--no-tags'),
      pushTags: argv.includes('--push-tags'),
      analyzeGit: !argv.includes('--no-git'),
      gitHistoryDepth: parseArgValue(argv, '--git-depth', 50),
      searchTerms: parseArgValues(argv, '--search'),
      columnFilter: parseArgValues(argv, '--column'),
      labelFilter: parseArgValues(argv, '--label'),
      includeTaskAnalysis: !argv.includes('--no-task-analysis'),
      includePerformanceMetrics: !argv.includes('--no-metrics'),
    };

    console.log(`🏥 Starting kanban healing operation...`);
    console.log(`   Reason: ${reason}`);
    console.log(`   Dry run: ${options.dryRun ? 'Yes' : 'No'}`);
    console.log(`   Create tags: ${options.createTags ? 'Yes' : 'No'}`);
    console.log('');

    if (argv.includes('--recommendations')) {
      const recommendations = await healCommand.getHealingRecommendations(options);

      console.log('🔍 Healing Recommendations:');
      if (recommendations.recommendations.length > 0) {
        recommendations.recommendations.forEach((rec) => {
          console.log(`   • ${rec}`);
        });
      } else {
        console.log('   No specific recommendations at this time.');
      }

      if (recommendations.criticalIssues.length > 0) {
        console.log('');
        console.log('⚠️  Critical Issues:');
        recommendations.criticalIssues.forEach((issue) => {
          const icon =
            issue.severity === 'critical'
              ? '🚨'
              : issue.severity === 'high'
                ? '⚠️'
                : issue.severity === 'medium'
                  ? '⚡'
                  : 'ℹ️';
          console.log(`   ${icon} ${issue.description}`);
          console.log(`      Suggested action: ${issue.suggestedAction}`);
        });
      }

      if (recommendations.relatedScars.length > 0) {
        console.log('');
        console.log('📚 Related Healing Operations:');
        recommendations.relatedScars.forEach((scar) => {
          console.log(`   • ${scar.scar.tag} (relevance: ${Math.round(scar.relevance * 100)}%)`);
          console.log(`     ${scar.reason}`);
        });
      }

      return { recommendations };
    }

    if (context.argv.includes('--analyze-history')) {
      const analysis = await healCommand.getScarHistoryAnalysis();

      console.log('📈 Scar History Analysis:');
      console.log(`   Total healing operations: ${analysis.totalScars}`);
      console.log(`   Success rate: ${analysis.successRate.toFixed(1)}%`);

      if (analysis.averageHealingTime) {
        console.log(`   Average healing time: ${analysis.averageHealingTime.toFixed(1)} hours`);
      }

      if (analysis.commonReasons.length > 0) {
        console.log('');
        console.log('🔝 Most Common Healing Reasons:');
        analysis.commonReasons.slice(0, 5).forEach((reason) => {
          console.log(
            `   ${reason.reason}: ${reason.count} times (${reason.percentage.toFixed(1)}%)`,
          );
        });
      }

      if (analysis.frequentlyHealedFiles.length > 0) {
        console.log('');
        console.log('📁 Frequently Healed Files:');
        analysis.frequentlyHealedFiles.slice(0, 10).forEach((file) => {
          console.log(`   ${file.file}: ${file.count} times`);
        });
      }

      return { analysis };
    }

    const result = await healCommand.execute(options);

    console.log('');
    console.log('🏥 Healing Operation Results:');
    console.log(`   Status: ${result.status}`);
    console.log(`   Summary: ${result.summary}`);
    console.log(`   Tasks modified: ${result.tasksModified}`);
    console.log(`   Files changed: ${result.filesChanged}`);

    if (result.contextBuildTime) {
      console.log(`   Context build time: ${result.contextBuildTime}ms`);
    }

    if (result.healingTime) {
      console.log(`   Healing time: ${result.healingTime}ms`);
    }

    if (result.totalTime) {
      console.log(`   Total time: ${result.totalTime}ms`);
    }

    if (result.scar) {
      console.log('');
      console.log('🏷️  Scar Record Created:');
      console.log(`   Tag: ${result.scar.tag}`);
      console.log(
        `   Range: ${result.scar.startSha.substring(0, 8)}..${result.scar.endSha.substring(0, 8)}`,
      );
    }

    if (result.tagResult) {
      console.log('');
      console.log('🏷️  Git Tag:');
      if (result.tagResult.success) {
        console.log(`   Created: ${result.tagResult.tag}`);
      } else {
        console.log(`   Failed: ${result.tagResult.error}`);
      }
    }

    if (result.errors.length > 0) {
      console.log('');
      console.log('❌ Errors:');
      result.errors.forEach((error) => {
        console.log(`   • ${error}`);
      });
    }

    return result;
  })();

export { handleHeal };
