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
import type { IndexedTask } from "./types.js";
import { LMDBCache, type Cache } from "@promethean-os/lmdb-cache";

/**
 * TaskCache interface for efficient task storage and retrieval
 * Abstracts over lmdb-cache to provide task-specific operations
 */
export interface TaskCache {
  // Direct access operations
  getTask(uuid: string): Promise<IndexedTask | undefined>;
  hasTask(uuid: string): Promise<boolean>;
  setTask(task: IndexedTask): Promise<void>;
  removeTask(uuid: string): Promise<void>;

  // Query operations (streaming for large result sets)
  getTasksByStatus(status: string): AsyncIterable<IndexedTask>;
  getTasksByPriority(priority: string): AsyncIterable<IndexedTask>;
  getTasksByLabel(label: string): AsyncIterable<IndexedTask>;
  searchTasks(query: string): AsyncIterable<IndexedTask>;

  // Batch operations
  indexTasks(tasks: Iterable<IndexedTask>): Promise<number>;

  // Cache management
  getTaskCount(): Promise<number>;
  getLastIndexed(): Promise<Date | undefined>;
  rebuildIndex(): Promise<void>;
  sweepExpired(): Promise<number>;
  close(): Promise<void>;
}

/**
 * Cache configuration options
 */
export type TaskCacheOptions = Readonly<{
  /** Cache directory path */
  path: string;
  /** Default TTL for cached tasks (ms) */
  defaultTtlMs?: number;
  /** Cache namespace */
  namespace?: string;
}>;

/**
 * Internal cache key generators
 */
const CacheKeys = {
  taskById: (uuid: string) => `task/by-id/${uuid}`,
  tasksByStatus: (status: string) => `index/by-status/${status}`,
  tasksByPriority: (priority: string) => `index/by-priority/${priority}`,
  tasksByLabel: (label: string) => `index/by-label/${label}`,
  searchIndex: (term: string) => `index/search/${term}`,
  meta: (key: string) => `meta/${key}`
} as const;

/**
 * LMDB-cache based TaskCache implementation
 */
export class LmdbTaskCache implements TaskCache {
  private readonly tasksCache: Cache<IndexedTask>;
  private readonly indexesCache: Cache<string[]>;
  private readonly metaCache: Cache<{
    value: any;
    timestamp?: number;
  }>;
  private constructor(tasksCache: Cache<IndexedTask>, indexesCache: Cache<string[]>, metaCache: Cache<{
    value: any;
    timestamp?: number;
  }>) {
    if (stryMutAct_9fa48("1680")) {
      {}
    } else {
      stryCov_9fa48("1680");
      this.tasksCache = tasksCache;
      this.indexesCache = indexesCache;
      this.metaCache = metaCache;
    }
  }

