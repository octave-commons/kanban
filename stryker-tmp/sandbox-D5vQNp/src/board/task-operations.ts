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
import type { IndexedTask } from './types.js';
import type { TaskCache } from './task-cache.js';
import type { Task } from '../lib/types.js';

/**
 * Convert IndexedTask to Task (format used by board operations)
 */
export const indexedTaskToTask = stryMutAct_9fa48("1945") ? () => undefined : (stryCov_9fa48("1945"), (() => {
  const indexedTaskToTask = (indexedTask: IndexedTask): Task => stryMutAct_9fa48("1946") ? {} : (stryCov_9fa48("1946"), {
    uuid: stryMutAct_9fa48("1949") ? indexedTask.uuid && '' : stryMutAct_9fa48("1948") ? false : stryMutAct_9fa48("1947") ? true : (stryCov_9fa48("1947", "1948", "1949"), indexedTask.uuid || (stryMutAct_9fa48("1950") ? "Stryker was here!" : (stryCov_9fa48("1950"), ''))),
    title: indexedTask.title,
    status: indexedTask.status,
    priority: indexedTask.priority,
    labels: indexedTask.labels ? stryMutAct_9fa48("1951") ? [] : (stryCov_9fa48("1951"), [...indexedTask.labels]) : stryMutAct_9fa48("1952") ? ["Stryker was here"] : (stryCov_9fa48("1952"), []),
    created_at: stryMutAct_9fa48("1953") ? indexedTask.created_at && indexedTask.created : (stryCov_9fa48("1953"), indexedTask.created_at ?? indexedTask.created),
    estimates: {},
    content: indexedTask.content,
    slug: indexedTask.id
  });
  return indexedTaskToTask;
})());

/**
 * Streaming task operations that work with TaskCache instead of memory arrays
 */
export class TaskOperations {
  constructor(private readonly cache: TaskCache) {}

  /**
   * Get tasks by status with streaming support
   */
  async getTasksByStatus(status: string, options?: Readonly<{
    limit?: number;
  }>): Promise<Task[]> {
    if (stryMutAct_9fa48("1954")) {
      {}
    } else {
      stryCov_9fa48("1954");
      const tasks: Task[] = stryMutAct_9fa48("1955") ? ["Stryker was here"] : (stryCov_9fa48("1955"), []);
      let count = 0;
      const limit = stryMutAct_9fa48("1956") ? options.limit : (stryCov_9fa48("1956"), options?.limit);
      for await (const indexedTask of this.cache.getTasksByStatus(status)) {
        if (stryMutAct_9fa48("1957")) {
          {}
        } else {
          stryCov_9fa48("1957");
          if (stryMutAct_9fa48("1960") ? limit || count >= limit : stryMutAct_9fa48("1959") ? false : stryMutAct_9fa48("1958") ? true : (stryCov_9fa48("1958", "1959", "1960"), limit && (stryMutAct_9fa48("1963") ? count < limit : stryMutAct_9fa48("1962") ? count > limit : stryMutAct_9fa48("1961") ? true : (stryCov_9fa48("1961", "1962", "1963"), count >= limit)))) break;
          tasks.push(indexedTaskToTask(indexedTask));
          stryMutAct_9fa48("1964") ? count-- : (stryCov_9fa48("1964"), count++);
        }
      }
      return tasks;
    }
  }

  /**
   * Get single task by UUID
   */
  async getTaskByUuid(uuid: string): Promise<Task | undefined> {
    if (stryMutAct_9fa48("1965")) {
      {}
    } else {
      stryCov_9fa48("1965");
      const indexedTask = await this.cache.getTask(uuid);
      return indexedTask ? indexedTaskToTask(indexedTask) : undefined;
    }
  }

  /**
   * Search tasks with streaming results
   */
  async searchTasks(query: string, options?: Readonly<{
    limit?: number;
  }>): Promise<Task[]> {
    if (stryMutAct_9fa48("1966")) {
      {}
    } else {
      stryCov_9fa48("1966");
      const tasks: Task[] = stryMutAct_9fa48("1967") ? ["Stryker was here"] : (stryCov_9fa48("1967"), []);
      let count = 0;
      const limit = stryMutAct_9fa48("1968") ? options.limit : (stryCov_9fa48("1968"), options?.limit);
      for await (const indexedTask of this.cache.searchTasks(query)) {
        if (stryMutAct_9fa48("1969")) {
          {}
        } else {
          stryCov_9fa48("1969");
          if (stryMutAct_9fa48("1972") ? limit || count >= limit : stryMutAct_9fa48("1971") ? false : stryMutAct_9fa48("1970") ? true : (stryCov_9fa48("1970", "1971", "1972"), limit && (stryMutAct_9fa48("1975") ? count < limit : stryMutAct_9fa48("1974") ? count > limit : stryMutAct_9fa48("1973") ? true : (stryCov_9fa48("1973", "1974", "1975"), count >= limit)))) break;
          tasks.push(indexedTaskToTask(indexedTask));
          stryMutAct_9fa48("1976") ? count-- : (stryCov_9fa48("1976"), count++);
        }
      }
      return tasks;
    }
  }

