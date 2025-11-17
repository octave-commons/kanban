// @ts-nocheck
// tools/wip-sheriff.ts
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
import fs from "node:fs/promises";
import path from "node:path";
type Card = {
  title: string;
  wikilink?: string;
  filepath?: string;
  points: number;
  tags: string[];
  origin?: string;
  mtimeMs?: number;
};
type Lane = {
  title: string;
  name: string;
  capacity: number | null;
  cards: Card[];
};
type Board = Lane[];
const VAULT = stryMutAct_9fa48("25206") ? process.env.VAULT_ROOT && "." : (stryCov_9fa48("25206"), process.env.VAULT_ROOT ?? (stryMutAct_9fa48("25207") ? "" : (stryCov_9fa48("25207"), ".")));
const BOARD_PATH = path.join(VAULT, stryMutAct_9fa48("25208") ? "" : (stryCov_9fa48("25208"), "docs/agile/boards/kanban.md"));
const TASKS_DIR = path.join(VAULT, stryMutAct_9fa48("25209") ? "" : (stryCov_9fa48("25209"), "docs/agile/tasks"));
const argv = new Map(stryMutAct_9fa48("25210") ? process.argv.flatMap(a => {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/);
  return m ? [[m[1], m[2] ?? "true"]] : [];
}) : (stryCov_9fa48("25210"), process.argv.slice(2).flatMap(a => {
  if (stryMutAct_9fa48("25211")) {
    {}
  } else {
    stryCov_9fa48("25211");
    const m = a.match(stryMutAct_9fa48("25217") ? /^--([^=]+)(?:=(.))?$/ : stryMutAct_9fa48("25216") ? /^--([^=]+)(?:=(.*))$/ : stryMutAct_9fa48("25215") ? /^--([=]+)(?:=(.*))?$/ : stryMutAct_9fa48("25214") ? /^--([^=])(?:=(.*))?$/ : stryMutAct_9fa48("25213") ? /^--([^=]+)(?:=(.*))?/ : stryMutAct_9fa48("25212") ? /--([^=]+)(?:=(.*))?$/ : (stryCov_9fa48("25212", "25213", "25214", "25215", "25216", "25217"), /^--([^=]+)(?:=(.*))?$/));
    return m ? stryMutAct_9fa48("25218") ? [] : (stryCov_9fa48("25218"), [stryMutAct_9fa48("25219") ? [] : (stryCov_9fa48("25219"), [m[1], stryMutAct_9fa48("25220") ? m[2] && "true" : (stryCov_9fa48("25220"), m[2] ?? (stryMutAct_9fa48("25221") ? "" : (stryCov_9fa48("25221"), "true")))])]) : stryMutAct_9fa48("25222") ? ["Stryker was here"] : (stryCov_9fa48("25222"), []);
  }
})));
const WRITE = stryMutAct_9fa48("25225") ? argv.get("write") !== "true" : stryMutAct_9fa48("25224") ? false : stryMutAct_9fa48("25223") ? true : (stryCov_9fa48("25223", "25224", "25225"), argv.get(stryMutAct_9fa48("25226") ? "" : (stryCov_9fa48("25226"), "write")) === (stryMutAct_9fa48("25227") ? "" : (stryCov_9fa48("25227"), "true")));
const BASIS = (argv.get("basis") ?? "points") as "points" | "count";
const DEFAULT_CAP = parseInt(stryMutAct_9fa48("25228") ? argv.get("default-cap") && "3" : (stryCov_9fa48("25228"), argv.get(stryMutAct_9fa48("25229") ? "" : (stryCov_9fa48("25229"), "default-cap")) ?? (stryMutAct_9fa48("25230") ? "" : (stryCov_9fa48("25230"), "3"))), 10);
const DOING = (stryMutAct_9fa48("25231") ? argv.get("doing") && "Breakdown,In Progress,Todo,In Review" : (stryCov_9fa48("25231"), argv.get(stryMutAct_9fa48("25232") ? "" : (stryCov_9fa48("25232"), "doing")) ?? (stryMutAct_9fa48("25233") ? "" : (stryCov_9fa48("25233"), "Breakdown,In Progress,Todo,In Review")))).split(stryMutAct_9fa48("25234") ? "" : (stryCov_9fa48("25234"), ",")).map(stryMutAct_9fa48("25235") ? () => undefined : (stryCov_9fa48("25235"), s => stryMutAct_9fa48("25236") ? s : (stryCov_9fa48("25236"), s.trim())));
const SAFE_LEFT = stryMutAct_9fa48("25237") ? argv.get("safe-left") && "Accepted" : (stryCov_9fa48("25237"), argv.get(stryMutAct_9fa48("25238") ? "" : (stryCov_9fa48("25238"), "safe-left")) ?? (stryMutAct_9fa48("25239") ? "" : (stryCov_9fa48("25239"), "Accepted")));
const DRY_RUN = stryMutAct_9fa48("25242") ? argv.get("dry-run") === "true" && !WRITE && argv.get("dry-run") !== "false" : stryMutAct_9fa48("25241") ? false : stryMutAct_9fa48("25240") ? true : (stryCov_9fa48("25240", "25241", "25242"), (stryMutAct_9fa48("25244") ? argv.get("dry-run") !== "true" : stryMutAct_9fa48("25243") ? false : (stryCov_9fa48("25243", "25244"), argv.get(stryMutAct_9fa48("25245") ? "" : (stryCov_9fa48("25245"), "dry-run")) === (stryMutAct_9fa48("25246") ? "" : (stryCov_9fa48("25246"), "true")))) || (stryMutAct_9fa48("25248") ? !WRITE || argv.get("dry-run") !== "false" : stryMutAct_9fa48("25247") ? false : (stryCov_9fa48("25247", "25248"), (stryMutAct_9fa48("25249") ? WRITE : (stryCov_9fa48("25249"), !WRITE)) && (stryMutAct_9fa48("25251") ? argv.get("dry-run") === "false" : stryMutAct_9fa48("25250") ? true : (stryCov_9fa48("25250", "25251"), argv.get(stryMutAct_9fa48("25252") ? "" : (stryCov_9fa48("25252"), "dry-run")) !== (stryMutAct_9fa48("25253") ? "" : (stryCov_9fa48("25253"), "false")))))));
// Keep exactly what's after the settings marker so we can round-trip it.
function splitKanbanSettings(md: string): {
  content: string;
  footer: string;
} {
  if (stryMutAct_9fa48("25254")) {
    {}
  } else {
    stryCov_9fa48("25254");
    const start = md.search(stryMutAct_9fa48("25259") ? /^\s*%%\S*kanban:settings\b/m : stryMutAct_9fa48("25258") ? /^\s*%%\skanban:settings\b/m : stryMutAct_9fa48("25257") ? /^\S*%%\s*kanban:settings\b/m : stryMutAct_9fa48("25256") ? /^\s%%\s*kanban:settings\b/m : stryMutAct_9fa48("25255") ? /\s*%%\s*kanban:settings\b/m : (stryCov_9fa48("25255", "25256", "25257", "25258", "25259"), /^\s*%%\s*kanban:settings\b/m));
    if (stryMutAct_9fa48("25263") ? start < 0 : stryMutAct_9fa48("25262") ? start > 0 : stryMutAct_9fa48("25261") ? false : stryMutAct_9fa48("25260") ? true : (stryCov_9fa48("25260", "25261", "25262", "25263"), start >= 0)) {
      if (stryMutAct_9fa48("25264")) {
        {}
      } else {
        stryCov_9fa48("25264");
        return stryMutAct_9fa48("25265") ? {} : (stryCov_9fa48("25265"), {
          content: stryMutAct_9fa48("25266") ? md.replace(/\s+$/, "") : (stryCov_9fa48("25266"), md.slice(0, start).replace(stryMutAct_9fa48("25269") ? /\S+$/ : stryMutAct_9fa48("25268") ? /\s$/ : stryMutAct_9fa48("25267") ? /\s+/ : (stryCov_9fa48("25267", "25268", "25269"), /\s+$/), stryMutAct_9fa48("25270") ? "Stryker was here!" : (stryCov_9fa48("25270"), ""))),
          footer: stryMutAct_9fa48("25271") ? md : (stryCov_9fa48("25271"), md.slice(start))
        });
      }
    }
    return stryMutAct_9fa48("25272") ? {} : (stryCov_9fa48("25272"), {
      content: md.replace(stryMutAct_9fa48("25275") ? /\S+$/ : stryMutAct_9fa48("25274") ? /\s$/ : stryMutAct_9fa48("25273") ? /\s+/ : (stryCov_9fa48("25273", "25274", "25275"), /\s+$/), stryMutAct_9fa48("25276") ? "Stryker was here!" : (stryCov_9fa48("25276"), "")),
      footer: stryMutAct_9fa48("25277") ? "Stryker was here!" : (stryCov_9fa48("25277"), "")
    });
  }
}

