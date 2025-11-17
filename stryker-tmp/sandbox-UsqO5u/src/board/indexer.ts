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
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listFilesRec } from '@promethean-os/utils/list-files-rec.js';
import { parseFrontmatter } from '@promethean-os/markdown/frontmatter';
import type { IndexedTask, TaskFM } from './types.js';
import type { KanbanConfig, ReadonlySetLike } from './config/shared.js';
import { loadKanbanConfig } from './config.js';
import type { TaskCache, TaskCacheOptions } from './task-cache.js';
const toTrimmedString = (value: unknown, fallback = stryMutAct_9fa48("880") ? "Stryker was here!" : (stryCov_9fa48("880"), '')): string => {
  if (stryMutAct_9fa48("881")) {
    {}
  } else {
    stryCov_9fa48("881");
    if (stryMutAct_9fa48("884") ? typeof value === 'string' : stryMutAct_9fa48("883") ? false : stryMutAct_9fa48("882") ? true : (stryCov_9fa48("882", "883", "884"), typeof value !== (stryMutAct_9fa48("885") ? "" : (stryCov_9fa48("885"), 'string')))) return fallback;
    const trimmed = stryMutAct_9fa48("886") ? value : (stryCov_9fa48("886"), value.trim());
    return (stryMutAct_9fa48("890") ? trimmed.length <= 0 : stryMutAct_9fa48("889") ? trimmed.length >= 0 : stryMutAct_9fa48("888") ? false : stryMutAct_9fa48("887") ? true : (stryCov_9fa48("887", "888", "889", "890"), trimmed.length > 0)) ? trimmed : fallback;
  }
};
const toOptionalString = (value: unknown): string | undefined => {
  if (stryMutAct_9fa48("891")) {
    {}
  } else {
    stryCov_9fa48("891");
    const trimmed = toTrimmedString(value);
    return (stryMutAct_9fa48("895") ? trimmed.length <= 0 : stryMutAct_9fa48("894") ? trimmed.length >= 0 : stryMutAct_9fa48("893") ? false : stryMutAct_9fa48("892") ? true : (stryCov_9fa48("892", "893", "894", "895"), trimmed.length > 0)) ? trimmed : undefined;
  }
};
const toLabelArray = (value: unknown): ReadonlyArray<string> => {
  if (stryMutAct_9fa48("896")) {
    {}
  } else {
    stryCov_9fa48("896");
    if (stryMutAct_9fa48("898") ? false : stryMutAct_9fa48("897") ? true : (stryCov_9fa48("897", "898"), Array.isArray(value))) {
      if (stryMutAct_9fa48("899")) {
        {}
      } else {
        stryCov_9fa48("899");
        return stryMutAct_9fa48("900") ? value.map(entry => toTrimmedString(entry)) : (stryCov_9fa48("900"), value.map(stryMutAct_9fa48("901") ? () => undefined : (stryCov_9fa48("901"), entry => toTrimmedString(entry))).filter(stryMutAct_9fa48("902") ? () => undefined : (stryCov_9fa48("902"), (entry): entry is string => stryMutAct_9fa48("906") ? entry.length <= 0 : stryMutAct_9fa48("905") ? entry.length >= 0 : stryMutAct_9fa48("904") ? false : stryMutAct_9fa48("903") ? true : (stryCov_9fa48("903", "904", "905", "906"), entry.length > 0))));
      }
    }
    if (stryMutAct_9fa48("909") ? typeof value !== 'string' : stryMutAct_9fa48("908") ? false : stryMutAct_9fa48("907") ? true : (stryCov_9fa48("907", "908", "909"), typeof value === (stryMutAct_9fa48("910") ? "" : (stryCov_9fa48("910"), 'string')))) {
      if (stryMutAct_9fa48("911")) {
        {}
      } else {
        stryCov_9fa48("911");
        return stryMutAct_9fa48("912") ? value.split(',').map(entry => toTrimmedString(entry)) : (stryCov_9fa48("912"), value.split(stryMutAct_9fa48("913") ? "" : (stryCov_9fa48("913"), ',')).map(stryMutAct_9fa48("914") ? () => undefined : (stryCov_9fa48("914"), entry => toTrimmedString(entry))).filter(stryMutAct_9fa48("915") ? () => undefined : (stryCov_9fa48("915"), (entry): entry is string => stryMutAct_9fa48("919") ? entry.length <= 0 : stryMutAct_9fa48("918") ? entry.length >= 0 : stryMutAct_9fa48("917") ? false : stryMutAct_9fa48("916") ? true : (stryCov_9fa48("916", "917", "918", "919"), entry.length > 0))));
      }
    }
    return stryMutAct_9fa48("920") ? ["Stryker was here"] : (stryCov_9fa48("920"), []);
  }
};
const normalizeTask = (data: Readonly<Record<string, unknown>>, filePath: string, repoRoot: string, content?: string): IndexedTask => {
  if (stryMutAct_9fa48("921")) {
    {}
  } else {
    stryCov_9fa48("921");
    const rawId = stryMutAct_9fa48("922") ? (data as {
      readonly id?: unknown;
    }).id && (data as {
      readonly uuid?: unknown;
    }).uuid : (stryCov_9fa48("922"), (data as {
      readonly id?: unknown;
    }).id ?? (data as {
      readonly uuid?: unknown;
    }).uuid);
    const rawCreated = stryMutAct_9fa48("923") ? (data as {
      readonly created?: unknown;
    }).created && (data as {
      readonly created_at?: unknown;
    }).created_at : (stryCov_9fa48("923"), (data as {
      readonly created?: unknown;
    }).created ?? (data as {
      readonly created_at?: unknown;
    }).created_at);
    const id = toTrimmedString(rawId);
    const title = toTrimmedString(data.title, path.basename(filePath, stryMutAct_9fa48("924") ? "" : (stryCov_9fa48("924"), '.md')));
    const status = toTrimmedString(data.status) as TaskFM['status'];
    const priority = toTrimmedString(data.priority) as TaskFM['priority'];
    const owner = toTrimmedString(data.owner);
    const labels = toLabelArray(data.labels);
    const created = toTrimmedString(rawCreated);
    const updated = toOptionalString((data as {
      readonly updated?: unknown;
    }).updated);

    // Extract estimates if present
    const estimates = (data as {
      readonly estimates?: unknown;
    }).estimates;
    const normalizedEstimates = (stryMutAct_9fa48("927") ? estimates || typeof estimates === 'object' : stryMutAct_9fa48("926") ? false : stryMutAct_9fa48("925") ? true : (stryCov_9fa48("925", "926", "927"), estimates && (stryMutAct_9fa48("929") ? typeof estimates !== 'object' : stryMutAct_9fa48("928") ? true : (stryCov_9fa48("928", "929"), typeof estimates === (stryMutAct_9fa48("930") ? "" : (stryCov_9fa48("930"), 'object')))))) ? estimates : undefined;

    // Extract commit tracking fields
    const lastCommitSha = toOptionalString((data as {
      readonly lastCommitSha?: unknown;
    }).lastCommitSha);
    const rawCommitHistory = (data as {
      readonly commitHistory?: unknown;
    }).commitHistory;
    const commitHistory = Array.isArray(rawCommitHistory) ? stryMutAct_9fa48("931") ? rawCommitHistory : (stryCov_9fa48("931"), rawCommitHistory.filter(stryMutAct_9fa48("932") ? () => undefined : (stryCov_9fa48("932"), entry => stryMutAct_9fa48("935") ? entry && typeof entry === 'object' && typeof entry.sha === 'string' && typeof entry.timestamp === 'string' && typeof entry.message === 'string' && typeof entry.author === 'string' || ['create', 'update', 'status_change', 'move'].includes(entry.type) : stryMutAct_9fa48("934") ? false : stryMutAct_9fa48("933") ? true : (stryCov_9fa48("933", "934", "935"), (stryMutAct_9fa48("937") ? entry && typeof entry === 'object' && typeof entry.sha === 'string' && typeof entry.timestamp === 'string' && typeof entry.message === 'string' || typeof entry.author === 'string' : stryMutAct_9fa48("936") ? true : (stryCov_9fa48("936", "937"), (stryMutAct_9fa48("939") ? entry && typeof entry === 'object' && typeof entry.sha === 'string' && typeof entry.timestamp === 'string' || typeof entry.message === 'string' : stryMutAct_9fa48("938") ? true : (stryCov_9fa48("938", "939"), (stryMutAct_9fa48("941") ? entry && typeof entry === 'object' && typeof entry.sha === 'string' || typeof entry.timestamp === 'string' : stryMutAct_9fa48("940") ? true : (stryCov_9fa48("940", "941"), (stryMutAct_9fa48("943") ? entry && typeof entry === 'object' || typeof entry.sha === 'string' : stryMutAct_9fa48("942") ? true : (stryCov_9fa48("942", "943"), (stryMutAct_9fa48("945") ? entry || typeof entry === 'object' : stryMutAct_9fa48("944") ? true : (stryCov_9fa48("944", "945"), entry && (stryMutAct_9fa48("947") ? typeof entry !== 'object' : stryMutAct_9fa48("946") ? true : (stryCov_9fa48("946", "947"), typeof entry === (stryMutAct_9fa48("948") ? "" : (stryCov_9fa48("948"), 'object')))))) && (stryMutAct_9fa48("950") ? typeof entry.sha !== 'string' : stryMutAct_9fa48("949") ? true : (stryCov_9fa48("949", "950"), typeof entry.sha === (stryMutAct_9fa48("951") ? "" : (stryCov_9fa48("951"), 'string')))))) && (stryMutAct_9fa48("953") ? typeof entry.timestamp !== 'string' : stryMutAct_9fa48("952") ? true : (stryCov_9fa48("952", "953"), typeof entry.timestamp === (stryMutAct_9fa48("954") ? "" : (stryCov_9fa48("954"), 'string')))))) && (stryMutAct_9fa48("956") ? typeof entry.message !== 'string' : stryMutAct_9fa48("955") ? true : (stryCov_9fa48("955", "956"), typeof entry.message === (stryMutAct_9fa48("957") ? "" : (stryCov_9fa48("957"), 'string')))))) && (stryMutAct_9fa48("959") ? typeof entry.author !== 'string' : stryMutAct_9fa48("958") ? true : (stryCov_9fa48("958", "959"), typeof entry.author === (stryMutAct_9fa48("960") ? "" : (stryCov_9fa48("960"), 'string')))))) && (stryMutAct_9fa48("961") ? [] : (stryCov_9fa48("961"), [stryMutAct_9fa48("962") ? "" : (stryCov_9fa48("962"), 'create'), stryMutAct_9fa48("963") ? "" : (stryCov_9fa48("963"), 'update'), stryMutAct_9fa48("964") ? "" : (stryCov_9fa48("964"), 'status_change'), stryMutAct_9fa48("965") ? "" : (stryCov_9fa48("965"), 'move')])).includes(entry.type))))) : undefined;
    const rel = path.relative(repoRoot, filePath);
    const base: TaskFM = Object.freeze(stryMutAct_9fa48("966") ? {} : (stryCov_9fa48("966"), {
      id,
      title,
      status,
      priority,
      owner,
      labels,
      created,
      uuid: toOptionalString((data as {
        readonly uuid?: unknown;
      }).uuid),
      created_at: toOptionalString((data as {
        readonly created_at?: unknown;
      }).created_at),
      estimates: normalizedEstimates,
      lastCommitSha,
      commitHistory
    }));
    const fm: TaskFM = (stryMutAct_9fa48("969") ? typeof updated !== 'string' : stryMutAct_9fa48("968") ? false : stryMutAct_9fa48("967") ? true : (stryCov_9fa48("967", "968", "969"), typeof updated === (stryMutAct_9fa48("970") ? "" : (stryCov_9fa48("970"), 'string')))) ? Object.freeze(stryMutAct_9fa48("971") ? {} : (stryCov_9fa48("971"), {
      ...base,
      updated
    })) : base;
    return Object.freeze(stryMutAct_9fa48("972") ? {} : (stryCov_9fa48("972"), {
      ...fm,
      path: rel,
      content
    })) satisfies IndexedTask;
  }
};
const sortTasksById = stryMutAct_9fa48("973") ? () => undefined : (stryCov_9fa48("973"), (() => {
  const sortTasksById = (tasks: readonly IndexedTask[]): ReadonlyArray<IndexedTask> => Object.freeze(stryMutAct_9fa48("974") ? [...tasks] : (stryCov_9fa48("974"), (stryMutAct_9fa48("975") ? [] : (stryCov_9fa48("975"), [...tasks])).sort(stryMutAct_9fa48("976") ? () => undefined : (stryCov_9fa48("976"), (a, b) => a.id.localeCompare(b.id)))));
  return sortTasksById;
})());
export type IndexTasksOptions = Readonly<{
  readonly tasksDir: string;
  readonly exts: ReadonlySetLike<string>;
  readonly repoRoot: string;
}>;
export const indexTasks = async ({
  tasksDir,
  exts,
  repoRoot
}: IndexTasksOptions): Promise<ReadonlyArray<IndexedTask>> => {
  if (stryMutAct_9fa48("977")) {
    {}
  } else {
    stryCov_9fa48("977");
    const files = await listFilesRec(tasksDir, new Set(exts));

    // Process files in batches to avoid memory exhaustion with 405+ tasks
    const batchSize = 50;
    const allTasks: IndexedTask[] = stryMutAct_9fa48("978") ? ["Stryker was here"] : (stryCov_9fa48("978"), []);
    for (let i = 0; stryMutAct_9fa48("981") ? i >= files.length : stryMutAct_9fa48("980") ? i <= files.length : stryMutAct_9fa48("979") ? false : (stryCov_9fa48("979", "980", "981"), i < files.length); stryMutAct_9fa48("982") ? i -= batchSize : (stryCov_9fa48("982"), i += batchSize)) {
      if (stryMutAct_9fa48("983")) {
        {}
      } else {
        stryCov_9fa48("983");
        const batch = stryMutAct_9fa48("984") ? files : (stryCov_9fa48("984"), files.slice(i, stryMutAct_9fa48("985") ? i - batchSize : (stryCov_9fa48("985"), i + batchSize)));
        const batchTasks = await Promise.all(batch.map(async filePath => {
          if (stryMutAct_9fa48("986")) {
            {}
          } else {
            stryCov_9fa48("986");
            try {
              if (stryMutAct_9fa48("987")) {
                {}
              } else {
                stryCov_9fa48("987");
                const raw = await readFile(filePath, stryMutAct_9fa48("988") ? "" : (stryCov_9fa48("988"), 'utf8'));
                const parsed = parseFrontmatter<Readonly<Record<string, unknown>>>(raw);
                return normalizeTask(stryMutAct_9fa48("989") ? parsed.data && {} : (stryCov_9fa48("989"), parsed.data ?? {}), filePath, repoRoot, parsed.content);
              }
            } catch (error) {
              if (stryMutAct_9fa48("990")) {
                {}
              } else {
                stryCov_9fa48("990");
                console.error(stryMutAct_9fa48("991") ? `` : (stryCov_9fa48("991"), `Failed to process ${filePath}:`), error);
                return null;
              }
            }
          }
        }));

        // Filter out null results and add to results
        const validTasks = stryMutAct_9fa48("992") ? batchTasks : (stryCov_9fa48("992"), batchTasks.filter(stryMutAct_9fa48("993") ? () => undefined : (stryCov_9fa48("993"), (task): task is IndexedTask => stryMutAct_9fa48("996") ? task === null : stryMutAct_9fa48("995") ? false : stryMutAct_9fa48("994") ? true : (stryCov_9fa48("994", "995", "996"), task !== null))));
        allTasks.push(...validTasks);

        // Allow garbage collection between batches
        if (stryMutAct_9fa48("1000") ? i + batchSize >= files.length : stryMutAct_9fa48("999") ? i + batchSize <= files.length : stryMutAct_9fa48("998") ? false : stryMutAct_9fa48("997") ? true : (stryCov_9fa48("997", "998", "999", "1000"), (stryMutAct_9fa48("1001") ? i - batchSize : (stryCov_9fa48("1001"), i + batchSize)) < files.length)) {
          if (stryMutAct_9fa48("1002")) {
            {}
          } else {
            stryCov_9fa48("1002");
            await new Promise(stryMutAct_9fa48("1003") ? () => undefined : (stryCov_9fa48("1003"), resolve => setTimeout(resolve, 0)));
          }
        }
      }
    }
    return sortTasksById(allTasks);
  }
};
export const serializeTasks = (tasks: ReadonlyArray<IndexedTask>): ReadonlyArray<string> => {
  if (stryMutAct_9fa48("1004")) {
    {}
  } else {
    stryCov_9fa48("1004");
    // Process in batches to avoid memory spikes with large task arrays
    const batchSize = 100;
    const result: string[] = stryMutAct_9fa48("1005") ? ["Stryker was here"] : (stryCov_9fa48("1005"), []);
    for (let i = 0; stryMutAct_9fa48("1008") ? i >= tasks.length : stryMutAct_9fa48("1007") ? i <= tasks.length : stryMutAct_9fa48("1006") ? false : (stryCov_9fa48("1006", "1007", "1008"), i < tasks.length); stryMutAct_9fa48("1009") ? i -= batchSize : (stryCov_9fa48("1009"), i += batchSize)) {
      if (stryMutAct_9fa48("1010")) {
        {}
      } else {
        stryCov_9fa48("1010");
        const batch = stryMutAct_9fa48("1011") ? tasks : (stryCov_9fa48("1011"), tasks.slice(i, stryMutAct_9fa48("1012") ? i - batchSize : (stryCov_9fa48("1012"), i + batchSize)));
        const batchSerialized = batch.map(stryMutAct_9fa48("1013") ? () => undefined : (stryCov_9fa48("1013"), task => JSON.stringify(task)));
        result.push(...batchSerialized);

        // Allow garbage collection between batches
        if (stryMutAct_9fa48("1017") ? i + batchSize >= tasks.length : stryMutAct_9fa48("1016") ? i + batchSize <= tasks.length : stryMutAct_9fa48("1015") ? false : stryMutAct_9fa48("1014") ? true : (stryCov_9fa48("1014", "1015", "1016", "1017"), (stryMutAct_9fa48("1018") ? i - batchSize : (stryCov_9fa48("1018"), i + batchSize)) < tasks.length)) {
          if (stryMutAct_9fa48("1019")) {
            {}
          } else {
            stryCov_9fa48("1019");
            // Force sync to allow GC
            if (stryMutAct_9fa48("1021") ? false : stryMutAct_9fa48("1020") ? true : (stryCov_9fa48("1020", "1021"), global.gc)) {
              if (stryMutAct_9fa48("1022")) {
                {}
              } else {
                stryCov_9fa48("1022");
                global.gc();
              }
            }
          }
        }
      }
    }
    return Object.freeze(result);
  }
};
export const refreshTaskIndex = async (config: Readonly<KanbanConfig>): Promise<ReadonlyArray<IndexedTask>> => {
  if (stryMutAct_9fa48("1023")) {
    {}
  } else {
    stryCov_9fa48("1023");
    const tasks = await indexTasks(stryMutAct_9fa48("1024") ? {} : (stryCov_9fa48("1024"), {
      tasksDir: config.tasksDir,
      exts: config.exts,
      repoRoot: config.repo
    }));
    const lines = serializeTasks(tasks);
    await writeFile(config.indexFile, stryMutAct_9fa48("1025") ? `` : (stryCov_9fa48("1025"), `${lines.join(stryMutAct_9fa48("1026") ? "" : (stryCov_9fa48("1026"), '\n'))}\n`), stryMutAct_9fa48("1027") ? "" : (stryCov_9fa48("1027"), 'utf8'));
    return tasks;
  }
};
export const writeIndexFile = async (indexFilePath: string, lines: ReadonlyArray<string>): Promise<void> => {
  if (stryMutAct_9fa48("1028")) {
    {}
  } else {
    stryCov_9fa48("1028");
    await writeFile(indexFilePath, stryMutAct_9fa48("1029") ? `` : (stryCov_9fa48("1029"), `${lines.join(stryMutAct_9fa48("1030") ? "" : (stryCov_9fa48("1030"), '\n'))}\n`), stryMutAct_9fa48("1031") ? "" : (stryCov_9fa48("1031"), 'utf8'));
  }
};

