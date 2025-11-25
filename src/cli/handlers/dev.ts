import type { CommandHandler } from '../types.js';
import { CommandUsageError } from '../errors.js';
import { parsePort, requireArg } from './shared.js';
import { KanbanDevServer } from '../../lib/dev-server.js';

type DevOptions = Readonly<{
  host?: string;
  port?: number;
  noAutoGit?: boolean;
  noAutoOpen?: boolean;
  debounceMs?: number;
}>;

const parseDevOptions = (tokens: ReadonlyArray<string>, acc: DevOptions = {}): DevOptions => {
  if (tokens.length === 0) {
    return acc;
  }
  const [head, ...tail] = tokens;
  const token = head ?? '';

  if (token.startsWith('--port=')) {
    const value = token.slice('--port='.length);
    return parseDevOptions(tail, { ...acc, port: parsePort(value) });
  }
  if (token === '--port') {
    const [next, ...rest] = tail;
    const port = parsePort(requireArg(next, 'port'));
    return parseDevOptions(rest, { ...acc, port });
  }
  if (token.startsWith('--host=')) {
    const value = token.slice('--host='.length).trim();
    if (value.length === 0) {
      throw new CommandUsageError('Invalid host value');
    }
    return parseDevOptions(tail, { ...acc, host: value });
  }
  if (token === '--host') {
    const [next, ...rest] = tail;
    const value = requireArg(next, 'host');
    return parseDevOptions(rest, { ...acc, host: value });
  }
  if (token === '--no-auto-git') {
    return parseDevOptions(tail, { ...acc, noAutoGit: true });
  }
  if (token === '--no-auto-open') {
    return parseDevOptions(tail, { ...acc, noAutoOpen: true });
  }
  if (token.startsWith('--debounce=')) {
    const value = token.slice('--debounce='.length);
    const debounce = Number.parseInt(value, 10);
    if (!Number.isInteger(debounce) || debounce < 100 || debounce > 10000) {
      throw new CommandUsageError('Debounce must be between 100ms and 10s');
    }
    return parseDevOptions(tail, { ...acc, debounceMs: debounce });
  }

  throw new CommandUsageError(`Unknown dev option: ${token}`);
};

const handleDev: CommandHandler = async (args, context) => {
  const options = parseDevOptions(args);

  const devServer = new KanbanDevServer({
    boardFile: context.boardFile,
    tasksDir: context.tasksDir,
    host: options.host,
    port: options.port,
    autoGit: !options.noAutoGit,
    autoOpen: !options.noAutoOpen,
    debounceMs: options.debounceMs,
  });

  const cleanup = async () => {
    console.log('\n[kanban-dev] Shutting down development server...');
    await devServer.stop();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  try {
    await devServer.start();
    console.log('[kanban-dev] Development server is running. Press Ctrl+C to stop.');

    return new Promise(() => {});
  } catch (error) {
    console.error('[kanban-dev] Failed to start development server:', error);
    throw error;
  }
};

export { handleDev, parseDevOptions };
