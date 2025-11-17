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
import { normalizeExts, parseList, resolveWithBase, type Defaults, type ReadonlySetLike, type KanbanConfig, type OverrideMap, type RawKanbanConfig } from "./shared.js";
type MergeContext = Readonly<{
  readonly repo: string;
  readonly configDir: string;
  readonly cwd: string;
}>;
type PathParams = Readonly<{
  readonly defaults: string;
  readonly envValue?: string;
  readonly configValue?: string;
  readonly argValue?: string;
  readonly context: MergeContext;
}>;
const mergePathSetting = (params: PathParams): string => {
  if (stryMutAct_9fa48("446")) {
    {}
  } else {
    stryCov_9fa48("446");
    const fromEnv = (stryMutAct_9fa48("449") ? typeof params.envValue !== "string" : stryMutAct_9fa48("448") ? false : stryMutAct_9fa48("447") ? true : (stryCov_9fa48("447", "448", "449"), typeof params.envValue === (stryMutAct_9fa48("450") ? "" : (stryCov_9fa48("450"), "string")))) ? resolveWithBase(params.context.repo, params.envValue) : params.defaults;
    const fromConfig = (stryMutAct_9fa48("453") ? typeof params.configValue !== "string" : stryMutAct_9fa48("452") ? false : stryMutAct_9fa48("451") ? true : (stryCov_9fa48("451", "452", "453"), typeof params.configValue === (stryMutAct_9fa48("454") ? "" : (stryCov_9fa48("454"), "string")))) ? resolveWithBase(params.context.configDir, params.configValue) : fromEnv;
    return (stryMutAct_9fa48("457") ? typeof params.argValue !== "string" : stryMutAct_9fa48("456") ? false : stryMutAct_9fa48("455") ? true : (stryCov_9fa48("455", "456", "457"), typeof params.argValue === (stryMutAct_9fa48("458") ? "" : (stryCov_9fa48("458"), "string")))) ? resolveWithBase(params.context.cwd, params.argValue) : fromConfig;
  }
};
const resolveConfigArray = (current: ReadonlyArray<string>, override: string | ReadonlyArray<string> | undefined): ReadonlyArray<string> => {
  if (stryMutAct_9fa48("459")) {
    {}
  } else {
    stryCov_9fa48("459");
    if (stryMutAct_9fa48("461") ? false : stryMutAct_9fa48("460") ? true : (stryCov_9fa48("460", "461"), Array.isArray(override))) {
      if (stryMutAct_9fa48("462")) {
        {}
      } else {
        stryCov_9fa48("462");
        const normalized = stryMutAct_9fa48("463") ? override.map(entry => typeof entry === "string" ? entry.trim() : "") : (stryCov_9fa48("463"), override.map(stryMutAct_9fa48("464") ? () => undefined : (stryCov_9fa48("464"), entry => (stryMutAct_9fa48("467") ? typeof entry !== "string" : stryMutAct_9fa48("466") ? false : stryMutAct_9fa48("465") ? true : (stryCov_9fa48("465", "466", "467"), typeof entry === (stryMutAct_9fa48("468") ? "" : (stryCov_9fa48("468"), "string")))) ? stryMutAct_9fa48("469") ? entry : (stryCov_9fa48("469"), entry.trim()) : stryMutAct_9fa48("470") ? "Stryker was here!" : (stryCov_9fa48("470"), ""))).filter(stryMutAct_9fa48("471") ? () => undefined : (stryCov_9fa48("471"), entry => stryMutAct_9fa48("475") ? entry.length <= 0 : stryMutAct_9fa48("474") ? entry.length >= 0 : stryMutAct_9fa48("473") ? false : stryMutAct_9fa48("472") ? true : (stryCov_9fa48("472", "473", "474", "475"), entry.length > 0))));
        return (stryMutAct_9fa48("479") ? normalized.length <= 0 : stryMutAct_9fa48("478") ? normalized.length >= 0 : stryMutAct_9fa48("477") ? false : stryMutAct_9fa48("476") ? true : (stryCov_9fa48("476", "477", "478", "479"), normalized.length > 0)) ? normalized : current;
      }
    }
    if (stryMutAct_9fa48("482") ? typeof override !== "string" : stryMutAct_9fa48("481") ? false : stryMutAct_9fa48("480") ? true : (stryCov_9fa48("480", "481", "482"), typeof override === (stryMutAct_9fa48("483") ? "" : (stryCov_9fa48("483"), "string")))) {
      if (stryMutAct_9fa48("484")) {
        {}
      } else {
        stryCov_9fa48("484");
        const normalized = parseList(override);
        return (stryMutAct_9fa48("488") ? normalized.length <= 0 : stryMutAct_9fa48("487") ? normalized.length >= 0 : stryMutAct_9fa48("486") ? false : stryMutAct_9fa48("485") ? true : (stryCov_9fa48("485", "486", "487", "488"), normalized.length > 0)) ? normalized : current;
      }
    }
    return current;
  }
};
type ArrayParams = Readonly<{
  readonly defaults: ReadonlyArray<string>;
  readonly envValue?: string | ReadonlyArray<string>;
  readonly configValue?: ReadonlyArray<string>;
  readonly argValue?: string | ReadonlyArray<string>;
}>;
const mergeArraySetting = ({
  defaults,
  envValue,
  configValue,
  argValue
}: ArrayParams): ReadonlyArray<string> => {
  if (stryMutAct_9fa48("489")) {
    {}
  } else {
    stryCov_9fa48("489");
    const fromEnv = resolveConfigArray(defaults, envValue);
    const fromConfig = resolveConfigArray(fromEnv, configValue);
    return resolveConfigArray(fromConfig, argValue);
  }
};
type MergeInputs = Readonly<{
  readonly defaults: Defaults;
  readonly repo: string;
  readonly cwd: string;
  readonly envValues: OverrideMap;
  readonly argValues: OverrideMap;
  readonly fileConfig: RawKanbanConfig;
  readonly configDir: string;
}>;
const buildPaths = ({
  defaults,
  repo,
  cwd,
  envValues,
  argValues,
  fileConfig,
  configDir
}: MergeInputs): Readonly<{
  readonly tasksDir: string;
  readonly indexFile: string;
  readonly boardFile: string;
  readonly cachePath: string;
}> => {
  if (stryMutAct_9fa48("490")) {
    {}
  } else {
    stryCov_9fa48("490");
    const context: MergeContext = {
      repo,
      configDir,
      cwd
    } as const;
    const tasksDir = mergePathSetting(stryMutAct_9fa48("491") ? {} : (stryCov_9fa48("491"), {
      defaults: defaults.tasksDir,
      envValue: envValues.tasksDir as string | undefined,
      configValue: fileConfig.tasksDir,
      argValue: argValues.tasksDir as string | undefined,
      context
    }));
    const indexFile = mergePathSetting(stryMutAct_9fa48("492") ? {} : (stryCov_9fa48("492"), {
      defaults: defaults.indexFile,
      envValue: envValues.indexFile as string | undefined,
      configValue: fileConfig.indexFile,
      argValue: argValues.indexFile as string | undefined,
      context
    }));
    const boardFile = mergePathSetting(stryMutAct_9fa48("493") ? {} : (stryCov_9fa48("493"), {
      defaults: defaults.boardFile,
      envValue: envValues.boardFile as string | undefined,
      configValue: fileConfig.boardFile,
      argValue: argValues.boardFile as string | undefined,
      context
    }));
    const cachePath = mergePathSetting(stryMutAct_9fa48("494") ? {} : (stryCov_9fa48("494"), {
      defaults: defaults.cachePath,
      envValue: envValues.cachePath as string | undefined,
      configValue: fileConfig.cachePath,
      argValue: argValues.cachePath as string | undefined,
      context
    }));
    return {
      tasksDir,
      indexFile,
      boardFile,
      cachePath
    } as const;
  }
};
const buildArrays = ({
  defaults,
  envValues,
  argValues,
  fileConfig
}: MergeInputs): Readonly<{
  readonly exts: ReadonlyArray<string>;
  readonly requiredFields: ReadonlyArray<string>;
  readonly statusValues: ReadonlyArray<string>;
  readonly priorityValues: ReadonlyArray<string>;
}> => {
  if (stryMutAct_9fa48("495")) {
    {}
  } else {
    stryCov_9fa48("495");
    const exts = normalizeExts(mergeArraySetting(stryMutAct_9fa48("496") ? {} : (stryCov_9fa48("496"), {
      defaults: defaults.exts,
      envValue: envValues.exts,
      configValue: fileConfig.exts,
      argValue: argValues.exts
    })));
    const requiredFields = mergeArraySetting(stryMutAct_9fa48("497") ? {} : (stryCov_9fa48("497"), {
      defaults: defaults.requiredFields,
      envValue: envValues.requiredFields,
      configValue: fileConfig.requiredFields,
      argValue: argValues.requiredFields
    }));
    const statusValues = mergeArraySetting(stryMutAct_9fa48("498") ? {} : (stryCov_9fa48("498"), {
      defaults: defaults.statusValues,
      envValue: envValues.statusValues,
      configValue: fileConfig.statusValues,
      argValue: argValues.statusValues
    }));
    const priorityValues = mergeArraySetting(stryMutAct_9fa48("499") ? {} : (stryCov_9fa48("499"), {
      defaults: defaults.priorityValues,
      envValue: envValues.priorityValues,
      configValue: fileConfig.priorityValues,
      argValue: argValues.priorityValues
    }));
    return {
      exts,
      requiredFields,
      statusValues,
      priorityValues
    } as const;
  }
};
const mergeWipLimits = (defaults: Readonly<Record<string, number>>, configValue?: Readonly<Record<string, number>>): Readonly<Record<string, number>> => {
  if (stryMutAct_9fa48("500")) {
    {}
  } else {
    stryCov_9fa48("500");
    return Object.freeze(stryMutAct_9fa48("501") ? {} : (stryCov_9fa48("501"), {
      ...defaults,
      ...configValue
    }));
  }
};
export const mergeConfig = (inputs: MergeInputs): KanbanConfig => {
  if (stryMutAct_9fa48("502")) {
    {}
  } else {
    stryCov_9fa48("502");
    const paths = buildPaths(inputs);
    const arrays = buildArrays(inputs);
    const wipLimits = mergeWipLimits(inputs.defaults.wipLimits, inputs.fileConfig.wipLimits);
    return Object.freeze(stryMutAct_9fa48("503") ? {} : (stryCov_9fa48("503"), {
      repo: inputs.repo,
      tasksDir: paths.tasksDir,
      indexFile: paths.indexFile,
      boardFile: paths.boardFile,
      cachePath: paths.cachePath,
      exts: Object.freeze(new Set(arrays.exts)) as ReadonlySetLike<string>,
      requiredFields: Object.freeze(stryMutAct_9fa48("504") ? [] : (stryCov_9fa48("504"), [...arrays.requiredFields])),
      statusValues: Object.freeze(new Set(arrays.statusValues)) as ReadonlySetLike<string>,
      priorityValues: Object.freeze(new Set(arrays.priorityValues)) as ReadonlySetLike<string>,
      wipLimits
    }));
  }
};