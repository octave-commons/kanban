export const LEGACY_FLAG_MAP = Object.freeze(
  new Map<string, string>([
    ['--kanban', '--board-file'],
    ['--tasks', '--tasks-dir'],
  ]),
);

const LEGACY_FLAG_ENTRIES = Array.from(LEGACY_FLAG_MAP.entries());

export const normalizeLegacyToken = (token: string): string =>
  LEGACY_FLAG_ENTRIES.reduce((current, [legacy, mapped]) => {
    if (current === legacy) {
      return mapped;
    }
    if (current.startsWith(`${legacy}=`)) {
      return `${mapped}=${current.slice(legacy.length + 1)}`;
    }
    return current;
  }, token);

export const normalizeLegacyArgs = (args: ReadonlyArray<string>): ReadonlyArray<string> =>
  args.map(normalizeLegacyToken);

export const LEGACY_ENV_MAPPINGS = Object.freeze([
  ['KANBAN_PATH', 'KANBAN_BOARD_FILE'],
  ['TASKS_PATH', 'KANBAN_TASKS_DIR'],
] as const);

export const applyLegacyEnv = (env: Readonly<NodeJS.ProcessEnv>): Readonly<NodeJS.ProcessEnv> => {
  const patches = LEGACY_ENV_MAPPINGS.reduce<ReadonlyArray<readonly [string, string]>>(
    (acc, [legacy, modern]) => {
      const legacyValue = env[legacy];
      if (typeof legacyValue === 'string' && typeof env[modern] !== 'string') {
        return [...acc, [modern, legacyValue] as const];
      }
      return acc;
    },
    [],
  );
  if (patches.length === 0) {
    return { ...env };
  }
  return {
    ...env,
    ...Object.fromEntries(patches),
  };
};
