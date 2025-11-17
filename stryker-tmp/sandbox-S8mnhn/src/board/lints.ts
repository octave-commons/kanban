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
import { listFilesRec } from "@promethean-os/utils/list-files-rec.js";
import { parseFrontmatter } from "@promethean-os/markdown/frontmatter";
import type { TaskFM } from "./types.js";
import type { ReadonlySetLike } from "./config/shared.js";
import { loadKanbanConfig } from "./config.js";
const EMPTY_ERRORS: ReadonlyArray<string> = Object.freeze([] as string[]);
const toTrimmedString = (value: unknown, fallback = stryMutAct_9fa48("1154") ? "Stryker was here!" : (stryCov_9fa48("1154"), "")): string => {
  if (stryMutAct_9fa48("1155")) {
    {}
  } else {
    stryCov_9fa48("1155");
    if (stryMutAct_9fa48("1158") ? typeof value === "string" : stryMutAct_9fa48("1157") ? false : stryMutAct_9fa48("1156") ? true : (stryCov_9fa48("1156", "1157", "1158"), typeof value !== (stryMutAct_9fa48("1159") ? "" : (stryCov_9fa48("1159"), "string")))) return fallback;
    const trimmed = stryMutAct_9fa48("1160") ? value : (stryCov_9fa48("1160"), value.trim());
    return (stryMutAct_9fa48("1164") ? trimmed.length <= 0 : stryMutAct_9fa48("1163") ? trimmed.length >= 0 : stryMutAct_9fa48("1162") ? false : stryMutAct_9fa48("1161") ? true : (stryCov_9fa48("1161", "1162", "1163", "1164"), trimmed.length > 0)) ? trimmed : fallback;
  }
};
const toOptionalString = (value: unknown): string | undefined => {
  if (stryMutAct_9fa48("1165")) {
    {}
  } else {
    stryCov_9fa48("1165");
    const trimmed = toTrimmedString(value);
    return (stryMutAct_9fa48("1169") ? trimmed.length <= 0 : stryMutAct_9fa48("1168") ? trimmed.length >= 0 : stryMutAct_9fa48("1167") ? false : stryMutAct_9fa48("1166") ? true : (stryCov_9fa48("1166", "1167", "1168", "1169"), trimmed.length > 0)) ? trimmed : undefined;
  }
};
const toLabelArray = (value: unknown): ReadonlyArray<string> => {
  if (stryMutAct_9fa48("1170")) {
    {}
  } else {
    stryCov_9fa48("1170");
    if (stryMutAct_9fa48("1172") ? false : stryMutAct_9fa48("1171") ? true : (stryCov_9fa48("1171", "1172"), Array.isArray(value))) {
      if (stryMutAct_9fa48("1173")) {
        {}
      } else {
        stryCov_9fa48("1173");
        return stryMutAct_9fa48("1174") ? value.map(entry => toTrimmedString(entry)) : (stryCov_9fa48("1174"), value.map(stryMutAct_9fa48("1175") ? () => undefined : (stryCov_9fa48("1175"), entry => toTrimmedString(entry))).filter(stryMutAct_9fa48("1176") ? () => undefined : (stryCov_9fa48("1176"), (entry): entry is string => stryMutAct_9fa48("1180") ? entry.length <= 0 : stryMutAct_9fa48("1179") ? entry.length >= 0 : stryMutAct_9fa48("1178") ? false : stryMutAct_9fa48("1177") ? true : (stryCov_9fa48("1177", "1178", "1179", "1180"), entry.length > 0))));
      }
    }
    if (stryMutAct_9fa48("1183") ? typeof value !== "string" : stryMutAct_9fa48("1182") ? false : stryMutAct_9fa48("1181") ? true : (stryCov_9fa48("1181", "1182", "1183"), typeof value === (stryMutAct_9fa48("1184") ? "" : (stryCov_9fa48("1184"), "string")))) {
      if (stryMutAct_9fa48("1185")) {
        {}
      } else {
        stryCov_9fa48("1185");
        return stryMutAct_9fa48("1186") ? value.split(",").map(entry => toTrimmedString(entry)) : (stryCov_9fa48("1186"), value.split(stryMutAct_9fa48("1187") ? "" : (stryCov_9fa48("1187"), ",")).map(stryMutAct_9fa48("1188") ? () => undefined : (stryCov_9fa48("1188"), entry => toTrimmedString(entry))).filter(stryMutAct_9fa48("1189") ? () => undefined : (stryCov_9fa48("1189"), (entry): entry is string => stryMutAct_9fa48("1193") ? entry.length <= 0 : stryMutAct_9fa48("1192") ? entry.length >= 0 : stryMutAct_9fa48("1191") ? false : stryMutAct_9fa48("1190") ? true : (stryCov_9fa48("1190", "1191", "1192", "1193"), entry.length > 0))));
      }
    }
    return stryMutAct_9fa48("1194") ? ["Stryker was here"] : (stryCov_9fa48("1194"), []);
  }
};
const toTaskFM = (data: Readonly<Record<string, unknown>>): TaskFM => {
  if (stryMutAct_9fa48("1195")) {
    {}
  } else {
    stryCov_9fa48("1195");
    const rawId = stryMutAct_9fa48("1196") ? (data as {
      readonly id?: unknown;
    }).id && (data as {
      readonly uuid?: unknown;
    }).uuid : (stryCov_9fa48("1196"), (data as {
      readonly id?: unknown;
    }).id ?? (data as {
      readonly uuid?: unknown;
    }).uuid);
    const rawCreated = stryMutAct_9fa48("1197") ? (data as {
      readonly created?: unknown;
    }).created && (data as {
      readonly created_at?: unknown;
    }).created_at : (stryCov_9fa48("1197"), (data as {
      readonly created?: unknown;
    }).created ?? (data as {
      readonly created_at?: unknown;
    }).created_at);
    const fm = (stryMutAct_9fa48("1198") ? {} : (stryCov_9fa48("1198"), {
      id: toTrimmedString(rawId),
      title: toTrimmedString(data.title),
      status: toTrimmedString(data.status) as TaskFM["status"],
      priority: toTrimmedString(data.priority) as TaskFM["priority"],
      owner: toTrimmedString(data.owner),
      labels: toLabelArray(data.labels),
      created: toTrimmedString(rawCreated),
      updated: toOptionalString((data as {
        readonly updated?: unknown;
      }).updated),
      uuid: toOptionalString((data as {
        readonly uuid?: unknown;
      }).uuid),
      created_at: toOptionalString((data as {
        readonly created_at?: unknown;
      }).created_at)
    })) satisfies TaskFM;
    return Object.freeze(fm);
  }
};
const filenameErrors = (task: Readonly<TaskFM>, fmData: Readonly<Record<string, unknown>>, filePath: string): ReadonlyArray<string> => {
  if (stryMutAct_9fa48("1199")) {
    {}
  } else {
    stryCov_9fa48("1199");
    const baseName = path.basename(filePath, stryMutAct_9fa48("1200") ? "" : (stryCov_9fa48("1200"), ".md"));
    const hasExplicitId = stryMutAct_9fa48("1203") ? typeof fmData.id === "string" || fmData.id.length > 0 : stryMutAct_9fa48("1202") ? false : stryMutAct_9fa48("1201") ? true : (stryCov_9fa48("1201", "1202", "1203"), (stryMutAct_9fa48("1205") ? typeof fmData.id !== "string" : stryMutAct_9fa48("1204") ? true : (stryCov_9fa48("1204", "1205"), typeof fmData.id === (stryMutAct_9fa48("1206") ? "" : (stryCov_9fa48("1206"), "string")))) && (stryMutAct_9fa48("1209") ? fmData.id.length <= 0 : stryMutAct_9fa48("1208") ? fmData.id.length >= 0 : stryMutAct_9fa48("1207") ? true : (stryCov_9fa48("1207", "1208", "1209"), fmData.id.length > 0)));
    if (stryMutAct_9fa48("1212") ? !hasExplicitId && task.id.length === 0 : stryMutAct_9fa48("1211") ? false : stryMutAct_9fa48("1210") ? true : (stryCov_9fa48("1210", "1211", "1212"), (stryMutAct_9fa48("1213") ? hasExplicitId : (stryCov_9fa48("1213"), !hasExplicitId)) || (stryMutAct_9fa48("1215") ? task.id.length !== 0 : stryMutAct_9fa48("1214") ? false : (stryCov_9fa48("1214", "1215"), task.id.length === 0)))) {
      if (stryMutAct_9fa48("1216")) {
        {}
      } else {
        stryCov_9fa48("1216");
        return EMPTY_ERRORS;
      }
    }
    return (stryMutAct_9fa48("1217") ? baseName.endsWith(task.id) : (stryCov_9fa48("1217"), baseName.startsWith(task.id))) ? EMPTY_ERRORS : Object.freeze(stryMutAct_9fa48("1218") ? [] : (stryCov_9fa48("1218"), [stryMutAct_9fa48("1219") ? `` : (stryCov_9fa48("1219"), `${path.basename(filePath)}: filename should start with id '${task.id}'`)]));
  }
};
const requiredFieldErrors = stryMutAct_9fa48("1220") ? () => undefined : (stryCov_9fa48("1220"), (() => {
  const requiredFieldErrors = (task: Readonly<TaskFM>, fmData: Readonly<Record<string, unknown>>, filePath: string, requiredFields: ReadonlyArray<string>): ReadonlyArray<string> => Object.freeze(stryMutAct_9fa48("1221") ? requiredFields.map(field => {
    if (field === "labels") {
      return task.labels.length > 0 ? undefined : `${path.basename(filePath)}: missing required field '${field}'`;
    }
    const value = fmData[field];
    return typeof value === "string" && value.length > 0 ? undefined : `${path.basename(filePath)}: missing required field '${field}'`;
  }) : (stryCov_9fa48("1221"), requiredFields.map(field => {
    if (stryMutAct_9fa48("1222")) {
      {}
    } else {
      stryCov_9fa48("1222");
      if (stryMutAct_9fa48("1225") ? field !== "labels" : stryMutAct_9fa48("1224") ? false : stryMutAct_9fa48("1223") ? true : (stryCov_9fa48("1223", "1224", "1225"), field === (stryMutAct_9fa48("1226") ? "" : (stryCov_9fa48("1226"), "labels")))) {
        if (stryMutAct_9fa48("1227")) {
          {}
        } else {
          stryCov_9fa48("1227");
          return (stryMutAct_9fa48("1231") ? task.labels.length <= 0 : stryMutAct_9fa48("1230") ? task.labels.length >= 0 : stryMutAct_9fa48("1229") ? false : stryMutAct_9fa48("1228") ? true : (stryCov_9fa48("1228", "1229", "1230", "1231"), task.labels.length > 0)) ? undefined : stryMutAct_9fa48("1232") ? `` : (stryCov_9fa48("1232"), `${path.basename(filePath)}: missing required field '${field}'`);
        }
      }
      const value = fmData[field];
      return (stryMutAct_9fa48("1235") ? typeof value === "string" || value.length > 0 : stryMutAct_9fa48("1234") ? false : stryMutAct_9fa48("1233") ? true : (stryCov_9fa48("1233", "1234", "1235"), (stryMutAct_9fa48("1237") ? typeof value !== "string" : stryMutAct_9fa48("1236") ? true : (stryCov_9fa48("1236", "1237"), typeof value === (stryMutAct_9fa48("1238") ? "" : (stryCov_9fa48("1238"), "string")))) && (stryMutAct_9fa48("1241") ? value.length <= 0 : stryMutAct_9fa48("1240") ? value.length >= 0 : stryMutAct_9fa48("1239") ? true : (stryCov_9fa48("1239", "1240", "1241"), value.length > 0)))) ? undefined : stryMutAct_9fa48("1242") ? `` : (stryCov_9fa48("1242"), `${path.basename(filePath)}: missing required field '${field}'`);
    }
  }).filter(stryMutAct_9fa48("1243") ? () => undefined : (stryCov_9fa48("1243"), (message): message is string => Boolean(message)))));
  return requiredFieldErrors;
})());
const enumErrors = stryMutAct_9fa48("1244") ? () => undefined : (stryCov_9fa48("1244"), (() => {
  const enumErrors = (task: Readonly<TaskFM>, filePath: string, {
    statusValues,
    priorityValues
  }: Readonly<{
    readonly statusValues: ReadonlySetLike<string>;
    readonly priorityValues: ReadonlySetLike<string>;
  }>): ReadonlyArray<string> => Object.freeze(stryMutAct_9fa48("1245") ? [statusValues.has(task.status) ? undefined : `${path.basename(filePath)}: invalid status '${task.status}'`, priorityValues.has(task.priority) ? undefined : `${path.basename(filePath)}: invalid priority '${task.priority}'`] : (stryCov_9fa48("1245"), (stryMutAct_9fa48("1246") ? [] : (stryCov_9fa48("1246"), [statusValues.has(task.status) ? undefined : stryMutAct_9fa48("1247") ? `` : (stryCov_9fa48("1247"), `${path.basename(filePath)}: invalid status '${task.status}'`), priorityValues.has(task.priority) ? undefined : stryMutAct_9fa48("1248") ? `` : (stryCov_9fa48("1248"), `${path.basename(filePath)}: invalid priority '${task.priority}'`)])).filter(stryMutAct_9fa48("1249") ? () => undefined : (stryCov_9fa48("1249"), (message): message is string => Boolean(message)))));
  return enumErrors;
})());
const lintTaskFile = stryMutAct_9fa48("1250") ? () => undefined : (stryCov_9fa48("1250"), (() => {
  const lintTaskFile = async (filePath: string, {
    requiredFields,
    statusValues,
    priorityValues
  }: Readonly<{
    readonly requiredFields: ReadonlyArray<string>;
    readonly statusValues: ReadonlySetLike<string>;
    readonly priorityValues: ReadonlySetLike<string>;
  }>): Promise<ReadonlyArray<string>> => readFile(filePath, stryMutAct_9fa48("1251") ? "" : (stryCov_9fa48("1251"), "utf8")).then(stryMutAct_9fa48("1252") ? () => undefined : (stryCov_9fa48("1252"), raw => parseFrontmatter<Readonly<Record<string, unknown>>>(raw))).then(stryMutAct_9fa48("1253") ? () => undefined : (stryCov_9fa48("1253"), ({
    data
  }) => stryMutAct_9fa48("1254") ? {} : (stryCov_9fa48("1254"), {
    task: toTaskFM(stryMutAct_9fa48("1255") ? data && {} : (stryCov_9fa48("1255"), data ?? {})),
    fm: stryMutAct_9fa48("1256") ? data && {} : (stryCov_9fa48("1256"), data ?? {})
  }))).then(stryMutAct_9fa48("1257") ? () => undefined : (stryCov_9fa48("1257"), ({
    task,
    fm
  }) => Object.freeze(stryMutAct_9fa48("1258") ? [] : (stryCov_9fa48("1258"), [...filenameErrors(task, fm, filePath), ...requiredFieldErrors(task, fm, filePath, requiredFields), ...enumErrors(task, filePath, stryMutAct_9fa48("1259") ? {} : (stryCov_9fa48("1259"), {
    statusValues,
    priorityValues
  }))])))).catch(stryMutAct_9fa48("1260") ? () => undefined : (stryCov_9fa48("1260"), (error: unknown) => Object.freeze(stryMutAct_9fa48("1261") ? [] : (stryCov_9fa48("1261"), [stryMutAct_9fa48("1262") ? `` : (stryCov_9fa48("1262"), `${path.basename(filePath)}: ${error instanceof Error ? error.message : String(error)}`)]))));
  return lintTaskFile;
})());
const main = async (): Promise<void> => {
  if (stryMutAct_9fa48("1263")) {
    {}
  } else {
    stryCov_9fa48("1263");
    const {
      config
    } = await loadKanbanConfig();
    const files = await listFilesRec(config.tasksDir, new Set(config.exts));
    const errors = (await Promise.all(files.map(stryMutAct_9fa48("1264") ? () => undefined : (stryCov_9fa48("1264"), filePath => lintTaskFile(filePath, stryMutAct_9fa48("1265") ? {} : (stryCov_9fa48("1265"), {
      requiredFields: config.requiredFields,
      statusValues: config.statusValues,
      priorityValues: config.priorityValues
    })))))).flat();
    if (stryMutAct_9fa48("1269") ? errors.length <= 0 : stryMutAct_9fa48("1268") ? errors.length >= 0 : stryMutAct_9fa48("1267") ? false : stryMutAct_9fa48("1266") ? true : (stryCov_9fa48("1266", "1267", "1268", "1269"), errors.length > 0)) {
      if (stryMutAct_9fa48("1270")) {
        {}
      } else {
        stryCov_9fa48("1270");
        errors.forEach(message => {
          if (stryMutAct_9fa48("1271")) {
            {}
          } else {
            stryCov_9fa48("1271");
            console.error(message);
          }
        });
        process.exit(1);
      }
    }
    console.log(stryMutAct_9fa48("1272") ? `` : (stryCov_9fa48("1272"), `Lint OK: ${files.length} task file(s)`));
  }
};
main().catch(err => {
  if (stryMutAct_9fa48("1273")) {
    {}
  } else {
    stryCov_9fa48("1273");
    console.error(err);
    process.exit(1);
  }
});