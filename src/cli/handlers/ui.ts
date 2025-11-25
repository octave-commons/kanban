import type { CommandHandler } from '../types.js';
import { CommandUsageError } from '../errors.js';
import { parsePort, requireArg } from './shared.js';
import { serveKanbanUI } from '../../lib/ui-server.js';

type UiOptions = Readonly<{ host?: string; port?: number }>;

const parseUiOptions = (tokens: ReadonlyArray<string>, acc: UiOptions = {}): UiOptions => {
  if (tokens.length === 0) {
    return acc;
  }
  const [head, ...tail] = tokens;
  const token = head ?? '';
  if (token.startsWith('--port=')) {
    const value = token.slice('--port='.length);
    return parseUiOptions(tail, { ...acc, port: parsePort(value) });
  }
  if (token === '--port') {
    const [next, ...rest] = tail;
    const port = parsePort(requireArg(next, 'port'));
    return parseUiOptions(rest, { ...acc, port });
  }
  if (token.startsWith('--host=')) {
    const value = token.slice('--host='.length).trim();
    if (value.length === 0) {
      throw new CommandUsageError('Invalid host value');
    }
    return parseUiOptions(tail, { ...acc, host: value });
  }
  if (token === '--host') {
    const [next, ...rest] = tail;
    const value = requireArg(next, 'host');
    return parseUiOptions(rest, { ...acc, host: value });
  }
  throw new CommandUsageError(`Unknown ui option: ${token}`);
};

const handleUi: CommandHandler = async (args, context) => {
  const options = parseUiOptions(args);
  await serveKanbanUI({
    boardFile: context.boardFile,
    tasksDir: context.tasksDir,
    host: options.host,
    port: options.port,
  });
  return null;
};

export { handleUi, parseUiOptions };