// Optional: keep any preamble before the first "## " heading
function extractPreamble(content: string): {
  preamble: string;
  body: string;
} {
  if (stryMutAct_9fa48("25278")) {
    {}
  } else {
    stryCov_9fa48("25278");
    const idx = content.search(stryMutAct_9fa48("25281") ? /^##\S+/m : stryMutAct_9fa48("25280") ? /^##\s/m : stryMutAct_9fa48("25279") ? /##\s+/m : (stryCov_9fa48("25279", "25280", "25281"), /^##\s+/m));
    if (stryMutAct_9fa48("25285") ? idx <= 0 : stryMutAct_9fa48("25284") ? idx >= 0 : stryMutAct_9fa48("25283") ? false : stryMutAct_9fa48("25282") ? true : (stryCov_9fa48("25282", "25283", "25284", "25285"), idx > 0)) {
      if (stryMutAct_9fa48("25286")) {
        {}
      } else {
        stryCov_9fa48("25286");
        return stryMutAct_9fa48("25287") ? {} : (stryCov_9fa48("25287"), {
          preamble: stryMutAct_9fa48("25288") ? content.replace(/\s+$/, "") : (stryCov_9fa48("25288"), content.slice(0, idx).replace(stryMutAct_9fa48("25291") ? /\S+$/ : stryMutAct_9fa48("25290") ? /\s$/ : stryMutAct_9fa48("25289") ? /\s+/ : (stryCov_9fa48("25289", "25290", "25291"), /\s+$/), stryMutAct_9fa48("25292") ? "Stryker was here!" : (stryCov_9fa48("25292"), ""))),
          body: stryMutAct_9fa48("25293") ? content : (stryCov_9fa48("25293"), content.slice(idx))
        });
      }
    }
    return stryMutAct_9fa48("25294") ? {} : (stryCov_9fa48("25294"), {
      preamble: stryMutAct_9fa48("25295") ? "Stryker was here!" : (stryCov_9fa48("25295"), ""),
      body: content
    });
  }
}

// Normalize lane titles (strip "(n)" etc.) — unchanged from earlier advice
function laneName(title: string): string {
  if (stryMutAct_9fa48("25296")) {
    {}
  } else {
    stryCov_9fa48("25296");
    const [head] = title.split(stryMutAct_9fa48("25297") ? "" : (stryCov_9fa48("25297"), "#"), 1);
    const noHash = stryMutAct_9fa48("25298") ? head ?? title : (stryCov_9fa48("25298"), (stryMutAct_9fa48("25299") ? head && title : (stryCov_9fa48("25299"), head ?? title)).trim());
    return stryMutAct_9fa48("25300") ? noHash.replace(/\s*(?:\(|\[)\d+\s*(?:pts?|points?)?(?:\)|\])\s*$/i, "") : (stryCov_9fa48("25300"), noHash.replace(stryMutAct_9fa48("25312") ? /\s*(?:\(|\[)\d+\s*(?:pts?|points?)?(?:\)|\])\S*$/i : stryMutAct_9fa48("25311") ? /\s*(?:\(|\[)\d+\s*(?:pts?|points?)?(?:\)|\])\s$/i : stryMutAct_9fa48("25310") ? /\s*(?:\(|\[)\d+\s*(?:pts?|points)?(?:\)|\])\s*$/i : stryMutAct_9fa48("25309") ? /\s*(?:\(|\[)\d+\s*(?:pts|points?)?(?:\)|\])\s*$/i : stryMutAct_9fa48("25308") ? /\s*(?:\(|\[)\d+\s*(?:pts?|points?)(?:\)|\])\s*$/i : stryMutAct_9fa48("25307") ? /\s*(?:\(|\[)\d+\S*(?:pts?|points?)?(?:\)|\])\s*$/i : stryMutAct_9fa48("25306") ? /\s*(?:\(|\[)\d+\s(?:pts?|points?)?(?:\)|\])\s*$/i : stryMutAct_9fa48("25305") ? /\s*(?:\(|\[)\D+\s*(?:pts?|points?)?(?:\)|\])\s*$/i : stryMutAct_9fa48("25304") ? /\s*(?:\(|\[)\d\s*(?:pts?|points?)?(?:\)|\])\s*$/i : stryMutAct_9fa48("25303") ? /\S*(?:\(|\[)\d+\s*(?:pts?|points?)?(?:\)|\])\s*$/i : stryMutAct_9fa48("25302") ? /\s(?:\(|\[)\d+\s*(?:pts?|points?)?(?:\)|\])\s*$/i : stryMutAct_9fa48("25301") ? /\s*(?:\(|\[)\d+\s*(?:pts?|points?)?(?:\)|\])\s*/i : (stryCov_9fa48("25301", "25302", "25303", "25304", "25305", "25306", "25307", "25308", "25309", "25310", "25311", "25312"), /\s*(?:\(|\[)\d+\s*(?:pts?|points?)?(?:\)|\])\s*$/i), stryMutAct_9fa48("25313") ? "Stryker was here!" : (stryCov_9fa48("25313"), "")).trim());
  }
}
function parseCapacity(title: string): number | null {
  if (stryMutAct_9fa48("25314")) {
    {}
  } else {
    stryCov_9fa48("25314");
    // Strip trailing hashtags/comments (e.g. "In Progress (5) #doing")
    const [head] = title.split(stryMutAct_9fa48("25315") ? "" : (stryCov_9fa48("25315"), "#"), 1);
    const base = stryMutAct_9fa48("25316") ? head && title : (stryCov_9fa48("25316"), head ?? title);

    // Find the LAST "(number ...)" group in the remaining text.
    const all = Array.from(base.matchAll(stryMutAct_9fa48("25323") ? /\((\d+)\s*(?:pts?|points)?\)/g : stryMutAct_9fa48("25322") ? /\((\d+)\s*(?:pts|points?)?\)/g : stryMutAct_9fa48("25321") ? /\((\d+)\s*(?:pts?|points?)\)/g : stryMutAct_9fa48("25320") ? /\((\d+)\S*(?:pts?|points?)?\)/g : stryMutAct_9fa48("25319") ? /\((\d+)\s(?:pts?|points?)?\)/g : stryMutAct_9fa48("25318") ? /\((\D+)\s*(?:pts?|points?)?\)/g : stryMutAct_9fa48("25317") ? /\((\d)\s*(?:pts?|points?)?\)/g : (stryCov_9fa48("25317", "25318", "25319", "25320", "25321", "25322", "25323"), /\((\d+)\s*(?:pts?|points?)?\)/g)));
    const lastNumeric = (stryMutAct_9fa48("25327") ? all.length <= 0 : stryMutAct_9fa48("25326") ? all.length >= 0 : stryMutAct_9fa48("25325") ? false : stryMutAct_9fa48("25324") ? true : (stryCov_9fa48("25324", "25325", "25326", "25327"), all.length > 0)) ? stryMutAct_9fa48("25328") ? all[all.length - 1][1] : (stryCov_9fa48("25328"), all[stryMutAct_9fa48("25329") ? all.length + 1 : (stryCov_9fa48("25329"), all.length - 1)]?.[1]) : undefined;
    if (stryMutAct_9fa48("25332") ? typeof lastNumeric !== "string" : stryMutAct_9fa48("25331") ? false : stryMutAct_9fa48("25330") ? true : (stryCov_9fa48("25330", "25331", "25332"), typeof lastNumeric === (stryMutAct_9fa48("25333") ? "" : (stryCov_9fa48("25333"), "string")))) {
      if (stryMutAct_9fa48("25334")) {
        {}
      } else {
        stryCov_9fa48("25334");
        return parseInt(lastNumeric, 10);
      }
    }

    // (Optional) allow bracket style e.g. "In Progress [5]"
    const alt = base.match(stryMutAct_9fa48("25341") ? /\[(\d+)\s*(?:pts?|points)?\]/ : stryMutAct_9fa48("25340") ? /\[(\d+)\s*(?:pts|points?)?\]/ : stryMutAct_9fa48("25339") ? /\[(\d+)\s*(?:pts?|points?)\]/ : stryMutAct_9fa48("25338") ? /\[(\d+)\S*(?:pts?|points?)?\]/ : stryMutAct_9fa48("25337") ? /\[(\d+)\s(?:pts?|points?)?\]/ : stryMutAct_9fa48("25336") ? /\[(\D+)\s*(?:pts?|points?)?\]/ : stryMutAct_9fa48("25335") ? /\[(\d)\s*(?:pts?|points?)?\]/ : (stryCov_9fa48("25335", "25336", "25337", "25338", "25339", "25340", "25341"), /\[(\d+)\s*(?:pts?|points?)?\]/));
    const numeric = stryMutAct_9fa48("25342") ? alt[1] : (stryCov_9fa48("25342"), alt?.[1]);
    return (stryMutAct_9fa48("25345") ? typeof numeric !== "string" : stryMutAct_9fa48("25344") ? false : stryMutAct_9fa48("25343") ? true : (stryCov_9fa48("25343", "25344", "25345"), typeof numeric === (stryMutAct_9fa48("25346") ? "" : (stryCov_9fa48("25346"), "string")))) ? parseInt(numeric, 10) : null;
  }
}
function extractPointsFromTitle(t: string): number | undefined {
  if (stryMutAct_9fa48("25347")) {
    {}
  } else {
    stryCov_9fa48("25347");
    const match = t.match(stryMutAct_9fa48("25352") ? /\[(\d+)\]\S*$/ : stryMutAct_9fa48("25351") ? /\[(\d+)\]\s$/ : stryMutAct_9fa48("25350") ? /\[(\D+)\]\s*$/ : stryMutAct_9fa48("25349") ? /\[(\d)\]\s*$/ : stryMutAct_9fa48("25348") ? /\[(\d+)\]\s*/ : (stryCov_9fa48("25348", "25349", "25350", "25351", "25352"), /\[(\d+)\]\s*$/));
    const numeric = stryMutAct_9fa48("25353") ? match[1] : (stryCov_9fa48("25353"), match?.[1]);
    return (stryMutAct_9fa48("25356") ? typeof numeric !== "string" : stryMutAct_9fa48("25355") ? false : stryMutAct_9fa48("25354") ? true : (stryCov_9fa48("25354", "25355", "25356"), typeof numeric === (stryMutAct_9fa48("25357") ? "" : (stryCov_9fa48("25357"), "string")))) ? parseInt(numeric, 10) : undefined;
  }
}
const parseWikiTarget = (target: string): {
  slug: string;
  title: string;
} => {
  if (stryMutAct_9fa48("25358")) {
    {}
  } else {
    stryCov_9fa48("25358");
    const [slugRaw, titleRaw] = target.split(stryMutAct_9fa48("25359") ? "" : (stryCov_9fa48("25359"), "|"), 2);
    const slug = stryMutAct_9fa48("25360") ? slugRaw ?? "" : (stryCov_9fa48("25360"), (stryMutAct_9fa48("25361") ? slugRaw && "" : (stryCov_9fa48("25361"), slugRaw ?? (stryMutAct_9fa48("25362") ? "Stryker was here!" : (stryCov_9fa48("25362"), "")))).trim());
    const title = stryMutAct_9fa48("25363") ? titleRaw ?? slug : (stryCov_9fa48("25363"), (stryMutAct_9fa48("25364") ? titleRaw && slug : (stryCov_9fa48("25364"), titleRaw ?? slug)).trim());
    return stryMutAct_9fa48("25365") ? {} : (stryCov_9fa48("25365"), {
      slug,
      title
    });
  }
};
async function readTask(filepath: string): Promise<Partial<Card>> {
  if (stryMutAct_9fa48("25366")) {
    {}
  } else {
    stryCov_9fa48("25366");
    let txt = stryMutAct_9fa48("25367") ? "Stryker was here!" : (stryCov_9fa48("25367"), "");
    try {
      if (stryMutAct_9fa48("25368")) {
        {}
      } else {
        stryCov_9fa48("25368");
        txt = await fs.readFile(filepath, stryMutAct_9fa48("25369") ? "" : (stryCov_9fa48("25369"), "utf8"));
      }
    } catch {
      if (stryMutAct_9fa48("25370")) {
        {}
      } else {
        stryCov_9fa48("25370");
        return {};
      }
    }
    const tags = stryMutAct_9fa48("25371") ? Array.from(txt.matchAll(/#([\w\-]+)/g)).map(match => match[1]).map(label => `#${label}`) : (stryCov_9fa48("25371"), Array.from(txt.matchAll(stryMutAct_9fa48("25374") ? /#([\W\-]+)/g : stryMutAct_9fa48("25373") ? /#([^\w\-]+)/g : stryMutAct_9fa48("25372") ? /#([\w\-])/g : (stryCov_9fa48("25372", "25373", "25374"), /#([\w\-]+)/g))).map(stryMutAct_9fa48("25375") ? () => undefined : (stryCov_9fa48("25375"), match => match[1])).filter(stryMutAct_9fa48("25376") ? () => undefined : (stryCov_9fa48("25376"), (label): label is string => stryMutAct_9fa48("25379") ? typeof label !== "string" : stryMutAct_9fa48("25378") ? false : stryMutAct_9fa48("25377") ? true : (stryCov_9fa48("25377", "25378", "25379"), typeof label === (stryMutAct_9fa48("25380") ? "" : (stryCov_9fa48("25380"), "string"))))).map(stryMutAct_9fa48("25381") ? () => undefined : (stryCov_9fa48("25381"), label => stryMutAct_9fa48("25382") ? `` : (stryCov_9fa48("25382"), `#${label}`))));
    const fmPts = (() => {
      if (stryMutAct_9fa48("25383")) {
        {}
      } else {
        stryCov_9fa48("25383");
        const match = txt.match(stryMutAct_9fa48("25388") ? /(?:^|\n)points:\s*(\D+)/i : stryMutAct_9fa48("25387") ? /(?:^|\n)points:\s*(\d)/i : stryMutAct_9fa48("25386") ? /(?:^|\n)points:\S*(\d+)/i : stryMutAct_9fa48("25385") ? /(?:^|\n)points:\s(\d+)/i : stryMutAct_9fa48("25384") ? /(?:\n)points:\s*(\d+)/i : (stryCov_9fa48("25384", "25385", "25386", "25387", "25388"), /(?:^|\n)points:\s*(\d+)/i));
        const numeric = stryMutAct_9fa48("25389") ? match[1] : (stryCov_9fa48("25389"), match?.[1]);
        return (stryMutAct_9fa48("25392") ? typeof numeric !== "string" : stryMutAct_9fa48("25391") ? false : stryMutAct_9fa48("25390") ? true : (stryCov_9fa48("25390", "25391", "25392"), typeof numeric === (stryMutAct_9fa48("25393") ? "" : (stryCov_9fa48("25393"), "string")))) ? parseInt(numeric, 10) : undefined;
      }
    })();
    const origin = (() => {
      if (stryMutAct_9fa48("25394")) {
        {}
      } else {
        stryCov_9fa48("25394");
        const match = txt.match(stryMutAct_9fa48("25399") ? /(?:^|\n)origin:\s*([\n]+)/i : stryMutAct_9fa48("25398") ? /(?:^|\n)origin:\s*([^\n])/i : stryMutAct_9fa48("25397") ? /(?:^|\n)origin:\S*([^\n]+)/i : stryMutAct_9fa48("25396") ? /(?:^|\n)origin:\s([^\n]+)/i : stryMutAct_9fa48("25395") ? /(?:\n)origin:\s*([^\n]+)/i : (stryCov_9fa48("25395", "25396", "25397", "25398", "25399"), /(?:^|\n)origin:\s*([^\n]+)/i));
        const raw = stryMutAct_9fa48("25400") ? match[1] : (stryCov_9fa48("25400"), match?.[1]);
        return (stryMutAct_9fa48("25403") ? typeof raw !== "string" : stryMutAct_9fa48("25402") ? false : stryMutAct_9fa48("25401") ? true : (stryCov_9fa48("25401", "25402", "25403"), typeof raw === (stryMutAct_9fa48("25404") ? "" : (stryCov_9fa48("25404"), "string")))) ? stryMutAct_9fa48("25405") ? raw : (stryCov_9fa48("25405"), raw.trim()) : undefined;
      }
    })();
    const st = await fs.stat(filepath).catch(stryMutAct_9fa48("25406") ? () => undefined : (stryCov_9fa48("25406"), () => null));
    return stryMutAct_9fa48("25407") ? {} : (stryCov_9fa48("25407"), {
      points: fmPts,
      tags,
      origin,
      mtimeMs: stryMutAct_9fa48("25408") ? st.mtimeMs : (stryCov_9fa48("25408"), st?.mtimeMs)
    });
  }
}
async function parseBoard(md: string): Promise<Board> {
  if (stryMutAct_9fa48("25409")) {
    {}
  } else {
    stryCov_9fa48("25409");
    const lines = md.split(stryMutAct_9fa48("25410") ? /\r\n/ : (stryCov_9fa48("25410"), /\r?\n/));
    const lanes: Board = stryMutAct_9fa48("25411") ? ["Stryker was here"] : (stryCov_9fa48("25411"), []);
    let current: Lane | null = null;
    for (const line of lines) {
      if (stryMutAct_9fa48("25412")) {
        {}
      } else {
        stryCov_9fa48("25412");
        const headingMatch = line.match(stryMutAct_9fa48("25417") ? /^##\s+(.)$/ : stryMutAct_9fa48("25416") ? /^##\S+(.+)$/ : stryMutAct_9fa48("25415") ? /^##\s(.+)$/ : stryMutAct_9fa48("25414") ? /^##\s+(.+)/ : stryMutAct_9fa48("25413") ? /##\s+(.+)$/ : (stryCov_9fa48("25413", "25414", "25415", "25416", "25417"), /^##\s+(.+)$/));
        const headingTitle = stryMutAct_9fa48("25418") ? headingMatch[1] : (stryCov_9fa48("25418"), headingMatch?.[1]);
        if (stryMutAct_9fa48("25421") ? typeof headingTitle !== "string" : stryMutAct_9fa48("25420") ? false : stryMutAct_9fa48("25419") ? true : (stryCov_9fa48("25419", "25420", "25421"), typeof headingTitle === (stryMutAct_9fa48("25422") ? "" : (stryCov_9fa48("25422"), "string")))) {
          if (stryMutAct_9fa48("25423")) {
            {}
          } else {
            stryCov_9fa48("25423");
            if (stryMutAct_9fa48("25425") ? false : stryMutAct_9fa48("25424") ? true : (stryCov_9fa48("25424", "25425"), current)) lanes.push(current);
            // when parsing a heading:
            const title = stryMutAct_9fa48("25426") ? headingTitle : (stryCov_9fa48("25426"), headingTitle.trim());
            current = stryMutAct_9fa48("25427") ? {} : (stryCov_9fa48("25427"), {
              title,
              name: laneName(title),
              capacity: parseCapacity(title),
              cards: stryMutAct_9fa48("25428") ? ["Stryker was here"] : (stryCov_9fa48("25428"), [])
            });
            continue;
          }
        }
        const itemMatch = line.match(stryMutAct_9fa48("25438") ? /^- \[.\]\s+\[\[([^\]]+)\]\](?:\s+(.))?$/ : stryMutAct_9fa48("25437") ? /^- \[.\]\s+\[\[([^\]]+)\]\](?:\S+(.+))?$/ : stryMutAct_9fa48("25436") ? /^- \[.\]\s+\[\[([^\]]+)\]\](?:\s(.+))?$/ : stryMutAct_9fa48("25435") ? /^- \[.\]\s+\[\[([^\]]+)\]\](?:\s+(.+))$/ : stryMutAct_9fa48("25434") ? /^- \[.\]\s+\[\[([\]]+)\]\](?:\s+(.+))?$/ : stryMutAct_9fa48("25433") ? /^- \[.\]\s+\[\[([^\]])\]\](?:\s+(.+))?$/ : stryMutAct_9fa48("25432") ? /^- \[.\]\S+\[\[([^\]]+)\]\](?:\s+(.+))?$/ : stryMutAct_9fa48("25431") ? /^- \[.\]\s\[\[([^\]]+)\]\](?:\s+(.+))?$/ : stryMutAct_9fa48("25430") ? /^- \[.\]\s+\[\[([^\]]+)\]\](?:\s+(.+))?/ : stryMutAct_9fa48("25429") ? /- \[.\]\s+\[\[([^\]]+)\]\](?:\s+(.+))?$/ : (stryCov_9fa48("25429", "25430", "25431", "25432", "25433", "25434", "25435", "25436", "25437", "25438"), /^- \[.\]\s+\[\[([^\]]+)\]\](?:\s+(.+))?$/));
        if (stryMutAct_9fa48("25441") ? current || itemMatch : stryMutAct_9fa48("25440") ? false : stryMutAct_9fa48("25439") ? true : (stryCov_9fa48("25439", "25440", "25441"), current && itemMatch)) {
          if (stryMutAct_9fa48("25442")) {
            {}
          } else {
            stryCov_9fa48("25442");
            const rawTarget = itemMatch[1];
            if (stryMutAct_9fa48("25445") ? typeof rawTarget !== "string" && rawTarget.trim().length === 0 : stryMutAct_9fa48("25444") ? false : stryMutAct_9fa48("25443") ? true : (stryCov_9fa48("25443", "25444", "25445"), (stryMutAct_9fa48("25447") ? typeof rawTarget === "string" : stryMutAct_9fa48("25446") ? false : (stryCov_9fa48("25446", "25447"), typeof rawTarget !== (stryMutAct_9fa48("25448") ? "" : (stryCov_9fa48("25448"), "string")))) || (stryMutAct_9fa48("25450") ? rawTarget.trim().length !== 0 : stryMutAct_9fa48("25449") ? false : (stryCov_9fa48("25449", "25450"), (stryMutAct_9fa48("25451") ? rawTarget.length : (stryCov_9fa48("25451"), rawTarget.trim().length)) === 0)))) {
              if (stryMutAct_9fa48("25452")) {
                {}
              } else {
                stryCov_9fa48("25452");
                continue;
              }
            }
            const {
              slug,
              title
            } = parseWikiTarget(rawTarget);
            if (stryMutAct_9fa48("25455") ? slug.length !== 0 : stryMutAct_9fa48("25454") ? false : stryMutAct_9fa48("25453") ? true : (stryCov_9fa48("25453", "25454", "25455"), slug.length === 0)) {
              if (stryMutAct_9fa48("25456")) {
                {}
              } else {
                stryCov_9fa48("25456");
                continue;
              }
            }
            const wikilink = stryMutAct_9fa48("25457") ? `` : (stryCov_9fa48("25457"), `[[${rawTarget}]]`);
            const filepath = path.join(TASKS_DIR, (stryMutAct_9fa48("25458") ? slug.startsWith(".md") : (stryCov_9fa48("25458"), slug.endsWith(stryMutAct_9fa48("25459") ? "" : (stryCov_9fa48("25459"), ".md")))) ? slug : stryMutAct_9fa48("25460") ? `` : (stryCov_9fa48("25460"), `${slug}.md`));
            const meta = await readTask(filepath);
            const pts = stryMutAct_9fa48("25461") ? (meta.points ?? extractPointsFromTitle(title)) && 1 : (stryCov_9fa48("25461"), (stryMutAct_9fa48("25462") ? meta.points && extractPointsFromTitle(title) : (stryCov_9fa48("25462"), meta.points ?? extractPointsFromTitle(title))) ?? 1);
            current.cards.push(stryMutAct_9fa48("25463") ? {} : (stryCov_9fa48("25463"), {
              title,
              wikilink,
              filepath,
              points: pts,
              tags: stryMutAct_9fa48("25464") ? meta.tags && [] : (stryCov_9fa48("25464"), meta.tags ?? (stryMutAct_9fa48("25465") ? ["Stryker was here"] : (stryCov_9fa48("25465"), []))),
              origin: meta.origin,
              mtimeMs: meta.mtimeMs
            }));
          }
        }
      }
    }
    if (stryMutAct_9fa48("25467") ? false : stryMutAct_9fa48("25466") ? true : (stryCov_9fa48("25466", "25467"), current)) lanes.push(current);
    return lanes;
  }
}
function laneUsage(l: Lane): number {
  if (stryMutAct_9fa48("25468")) {
    {}
  } else {
    stryCov_9fa48("25468");
    return (stryMutAct_9fa48("25471") ? BASIS !== "points" : stryMutAct_9fa48("25470") ? false : stryMutAct_9fa48("25469") ? true : (stryCov_9fa48("25469", "25470", "25471"), BASIS === (stryMutAct_9fa48("25472") ? "" : (stryCov_9fa48("25472"), "points")))) ? l.cards.reduce(stryMutAct_9fa48("25473") ? () => undefined : (stryCov_9fa48("25473"), (a, c) => stryMutAct_9fa48("25474") ? a - (c.points || 1) : (stryCov_9fa48("25474"), a + (stryMutAct_9fa48("25477") ? c.points && 1 : stryMutAct_9fa48("25476") ? false : stryMutAct_9fa48("25475") ? true : (stryCov_9fa48("25475", "25476", "25477"), c.points || 1)))), 0) : l.cards.length;
  }
}
function nearestSafeLeft(lanes: Board, idx: number): number {
  if (stryMutAct_9fa48("25478")) {
    {}
  } else {
    stryCov_9fa48("25478");
    for (let i = stryMutAct_9fa48("25479") ? idx + 1 : (stryCov_9fa48("25479"), idx - 1); stryMutAct_9fa48("25482") ? i < 0 : stryMutAct_9fa48("25481") ? i > 0 : stryMutAct_9fa48("25480") ? false : (stryCov_9fa48("25480", "25481", "25482"), i >= 0); stryMutAct_9fa48("25483") ? i++ : (stryCov_9fa48("25483"), i--)) {
      if (stryMutAct_9fa48("25484")) {
        {}
      } else {
        stryCov_9fa48("25484");
        const lane = lanes[i];
        if (stryMutAct_9fa48("25487") ? false : stryMutAct_9fa48("25486") ? true : stryMutAct_9fa48("25485") ? lane : (stryCov_9fa48("25485", "25486", "25487"), !lane)) continue;
        if (stryMutAct_9fa48("25490") ? lane.capacity == null && lane.title.startsWith(SAFE_LEFT) : stryMutAct_9fa48("25489") ? false : stryMutAct_9fa48("25488") ? true : (stryCov_9fa48("25488", "25489", "25490"), (stryMutAct_9fa48("25492") ? lane.capacity != null : stryMutAct_9fa48("25491") ? false : (stryCov_9fa48("25491", "25492"), lane.capacity == null)) || (stryMutAct_9fa48("25493") ? lane.title.endsWith(SAFE_LEFT) : (stryCov_9fa48("25493"), lane.title.startsWith(SAFE_LEFT))))) return i;
      }
    }
    if (stryMutAct_9fa48("25496") ? lanes.length !== 0 : stryMutAct_9fa48("25495") ? false : stryMutAct_9fa48("25494") ? true : (stryCov_9fa48("25494", "25495", "25496"), lanes.length === 0)) {
      if (stryMutAct_9fa48("25497")) {
        {}
      } else {
        stryCov_9fa48("25497");
        return 0;
      }
    }
    const fallback = stryMutAct_9fa48("25498") ? Math.min(0, idx - 1) : (stryCov_9fa48("25498"), Math.max(0, stryMutAct_9fa48("25499") ? idx + 1 : (stryCov_9fa48("25499"), idx - 1)));
    return stryMutAct_9fa48("25500") ? Math.max(fallback, lanes.length - 1) : (stryCov_9fa48("25500"), Math.min(fallback, stryMutAct_9fa48("25501") ? lanes.length + 1 : (stryCov_9fa48("25501"), lanes.length - 1)));
  }
}
function pickVictims(l: Lane, need: number): Card[] {
  if (stryMutAct_9fa48("25502")) {
    {}
  } else {
    stryCov_9fa48("25502");
    const key = stryMutAct_9fa48("25503") ? () => undefined : (stryCov_9fa48("25503"), (() => {
      const key = (c: Card) => [c.mtimeMs ?? Number.POSITIVE_INFINITY,
      // younger first
      c.origin?.startsWith("bot/") ? 0 : 1,
      // bot first
      c.points || 1 // low points first
      ] as const;
      return key;
    })());
    const sorted = stryMutAct_9fa48("25504") ? [...l.cards] : (stryCov_9fa48("25504"), (stryMutAct_9fa48("25505") ? [] : (stryCov_9fa48("25505"), [...l.cards])).sort((a, b) => {
      if (stryMutAct_9fa48("25506")) {
        {}
      } else {
        stryCov_9fa48("25506");
        const ka = key(a),
          kb = key(b);
        return stryMutAct_9fa48("25509") ? (ka[0] - kb[0] || ka[1] - kb[1]) && ka[2] - kb[2] : stryMutAct_9fa48("25508") ? false : stryMutAct_9fa48("25507") ? true : (stryCov_9fa48("25507", "25508", "25509"), (stryMutAct_9fa48("25511") ? ka[0] - kb[0] && ka[1] - kb[1] : stryMutAct_9fa48("25510") ? false : (stryCov_9fa48("25510", "25511"), (stryMutAct_9fa48("25512") ? ka[0] + kb[0] : (stryCov_9fa48("25512"), ka[0] - kb[0])) || (stryMutAct_9fa48("25513") ? ka[1] + kb[1] : (stryCov_9fa48("25513"), ka[1] - kb[1])))) || (stryMutAct_9fa48("25514") ? ka[2] + kb[2] : (stryCov_9fa48("25514"), ka[2] - kb[2])));
      }
    }));
    const take = [] as Card[];
    let acc = 0;
    for (const c of sorted) {
      if (stryMutAct_9fa48("25515")) {
        {}
      } else {
        stryCov_9fa48("25515");
        take.push(c);
        stryMutAct_9fa48("25516") ? acc -= BASIS === "points" ? c.points || 1 : 1 : (stryCov_9fa48("25516"), acc += (stryMutAct_9fa48("25519") ? BASIS !== "points" : stryMutAct_9fa48("25518") ? false : stryMutAct_9fa48("25517") ? true : (stryCov_9fa48("25517", "25518", "25519"), BASIS === (stryMutAct_9fa48("25520") ? "" : (stryCov_9fa48("25520"), "points")))) ? stryMutAct_9fa48("25523") ? c.points && 1 : stryMutAct_9fa48("25522") ? false : stryMutAct_9fa48("25521") ? true : (stryCov_9fa48("25521", "25522", "25523"), c.points || 1) : 1);
        if (stryMutAct_9fa48("25527") ? acc < need : stryMutAct_9fa48("25526") ? acc > need : stryMutAct_9fa48("25525") ? false : stryMutAct_9fa48("25524") ? true : (stryCov_9fa48("25524", "25525", "25526", "25527"), acc >= need)) break;
      }
    }
    return take;
  }
}

