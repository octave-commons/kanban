export async function indexForSearch(
  _tasksDir: string,
  _options?: { argv?: string[]; env?: Record<string, string | undefined> },
): Promise<{ started: boolean; tasksIndexed: number; wroteIndexFile: boolean }> {
  return {
    started: true,
    tasksIndexed: 0,
    wroteIndexFile: false,
  };
}
