import { loggerFactory, mergeConfig, createConfigFromEnv } from '@promethean-os/logger';

let configured = false;

const envBool = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) return defaultValue;
  const normalized = value.toLowerCase();
  return normalized === 'true' || normalized === '1';
};

const redirectConsole = (targetName?: string) => {
  const log = loggerFactory.get(targetName || 'console') as any;
  const original = { ...console };

  const pipe = (level: 'info' | 'warn' | 'error' | 'debug', args: any[]) => {
    const message = args.map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg))).join(' ');
    try {
      if (log && typeof log[level] === 'function') {
        log[level](message);
        return;
      }
      if (log && typeof log.log === 'function') {
        log.log(level, message);
        return;
      }
    } catch (err) {
      // fall through to original
    }
    original[level]?.call(original, message);
  };

  console.log = (...args: any[]) => pipe('info', args);
  console.info = (...args: any[]) => pipe('info', args);
  console.warn = (...args: any[]) => pipe('warn', args);
  console.error = (...args: any[]) => pipe('error', args);
  console.debug = (...args: any[]) => pipe('debug', args);
  // Keep trace/time/timeEnd pointing to original to avoid breaking tooling
  console.trace = original.trace?.bind(original) ?? console.trace;
  console.time = original.time?.bind(original) ?? console.time;
  console.timeEnd = original.timeEnd?.bind(original) ?? console.timeEnd;
  console.dir = (...args: any[]) => pipe('debug', args);
};

export const configureLogging = (): void => {
  if (configured) return;

  const baseConfig = mergeConfig(createConfigFromEnv());
  const isTest = process.env.NODE_ENV === 'test' || typeof process.env.AVA_PATH === 'string';
  const sessionId =
    process.env.KANBAN_LOG_SESSION || new Date().toISOString().replace(/[:.]/g, '-');

  const consoleEnabled = envBool(process.env.KANBAN_LOG_CONSOLE, false);
  // Allow tests to opt-in to file logging explicitly
  const fileEnabled = envBool(process.env.KANBAN_LOG_FILE_ENABLED, !isTest) ||
    (isTest && envBool(process.env.KANBAN_LOG_FILE_ENABLED, false));
  const logDir = process.env.KANBAN_LOG_DIR || 'logs';
  const logFile = process.env.KANBAN_LOG_FILE || `kanban-${sessionId}-%DATE%.log`;

  const finalConfig = mergeConfig({
    ...baseConfig,
    service: baseConfig.service || 'kanban',
    silent: isTest || baseConfig.silent === true,
    console: {
      ...baseConfig.console,
      enabled: consoleEnabled && !isTest,
    },
    file: {
      ...baseConfig.file,
      enabled: fileEnabled,
      dirname: logDir,
      filename: logFile,
    },
  });

  loggerFactory.configure(finalConfig);

  if (envBool(process.env.KANBAN_REDIRECT_CONSOLE, isTest)) {
    redirectConsole('console');
  }

  configured = true;
};

// Auto-configure on first import.
configureLogging();

export const getLogger = (name?: string) => loggerFactory.get(name);