  /**
   * Get tasks by priority with streaming support
   */
  async getTasksByPriority(priority: string, options?: Readonly<{
    limit?: number;
  }>): Promise<Task[]> {
    if (stryMutAct_9fa48("1977")) {
      {}
    } else {
      stryCov_9fa48("1977");
      const tasks: Task[] = stryMutAct_9fa48("1978") ? ["Stryker was here"] : (stryCov_9fa48("1978"), []);
      let count = 0;
      const limit = stryMutAct_9fa48("1979") ? options.limit : (stryCov_9fa48("1979"), options?.limit);
      for await (const indexedTask of this.cache.getTasksByPriority(priority)) {
        if (stryMutAct_9fa48("1980")) {
          {}
        } else {
          stryCov_9fa48("1980");
          if (stryMutAct_9fa48("1983") ? limit || count >= limit : stryMutAct_9fa48("1982") ? false : stryMutAct_9fa48("1981") ? true : (stryCov_9fa48("1981", "1982", "1983"), limit && (stryMutAct_9fa48("1986") ? count < limit : stryMutAct_9fa48("1985") ? count > limit : stryMutAct_9fa48("1984") ? true : (stryCov_9fa48("1984", "1985", "1986"), count >= limit)))) break;
          tasks.push(indexedTaskToTask(indexedTask));
          stryMutAct_9fa48("1987") ? count-- : (stryCov_9fa48("1987"), count++);
        }
      }
      return tasks;
    }
  }

  /**
   * Get tasks by label with streaming support
   */
  async getTasksByLabel(label: string, options?: Readonly<{
    limit?: number;
  }>): Promise<Task[]> {
    if (stryMutAct_9fa48("1988")) {
      {}
    } else {
      stryCov_9fa48("1988");
      const tasks: Task[] = stryMutAct_9fa48("1989") ? ["Stryker was here"] : (stryCov_9fa48("1989"), []);
      let count = 0;
      const limit = stryMutAct_9fa48("1990") ? options.limit : (stryCov_9fa48("1990"), options?.limit);
      for await (const indexedTask of this.cache.getTasksByLabel(label)) {
        if (stryMutAct_9fa48("1991")) {
          {}
        } else {
          stryCov_9fa48("1991");
          if (stryMutAct_9fa48("1994") ? limit || count >= limit : stryMutAct_9fa48("1993") ? false : stryMutAct_9fa48("1992") ? true : (stryCov_9fa48("1992", "1993", "1994"), limit && (stryMutAct_9fa48("1997") ? count < limit : stryMutAct_9fa48("1996") ? count > limit : stryMutAct_9fa48("1995") ? true : (stryCov_9fa48("1995", "1996", "1997"), count >= limit)))) break;
          tasks.push(indexedTaskToTask(indexedTask));
          stryMutAct_9fa48("1998") ? count-- : (stryCov_9fa48("1998"), count++);
        }
      }
      return tasks;
    }
  }

  /**
   * Count tasks by status (efficient operation using cache metadata)
   */
  async countTasksByStatus(status: string): Promise<number> {
    if (stryMutAct_9fa48("1999")) {
      {}
    } else {
      stryCov_9fa48("1999");
      let count = 0;
      for await (const _ of this.cache.getTasksByStatus(status)) {
        if (stryMutAct_9fa48("2000")) {
          {}
        } else {
          stryCov_9fa48("2000");
          stryMutAct_9fa48("2001") ? count-- : (stryCov_9fa48("2001"), count++);
        }
      }
      return count;
    }
  }

  /**
   * Count total tasks (uses cache metadata if available)
   */
  async getTotalTaskCount(): Promise<number> {
    if (stryMutAct_9fa48("2002")) {
      {}
    } else {
      stryCov_9fa48("2002");
      return await this.cache.getTaskCount();
    }
  }