// When writing, round-trip preamble and footer
function renderBoard(lanes: Board, preamble: string, footer: string): string {
  if (stryMutAct_9fa48("25528")) {
    {}
  } else {
    stryCov_9fa48("25528");
    const out: string[] = stryMutAct_9fa48("25529") ? ["Stryker was here"] : (stryCov_9fa48("25529"), []);
    if (stryMutAct_9fa48("25531") ? false : stryMutAct_9fa48("25530") ? true : (stryCov_9fa48("25530", "25531"), preamble)) out.push(stryMutAct_9fa48("25532") ? preamble.trimStart() : (stryCov_9fa48("25532"), preamble.trimEnd()));
    for (const l of lanes) {
      if (stryMutAct_9fa48("25533")) {
        {}
      } else {
        stryCov_9fa48("25533");
        out.push(stryMutAct_9fa48("25534") ? `` : (stryCov_9fa48("25534"), `\n## ${l.title}`));
        for (const c of l.cards) {
          if (stryMutAct_9fa48("25535")) {
            {}
          } else {
            stryCov_9fa48("25535");
            const wl = stryMutAct_9fa48("25536") ? c.wikilink && `[[${c.title}]]` : (stryCov_9fa48("25536"), c.wikilink ?? (stryMutAct_9fa48("25537") ? `` : (stryCov_9fa48("25537"), `[[${c.title}]]`)));
            const tagStr = (stryMutAct_9fa48("25540") ? c.tags && [] : stryMutAct_9fa48("25539") ? false : stryMutAct_9fa48("25538") ? true : (stryCov_9fa48("25538", "25539", "25540"), c.tags || (stryMutAct_9fa48("25541") ? ["Stryker was here"] : (stryCov_9fa48("25541"), [])))).join(stryMutAct_9fa48("25542") ? "" : (stryCov_9fa48("25542"), " "));
            out.push(stryMutAct_9fa48("25543") ? `` : (stryCov_9fa48("25543"), `- [ ] ${wl}${tagStr ? (stryMutAct_9fa48("25544") ? "" : (stryCov_9fa48("25544"), " ")) + tagStr : stryMutAct_9fa48("25545") ? "Stryker was here!" : (stryCov_9fa48("25545"), "")}`));
          }
        }
      }
    }
    const body = (stryMutAct_9fa48("25546") ? out.join("\n").replace(/\n{3,}/g, "\n\n").trimStart() : (stryCov_9fa48("25546"), out.join(stryMutAct_9fa48("25547") ? "" : (stryCov_9fa48("25547"), "\n")).replace(stryMutAct_9fa48("25548") ? /\n/g : (stryCov_9fa48("25548"), /\n{3,}/g), stryMutAct_9fa48("25549") ? "" : (stryCov_9fa48("25549"), "\n\n")).trimEnd())) + (stryMutAct_9fa48("25550") ? "" : (stryCov_9fa48("25550"), "\n"));
    return footer ? stryMutAct_9fa48("25551") ? body + (body.endsWith("\n") ? "" : "\n") - footer : (stryCov_9fa48("25551"), (stryMutAct_9fa48("25552") ? body - (body.endsWith("\n") ? "" : "\n") : (stryCov_9fa48("25552"), body + ((stryMutAct_9fa48("25553") ? body.startsWith("\n") : (stryCov_9fa48("25553"), body.endsWith(stryMutAct_9fa48("25554") ? "" : (stryCov_9fa48("25554"), "\n")))) ? stryMutAct_9fa48("25555") ? "Stryker was here!" : (stryCov_9fa48("25555"), "") : stryMutAct_9fa48("25556") ? "" : (stryCov_9fa48("25556"), "\n")))) + footer) : body;
  }
}
(async function main() {
  if (stryMutAct_9fa48("25557")) {
    {}
  } else {
    stryCov_9fa48("25557");
    const raw = await fs.readFile(BOARD_PATH, stryMutAct_9fa48("25558") ? "" : (stryCov_9fa48("25558"), "utf8"));

    // NEW: split footer so parsing ignores the settings block
    const {
      content,
      footer
    } = splitKanbanSettings(raw);

    // (optional) preserve preamble (anything before first "## ")
    const {
      preamble,
      body
    } = extractPreamble(content);

    // Parse lanes from body only
    const lanes = await parseBoard(body);
    const laneIndex = new Map(lanes.map(stryMutAct_9fa48("25559") ? () => undefined : (stryCov_9fa48("25559"), (l, i) => stryMutAct_9fa48("25560") ? [] : (stryCov_9fa48("25560"), [laneName(l.title), i]))));
    const doingIdxs = stryMutAct_9fa48("25561") ? DOING.map(name => laneIndex.get(laneName(name))) : (stryCov_9fa48("25561"), DOING.map(stryMutAct_9fa48("25562") ? () => undefined : (stryCov_9fa48("25562"), name => laneIndex.get(laneName(name)))).filter(stryMutAct_9fa48("25563") ? () => undefined : (stryCov_9fa48("25563"), (i): i is number => stryMutAct_9fa48("25566") ? i == null : stryMutAct_9fa48("25565") ? false : stryMutAct_9fa48("25564") ? true : (stryCov_9fa48("25564", "25565", "25566"), i != null))));

    // Log lane usage and rebalance if over capacity
    for (const [i, lane] of lanes.entries()) {
      if (stryMutAct_9fa48("25567")) {
        {}
      } else {
        stryCov_9fa48("25567");
        const usage = laneUsage(lane);
        const cap = stryMutAct_9fa48("25568") ? lane.capacity && null : (stryCov_9fa48("25568"), lane.capacity ?? null);
        console.log(stryMutAct_9fa48("25569") ? `` : (stryCov_9fa48("25569"), `${lane.title}: ${usage}${(stryMutAct_9fa48("25572") ? cap == null : stryMutAct_9fa48("25571") ? false : stryMutAct_9fa48("25570") ? true : (stryCov_9fa48("25570", "25571", "25572"), cap != null)) ? (stryMutAct_9fa48("25573") ? "" : (stryCov_9fa48("25573"), "/")) + cap : stryMutAct_9fa48("25574") ? "Stryker was here!" : (stryCov_9fa48("25574"), "")}`));
        if (stryMutAct_9fa48("25576") ? false : stryMutAct_9fa48("25575") ? true : (stryCov_9fa48("25575", "25576"), doingIdxs.includes(i))) {
          if (stryMutAct_9fa48("25577")) {
            {}
          } else {
            stryCov_9fa48("25577");
            const effCap = stryMutAct_9fa48("25578") ? cap && DEFAULT_CAP : (stryCov_9fa48("25578"), cap ?? DEFAULT_CAP);
            if (stryMutAct_9fa48("25581") ? effCap != null || usage > effCap : stryMutAct_9fa48("25580") ? false : stryMutAct_9fa48("25579") ? true : (stryCov_9fa48("25579", "25580", "25581"), (stryMutAct_9fa48("25583") ? effCap == null : stryMutAct_9fa48("25582") ? true : (stryCov_9fa48("25582", "25583"), effCap != null)) && (stryMutAct_9fa48("25586") ? usage <= effCap : stryMutAct_9fa48("25585") ? usage >= effCap : stryMutAct_9fa48("25584") ? true : (stryCov_9fa48("25584", "25585", "25586"), usage > effCap)))) {
              if (stryMutAct_9fa48("25587")) {
                {}
              } else {
                stryCov_9fa48("25587");
                const need = stryMutAct_9fa48("25588") ? usage + effCap : (stryCov_9fa48("25588"), usage - effCap);
                const victims = pickVictims(lane, need);
                const destIdx = nearestSafeLeft(lanes, i);
                const destLane = lanes[destIdx];
                if (stryMutAct_9fa48("25591") ? false : stryMutAct_9fa48("25590") ? true : stryMutAct_9fa48("25589") ? destLane : (stryCov_9fa48("25589", "25590", "25591"), !destLane)) {
                  if (stryMutAct_9fa48("25592")) {
                    {}
                  } else {
                    stryCov_9fa48("25592");
                    continue;
                  }
                }
                lane.cards = stryMutAct_9fa48("25593") ? lane.cards : (stryCov_9fa48("25593"), lane.cards.filter(stryMutAct_9fa48("25594") ? () => undefined : (stryCov_9fa48("25594"), c => stryMutAct_9fa48("25595") ? victims.includes(c) : (stryCov_9fa48("25595"), !victims.includes(c)))));
                destLane.cards.unshift(...victims);
                for (const v of victims) {
                  if (stryMutAct_9fa48("25596")) {
                    {}
                  } else {
                    stryCov_9fa48("25596");
                    console.log(stryMutAct_9fa48("25597") ? `` : (stryCov_9fa48("25597"), `moving "${v.title}" from ${lane.title} -> ${destLane.title}`));
                  }
                }
              }
            }
          }
        }
      }
    }
    const rendered = renderBoard(lanes, preamble, footer);
    if (stryMutAct_9fa48("25599") ? false : stryMutAct_9fa48("25598") ? true : (stryCov_9fa48("25598", "25599"), WRITE)) {
      if (stryMutAct_9fa48("25600")) {
        {}
      } else {
        stryCov_9fa48("25600");
        await fs.writeFile(BOARD_PATH, rendered);
      }
    }
    if (stryMutAct_9fa48("25602") ? false : stryMutAct_9fa48("25601") ? true : (stryCov_9fa48("25601", "25602"), DRY_RUN)) {
      if (stryMutAct_9fa48("25603")) {
        {}
      } else {
        stryCov_9fa48("25603");
        console.log(rendered);
      }
    }
  }
})();