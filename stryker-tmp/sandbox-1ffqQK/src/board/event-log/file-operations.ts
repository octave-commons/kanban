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
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import * as path from 'node:path';
import type { ReadonlyDeep } from 'type-fest';
import type { KanbanConfig } from '../config/shared.js';
import type { TransitionEvent } from './types.js';
export const makeLogPath = stryMutAct_9fa48("784") ? () => undefined : (stryCov_9fa48("784"), (() => {
  const makeLogPath = (config: ReadonlyDeep<KanbanConfig>): string => path.join(stryMutAct_9fa48("787") ? config.cachePath && 'docs/agile/boards/.cache' : stryMutAct_9fa48("786") ? false : stryMutAct_9fa48("785") ? true : (stryCov_9fa48("785", "786", "787"), config.cachePath || (stryMutAct_9fa48("788") ? "" : (stryCov_9fa48("788"), 'docs/agile/boards/.cache'))), stryMutAct_9fa48("789") ? "" : (stryCov_9fa48("789"), 'event-log.jsonl'));
  return makeLogPath;
})());
export const ensureLogDirectory = async (logPath: string): Promise<void> => {
  if (stryMutAct_9fa48("790")) {
    {}
  } else {
    stryCov_9fa48("790");
    const dir = path.dirname(logPath);
    try {
      if (stryMutAct_9fa48("791")) {
        {}
      } else {
        stryCov_9fa48("791");
        await mkdir(dir, stryMutAct_9fa48("792") ? {} : (stryCov_9fa48("792"), {
          recursive: stryMutAct_9fa48("793") ? false : (stryCov_9fa48("793"), true)
        }));
      }
    } catch (error) {
      if (stryMutAct_9fa48("794")) {
        {}
      } else {
        stryCov_9fa48("794");
        // Directory already exists or creation failed
        if (stryMutAct_9fa48("797") ? (error as NodeJS.ErrnoException).code === 'EEXIST' : stryMutAct_9fa48("796") ? false : stryMutAct_9fa48("795") ? true : (stryCov_9fa48("795", "796", "797"), (error as NodeJS.ErrnoException).code !== (stryMutAct_9fa48("798") ? "" : (stryCov_9fa48("798"), 'EEXIST')))) {
          if (stryMutAct_9fa48("799")) {
            {}
          } else {
            stryCov_9fa48("799");
            throw error;
          }
        }
      }
    }
  }
};
export const readEventLog = async (logPath: string): Promise<ReadonlyArray<TransitionEvent>> => {
  if (stryMutAct_9fa48("800")) {
    {}
  } else {
    stryCov_9fa48("800");
    try {
      if (stryMutAct_9fa48("801")) {
        {}
      } else {
        stryCov_9fa48("801");
        const content = await readFile(logPath, stryMutAct_9fa48("802") ? "" : (stryCov_9fa48("802"), 'utf8'));
        const lines = stryMutAct_9fa48("804") ? content.split('\n').filter(line => line.length > 0) : stryMutAct_9fa48("803") ? content.trim().split('\n') : (stryCov_9fa48("803", "804"), content.trim().split(stryMutAct_9fa48("805") ? "" : (stryCov_9fa48("805"), '\n')).filter(stryMutAct_9fa48("806") ? () => undefined : (stryCov_9fa48("806"), line => stryMutAct_9fa48("810") ? line.length <= 0 : stryMutAct_9fa48("809") ? line.length >= 0 : stryMutAct_9fa48("808") ? false : stryMutAct_9fa48("807") ? true : (stryCov_9fa48("807", "808", "809", "810"), line.length > 0))));
        return lines.map(stryMutAct_9fa48("811") ? () => undefined : (stryCov_9fa48("811"), line => JSON.parse(line) as TransitionEvent));
      }
    } catch {
      if (stryMutAct_9fa48("812")) {
        {}
      } else {
        stryCov_9fa48("812");
        return stryMutAct_9fa48("813") ? ["Stryker was here"] : (stryCov_9fa48("813"), []);
      }
    }
  }
};
export const writeEvent = async (logPath: string, event: ReadonlyDeep<TransitionEvent>): Promise<void> => {
  if (stryMutAct_9fa48("814")) {
    {}
  } else {
    stryCov_9fa48("814");
    const eventLine = JSON.stringify(event) + (stryMutAct_9fa48("815") ? "" : (stryCov_9fa48("815"), '\n'));
    await writeFile(logPath, eventLine, stryMutAct_9fa48("816") ? {} : (stryCov_9fa48("816"), {
      flag: stryMutAct_9fa48("817") ? "" : (stryCov_9fa48("817"), 'a')
    }));
  }
};
export const clearLog = async (logPath: string): Promise<void> => {
  if (stryMutAct_9fa48("818")) {
    {}
  } else {
    stryCov_9fa48("818");
    await ensureLogDirectory(logPath);
    await writeFile(logPath, stryMutAct_9fa48("819") ? "Stryker was here!" : (stryCov_9fa48("819"), ''));
  }
};