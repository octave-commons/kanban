import { createRebuildEventLogCommand } from '../../lib/rebuild-event-log-command.js';
import type { CommandHandler } from '../types.js';

const handleRebuildEventLog: CommandHandler = createRebuildEventLogCommand(
  'docs/agile/boards/generated.md',
  'docs/agile/tasks',
).execute;

export { handleRebuildEventLog };
