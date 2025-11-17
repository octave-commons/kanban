/**
 * Frontend rendering utilities for the kanban UI
 */
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
export const escapeHtml = (text: string): string => {
  if (stryMutAct_9fa48("4656")) {
    {}
  } else {
    stryCov_9fa48("4656");
    const map: Record<string, string> = stryMutAct_9fa48("4657") ? {} : (stryCov_9fa48("4657"), {
      '&': stryMutAct_9fa48("4658") ? "" : (stryCov_9fa48("4658"), '&amp;'),
      '<': stryMutAct_9fa48("4659") ? "" : (stryCov_9fa48("4659"), '&lt;'),
      '>': stryMutAct_9fa48("4660") ? "" : (stryCov_9fa48("4660"), '&gt;'),
      '"': stryMutAct_9fa48("4661") ? "" : (stryCov_9fa48("4661"), '&quot;'),
      "'": stryMutAct_9fa48("4662") ? "" : (stryCov_9fa48("4662"), '&#x27;')
    });
    return text.replace(stryMutAct_9fa48("4663") ? /[^&<>"']/g : (stryCov_9fa48("4663"), /[&<>"']/g), stryMutAct_9fa48("4664") ? () => undefined : (stryCov_9fa48("4664"), char => stryMutAct_9fa48("4667") ? map[char] && char : stryMutAct_9fa48("4666") ? false : stryMutAct_9fa48("4665") ? true : (stryCov_9fa48("4665", "4666", "4667"), map[char] || char)));
  }
};