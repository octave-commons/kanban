// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import path from "node:path";
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import type { ExecutionContext } from "ava";
import type { Board, ColumnData, Task } from "../lib/types.js";
export const makeTask = stryMutAct_9fa48("25731") ? () => undefined : (stryCov_9fa48("25731"), (() => {
  const makeTask = (overrides: Partial<Task> & Pick<Task, "uuid" | "title" | "status">): Task => stryMutAct_9fa48("25732") ? {} : (stryCov_9fa48("25732"), {
    priority: stryMutAct_9fa48("25733") ? "" : (stryCov_9fa48("25733"), "P3"),
    labels: stryMutAct_9fa48("25734") ? [] : (stryCov_9fa48("25734"), [stryMutAct_9fa48("25735") ? "" : (stryCov_9fa48("25735"), "kanban")]),
    created_at: stryMutAct_9fa48("25736") ? "" : (stryCov_9fa48("25736"), "2025-09-01T00:00:00.000Z"),
    estimates: {},
    content: stryMutAct_9fa48("25737") ? "Stryker was here!" : (stryCov_9fa48("25737"), ""),
    slug: undefined,
    ...overrides
  });
  return makeTask;
})());
export const makeBoard = stryMutAct_9fa48("25738") ? () => undefined : (stryCov_9fa48("25738"), (() => {
  const makeBoard = (columns: ColumnData[]): Board => stryMutAct_9fa48("25739") ? {} : (stryCov_9fa48("25739"), {
    columns
  });
  return makeBoard;
})());
export const withTempDir = async (t: ExecutionContext): Promise<string> => {
  if (stryMutAct_9fa48("25740")) {
    {}
  } else {
    stryCov_9fa48("25740");
    const dir = await mkdtemp(path.join(tmpdir(), stryMutAct_9fa48("25741") ? "" : (stryCov_9fa48("25741"), "kanban-test-")));
    t.teardown(async () => {
      if (stryMutAct_9fa48("25742")) {
        {}
      } else {
        stryCov_9fa48("25742");
        await rm(dir, stryMutAct_9fa48("25743") ? {} : (stryCov_9fa48("25743"), {
          recursive: stryMutAct_9fa48("25744") ? false : (stryCov_9fa48("25744"), true),
          force: stryMutAct_9fa48("25745") ? false : (stryCov_9fa48("25745"), true)
        }));
      }
    });
    return dir;
  }
};
export const writeTaskFile = async (dir: string, task: Task, extra?: {
  content?: string;
  labels?: string[];
}): Promise<string> => {
  if (stryMutAct_9fa48("25746")) {
    {}
  } else {
    stryCov_9fa48("25746");
    await mkdir(dir, stryMutAct_9fa48("25747") ? {} : (stryCov_9fa48("25747"), {
      recursive: stryMutAct_9fa48("25748") ? false : (stryCov_9fa48("25748"), true)
    }));
    const body = stryMutAct_9fa48("25749") ? (extra?.content ?? task.content) && "Details" : (stryCov_9fa48("25749"), (stryMutAct_9fa48("25750") ? extra?.content && task.content : (stryCov_9fa48("25750"), (stryMutAct_9fa48("25751") ? extra.content : (stryCov_9fa48("25751"), extra?.content)) ?? task.content)) ?? (stryMutAct_9fa48("25752") ? "" : (stryCov_9fa48("25752"), "Details")));
    const labels = stryMutAct_9fa48("25753") ? (extra?.labels ?? task.labels) && [] : (stryCov_9fa48("25753"), (stryMutAct_9fa48("25754") ? extra?.labels && task.labels : (stryCov_9fa48("25754"), (stryMutAct_9fa48("25755") ? extra.labels : (stryCov_9fa48("25755"), extra?.labels)) ?? task.labels)) ?? (stryMutAct_9fa48("25756") ? ["Stryker was here"] : (stryCov_9fa48("25756"), [])));
    const labelsLine = stryMutAct_9fa48("25757") ? `` : (stryCov_9fa48("25757"), `labels:${(stryMutAct_9fa48("25760") ? labels.length !== 0 : stryMutAct_9fa48("25759") ? false : stryMutAct_9fa48("25758") ? true : (stryCov_9fa48("25758", "25759", "25760"), labels.length === 0)) ? stryMutAct_9fa48("25761") ? "" : (stryCov_9fa48("25761"), " []") : stryMutAct_9fa48("25762") ? `` : (stryCov_9fa48("25762"), ` [${labels.map(stryMutAct_9fa48("25763") ? () => undefined : (stryCov_9fa48("25763"), label => JSON.stringify(label))).join(stryMutAct_9fa48("25764") ? "" : (stryCov_9fa48("25764"), ", "))}]`)}`);
    const titleValue = stryMutAct_9fa48("25765") ? task.title && "" : (stryCov_9fa48("25765"), task.title ?? (stryMutAct_9fa48("25766") ? "Stryker was here!" : (stryCov_9fa48("25766"), "")));
    const frontmatter = stryMutAct_9fa48("25767") ? `` : (stryCov_9fa48("25767"), `---\nuuid: ${task.uuid}\ntitle: ${JSON.stringify(titleValue)}\nstatus: ${task.status}\npriority: ${stryMutAct_9fa48("25768") ? task.priority && "" : (stryCov_9fa48("25768"), task.priority ?? (stryMutAct_9fa48("25769") ? "Stryker was here!" : (stryCov_9fa48("25769"), "")))}\n${labelsLine}\ncreated_at: ${stryMutAct_9fa48("25770") ? task.created_at && "2025-09-01T00:00:00.000Z" : (stryCov_9fa48("25770"), task.created_at ?? (stryMutAct_9fa48("25771") ? "" : (stryCov_9fa48("25771"), "2025-09-01T00:00:00.000Z")))}\n---\n\n${body}\n`);
    const fileNameBase = stryMutAct_9fa48("25772") ? (task.slug ?? task.title) && "task" : (stryCov_9fa48("25772"), (stryMutAct_9fa48("25773") ? task.slug && task.title : (stryCov_9fa48("25773"), task.slug ?? task.title)) ?? (stryMutAct_9fa48("25774") ? "" : (stryCov_9fa48("25774"), "task")));
    const fileName = (stryMutAct_9fa48("25778") ? fileNameBase.trim().length <= 0 : stryMutAct_9fa48("25777") ? fileNameBase.trim().length >= 0 : stryMutAct_9fa48("25776") ? false : stryMutAct_9fa48("25775") ? true : (stryCov_9fa48("25775", "25776", "25777", "25778"), (stryMutAct_9fa48("25779") ? fileNameBase.length : (stryCov_9fa48("25779"), fileNameBase.trim().length)) > 0)) ? fileNameBase : stryMutAct_9fa48("25780") ? "" : (stryCov_9fa48("25780"), "task");
    const filePath = path.join(dir, stryMutAct_9fa48("25781") ? `` : (stryCov_9fa48("25781"), `${fileName}.md`));
    await writeFile(filePath, frontmatter, stryMutAct_9fa48("25782") ? "" : (stryCov_9fa48("25782"), "utf8"));
    return filePath;
  }
};
export const getTaskFileByUuid = async (dir: string, uuid: string): Promise<{
  file: string;
  content: string;
} | undefined> => {
  if (stryMutAct_9fa48("25783")) {
    {}
  } else {
    stryCov_9fa48("25783");
    const files = await readdir(dir).catch(stryMutAct_9fa48("25784") ? () => undefined : (stryCov_9fa48("25784"), () => [] as string[]));
    for (const file of files) {
      if (stryMutAct_9fa48("25785")) {
        {}
      } else {
        stryCov_9fa48("25785");
        const fullPath = path.join(dir, file);
        const content = await readFile(fullPath, stryMutAct_9fa48("25786") ? "" : (stryCov_9fa48("25786"), "utf8"));
        if (stryMutAct_9fa48("25788") ? false : stryMutAct_9fa48("25787") ? true : (stryCov_9fa48("25787", "25788"), content.includes(stryMutAct_9fa48("25789") ? `` : (stryCov_9fa48("25789"), `uuid: "${uuid}"`)))) {
          if (stryMutAct_9fa48("25790")) {
            {}
          } else {
            stryCov_9fa48("25790");
            return stryMutAct_9fa48("25791") ? {} : (stryCov_9fa48("25791"), {
              file,
              content
            });
          }
        }
      }
    }
    return undefined;
  }
};
export const snapshotTaskFiles = async (dir: string): Promise<Map<string, string>> => {
  if (stryMutAct_9fa48("25792")) {
    {}
  } else {
    stryCov_9fa48("25792");
    const snapshot = new Map<string, string>();
    const files = await readdir(dir).catch(stryMutAct_9fa48("25793") ? () => undefined : (stryCov_9fa48("25793"), () => [] as string[]));
    for (const file of files) {
      if (stryMutAct_9fa48("25794")) {
        {}
      } else {
        stryCov_9fa48("25794");
        const full = path.join(dir, file);
        const text = await readFile(full, stryMutAct_9fa48("25795") ? "" : (stryCov_9fa48("25795"), "utf8"));
        snapshot.set(file, text);
      }
    }
    return snapshot;
  }
};