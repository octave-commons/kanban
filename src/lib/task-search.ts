import type { Board, Task } from './types.js';
import { tokenize } from './kanban-utils.js';

export const searchTasks = async (
  board: Board,
  term: string,
): Promise<{ exact: Task[]; similar: Task[] }> => {
  const needle = term.trim().toLowerCase();
  const all: Task[] = board.columns.flatMap((c) => c.tasks.map((t) => ({ ...t, status: c.name })));
  const exact = all.filter(
    (t) =>
      t.title.toLowerCase().includes(needle) || (t.content ?? '').toLowerCase().includes(needle),
  );

  const needToks = new Set(tokenize(term));
  const score = (t: Task) => {
    const bag = new Set([...tokenize(t.title), ...tokenize(t.content ?? ''), ...(t.labels ?? [])]);
    let s = 0;
    for (const tok of needToks) if (bag.has(tok)) s++;
    return s;
  };
  const similar = all
    .filter((t) => !exact.includes(t))
    .map((t) => ({ t, s: score(t) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 20)
    .map((x) => x.t);

  return { exact, similar };
};
