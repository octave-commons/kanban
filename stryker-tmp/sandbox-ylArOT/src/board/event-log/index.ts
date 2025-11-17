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
import type { ReadonlyDeep } from 'type-fest';
import type { KanbanConfig } from '../config/shared.js';
import type { TransitionEvent, TaskTransitionResult, LogStats } from './types.js';
import { makeLogPath, ensureLogDirectory, readEventLog, writeEvent, clearLog } from './file-operations.js';
import { createTransitionEvent } from './event-creator.js';
import { getTaskHistory, replayTaskTransitions, getAllTaskHistories } from './task-history.js';
import { getLogStats } from './stats.js';
export type { TransitionEvent, TaskTransitionResult, LogStats } from './types.js';
export const makeEventLogManager = (config: ReadonlyDeep<KanbanConfig>): EventLogManager => {
  if (stryMutAct_9fa48("820")) {
    {}
  } else {
    stryCov_9fa48("820");
    const logPath = makeLogPath(config);
    const logTransition = async (taskId: string, fromStatus: string, toStatus: string, options: {
      readonly actor?: 'agent' | 'human' | 'system';
      readonly reason?: string;
      readonly metadata?: Record<string, unknown>;
    } = {}): Promise<void> => {
      if (stryMutAct_9fa48("821")) {
        {}
      } else {
        stryCov_9fa48("821");
        const event = createTransitionEvent(taskId, fromStatus, toStatus, options);
        await ensureLogDirectory(logPath);
        await writeEvent(logPath, event);
      }
    };
    return stryMutAct_9fa48("822") ? {} : (stryCov_9fa48("822"), {
      logTransition,
      readEventLog: stryMutAct_9fa48("823") ? () => undefined : (stryCov_9fa48("823"), () => readEventLog(logPath)),
      getTaskHistory: stryMutAct_9fa48("824") ? () => undefined : (stryCov_9fa48("824"), (taskId: string) => getTaskHistory(logPath, taskId)),
      replayTaskTransitions: stryMutAct_9fa48("825") ? () => undefined : (stryCov_9fa48("825"), (taskId: string, currentStatus: string) => replayTaskTransitions(logPath, taskId, currentStatus)),
      getAllTaskHistories: stryMutAct_9fa48("826") ? () => undefined : (stryCov_9fa48("826"), () => getAllTaskHistories(logPath)),
      clearLog: stryMutAct_9fa48("827") ? () => undefined : (stryCov_9fa48("827"), () => clearLog(logPath)),
      getLogStats: stryMutAct_9fa48("828") ? () => undefined : (stryCov_9fa48("828"), () => getLogStats(logPath))
    });
  }
};
export type EventLogManager = {
  readonly logTransition: (taskId: string, fromStatus: string, toStatus: string, options?: {
    readonly actor?: 'agent' | 'human' | 'system';
    readonly reason?: string;
    readonly metadata?: Record<string, unknown>;
  }) => Promise<void>;
  readonly readEventLog: () => Promise<ReadonlyArray<TransitionEvent>>;
  readonly getTaskHistory: (taskId: string) => Promise<ReadonlyArray<TransitionEvent>>;
  readonly replayTaskTransitions: (taskId: string, currentStatus: string) => Promise<TaskTransitionResult>;
  readonly getAllTaskHistories: () => Promise<ReadonlyMap<string, ReadonlyArray<TransitionEvent>>>;
  readonly clearLog: () => Promise<void>;
  readonly getLogStats: () => Promise<LogStats>;
};