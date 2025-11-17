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
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { STATUS_ORDER, headerToStatus } from "@promethean-os/markdown/statuses.js";
import { loadKanbanConfig } from "./config.js";
import type { IndexedTask } from "./types.js";
type KanbanResolvedConfig = Awaited<ReturnType<typeof loadKanbanConfig>>["config"];
const DEFAULT_SETTINGS_BLOCK = (stryMutAct_9fa48("1421") ? [] : (stryCov_9fa48("1421"), [stryMutAct_9fa48("1422") ? "" : (stryCov_9fa48("1422"), "%% kanban:settings"), stryMutAct_9fa48("1423") ? "" : (stryCov_9fa48("1423"), "```"), stryMutAct_9fa48("1424") ? "" : (stryCov_9fa48("1424"), '{"kanban-plugin":"board","list-collapse":[false,false,true,false,false,false,false,false,false,false,false,true,false,false,false],"new-note-template":"docs/agile/templates/task.stub.template.md","new-note-folder":"docs/agile/tasks","metadata-keys":[{"metadataKey":"tags","label":"","shouldHideLabel":false,"containsMarkdown":false},{"metadataKey":"hashtags","label":"","shouldHideLabel":false,"containsMarkdown":false}]}'), stryMutAct_9fa48("1425") ? "" : (stryCov_9fa48("1425"), "```"), stryMutAct_9fa48("1426") ? "" : (stryCov_9fa48("1426"), "%%")])).join(stryMutAct_9fa48("1427") ? "" : (stryCov_9fa48("1427"), "\n"));
const normalizeStatus = (rawStatus: string): string => {
  if (stryMutAct_9fa48("1428")) {
    {}
  } else {
    stryCov_9fa48("1428");
    const trimmed = stryMutAct_9fa48("1429") ? rawStatus : (stryCov_9fa48("1429"), rawStatus.trim());
    if (stryMutAct_9fa48("1432") ? trimmed.length !== 0 : stryMutAct_9fa48("1431") ? false : stryMutAct_9fa48("1430") ? true : (stryCov_9fa48("1430", "1431", "1432"), trimmed.length === 0)) {
      if (stryMutAct_9fa48("1433")) {
        {}
      } else {
        stryCov_9fa48("1433");
        return stryMutAct_9fa48("1434") ? "" : (stryCov_9fa48("1434"), "#todo");
      }
    }
    const withoutHash = (stryMutAct_9fa48("1435") ? trimmed.endsWith("#") : (stryCov_9fa48("1435"), trimmed.startsWith(stryMutAct_9fa48("1436") ? "" : (stryCov_9fa48("1436"), "#")))) ? stryMutAct_9fa48("1437") ? trimmed : (stryCov_9fa48("1437"), trimmed.slice(1)) : trimmed;
    const normalized = stryMutAct_9fa48("1439") ? withoutHash.replace(/\s+/g, "-").toLowerCase() : stryMutAct_9fa48("1438") ? withoutHash.trim().replace(/\s+/g, "-").toUpperCase() : (stryCov_9fa48("1438", "1439"), withoutHash.trim().replace(stryMutAct_9fa48("1441") ? /\S+/g : stryMutAct_9fa48("1440") ? /\s/g : (stryCov_9fa48("1440", "1441"), /\s+/g), stryMutAct_9fa48("1442") ? "" : (stryCov_9fa48("1442"), "-")).toLowerCase());
    return stryMutAct_9fa48("1443") ? `` : (stryCov_9fa48("1443"), `#${normalized}`);
  }
};
const slugify = stryMutAct_9fa48("1444") ? () => undefined : (stryCov_9fa48("1444"), (() => {
  const slugify = (value: string): string => stryMutAct_9fa48("1446") ? value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+/, "").replace(/-+$/, "") : stryMutAct_9fa48("1445") ? value.trim().toUpperCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+/, "").replace(/-+$/, "") : (stryCov_9fa48("1445", "1446"), value.trim().toLowerCase().replace(stryMutAct_9fa48("1448") ? /[a-z0-9]+/g : stryMutAct_9fa48("1447") ? /[^a-z0-9]/g : (stryCov_9fa48("1447", "1448"), /[^a-z0-9]+/g), stryMutAct_9fa48("1449") ? "" : (stryCov_9fa48("1449"), "-")).replace(stryMutAct_9fa48("1451") ? /^-/ : stryMutAct_9fa48("1450") ? /-+/ : (stryCov_9fa48("1450", "1451"), /^-+/), stryMutAct_9fa48("1452") ? "Stryker was here!" : (stryCov_9fa48("1452"), "")).replace(stryMutAct_9fa48("1454") ? /-$/ : stryMutAct_9fa48("1453") ? /-+/ : (stryCov_9fa48("1453", "1454"), /-+$/), stryMutAct_9fa48("1455") ? "Stryker was here!" : (stryCov_9fa48("1455"), "")));
  return slugify;
})());
const formatLabelTags = stryMutAct_9fa48("1456") ? () => undefined : (stryCov_9fa48("1456"), (() => {
  const formatLabelTags = (labels: ReadonlyArray<string>): ReadonlyArray<string> => stryMutAct_9fa48("1458") ? labels.map(slugify).filter((slug, index, all) => all.indexOf(slug) === index).map(slug => `#${slug}`) : stryMutAct_9fa48("1457") ? labels.map(slugify).filter(slug => slug.length > 0).map(slug => `#${slug}`) : (stryCov_9fa48("1457", "1458"), labels.map(slugify).filter(stryMutAct_9fa48("1459") ? () => undefined : (stryCov_9fa48("1459"), slug => stryMutAct_9fa48("1463") ? slug.length <= 0 : stryMutAct_9fa48("1462") ? slug.length >= 0 : stryMutAct_9fa48("1461") ? false : stryMutAct_9fa48("1460") ? true : (stryCov_9fa48("1460", "1461", "1462", "1463"), slug.length > 0))).filter(stryMutAct_9fa48("1464") ? () => undefined : (stryCov_9fa48("1464"), (slug, index, all) => stryMutAct_9fa48("1467") ? all.indexOf(slug) !== index : stryMutAct_9fa48("1466") ? false : stryMutAct_9fa48("1465") ? true : (stryCov_9fa48("1465", "1466", "1467"), all.indexOf(slug) === index))).map(stryMutAct_9fa48("1468") ? () => undefined : (stryCov_9fa48("1468"), slug => stryMutAct_9fa48("1469") ? `` : (stryCov_9fa48("1469"), `#${slug}`))));
  return formatLabelTags;
})());
type HeaderLabels = Readonly<Record<string, string>>;
const extractHeaderLabels = stryMutAct_9fa48("1470") ? () => undefined : (stryCov_9fa48("1470"), (() => {
  const extractHeaderLabels = (existing: string): HeaderLabels => existing.split(/\r?\n/).filter(line => line.startsWith("## ")).map(line => line.slice(3).trim()).filter(header => header.length > 0).reduce<Record<string, string>>((acc, header) => {
    const status = headerToStatus(header);
    if (status.length === 0) {
      return acc;
    }
    return {
      ...acc,
      [status]: header
    };
  }, {}) as HeaderLabels;
  return extractHeaderLabels;
})());
const extractSettingsBlock = (existing: string): string | undefined => {
  if (stryMutAct_9fa48("1471")) {
    {}
  } else {
    stryCov_9fa48("1471");
    if (stryMutAct_9fa48("1474") ? existing.length !== 0 : stryMutAct_9fa48("1473") ? false : stryMutAct_9fa48("1472") ? true : (stryCov_9fa48("1472", "1473", "1474"), existing.length === 0)) {
      if (stryMutAct_9fa48("1475")) {
        {}
      } else {
        stryCov_9fa48("1475");
        return undefined;
      }
    }
    const lines = existing.split(stryMutAct_9fa48("1476") ? /\r\n/ : (stryCov_9fa48("1476"), /\r?\n/));
    const start = lines.findIndex(line => {
      if (stryMutAct_9fa48("1477")) {
        {}
      } else {
        stryCov_9fa48("1477");
        const normalized = stryMutAct_9fa48("1479") ? line.toLowerCase() : stryMutAct_9fa48("1478") ? line.trim().toUpperCase() : (stryCov_9fa48("1478", "1479"), line.trim().toLowerCase());
        return stryMutAct_9fa48("1482") ? normalized.startsWith("%%") || normalized.includes("kanban:settings") : stryMutAct_9fa48("1481") ? false : stryMutAct_9fa48("1480") ? true : (stryCov_9fa48("1480", "1481", "1482"), (stryMutAct_9fa48("1483") ? normalized.endsWith("%%") : (stryCov_9fa48("1483"), normalized.startsWith(stryMutAct_9fa48("1484") ? "" : (stryCov_9fa48("1484"), "%%")))) && normalized.includes(stryMutAct_9fa48("1485") ? "" : (stryCov_9fa48("1485"), "kanban:settings")));
      }
    });
    if (stryMutAct_9fa48("1489") ? start >= 0 : stryMutAct_9fa48("1488") ? start <= 0 : stryMutAct_9fa48("1487") ? false : stryMutAct_9fa48("1486") ? true : (stryCov_9fa48("1486", "1487", "1488", "1489"), start < 0)) {
      if (stryMutAct_9fa48("1490")) {
        {}
      } else {
        stryCov_9fa48("1490");
        return undefined;
      }
    }
    const endRelative = stryMutAct_9fa48("1491") ? lines.findIndex(line => line.trim() === "%%") : (stryCov_9fa48("1491"), lines.slice(stryMutAct_9fa48("1492") ? start - 1 : (stryCov_9fa48("1492"), start + 1)).findIndex(stryMutAct_9fa48("1493") ? () => undefined : (stryCov_9fa48("1493"), line => stryMutAct_9fa48("1496") ? line.trim() !== "%%" : stryMutAct_9fa48("1495") ? false : stryMutAct_9fa48("1494") ? true : (stryCov_9fa48("1494", "1495", "1496"), (stryMutAct_9fa48("1497") ? line : (stryCov_9fa48("1497"), line.trim())) === (stryMutAct_9fa48("1498") ? "" : (stryCov_9fa48("1498"), "%%"))))));
    const end = (stryMutAct_9fa48("1502") ? endRelative < 0 : stryMutAct_9fa48("1501") ? endRelative > 0 : stryMutAct_9fa48("1500") ? false : stryMutAct_9fa48("1499") ? true : (stryCov_9fa48("1499", "1500", "1501", "1502"), endRelative >= 0)) ? stryMutAct_9fa48("1503") ? start + 1 - endRelative : (stryCov_9fa48("1503"), (stryMutAct_9fa48("1504") ? start - 1 : (stryCov_9fa48("1504"), start + 1)) + endRelative) : undefined;
    const blockLines = (stryMutAct_9fa48("1507") ? typeof end !== "number" : stryMutAct_9fa48("1506") ? false : stryMutAct_9fa48("1505") ? true : (stryCov_9fa48("1505", "1506", "1507"), typeof end === (stryMutAct_9fa48("1508") ? "" : (stryCov_9fa48("1508"), "number")))) ? stryMutAct_9fa48("1509") ? lines : (stryCov_9fa48("1509"), lines.slice(start, stryMutAct_9fa48("1510") ? end - 1 : (stryCov_9fa48("1510"), end + 1))) : stryMutAct_9fa48("1511") ? lines : (stryCov_9fa48("1511"), lines.slice(start));
    const suffix = (stryMutAct_9fa48("1512") ? existing.startsWith("\n") : (stryCov_9fa48("1512"), existing.endsWith(stryMutAct_9fa48("1513") ? "" : (stryCov_9fa48("1513"), "\n")))) ? stryMutAct_9fa48("1514") ? "" : (stryCov_9fa48("1514"), "\n") : stryMutAct_9fa48("1515") ? "Stryker was here!" : (stryCov_9fa48("1515"), "");
    return stryMutAct_9fa48("1516") ? `` : (stryCov_9fa48("1516"), `${blockLines.join(stryMutAct_9fa48("1517") ? "" : (stryCov_9fa48("1517"), "\n"))}${suffix}`);
  }
};
const headerForStatus = (status: string, headerLabels: HeaderLabels): string => {
  if (stryMutAct_9fa48("1518")) {
    {}
  } else {
    stryCov_9fa48("1518");
    const existing = headerLabels[status];
    if (stryMutAct_9fa48("1521") ? typeof existing === "string" || existing.length > 0 : stryMutAct_9fa48("1520") ? false : stryMutAct_9fa48("1519") ? true : (stryCov_9fa48("1519", "1520", "1521"), (stryMutAct_9fa48("1523") ? typeof existing !== "string" : stryMutAct_9fa48("1522") ? true : (stryCov_9fa48("1522", "1523"), typeof existing === (stryMutAct_9fa48("1524") ? "" : (stryCov_9fa48("1524"), "string")))) && (stryMutAct_9fa48("1527") ? existing.length <= 0 : stryMutAct_9fa48("1526") ? existing.length >= 0 : stryMutAct_9fa48("1525") ? true : (stryCov_9fa48("1525", "1526", "1527"), existing.length > 0)))) {
      if (stryMutAct_9fa48("1528")) {
        {}
      } else {
        stryCov_9fa48("1528");
        return existing;
      }
    }
    const label = stryMutAct_9fa48("1529") ? status.split("-").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" ") : (stryCov_9fa48("1529"), status.slice(1).split(stryMutAct_9fa48("1530") ? "" : (stryCov_9fa48("1530"), "-")).map(stryMutAct_9fa48("1531") ? () => undefined : (stryCov_9fa48("1531"), part => stryMutAct_9fa48("1532") ? part.charAt(0).toUpperCase() - part.slice(1) : (stryCov_9fa48("1532"), (stryMutAct_9fa48("1534") ? part.toUpperCase() : stryMutAct_9fa48("1533") ? part.charAt(0).toLowerCase() : (stryCov_9fa48("1533", "1534"), part.charAt(0).toUpperCase())) + (stryMutAct_9fa48("1535") ? part : (stryCov_9fa48("1535"), part.slice(1)))))).join(stryMutAct_9fa48("1536") ? "" : (stryCov_9fa48("1536"), " ")));
    return (stryMutAct_9fa48("1540") ? label.length <= 0 : stryMutAct_9fa48("1539") ? label.length >= 0 : stryMutAct_9fa48("1538") ? false : stryMutAct_9fa48("1537") ? true : (stryCov_9fa48("1537", "1538", "1539", "1540"), label.length > 0)) ? label : stryMutAct_9fa48("1541") ? "" : (stryCov_9fa48("1541"), "Todo");
  }
};
const formatTaskLine = (task: IndexedTask, status: string): string => {
  if (stryMutAct_9fa48("1542")) {
    {}
  } else {
    stryCov_9fa48("1542");
    const segments = task.path.split(/\\|\//);
    const fileName = stryMutAct_9fa48("1543") ? segments.at(-1) && task.path : (stryCov_9fa48("1543"), segments.at(stryMutAct_9fa48("1544") ? +1 : (stryCov_9fa48("1544"), -1)) ?? task.path);
    const displayTitle = (stryMutAct_9fa48("1548") ? task.title.trim().length <= 0 : stryMutAct_9fa48("1547") ? task.title.trim().length >= 0 : stryMutAct_9fa48("1546") ? false : stryMutAct_9fa48("1545") ? true : (stryCov_9fa48("1545", "1546", "1547", "1548"), (stryMutAct_9fa48("1549") ? task.title.length : (stryCov_9fa48("1549"), task.title.trim().length)) > 0)) ? stryMutAct_9fa48("1550") ? task.title : (stryCov_9fa48("1550"), task.title.trim()) : fileName.replace(stryMutAct_9fa48("1551") ? /\.md/iu : (stryCov_9fa48("1551"), /\.md$/iu), stryMutAct_9fa48("1552") ? "Stryker was here!" : (stryCov_9fa48("1552"), ""));
    const tags = stryMutAct_9fa48("1553") ? [] : (stryCov_9fa48("1553"), [status, ...formatLabelTags(task.labels)]);
    return stryMutAct_9fa48("1554") ? `` : (stryCov_9fa48("1554"), `- [ ] [[${fileName}|${displayTitle}]] ${tags.join(stryMutAct_9fa48("1555") ? "" : (stryCov_9fa48("1555"), " "))}`);
  }
};
type GroupedTasks = Readonly<Record<string, ReadonlyArray<IndexedTask>>>;
const groupTasks = stryMutAct_9fa48("1556") ? () => undefined : (stryCov_9fa48("1556"), (() => {
  const groupTasks = (tasks: ReadonlyArray<IndexedTask>): GroupedTasks => tasks.reduce<GroupedTasks>((acc, task) => {
    if (stryMutAct_9fa48("1557")) {
      {}
    } else {
      stryCov_9fa48("1557");
      const status = normalizeStatus(task.status);
      const existing = stryMutAct_9fa48("1558") ? acc[status] && [] : (stryCov_9fa48("1558"), acc[status] ?? (stryMutAct_9fa48("1559") ? ["Stryker was here"] : (stryCov_9fa48("1559"), [])));
      return stryMutAct_9fa48("1560") ? {} : (stryCov_9fa48("1560"), {
        ...acc,
        [status]: stryMutAct_9fa48("1561") ? [] : (stryCov_9fa48("1561"), [...existing, task])
      });
    }
  }, {} as GroupedTasks);
  return groupTasks;
})());
const compareTasks = stryMutAct_9fa48("1562") ? () => undefined : (stryCov_9fa48("1562"), (() => {
  const compareTasks = (left: IndexedTask, right: IndexedTask): number => left.title.localeCompare(right.title, undefined, stryMutAct_9fa48("1563") ? {} : (stryCov_9fa48("1563"), {
    sensitivity: stryMutAct_9fa48("1564") ? "" : (stryCov_9fa48("1564"), "base"),
    numeric: stryMutAct_9fa48("1565") ? false : (stryCov_9fa48("1565"), true)
  }));
  return compareTasks;
})());
const insertTaskSorted = (acc: ReadonlyArray<IndexedTask>, task: IndexedTask): ReadonlyArray<IndexedTask> => {
  if (stryMutAct_9fa48("1566")) {
    {}
  } else {
    stryCov_9fa48("1566");
    const index = acc.findIndex(stryMutAct_9fa48("1567") ? () => undefined : (stryCov_9fa48("1567"), candidate => stryMutAct_9fa48("1571") ? compareTasks(task, candidate) >= 0 : stryMutAct_9fa48("1570") ? compareTasks(task, candidate) <= 0 : stryMutAct_9fa48("1569") ? false : stryMutAct_9fa48("1568") ? true : (stryCov_9fa48("1568", "1569", "1570", "1571"), compareTasks(task, candidate) < 0)));
    return (stryMutAct_9fa48("1575") ? index >= 0 : stryMutAct_9fa48("1574") ? index <= 0 : stryMutAct_9fa48("1573") ? false : stryMutAct_9fa48("1572") ? true : (stryCov_9fa48("1572", "1573", "1574", "1575"), index < 0)) ? stryMutAct_9fa48("1576") ? [] : (stryCov_9fa48("1576"), [...acc, task]) : stryMutAct_9fa48("1577") ? [] : (stryCov_9fa48("1577"), [...(stryMutAct_9fa48("1578") ? acc : (stryCov_9fa48("1578"), acc.slice(0, index))), task, ...(stryMutAct_9fa48("1579") ? acc : (stryCov_9fa48("1579"), acc.slice(index)))]);
  }
};
const sortTasksList = stryMutAct_9fa48("1580") ? () => undefined : (stryCov_9fa48("1580"), (() => {
  const sortTasksList = (items: ReadonlyArray<IndexedTask>): ReadonlyArray<IndexedTask> => items.reduce<ReadonlyArray<IndexedTask>>(insertTaskSorted, [] as ReadonlyArray<IndexedTask>);
  return sortTasksList;
})());
const sortGroupedTasks = stryMutAct_9fa48("1581") ? () => undefined : (stryCov_9fa48("1581"), (() => {
  const sortGroupedTasks = (grouped: GroupedTasks): GroupedTasks => Object.keys(grouped).reduce<GroupedTasks>((acc, status) => {
    if (stryMutAct_9fa48("1582")) {
      {}
    } else {
      stryCov_9fa48("1582");
      const sorted = sortTasksList(stryMutAct_9fa48("1583") ? grouped[status] && [] : (stryCov_9fa48("1583"), grouped[status] ?? (stryMutAct_9fa48("1584") ? ["Stryker was here"] : (stryCov_9fa48("1584"), []))));
      return stryMutAct_9fa48("1585") ? {} : (stryCov_9fa48("1585"), {
        ...acc,
        [status]: sorted
      });
    }
  }, {} as GroupedTasks);
  return sortGroupedTasks;
})());
const insertStringSorted = (acc: ReadonlyArray<string>, value: string): ReadonlyArray<string> => {
  if (stryMutAct_9fa48("1586")) {
    {}
  } else {
    stryCov_9fa48("1586");
    const index = acc.findIndex(stryMutAct_9fa48("1587") ? () => undefined : (stryCov_9fa48("1587"), candidate => stryMutAct_9fa48("1591") ? value.localeCompare(candidate) >= 0 : stryMutAct_9fa48("1590") ? value.localeCompare(candidate) <= 0 : stryMutAct_9fa48("1589") ? false : stryMutAct_9fa48("1588") ? true : (stryCov_9fa48("1588", "1589", "1590", "1591"), value.localeCompare(candidate) < 0)));
    return (stryMutAct_9fa48("1595") ? index >= 0 : stryMutAct_9fa48("1594") ? index <= 0 : stryMutAct_9fa48("1593") ? false : stryMutAct_9fa48("1592") ? true : (stryCov_9fa48("1592", "1593", "1594", "1595"), index < 0)) ? stryMutAct_9fa48("1596") ? [] : (stryCov_9fa48("1596"), [...acc, value]) : stryMutAct_9fa48("1597") ? [] : (stryCov_9fa48("1597"), [...(stryMutAct_9fa48("1598") ? acc : (stryCov_9fa48("1598"), acc.slice(0, index))), value, ...(stryMutAct_9fa48("1599") ? acc : (stryCov_9fa48("1599"), acc.slice(index)))]);
  }
};
const sortStrings = stryMutAct_9fa48("1600") ? () => undefined : (stryCov_9fa48("1600"), (() => {
  const sortStrings = (values: ReadonlyArray<string>): ReadonlyArray<string> => values.reduce<ReadonlyArray<string>>(insertStringSorted, [] as ReadonlyArray<string>);
  return sortStrings;
})());
const orderedStatuses = (grouped: GroupedTasks): ReadonlyArray<string> => {
  if (stryMutAct_9fa48("1601")) {
    {}
  } else {
    stryCov_9fa48("1601");
    const keys = Object.keys(grouped);
    const primary = stryMutAct_9fa48("1602") ? STATUS_ORDER : (stryCov_9fa48("1602"), STATUS_ORDER.filter(stryMutAct_9fa48("1603") ? () => undefined : (stryCov_9fa48("1603"), status => keys.includes(status))));
    const extras = sortStrings(stryMutAct_9fa48("1604") ? keys : (stryCov_9fa48("1604"), keys.filter(stryMutAct_9fa48("1605") ? () => undefined : (stryCov_9fa48("1605"), status => stryMutAct_9fa48("1606") ? STATUS_ORDER.includes(status) : (stryCov_9fa48("1606"), !STATUS_ORDER.includes(status))))));
    return stryMutAct_9fa48("1607") ? [] : (stryCov_9fa48("1607"), [...primary, ...extras]);
  }
};
const buildSections = stryMutAct_9fa48("1608") ? () => undefined : (stryCov_9fa48("1608"), (() => {
  const buildSections = (statuses: ReadonlyArray<string>, grouped: GroupedTasks, headerLabels: HeaderLabels): ReadonlyArray<string> => statuses.flatMap(status => {
    if (stryMutAct_9fa48("1609")) {
      {}
    } else {
      stryCov_9fa48("1609");
      const items = stryMutAct_9fa48("1610") ? grouped[status] && [] : (stryCov_9fa48("1610"), grouped[status] ?? (stryMutAct_9fa48("1611") ? ["Stryker was here"] : (stryCov_9fa48("1611"), [])));
      if (stryMutAct_9fa48("1614") ? items.length !== 0 : stryMutAct_9fa48("1613") ? false : stryMutAct_9fa48("1612") ? true : (stryCov_9fa48("1612", "1613", "1614"), items.length === 0)) {
        if (stryMutAct_9fa48("1615")) {
          {}
        } else {
          stryCov_9fa48("1615");
          return [] as ReadonlyArray<string>;
        }
      }
      const header = stryMutAct_9fa48("1616") ? `` : (stryCov_9fa48("1616"), `## ${headerForStatus(status, headerLabels)}`);
      const lines = items.map(stryMutAct_9fa48("1617") ? () => undefined : (stryCov_9fa48("1617"), task => formatTaskLine(task, status)));
      return stryMutAct_9fa48("1618") ? [] : (stryCov_9fa48("1618"), [header, stryMutAct_9fa48("1619") ? "Stryker was here!" : (stryCov_9fa48("1619"), ""), ...lines, stryMutAct_9fa48("1620") ? "Stryker was here!" : (stryCov_9fa48("1620"), "")]);
    }
  });
  return buildSections;
})());
const buildBoard = (tasks: ReadonlyArray<IndexedTask>, existingBoard: string): string => {
  if (stryMutAct_9fa48("1621")) {
    {}
  } else {
    stryCov_9fa48("1621");
    const headerLabels = extractHeaderLabels(existingBoard);
    const grouped = sortGroupedTasks(groupTasks(tasks));
    const statuses = orderedStatuses(grouped);
    const sections = buildSections(statuses, grouped, headerLabels);
    const settings = stryMutAct_9fa48("1622") ? extractSettingsBlock(existingBoard) && DEFAULT_SETTINGS_BLOCK : (stryCov_9fa48("1622"), extractSettingsBlock(existingBoard) ?? DEFAULT_SETTINGS_BLOCK);
    const lines = stryMutAct_9fa48("1623") ? [] : (stryCov_9fa48("1623"), [stryMutAct_9fa48("1624") ? "" : (stryCov_9fa48("1624"), "---"), stryMutAct_9fa48("1625") ? "Stryker was here!" : (stryCov_9fa48("1625"), ""), stryMutAct_9fa48("1626") ? "" : (stryCov_9fa48("1626"), "kanban-plugin: board"), stryMutAct_9fa48("1627") ? "Stryker was here!" : (stryCov_9fa48("1627"), ""), stryMutAct_9fa48("1628") ? "" : (stryCov_9fa48("1628"), "---"), stryMutAct_9fa48("1629") ? "Stryker was here!" : (stryCov_9fa48("1629"), ""), ...sections, stryMutAct_9fa48("1630") ? settings.trimStart() : (stryCov_9fa48("1630"), settings.trimEnd())]);
    return stryMutAct_9fa48("1631") ? `` : (stryCov_9fa48("1631"), `${lines.join(stryMutAct_9fa48("1632") ? "" : (stryCov_9fa48("1632"), "\n"))}\n`);
  }
};
const readIndex = async (indexFile: string): Promise<ReadonlyArray<IndexedTask>> => {
  if (stryMutAct_9fa48("1633")) {
    {}
  } else {
    stryCov_9fa48("1633");
    const data = await readFile(indexFile, stryMutAct_9fa48("1634") ? "" : (stryCov_9fa48("1634"), "utf8")).catch(stryMutAct_9fa48("1635") ? () => undefined : (stryCov_9fa48("1635"), () => stryMutAct_9fa48("1636") ? "Stryker was here!" : (stryCov_9fa48("1636"), "")));
    return stryMutAct_9fa48("1637") ? data.split("\n").map(line => JSON.parse(line) as IndexedTask) : (stryCov_9fa48("1637"), data.split(stryMutAct_9fa48("1638") ? "" : (stryCov_9fa48("1638"), "\n")).filter(stryMutAct_9fa48("1639") ? () => undefined : (stryCov_9fa48("1639"), line => stryMutAct_9fa48("1643") ? line.length <= 0 : stryMutAct_9fa48("1642") ? line.length >= 0 : stryMutAct_9fa48("1641") ? false : stryMutAct_9fa48("1640") ? true : (stryCov_9fa48("1640", "1641", "1642", "1643"), line.length > 0))).map(stryMutAct_9fa48("1644") ? () => undefined : (stryCov_9fa48("1644"), line => JSON.parse(line) as IndexedTask)));
  }
};
const readBoard = stryMutAct_9fa48("1645") ? () => undefined : (stryCov_9fa48("1645"), (() => {
  const readBoard = async (boardFile: string): Promise<string> => readFile(boardFile, stryMutAct_9fa48("1646") ? "" : (stryCov_9fa48("1646"), "utf8")).catch(stryMutAct_9fa48("1647") ? () => undefined : (stryCov_9fa48("1647"), () => stryMutAct_9fa48("1648") ? "Stryker was here!" : (stryCov_9fa48("1648"), "")));
  return readBoard;
})());
const ensureBoardDir = async (boardFile: string): Promise<void> => {
  if (stryMutAct_9fa48("1649")) {
    {}
  } else {
    stryCov_9fa48("1649");
    const dir = path.dirname(boardFile);
    await mkdir(dir, stryMutAct_9fa48("1650") ? {} : (stryCov_9fa48("1650"), {
      recursive: stryMutAct_9fa48("1651") ? false : (stryCov_9fa48("1651"), true)
    }));
  }
};
const toJson = stryMutAct_9fa48("1652") ? () => undefined : (stryCov_9fa48("1652"), (() => {
  const toJson = (value: unknown): string => JSON.stringify(value, null, 2);
  return toJson;
})());
type ApplyBoardParams = Readonly<{
  readonly board: string;
  readonly existingBoard: string;
  readonly tasks: ReadonlyArray<IndexedTask>;
  readonly boardFile: string;
  readonly repoRoot: string;
}>;
const applyBoard = async ({
  board,
  existingBoard,
  tasks,
  boardFile,
  repoRoot
}: ApplyBoardParams): Promise<void> => {
  if (stryMutAct_9fa48("1653")) {
    {}
  } else {
    stryCov_9fa48("1653");
    const relativeBoard = path.relative(repoRoot, boardFile);
    if (stryMutAct_9fa48("1656") ? board !== existingBoard : stryMutAct_9fa48("1655") ? false : stryMutAct_9fa48("1654") ? true : (stryCov_9fa48("1654", "1655", "1656"), board === existingBoard)) {
      if (stryMutAct_9fa48("1657")) {
        {}
      } else {
        stryCov_9fa48("1657");
        console.log(toJson(stryMutAct_9fa48("1658") ? {} : (stryCov_9fa48("1658"), {
          applied: stryMutAct_9fa48("1659") ? true : (stryCov_9fa48("1659"), false),
          reason: stryMutAct_9fa48("1660") ? "" : (stryCov_9fa48("1660"), "board-up-to-date"),
          boardFile: relativeBoard,
          tasks: tasks.length
        })));
        return;
      }
    }
    await ensureBoardDir(boardFile);
    await writeFile(boardFile, board, stryMutAct_9fa48("1661") ? "" : (stryCov_9fa48("1661"), "utf8"));
    console.log(toJson(stryMutAct_9fa48("1662") ? {} : (stryCov_9fa48("1662"), {
      applied: stryMutAct_9fa48("1663") ? false : (stryCov_9fa48("1663"), true),
      boardFile: relativeBoard,
      tasks: tasks.length
    })));
  }
};
const runDry = (board: string, tasks: ReadonlyArray<IndexedTask>, boardFile: string, repoRoot: string): void => {
  if (stryMutAct_9fa48("1664")) {
    {}
  } else {
    stryCov_9fa48("1664");
    const relativeBoard = path.relative(repoRoot, boardFile);
    process.stdout.write(board);
    console.error(toJson(stryMutAct_9fa48("1665") ? {} : (stryCov_9fa48("1665"), {
      dryRun: stryMutAct_9fa48("1666") ? false : (stryCov_9fa48("1666"), true),
      boardFile: relativeBoard,
      tasks: tasks.length
    })));
  }
};
const runProjector = async (apply: boolean, config: KanbanResolvedConfig): Promise<void> => {
  if (stryMutAct_9fa48("1667")) {
    {}
  } else {
    stryCov_9fa48("1667");
    const tasks = await readIndex(config.indexFile);
    if (stryMutAct_9fa48("1670") ? tasks.length !== 0 : stryMutAct_9fa48("1669") ? false : stryMutAct_9fa48("1668") ? true : (stryCov_9fa48("1668", "1669", "1670"), tasks.length === 0)) {
      if (stryMutAct_9fa48("1671")) {
        {}
      } else {
        stryCov_9fa48("1671");
        console.error(stryMutAct_9fa48("1672") ? "" : (stryCov_9fa48("1672"), "No index found. Run: pnpm tsx packages/kanban/src/board/indexer.ts --write"));
        process.exit(1);
      }
    }
    const existingBoard = await readBoard(config.boardFile);
    const board = buildBoard(tasks, existingBoard);
    if (stryMutAct_9fa48("1674") ? false : stryMutAct_9fa48("1673") ? true : (stryCov_9fa48("1673", "1674"), apply)) {
      if (stryMutAct_9fa48("1675")) {
        {}
      } else {
        stryCov_9fa48("1675");
        await applyBoard(stryMutAct_9fa48("1676") ? {} : (stryCov_9fa48("1676"), {
          board,
          existingBoard,
          tasks,
          boardFile: config.boardFile,
          repoRoot: config.repo
        }));
        return;
      }
    }
    runDry(board, tasks, config.boardFile, config.repo);
  }
};
const main = async (): Promise<void> => {
  if (stryMutAct_9fa48("1677")) {
    {}
  } else {
    stryCov_9fa48("1677");
    const {
      config,
      restArgs
    } = await loadKanbanConfig();
    const apply = restArgs.includes(stryMutAct_9fa48("1678") ? "" : (stryCov_9fa48("1678"), "--apply"));
    await runProjector(apply, config);
  }
};
main().catch((error: unknown) => {
  if (stryMutAct_9fa48("1679")) {
    {}
  } else {
    stryCov_9fa48("1679");
    const message = error instanceof Error ? error : new Error(String(error));
    console.error(message);
    process.exit(1);
  }
});