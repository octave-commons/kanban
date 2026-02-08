export const envBool = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) return defaultValue;
  const normalized = value.toLowerCase();
  return normalized === 'true' || normalized === '1';
};

export const isGitDisabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  envBool(env.KANBAN_DISABLE_GIT, true);

export const shouldSkipGitChecks = (env: NodeJS.ProcessEnv = process.env): boolean =>
  envBool(env.KANBAN_SKIP_GIT_CHECKS, isGitDisabled(env));

export const shouldSkipFileChecks = (env: NodeJS.ProcessEnv = process.env): boolean =>
  envBool(env.KANBAN_SKIP_FILE_CHECKS, false);