  /**
   * Initialize the cache with proper lmdb-cache instances
   */
  static async create(options: TaskCacheOptions): Promise<LmdbTaskCache> {
    if (stryMutAct_9fa48("1681")) {
      {}
    } else {
      stryCov_9fa48("1681");
      // Create single cache with multiple namespaces to avoid connection conflicts
      const baseCache = await new LMDBCache<any>(options.path, {});

      // Create namespaced instances from the same base cache
      const tasksCache = baseCache.withNamespace(stryMutAct_9fa48("1682") ? "" : (stryCov_9fa48("1682"), 'tasks'));
      const indexesCache = baseCache.withNamespace(stryMutAct_9fa48("1683") ? "" : (stryCov_9fa48("1683"), 'indexes'));
      const metaCache = baseCache.withNamespace(stryMutAct_9fa48("1684") ? "" : (stryCov_9fa48("1684"), 'meta'));
      return new LmdbTaskCache(tasksCache, indexesCache, metaCache);
    }
  }
  async getTask(uuid: string): Promise<IndexedTask | undefined> {
    if (stryMutAct_9fa48("1685")) {
      {}
    } else {
      stryCov_9fa48("1685");
      if (stryMutAct_9fa48("1688") ? false : stryMutAct_9fa48("1687") ? true : stryMutAct_9fa48("1686") ? uuid : (stryCov_9fa48("1686", "1687", "1688"), !uuid)) return undefined;
      return this.tasksCache.get(CacheKeys.taskById(uuid));
    }
  }
  async hasTask(uuid: string): Promise<boolean> {
    if (stryMutAct_9fa48("1689")) {
      {}
    } else {
      stryCov_9fa48("1689");
      if (stryMutAct_9fa48("1692") ? false : stryMutAct_9fa48("1691") ? true : stryMutAct_9fa48("1690") ? uuid : (stryCov_9fa48("1690", "1691", "1692"), !uuid)) return stryMutAct_9fa48("1693") ? true : (stryCov_9fa48("1693"), false);
      return this.tasksCache.has(CacheKeys.taskById(uuid));
    }
  }
  async setTask(task: IndexedTask): Promise<void> {
    if (stryMutAct_9fa48("1694")) {
      {}
    } else {
      stryCov_9fa48("1694");
      if (stryMutAct_9fa48("1697") ? false : stryMutAct_9fa48("1696") ? true : stryMutAct_9fa48("1695") ? task.uuid : (stryCov_9fa48("1695", "1696", "1697"), !task.uuid)) return;
      const key = CacheKeys.taskById(task.uuid);

      // Store the task
      await this.tasksCache.set(key, task);

      // Update indexes
      await this.updateTaskIndexes(task);

      // Update metadata
      await this.metaCache.set(CacheKeys.meta(stryMutAct_9fa48("1698") ? "" : (stryCov_9fa48("1698"), 'last-indexed')), stryMutAct_9fa48("1699") ? {} : (stryCov_9fa48("1699"), {
        value: new Date().toISOString(),
        timestamp: Date.now()
      }));
    }
  }
  async removeTask(uuid: string): Promise<void> {
    if (stryMutAct_9fa48("1700")) {
      {}
    } else {
      stryCov_9fa48("1700");
      const task = await this.getTask(uuid);
      if (stryMutAct_9fa48("1703") ? false : stryMutAct_9fa48("1702") ? true : stryMutAct_9fa48("1701") ? task : (stryCov_9fa48("1701", "1702", "1703"), !task)) return;

      // Remove from primary storage
      await this.tasksCache.del(CacheKeys.taskById(uuid));

      // Remove from indexes
      await this.removeFromTaskIndexes(task);
    }
  }
  async *getTasksByStatus(status: string): AsyncIterable<IndexedTask> {
    if (stryMutAct_9fa48("1704")) {
      {}
    } else {
      stryCov_9fa48("1704");
      const taskIds = stryMutAct_9fa48("1707") ? (await this.indexesCache.get(CacheKeys.tasksByStatus(status))) && [] : stryMutAct_9fa48("1706") ? false : stryMutAct_9fa48("1705") ? true : (stryCov_9fa48("1705", "1706", "1707"), (await this.indexesCache.get(CacheKeys.tasksByStatus(status))) || (stryMutAct_9fa48("1708") ? ["Stryker was here"] : (stryCov_9fa48("1708"), [])));
      for (const uuid of taskIds) {
        if (stryMutAct_9fa48("1709")) {
          {}
        } else {
          stryCov_9fa48("1709");
          const task = await this.getTask(uuid);
          if (stryMutAct_9fa48("1711") ? false : stryMutAct_9fa48("1710") ? true : (stryCov_9fa48("1710", "1711"), task)) {
            if (stryMutAct_9fa48("1712")) {
              {}
            } else {
              stryCov_9fa48("1712");
              yield task;
            }
          }
        }
      }
    }
  }
  async *getTasksByPriority(priority: string): AsyncIterable<IndexedTask> {
    if (stryMutAct_9fa48("1713")) {
      {}
    } else {
      stryCov_9fa48("1713");
      const taskIds = stryMutAct_9fa48("1716") ? (await this.indexesCache.get(CacheKeys.tasksByPriority(priority))) && [] : stryMutAct_9fa48("1715") ? false : stryMutAct_9fa48("1714") ? true : (stryCov_9fa48("1714", "1715", "1716"), (await this.indexesCache.get(CacheKeys.tasksByPriority(priority))) || (stryMutAct_9fa48("1717") ? ["Stryker was here"] : (stryCov_9fa48("1717"), [])));
      for (const uuid of taskIds) {
        if (stryMutAct_9fa48("1718")) {
          {}
        } else {
          stryCov_9fa48("1718");
          const task = await this.getTask(uuid);
          if (stryMutAct_9fa48("1720") ? false : stryMutAct_9fa48("1719") ? true : (stryCov_9fa48("1719", "1720"), task)) {
            if (stryMutAct_9fa48("1721")) {
              {}
            } else {
              stryCov_9fa48("1721");
              yield task;
            }
          }
        }
      }
    }
  }
  async *getTasksByLabel(label: string): AsyncIterable<IndexedTask> {
    if (stryMutAct_9fa48("1722")) {
      {}
    } else {
      stryCov_9fa48("1722");
      const taskIds = stryMutAct_9fa48("1725") ? (await this.indexesCache.get(CacheKeys.tasksByLabel(label))) && [] : stryMutAct_9fa48("1724") ? false : stryMutAct_9fa48("1723") ? true : (stryCov_9fa48("1723", "1724", "1725"), (await this.indexesCache.get(CacheKeys.tasksByLabel(label))) || (stryMutAct_9fa48("1726") ? ["Stryker was here"] : (stryCov_9fa48("1726"), [])));
      for (const uuid of taskIds) {
        if (stryMutAct_9fa48("1727")) {
          {}
        } else {
          stryCov_9fa48("1727");
          const task = await this.getTask(uuid);
          if (stryMutAct_9fa48("1729") ? false : stryMutAct_9fa48("1728") ? true : (stryCov_9fa48("1728", "1729"), task)) {
            if (stryMutAct_9fa48("1730")) {
              {}
            } else {
              stryCov_9fa48("1730");
              yield task;
            }
          }
        }
      }
    }
  }
  async *searchTasks(query: string): AsyncIterable<IndexedTask> {
    if (stryMutAct_9fa48("1731")) {
      {}
    } else {
      stryCov_9fa48("1731");
      const terms = stryMutAct_9fa48("1733") ? query.toUpperCase().split(/\s+/).filter(term => term.length > 0) : stryMutAct_9fa48("1732") ? query.toLowerCase().split(/\s+/) : (stryCov_9fa48("1732", "1733"), query.toLowerCase().split(stryMutAct_9fa48("1735") ? /\S+/ : stryMutAct_9fa48("1734") ? /\s/ : (stryCov_9fa48("1734", "1735"), /\s+/)).filter(stryMutAct_9fa48("1736") ? () => undefined : (stryCov_9fa48("1736"), term => stryMutAct_9fa48("1740") ? term.length <= 0 : stryMutAct_9fa48("1739") ? term.length >= 0 : stryMutAct_9fa48("1738") ? false : stryMutAct_9fa48("1737") ? true : (stryCov_9fa48("1737", "1738", "1739", "1740"), term.length > 0))));
      if (stryMutAct_9fa48("1743") ? terms.length !== 0 : stryMutAct_9fa48("1742") ? false : stryMutAct_9fa48("1741") ? true : (stryCov_9fa48("1741", "1742", "1743"), terms.length === 0)) return;

      // Get task IDs for each search term
      const taskIdSets = await Promise.all(terms.map(stryMutAct_9fa48("1744") ? () => undefined : (stryCov_9fa48("1744"), term => stryMutAct_9fa48("1747") ? this.indexesCache.get(CacheKeys.searchIndex(term)) && [] : stryMutAct_9fa48("1746") ? false : stryMutAct_9fa48("1745") ? true : (stryCov_9fa48("1745", "1746", "1747"), this.indexesCache.get(CacheKeys.searchIndex(term)) || (stryMutAct_9fa48("1748") ? ["Stryker was here"] : (stryCov_9fa48("1748"), []))))));

      // Find intersection (tasks that match all terms)
      const commonTaskIds = taskIdSets.reduce((intersection: string[] | undefined, taskIds: string[] | undefined) => {
        if (stryMutAct_9fa48("1749")) {
          {}
        } else {
          stryCov_9fa48("1749");
          if (stryMutAct_9fa48("1752") ? !intersection && intersection.length === 0 : stryMutAct_9fa48("1751") ? false : stryMutAct_9fa48("1750") ? true : (stryCov_9fa48("1750", "1751", "1752"), (stryMutAct_9fa48("1753") ? intersection : (stryCov_9fa48("1753"), !intersection)) || (stryMutAct_9fa48("1755") ? intersection.length !== 0 : stryMutAct_9fa48("1754") ? false : (stryCov_9fa48("1754", "1755"), intersection.length === 0)))) return stryMutAct_9fa48("1758") ? taskIds && [] : stryMutAct_9fa48("1757") ? false : stryMutAct_9fa48("1756") ? true : (stryCov_9fa48("1756", "1757", "1758"), taskIds || (stryMutAct_9fa48("1759") ? ["Stryker was here"] : (stryCov_9fa48("1759"), [])));
          return stryMutAct_9fa48("1760") ? intersection : (stryCov_9fa48("1760"), intersection.filter(stryMutAct_9fa48("1761") ? () => undefined : (stryCov_9fa48("1761"), (uuid: string) => stryMutAct_9fa48("1764") ? taskIds || taskIds.includes(uuid) : stryMutAct_9fa48("1763") ? false : stryMutAct_9fa48("1762") ? true : (stryCov_9fa48("1762", "1763", "1764"), taskIds && taskIds.includes(uuid)))));
        }
      }, stryMutAct_9fa48("1767") ? taskIdSets[0] && [] : stryMutAct_9fa48("1766") ? false : stryMutAct_9fa48("1765") ? true : (stryCov_9fa48("1765", "1766", "1767"), taskIdSets[0] || (stryMutAct_9fa48("1768") ? ["Stryker was here"] : (stryCov_9fa48("1768"), []))));

      // Yield matching tasks
      if (stryMutAct_9fa48("1770") ? false : stryMutAct_9fa48("1769") ? true : (stryCov_9fa48("1769", "1770"), commonTaskIds)) {
        if (stryMutAct_9fa48("1771")) {
          {}
        } else {
          stryCov_9fa48("1771");
          for (const uuid of commonTaskIds) {
            if (stryMutAct_9fa48("1772")) {
              {}
            } else {
              stryCov_9fa48("1772");
              const task = await this.getTask(uuid);
              if (stryMutAct_9fa48("1774") ? false : stryMutAct_9fa48("1773") ? true : (stryCov_9fa48("1773", "1774"), task)) {
                if (stryMutAct_9fa48("1775")) {
                  {}
                } else {
                  stryCov_9fa48("1775");
                  yield task;
                }
              }
            }
          }
        }
      }
    }
  }
  async indexTasks(tasks: Iterable<IndexedTask>): Promise<number> {
    if (stryMutAct_9fa48("1776")) {
      {}
    } else {
      stryCov_9fa48("1776");
      let indexedCount = 0;
      for (const task of tasks) {
        if (stryMutAct_9fa48("1777")) {
          {}
        } else {
          stryCov_9fa48("1777");
          await this.setTask(task);
          stryMutAct_9fa48("1778") ? indexedCount-- : (stryCov_9fa48("1778"), indexedCount++);
        }
      }

      // Update task count metadata
      await this.metaCache.set(CacheKeys.meta(stryMutAct_9fa48("1779") ? "" : (stryCov_9fa48("1779"), 'task-count')), stryMutAct_9fa48("1780") ? {} : (stryCov_9fa48("1780"), {
        value: indexedCount,
        timestamp: Date.now()
      }));
      return indexedCount;
    }
  }
  async getTaskCount(): Promise<number> {
    if (stryMutAct_9fa48("1781")) {
      {}
    } else {
      stryCov_9fa48("1781");
      // Count tasks directly from the task cache for accuracy
      let count = 0;
      for await (const [_key, _task] of this.tasksCache.entries()) {
        if (stryMutAct_9fa48("1782")) {
          {}
        } else {
          stryCov_9fa48("1782");
          stryMutAct_9fa48("1783") ? count-- : (stryCov_9fa48("1783"), count++);
        }
      }

      // Update the cached count for future queries
      await this.metaCache.set(CacheKeys.meta(stryMutAct_9fa48("1784") ? "" : (stryCov_9fa48("1784"), 'task-count')), stryMutAct_9fa48("1785") ? {} : (stryCov_9fa48("1785"), {
        value: count,
        timestamp: Date.now()
      }));
      return count;
    }
  }
  async getLastIndexed(): Promise<Date | undefined> {
    if (stryMutAct_9fa48("1786")) {
      {}
    } else {
      stryCov_9fa48("1786");
      const meta = await this.metaCache.get(CacheKeys.meta(stryMutAct_9fa48("1787") ? "" : (stryCov_9fa48("1787"), 'last-indexed')));
      return (stryMutAct_9fa48("1788") ? meta.value : (stryCov_9fa48("1788"), meta?.value)) ? new Date(meta.value) : undefined;
    }
  }
  async rebuildIndex(): Promise<void> {
    if (stryMutAct_9fa48("1789")) {
      {}
    } else {
      stryCov_9fa48("1789");
      // Clear all indexes
      await this.clearAllIndexes();

      // Rebuild indexes from tasks
      const tasks: IndexedTask[] = stryMutAct_9fa48("1790") ? ["Stryker was here"] : (stryCov_9fa48("1790"), []);
      for await (const [, task] of this.tasksCache.entries()) {
        if (stryMutAct_9fa48("1791")) {
          {}
        } else {
          stryCov_9fa48("1791");
          tasks.push(task);
        }
      }

      // Re-index all tasks
      await this.indexTasks(tasks);
    }
  }
  async sweepExpired(): Promise<number> {
    if (stryMutAct_9fa48("1792")) {
      {}
    } else {
      stryCov_9fa48("1792");
      // Sweep expired entries from all caches
      const tasksRemoved = await this.tasksCache.sweepExpired();
      const indexesRemoved = await this.indexesCache.sweepExpired();
      const metaRemoved = await this.metaCache.sweepExpired();
      return stryMutAct_9fa48("1793") ? tasksRemoved + indexesRemoved - metaRemoved : (stryCov_9fa48("1793"), (stryMutAct_9fa48("1794") ? tasksRemoved - indexesRemoved : (stryCov_9fa48("1794"), tasksRemoved + indexesRemoved)) + metaRemoved);
    }
  }
  async close(): Promise<void> {
    if (stryMutAct_9fa48("1795")) {
      {}
    } else {
      stryCov_9fa48("1795");
      // With namespaced caches sharing the same underlying database,
      // we only need to close one of them
      await this.tasksCache.close();
    }
  }

