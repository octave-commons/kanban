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
import type { LogStats } from './types.js';
import { readEventLog } from './file-operations.js';
export const getLogStats = async (logPath: string): Promise<LogStats> => {
  if (stryMutAct_9fa48("829")) {
    {}
  } else {
    stryCov_9fa48("829");
    const events = await readEventLog(logPath);
    if (stryMutAct_9fa48("832") ? events.length !== 0 : stryMutAct_9fa48("831") ? false : stryMutAct_9fa48("830") ? true : (stryCov_9fa48("830", "831", "832"), events.length === 0)) {
      if (stryMutAct_9fa48("833")) {
        {}
      } else {
        stryCov_9fa48("833");
        return stryMutAct_9fa48("834") ? {} : (stryCov_9fa48("834"), {
          totalEvents: 0,
          uniqueTasks: 0,
          dateRange: stryMutAct_9fa48("835") ? {} : (stryCov_9fa48("835"), {
            earliest: null,
            latest: null
          })
        });
      }
    }
    const taskIds = new Set(events.map(stryMutAct_9fa48("836") ? () => undefined : (stryCov_9fa48("836"), e => e.taskId)));
    const timestamps = events.map(stryMutAct_9fa48("837") ? () => undefined : (stryCov_9fa48("837"), e => e.timestamp));
    return stryMutAct_9fa48("838") ? {} : (stryCov_9fa48("838"), {
      totalEvents: events.length,
      uniqueTasks: taskIds.size,
      dateRange: stryMutAct_9fa48("839") ? {} : (stryCov_9fa48("839"), {
        earliest: timestamps.reduce(stryMutAct_9fa48("840") ? () => undefined : (stryCov_9fa48("840"), (a, b) => (stryMutAct_9fa48("844") ? a >= b : stryMutAct_9fa48("843") ? a <= b : stryMutAct_9fa48("842") ? false : stryMutAct_9fa48("841") ? true : (stryCov_9fa48("841", "842", "843", "844"), a < b)) ? a : b)),
        latest: timestamps.reduce(stryMutAct_9fa48("845") ? () => undefined : (stryCov_9fa48("845"), (a, b) => (stryMutAct_9fa48("849") ? a <= b : stryMutAct_9fa48("848") ? a >= b : stryMutAct_9fa48("847") ? false : stryMutAct_9fa48("846") ? true : (stryCov_9fa48("846", "847", "848", "849"), a > b)) ? a : b))
      })
    });
  }
};