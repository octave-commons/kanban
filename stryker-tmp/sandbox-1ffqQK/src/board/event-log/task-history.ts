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
import type { TransitionEvent, TaskTransitionResult } from './types.js';
import { readEventLog } from './file-operations.js';
export const getTaskHistory = async (logPath: string, taskId: string): Promise<ReadonlyArray<TransitionEvent>> => {
  if (stryMutAct_9fa48("850")) {
    {}
  } else {
    stryCov_9fa48("850");
    const allEvents = await readEventLog(logPath);
    return stryMutAct_9fa48("851") ? allEvents : (stryCov_9fa48("851"), allEvents.filter(stryMutAct_9fa48("852") ? () => undefined : (stryCov_9fa48("852"), event => stryMutAct_9fa48("855") ? event.taskId !== taskId : stryMutAct_9fa48("854") ? false : stryMutAct_9fa48("853") ? true : (stryCov_9fa48("853", "854", "855"), event.taskId === taskId))));
  }
};
export const replayTaskTransitions = async (logPath: string, taskId: string, currentStatus: string): Promise<TaskTransitionResult> => {
  if (stryMutAct_9fa48("856")) {
    {}
  } else {
    stryCov_9fa48("856");
    const taskEvents = await getTaskHistory(logPath, taskId);
    if (stryMutAct_9fa48("859") ? taskEvents.length !== 0 : stryMutAct_9fa48("858") ? false : stryMutAct_9fa48("857") ? true : (stryCov_9fa48("857", "858", "859"), taskEvents.length === 0)) {
      if (stryMutAct_9fa48("860")) {
        {}
      } else {
        stryCov_9fa48("860");
        return stryMutAct_9fa48("861") ? {} : (stryCov_9fa48("861"), {
          finalStatus: currentStatus,
          isValid: stryMutAct_9fa48("862") ? false : (stryCov_9fa48("862"), true),
          events: stryMutAct_9fa48("863") ? ["Stryker was here"] : (stryCov_9fa48("863"), [])
        });
      }
    }

    // Start from first event's fromStatus
    // eslint-disable-next-line functional/no-let
    let status = taskEvents[0]!.fromStatus;
    // eslint-disable-next-line functional/no-let
    let lastValidEvent: TransitionEvent | undefined;
    // eslint-disable-next-line functional/no-let
    let invalidEvent: TransitionEvent | undefined;
    for (const event of taskEvents) {
      if (stryMutAct_9fa48("864")) {
        {}
      } else {
        stryCov_9fa48("864");
        // Verify that event's fromStatus matches our current state
        if (stryMutAct_9fa48("867") ? event.fromStatus === status : stryMutAct_9fa48("866") ? false : stryMutAct_9fa48("865") ? true : (stryCov_9fa48("865", "866", "867"), event.fromStatus !== status)) {
          if (stryMutAct_9fa48("868")) {
            {}
          } else {
            stryCov_9fa48("868");
            invalidEvent = event;
            return stryMutAct_9fa48("869") ? {} : (stryCov_9fa48("869"), {
              finalStatus: status,
              isValid: stryMutAct_9fa48("870") ? true : (stryCov_9fa48("870"), false),
              lastValidEvent,
              invalidEvent,
              events: taskEvents
            });
          }
        }

        // Update current status
        status = event.toStatus;
        lastValidEvent = event;
      }
    }
    return stryMutAct_9fa48("871") ? {} : (stryCov_9fa48("871"), {
      finalStatus: status,
      isValid: stryMutAct_9fa48("872") ? false : (stryCov_9fa48("872"), true),
      lastValidEvent,
      invalidEvent,
      events: taskEvents
    });
  }
};
export const getAllTaskHistories = async (logPath: string): Promise<ReadonlyMap<string, ReadonlyArray<TransitionEvent>>> => {
  if (stryMutAct_9fa48("873")) {
    {}
  } else {
    stryCov_9fa48("873");
    const allEvents = await readEventLog(logPath);
    const histories = new Map<string, ReadonlyArray<TransitionEvent>>();
    for (const event of allEvents) {
      if (stryMutAct_9fa48("874")) {
        {}
      } else {
        stryCov_9fa48("874");
        const taskHistory = stryMutAct_9fa48("877") ? histories.get(event.taskId) && [] : stryMutAct_9fa48("876") ? false : stryMutAct_9fa48("875") ? true : (stryCov_9fa48("875", "876", "877"), histories.get(event.taskId) || (stryMutAct_9fa48("878") ? ["Stryker was here"] : (stryCov_9fa48("878"), [])));
        histories.set(event.taskId, stryMutAct_9fa48("879") ? [] : (stryCov_9fa48("879"), [...taskHistory, event]));
      }
    }
    return histories;
  }
};