  /**
   * Update indexes when a task is added/modified
   */
  private async updateTaskIndexes(task: IndexedTask): Promise<void> {
    if (stryMutAct_9fa48("1796")) {
      {}
    } else {
      stryCov_9fa48("1796");
      const uuid = task.uuid;
      if (stryMutAct_9fa48("1799") ? false : stryMutAct_9fa48("1798") ? true : stryMutAct_9fa48("1797") ? uuid : (stryCov_9fa48("1797", "1798", "1799"), !uuid)) return;

      // Status index
      if (stryMutAct_9fa48("1801") ? false : stryMutAct_9fa48("1800") ? true : (stryCov_9fa48("1800", "1801"), task.status)) {
        if (stryMutAct_9fa48("1802")) {
          {}
        } else {
          stryCov_9fa48("1802");
          await this.addToIndex(CacheKeys.tasksByStatus(task.status), uuid);
        }
      }

      // Priority index
      if (stryMutAct_9fa48("1804") ? false : stryMutAct_9fa48("1803") ? true : (stryCov_9fa48("1803", "1804"), task.priority)) {
        if (stryMutAct_9fa48("1805")) {
          {}
        } else {
          stryCov_9fa48("1805");
          await this.addToIndex(CacheKeys.tasksByPriority(String(task.priority)), uuid);
        }
      }

      // Label indexes
      if (stryMutAct_9fa48("1807") ? false : stryMutAct_9fa48("1806") ? true : (stryCov_9fa48("1806", "1807"), task.labels)) {
        if (stryMutAct_9fa48("1808")) {
          {}
        } else {
          stryCov_9fa48("1808");
          for (const label of task.labels) {
            if (stryMutAct_9fa48("1809")) {
              {}
            } else {
              stryCov_9fa48("1809");
              await this.addToIndex(CacheKeys.tasksByLabel(label), uuid);
            }
          }
        }
      }

      // Search index (index title and content)
      await this.updateSearchIndex(task);
    }
  }

