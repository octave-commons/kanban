// Ensure console output is redirected to the logger and not stdout during tests.
process.env.KANBAN_REDIRECT_CONSOLE = process.env.KANBAN_REDIRECT_CONSOLE ?? 'true';
process.env.KANBAN_LOG_CONSOLE = process.env.KANBAN_LOG_CONSOLE ?? 'false';
process.env.KANBAN_LOG_FILE_ENABLED = process.env.KANBAN_LOG_FILE_ENABLED ?? 'true';
process.env.KANBAN_LOG_DIR = process.env.KANBAN_LOG_DIR ?? 'logs/tests';
process.env.KANBAN_LOG_FILE = process.env.KANBAN_LOG_FILE ?? 'kanban-test-%DATE%.log';
process.env.LOG_CONSOLE_ENABLED = process.env.LOG_CONSOLE_ENABLED ?? 'false';
process.env.LOG_SILENT = process.env.LOG_SILENT ?? 'true';

// Import logging bootstrap to apply the configuration and console redirect.
import '../../lib/logging.js';
