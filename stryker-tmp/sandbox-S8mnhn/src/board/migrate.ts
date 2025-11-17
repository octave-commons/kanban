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
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadKanbanConfig } from "./config.js";
import { createTaskCache } from "./task-cache.js";
import { migrateJsonlToCache } from "./indexer.js";
const isCliExecution = (): boolean => {
  if (stryMutAct_9fa48("1274")) {
    {}
  } else {
    stryCov_9fa48("1274");
    const entry = process.argv[1];
    if (stryMutAct_9fa48("1277") ? typeof entry !== "string" && entry.length === 0 : stryMutAct_9fa48("1276") ? false : stryMutAct_9fa48("1275") ? true : (stryCov_9fa48("1275", "1276", "1277"), (stryMutAct_9fa48("1279") ? typeof entry === "string" : stryMutAct_9fa48("1278") ? false : (stryCov_9fa48("1278", "1279"), typeof entry !== (stryMutAct_9fa48("1280") ? "" : (stryCov_9fa48("1280"), "string")))) || (stryMutAct_9fa48("1282") ? entry.length !== 0 : stryMutAct_9fa48("1281") ? false : (stryCov_9fa48("1281", "1282"), entry.length === 0)))) {
      if (stryMutAct_9fa48("1283")) {
        {}
      } else {
        stryCov_9fa48("1283");
        return stryMutAct_9fa48("1284") ? true : (stryCov_9fa48("1284"), false);
      }
    }
    const modulePath = fileURLToPath(import.meta.url);
    return stryMutAct_9fa48("1287") ? path.resolve(entry) !== modulePath : stryMutAct_9fa48("1286") ? false : stryMutAct_9fa48("1285") ? true : (stryCov_9fa48("1285", "1286", "1287"), path.resolve(entry) === modulePath);
  }
};
const runMigration = async (): Promise<void> => {
  if (stryMutAct_9fa48("1288")) {
    {}
  } else {
    stryCov_9fa48("1288");
    console.log(stryMutAct_9fa48("1289") ? "" : (stryCov_9fa48("1289"), "Starting migration from JSONL to lmdb-cache..."));
    const {
      config
    } = await loadKanbanConfig();

    // Check if JSONL index exists
    try {
      if (stryMutAct_9fa48("1290")) {
        {}
      } else {
        stryCov_9fa48("1290");
        const raw = await readFile(config.indexFile, stryMutAct_9fa48("1291") ? "" : (stryCov_9fa48("1291"), "utf8"));
        const lines = stryMutAct_9fa48("1292") ? raw.split("\n") : (stryCov_9fa48("1292"), raw.split(stryMutAct_9fa48("1293") ? "" : (stryCov_9fa48("1293"), "\n")).filter(stryMutAct_9fa48("1294") ? () => undefined : (stryCov_9fa48("1294"), line => stryMutAct_9fa48("1298") ? line.trim().length <= 0 : stryMutAct_9fa48("1297") ? line.trim().length >= 0 : stryMutAct_9fa48("1296") ? false : stryMutAct_9fa48("1295") ? true : (stryCov_9fa48("1295", "1296", "1297", "1298"), (stryMutAct_9fa48("1299") ? line.length : (stryCov_9fa48("1299"), line.trim().length)) > 0))));
        console.log(stryMutAct_9fa48("1300") ? `` : (stryCov_9fa48("1300"), `Found ${lines.length} tasks in JSONL index`));
      }
    } catch (error) {
      if (stryMutAct_9fa48("1301")) {
        {}
      } else {
        stryCov_9fa48("1301");
        console.log(stryMutAct_9fa48("1302") ? `` : (stryCov_9fa48("1302"), `No existing JSONL index found at ${config.indexFile}`));
        return;
      }
    }
    let cache;
    try {
      if (stryMutAct_9fa48("1303")) {
        {}
      } else {
        stryCov_9fa48("1303");
        // Create cache
        cache = await createTaskCache(stryMutAct_9fa48("1304") ? {} : (stryCov_9fa48("1304"), {
          path: config.cachePath,
          namespace: stryMutAct_9fa48("1305") ? "" : (stryCov_9fa48("1305"), "kanban"),
          defaultTtlMs: stryMutAct_9fa48("1306") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("1306"), (stryMutAct_9fa48("1307") ? 24 * 60 / 60 : (stryCov_9fa48("1307"), (stryMutAct_9fa48("1308") ? 24 / 60 : (stryCov_9fa48("1308"), 24 * 60)) * 60)) * 1000) // 24 hours
        }));

        // Run migration
        const result = await migrateJsonlToCache(config, cache);
        if (stryMutAct_9fa48("1312") ? result.errors.length <= 0 : stryMutAct_9fa48("1311") ? result.errors.length >= 0 : stryMutAct_9fa48("1310") ? false : stryMutAct_9fa48("1309") ? true : (stryCov_9fa48("1309", "1310", "1311", "1312"), result.errors.length > 0)) {
          if (stryMutAct_9fa48("1313")) {
            {}
          } else {
            stryCov_9fa48("1313");
            console.warn(stryMutAct_9fa48("1314") ? `` : (stryCov_9fa48("1314"), `Migration completed with ${result.errors.length} errors:`));
            stryMutAct_9fa48("1315") ? result.errors.forEach(error => console.warn(`  - ${error}`)) : (stryCov_9fa48("1315"), result.errors.slice(0, 10).forEach(stryMutAct_9fa48("1316") ? () => undefined : (stryCov_9fa48("1316"), error => console.warn(stryMutAct_9fa48("1317") ? `` : (stryCov_9fa48("1317"), `  - ${error}`)))));
            if (stryMutAct_9fa48("1321") ? result.errors.length <= 10 : stryMutAct_9fa48("1320") ? result.errors.length >= 10 : stryMutAct_9fa48("1319") ? false : stryMutAct_9fa48("1318") ? true : (stryCov_9fa48("1318", "1319", "1320", "1321"), result.errors.length > 10)) {
              if (stryMutAct_9fa48("1322")) {
                {}
              } else {
                stryCov_9fa48("1322");
                console.warn(stryMutAct_9fa48("1323") ? `` : (stryCov_9fa48("1323"), `  ... and ${stryMutAct_9fa48("1324") ? result.errors.length + 10 : (stryCov_9fa48("1324"), result.errors.length - 10)} more errors`));
              }
            }
          }
        }
        console.log(stryMutAct_9fa48("1325") ? `` : (stryCov_9fa48("1325"), `Successfully migrated ${result.migrated} tasks to cache`));

        // Verify migration
        const totalTasks = await cache.getTaskCount();
        console.log(stryMutAct_9fa48("1326") ? `` : (stryCov_9fa48("1326"), `Cache now contains ${totalTasks} tasks`));
      }
    } finally {
      if (stryMutAct_9fa48("1327")) {
        {}
      } else {
        stryCov_9fa48("1327");
        if (stryMutAct_9fa48("1329") ? false : stryMutAct_9fa48("1328") ? true : (stryCov_9fa48("1328", "1329"), cache)) {
          if (stryMutAct_9fa48("1330")) {
            {}
          } else {
            stryCov_9fa48("1330");
            try {
              if (stryMutAct_9fa48("1331")) {
                {}
              } else {
                stryCov_9fa48("1331");
                await cache.close();
              }
            } catch (error) {
              if (stryMutAct_9fa48("1332")) {
                {}
              } else {
                stryCov_9fa48("1332");
                console.warn(stryMutAct_9fa48("1333") ? "" : (stryCov_9fa48("1333"), 'Error closing cache:'), error);
              }
            }
          }
        }
      }
    }
    console.log(stryMutAct_9fa48("1334") ? "" : (stryCov_9fa48("1334"), "Migration completed"));
  }
};
if (stryMutAct_9fa48("1336") ? false : stryMutAct_9fa48("1335") ? true : (stryCov_9fa48("1335", "1336"), isCliExecution())) {
  if (stryMutAct_9fa48("1337")) {
    {}
  } else {
    stryCov_9fa48("1337");
    runMigration().catch(err => {
      if (stryMutAct_9fa48("1338")) {
        {}
      } else {
        stryCov_9fa48("1338");
        console.error(stryMutAct_9fa48("1339") ? "" : (stryCov_9fa48("1339"), "Migration failed:"), err);
        process.exit(1);
      }
    });
  }
}