  /**
   * Remove task from all indexes
   */
  private async removeFromTaskIndexes(task: IndexedTask): Promise<void> {
    if (stryMutAct_9fa48("1810")) {
      {}
    } else {
      stryCov_9fa48("1810");
      const uuid = task.uuid;
      if (stryMutAct_9fa48("1813") ? false : stryMutAct_9fa48("1812") ? true : stryMutAct_9fa48("1811") ? uuid : (stryCov_9fa48("1811", "1812", "1813"), !uuid)) return;

      // Remove from status index
      if (stryMutAct_9fa48("1815") ? false : stryMutAct_9fa48("1814") ? true : (stryCov_9fa48("1814", "1815"), task.status)) {
        if (stryMutAct_9fa48("1816")) {
          {}
        } else {
          stryCov_9fa48("1816");
          await this.removeFromIndex(CacheKeys.tasksByStatus(task.status), uuid);
        }
      }

      // Remove from priority index
      if (stryMutAct_9fa48("1818") ? false : stryMutAct_9fa48("1817") ? true : (stryCov_9fa48("1817", "1818"), task.priority)) {
        if (stryMutAct_9fa48("1819")) {
          {}
        } else {
          stryCov_9fa48("1819");
          await this.removeFromIndex(CacheKeys.tasksByPriority(String(task.priority)), uuid);
        }
      }

      // Remove from label indexes
      if (stryMutAct_9fa48("1821") ? false : stryMutAct_9fa48("1820") ? true : (stryCov_9fa48("1820", "1821"), task.labels)) {
        if (stryMutAct_9fa48("1822")) {
          {}
        } else {
          stryCov_9fa48("1822");
          for (const label of task.labels) {
            if (stryMutAct_9fa48("1823")) {
              {}
            } else {
              stryCov_9fa48("1823");
              await this.removeFromIndex(CacheKeys.tasksByLabel(label), uuid);
            }
          }
        }
      }

      // Remove from search index
      await this.removeFromSearchIndex(task);
    }
  }

