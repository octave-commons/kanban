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
import { randomUUID } from 'node:crypto';
import type { TransitionEvent } from './types.js';
type CreateEventOptions = {
  readonly actor?: 'agent' | 'human' | 'system';
  readonly reason?: string;
  readonly metadata?: Record<string, unknown>;
};
export const createTransitionEvent = stryMutAct_9fa48("774") ? () => undefined : (stryCov_9fa48("774"), (() => {
  const createTransitionEvent = (taskId: string, fromStatus: string, toStatus: string, options: CreateEventOptions = {}): TransitionEvent => stryMutAct_9fa48("775") ? {} : (stryCov_9fa48("775"), {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    taskId,
    fromStatus,
    toStatus,
    reason: stryMutAct_9fa48("778") ? options.reason && `Status updated from ${fromStatus} to ${toStatus}` : stryMutAct_9fa48("777") ? false : stryMutAct_9fa48("776") ? true : (stryCov_9fa48("776", "777", "778"), options.reason || (stryMutAct_9fa48("779") ? `` : (stryCov_9fa48("779"), `Status updated from ${fromStatus} to ${toStatus}`))),
    actor: stryMutAct_9fa48("782") ? options.actor && 'system' : stryMutAct_9fa48("781") ? false : stryMutAct_9fa48("780") ? true : (stryCov_9fa48("780", "781", "782"), options.actor || (stryMutAct_9fa48("783") ? "" : (stryCov_9fa48("783"), 'system'))),
    metadata: options.metadata
  });
  return createTransitionEvent;
})());