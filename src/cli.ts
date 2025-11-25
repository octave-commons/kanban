import './lib/logging.js';
import { runCommanderCli } from './cli/commander.js';
import { normalizeLegacyArgs } from './cli/legacy.js';

async function main(): Promise<void> {
  const normalizedArgs = normalizeLegacyArgs(process.argv.slice(2));
  await runCommanderCli(['node', 'kanban', ...normalizedArgs]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