  /**
   * Add UUID to an index set
   */
  private async addToIndex(indexKey: string, uuid: string): Promise<void> {
    if (stryMutAct_9fa48("1824")) {
      {}
    } else {
      stryCov_9fa48("1824");
      if (stryMutAct_9fa48("1827") ? !indexKey && !uuid : stryMutAct_9fa48("1826") ? false : stryMutAct_9fa48("1825") ? true : (stryCov_9fa48("1825", "1826", "1827"), (stryMutAct_9fa48("1828") ? indexKey : (stryCov_9fa48("1828"), !indexKey)) || (stryMutAct_9fa48("1829") ? uuid : (stryCov_9fa48("1829"), !uuid)))) return;
      const current = stryMutAct_9fa48("1832") ? (await this.indexesCache.get(indexKey)) && [] : stryMutAct_9fa48("1831") ? false : stryMutAct_9fa48("1830") ? true : (stryCov_9fa48("1830", "1831", "1832"), (await this.indexesCache.get(indexKey)) || (stryMutAct_9fa48("1833") ? ["Stryker was here"] : (stryCov_9fa48("1833"), [])));
      if (stryMutAct_9fa48("1836") ? false : stryMutAct_9fa48("1835") ? true : stryMutAct_9fa48("1834") ? current.includes(uuid) : (stryCov_9fa48("1834", "1835", "1836"), !current.includes(uuid))) {
        if (stryMutAct_9fa48("1837")) {
          {}
        } else {
          stryCov_9fa48("1837");
          await this.indexesCache.set(indexKey, stryMutAct_9fa48("1838") ? [] : (stryCov_9fa48("1838"), [...current, uuid]));
        }
      }
    }
  }