/**
 * Get default cache path based on config
 */
const getDefaultCachePath = (config: KanbanConfig): string => {
  if (stryMutAct_9fa48("1032")) {
    {}
  } else {
    stryCov_9fa48("1032");
    return path.join(path.dirname(config.indexFile), stryMutAct_9fa48("1033") ? "" : (stryCov_9fa48("1033"), '.cache'));
  }
};

/**
 * Create task cache options from kanban config
 */
export const createTaskCacheOptions = stryMutAct_9fa48("1034") ? () => undefined : (stryCov_9fa48("1034"), (() => {
  const createTaskCacheOptions = (config: KanbanConfig, overrides?: Partial<TaskCacheOptions>): TaskCacheOptions => stryMutAct_9fa48("1035") ? {} : (stryCov_9fa48("1035"), {
    path: stryMutAct_9fa48("1036") ? overrides?.path && getDefaultCachePath(config) : (stryCov_9fa48("1036"), (stryMutAct_9fa48("1037") ? overrides.path : (stryCov_9fa48("1037"), overrides?.path)) ?? getDefaultCachePath(config)),
    namespace: stryMutAct_9fa48("1038") ? overrides?.namespace && 'kanban' : (stryCov_9fa48("1038"), (stryMutAct_9fa48("1039") ? overrides.namespace : (stryCov_9fa48("1039"), overrides?.namespace)) ?? (stryMutAct_9fa48("1040") ? "" : (stryCov_9fa48("1040"), 'kanban'))),
    defaultTtlMs: stryMutAct_9fa48("1041") ? overrides?.defaultTtlMs && 24 * 60 * 60 * 1000 : (stryCov_9fa48("1041"), (stryMutAct_9fa48("1042") ? overrides.defaultTtlMs : (stryCov_9fa48("1042"), overrides?.defaultTtlMs)) ?? (stryMutAct_9fa48("1043") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("1043"), (stryMutAct_9fa48("1044") ? 24 * 60 / 60 : (stryCov_9fa48("1044"), (stryMutAct_9fa48("1045") ? 24 / 60 : (stryCov_9fa48("1045"), 24 * 60)) * 60)) * 1000))),
    // 24 hours
    ...overrides
  });
  return createTaskCacheOptions;
})());

