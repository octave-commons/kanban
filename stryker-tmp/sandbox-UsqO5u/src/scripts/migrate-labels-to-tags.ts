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
import fs from 'node:fs/promises';
import { globby } from 'globby';
import { parseFrontmatter, stringifyFrontmatter, normalizeStringList } from '@promethean-os/markdown/frontmatter';

/**
 * Migration: labels -> tags (Obsidian-compatible)
 * ------------------------------------------------
 * - Parses YAML frontmatter with gray-matter (no regex rewrites).
 * - Merges any legacy `labels` into `tags`.
 * - Ensures frontmatter key is strictly `tags` (lowercase).
 * - Removes `labels` entirely.
 * - Dedupes, trims, lowercases values; strips leading `#`.
 * - Leaves body untouched.
 *
 * Recovery: if YAML is malformed, we try a tiny, targeted sanitizer once to
 * remove obvious artefacts produced by earlier regex attempts (e.g. `string[];`).
 * If it still fails, we log and skip so a human can review.
 */

type AnyRec = Record<string, unknown>;
const TASK_GLOBS = stryMutAct_9fa48("25054") ? [] : (stryCov_9fa48("25054"), [stryMutAct_9fa48("25055") ? "" : (stryCov_9fa48("25055"), 'docs/agile/tasks/**/*.md'), stryMutAct_9fa48("25056") ? "" : (stryCov_9fa48("25056"), 'docs/inbox/**/*.md')]);
const sanitizeOnce = (raw: string): string => {
  if (stryMutAct_9fa48("25057")) {
    {}
  } else {
    stryCov_9fa48("25057");
    // Only minimal, known-bad token cleanup from previous migration attempts.
    return raw.replace(stryMutAct_9fa48("25058") ? /string\[\];/g : (stryCov_9fa48("25058"), /string\[\];?/g), stryMutAct_9fa48("25059") ? "Stryker was here!" : (stryCov_9fa48("25059"), '')).replace(stryMutAct_9fa48("25061") ? /;\S*,/g : stryMutAct_9fa48("25060") ? /;\s,/g : (stryCov_9fa48("25060", "25061"), /;\s*,/g), stryMutAct_9fa48("25062") ? "" : (stryCov_9fa48("25062"), ', ')).replace(/\|\]/g, stryMutAct_9fa48("25063") ? "" : (stryCov_9fa48("25063"), ']')).replace(stryMutAct_9fa48("25065") ? /,\S*tags\]/gi : stryMutAct_9fa48("25064") ? /,\stags\]/gi : (stryCov_9fa48("25064", "25065"), /,\s*tags\]/gi), stryMutAct_9fa48("25066") ? "" : (stryCov_9fa48("25066"), ']')).replace(stryMutAct_9fa48("25068") ? /tags,\S*tags/gi : stryMutAct_9fa48("25067") ? /tags,\stags/gi : (stryCov_9fa48("25067", "25068"), /tags,\s*tags/gi), stryMutAct_9fa48("25069") ? "" : (stryCov_9fa48("25069"), 'tags'))
    // Remove inline backticks in title
    .replace(stryMutAct_9fa48("25076") ? /^title:\s*`([^`]+)`(.)$/m : stryMutAct_9fa48("25075") ? /^title:\s*`([`]+)`(.*)$/m : stryMutAct_9fa48("25074") ? /^title:\s*`([^`])`(.*)$/m : stryMutAct_9fa48("25073") ? /^title:\S*`([^`]+)`(.*)$/m : stryMutAct_9fa48("25072") ? /^title:\s`([^`]+)`(.*)$/m : stryMutAct_9fa48("25071") ? /^title:\s*`([^`]+)`(.*)/m : stryMutAct_9fa48("25070") ? /title:\s*`([^`]+)`(.*)$/m : (stryCov_9fa48("25070", "25071", "25072", "25073", "25074", "25075", "25076"), /^title:\s*`([^`]+)`(.*)$/m), stryMutAct_9fa48("25077") ? "" : (stryCov_9fa48("25077"), 'title: $1$2'))
    // Quote titles containing unicode dashes if unquoted
    .replace(stryMutAct_9fa48("25084") ? /^title:\s*([^'"].*—.)$/m : stryMutAct_9fa48("25083") ? /^title:\s*([^'"].—.*)$/m : stryMutAct_9fa48("25082") ? /^title:\s*(['"].*—.*)$/m : stryMutAct_9fa48("25081") ? /^title:\S*([^'"].*—.*)$/m : stryMutAct_9fa48("25080") ? /^title:\s([^'"].*—.*)$/m : stryMutAct_9fa48("25079") ? /^title:\s*([^'"].*—.*)/m : stryMutAct_9fa48("25078") ? /title:\s*([^'"].*—.*)$/m : (stryCov_9fa48("25078", "25079", "25080", "25081", "25082", "25083", "25084"), /^title:\s*([^'"].*—.*)$/m), stryMutAct_9fa48("25085") ? "" : (stryCov_9fa48("25085"), "title: '$1'"))
    // Merge split tag arrays on one line
    .replace(stryMutAct_9fa48("25094") ? /^(tags:\s*\[[^\]]+?)\],\s*\[([\]]+\])/m : stryMutAct_9fa48("25093") ? /^(tags:\s*\[[^\]]+?)\],\s*\[([^\]]\])/m : stryMutAct_9fa48("25092") ? /^(tags:\s*\[[^\]]+?)\],\S*\[([^\]]+\])/m : stryMutAct_9fa48("25091") ? /^(tags:\s*\[[^\]]+?)\],\s\[([^\]]+\])/m : stryMutAct_9fa48("25090") ? /^(tags:\s*\[[\]]+?)\],\s*\[([^\]]+\])/m : stryMutAct_9fa48("25089") ? /^(tags:\s*\[[^\]])\],\s*\[([^\]]+\])/m : stryMutAct_9fa48("25088") ? /^(tags:\S*\[[^\]]+?)\],\s*\[([^\]]+\])/m : stryMutAct_9fa48("25087") ? /^(tags:\s\[[^\]]+?)\],\s*\[([^\]]+\])/m : stryMutAct_9fa48("25086") ? /(tags:\s*\[[^\]]+?)\],\s*\[([^\]]+\])/m : (stryCov_9fa48("25086", "25087", "25088", "25089", "25090", "25091", "25092", "25093", "25094"), /^(tags:\s*\[[^\]]+?)\],\s*\[([^\]]+\])/m), stryMutAct_9fa48("25095") ? "" : (stryCov_9fa48("25095"), '$1, $2'));
  }
};
const coerceStringArray = (val: unknown): string[] => {
  if (stryMutAct_9fa48("25096")) {
    {}
  } else {
    stryCov_9fa48("25096");
    if (stryMutAct_9fa48("25099") ? false : stryMutAct_9fa48("25098") ? true : stryMutAct_9fa48("25097") ? val : (stryCov_9fa48("25097", "25098", "25099"), !val)) return stryMutAct_9fa48("25100") ? ["Stryker was here"] : (stryCov_9fa48("25100"), []);
    if (stryMutAct_9fa48("25102") ? false : stryMutAct_9fa48("25101") ? true : (stryCov_9fa48("25101", "25102"), Array.isArray(val))) return normalizeStringList(val).map(String);
    if (stryMutAct_9fa48("25105") ? typeof val !== 'string' : stryMutAct_9fa48("25104") ? false : stryMutAct_9fa48("25103") ? true : (stryCov_9fa48("25103", "25104", "25105"), typeof val === (stryMutAct_9fa48("25106") ? "" : (stryCov_9fa48("25106"), 'string')))) {
      if (stryMutAct_9fa48("25107")) {
        {}
      } else {
        stryCov_9fa48("25107");
        // common cases: comma/space separated
        const parts = val.split(stryMutAct_9fa48("25108") ? /[^\n,]/g : (stryCov_9fa48("25108"), /[\n,]/g)).flatMap(stryMutAct_9fa48("25109") ? () => undefined : (stryCov_9fa48("25109"), s => s.split(stryMutAct_9fa48("25111") ? /\S+/g : stryMutAct_9fa48("25110") ? /\s/g : (stryCov_9fa48("25110", "25111"), /\s+/g))));
        return normalizeStringList(parts);
      }
    }
    return stryMutAct_9fa48("25112") ? ["Stryker was here"] : (stryCov_9fa48("25112"), []);
  }
};
const normalizeTag = stryMutAct_9fa48("25113") ? () => undefined : (stryCov_9fa48("25113"), (() => {
  const normalizeTag = (t: string) => stryMutAct_9fa48("25115") ? t.replace(/^#/, '').toLowerCase() : stryMutAct_9fa48("25114") ? t.replace(/^#/, '').trim().toUpperCase() : (stryCov_9fa48("25114", "25115"), t.replace(stryMutAct_9fa48("25116") ? /#/ : (stryCov_9fa48("25116"), /^#/), stryMutAct_9fa48("25117") ? "Stryker was here!" : (stryCov_9fa48("25117"), '')).trim().toLowerCase());
  return normalizeTag;
})());
const mergeTags = (fm: AnyRec): string[] => {
  if (stryMutAct_9fa48("25118")) {
    {}
  } else {
    stryCov_9fa48("25118");
    const rawTags = coerceStringArray(fm.tags);
    const rawLabels = coerceStringArray(fm.labels);
    const merged = stryMutAct_9fa48("25119") ? Array.from(new Set([...rawTags, ...rawLabels].map(normalizeTag))) : (stryCov_9fa48("25119"), Array.from(new Set((stryMutAct_9fa48("25120") ? [] : (stryCov_9fa48("25120"), [...rawTags, ...rawLabels])).map(normalizeTag))).filter(Boolean));
    return merged;
  }
};
async function processFile(file: string): Promise<'updated' | 'skipped'> {
  if (stryMutAct_9fa48("25121")) {
    {}
  } else {
    stryCov_9fa48("25121");
    const original = await fs.readFile(file, stryMutAct_9fa48("25122") ? "" : (stryCov_9fa48("25122"), 'utf8'));
    const tryParse = (txt: string) => {
      if (stryMutAct_9fa48("25123")) {
        {}
      } else {
        stryCov_9fa48("25123");
        try {
          if (stryMutAct_9fa48("25124")) {
            {}
          } else {
            stryCov_9fa48("25124");
            return parseFrontmatter<AnyRec>(txt);
          }
        } catch (_err) {
          if (stryMutAct_9fa48("25125")) {
            {}
          } else {
            stryCov_9fa48("25125");
            return null;
          }
        }
      }
    };
    let parsed = tryParse(original);
    let usedSanitized = stryMutAct_9fa48("25126") ? true : (stryCov_9fa48("25126"), false);
    if (stryMutAct_9fa48("25129") ? false : stryMutAct_9fa48("25128") ? true : stryMutAct_9fa48("25127") ? parsed : (stryCov_9fa48("25127", "25128", "25129"), !parsed)) {
      if (stryMutAct_9fa48("25130")) {
        {}
      } else {
        stryCov_9fa48("25130");
        const sanitized = sanitizeOnce(original);
        parsed = tryParse(sanitized);
        if (stryMutAct_9fa48("25133") ? false : stryMutAct_9fa48("25132") ? true : stryMutAct_9fa48("25131") ? parsed : (stryCov_9fa48("25131", "25132", "25133"), !parsed)) {
          if (stryMutAct_9fa48("25134")) {
            {}
          } else {
            stryCov_9fa48("25134");
            console.error(stryMutAct_9fa48("25135") ? `` : (stryCov_9fa48("25135"), `Failed to parse frontmatter for ${file} (even after sanitizeOnce)`));
            return stryMutAct_9fa48("25136") ? "" : (stryCov_9fa48("25136"), 'skipped');
          }
        }
        usedSanitized = stryMutAct_9fa48("25137") ? false : (stryCov_9fa48("25137"), true);
      }
    }
    const before = stryMutAct_9fa48("25138") ? parsed.data && {} : (stryCov_9fa48("25138"), parsed.data ?? {});
    const after: AnyRec = stryMutAct_9fa48("25139") ? {} : (stryCov_9fa48("25139"), {
      ...before
    });
    const tags = mergeTags(before);

    // If nothing to do for tags/labels, we may still need to write back
    // sanitized frontmatter if we had to sanitize to parse.
    if (stryMutAct_9fa48("25142") ? "labels" in before && coerceStringArray(before.labels).length === 0 || tags.length === 0 : stryMutAct_9fa48("25141") ? false : stryMutAct_9fa48("25140") ? true : (stryCov_9fa48("25140", "25141", "25142"), (stryMutAct_9fa48("25144") ? "labels" in before || coerceStringArray(before.labels).length === 0 : stryMutAct_9fa48("25143") ? true : (stryCov_9fa48("25143", "25144"), (stryMutAct_9fa48("25145") ? "" : (stryCov_9fa48("25145"), "labels")) in before && (stryMutAct_9fa48("25147") ? coerceStringArray(before.labels).length !== 0 : stryMutAct_9fa48("25146") ? true : (stryCov_9fa48("25146", "25147"), coerceStringArray(before.labels).length === 0)))) && (stryMutAct_9fa48("25149") ? tags.length !== 0 : stryMutAct_9fa48("25148") ? true : (stryCov_9fa48("25148", "25149"), tags.length === 0)))) {
      if (stryMutAct_9fa48("25150")) {
        {}
      } else {
        stryCov_9fa48("25150");
        if (stryMutAct_9fa48("25152") ? false : stryMutAct_9fa48("25151") ? true : (stryCov_9fa48("25151", "25152"), usedSanitized)) {
          if (stryMutAct_9fa48("25153")) {
            {}
          } else {
            stryCov_9fa48("25153");
            const nextSanitized = stringifyFrontmatter(parsed.content, before);
            if (stryMutAct_9fa48("25156") ? nextSanitized === original : stryMutAct_9fa48("25155") ? false : stryMutAct_9fa48("25154") ? true : (stryCov_9fa48("25154", "25155", "25156"), nextSanitized !== original)) {
              if (stryMutAct_9fa48("25157")) {
                {}
              } else {
                stryCov_9fa48("25157");
                await fs.writeFile(file, nextSanitized, stryMutAct_9fa48("25158") ? "" : (stryCov_9fa48("25158"), 'utf8'));
                return stryMutAct_9fa48("25159") ? "" : (stryCov_9fa48("25159"), 'updated');
              }
            }
          }
        }
        return stryMutAct_9fa48("25160") ? "" : (stryCov_9fa48("25160"), 'skipped');
      }
    }

    // Write normalized tags and drop labels
    after.tags = tags;
    if (stryMutAct_9fa48("25162") ? false : stryMutAct_9fa48("25161") ? true : (stryCov_9fa48("25161", "25162"), (stryMutAct_9fa48("25163") ? "" : (stryCov_9fa48("25163"), 'labels')) in after)) delete after.labels;

    // Only write when effective change
    const sameTags = stryMutAct_9fa48("25166") ? JSON.stringify(coerceStringArray(before.tags).map(normalizeTag)) !== JSON.stringify(tags) : stryMutAct_9fa48("25165") ? false : stryMutAct_9fa48("25164") ? true : (stryCov_9fa48("25164", "25165", "25166"), JSON.stringify(coerceStringArray(before.tags).map(normalizeTag)) === JSON.stringify(tags));
    const hadLabels = (stryMutAct_9fa48("25167") ? "" : (stryCov_9fa48("25167"), 'labels')) in before;
    if (stryMutAct_9fa48("25170") ? sameTags && !hadLabels || !usedSanitized : stryMutAct_9fa48("25169") ? false : stryMutAct_9fa48("25168") ? true : (stryCov_9fa48("25168", "25169", "25170"), (stryMutAct_9fa48("25172") ? sameTags || !hadLabels : stryMutAct_9fa48("25171") ? true : (stryCov_9fa48("25171", "25172"), sameTags && (stryMutAct_9fa48("25173") ? hadLabels : (stryCov_9fa48("25173"), !hadLabels)))) && (stryMutAct_9fa48("25174") ? usedSanitized : (stryCov_9fa48("25174"), !usedSanitized)))) {
      if (stryMutAct_9fa48("25175")) {
        {}
      } else {
        stryCov_9fa48("25175");
        return stryMutAct_9fa48("25176") ? "" : (stryCov_9fa48("25176"), 'skipped');
      }
    }
    const next = stringifyFrontmatter(parsed.content, after);
    await fs.writeFile(file, next, stryMutAct_9fa48("25177") ? "" : (stryCov_9fa48("25177"), 'utf8'));
    return stryMutAct_9fa48("25178") ? "" : (stryCov_9fa48("25178"), 'updated');
  }
}
async function main() {
  if (stryMutAct_9fa48("25179")) {
    {}
  } else {
    stryCov_9fa48("25179");
    const cwd = process.cwd();
    const files = await globby(TASK_GLOBS, stryMutAct_9fa48("25180") ? {} : (stryCov_9fa48("25180"), {
      cwd,
      absolute: stryMutAct_9fa48("25181") ? false : (stryCov_9fa48("25181"), true),
      gitignore: stryMutAct_9fa48("25182") ? false : (stryCov_9fa48("25182"), true)
    }));
    let updated = 0;
    let skipped = 0;
    for (const file of files) {
      if (stryMutAct_9fa48("25183")) {
        {}
      } else {
        stryCov_9fa48("25183");
        const res = await processFile(file);
        if (stryMutAct_9fa48("25186") ? res !== 'updated' : stryMutAct_9fa48("25185") ? false : stryMutAct_9fa48("25184") ? true : (stryCov_9fa48("25184", "25185", "25186"), res === (stryMutAct_9fa48("25187") ? "" : (stryCov_9fa48("25187"), 'updated')))) stryMutAct_9fa48("25188") ? updated-- : (stryCov_9fa48("25188"), updated++);else stryMutAct_9fa48("25189") ? skipped-- : (stryCov_9fa48("25189"), skipped++);
      }
    }
    console.log(stryMutAct_9fa48("25190") ? `` : (stryCov_9fa48("25190"), `migrate-labels-to-tags ✔ updated ${updated} files; skipped ${skipped}`));
  }
}
main().catch(_err => {
  if (stryMutAct_9fa48("25191")) {
    {}
  } else {
    stryCov_9fa48("25191");
    console.error(stryMutAct_9fa48("25192") ? "" : (stryCov_9fa48("25192"), 'migrate-labels-to-tags ❌ failed:'), _err);
    process.exitCode = 1;
  }
});