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
import * as path from 'node:path';
export type RawKanbanConfig = Readonly<{
  readonly tasksDir?: string;
  readonly indexFile?: string;
  readonly boardFile?: string;
  readonly cachePath?: string;
  readonly exts?: ReadonlyArray<string>;
  readonly requiredFields?: ReadonlyArray<string>;
  readonly statusValues?: ReadonlyArray<string>;
  readonly priorityValues?: ReadonlyArray<string>;
  readonly wipLimits?: Readonly<Record<string, number>>;
}>;
export type KanbanConfig = Readonly<{
  readonly repo: string;
  readonly tasksDir: string;
  readonly indexFile: string;
  readonly boardFile: string;
  readonly cachePath: string;
  readonly exts: ReadonlySetLike<string>;
  readonly requiredFields: ReadonlyArray<string>;
  readonly statusValues: ReadonlySetLike<string>;
  readonly priorityValues: ReadonlySetLike<string>;
  readonly wipLimits: Readonly<Record<string, number>>;
}>;
export type LoadKanbanConfigResult = Readonly<{
  readonly config: KanbanConfig;
  readonly restArgs: ReadonlyArray<string>;
}>;
export const DEFAULT_CONFIG_BASENAME = 'promethean.kanban.json' as const;
export const CONFIG_SEARCH_PATHS = Object.freeze(['docs/agile/tasks/promethean.kanban.json', 'docs/agile/promethean.kanban.json', 'docs/promethean.kanban.json', 'promethean.kanban.json'] as const);
export const MARKERS = Object.freeze(['pnpm-workspace.yaml', 'package.json', '.git'] as const);
export const ENV_KEYS = {
  repo: 'KANBAN_REPO',
  config: 'KANBAN_CONFIG',
  tasksDir: 'KANBAN_TASKS_DIR',
  indexFile: 'KANBAN_INDEX_FILE',
  boardFile: 'KANBAN_BOARD_FILE',
  cachePath: 'KANBAN_CACHE_PATH',
  exts: 'KANBAN_EXTS',
  requiredFields: 'KANBAN_REQUIRED_FIELDS',
  statusValues: 'KANBAN_STATUS_VALUES',
  priorityValues: 'KANBAN_PRIORITY_VALUES'
} as const;
export const ARG_KEYS = new Map<string, keyof typeof ENV_KEYS>(stryMutAct_9fa48("505") ? [] : (stryCov_9fa48("505"), [stryMutAct_9fa48("506") ? [] : (stryCov_9fa48("506"), [stryMutAct_9fa48("507") ? "" : (stryCov_9fa48("507"), 'repo'), stryMutAct_9fa48("508") ? "" : (stryCov_9fa48("508"), 'repo')]), stryMutAct_9fa48("509") ? [] : (stryCov_9fa48("509"), [stryMutAct_9fa48("510") ? "" : (stryCov_9fa48("510"), 'config'), stryMutAct_9fa48("511") ? "" : (stryCov_9fa48("511"), 'config')]), stryMutAct_9fa48("512") ? [] : (stryCov_9fa48("512"), [stryMutAct_9fa48("513") ? "" : (stryCov_9fa48("513"), 'tasks-dir'), stryMutAct_9fa48("514") ? "" : (stryCov_9fa48("514"), 'tasksDir')]), stryMutAct_9fa48("515") ? [] : (stryCov_9fa48("515"), [stryMutAct_9fa48("516") ? "" : (stryCov_9fa48("516"), 'index-file'), stryMutAct_9fa48("517") ? "" : (stryCov_9fa48("517"), 'indexFile')]), stryMutAct_9fa48("518") ? [] : (stryCov_9fa48("518"), [stryMutAct_9fa48("519") ? "" : (stryCov_9fa48("519"), 'board-file'), stryMutAct_9fa48("520") ? "" : (stryCov_9fa48("520"), 'boardFile')]), stryMutAct_9fa48("521") ? [] : (stryCov_9fa48("521"), [stryMutAct_9fa48("522") ? "" : (stryCov_9fa48("522"), 'cache-path'), stryMutAct_9fa48("523") ? "" : (stryCov_9fa48("523"), 'cachePath')]), stryMutAct_9fa48("524") ? [] : (stryCov_9fa48("524"), [stryMutAct_9fa48("525") ? "" : (stryCov_9fa48("525"), 'exts'), stryMutAct_9fa48("526") ? "" : (stryCov_9fa48("526"), 'exts')]), stryMutAct_9fa48("527") ? [] : (stryCov_9fa48("527"), [stryMutAct_9fa48("528") ? "" : (stryCov_9fa48("528"), 'required-fields'), stryMutAct_9fa48("529") ? "" : (stryCov_9fa48("529"), 'requiredFields')]), stryMutAct_9fa48("530") ? [] : (stryCov_9fa48("530"), [stryMutAct_9fa48("531") ? "" : (stryCov_9fa48("531"), 'status-values'), stryMutAct_9fa48("532") ? "" : (stryCov_9fa48("532"), 'statusValues')]), stryMutAct_9fa48("533") ? [] : (stryCov_9fa48("533"), [stryMutAct_9fa48("534") ? "" : (stryCov_9fa48("534"), 'priority-values'), stryMutAct_9fa48("535") ? "" : (stryCov_9fa48("535"), 'priorityValues')])]));
export type EnvArgKey = keyof typeof ENV_KEYS;
export type OverrideMap = Readonly<Partial<Record<EnvArgKey, string | ReadonlyArray<string>>>>;
export type ArrayKey = 'exts' | 'requiredFields' | 'statusValues' | 'priorityValues';
export const ARRAY_KEYS: ReadonlySet<EnvArgKey> = Object.freeze(new Set<EnvArgKey>(stryMutAct_9fa48("536") ? [] : (stryCov_9fa48("536"), [stryMutAct_9fa48("537") ? "" : (stryCov_9fa48("537"), 'exts'), stryMutAct_9fa48("538") ? "" : (stryCov_9fa48("538"), 'requiredFields'), stryMutAct_9fa48("539") ? "" : (stryCov_9fa48("539"), 'statusValues'), stryMutAct_9fa48("540") ? "" : (stryCov_9fa48("540"), 'priorityValues')])));
export type Defaults = Readonly<{
  readonly tasksDir: string;
  readonly indexFile: string;
  readonly boardFile: string;
  readonly cachePath: string;
  readonly exts: ReadonlyArray<string>;
  readonly requiredFields: ReadonlyArray<string>;
  readonly statusValues: ReadonlyArray<string>;
  readonly priorityValues: ReadonlyArray<string>;
  readonly wipLimits: Readonly<Record<string, number>>;
}>;
export type ReadonlySetLike<T> = Readonly<{
  readonly has: (value: T) => boolean;
  readonly [Symbol.iterator]: () => IterableIterator<T>;
}>;
export const resolveWithBase = stryMutAct_9fa48("541") ? () => undefined : (stryCov_9fa48("541"), (() => {
  const resolveWithBase = (base: string, candidate: string): string => path.isAbsolute(candidate) ? candidate : path.resolve(base, candidate);
  return resolveWithBase;
})());
export const parseList = stryMutAct_9fa48("542") ? () => undefined : (stryCov_9fa48("542"), (() => {
  const parseList = (value: string | undefined): ReadonlyArray<string> => (stryMutAct_9fa48("545") ? typeof value !== 'string' : stryMutAct_9fa48("544") ? false : stryMutAct_9fa48("543") ? true : (stryCov_9fa48("543", "544", "545"), typeof value === (stryMutAct_9fa48("546") ? "" : (stryCov_9fa48("546"), 'string')))) ? stryMutAct_9fa48("547") ? value.split(',').map(entry => entry.trim()) : (stryCov_9fa48("547"), value.split(stryMutAct_9fa48("548") ? "" : (stryCov_9fa48("548"), ',')).map(stryMutAct_9fa48("549") ? () => undefined : (stryCov_9fa48("549"), entry => stryMutAct_9fa48("550") ? entry : (stryCov_9fa48("550"), entry.trim()))).filter(stryMutAct_9fa48("551") ? () => undefined : (stryCov_9fa48("551"), entry => stryMutAct_9fa48("555") ? entry.length <= 0 : stryMutAct_9fa48("554") ? entry.length >= 0 : stryMutAct_9fa48("553") ? false : stryMutAct_9fa48("552") ? true : (stryCov_9fa48("552", "553", "554", "555"), entry.length > 0)))) : stryMutAct_9fa48("556") ? ["Stryker was here"] : (stryCov_9fa48("556"), []);
  return parseList;
})());
export const normalizeExts = stryMutAct_9fa48("557") ? () => undefined : (stryCov_9fa48("557"), (() => {
  const normalizeExts = (values: ReadonlyArray<string>): ReadonlyArray<string> => stryMutAct_9fa48("558") ? values.map(value => value.trim()).map(value => value.startsWith('.') ? value.toLowerCase() : `.${value.toLowerCase()}`) : (stryCov_9fa48("558"), values.map(stryMutAct_9fa48("559") ? () => undefined : (stryCov_9fa48("559"), value => stryMutAct_9fa48("560") ? value : (stryCov_9fa48("560"), value.trim()))).filter(stryMutAct_9fa48("561") ? () => undefined : (stryCov_9fa48("561"), value => stryMutAct_9fa48("565") ? value.length <= 0 : stryMutAct_9fa48("564") ? value.length >= 0 : stryMutAct_9fa48("563") ? false : stryMutAct_9fa48("562") ? true : (stryCov_9fa48("562", "563", "564", "565"), value.length > 0))).map(stryMutAct_9fa48("566") ? () => undefined : (stryCov_9fa48("566"), value => (stryMutAct_9fa48("567") ? value.endsWith('.') : (stryCov_9fa48("567"), value.startsWith(stryMutAct_9fa48("568") ? "" : (stryCov_9fa48("568"), '.')))) ? stryMutAct_9fa48("569") ? value.toUpperCase() : (stryCov_9fa48("569"), value.toLowerCase()) : stryMutAct_9fa48("570") ? `` : (stryCov_9fa48("570"), `.${stryMutAct_9fa48("571") ? value.toUpperCase() : (stryCov_9fa48("571"), value.toLowerCase())}`))));
  return normalizeExts;
})());
export const arrayHasKey = stryMutAct_9fa48("572") ? () => undefined : (stryCov_9fa48("572"), (() => {
  const arrayHasKey = (key: EnvArgKey): key is ArrayKey => ARRAY_KEYS.has(key);
  return arrayHasKey;
})());
export const defaultConfigForRepo = stryMutAct_9fa48("573") ? () => undefined : (stryCov_9fa48("573"), (() => {
  const defaultConfigForRepo = (repo: string): Defaults => ({
    tasksDir: path.join(repo, 'docs', 'agile', 'tasks'),
    indexFile: path.join(repo, 'docs', 'agile', 'boards', 'index.jsonl'),
    boardFile: path.join(repo, 'docs', 'agile', 'boards', 'generated.md'),
    cachePath: path.join(repo, 'docs', 'agile', 'boards', '.cache'),
    exts: ['.md'],
    requiredFields: ['id', 'title', 'status', 'priority', 'owner', 'labels', 'created'],
    statusValues: ['open', 'doing', 'blocked', 'done', 'dropped'],
    priorityValues: ['low', 'medium', 'high', 'critical'],
    wipLimits: {
      icebox: 50,
      incoming: 10,
      accepted: 5,
      breakdown: 3,
      ready: 5,
      todo: 20,
      in_progress: 3,
      review: 2,
      document: 2,
      done: 100,
      rejected: 10
    }
  }) as const;
  return defaultConfigForRepo;
})());