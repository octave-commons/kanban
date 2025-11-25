export default {
  files: ['dist/tests/**/*.test.js'],
  timeout: '30s',
  concurrency: 1,
  verbose: true,
  environmentVariables: {
    KANBAN_DISABLE_GIT: 'true',
    KANBAN_REDIRECT_CONSOLE: 'true',
    KANBAN_LOG_FILE_ENABLED: 'true',
    KANBAN_LOG_DIR: 'logs/tests',
    KANBAN_LOG_CONSOLE: 'false',
  },
};
