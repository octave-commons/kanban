// Local AVA config for Stryker mutation testing
import os from 'node:os';

const cpuHint =
  (typeof os.availableParallelism === 'function' && os.availableParallelism()) ||
  (os.cpus?.().length ?? 4);
const defaultConcurrency = Math.max(2, Math.min(cpuHint, 8));
const resolvedConcurrency = Number.parseInt(
  process.env.AVA_CONCURRENCY || `${defaultConcurrency}`,
  10,
);

const kanbanConfig = {
  files: [
    'dist/tests/**/*.test.js',
    '!dist/tests/**/*integration*.test.js',
    '!dist/tests/**/*e2e*.test.js',
  ],
  nodeArguments: [
    '--import',
    "data:text/javascript,import { register } from 'node:module'; import { pathToFileURL } from 'node:url'; register('esmock', pathToFileURL('./'));",
  ],
  environmentVariables: {
    KANBAN_DISABLE_GIT: 'true',
    KANBAN_REDIRECT_CONSOLE: 'true',
    KANBAN_LOG_FILE_ENABLED: 'true',
    KANBAN_LOG_DIR: 'logs/tests',
    KANBAN_LOG_CONSOLE: 'false',
  },
  require: ['./dist/tests/helpers/silence-logs.js'],
  timeout: '30s',
  concurrency: resolvedConcurrency,
  verbose: true,
};

export default kanbanConfig;
