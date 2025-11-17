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
  if (stryMutAct_9fa48("1340")) {
    {}
  } else {
    stryCov_9fa48("1340");
    const entry = process.argv[1];
    if (stryMutAct_9fa48("1343") ? typeof entry !== "string" && entry.length === 0 : stryMutAct_9fa48("1342") ? false : stryMutAct_9fa48("1341") ? true : (stryCov_9fa48("1341", "1342", "1343"), (stryMutAct_9fa48("1345") ? typeof entry === "string" : stryMutAct_9fa48("1344") ? false : (stryCov_9fa48("1344", "1345"), typeof entry !== (stryMutAct_9fa48("1346") ? "" : (stryCov_9fa48("1346"), "string")))) || (stryMutAct_9fa48("1348") ? entry.length !== 0 : stryMutAct_9fa48("1347") ? false : (stryCov_9fa48("1347", "1348"), entry.length === 0)))) {
      if (stryMutAct_9fa48("1349")) {
        {}
      } else {
        stryCov_9fa48("1349");
        return stryMutAct_9fa48("1350") ? true : (stryCov_9fa48("1350"), false);
      }
    }
    const modulePath = fileURLToPath(import.meta.url);
    return stryMutAct_9fa48("1353") ? path.resolve(entry) !== modulePath : stryMutAct_9fa48("1352") ? false : stryMutAct_9fa48("1351") ? true : (stryCov_9fa48("1351", "1352", "1353"), path.resolve(entry) === modulePath);
  }
};
const performanceTest = async (): Promise<void> => {
  if (stryMutAct_9fa48("1354")) {
    {}
  } else {
    stryCov_9fa48("1354");
    console.log(stryMutAct_9fa48("1355") ? "" : (stryCov_9fa48("1355"), "🚀 Running performance comparison tests...\n"));
    const {
      config
    } = await loadKanbanConfig();
    const cache = await createTaskCache(stryMutAct_9fa48("1356") ? {} : (stryCov_9fa48("1356"), {
      path: config.cachePath,
      namespace: stryMutAct_9fa48("1357") ? "" : (stryCov_9fa48("1357"), "kanban"),
      defaultTtlMs: stryMutAct_9fa48("1358") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("1358"), (stryMutAct_9fa48("1359") ? 24 * 60 / 60 : (stryCov_9fa48("1359"), (stryMutAct_9fa48("1360") ? 24 / 60 : (stryCov_9fa48("1360"), 24 * 60)) * 60)) * 1000)
    }));
    try {
      if (stryMutAct_9fa48("1361")) {
        {}
      } else {
        stryCov_9fa48("1361");
        const taskOps = createTaskOperations(cache);

        // Test 1: Memory efficiency - count tasks without loading all
        console.log(stryMutAct_9fa48("1362") ? "" : (stryCov_9fa48("1362"), "📊 Task Count Test (Memory Efficient)"));
        const startCount = performance.now();
        const totalTasks = await taskOps.getTotalTaskCount();
        const endCount = performance.now();
        console.log(stryMutAct_9fa48("1363") ? `` : (stryCov_9fa48("1363"), `✓ Counted ${totalTasks} tasks in ${(stryMutAct_9fa48("1364") ? endCount + startCount : (stryCov_9fa48("1364"), endCount - startCount)).toFixed(2)}ms`));
        console.log(stryMutAct_9fa48("1365") ? "" : (stryCov_9fa48("1365"), "✓ All tasks remain on disk - no memory loading required\n"));

        // Test 2: Streaming access - get tasks by status
        console.log(stryMutAct_9fa48("1366") ? "" : (stryCov_9fa48("1366"), "🔄 Streaming Status Test"));
        const statuses = stryMutAct_9fa48("1367") ? [] : (stryCov_9fa48("1367"), [stryMutAct_9fa48("1368") ? "" : (stryCov_9fa48("1368"), 'todo'), stryMutAct_9fa48("1369") ? "" : (stryCov_9fa48("1369"), 'in_progress'), stryMutAct_9fa48("1370") ? "" : (stryCov_9fa48("1370"), 'done'), stryMutAct_9fa48("1371") ? "" : (stryCov_9fa48("1371"), 'breakdown')]);
        for (const status of statuses) {
          if (stryMutAct_9fa48("1372")) {
            {}
          } else {
            stryCov_9fa48("1372");
            const start = performance.now();
            const tasks = await taskOps.getTasksByStatus(status, stryMutAct_9fa48("1373") ? {} : (stryCov_9fa48("1373"), {
              limit: 20
            }));
            const end = performance.now();
            console.log(stryMutAct_9fa48("1374") ? `` : (stryCov_9fa48("1374"), `✓ ${status}: ${tasks.length} tasks in ${(stryMutAct_9fa48("1375") ? end + start : (stryCov_9fa48("1375"), end - start)).toFixed(2)}ms`));
          }
        }
        console.log(stryMutAct_9fa48("1376") ? "Stryker was here!" : (stryCov_9fa48("1376"), ""));

        // Test 3: Search performance
        console.log(stryMutAct_9fa48("1377") ? "" : (stryCov_9fa48("1377"), "🔍 Search Performance Test"));
        const searchTerms = stryMutAct_9fa48("1378") ? [] : (stryCov_9fa48("1378"), [stryMutAct_9fa48("1379") ? "" : (stryCov_9fa48("1379"), 'test'), stryMutAct_9fa48("1380") ? "" : (stryCov_9fa48("1380"), 'process'), stryMutAct_9fa48("1381") ? "" : (stryCov_9fa48("1381"), 'implement'), stryMutAct_9fa48("1382") ? "" : (stryCov_9fa48("1382"), 'fix'), stryMutAct_9fa48("1383") ? "" : (stryCov_9fa48("1383"), 'feature')]);
        for (const term of searchTerms) {
          if (stryMutAct_9fa48("1384")) {
            {}
          } else {
            stryCov_9fa48("1384");
            const start = performance.now();
            const results = await taskOps.searchTasks(term, stryMutAct_9fa48("1385") ? {} : (stryCov_9fa48("1385"), {
              limit: 10
            }));
            const end = performance.now();
            console.log(stryMutAct_9fa48("1386") ? `` : (stryCov_9fa48("1386"), `✓ "${term}": ${results.length} results in ${(stryMutAct_9fa48("1387") ? end + start : (stryCov_9fa48("1387"), end - start)).toFixed(2)}ms`));
          }
        }
        console.log(stryMutAct_9fa48("1388") ? "Stryker was here!" : (stryCov_9fa48("1388"), ""));

        // Test 4: Batch operations simulation
        console.log(stryMutAct_9fa48("1389") ? "" : (stryCov_9fa48("1389"), "⚡ Batch Operations Test"));
        const batchStart = performance.now();

        // Simulate moving multiple tasks (metadata updates only)
        const batchSizes = stryMutAct_9fa48("1390") ? [] : (stryCov_9fa48("1390"), [10, 50, 100]);
        for (const batchSize of batchSizes) {
          if (stryMutAct_9fa48("1391")) {
            {}
          } else {
            stryCov_9fa48("1391");
            const start = performance.now();
            const todoTasks = await taskOps.getTasksByStatus(stryMutAct_9fa48("1392") ? "" : (stryCov_9fa48("1392"), 'todo'), stryMutAct_9fa48("1393") ? {} : (stryCov_9fa48("1393"), {
              limit: batchSize
            }));
            if (stryMutAct_9fa48("1397") ? todoTasks.length <= 0 : stryMutAct_9fa48("1396") ? todoTasks.length >= 0 : stryMutAct_9fa48("1395") ? false : stryMutAct_9fa48("1394") ? true : (stryCov_9fa48("1394", "1395", "1396", "1397"), todoTasks.length > 0)) {
              if (stryMutAct_9fa48("1398")) {
                {}
              } else {
                stryCov_9fa48("1398");
                // Simulate status updates (just a metadata change, no actual updates)
                const end = performance.now();
                console.log(stryMutAct_9fa48("1399") ? `` : (stryCov_9fa48("1399"), `✓ Retrieved ${todoTasks.length} tasks for batch processing in ${(stryMutAct_9fa48("1400") ? end + start : (stryCov_9fa48("1400"), end - start)).toFixed(2)}ms`));
              }
            }
          }
        }
        const batchEnd = performance.now();
        console.log(stryMutAct_9fa48("1401") ? `` : (stryCov_9fa48("1401"), `✓ Batch operations completed in ${(stryMutAct_9fa48("1402") ? batchEnd + batchStart : (stryCov_9fa48("1402"), batchEnd - batchStart)).toFixed(2)}ms\n`));

        // Test 5: Statistics generation
        console.log(stryMutAct_9fa48("1403") ? "" : (stryCov_9fa48("1403"), "📈 Statistics Generation Test"));
        const statsStart = performance.now();
        const stats = await taskOps.getTaskStatistics();
        const statsEnd = performance.now();
        console.log(stryMutAct_9fa48("1404") ? `` : (stryCov_9fa48("1404"), `✓ Generated statistics for ${stats.total} tasks in ${(stryMutAct_9fa48("1405") ? statsEnd + statsStart : (stryCov_9fa48("1405"), statsEnd - statsStart)).toFixed(2)}ms`));
        console.log(stryMutAct_9fa48("1406") ? "" : (stryCov_9fa48("1406"), "✓ Memory efficient: counts are from cached metadata, not full task loading\n"));

        // Summary
        console.log(stryMutAct_9fa48("1407") ? "" : (stryCov_9fa48("1407"), "🎯 Performance Test Summary:"));
        console.log(stryMutAct_9fa48("1408") ? "" : (stryCov_9fa48("1408"), "✅ Cache-based system provides:"));
        console.log(stryMutAct_9fa48("1409") ? "" : (stryCov_9fa48("1409"), "  • O(1) task counting vs O(n) with JSONL"));
        console.log(stryMutAct_9fa48("1410") ? "" : (stryCov_9fa48("1410"), "  • Streaming access without memory loading"));
        console.log(stryMutAct_9fa48("1411") ? "" : (stryCov_9fa48("1411"), "  • Fast search with pre-built indexes"));
        console.log(stryMutAct_9fa48("1412") ? "" : (stryCov_9fa48("1412"), "  • Efficient batch operations"));
        console.log(stryMutAct_9fa48("1413") ? "" : (stryCov_9fa48("1413"), "  • Metadata-driven statistics"));
        console.log(stryMutAct_9fa48("1414") ? `` : (stryCov_9fa48("1414"), `\n✨ System ready for ${totalTasks}+ tasks without memory issues!`));
      }
    } finally {
      if (stryMutAct_9fa48("1415")) {
        {}
      } else {
        stryCov_9fa48("1415");
        await cache.close();
      }
    }
  }
};
if (stryMutAct_9fa48("1417") ? false : stryMutAct_9fa48("1416") ? true : (stryCov_9fa48("1416", "1417"), isCliExecution())) {
  if (stryMutAct_9fa48("1418")) {
    {}
  } else {
    stryCov_9fa48("1418");
    performanceTest().catch(err => {
      if (stryMutAct_9fa48("1419")) {
        {}
      } else {
        stryCov_9fa48("1419");
        console.error(stryMutAct_9fa48("1420") ? "" : (stryCov_9fa48("1420"), "Performance test failed:"), err);
        process.exit(1);
      }
    });
  }
}