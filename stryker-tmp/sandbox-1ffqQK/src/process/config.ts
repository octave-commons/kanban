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
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { parseFrontmatter as parseMarkdownFrontmatter } from '@promethean-os/markdown/frontmatter';
import type { ProcessConfig, TaskFM } from './types.js';
export const readYaml = async (file: string): Promise<ProcessConfig> => {
  if (stryMutAct_9fa48("24763")) {
    {}
  } else {
    stryCov_9fa48("24763");
    const txt = await fs.readFile(file, stryMutAct_9fa48("24764") ? "" : (stryCov_9fa48("24764"), 'utf8'));
    const cfg = parseYaml(txt) as ProcessConfig;
    return cfg;
  }
};
export const readTaskFrontmatter = async (file: string): Promise<TaskFM> => {
  if (stryMutAct_9fa48("24765")) {
    {}
  } else {
    stryCov_9fa48("24765");
    const txt = await fs.readFile(file, stryMutAct_9fa48("24766") ? "" : (stryCov_9fa48("24766"), 'utf8'));
    const parsed = parseMarkdownFrontmatter(txt);
    return parsed.data as TaskFM;
  }
};
export const listMarkdownTasks = async (dir: string): Promise<string[]> => {
  if (stryMutAct_9fa48("24767")) {
    {}
  } else {
    stryCov_9fa48("24767");
    const ents = await fs.readdir(dir, stryMutAct_9fa48("24768") ? {} : (stryCov_9fa48("24768"), {
      withFileTypes: stryMutAct_9fa48("24769") ? false : (stryCov_9fa48("24769"), true)
    }));
    const md = stryMutAct_9fa48("24770") ? ents.map(e => path.join(dir, e.name)) : (stryCov_9fa48("24770"), ents.filter(stryMutAct_9fa48("24771") ? () => undefined : (stryCov_9fa48("24771"), e => stryMutAct_9fa48("24774") ? e.isFile() || e.name.endsWith('.md') : stryMutAct_9fa48("24773") ? false : stryMutAct_9fa48("24772") ? true : (stryCov_9fa48("24772", "24773", "24774"), e.isFile() && (stryMutAct_9fa48("24775") ? e.name.startsWith('.md') : (stryCov_9fa48("24775"), e.name.endsWith(stryMutAct_9fa48("24776") ? "" : (stryCov_9fa48("24776"), '.md'))))))).map(stryMutAct_9fa48("24777") ? () => undefined : (stryCov_9fa48("24777"), e => path.join(dir, e.name))));
    return md;
  }
};