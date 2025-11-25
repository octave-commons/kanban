import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createTransitionRulesEngine, TransitionRulesEngine } from '../../lib/transition-rules.js';
import type { CommandHandler } from '../types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const handleShowTransitions: CommandHandler = async (_args, context) => {
  try {
    const possiblePaths = [
      path.resolve(process.cwd(), 'promethean.kanban.json'),
      path.resolve(path.dirname(context.boardFile), '../promethean.kanban.json'),
      path.resolve(path.dirname(context.boardFile), '../../promethean.kanban.json'),
      path.resolve(path.dirname(context.boardFile), '../../../promethean.kanban.json'),
      path.resolve(__dirname, '../../promethean.kanban.json'),
      context.boardFile.replace('/boards/generated.md', '/promethean.kanban.json'),
    ];

    let transitionRulesEngine: TransitionRulesEngine | undefined;
    try {
      transitionRulesEngine = await createTransitionRulesEngine(possiblePaths);
    } catch (error) {
      console.warn(
        'Warning: Transition rules engine not available:',
        error instanceof Error ? error.message : String(error),
      );
    }

    if (!transitionRulesEngine) {
      throw new Error('Could not find or load transition rules configuration');
    }

    const overview = transitionRulesEngine.getTransitionsOverview();
    console.log('# 🔄 Kanban Transition Rules Overview');
    console.log('');
    console.log(`## Status: ${overview.enabled ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`## Enforcement: ${overview.enforcementMode}`);
    if (overview.dslAvailable) {
      console.log(`## DSL: 🟢 Clojure DSL available`);
    } else {
      console.log(`## DSL: 🔴 Clojure DSL not available`);
    }
    console.log('');

    if (overview.validTransitions.length > 0) {
      console.log('## Valid Transitions:');
      for (const transition of overview.validTransitions) {
        console.log(`- ${transition.from} → ${transition.to}`);
        if (transition.description) {
          console.log(`  ${transition.description}`);
        }
      }
      console.log('');
    }

    if (overview.globalRules.length > 0) {
      console.log('## Global Rules:');
      for (const rule of overview.globalRules) {
        console.log(`- ${rule}`);
      }
      console.log('');
    }

    return overview;
  } catch (error) {
    console.error(
      'Error loading transition rules:',
      error instanceof Error ? error.message : String(error),
    );
    return { error: error instanceof Error ? error.message : String(error) };
  }
};

export { handleShowTransitions };