  /**
   * Remove UUID from an index set
   */
  private async removeFromIndex(indexKey: string, uuid: string): Promise<void> {
    if (stryMutAct_9fa48("1839")) {
      {}
    } else {
      stryCov_9fa48("1839");
      if (stryMutAct_9fa48("1842") ? !indexKey && !uuid : stryMutAct_9fa48("1841") ? false : stryMutAct_9fa48("1840") ? true : (stryCov_9fa48("1840", "1841", "1842"), (stryMutAct_9fa48("1843") ? indexKey : (stryCov_9fa48("1843"), !indexKey)) || (stryMutAct_9fa48("1844") ? uuid : (stryCov_9fa48("1844"), !uuid)))) return;
      const current = stryMutAct_9fa48("1847") ? (await this.indexesCache.get(indexKey)) && [] : stryMutAct_9fa48("1846") ? false : stryMutAct_9fa48("1845") ? true : (stryCov_9fa48("1845", "1846", "1847"), (await this.indexesCache.get(indexKey)) || (stryMutAct_9fa48("1848") ? ["Stryker was here"] : (stryCov_9fa48("1848"), [])));
      const filtered = stryMutAct_9fa48("1849") ? current : (stryCov_9fa48("1849"), current.filter(stryMutAct_9fa48("1850") ? () => undefined : (stryCov_9fa48("1850"), id => stryMutAct_9fa48("1853") ? id === uuid : stryMutAct_9fa48("1852") ? false : stryMutAct_9fa48("1851") ? true : (stryCov_9fa48("1851", "1852", "1853"), id !== uuid))));
      await this.indexesCache.set(indexKey, filtered);
    }
  }

