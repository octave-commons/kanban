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
type FetchLike = typeof fetch;
export type GitHubEnv = {
  token?: string;
  owner?: string;
  repo?: string;
};
const required = (v: string | undefined, name: string): string => {
  if (stryMutAct_9fa48("24957")) {
    {}
  } else {
    stryCov_9fa48("24957");
    if (stryMutAct_9fa48("24960") ? !v && !v.trim() : stryMutAct_9fa48("24959") ? false : stryMutAct_9fa48("24958") ? true : (stryCov_9fa48("24958", "24959", "24960"), (stryMutAct_9fa48("24961") ? v : (stryCov_9fa48("24961"), !v)) || (stryMutAct_9fa48("24962") ? v.trim() : (stryCov_9fa48("24962"), !(stryMutAct_9fa48("24963") ? v : (stryCov_9fa48("24963"), v.trim())))))) throw new Error(stryMutAct_9fa48("24964") ? `` : (stryCov_9fa48("24964"), `Missing ${name}`));
    return v;
  }
};
export const makeGh = (env: GitHubEnv, f: FetchLike = fetch) => {
  if (stryMutAct_9fa48("24965")) {
    {}
  } else {
    stryCov_9fa48("24965");
    const base = stryMutAct_9fa48("24966") ? "" : (stryCov_9fa48("24966"), 'https://api.github.com');
    const token = env.token;
    const owner = env.owner;
    const repo = env.repo;
    const headers: HeadersInit = token ? stryMutAct_9fa48("24967") ? {} : (stryCov_9fa48("24967"), {
      Authorization: stryMutAct_9fa48("24968") ? `` : (stryCov_9fa48("24968"), `Bearer ${token}`),
      Accept: stryMutAct_9fa48("24969") ? "" : (stryCov_9fa48("24969"), 'application/vnd.github+json')
    }) : stryMutAct_9fa48("24970") ? {} : (stryCov_9fa48("24970"), {
      Accept: stryMutAct_9fa48("24971") ? "" : (stryCov_9fa48("24971"), 'application/vnd.github+json')
    });
    const url = stryMutAct_9fa48("24972") ? () => undefined : (stryCov_9fa48("24972"), (() => {
      const url = (p: string) => stryMutAct_9fa48("24973") ? `` : (stryCov_9fa48("24973"), `${base}${p}`);
      return url;
    })());
    const applyLabels = async (issueNumber: number, labels: string[]) => {
      if (stryMutAct_9fa48("24974")) {
        {}
      } else {
        stryCov_9fa48("24974");
        if (stryMutAct_9fa48("24977") ? false : stryMutAct_9fa48("24976") ? true : stryMutAct_9fa48("24975") ? token : (stryCov_9fa48("24975", "24976", "24977"), !token)) return {
          skipped: true,
          reason: 'no-token'
        } as const;
        required(owner, stryMutAct_9fa48("24978") ? "" : (stryCov_9fa48("24978"), 'owner'));
        required(repo, stryMutAct_9fa48("24979") ? "" : (stryCov_9fa48("24979"), 'repo'));
        const r = await f(url(stryMutAct_9fa48("24980") ? `` : (stryCov_9fa48("24980"), `/repos/${owner}/${repo}/issues/${issueNumber}/labels`)), stryMutAct_9fa48("24981") ? {} : (stryCov_9fa48("24981"), {
          method: stryMutAct_9fa48("24982") ? "" : (stryCov_9fa48("24982"), 'POST'),
          headers,
          body: JSON.stringify(stryMutAct_9fa48("24983") ? {} : (stryCov_9fa48("24983"), {
            labels
          }))
        }));
        const ok = r.ok;
        return stryMutAct_9fa48("24984") ? {} : (stryCov_9fa48("24984"), {
          ok,
          status: r.status
        });
      }
    };
    const comment = async (issueNumber: number, body: string) => {
      if (stryMutAct_9fa48("24985")) {
        {}
      } else {
        stryCov_9fa48("24985");
        if (stryMutAct_9fa48("24988") ? false : stryMutAct_9fa48("24987") ? true : stryMutAct_9fa48("24986") ? token : (stryCov_9fa48("24986", "24987", "24988"), !token)) return {
          skipped: true,
          reason: 'no-token'
        } as const;
        required(owner, stryMutAct_9fa48("24989") ? "" : (stryCov_9fa48("24989"), 'owner'));
        required(repo, stryMutAct_9fa48("24990") ? "" : (stryCov_9fa48("24990"), 'repo'));
        const r = await f(url(stryMutAct_9fa48("24991") ? `` : (stryCov_9fa48("24991"), `/repos/${owner}/${repo}/issues/${issueNumber}/comments`)), stryMutAct_9fa48("24992") ? {} : (stryCov_9fa48("24992"), {
          method: stryMutAct_9fa48("24993") ? "" : (stryCov_9fa48("24993"), 'POST'),
          headers,
          body: JSON.stringify(stryMutAct_9fa48("24994") ? {} : (stryCov_9fa48("24994"), {
            body
          }))
        }));
        return stryMutAct_9fa48("24995") ? {} : (stryCov_9fa48("24995"), {
          ok: r.ok,
          status: r.status
        });
      }
    };
    return {
      applyLabels,
      comment
    } as const;
  }
};