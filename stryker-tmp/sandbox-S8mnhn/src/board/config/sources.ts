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
import { access } from 'node:fs/promises';
import path from 'node:path';
import { ARG_KEYS, CONFIG_SEARCH_PATHS, DEFAULT_CONFIG_BASENAME, ENV_KEYS, MARKERS, arrayHasKey, parseList, resolveWithBase, type EnvArgKey, type OverrideMap } from './shared.js';
const pathExists = stryMutAct_9fa48("574") ? () => undefined : (stryCov_9fa48("574"), (() => {
  const pathExists = (target: string): Promise<boolean> => access(target).then(stryMutAct_9fa48("575") ? () => undefined : (stryCov_9fa48("575"), () => stryMutAct_9fa48("576") ? false : (stryCov_9fa48("576"), true)), stryMutAct_9fa48("577") ? () => undefined : (stryCov_9fa48("577"), () => stryMutAct_9fa48("578") ? true : (stryCov_9fa48("578"), false)));
  return pathExists;
})());
type PreferredMarker = Readonly<{
  readonly dir: string;
  readonly marker: '.git' | 'pnpm-workspace.yaml';
}>;
const findMarkers = async (dir: string): Promise<ReadonlyArray<string>> => {
  if (stryMutAct_9fa48("579")) {
    {}
  } else {
    stryCov_9fa48("579");
    const matches = await Promise.all(MARKERS.map(stryMutAct_9fa48("580") ? () => undefined : (stryCov_9fa48("580"), marker => pathExists(path.join(dir, marker)))));
    return stryMutAct_9fa48("581") ? MARKERS : (stryCov_9fa48("581"), MARKERS.filter(stryMutAct_9fa48("582") ? () => undefined : (stryCov_9fa48("582"), (marker, index) => Boolean(stryMutAct_9fa48("585") ? matches[index] || marker.length > 0 : stryMutAct_9fa48("584") ? false : stryMutAct_9fa48("583") ? true : (stryCov_9fa48("583", "584", "585"), matches[index] && (stryMutAct_9fa48("588") ? marker.length <= 0 : stryMutAct_9fa48("587") ? marker.length >= 0 : stryMutAct_9fa48("586") ? true : (stryCov_9fa48("586", "587", "588"), marker.length > 0)))))));
  }
};
const selectPreferred = (current: string, found: ReadonlyArray<string>, previous: PreferredMarker | undefined): PreferredMarker | undefined => {
  if (stryMutAct_9fa48("589")) {
    {}
  } else {
    stryCov_9fa48("589");
    if (stryMutAct_9fa48("591") ? false : stryMutAct_9fa48("590") ? true : (stryCov_9fa48("590", "591"), found.includes(stryMutAct_9fa48("592") ? "" : (stryCov_9fa48("592"), 'pnpm-workspace.yaml')))) {
      if (stryMutAct_9fa48("593")) {
        {}
      } else {
        stryCov_9fa48("593");
        return stryMutAct_9fa48("594") ? {} : (stryCov_9fa48("594"), {
          dir: current,
          marker: stryMutAct_9fa48("595") ? "" : (stryCov_9fa48("595"), 'pnpm-workspace.yaml')
        });
      }
    }
    if (stryMutAct_9fa48("598") ? found.includes('.git') || previous?.marker !== 'pnpm-workspace.yaml' : stryMutAct_9fa48("597") ? false : stryMutAct_9fa48("596") ? true : (stryCov_9fa48("596", "597", "598"), found.includes(stryMutAct_9fa48("599") ? "" : (stryCov_9fa48("599"), '.git')) && (stryMutAct_9fa48("601") ? previous?.marker === 'pnpm-workspace.yaml' : stryMutAct_9fa48("600") ? true : (stryCov_9fa48("600", "601"), (stryMutAct_9fa48("602") ? previous.marker : (stryCov_9fa48("602"), previous?.marker)) !== (stryMutAct_9fa48("603") ? "" : (stryCov_9fa48("603"), 'pnpm-workspace.yaml')))))) {
      if (stryMutAct_9fa48("604")) {
        {}
      } else {
        stryCov_9fa48("604");
        return stryMutAct_9fa48("605") ? {} : (stryCov_9fa48("605"), {
          dir: current,
          marker: stryMutAct_9fa48("606") ? "" : (stryCov_9fa48("606"), '.git')
        });
      }
    }
    return previous;
  }
};
const selectFallback = stryMutAct_9fa48("607") ? () => undefined : (stryCov_9fa48("607"), (() => {
  const selectFallback = (current: string, found: ReadonlyArray<string>, fallback: string | undefined): string | undefined => (stryMutAct_9fa48("610") ? typeof fallback === 'undefined' || found.includes('package.json') : stryMutAct_9fa48("609") ? false : stryMutAct_9fa48("608") ? true : (stryCov_9fa48("608", "609", "610"), (stryMutAct_9fa48("612") ? typeof fallback !== 'undefined' : stryMutAct_9fa48("611") ? true : (stryCov_9fa48("611", "612"), typeof fallback === (stryMutAct_9fa48("613") ? "" : (stryCov_9fa48("613"), 'undefined')))) && found.includes(stryMutAct_9fa48("614") ? "" : (stryCov_9fa48("614"), 'package.json')))) ? current : fallback;
  return selectFallback;
})());
const detectRepoRoot = (start: string, preferred?: PreferredMarker, fallback?: string): Promise<string> => {
  if (stryMutAct_9fa48("615")) {
    {}
  } else {
    stryCov_9fa48("615");
    const current = path.resolve(start);
    return findMarkers(current).then(found => {
      if (stryMutAct_9fa48("616")) {
        {}
      } else {
        stryCov_9fa48("616");
        const nextPreferred = selectPreferred(current, found, preferred);
        const nextFallback = selectFallback(current, found, fallback);
        const parent = path.dirname(current);
        return (stryMutAct_9fa48("619") ? parent !== current : stryMutAct_9fa48("618") ? false : stryMutAct_9fa48("617") ? true : (stryCov_9fa48("617", "618", "619"), parent === current)) ? stryMutAct_9fa48("620") ? (nextPreferred?.dir ?? nextFallback) && current : (stryCov_9fa48("620"), (stryMutAct_9fa48("621") ? nextPreferred?.dir && nextFallback : (stryCov_9fa48("621"), (stryMutAct_9fa48("622") ? nextPreferred.dir : (stryCov_9fa48("622"), nextPreferred?.dir)) ?? nextFallback)) ?? current) : detectRepoRoot(parent, nextPreferred, nextFallback);
      }
    });
  }
};
const envKeys = Object.keys(ENV_KEYS) as ReadonlyArray<EnvArgKey>;
const EMPTY_STRINGS = Object.freeze<string[]>(stryMutAct_9fa48("623") ? ["Stryker was here"] : (stryCov_9fa48("623"), []));
const EMPTY_OVERRIDES: OverrideMap = Object.freeze({});
const freezeStrings = (values: ReadonlyArray<string>): ReadonlyArray<string> => {
  if (stryMutAct_9fa48("624")) {
    {}
  } else {
    stryCov_9fa48("624");
    if (stryMutAct_9fa48("627") ? values.length !== 0 : stryMutAct_9fa48("626") ? false : stryMutAct_9fa48("625") ? true : (stryCov_9fa48("625", "626", "627"), values.length === 0)) {
      if (stryMutAct_9fa48("628")) {
        {}
      } else {
        stryCov_9fa48("628");
        return EMPTY_STRINGS;
      }
    }
    const copy: ReadonlyArray<string> = Object.freeze(stryMutAct_9fa48("629") ? [] : (stryCov_9fa48("629"), [...values]));
    return copy;
  }
};
const mergeOverride = (current: OverrideMap, key: EnvArgKey, value: string | ReadonlyArray<string>): OverrideMap => {
  if (stryMutAct_9fa48("630")) {
    {}
  } else {
    stryCov_9fa48("630");
    const next: OverrideMap = Object.freeze(stryMutAct_9fa48("631") ? {} : (stryCov_9fa48("631"), {
      ...current,
      [key]: value
    }));
    return next;
  }
};
type ParseResult = Readonly<{
  readonly values: OverrideMap;
  readonly rest: ReadonlyArray<string>;
}>;
const appendRest = stryMutAct_9fa48("632") ? () => undefined : (stryCov_9fa48("632"), (() => {
  const appendRest = (token: string, parsed: ParseResult): ParseResult => stryMutAct_9fa48("633") ? {} : (stryCov_9fa48("633"), {
    values: parsed.values,
    rest: freezeStrings(stryMutAct_9fa48("634") ? [] : (stryCov_9fa48("634"), [token, ...parsed.rest]))
  });
  return appendRest;
})());
const mergeArgValue = stryMutAct_9fa48("635") ? () => undefined : (stryCov_9fa48("635"), (() => {
  const mergeArgValue = (key: EnvArgKey, value: string | ReadonlyArray<string>, parsed: ParseResult): ParseResult => stryMutAct_9fa48("636") ? {} : (stryCov_9fa48("636"), {
    values: mergeOverride(parsed.values, key, value),
    rest: parsed.rest
  });
  return mergeArgValue;
})());
const parseInlineValue = (key: EnvArgKey, inline: string, tail: ReadonlyArray<string>): ParseResult => {
  if (stryMutAct_9fa48("637")) {
    {}
  } else {
    stryCov_9fa48("637");
    const parsedTail = parseArgv(tail);
    const normalized = arrayHasKey(key) ? parseList(inline) : inline;
    return mergeArgValue(key, normalized, parsedTail);
  }
};
const parseValueFromTail = (key: EnvArgKey, tail: ReadonlyArray<string>): ParseResult => {
  if (stryMutAct_9fa48("638")) {
    {}
  } else {
    stryCov_9fa48("638");
    const {
      value,
      rest
    } = takeNextValue(tail);
    if (stryMutAct_9fa48("641") ? typeof value !== 'undefined' : stryMutAct_9fa48("640") ? false : stryMutAct_9fa48("639") ? true : (stryCov_9fa48("639", "640", "641"), typeof value === (stryMutAct_9fa48("642") ? "" : (stryCov_9fa48("642"), 'undefined')))) {
      if (stryMutAct_9fa48("643")) {
        {}
      } else {
        stryCov_9fa48("643");
        return parseArgv(rest);
      }
    }
    const parsedRest = parseArgv(rest);
    const normalized = arrayHasKey(key) ? parseList(value) : value;
    return mergeArgValue(key, normalized, parsedRest);
  }
};
export const parseEnvConfig = stryMutAct_9fa48("644") ? () => undefined : (stryCov_9fa48("644"), (() => {
  const parseEnvConfig = (env: Readonly<NodeJS.ProcessEnv>): OverrideMap => envKeys.reduce<OverrideMap>((acc, key) => {
    if (stryMutAct_9fa48("645")) {
      {}
    } else {
      stryCov_9fa48("645");
      const raw = env[ENV_KEYS[key]];
      if (stryMutAct_9fa48("648") ? typeof raw !== 'undefined' : stryMutAct_9fa48("647") ? false : stryMutAct_9fa48("646") ? true : (stryCov_9fa48("646", "647", "648"), typeof raw === (stryMutAct_9fa48("649") ? "" : (stryCov_9fa48("649"), 'undefined')))) {
        if (stryMutAct_9fa48("650")) {
          {}
        } else {
          stryCov_9fa48("650");
          return acc;
        }
      }
      const nextValue = arrayHasKey(key) ? parseList(raw) : raw;
      return mergeOverride(acc, key, nextValue);
    }
  }, EMPTY_OVERRIDES);
  return parseEnvConfig;
})());
const takeNextValue = (tokens: ReadonlyArray<string>): Readonly<{
  readonly value: string | undefined;
  readonly rest: ReadonlyArray<string>;
}> => {
  if (stryMutAct_9fa48("651")) {
    {}
  } else {
    stryCov_9fa48("651");
    if (stryMutAct_9fa48("654") ? tokens.length !== 0 : stryMutAct_9fa48("653") ? false : stryMutAct_9fa48("652") ? true : (stryCov_9fa48("652", "653", "654"), tokens.length === 0)) {
      if (stryMutAct_9fa48("655")) {
        {}
      } else {
        stryCov_9fa48("655");
        return stryMutAct_9fa48("656") ? {} : (stryCov_9fa48("656"), {
          value: undefined,
          rest: EMPTY_STRINGS
        });
      }
    }
    const [next, ...tail] = tokens;
    if (stryMutAct_9fa48("659") ? typeof next === 'string' : stryMutAct_9fa48("658") ? false : stryMutAct_9fa48("657") ? true : (stryCov_9fa48("657", "658", "659"), typeof next !== (stryMutAct_9fa48("660") ? "" : (stryCov_9fa48("660"), 'string')))) {
      if (stryMutAct_9fa48("661")) {
        {}
      } else {
        stryCov_9fa48("661");
        return stryMutAct_9fa48("662") ? {} : (stryCov_9fa48("662"), {
          value: undefined,
          rest: freezeStrings(tail)
        });
      }
    }
    if (stryMutAct_9fa48("665") ? next.endsWith('--') : stryMutAct_9fa48("664") ? false : stryMutAct_9fa48("663") ? true : (stryCov_9fa48("663", "664", "665"), next.startsWith(stryMutAct_9fa48("666") ? "" : (stryCov_9fa48("666"), '--')))) {
      if (stryMutAct_9fa48("667")) {
        {}
      } else {
        stryCov_9fa48("667");
        return stryMutAct_9fa48("668") ? {} : (stryCov_9fa48("668"), {
          value: undefined,
          rest: tokens
        });
      }
    }
    return stryMutAct_9fa48("669") ? {} : (stryCov_9fa48("669"), {
      value: next,
      rest: freezeStrings(tail)
    });
  }
};
export function parseArgv(argv: ReadonlyArray<string>): Readonly<{
  readonly values: OverrideMap;
  readonly rest: ReadonlyArray<string>;
}> {
  if (stryMutAct_9fa48("670")) {
    {}
  } else {
    stryCov_9fa48("670");
    if (stryMutAct_9fa48("673") ? argv.length !== 0 : stryMutAct_9fa48("672") ? false : stryMutAct_9fa48("671") ? true : (stryCov_9fa48("671", "672", "673"), argv.length === 0)) {
      if (stryMutAct_9fa48("674")) {
        {}
      } else {
        stryCov_9fa48("674");
        return stryMutAct_9fa48("675") ? {} : (stryCov_9fa48("675"), {
          values: Object.freeze({}) as OverrideMap,
          rest: EMPTY_STRINGS
        });
      }
    }
    const [token, ...tail] = argv;
    if (stryMutAct_9fa48("678") ? typeof token === 'string' : stryMutAct_9fa48("677") ? false : stryMutAct_9fa48("676") ? true : (stryCov_9fa48("676", "677", "678"), typeof token !== (stryMutAct_9fa48("679") ? "" : (stryCov_9fa48("679"), 'string')))) {
      if (stryMutAct_9fa48("680")) {
        {}
      } else {
        stryCov_9fa48("680");
        return parseArgv(tail);
      }
    }
    if (stryMutAct_9fa48("683") ? false : stryMutAct_9fa48("682") ? true : stryMutAct_9fa48("681") ? token.startsWith('--') : (stryCov_9fa48("681", "682", "683"), !(stryMutAct_9fa48("684") ? token.endsWith('--') : (stryCov_9fa48("684"), token.startsWith(stryMutAct_9fa48("685") ? "" : (stryCov_9fa48("685"), '--')))))) {
      if (stryMutAct_9fa48("686")) {
        {}
      } else {
        stryCov_9fa48("686");
        return appendRest(token, parseArgv(tail));
      }
    }
    const withoutPrefix = stryMutAct_9fa48("687") ? token : (stryCov_9fa48("687"), token.slice(2));
    const parts = withoutPrefix.split(stryMutAct_9fa48("688") ? "" : (stryCov_9fa48("688"), '='), 2);
    const rawName = parts[0];
    const inline = (stryMutAct_9fa48("692") ? parts.length <= 1 : stryMutAct_9fa48("691") ? parts.length >= 1 : stryMutAct_9fa48("690") ? false : stryMutAct_9fa48("689") ? true : (stryCov_9fa48("689", "690", "691", "692"), parts.length > 1)) ? parts[1] : undefined;
    if (stryMutAct_9fa48("695") ? typeof rawName !== 'string' && rawName.length === 0 : stryMutAct_9fa48("694") ? false : stryMutAct_9fa48("693") ? true : (stryCov_9fa48("693", "694", "695"), (stryMutAct_9fa48("697") ? typeof rawName === 'string' : stryMutAct_9fa48("696") ? false : (stryCov_9fa48("696", "697"), typeof rawName !== (stryMutAct_9fa48("698") ? "" : (stryCov_9fa48("698"), 'string')))) || (stryMutAct_9fa48("700") ? rawName.length !== 0 : stryMutAct_9fa48("699") ? false : (stryCov_9fa48("699", "700"), rawName.length === 0)))) {
      if (stryMutAct_9fa48("701")) {
        {}
      } else {
        stryCov_9fa48("701");
        return appendRest(token, parseArgv(tail));
      }
    }
    const name = rawName;
    const key = ARG_KEYS.get(name);
    if (stryMutAct_9fa48("704") ? false : stryMutAct_9fa48("703") ? true : stryMutAct_9fa48("702") ? key : (stryCov_9fa48("702", "703", "704"), !key)) {
      if (stryMutAct_9fa48("705")) {
        {}
      } else {
        stryCov_9fa48("705");
        return appendRest(token, parseArgv(tail));
      }
    }
    if (stryMutAct_9fa48("708") ? typeof inline !== 'string' : stryMutAct_9fa48("707") ? false : stryMutAct_9fa48("706") ? true : (stryCov_9fa48("706", "707", "708"), typeof inline === (stryMutAct_9fa48("709") ? "" : (stryCov_9fa48("709"), 'string')))) {
      if (stryMutAct_9fa48("710")) {
        {}
      } else {
        stryCov_9fa48("710");
        return parseInlineValue(key, inline, tail);
      }
    }
    return parseValueFromTail(key, tail);
  }
}
const searchConfigUp = (current: string, stop: string): Promise<string | undefined> => {
  if (stryMutAct_9fa48("711")) {
    {}
  } else {
    stryCov_9fa48("711");
    const candidate = path.join(current, DEFAULT_CONFIG_BASENAME);
    return pathExists(candidate).then(exists => {
      if (stryMutAct_9fa48("712")) {
        {}
      } else {
        stryCov_9fa48("712");
        if (stryMutAct_9fa48("714") ? false : stryMutAct_9fa48("713") ? true : (stryCov_9fa48("713", "714"), exists)) {
          if (stryMutAct_9fa48("715")) {
            {}
          } else {
            stryCov_9fa48("715");
            return candidate;
          }
        }
        if (stryMutAct_9fa48("718") ? current !== stop : stryMutAct_9fa48("717") ? false : stryMutAct_9fa48("716") ? true : (stryCov_9fa48("716", "717", "718"), current === stop)) {
          if (stryMutAct_9fa48("719")) {
            {}
          } else {
            stryCov_9fa48("719");
            return undefined;
          }
        }
        const parent = path.dirname(current);
        return (stryMutAct_9fa48("722") ? parent !== current : stryMutAct_9fa48("721") ? false : stryMutAct_9fa48("720") ? true : (stryCov_9fa48("720", "721", "722"), parent === current)) ? undefined : searchConfigUp(parent, stop);
      }
    });
  }
};
const searchConfigPaths = async (repoRoot: string): Promise<string | undefined> => {
  if (stryMutAct_9fa48("723")) {
    {}
  } else {
    stryCov_9fa48("723");
    for (const configPath of CONFIG_SEARCH_PATHS) {
      if (stryMutAct_9fa48("724")) {
        {}
      } else {
        stryCov_9fa48("724");
        const candidate = path.join(repoRoot, configPath);
        if (stryMutAct_9fa48("726") ? false : stryMutAct_9fa48("725") ? true : (stryCov_9fa48("725", "726"), await pathExists(candidate))) {
          if (stryMutAct_9fa48("727")) {
            {}
          } else {
            stryCov_9fa48("727");
            return candidate;
          }
        }
      }
    }
    return undefined;
  }
};
export const findConfigPath = (repo: string, explicitPath: string | undefined, cwd: string): Promise<string | undefined> => {
  if (stryMutAct_9fa48("728")) {
    {}
  } else {
    stryCov_9fa48("728");
    if (stryMutAct_9fa48("731") ? typeof explicitPath !== 'string' : stryMutAct_9fa48("730") ? false : stryMutAct_9fa48("729") ? true : (stryCov_9fa48("729", "730", "731"), typeof explicitPath === (stryMutAct_9fa48("732") ? "" : (stryCov_9fa48("732"), 'string')))) {
      if (stryMutAct_9fa48("733")) {
        {}
      } else {
        stryCov_9fa48("733");
        const resolved = resolveWithBase(cwd, explicitPath);
        return pathExists(resolved).then(stryMutAct_9fa48("734") ? () => undefined : (stryCov_9fa48("734"), exists => exists ? resolved : undefined));
      }
    }
    const repoResolved = path.resolve(repo);

    // First try the enhanced search paths from repo root
    return searchConfigPaths(repoResolved).then(found => {
      if (stryMutAct_9fa48("735")) {
        {}
      } else {
        stryCov_9fa48("735");
        if (stryMutAct_9fa48("738") ? typeof found !== 'string' : stryMutAct_9fa48("737") ? false : stryMutAct_9fa48("736") ? true : (stryCov_9fa48("736", "737", "738"), typeof found === (stryMutAct_9fa48("739") ? "" : (stryCov_9fa48("739"), 'string')))) {
          if (stryMutAct_9fa48("740")) {
            {}
          } else {
            stryCov_9fa48("740");
            return found;
          }
        }

        // Fallback to original behavior - search up from current directory
        return searchConfigUp(path.resolve(cwd), repoResolved).then(foundFromUp => {
          if (stryMutAct_9fa48("741")) {
            {}
          } else {
            stryCov_9fa48("741");
            if (stryMutAct_9fa48("744") ? typeof foundFromUp !== 'string' : stryMutAct_9fa48("743") ? false : stryMutAct_9fa48("742") ? true : (stryCov_9fa48("742", "743", "744"), typeof foundFromUp === (stryMutAct_9fa48("745") ? "" : (stryCov_9fa48("745"), 'string')))) {
              if (stryMutAct_9fa48("746")) {
                {}
              } else {
                stryCov_9fa48("746");
                return foundFromUp;
              }
            }

            // Final fallback - check repo root for default config
            const repoCandidate = path.join(repoResolved, DEFAULT_CONFIG_BASENAME);
            return pathExists(repoCandidate).then(stryMutAct_9fa48("747") ? () => undefined : (stryCov_9fa48("747"), exists => exists ? repoCandidate : undefined));
          }
        });
      }
    });
  }
};
export const resolveRepo = (argValues: OverrideMap, envValues: OverrideMap, cwd: string): Promise<string> => {
  if (stryMutAct_9fa48("748")) {
    {}
  } else {
    stryCov_9fa48("748");
    const argRepo = argValues.repo as string | undefined;
    if (stryMutAct_9fa48("751") ? typeof argRepo !== 'string' : stryMutAct_9fa48("750") ? false : stryMutAct_9fa48("749") ? true : (stryCov_9fa48("749", "750", "751"), typeof argRepo === (stryMutAct_9fa48("752") ? "" : (stryCov_9fa48("752"), 'string')))) {
      if (stryMutAct_9fa48("753")) {
        {}
      } else {
        stryCov_9fa48("753");
        return Promise.resolve(resolveWithBase(cwd, argRepo));
      }
    }
    const envRepo = envValues.repo as string | undefined;
    if (stryMutAct_9fa48("756") ? typeof envRepo !== 'string' : stryMutAct_9fa48("755") ? false : stryMutAct_9fa48("754") ? true : (stryCov_9fa48("754", "755", "756"), typeof envRepo === (stryMutAct_9fa48("757") ? "" : (stryCov_9fa48("757"), 'string')))) {
      if (stryMutAct_9fa48("758")) {
        {}
      } else {
        stryCov_9fa48("758");
        return Promise.resolve(resolveWithBase(cwd, envRepo));
      }
    }
    return detectRepoRoot(cwd);
  }
};