/**
 * Index tasks into cache with streaming support
 */
export const indexTasksToCache = async (options: Readonly<{
  readonly tasksDir: string;
  readonly exts: ReadonlySetLike<string>;
  readonly repoRoot: string;
  readonly cache: TaskCache;
}>): Promise<{
  indexed: number;
  cache: TaskCache;
}> => {
  if (stryMutAct_9fa48("1046")) {
    {}
  } else {
    stryCov_9fa48("1046");
    const {
      tasksDir,
      exts,
      repoRoot,
      cache
    } = options;

    // Clear existing cache to ensure clean rebuild
    await cache.rebuildIndex();

    // Stream tasks from filesystem to avoid memory overload
    const files = await listFilesRec(tasksDir, new Set(exts));
    let indexedCount = 0;

    // Process files in batches to avoid memory issues
    const batchSize = 50;
    for (let i = 0; stryMutAct_9fa48("1049") ? i >= files.length : stryMutAct_9fa48("1048") ? i <= files.length : stryMutAct_9fa48("1047") ? false : (stryCov_9fa48("1047", "1048", "1049"), i < files.length); stryMutAct_9fa48("1050") ? i -= batchSize : (stryCov_9fa48("1050"), i += batchSize)) {
      if (stryMutAct_9fa48("1051")) {
        {}
      } else {
        stryCov_9fa48("1051");
        const batch = stryMutAct_9fa48("1052") ? files : (stryCov_9fa48("1052"), files.slice(i, stryMutAct_9fa48("1053") ? i - batchSize : (stryCov_9fa48("1053"), i + batchSize)));
        const batchTasks = await Promise.all(batch.map(async filePath => {
          if (stryMutAct_9fa48("1054")) {
            {}
          } else {
            stryCov_9fa48("1054");
            try {
              if (stryMutAct_9fa48("1055")) {
                {}
              } else {
                stryCov_9fa48("1055");
                const raw = await readFile(filePath, stryMutAct_9fa48("1056") ? "" : (stryCov_9fa48("1056"), 'utf8'));
                const parsed = parseFrontmatter<Readonly<Record<string, unknown>>>(raw);
                return normalizeTask(stryMutAct_9fa48("1057") ? parsed.data && {} : (stryCov_9fa48("1057"), parsed.data ?? {}), filePath, repoRoot, parsed.content);
              }
            } catch (error) {
              if (stryMutAct_9fa48("1058")) {
                {}
              } else {
                stryCov_9fa48("1058");
                console.error(stryMutAct_9fa48("1059") ? `` : (stryCov_9fa48("1059"), `Failed to process ${filePath}:`), error);
                return null;
              }
            }
          }
        }));

        // Filter out null results and index valid tasks
        const validTasks = stryMutAct_9fa48("1060") ? batchTasks : (stryCov_9fa48("1060"), batchTasks.filter(stryMutAct_9fa48("1061") ? () => undefined : (stryCov_9fa48("1061"), (task): task is IndexedTask => stryMutAct_9fa48("1064") ? task === null : stryMutAct_9fa48("1063") ? false : stryMutAct_9fa48("1062") ? true : (stryCov_9fa48("1062", "1063", "1064"), task !== null))));
        for (const task of validTasks) {
          if (stryMutAct_9fa48("1065")) {
            {}
          } else {
            stryCov_9fa48("1065");
            await cache.setTask(task);
            stryMutAct_9fa48("1066") ? indexedCount-- : (stryCov_9fa48("1066"), indexedCount++);
          }
        }

        // Optional: yield progress for large operations
        if (stryMutAct_9fa48("1069") ? i > 0 || i % (batchSize * 10) === 0 : stryMutAct_9fa48("1068") ? false : stryMutAct_9fa48("1067") ? true : (stryCov_9fa48("1067", "1068", "1069"), (stryMutAct_9fa48("1072") ? i <= 0 : stryMutAct_9fa48("1071") ? i >= 0 : stryMutAct_9fa48("1070") ? true : (stryCov_9fa48("1070", "1071", "1072"), i > 0)) && (stryMutAct_9fa48("1074") ? i % (batchSize * 10) !== 0 : stryMutAct_9fa48("1073") ? true : (stryCov_9fa48("1073", "1074"), (stryMutAct_9fa48("1075") ? i * (batchSize * 10) : (stryCov_9fa48("1075"), i % (stryMutAct_9fa48("1076") ? batchSize / 10 : (stryCov_9fa48("1076"), batchSize * 10)))) === 0)))) {
          if (stryMutAct_9fa48("1077")) {
            {}
          } else {
            stryCov_9fa48("1077");
            console.log(stryMutAct_9fa48("1078") ? `` : (stryCov_9fa48("1078"), `Indexed ${indexedCount}/${files.length} tasks...`));
          }
        }
      }
    }
    return stryMutAct_9fa48("1079") ? {} : (stryCov_9fa48("1079"), {
      indexed: indexedCount,
      cache
    });
  }
};