  /**
   * Update search index for a task
   */
  private async updateSearchIndex(task: IndexedTask): Promise<void> {
    if (stryMutAct_9fa48("1854")) {
      {}
    } else {
      stryCov_9fa48("1854");
      const searchableText = stryMutAct_9fa48("1855") ? [task.title || '', task.content || '', ...(task.labels || [])].join(' ').toUpperCase() : (stryCov_9fa48("1855"), (stryMutAct_9fa48("1856") ? [] : (stryCov_9fa48("1856"), [stryMutAct_9fa48("1859") ? task.title && '' : stryMutAct_9fa48("1858") ? false : stryMutAct_9fa48("1857") ? true : (stryCov_9fa48("1857", "1858", "1859"), task.title || (stryMutAct_9fa48("1860") ? "Stryker was here!" : (stryCov_9fa48("1860"), ''))), stryMutAct_9fa48("1863") ? task.content && '' : stryMutAct_9fa48("1862") ? false : stryMutAct_9fa48("1861") ? true : (stryCov_9fa48("1861", "1862", "1863"), task.content || (stryMutAct_9fa48("1864") ? "Stryker was here!" : (stryCov_9fa48("1864"), ''))), ...(stryMutAct_9fa48("1867") ? task.labels && [] : stryMutAct_9fa48("1866") ? false : stryMutAct_9fa48("1865") ? true : (stryCov_9fa48("1865", "1866", "1867"), task.labels || (stryMutAct_9fa48("1868") ? ["Stryker was here"] : (stryCov_9fa48("1868"), []))))])).join(stryMutAct_9fa48("1869") ? "" : (stryCov_9fa48("1869"), ' ')).toLowerCase());

      // Extract terms (simple word tokenization)
      const terms = stryMutAct_9fa48("1871") ? searchableText.split(/\s+/).map(term => term.replace(/[^\w]/g, '')).filter((term: string, index: number, array: string[]) => array.indexOf(term) === index) : stryMutAct_9fa48("1870") ? searchableText.split(/\s+/).map(term => term.replace(/[^\w]/g, '')).filter(term => term.length > 2) : (stryCov_9fa48("1870", "1871"), searchableText.split(stryMutAct_9fa48("1873") ? /\S+/ : stryMutAct_9fa48("1872") ? /\s/ : (stryCov_9fa48("1872", "1873"), /\s+/)).map(stryMutAct_9fa48("1874") ? () => undefined : (stryCov_9fa48("1874"), term => term.replace(stryMutAct_9fa48("1876") ? /[^\W]/g : stryMutAct_9fa48("1875") ? /[\w]/g : (stryCov_9fa48("1875", "1876"), /[^\w]/g), stryMutAct_9fa48("1877") ? "Stryker was here!" : (stryCov_9fa48("1877"), '')))).filter(stryMutAct_9fa48("1878") ? () => undefined : (stryCov_9fa48("1878"), term => stryMutAct_9fa48("1882") ? term.length <= 2 : stryMutAct_9fa48("1881") ? term.length >= 2 : stryMutAct_9fa48("1880") ? false : stryMutAct_9fa48("1879") ? true : (stryCov_9fa48("1879", "1880", "1881", "1882"), term.length > 2))).filter(stryMutAct_9fa48("1883") ? () => undefined : (stryCov_9fa48("1883"), (term: string, index: number, array: string[]) => stryMutAct_9fa48("1886") ? array.indexOf(term) !== index : stryMutAct_9fa48("1885") ? false : stryMutAct_9fa48("1884") ? true : (stryCov_9fa48("1884", "1885", "1886"), array.indexOf(term) === index)))); // unique

      // Add task ID to each term's index
      for (const term of terms) {
        if (stryMutAct_9fa48("1887")) {
          {}
        } else {
          stryCov_9fa48("1887");
          if (stryMutAct_9fa48("1889") ? false : stryMutAct_9fa48("1888") ? true : (stryCov_9fa48("1888", "1889"), task.uuid)) {
            if (stryMutAct_9fa48("1890")) {
              {}
            } else {
              stryCov_9fa48("1890");
              await this.addToIndex(CacheKeys.searchIndex(term), task.uuid);
            }
          }
        }
      }
    }
  }

