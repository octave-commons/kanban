import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export async function withTempDir(_t?: { context?: unknown }): Promise<string> {
  return mkdtemp(join(tmpdir(), 'kanban-plugin-git-index-'));
}
