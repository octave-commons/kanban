#!/usr/bin/env node
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
import { loadKanbanConfig } from "./config.js";
import { createTaskCache } from "./task-cache.js";
import { createTaskOperations } from "./task-operations.js";
import { fileURLToPath } from "node:url";
const isCliExecution = (): boolean => {
  if (stryMutAct_9fa48("2039")) {
    {}
  } else {
    stryCov_9fa48("2039");
    const entry = process.argv[1];
    if (stryMutAct_9fa48("2042") ? typeof entry !== "string" && entry.length === 0 : stryMutAct_9fa48("2041") ? false : stryMutAct_9fa48("2040") ? true : (stryCov_9fa48("2040", "2041", "2042"), (stryMutAct_9fa48("2044") ? typeof entry === "string" : stryMutAct_9fa48("2043") ? false : (stryCov_9fa48("2043", "2044"), typeof entry !== (stryMutAct_9fa48("2045") ? "" : (stryCov_9fa48("2045"), "string")))) || (stryMutAct_9fa48("2047") ? entry.length !== 0 : stryMutAct_9fa48("2046") ? false : (stryCov_9fa48("2046", "2047"), entry.length === 0)))) {
      if (stryMutAct_9fa48("2048")) {
        {}
      } else {
        stryCov_9fa48("2048");
        return stryMutAct_9fa48("2049") ? true : (stryCov_9fa48("2049"), false);
      }
    }
    const modulePath = fileURLToPath(import.meta.url);
    return stryMutAct_9fa48("2052") ? path.resolve(entry) !== modulePath : stryMutAct_9fa48("2051") ? false : stryMutAct_9fa48("2050") ? true : (stryCov_9fa48("2050", "2051", "2052"), path.resolve(entry) === modulePath);
  }
};
const testCachePerformance = async (): Promise<void> => {
  if (stryMutAct_9fa48("2053")) {
    {}
  } else {
    stryCov_9fa48("2053");
    console.log(stryMutAct_9fa48("2054") ? "" : (stryCov_9fa48("2054"), "Testing cache performance..."));
    const {
      config
    } = await loadKanbanConfig();
    const cache = await createTaskCache(stryMutAct_9fa48("2055") ? {} : (stryCov_9fa48("2055"), {
      path: config.cachePath,
      namespace: stryMutAct_9fa48("2056") ? "" : (stryCov_9fa48("2056"), "kanban"),
      defaultTtlMs: stryMutAct_9fa48("2057") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("2057"), (stryMutAct_9fa48("2058") ? 24 * 60 / 60 : (stryCov_9fa48("2058"), (stryMutAct_9fa48("2059") ? 24 / 60 : (stryCov_9fa48("2059"), 24 * 60)) * 60)) * 1000)
    }));
    try {
      if (stryMutAct_9fa48("2060")) {
        {}
      } else {
        stryCov_9fa48("2060");
        const taskOps = createTaskOperations(cache);

        // Test 1: Get task count
        const totalTasks = await taskOps.getTotalTaskCount();
        console.log(stryMutAct_9fa48("2061") ? `` : (stryCov_9fa48("2061"), `✓ Total tasks in cache: ${totalTasks}`));

        // Test 2: Get tasks by status (streaming)
        console.log(stryMutAct_9fa48("2062") ? "" : (stryCov_9fa48("2062"), "✓ Testing streaming tasks by status..."));
        const todoTasks = await taskOps.getTasksByStatus(stryMutAct_9fa48("2063") ? "" : (stryCov_9fa48("2063"), 'todo'), stryMutAct_9fa48("2064") ? {} : (stryCov_9fa48("2064"), {
          limit: 10
        }));
        console.log(stryMutAct_9fa48("2065") ? `` : (stryCov_9fa48("2065"), `✓ Found ${todoTasks.length} todo tasks (showing first 3)`));
        stryMutAct_9fa48("2066") ? todoTasks.forEach(task => {
          console.log(`  - ${task.title} (${task.priority})`);
        }) : (stryCov_9fa48("2066"), todoTasks.slice(0, 3).forEach(task => {
          if (stryMutAct_9fa48("2067")) {
            {}
          } else {
            stryCov_9fa48("2067");
            console.log(stryMutAct_9fa48("2068") ? `` : (stryCov_9fa48("2068"), `  - ${task.title} (${task.priority})`));
          }
        }));

        // Test 3: Search tasks
        console.log(stryMutAct_9fa48("2069") ? "" : (stryCov_9fa48("2069"), "✓ Testing task search..."));
        const searchResults = await taskOps.searchTasks(stryMutAct_9fa48("2070") ? "" : (stryCov_9fa48("2070"), "test"), stryMutAct_9fa48("2071") ? {} : (stryCov_9fa48("2071"), {
          limit: 5
        }));
        console.log(stryMutAct_9fa48("2072") ? `` : (stryCov_9fa48("2072"), `✓ Found ${searchResults.length} tasks matching "test"`));

        // Test 4: Get statistics
        console.log(stryMutAct_9fa48("2073") ? "" : (stryCov_9fa48("2073"), "✓ Getting task statistics..."));
        const stats = await taskOps.getTaskStatistics();
        console.log(stryMutAct_9fa48("2074") ? `` : (stryCov_9fa48("2074"), `✓ Statistics: ${stats.total} total tasks`));
        Object.entries(stats.byStatus).forEach(([status, count]) => {
          if (stryMutAct_9fa48("2075")) {
            {}
          } else {
            stryCov_9fa48("2075");
            if (stryMutAct_9fa48("2079") ? count <= 0 : stryMutAct_9fa48("2078") ? count >= 0 : stryMutAct_9fa48("2077") ? false : stryMutAct_9fa48("2076") ? true : (stryCov_9fa48("2076", "2077", "2078", "2079"), count > 0)) {
              if (stryMutAct_9fa48("2080")) {
                {}
              } else {
                stryCov_9fa48("2080");
                console.log(stryMutAct_9fa48("2081") ? `` : (stryCov_9fa48("2081"), `  - ${status}: ${count}`));
              }
            }
          }
        });
        console.log(stryMutAct_9fa48("2082") ? "" : (stryCov_9fa48("2082"), "✅ Cache performance test completed successfully!"));
      }
    } finally {
      if (stryMutAct_9fa48("2083")) {
        {}
      } else {
        stryCov_9fa48("2083");
        await cache.close();
      }
    }
  }
};
if (stryMutAct_9fa48("2085") ? false : stryMutAct_9fa48("2084") ? true : (stryCov_9fa48("2084", "2085"), isCliExecution())) {
  if (stryMutAct_9fa48("2086")) {
    {}
  } else {
    stryCov_9fa48("2086");
    testCachePerformance().catch(err => {
      if (stryMutAct_9fa48("2087")) {
        {}
      } else {
        stryCov_9fa48("2087");
        console.error(stryMutAct_9fa48("2088") ? "" : (stryCov_9fa48("2088"), "Cache test failed:"), err);
        process.exit(1);
      }
    });
  }
}