/**
 * Migrate existing JSONL index to TaskCache
 */
export const migrateJsonlToCache = async (config: KanbanConfig, cache: TaskCache): Promise<{
  migrated: number;
  errors: string[];
}> => {
  if (stryMutAct_9fa48("1080")) {
    {}
  } else {
    stryCov_9fa48("1080");
    const errors: string[] = stryMutAct_9fa48("1081") ? ["Stryker was here"] : (stryCov_9fa48("1081"), []);
    let migrated = 0;
    try {
      if (stryMutAct_9fa48("1082")) {
        {}
      } else {
        stryCov_9fa48("1082");
        // Check if JSONL index exists
        const raw = await readFile(config.indexFile, stryMutAct_9fa48("1083") ? "" : (stryCov_9fa48("1083"), 'utf8')).catch(stryMutAct_9fa48("1084") ? () => undefined : (stryCov_9fa48("1084"), () => null));
        if (stryMutAct_9fa48("1087") ? false : stryMutAct_9fa48("1086") ? true : stryMutAct_9fa48("1085") ? raw : (stryCov_9fa48("1085", "1086", "1087"), !raw)) {
          if (stryMutAct_9fa48("1088")) {
            {}
          } else {
            stryCov_9fa48("1088");
            return stryMutAct_9fa48("1089") ? {} : (stryCov_9fa48("1089"), {
              migrated: 0,
              errors: stryMutAct_9fa48("1090") ? [] : (stryCov_9fa48("1090"), [stryMutAct_9fa48("1091") ? "" : (stryCov_9fa48("1091"), 'No existing JSONL index found')])
            });
          }
        }

        // Parse JSONL lines
        const lines = stryMutAct_9fa48("1093") ? raw.split('\n').map(line => {
          try {
            return JSON.parse(line) as IndexedTask;
          } catch (error) {
            errors.push(`Invalid JSON line: ${line.substring(0, 100)}...`);
            return null;
          }
        }).filter((task): task is IndexedTask => task !== null) : stryMutAct_9fa48("1092") ? raw.split('\n').filter(line => line.trim().length > 0).map(line => {
          try {
            return JSON.parse(line) as IndexedTask;
          } catch (error) {
            errors.push(`Invalid JSON line: ${line.substring(0, 100)}...`);
            return null;
          }
        }) : (stryCov_9fa48("1092", "1093"), raw.split(stryMutAct_9fa48("1094") ? "" : (stryCov_9fa48("1094"), '\n')).filter(stryMutAct_9fa48("1095") ? () => undefined : (stryCov_9fa48("1095"), line => stryMutAct_9fa48("1099") ? line.trim().length <= 0 : stryMutAct_9fa48("1098") ? line.trim().length >= 0 : stryMutAct_9fa48("1097") ? false : stryMutAct_9fa48("1096") ? true : (stryCov_9fa48("1096", "1097", "1098", "1099"), (stryMutAct_9fa48("1100") ? line.length : (stryCov_9fa48("1100"), line.trim().length)) > 0))).map(line => {
          if (stryMutAct_9fa48("1101")) {
            {}
          } else {
            stryCov_9fa48("1101");
            try {
              if (stryMutAct_9fa48("1102")) {
                {}
              } else {
                stryCov_9fa48("1102");
                return JSON.parse(line) as IndexedTask;
              }
            } catch (error) {
              if (stryMutAct_9fa48("1103")) {
                {}
              } else {
                stryCov_9fa48("1103");
                errors.push(stryMutAct_9fa48("1104") ? `` : (stryCov_9fa48("1104"), `Invalid JSON line: ${stryMutAct_9fa48("1105") ? line : (stryCov_9fa48("1105"), line.substring(0, 100))}...`));
                return null;
              }
            }
          }
        }).filter(stryMutAct_9fa48("1106") ? () => undefined : (stryCov_9fa48("1106"), (task): task is IndexedTask => stryMutAct_9fa48("1109") ? task === null : stryMutAct_9fa48("1108") ? false : stryMutAct_9fa48("1107") ? true : (stryCov_9fa48("1107", "1108", "1109"), task !== null))));

        // Migrate tasks to cache
        for (const task of lines) {
          if (stryMutAct_9fa48("1110")) {
            {}
          } else {
            stryCov_9fa48("1110");
            try {
              if (stryMutAct_9fa48("1111")) {
                {}
              } else {
                stryCov_9fa48("1111");
                await cache.setTask(task);
                stryMutAct_9fa48("1112") ? migrated-- : (stryCov_9fa48("1112"), migrated++);
              }
            } catch (error) {
              if (stryMutAct_9fa48("1113")) {
                {}
              } else {
                stryCov_9fa48("1113");
                errors.push(stryMutAct_9fa48("1114") ? `` : (stryCov_9fa48("1114"), `Failed to migrate task ${task.uuid}: ${error instanceof Error ? error.message : String(error)}`));
              }
            }
          }
        }
        console.log(stryMutAct_9fa48("1115") ? `` : (stryCov_9fa48("1115"), `Migrated ${migrated} tasks from JSONL to cache`));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1116")) {
        {}
      } else {
        stryCov_9fa48("1116");
        errors.push(stryMutAct_9fa48("1117") ? `` : (stryCov_9fa48("1117"), `Migration failed: ${error instanceof Error ? error.message : String(error)}`));
      }
    }
    return stryMutAct_9fa48("1118") ? {} : (stryCov_9fa48("1118"), {
      migrated,
      errors
    });
  }
};
export const runIndexer = async (options?: Readonly<{
  readonly argv?: ReadonlyArray<string>;
  readonly env?: NodeJS.ProcessEnv;
}>): Promise<ReadonlyArray<IndexedTask>> => {
  if (stryMutAct_9fa48("1119")) {
    {}
  } else {
    stryCov_9fa48("1119");
    const {
      config,
      restArgs
    } = await loadKanbanConfig(options);
    const args = new Set(restArgs);
    const shouldWrite = args.has(stryMutAct_9fa48("1120") ? "" : (stryCov_9fa48("1120"), '--write'));
    const useCache = args.has(stryMutAct_9fa48("1121") ? "" : (stryCov_9fa48("1121"), '--cache'));
    if (stryMutAct_9fa48("1123") ? false : stryMutAct_9fa48("1122") ? true : (stryCov_9fa48("1122", "1123"), useCache)) {
      if (stryMutAct_9fa48("1124")) {
        {}
      } else {
        stryCov_9fa48("1124");
        // Use new cache-based indexing
        console.log(stryMutAct_9fa48("1125") ? "" : (stryCov_9fa48("1125"), 'Using cache-based indexing...'));
        const {
          createTaskCache
        } = await import(stryMutAct_9fa48("1126") ? "" : (stryCov_9fa48("1126"), './task-cache.js'));
        const cache = await createTaskCache(createTaskCacheOptions(config));
        const result = await indexTasksToCache(stryMutAct_9fa48("1127") ? {} : (stryCov_9fa48("1127"), {
          tasksDir: config.tasksDir,
          exts: config.exts,
          repoRoot: config.repo,
          cache
        }));
        console.log(stryMutAct_9fa48("1128") ? `` : (stryCov_9fa48("1128"), `Indexed ${result.indexed} tasks to cache`));
        await cache.close();
        return stryMutAct_9fa48("1129") ? ["Stryker was here"] : (stryCov_9fa48("1129"), []);
      }
    }
    const tasks = await indexTasks(stryMutAct_9fa48("1130") ? {} : (stryCov_9fa48("1130"), {
      tasksDir: config.tasksDir,
      exts: config.exts,
      repoRoot: config.repo
    }));
    const lines = serializeTasks(tasks);
    if (stryMutAct_9fa48("1132") ? false : stryMutAct_9fa48("1131") ? true : (stryCov_9fa48("1131", "1132"), shouldWrite)) {
      if (stryMutAct_9fa48("1133")) {
        {}
      } else {
        stryCov_9fa48("1133");
        await writeIndexFile(config.indexFile, lines);
        console.log(stryMutAct_9fa48("1134") ? `` : (stryCov_9fa48("1134"), `Wrote ${tasks.length} tasks to ${path.relative(config.repo, config.indexFile)}`));
        return tasks;
      }
    }
    lines.forEach(line => {
      if (stryMutAct_9fa48("1135")) {
        {}
      } else {
        stryCov_9fa48("1135");
        console.log(line);
      }
    });
    return tasks;
  }
};
const isCliExecution = (): boolean => {
  if (stryMutAct_9fa48("1136")) {
    {}
  } else {
    stryCov_9fa48("1136");
    const entry = process.argv[1];
    if (stryMutAct_9fa48("1139") ? typeof entry !== 'string' && entry.length === 0 : stryMutAct_9fa48("1138") ? false : stryMutAct_9fa48("1137") ? true : (stryCov_9fa48("1137", "1138", "1139"), (stryMutAct_9fa48("1141") ? typeof entry === 'string' : stryMutAct_9fa48("1140") ? false : (stryCov_9fa48("1140", "1141"), typeof entry !== (stryMutAct_9fa48("1142") ? "" : (stryCov_9fa48("1142"), 'string')))) || (stryMutAct_9fa48("1144") ? entry.length !== 0 : stryMutAct_9fa48("1143") ? false : (stryCov_9fa48("1143", "1144"), entry.length === 0)))) {
      if (stryMutAct_9fa48("1145")) {
        {}
      } else {
        stryCov_9fa48("1145");
        return stryMutAct_9fa48("1146") ? true : (stryCov_9fa48("1146"), false);
      }
    }
    const modulePath = fileURLToPath(import.meta.url);
    return stryMutAct_9fa48("1149") ? path.resolve(entry) !== modulePath : stryMutAct_9fa48("1148") ? false : stryMutAct_9fa48("1147") ? true : (stryCov_9fa48("1147", "1148", "1149"), path.resolve(entry) === modulePath);
  }
};
if (stryMutAct_9fa48("1151") ? false : stryMutAct_9fa48("1150") ? true : (stryCov_9fa48("1150", "1151"), isCliExecution())) {
  if (stryMutAct_9fa48("1152")) {
    {}
  } else {
    stryCov_9fa48("1152");
    runIndexer().catch(err => {
      if (stryMutAct_9fa48("1153")) {
        {}
      } else {
        stryCov_9fa48("1153");
        console.error(err);
        process.exit(1);
      }
    });
  }
}