  /**
   * Remove task from search index
   */
  private async removeFromSearchIndex(task: IndexedTask): Promise<void> {
    if (stryMutAct_9fa48("1891")) {
      {}
    } else {
      stryCov_9fa48("1891");
      const searchableText = stryMutAct_9fa48("1892") ? [task.title || '', task.content || '', ...(task.labels || [])].join(' ').toUpperCase() : (stryCov_9fa48("1892"), (stryMutAct_9fa48("1893") ? [] : (stryCov_9fa48("1893"), [stryMutAct_9fa48("1896") ? task.title && '' : stryMutAct_9fa48("1895") ? false : stryMutAct_9fa48("1894") ? true : (stryCov_9fa48("1894", "1895", "1896"), task.title || (stryMutAct_9fa48("1897") ? "Stryker was here!" : (stryCov_9fa48("1897"), ''))), stryMutAct_9fa48("1900") ? task.content && '' : stryMutAct_9fa48("1899") ? false : stryMutAct_9fa48("1898") ? true : (stryCov_9fa48("1898", "1899", "1900"), task.content || (stryMutAct_9fa48("1901") ? "Stryker was here!" : (stryCov_9fa48("1901"), ''))), ...(stryMutAct_9fa48("1904") ? task.labels && [] : stryMutAct_9fa48("1903") ? false : stryMutAct_9fa48("1902") ? true : (stryCov_9fa48("1902", "1903", "1904"), task.labels || (stryMutAct_9fa48("1905") ? ["Stryker was here"] : (stryCov_9fa48("1905"), []))))])).join(stryMutAct_9fa48("1906") ? "" : (stryCov_9fa48("1906"), ' ')).toLowerCase());
      const terms = stryMutAct_9fa48("1908") ? searchableText.split(/\s+/).map(term => term.replace(/[^\w]/g, '')).filter((term: string, index: number, array: string[]) => array.indexOf(term) === index) : stryMutAct_9fa48("1907") ? searchableText.split(/\s+/).map(term => term.replace(/[^\w]/g, '')).filter(term => term.length > 2) : (stryCov_9fa48("1907", "1908"), searchableText.split(stryMutAct_9fa48("1910") ? /\S+/ : stryMutAct_9fa48("1909") ? /\s/ : (stryCov_9fa48("1909", "1910"), /\s+/)).map(stryMutAct_9fa48("1911") ? () => undefined : (stryCov_9fa48("1911"), term => term.replace(stryMutAct_9fa48("1913") ? /[^\W]/g : stryMutAct_9fa48("1912") ? /[\w]/g : (stryCov_9fa48("1912", "1913"), /[^\w]/g), stryMutAct_9fa48("1914") ? "Stryker was here!" : (stryCov_9fa48("1914"), '')))).filter(stryMutAct_9fa48("1915") ? () => undefined : (stryCov_9fa48("1915"), term => stryMutAct_9fa48("1919") ? term.length <= 2 : stryMutAct_9fa48("1918") ? term.length >= 2 : stryMutAct_9fa48("1917") ? false : stryMutAct_9fa48("1916") ? true : (stryCov_9fa48("1916", "1917", "1918", "1919"), term.length > 2))).filter(stryMutAct_9fa48("1920") ? () => undefined : (stryCov_9fa48("1920"), (term: string, index: number, array: string[]) => stryMutAct_9fa48("1923") ? array.indexOf(term) !== index : stryMutAct_9fa48("1922") ? false : stryMutAct_9fa48("1921") ? true : (stryCov_9fa48("1921", "1922", "1923"), array.indexOf(term) === index))));
      for (const term of terms) {
        if (stryMutAct_9fa48("1924")) {
          {}
        } else {
          stryCov_9fa48("1924");
          if (stryMutAct_9fa48("1926") ? false : stryMutAct_9fa48("1925") ? true : (stryCov_9fa48("1925", "1926"), task.uuid)) {
            if (stryMutAct_9fa48("1927")) {
              {}
            } else {
              stryCov_9fa48("1927");
              await this.removeFromIndex(CacheKeys.searchIndex(term), task.uuid);
            }
          }
        }
      }
    }
  }

  /**
   * Clear all indexes (used for rebuild)
   */
  private async clearAllIndexes(): Promise<void> {
    if (stryMutAct_9fa48("1928")) {
      {}
    } else {
      stryCov_9fa48("1928");
      const indexes: string[] = stryMutAct_9fa48("1929") ? ["Stryker was here"] : (stryCov_9fa48("1929"), []);

      // Collect all index keys
      for await (const [key] of this.indexesCache.entries()) {
        if (stryMutAct_9fa48("1930")) {
          {}
        } else {
          stryCov_9fa48("1930");
          if (stryMutAct_9fa48("1933") ? key.endsWith('index/') : stryMutAct_9fa48("1932") ? false : stryMutAct_9fa48("1931") ? true : (stryCov_9fa48("1931", "1932", "1933"), key.startsWith(stryMutAct_9fa48("1934") ? "" : (stryCov_9fa48("1934"), 'index/')))) {
            if (stryMutAct_9fa48("1935")) {
              {}
            } else {
              stryCov_9fa48("1935");
              indexes.push(key);
            }
          }
        }
      }

      // Delete all indexes
      if (stryMutAct_9fa48("1939") ? indexes.length <= 0 : stryMutAct_9fa48("1938") ? indexes.length >= 0 : stryMutAct_9fa48("1937") ? false : stryMutAct_9fa48("1936") ? true : (stryCov_9fa48("1936", "1937", "1938", "1939"), indexes.length > 0)) {
        if (stryMutAct_9fa48("1940")) {
          {}
        } else {
          stryCov_9fa48("1940");
          await this.indexesCache.batch(indexes.map(stryMutAct_9fa48("1941") ? () => undefined : (stryCov_9fa48("1941"), key => stryMutAct_9fa48("1942") ? {} : (stryCov_9fa48("1942"), {
            type: stryMutAct_9fa48("1943") ? "" : (stryCov_9fa48("1943"), 'del'),
            key
          }))));
        }
      }
    }
  }
}

/**
 * Factory function to create a TaskCache instance
 */
export const createTaskCache = async (options: TaskCacheOptions): Promise<TaskCache> => {
  if (stryMutAct_9fa48("1944")) {
    {}
  } else {
    stryCov_9fa48("1944");
    return await LmdbTaskCache.create(options);
  }
};