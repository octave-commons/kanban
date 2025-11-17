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
import { loadKanbanConfig } from '../board/config.js';
import { regenerateBoard } from '../lib/kanban.js';
import { readTaskFrontmatter, readYaml } from './config.js';
import { makeGh } from './github.js';
import type { ProcessConfig } from './types.js';
export type ProcessSyncOptions = {
  processFile?: string;
  owner?: string;
  repo?: string;
  token?: string;
};
const unique = stryMutAct_9fa48("24996") ? () => undefined : (stryCov_9fa48("24996"), (() => {
  const unique = <T,>(xs: ReadonlyArray<T>) => Array.from(new Set(xs));
  return unique;
})());
const mapStatusToLabels = stryMutAct_9fa48("24997") ? () => undefined : (stryCov_9fa48("24997"), (() => {
  const mapStatusToLabels = (statuses: ReadonlyArray<string>, labelMap: Record<string, ReadonlyArray<string>>) => statuses.flatMap(stryMutAct_9fa48("24998") ? () => undefined : (stryCov_9fa48("24998"), s => stryMutAct_9fa48("24999") ? labelMap[s] && [] : (stryCov_9fa48("24999"), labelMap[s] ?? (stryMutAct_9fa48("25000") ? ["Stryker was here"] : (stryCov_9fa48("25000"), [])))));
  return mapStatusToLabels;
})());
const loadTasksForPr = async (cfg: ProcessConfig, pr: string) => {
  if (stryMutAct_9fa48("25001")) {
    {}
  } else {
    stryCov_9fa48("25001");
    const files = stryMutAct_9fa48("25002") ? cfg.pr_rules[pr] && [] : (stryCov_9fa48("25002"), cfg.pr_rules[pr] ?? (stryMutAct_9fa48("25003") ? ["Stryker was here"] : (stryCov_9fa48("25003"), [])));
    const fmList = await Promise.all(files.map(stryMutAct_9fa48("25004") ? () => undefined : (stryCov_9fa48("25004"), f => readTaskFrontmatter(f))));
    return fmList;
  }
};
export async function processSync(opts: ProcessSyncOptions = {}) {
  if (stryMutAct_9fa48("25005")) {
    {}
  } else {
    stryCov_9fa48("25005");
    const {
      config: kbCfg
    } = await loadKanbanConfig(stryMutAct_9fa48("25006") ? {} : (stryCov_9fa48("25006"), {
      argv: stryMutAct_9fa48("25007") ? ["Stryker was here"] : (stryCov_9fa48("25007"), []),
      env: process.env
    }));
    const boardFile = kbCfg.boardFile;
    const tasksDir = kbCfg.tasksDir;
    const processFile = stryMutAct_9fa48("25010") ? (opts.processFile || process.env.KANBAN_PROCESS_FILE) && 'docs/agile/process/duck-revival.yaml' : stryMutAct_9fa48("25009") ? false : stryMutAct_9fa48("25008") ? true : (stryCov_9fa48("25008", "25009", "25010"), (stryMutAct_9fa48("25012") ? opts.processFile && process.env.KANBAN_PROCESS_FILE : stryMutAct_9fa48("25011") ? false : (stryCov_9fa48("25011", "25012"), opts.processFile || process.env.KANBAN_PROCESS_FILE)) || (stryMutAct_9fa48("25013") ? "" : (stryCov_9fa48("25013"), 'docs/agile/process/duck-revival.yaml')));
    const cfg = await readYaml(processFile);

    // 1) Regenerate board from tasks
    await regenerateBoard(tasksDir, boardFile);

    // 2) Sync labels on PRs based on task statuses
    const gh = makeGh(stryMutAct_9fa48("25014") ? {} : (stryCov_9fa48("25014"), {
      token: stryMutAct_9fa48("25017") ? opts.token && process.env.GITHUB_TOKEN : stryMutAct_9fa48("25016") ? false : stryMutAct_9fa48("25015") ? true : (stryCov_9fa48("25015", "25016", "25017"), opts.token || process.env.GITHUB_TOKEN),
      owner: stryMutAct_9fa48("25020") ? opts.owner && process.env.GITHUB_OWNER : stryMutAct_9fa48("25019") ? false : stryMutAct_9fa48("25018") ? true : (stryCov_9fa48("25018", "25019", "25020"), opts.owner || process.env.GITHUB_OWNER),
      repo: stryMutAct_9fa48("25023") ? opts.repo && process.env.GITHUB_REPO : stryMutAct_9fa48("25022") ? false : stryMutAct_9fa48("25021") ? true : (stryCov_9fa48("25021", "25022", "25023"), opts.repo || process.env.GITHUB_REPO)
    }));
    const prs = Object.keys(stryMutAct_9fa48("25026") ? cfg.pr_rules && {} : stryMutAct_9fa48("25025") ? false : stryMutAct_9fa48("25024") ? true : (stryCov_9fa48("25024", "25025", "25026"), cfg.pr_rules || {}));
    for (const pr of prs) {
      if (stryMutAct_9fa48("25027")) {
        {}
      } else {
        stryCov_9fa48("25027");
        const fmList = await loadTasksForPr(cfg, pr);
        const statuses = unique(fmList.map(stryMutAct_9fa48("25028") ? () => undefined : (stryCov_9fa48("25028"), fm => fm.status)));
        const labels = unique(mapStatusToLabels(statuses, stryMutAct_9fa48("25031") ? cfg.label_map && {} : stryMutAct_9fa48("25030") ? false : stryMutAct_9fa48("25029") ? true : (stryCov_9fa48("25029", "25030", "25031"), cfg.label_map || {})));
        if (stryMutAct_9fa48("25035") ? labels.length <= 0 : stryMutAct_9fa48("25034") ? labels.length >= 0 : stryMutAct_9fa48("25033") ? false : stryMutAct_9fa48("25032") ? true : (stryCov_9fa48("25032", "25033", "25034", "25035"), labels.length > 0)) {
          if (stryMutAct_9fa48("25036")) {
            {}
          } else {
            stryCov_9fa48("25036");
            await gh.applyLabels(Number(pr), labels as string[]);
          }
        }
      }
    }

    // 3) Nudge checklists (post once per run)
    const prChecklists = stryMutAct_9fa48("25039") ? cfg.pr_checklists && {} : stryMutAct_9fa48("25038") ? false : stryMutAct_9fa48("25037") ? true : (stryCov_9fa48("25037", "25038", "25039"), cfg.pr_checklists || {});
    for (const [pr, key] of Object.entries(prChecklists)) {
      if (stryMutAct_9fa48("25040")) {
        {}
      } else {
        stryCov_9fa48("25040");
        const list = stryMutAct_9fa48("25043") ? cfg.checklists?.[key] && [] : stryMutAct_9fa48("25042") ? false : stryMutAct_9fa48("25041") ? true : (stryCov_9fa48("25041", "25042", "25043"), (stryMutAct_9fa48("25044") ? cfg.checklists[key] : (stryCov_9fa48("25044"), cfg.checklists?.[key])) || (stryMutAct_9fa48("25045") ? ["Stryker was here"] : (stryCov_9fa48("25045"), [])));
        if (stryMutAct_9fa48("25048") ? list.length !== 0 : stryMutAct_9fa48("25047") ? false : stryMutAct_9fa48("25046") ? true : (stryCov_9fa48("25046", "25047", "25048"), list.length === 0)) continue;
        const body = (stryMutAct_9fa48("25049") ? [] : (stryCov_9fa48("25049"), [stryMutAct_9fa48("25050") ? `` : (stryCov_9fa48("25050"), `Checklist (${key}):`), ...list.map(stryMutAct_9fa48("25051") ? () => undefined : (stryCov_9fa48("25051"), item => stryMutAct_9fa48("25052") ? `` : (stryCov_9fa48("25052"), `- [ ] ${item}`)))])).join(stryMutAct_9fa48("25053") ? "" : (stryCov_9fa48("25053"), '\n'));
        await gh.comment(Number(pr), body);
      }
    }
    return {
      ok: true,
      boardFile,
      tasksDir,
      processFile
    } as const;
  }
}