  /**
   * Get task statistics without loading all tasks
   */
  async getTaskStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    if (stryMutAct_9fa48("2003")) {
      {}
    } else {
      stryCov_9fa48("2003");
      const total = await this.getTotalTaskCount();
      const byStatus: Record<string, number> = {};
      const byPriority: Record<string, number> = {};

      // For a real implementation, we'd add these as separate cache metadata
      // For now, we'll sample and estimate
      const commonStatuses = stryMutAct_9fa48("2004") ? [] : (stryCov_9fa48("2004"), [stryMutAct_9fa48("2005") ? "" : (stryCov_9fa48("2005"), 'todo'), stryMutAct_9fa48("2006") ? "" : (stryCov_9fa48("2006"), 'in_progress'), stryMutAct_9fa48("2007") ? "" : (stryCov_9fa48("2007"), 'review'), stryMutAct_9fa48("2008") ? "" : (stryCov_9fa48("2008"), 'done'), stryMutAct_9fa48("2009") ? "" : (stryCov_9fa48("2009"), 'breakdown'), stryMutAct_9fa48("2010") ? "" : (stryCov_9fa48("2010"), 'ready')]);
      for (const status of commonStatuses) {
        if (stryMutAct_9fa48("2011")) {
          {}
        } else {
          stryCov_9fa48("2011");
          byStatus[status] = await this.countTasksByStatus(status);
        }
      }

      // Count other tasks to get accurate total
      const otherStatuses = stryMutAct_9fa48("2012") ? total + Object.values(byStatus).reduce((a, b) => a + b, 0) : (stryCov_9fa48("2012"), total - Object.values(byStatus).reduce(stryMutAct_9fa48("2013") ? () => undefined : (stryCov_9fa48("2013"), (a, b) => stryMutAct_9fa48("2014") ? a - b : (stryCov_9fa48("2014"), a + b)), 0));
      if (stryMutAct_9fa48("2018") ? otherStatuses <= 0 : stryMutAct_9fa48("2017") ? otherStatuses >= 0 : stryMutAct_9fa48("2016") ? false : stryMutAct_9fa48("2015") ? true : (stryCov_9fa48("2015", "2016", "2017", "2018"), otherStatuses > 0)) {
        if (stryMutAct_9fa48("2019")) {
          {}
        } else {
          stryCov_9fa48("2019");
          byStatus[stryMutAct_9fa48("2020") ? "" : (stryCov_9fa48("2020"), 'other')] = otherStatuses;
        }
      }
      return stryMutAct_9fa48("2021") ? {} : (stryCov_9fa48("2021"), {
        total,
        byStatus,
        byPriority
      });
    }
  }

  /**
   * Batch update tasks (for moving multiple tasks)
   */
  async batchUpdateTasks(updates: Array<{
    uuid: string;
    updates: Partial<Pick<Task, 'status' | 'priority' | 'labels'>>;
  }>): Promise<{
    updated: number;
    errors: string[];
  }> {
    if (stryMutAct_9fa48("2022")) {
      {}
    } else {
      stryCov_9fa48("2022");
      const errors: string[] = stryMutAct_9fa48("2023") ? ["Stryker was here"] : (stryCov_9fa48("2023"), []);
      let updated = 0;
      for (const {
        uuid,
        updates: taskUpdates
      } of updates) {
        if (stryMutAct_9fa48("2024")) {
          {}
        } else {
          stryCov_9fa48("2024");
          try {
            if (stryMutAct_9fa48("2025")) {
              {}
            } else {
              stryCov_9fa48("2025");
              const existingTask = await this.cache.getTask(uuid);
              if (stryMutAct_9fa48("2028") ? false : stryMutAct_9fa48("2027") ? true : stryMutAct_9fa48("2026") ? existingTask : (stryCov_9fa48("2026", "2027", "2028"), !existingTask)) {
                if (stryMutAct_9fa48("2029")) {
                  {}
                } else {
                  stryCov_9fa48("2029");
                  errors.push(stryMutAct_9fa48("2030") ? `` : (stryCov_9fa48("2030"), `Task not found: ${uuid}`));
                  continue;
                }
              }

              // Create updated indexed task
              const updatedTask: IndexedTask = {
                ...existingTask,
                ...taskUpdates,
                // Ensure path is preserved
                path: existingTask.path
              } as IndexedTask;
              await this.cache.setTask(updatedTask);
              stryMutAct_9fa48("2031") ? updated-- : (stryCov_9fa48("2031"), updated++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("2032")) {
              {}
            } else {
              stryCov_9fa48("2032");
              errors.push(stryMutAct_9fa48("2033") ? `` : (stryCov_9fa48("2033"), `Failed to update task ${uuid}: ${error instanceof Error ? error.message : String(error)}`));
            }
          }
        }
      }
      return stryMutAct_9fa48("2034") ? {} : (stryCov_9fa48("2034"), {
        updated,
        errors
      });
    }
  }

  /**
   * Rebuild search index for all tasks
   */
  async rebuildSearchIndex(): Promise<void> {
    if (stryMutAct_9fa48("2035")) {
      {}
    } else {
      stryCov_9fa48("2035");
      await this.cache.rebuildIndex();
    }
  }

  /**
   * Clean up expired cache entries
   */
  async cleanup(): Promise<number> {
    if (stryMutAct_9fa48("2036")) {
      {}
    } else {
      stryCov_9fa48("2036");
      return await this.cache.sweepExpired();
    }
  }

  /**
   * Close the cache connection
   */
  async close(): Promise<void> {
    if (stryMutAct_9fa48("2037")) {
      {}
    } else {
      stryCov_9fa48("2037");
      await this.cache.close();
    }
  }
}

/**
 * Factory function to create TaskOperations instance
 */
export const createTaskOperations = (cache: TaskCache): TaskOperations => {
  if (stryMutAct_9fa48("2038")) {
    {}
  } else {
    stryCov_9fa48("2038");
    return new TaskOperations(cache);
  }
};