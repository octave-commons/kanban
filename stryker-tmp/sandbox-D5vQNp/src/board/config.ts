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
import { defaultConfigForRepo, type LoadKanbanConfigResult, type RawKanbanConfig } from "./config/shared.js";
import { findConfigPath, parseArgv, parseEnvConfig, resolveRepo } from "./config/sources.js";
import { mergeConfig } from "./config/merge.js";
const readConfigPayload = async (configPath: string): Promise<Readonly<{
  readonly raw: RawKanbanConfig;
  readonly dir: string;
}>> => {
  if (stryMutAct_9fa48("759")) {
    {}
  } else {
    stryCov_9fa48("759");
    const rawJson = await readFile(configPath, stryMutAct_9fa48("760") ? "" : (stryCov_9fa48("760"), "utf8"));
    return {
      raw: JSON.parse(rawJson) as RawKanbanConfig,
      dir: path.dirname(configPath)
    } as const;
  }
};
export const loadKanbanConfig = async (options?: Readonly<{
  readonly argv?: ReadonlyArray<string>;
  readonly env?: Readonly<NodeJS.ProcessEnv>;
}>): Promise<LoadKanbanConfigResult> => {
  if (stryMutAct_9fa48("761")) {
    {}
  } else {
    stryCov_9fa48("761");
    const argv = stryMutAct_9fa48("762") ? options?.argv && process.argv.slice(2) : (stryCov_9fa48("762"), (stryMutAct_9fa48("763") ? options.argv : (stryCov_9fa48("763"), options?.argv)) ?? (stryMutAct_9fa48("764") ? process.argv : (stryCov_9fa48("764"), process.argv.slice(2))));
    const env = stryMutAct_9fa48("765") ? options?.env && process.env : (stryCov_9fa48("765"), (stryMutAct_9fa48("766") ? options.env : (stryCov_9fa48("766"), options?.env)) ?? process.env);
    const envValues = parseEnvConfig(env);
    const {
      values: argValues,
      rest
    } = parseArgv(argv);
    const cwd = process.cwd();
    const repo = await resolveRepo(argValues, envValues, cwd);
    const defaults = defaultConfigForRepo(repo);
    const explicitConfig = stryMutAct_9fa48("767") ? argValues.config as string | undefined && envValues.config as string | undefined : (stryCov_9fa48("767"), argValues.config as string | undefined ?? envValues.config as string | undefined);
    const configPath = await findConfigPath(repo, explicitConfig, cwd);
    const filePayload = (stryMutAct_9fa48("770") ? typeof configPath !== "string" : stryMutAct_9fa48("769") ? false : stryMutAct_9fa48("768") ? true : (stryCov_9fa48("768", "769", "770"), typeof configPath === (stryMutAct_9fa48("771") ? "" : (stryCov_9fa48("771"), "string")))) ? await readConfigPayload(configPath) : stryMutAct_9fa48("772") ? {} : (stryCov_9fa48("772"), {
      raw: {},
      dir: repo
    });
    const config = mergeConfig(stryMutAct_9fa48("773") ? {} : (stryCov_9fa48("773"), {
      defaults,
      repo,
      cwd,
      envValues,
      argValues,
      fileConfig: filePayload.raw,
      configDir: filePayload.dir
    }));
    return {
      config,
      restArgs: rest
    } as const;
  }
};