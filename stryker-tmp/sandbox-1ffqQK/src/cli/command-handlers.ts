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
import { loadBoard, countTasks, getColumn, getTasksByColumn, findTaskById, findTaskByTitle, updateStatus, moveTask, pullFromTasks, pushToTasks, syncBoardAndTasks, regenerateBoard, generateBoardByTags, indexForSearch, searchTasks, createTask, deleteTask, updateTaskDescription, renameTask, columnKey, writeBoard } from '../lib/kanban.js';
import { isEpic, getEpicSubtasks, addSubtaskToEpic, removeSubtaskFromEpic, createEpic, getAllEpics } from '../lib/epic.js';
import type { Board } from '../lib/types.js';
import { makeEventLogManager, type EventLogManager } from '../board/event-log/index.js';
import { loadKanbanConfig } from '../board/config.js';
import { serveKanbanUI } from '../lib/ui-server.js';
import { compareTasks, suggestTaskBreakdown, prioritizeTasks } from '../lib/task-tools.js';
import { KanbanDevServer } from '../lib/dev-server.js';
import { analyzeColumnNormalization, applyColumnNormalization } from '../lib/pantheon/column-normalizer.js';
import { TransitionRulesEngine, createTransitionRulesEngine } from '../lib/transition-rules.js';
import { TaskGitTracker } from '../lib/task-git-tracker.js';
import { createWIPLimitEnforcement } from '../lib/wip-enforcement.js';
import { createRebuildEventLogCommand } from '../lib/rebuild-event-log-command.js';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readdir } from 'node:fs/promises';

// Get the equivalent of __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
type Primitive = string | number | boolean | symbol | null | undefined | bigint;
type DeepReadonly<T> = T extends Primitive ? T : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepReadonly<U>> : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;
export type CliContext = Readonly<{
  readonly boardFile: string;
  readonly tasksDir: string;
  readonly argv: ReadonlyArray<string>;
}>;
export class CommandUsageError extends Error {
  constructor(message: string) {
    if (stryMutAct_9fa48("2089")) {
      {}
    } else {
      stryCov_9fa48("2089");
      super(message);
      this.name = stryMutAct_9fa48("2090") ? "" : (stryCov_9fa48("2090"), 'CommandUsageError');
    }
  }
}
export class CommandNotFoundError extends Error {
  constructor(command: string) {
    if (stryMutAct_9fa48("2091")) {
      {}
    } else {
      stryCov_9fa48("2091");
      super(stryMutAct_9fa48("2092") ? `` : (stryCov_9fa48("2092"), `Unknown subcommand: ${command}`));
      this.name = stryMutAct_9fa48("2093") ? "" : (stryCov_9fa48("2093"), 'CommandNotFoundError');
    }
  }
}
export type CommandResult = unknown;
export type CommandHandler = (args: ReadonlyArray<string>, context: CliContext) => Promise<CommandResult>;
type LoadedBoard = Awaited<ReturnType<typeof loadBoard>>;
type ImmutableLoadedBoard = DeepReadonly<LoadedBoard>;
const requireArg = (value: string | undefined, label: string): string => {
  if (stryMutAct_9fa48("2094")) {
    {}
  } else {
    stryCov_9fa48("2094");
    if (stryMutAct_9fa48("2097") ? typeof value !== 'string' : stryMutAct_9fa48("2096") ? false : stryMutAct_9fa48("2095") ? true : (stryCov_9fa48("2095", "2096", "2097"), typeof value === (stryMutAct_9fa48("2098") ? "" : (stryCov_9fa48("2098"), 'string')))) {
      if (stryMutAct_9fa48("2099")) {
        {}
      } else {
        stryCov_9fa48("2099");
        const trimmed = stryMutAct_9fa48("2100") ? value : (stryCov_9fa48("2100"), value.trim());
        if (stryMutAct_9fa48("2104") ? trimmed.length <= 0 : stryMutAct_9fa48("2103") ? trimmed.length >= 0 : stryMutAct_9fa48("2102") ? false : stryMutAct_9fa48("2101") ? true : (stryCov_9fa48("2101", "2102", "2103", "2104"), trimmed.length > 0)) {
          if (stryMutAct_9fa48("2105")) {
            {}
          } else {
            stryCov_9fa48("2105");
            return trimmed;
          }
        }
      }
    }
    throw new CommandUsageError(stryMutAct_9fa48("2106") ? `` : (stryCov_9fa48("2106"), `Missing required ${label}.`));
  }
};

/**
 * Find the actual task file path by searching for the UUID in file contents
 */
async function findTaskFilePath(tasksDir: string, taskUuid: string): Promise<string | null> {
  if (stryMutAct_9fa48("2107")) {
    {}
  } else {
    stryCov_9fa48("2107");
    try {
      if (stryMutAct_9fa48("2108")) {
        {}
      } else {
        stryCov_9fa48("2108");
        const files = await readdir(tasksDir, stryMutAct_9fa48("2109") ? {} : (stryCov_9fa48("2109"), {
          withFileTypes: stryMutAct_9fa48("2110") ? false : (stryCov_9fa48("2110"), true)
        }));
        for (const file of files) {
          if (stryMutAct_9fa48("2111")) {
            {}
          } else {
            stryCov_9fa48("2111");
            if (stryMutAct_9fa48("2114") ? !file.isFile() && !file.name.endsWith('.md') : stryMutAct_9fa48("2113") ? false : stryMutAct_9fa48("2112") ? true : (stryCov_9fa48("2112", "2113", "2114"), (stryMutAct_9fa48("2115") ? file.isFile() : (stryCov_9fa48("2115"), !file.isFile())) || (stryMutAct_9fa48("2116") ? file.name.endsWith('.md') : (stryCov_9fa48("2116"), !(stryMutAct_9fa48("2117") ? file.name.startsWith('.md') : (stryCov_9fa48("2117"), file.name.endsWith(stryMutAct_9fa48("2118") ? "" : (stryCov_9fa48("2118"), '.md')))))))) {
              if (stryMutAct_9fa48("2119")) {
                {}
              } else {
                stryCov_9fa48("2119");
                continue;
              }
            }
            const filePath = path.join(tasksDir, file.name);
            try {
              if (stryMutAct_9fa48("2120")) {
                {}
              } else {
                stryCov_9fa48("2120");
                const content = await readFile(filePath, stryMutAct_9fa48("2121") ? "" : (stryCov_9fa48("2121"), 'utf8'));
                if (stryMutAct_9fa48("2124") ? content.includes(`uuid: "${taskUuid}"`) && content.includes(`uuid: '${taskUuid}'`) : stryMutAct_9fa48("2123") ? false : stryMutAct_9fa48("2122") ? true : (stryCov_9fa48("2122", "2123", "2124"), content.includes(stryMutAct_9fa48("2125") ? `` : (stryCov_9fa48("2125"), `uuid: "${taskUuid}"`)) || content.includes(stryMutAct_9fa48("2126") ? `` : (stryCov_9fa48("2126"), `uuid: '${taskUuid}'`)))) {
                  if (stryMutAct_9fa48("2127")) {
                    {}
                  } else {
                    stryCov_9fa48("2127");
                    return filePath;
                  }
                }
              }
            } catch (error) {
              if (stryMutAct_9fa48("2128")) {
                {}
              } else {
                stryCov_9fa48("2128");
                // Skip files that can't be read
                continue;
              }
            }
          }
        }
        return null;
      }
    } catch (error) {
      if (stryMutAct_9fa48("2129")) {
        {}
      } else {
        stryCov_9fa48("2129");
        return null;
      }
    }
  }
}
const parsePort = (value: string): number => {
  if (stryMutAct_9fa48("2130")) {
    {}
  } else {
    stryCov_9fa48("2130");
    const trimmed = stryMutAct_9fa48("2131") ? value : (stryCov_9fa48("2131"), value.trim());
    const port = Number.parseInt(trimmed, 10);
    if (stryMutAct_9fa48("2134") ? (!Number.isInteger(port) || port <= 0) && port > 65_535 : stryMutAct_9fa48("2133") ? false : stryMutAct_9fa48("2132") ? true : (stryCov_9fa48("2132", "2133", "2134"), (stryMutAct_9fa48("2136") ? !Number.isInteger(port) && port <= 0 : stryMutAct_9fa48("2135") ? false : (stryCov_9fa48("2135", "2136"), (stryMutAct_9fa48("2137") ? Number.isInteger(port) : (stryCov_9fa48("2137"), !Number.isInteger(port))) || (stryMutAct_9fa48("2140") ? port > 0 : stryMutAct_9fa48("2139") ? port < 0 : stryMutAct_9fa48("2138") ? false : (stryCov_9fa48("2138", "2139", "2140"), port <= 0)))) || (stryMutAct_9fa48("2143") ? port <= 65_535 : stryMutAct_9fa48("2142") ? port >= 65_535 : stryMutAct_9fa48("2141") ? false : (stryCov_9fa48("2141", "2142", "2143"), port > 65_535)))) {
      if (stryMutAct_9fa48("2144")) {
        {}
      } else {
        stryCov_9fa48("2144");
        throw new CommandUsageError(stryMutAct_9fa48("2145") ? `` : (stryCov_9fa48("2145"), `Invalid port: ${value}`));
      }
    }
    return port;
  }
};
type UiOptions = Readonly<{
  host?: string;
  port?: number;
}>;
const parseUiOptions = (tokens: ReadonlyArray<string>, acc: UiOptions = {}): UiOptions => {
  if (stryMutAct_9fa48("2146")) {
    {}
  } else {
    stryCov_9fa48("2146");
    if (stryMutAct_9fa48("2149") ? tokens.length !== 0 : stryMutAct_9fa48("2148") ? false : stryMutAct_9fa48("2147") ? true : (stryCov_9fa48("2147", "2148", "2149"), tokens.length === 0)) {
      if (stryMutAct_9fa48("2150")) {
        {}
      } else {
        stryCov_9fa48("2150");
        return acc;
      }
    }
    const [head, ...tail] = tokens;
    const token = stryMutAct_9fa48("2151") ? head && '' : (stryCov_9fa48("2151"), head ?? (stryMutAct_9fa48("2152") ? "Stryker was here!" : (stryCov_9fa48("2152"), '')));
    if (stryMutAct_9fa48("2155") ? token.endsWith('--port=') : stryMutAct_9fa48("2154") ? false : stryMutAct_9fa48("2153") ? true : (stryCov_9fa48("2153", "2154", "2155"), token.startsWith(stryMutAct_9fa48("2156") ? "" : (stryCov_9fa48("2156"), '--port=')))) {
      if (stryMutAct_9fa48("2157")) {
        {}
      } else {
        stryCov_9fa48("2157");
        const value = stryMutAct_9fa48("2158") ? token : (stryCov_9fa48("2158"), token.slice((stryMutAct_9fa48("2159") ? "" : (stryCov_9fa48("2159"), '--port=')).length));
        return parseUiOptions(tail, stryMutAct_9fa48("2160") ? {} : (stryCov_9fa48("2160"), {
          ...acc,
          port: parsePort(value)
        }));
      }
    }
    if (stryMutAct_9fa48("2163") ? token !== '--port' : stryMutAct_9fa48("2162") ? false : stryMutAct_9fa48("2161") ? true : (stryCov_9fa48("2161", "2162", "2163"), token === (stryMutAct_9fa48("2164") ? "" : (stryCov_9fa48("2164"), '--port')))) {
      if (stryMutAct_9fa48("2165")) {
        {}
      } else {
        stryCov_9fa48("2165");
        const [next, ...rest] = tail;
        const port = parsePort(requireArg(next, stryMutAct_9fa48("2166") ? "" : (stryCov_9fa48("2166"), 'port')));
        return parseUiOptions(rest, stryMutAct_9fa48("2167") ? {} : (stryCov_9fa48("2167"), {
          ...acc,
          port
        }));
      }
    }
    if (stryMutAct_9fa48("2170") ? token.endsWith('--host=') : stryMutAct_9fa48("2169") ? false : stryMutAct_9fa48("2168") ? true : (stryCov_9fa48("2168", "2169", "2170"), token.startsWith(stryMutAct_9fa48("2171") ? "" : (stryCov_9fa48("2171"), '--host=')))) {
      if (stryMutAct_9fa48("2172")) {
        {}
      } else {
        stryCov_9fa48("2172");
        const value = stryMutAct_9fa48("2174") ? token.trim() : stryMutAct_9fa48("2173") ? token.slice('--host='.length) : (stryCov_9fa48("2173", "2174"), token.slice((stryMutAct_9fa48("2175") ? "" : (stryCov_9fa48("2175"), '--host=')).length).trim());
        if (stryMutAct_9fa48("2178") ? value.length !== 0 : stryMutAct_9fa48("2177") ? false : stryMutAct_9fa48("2176") ? true : (stryCov_9fa48("2176", "2177", "2178"), value.length === 0)) {
          if (stryMutAct_9fa48("2179")) {
            {}
          } else {
            stryCov_9fa48("2179");
            throw new CommandUsageError(stryMutAct_9fa48("2180") ? "" : (stryCov_9fa48("2180"), 'Invalid host value'));
          }
        }
        return parseUiOptions(tail, stryMutAct_9fa48("2181") ? {} : (stryCov_9fa48("2181"), {
          ...acc,
          host: value
        }));
      }
    }
    if (stryMutAct_9fa48("2184") ? token !== '--host' : stryMutAct_9fa48("2183") ? false : stryMutAct_9fa48("2182") ? true : (stryCov_9fa48("2182", "2183", "2184"), token === (stryMutAct_9fa48("2185") ? "" : (stryCov_9fa48("2185"), '--host')))) {
      if (stryMutAct_9fa48("2186")) {
        {}
      } else {
        stryCov_9fa48("2186");
        const [next, ...rest] = tail;
        const value = requireArg(next, stryMutAct_9fa48("2187") ? "" : (stryCov_9fa48("2187"), 'host'));
        return parseUiOptions(rest, stryMutAct_9fa48("2188") ? {} : (stryCov_9fa48("2188"), {
          ...acc,
          host: value
        }));
      }
    }
    throw new CommandUsageError(stryMutAct_9fa48("2189") ? `` : (stryCov_9fa48("2189"), `Unknown ui option: ${token}`));
  }
};
const withBoard = async <T,>(context: CliContext, effect: (board: ImmutableLoadedBoard) => Promise<T> | T): Promise<T> => {
  if (stryMutAct_9fa48("2190")) {
    {}
  } else {
    stryCov_9fa48("2190");
    const board = await loadBoard(context.boardFile, context.tasksDir);
    return effect(board as ImmutableLoadedBoard);
  }
};
const handleCount: CommandHandler = stryMutAct_9fa48("2191") ? () => undefined : (stryCov_9fa48("2191"), (() => {
  const handleCount: CommandHandler = (args, context) => withBoard(context, board => {
    if (stryMutAct_9fa48("2192")) {
      {}
    } else {
      stryCov_9fa48("2192");
      const mutableBoard = board as unknown as LoadedBoard;
      // Treat undefined argument as empty string to ensure consistent behavior
      const column = (stryMutAct_9fa48("2195") ? args[0] === undefined : stryMutAct_9fa48("2194") ? false : stryMutAct_9fa48("2193") ? true : (stryCov_9fa48("2193", "2194", "2195"), args[0] !== undefined)) ? args[0] : stryMutAct_9fa48("2196") ? "Stryker was here!" : (stryCov_9fa48("2196"), '');
      const count = countTasks(mutableBoard, column);
      return stryMutAct_9fa48("2197") ? {} : (stryCov_9fa48("2197"), {
        count
      });
    }
  });
  return handleCount;
})());
const handleGetColumn: CommandHandler = stryMutAct_9fa48("2198") ? () => undefined : (stryCov_9fa48("2198"), (() => {
  const handleGetColumn: CommandHandler = (args, context) => withBoard(context, board => {
    if (stryMutAct_9fa48("2199")) {
      {}
    } else {
      stryCov_9fa48("2199");
      const mutableBoard = board as unknown as LoadedBoard;
      const column = getColumn(mutableBoard, requireArg(args[0], stryMutAct_9fa48("2200") ? "" : (stryCov_9fa48("2200"), 'column name')));
      return column;
    }
  });
  return handleGetColumn;
})());
const handleGetByColumn: CommandHandler = stryMutAct_9fa48("2201") ? () => undefined : (stryCov_9fa48("2201"), (() => {
  const handleGetByColumn: CommandHandler = (args, context) => withBoard(context, board => {
    if (stryMutAct_9fa48("2202")) {
      {}
    } else {
      stryCov_9fa48("2202");
      const mutableBoard = board as unknown as LoadedBoard;
      const tasks = getTasksByColumn(mutableBoard, requireArg(args[0], stryMutAct_9fa48("2203") ? "" : (stryCov_9fa48("2203"), 'column name')));
      return tasks;
    }
  });
  return handleGetByColumn;
})());
const handleFind: CommandHandler = stryMutAct_9fa48("2204") ? () => undefined : (stryCov_9fa48("2204"), (() => {
  const handleFind: CommandHandler = (args, context) => withBoard(context, board => {
    if (stryMutAct_9fa48("2205")) {
      {}
    } else {
      stryCov_9fa48("2205");
      const mutableBoard = board as unknown as LoadedBoard;
      const task = findTaskById(mutableBoard, requireArg(args[0], stryMutAct_9fa48("2206") ? "" : (stryCov_9fa48("2206"), 'task id')));
      if (stryMutAct_9fa48("2208") ? false : stryMutAct_9fa48("2207") ? true : (stryCov_9fa48("2207", "2208"), task)) {
        if (stryMutAct_9fa48("2209")) {
          {}
        } else {
          stryCov_9fa48("2209");
          return task;
        }
      }
      return null;
    }
  });
  return handleFind;
})());
const handleFindByTitle: CommandHandler = stryMutAct_9fa48("2210") ? () => undefined : (stryCov_9fa48("2210"), (() => {
  const handleFindByTitle: CommandHandler = (args, context) => withBoard(context, board => {
    if (stryMutAct_9fa48("2211")) {
      {}
    } else {
      stryCov_9fa48("2211");
      const mutableBoard = board as unknown as LoadedBoard;
      const title = requireArg(stryMutAct_9fa48("2212") ? args.join(' ') : (stryCov_9fa48("2212"), args.join(stryMutAct_9fa48("2213") ? "" : (stryCov_9fa48("2213"), ' ')).trim()), stryMutAct_9fa48("2214") ? "" : (stryCov_9fa48("2214"), 'task title'));
      const task = findTaskByTitle(mutableBoard, title);
      if (stryMutAct_9fa48("2216") ? false : stryMutAct_9fa48("2215") ? true : (stryCov_9fa48("2215", "2216"), task)) {
        if (stryMutAct_9fa48("2217")) {
          {}
        } else {
          stryCov_9fa48("2217");
          return task;
        }
      }
      return null;
    }
  });
  return handleFindByTitle;
})());
const handleUpdateStatus: CommandHandler = stryMutAct_9fa48("2218") ? () => undefined : (stryCov_9fa48("2218"), (() => {
  const handleUpdateStatus: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("2219")) {
      {}
    } else {
      stryCov_9fa48("2219");
      const mutableBoard = board as unknown as LoadedBoard;
      const id = requireArg(args[0], stryMutAct_9fa48("2220") ? "" : (stryCov_9fa48("2220"), 'task id'));
      const status = requireArg(args[1], stryMutAct_9fa48("2221") ? "" : (stryCov_9fa48("2221"), 'new status'));

      // Parse optional reason parameter for audit corrections
      let reason: string | undefined;
      const reasonIndex = args.findIndex(stryMutAct_9fa48("2222") ? () => undefined : (stryCov_9fa48("2222"), arg => stryMutAct_9fa48("2225") ? arg === '--reason' && arg === '-r' : stryMutAct_9fa48("2224") ? false : stryMutAct_9fa48("2223") ? true : (stryCov_9fa48("2223", "2224", "2225"), (stryMutAct_9fa48("2227") ? arg !== '--reason' : stryMutAct_9fa48("2226") ? false : (stryCov_9fa48("2226", "2227"), arg === (stryMutAct_9fa48("2228") ? "" : (stryCov_9fa48("2228"), '--reason')))) || (stryMutAct_9fa48("2230") ? arg !== '-r' : stryMutAct_9fa48("2229") ? false : (stryCov_9fa48("2229", "2230"), arg === (stryMutAct_9fa48("2231") ? "" : (stryCov_9fa48("2231"), '-r')))))));
      if (stryMutAct_9fa48("2234") ? reasonIndex >= 0 || args[reasonIndex + 1] : stryMutAct_9fa48("2233") ? false : stryMutAct_9fa48("2232") ? true : (stryCov_9fa48("2232", "2233", "2234"), (stryMutAct_9fa48("2237") ? reasonIndex < 0 : stryMutAct_9fa48("2236") ? reasonIndex > 0 : stryMutAct_9fa48("2235") ? true : (stryCov_9fa48("2235", "2236", "2237"), reasonIndex >= 0)) && args[stryMutAct_9fa48("2238") ? reasonIndex - 1 : (stryCov_9fa48("2238"), reasonIndex + 1)])) {
        if (stryMutAct_9fa48("2239")) {
          {}
        } else {
          stryCov_9fa48("2239");
          reason = args[stryMutAct_9fa48("2240") ? reasonIndex - 1 : (stryCov_9fa48("2240"), reasonIndex + 1)];
        }
      }

      // Initialize transition rules engine with proper config loading
      let transitionRulesEngine: TransitionRulesEngine | undefined;

      // Try multiple reasonable config paths
      const possiblePaths = stryMutAct_9fa48("2241") ? [] : (stryCov_9fa48("2241"), [
      // From current working directory (could be repo root)
      path.resolve(process.cwd(), stryMutAct_9fa48("2242") ? "" : (stryCov_9fa48("2242"), 'promethean.kanban.json')),
      // From board file directory (go up from docs/agile/boards)
      path.resolve(path.dirname(context.boardFile), stryMutAct_9fa48("2243") ? "" : (stryCov_9fa48("2243"), '../promethean.kanban.json')),
      // From board file directory (go up two levels to repo root)
      path.resolve(path.dirname(context.boardFile), stryMutAct_9fa48("2244") ? "" : (stryCov_9fa48("2244"), '../../promethean.kanban.json')),
      // From board file directory (go up three levels from boards to repo root)
      path.resolve(path.dirname(context.boardFile), stryMutAct_9fa48("2245") ? "" : (stryCov_9fa48("2245"), '../../../promethean.kanban.json')),
      // From package location (kanban package to repo root)
      path.resolve(__dirname, stryMutAct_9fa48("2246") ? "" : (stryCov_9fa48("2246"), '../../promethean.kanban.json')),
      // Direct relative to board file
      context.boardFile.replace(stryMutAct_9fa48("2247") ? "" : (stryCov_9fa48("2247"), '/boards/generated.md'), stryMutAct_9fa48("2248") ? "" : (stryCov_9fa48("2248"), '/promethean.kanban.json'))]);
      try {
        if (stryMutAct_9fa48("2249")) {
          {}
        } else {
          stryCov_9fa48("2249");
          transitionRulesEngine = await createTransitionRulesEngine(possiblePaths);
        }
      } catch (error) {
        if (stryMutAct_9fa48("2250")) {
          {}
        } else {
          stryCov_9fa48("2250");
          // Gracefully handle missing config or initialization errors
          console.warn(stryMutAct_9fa48("2251") ? "" : (stryCov_9fa48("2251"), 'Warning: Transition rules engine not available:'), error instanceof Error ? error.message : String(error));
        }
      }

      // Initialize event log manager
      let eventLogManager: EventLogManager | undefined;
      try {
        if (stryMutAct_9fa48("2252")) {
          {}
        } else {
          stryCov_9fa48("2252");
          const configResult = await loadKanbanConfig(stryMutAct_9fa48("2253") ? {} : (stryCov_9fa48("2253"), {
            argv: process.argv,
            env: process.env
          }));
          eventLogManager = makeEventLogManager(configResult.config);
        }
      } catch (error) {
        if (stryMutAct_9fa48("2254")) {
          {}
        } else {
          stryCov_9fa48("2254");
          console.warn(stryMutAct_9fa48("2255") ? "" : (stryCov_9fa48("2255"), 'Warning: Event log manager not available:'), error instanceof Error ? error.message : String(error));
        }
      }
      const updated = await updateStatus(mutableBoard, id, status, context.boardFile, context.tasksDir, transitionRulesEngine, reason, eventLogManager, stryMutAct_9fa48("2256") ? "" : (stryCov_9fa48("2256"), 'human'));
      return updated;
    }
  });
  return handleUpdateStatus;
})());
const handleMove = stryMutAct_9fa48("2257") ? () => undefined : (stryCov_9fa48("2257"), (() => {
  const handleMove = (offset: number): CommandHandler => stryMutAct_9fa48("2258") ? () => undefined : (stryCov_9fa48("2258"), (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("2259")) {
      {}
    } else {
      stryCov_9fa48("2259");
      const mutableBoard = board as unknown as LoadedBoard;
      const id = requireArg(args[0], stryMutAct_9fa48("2260") ? "" : (stryCov_9fa48("2260"), 'task id'));
      const result = await moveTask(mutableBoard, id, offset, context.boardFile);
      return result;
    }
  }));
  return handleMove;
})());
const handlePull: CommandHandler = stryMutAct_9fa48("2261") ? () => undefined : (stryCov_9fa48("2261"), (() => {
  const handlePull: CommandHandler = (_args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("2262")) {
      {}
    } else {
      stryCov_9fa48("2262");
      const mutableBoard = board as unknown as LoadedBoard;
      const result = await pullFromTasks(mutableBoard, context.tasksDir, context.boardFile);

      // Enhanced logging for pull operation
      if (stryMutAct_9fa48("2266") ? result.moved <= 0 : stryMutAct_9fa48("2265") ? result.moved >= 0 : stryMutAct_9fa48("2264") ? false : stryMutAct_9fa48("2263") ? true : (stryCov_9fa48("2263", "2264", "2265", "2266"), result.moved > 0)) {
        if (stryMutAct_9fa48("2267")) {
          {}
        } else {
          stryCov_9fa48("2267");
          console.log(stryMutAct_9fa48("2268") ? `` : (stryCov_9fa48("2268"), `📝 Pull completed: ${result.added} added, ${result.moved} status changes from files`));
        }
      } else {
        if (stryMutAct_9fa48("2269")) {
          {}
        } else {
          stryCov_9fa48("2269");
          console.log(stryMutAct_9fa48("2270") ? `` : (stryCov_9fa48("2270"), `📋 Pull completed: ${result.added} added, ${result.moved} moved`));
        }
      }
      return result;
    }
  });
  return handlePull;
})());
const handlePush: CommandHandler = stryMutAct_9fa48("2271") ? () => undefined : (stryCov_9fa48("2271"), (() => {
  const handlePush: CommandHandler = (_args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("2272")) {
      {}
    } else {
      stryCov_9fa48("2272");
      const mutableBoard = board as unknown as LoadedBoard;
      const result = await pushToTasks(mutableBoard, context.tasksDir);

      // Enhanced logging for manual edit detection
      if (stryMutAct_9fa48("2276") ? result.statusUpdated <= 0 : stryMutAct_9fa48("2275") ? result.statusUpdated >= 0 : stryMutAct_9fa48("2274") ? false : stryMutAct_9fa48("2273") ? true : (stryCov_9fa48("2273", "2274", "2275", "2276"), result.statusUpdated > 0)) {
        if (stryMutAct_9fa48("2277")) {
          {}
        } else {
          stryCov_9fa48("2277");
          console.log(stryMutAct_9fa48("2278") ? `` : (stryCov_9fa48("2278"), `📝 Push completed: ${result.added} added, ${result.moved} moved, ${result.statusUpdated} manual edits preserved`));
        }
      } else {
        if (stryMutAct_9fa48("2279")) {
          {}
        } else {
          stryCov_9fa48("2279");
          console.log(stryMutAct_9fa48("2280") ? `` : (stryCov_9fa48("2280"), `📋 Push completed: ${result.added} added, ${result.moved} moved`));
        }
      }
      return result;
    }
  });
  return handlePush;
})());
const handleSync: CommandHandler = stryMutAct_9fa48("2281") ? () => undefined : (stryCov_9fa48("2281"), (() => {
  const handleSync: CommandHandler = (_args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("2282")) {
      {}
    } else {
      stryCov_9fa48("2282");
      const mutableBoard = board as unknown as LoadedBoard;
      const result = await syncBoardAndTasks(mutableBoard, context.tasksDir, context.boardFile);

      // Enhanced logging for sync operation
      const totalChanges = stryMutAct_9fa48("2283") ? result.board.added + result.board.moved + result.tasks.added + result.tasks.moved - result.tasks.statusUpdated : (stryCov_9fa48("2283"), (stryMutAct_9fa48("2284") ? result.board.added + result.board.moved + result.tasks.added - result.tasks.moved : (stryCov_9fa48("2284"), (stryMutAct_9fa48("2285") ? result.board.added + result.board.moved - result.tasks.added : (stryCov_9fa48("2285"), (stryMutAct_9fa48("2286") ? result.board.added - result.board.moved : (stryCov_9fa48("2286"), result.board.added + result.board.moved)) + result.tasks.added)) + result.tasks.moved)) + result.tasks.statusUpdated);
      const conflictCount = result.conflicting.length;
      if (stryMutAct_9fa48("2290") ? conflictCount <= 0 : stryMutAct_9fa48("2289") ? conflictCount >= 0 : stryMutAct_9fa48("2288") ? false : stryMutAct_9fa48("2287") ? true : (stryCov_9fa48("2287", "2288", "2289", "2290"), conflictCount > 0)) {
        if (stryMutAct_9fa48("2291")) {
          {}
        } else {
          stryCov_9fa48("2291");
          console.log(stryMutAct_9fa48("2292") ? `` : (stryCov_9fa48("2292"), `⚠️  Sync completed with ${conflictCount} conflict(s) resolved`));
        }
      } else {
        if (stryMutAct_9fa48("2293")) {
          {}
        } else {
          stryCov_9fa48("2293");
          console.log(stryMutAct_9fa48("2294") ? `` : (stryCov_9fa48("2294"), `✅ Sync completed successfully`));
        }
      }
      console.log(stryMutAct_9fa48("2295") ? `` : (stryCov_9fa48("2295"), `📊 Board: ${result.board.added} added, ${result.board.moved} moved`));
      console.log(stryMutAct_9fa48("2296") ? `` : (stryCov_9fa48("2296"), `📁 Files: ${result.tasks.added} added, ${result.tasks.moved} moved, ${result.tasks.statusUpdated} status updates`));
      console.log(stryMutAct_9fa48("2297") ? `` : (stryCov_9fa48("2297"), `🔄 Total changes: ${totalChanges}`));
      return result;
    }
  });
  return handleSync;
})());
const handleRegenerate: CommandHandler = (_args, context) => {
  if (stryMutAct_9fa48("2298")) {
    {}
  } else {
    stryCov_9fa48("2298");
    return regenerateBoard(context.tasksDir, context.boardFile);
  }
};
const handleGenerateByTags: CommandHandler = (args, context) => {
  if (stryMutAct_9fa48("2299")) {
    {}
  } else {
    stryCov_9fa48("2299");
    if (stryMutAct_9fa48("2302") ? args.length !== 0 : stryMutAct_9fa48("2301") ? false : stryMutAct_9fa48("2300") ? true : (stryCov_9fa48("2300", "2301", "2302"), args.length === 0)) {
      if (stryMutAct_9fa48("2303")) {
        {}
      } else {
        stryCov_9fa48("2303");
        throw new CommandUsageError(stryMutAct_9fa48("2304") ? "" : (stryCov_9fa48("2304"), 'generate-by-tags requires at least one tag'));
      }
    }
    const tags = stryMutAct_9fa48("2305") ? args.map(arg => arg.trim()) : (stryCov_9fa48("2305"), args.map(stryMutAct_9fa48("2306") ? () => undefined : (stryCov_9fa48("2306"), arg => stryMutAct_9fa48("2307") ? arg : (stryCov_9fa48("2307"), arg.trim()))).filter(stryMutAct_9fa48("2308") ? () => undefined : (stryCov_9fa48("2308"), tag => stryMutAct_9fa48("2312") ? tag.length <= 0 : stryMutAct_9fa48("2311") ? tag.length >= 0 : stryMutAct_9fa48("2310") ? false : stryMutAct_9fa48("2309") ? true : (stryCov_9fa48("2309", "2310", "2311", "2312"), tag.length > 0))));
    if (stryMutAct_9fa48("2315") ? tags.length !== 0 : stryMutAct_9fa48("2314") ? false : stryMutAct_9fa48("2313") ? true : (stryCov_9fa48("2313", "2314", "2315"), tags.length === 0)) {
      if (stryMutAct_9fa48("2316")) {
        {}
      } else {
        stryCov_9fa48("2316");
        throw new CommandUsageError(stryMutAct_9fa48("2317") ? "" : (stryCov_9fa48("2317"), 'No valid tags provided'));
      }
    }
    return generateBoardByTags(context.tasksDir, context.boardFile, tags);
  }
};
const handleIndexForSearch: CommandHandler = (_args, context) => {
  if (stryMutAct_9fa48("2318")) {
    {}
  } else {
    stryCov_9fa48("2318");
    return indexForSearch(context.tasksDir);
  }
};
const handleSearch: CommandHandler = stryMutAct_9fa48("2319") ? () => undefined : (stryCov_9fa48("2319"), (() => {
  const handleSearch: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("2320")) {
      {}
    } else {
      stryCov_9fa48("2320");
      const mutableBoard = board as unknown as LoadedBoard;
      const term = requireArg(stryMutAct_9fa48("2321") ? args.join(' ') : (stryCov_9fa48("2321"), args.join(stryMutAct_9fa48("2322") ? "" : (stryCov_9fa48("2322"), ' ')).trim()), stryMutAct_9fa48("2323") ? "" : (stryCov_9fa48("2323"), 'search term'));
      const result = await searchTasks(mutableBoard, term);
      return result;
    }
  });
  return handleSearch;
})());
const handleUi: CommandHandler = async (args, context) => {
  if (stryMutAct_9fa48("2324")) {
    {}
  } else {
    stryCov_9fa48("2324");
    const options = parseUiOptions(args);
    await serveKanbanUI(stryMutAct_9fa48("2325") ? {} : (stryCov_9fa48("2325"), {
      boardFile: context.boardFile,
      tasksDir: context.tasksDir,
      host: options.host,
      port: options.port
    }));
    return null;
  }
};
const parseSectionFlag = (tokens: ReadonlyArray<string>): string | undefined => {
  if (stryMutAct_9fa48("2326")) {
    {}
  } else {
    stryCov_9fa48("2326");
    for (const [index, token] of tokens.entries()) {
      if (stryMutAct_9fa48("2327")) {
        {}
      } else {
        stryCov_9fa48("2327");
        if (stryMutAct_9fa48("2330") ? token !== '--section' : stryMutAct_9fa48("2329") ? false : stryMutAct_9fa48("2328") ? true : (stryCov_9fa48("2328", "2329", "2330"), token === (stryMutAct_9fa48("2331") ? "" : (stryCov_9fa48("2331"), '--section')))) {
          if (stryMutAct_9fa48("2332")) {
            {}
          } else {
            stryCov_9fa48("2332");
            return tokens[stryMutAct_9fa48("2333") ? index - 1 : (stryCov_9fa48("2333"), index + 1)];
          }
        }
        if (stryMutAct_9fa48("2336") ? token.endsWith('--section=') : stryMutAct_9fa48("2335") ? false : stryMutAct_9fa48("2334") ? true : (stryCov_9fa48("2334", "2335", "2336"), token.startsWith(stryMutAct_9fa48("2337") ? "" : (stryCov_9fa48("2337"), '--section=')))) {
          if (stryMutAct_9fa48("2338")) {
            {}
          } else {
            stryCov_9fa48("2338");
            const value = stryMutAct_9fa48("2339") ? token : (stryCov_9fa48("2339"), token.slice((stryMutAct_9fa48("2340") ? "" : (stryCov_9fa48("2340"), '--section=')).length));
            if (stryMutAct_9fa48("2344") ? value.length <= 0 : stryMutAct_9fa48("2343") ? value.length >= 0 : stryMutAct_9fa48("2342") ? false : stryMutAct_9fa48("2341") ? true : (stryCov_9fa48("2341", "2342", "2343", "2344"), value.length > 0)) {
              if (stryMutAct_9fa48("2345")) {
                {}
              } else {
                stryCov_9fa48("2345");
                return value;
              }
            }
          }
        }
      }
    }
    return undefined;
  }
};
const handleProcess: CommandHandler = async args => {
  if (stryMutAct_9fa48("2346")) {
    {}
  } else {
    stryCov_9fa48("2346");
    const section = parseSectionFlag(args);

    // Resolve the process.md path relative to the kanban package
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const repoRoot = path.resolve(__dirname, stryMutAct_9fa48("2347") ? "" : (stryCov_9fa48("2347"), '../../../..'));
    const processDocPath = path.join(repoRoot, stryMutAct_9fa48("2348") ? "" : (stryCov_9fa48("2348"), 'docs/agile/process.md'));
    try {
      if (stryMutAct_9fa48("2349")) {
        {}
      } else {
        stryCov_9fa48("2349");
        const processContent = await readFile(processDocPath, stryMutAct_9fa48("2350") ? "" : (stryCov_9fa48("2350"), 'utf8'));
        if (stryMutAct_9fa48("2352") ? false : stryMutAct_9fa48("2351") ? true : (stryCov_9fa48("2351", "2352"), section)) {
          if (stryMutAct_9fa48("2353")) {
            {}
          } else {
            stryCov_9fa48("2353");
            // Extract a specific section
            const sectionRegex = new RegExp(stryMutAct_9fa48("2354") ? `` : (stryCov_9fa48("2354"), `^#{1,3}\\s+.*${section}.*$[\\s\\S]*?(?=\n#{1,3}\\s+|\n$|$)`), stryMutAct_9fa48("2355") ? "" : (stryCov_9fa48("2355"), 'im'));
            const match = processContent.match(sectionRegex);
            if (stryMutAct_9fa48("2357") ? false : stryMutAct_9fa48("2356") ? true : (stryCov_9fa48("2356", "2357"), match)) {
              if (stryMutAct_9fa48("2358")) {
                {}
              } else {
                stryCov_9fa48("2358");
                console.log(stryMutAct_9fa48("2359") ? match[0] : (stryCov_9fa48("2359"), match[0].trim()));
              }
            } else {
              if (stryMutAct_9fa48("2360")) {
                {}
              } else {
                stryCov_9fa48("2360");
                console.error(stryMutAct_9fa48("2361") ? `` : (stryCov_9fa48("2361"), `Section "${section}" not found in process document`));
                console.log(stryMutAct_9fa48("2362") ? "" : (stryCov_9fa48("2362"), 'Available sections:'));
                const sections = stryMutAct_9fa48("2365") ? processContent.match(/^#{1,3}\s+(.+)$/gm) && [] : stryMutAct_9fa48("2364") ? false : stryMutAct_9fa48("2363") ? true : (stryCov_9fa48("2363", "2364", "2365"), processContent.match(stryMutAct_9fa48("2371") ? /^#{1,3}\s+(.)$/gm : stryMutAct_9fa48("2370") ? /^#{1,3}\S+(.+)$/gm : stryMutAct_9fa48("2369") ? /^#{1,3}\s(.+)$/gm : stryMutAct_9fa48("2368") ? /^#\s+(.+)$/gm : stryMutAct_9fa48("2367") ? /^#{1,3}\s+(.+)/gm : stryMutAct_9fa48("2366") ? /#{1,3}\s+(.+)$/gm : (stryCov_9fa48("2366", "2367", "2368", "2369", "2370", "2371"), /^#{1,3}\s+(.+)$/gm)) || (stryMutAct_9fa48("2372") ? ["Stryker was here"] : (stryCov_9fa48("2372"), [])));
                sections.forEach(stryMutAct_9fa48("2373") ? () => undefined : (stryCov_9fa48("2373"), s => console.log(stryMutAct_9fa48("2374") ? `` : (stryCov_9fa48("2374"), `  - ${s.replace(stryMutAct_9fa48("2378") ? /^#{1,3}\S+/ : stryMutAct_9fa48("2377") ? /^#{1,3}\s/ : stryMutAct_9fa48("2376") ? /^#\s+/ : stryMutAct_9fa48("2375") ? /#{1,3}\s+/ : (stryCov_9fa48("2375", "2376", "2377", "2378"), /^#{1,3}\s+/), stryMutAct_9fa48("2379") ? "Stryker was here!" : (stryCov_9fa48("2379"), ''))}`))));
                process.exit(1);
              }
            }
          }
        } else {
          if (stryMutAct_9fa48("2380")) {
            {}
          } else {
            stryCov_9fa48("2380");
            // Display the full process document with a brief header
            console.log(stryMutAct_9fa48("2381") ? "" : (stryCov_9fa48("2381"), '# 📋 Promethean Development Process'));
            console.log(stryMutAct_9fa48("2382") ? "Stryker was here!" : (stryCov_9fa48("2382"), ''));
            console.log(stryMutAct_9fa48("2383") ? "" : (stryCov_9fa48("2383"), 'This document outlines the 6-step workflow for task development in the Promethean framework.'));
            console.log(stryMutAct_9fa48("2384") ? "" : (stryCov_9fa48("2384"), 'Use --section <name> to view specific sections.'));
            console.log(stryMutAct_9fa48("2385") ? "Stryker was here!" : (stryCov_9fa48("2385"), ''));
            console.log(stryMutAct_9fa48("2386") ? "" : (stryCov_9fa48("2386"), 'Available sections: overview, fsm, transitions, blocking'));
            console.log(stryMutAct_9fa48("2387") ? "Stryker was here!" : (stryCov_9fa48("2387"), ''));
            console.log(stryMutAct_9fa48("2388") ? "" : (stryCov_9fa48("2388"), '--- Full Process Document ---'));
            console.log(stryMutAct_9fa48("2389") ? "Stryker was here!" : (stryCov_9fa48("2389"), ''));
            console.log(processContent);
          }
        }
      }
    } catch (error) {
      if (stryMutAct_9fa48("2390")) {
        {}
      } else {
        stryCov_9fa48("2390");
        const message = error instanceof Error ? error.message : String(error);
        console.error(stryMutAct_9fa48("2391") ? `` : (stryCov_9fa48("2391"), `Error reading process document: ${message}`));
        process.exit(1);
      }
    }
  }
};
const handleCompareTasks: CommandHandler = async (args, context) => {
  if (stryMutAct_9fa48("2392")) {
    {}
  } else {
    stryCov_9fa48("2392");
    if (stryMutAct_9fa48("2395") ? args.length !== 0 : stryMutAct_9fa48("2394") ? false : stryMutAct_9fa48("2393") ? true : (stryCov_9fa48("2393", "2394", "2395"), args.length === 0)) {
      if (stryMutAct_9fa48("2396")) {
        {}
      } else {
        stryCov_9fa48("2396");
        throw new CommandUsageError(stryMutAct_9fa48("2397") ? "" : (stryCov_9fa48("2397"), 'compare-tasks requires task UUIDs separated by commas'));
      }
    }
    const taskUuids = args[0]!.split(stryMutAct_9fa48("2398") ? "" : (stryCov_9fa48("2398"), ','));
    const comparisons = await compareTasks(taskUuids, context.boardFile, context.tasksDir);
    return comparisons;
  }
};
const handleBreakdownTask: CommandHandler = async (args, context) => {
  if (stryMutAct_9fa48("2399")) {
    {}
  } else {
    stryCov_9fa48("2399");
    if (stryMutAct_9fa48("2402") ? args.length !== 0 : stryMutAct_9fa48("2401") ? false : stryMutAct_9fa48("2400") ? true : (stryCov_9fa48("2400", "2401", "2402"), args.length === 0)) {
      if (stryMutAct_9fa48("2403")) {
        {}
      } else {
        stryCov_9fa48("2403");
        throw new CommandUsageError(stryMutAct_9fa48("2404") ? "" : (stryCov_9fa48("2404"), 'breakdown-task requires a task UUID'));
      }
    }
    const taskUuid = args[0]!;
    const breakdown = await suggestTaskBreakdown(taskUuid, context.tasksDir);
    return breakdown;
  }
};
const handlePrioritizeTasks: CommandHandler = async (_args, _context) => {
  if (stryMutAct_9fa48("2405")) {
    {}
  } else {
    stryCov_9fa48("2405");
    if (stryMutAct_9fa48("2408") ? _args.length !== 0 : stryMutAct_9fa48("2407") ? false : stryMutAct_9fa48("2406") ? true : (stryCov_9fa48("2406", "2407", "2408"), _args.length === 0)) {
      if (stryMutAct_9fa48("2409")) {
        {}
      } else {
        stryCov_9fa48("2409");
        throw new CommandUsageError(stryMutAct_9fa48("2410") ? "" : (stryCov_9fa48("2410"), 'prioritize-tasks requires task UUIDs separated by commas'));
      }
    }
    const taskUuids = _args[0]!.split(stryMutAct_9fa48("2411") ? "" : (stryCov_9fa48("2411"), ','));
    const priorities = await prioritizeTasks(taskUuids, {});
    return priorities;
  }
};
type DevOptions = Readonly<{
  host?: string;
  port?: number;
  noAutoGit?: boolean;
  noAutoOpen?: boolean;
  debounceMs?: number;
}>;
const parseDevOptions = (tokens: ReadonlyArray<string>, acc: DevOptions = {}): DevOptions => {
  if (stryMutAct_9fa48("2412")) {
    {}
  } else {
    stryCov_9fa48("2412");
    if (stryMutAct_9fa48("2415") ? tokens.length !== 0 : stryMutAct_9fa48("2414") ? false : stryMutAct_9fa48("2413") ? true : (stryCov_9fa48("2413", "2414", "2415"), tokens.length === 0)) {
      if (stryMutAct_9fa48("2416")) {
        {}
      } else {
        stryCov_9fa48("2416");
        return acc;
      }
    }
    const [head, ...tail] = tokens;
    const token = stryMutAct_9fa48("2417") ? head && '' : (stryCov_9fa48("2417"), head ?? (stryMutAct_9fa48("2418") ? "Stryker was here!" : (stryCov_9fa48("2418"), '')));
    if (stryMutAct_9fa48("2421") ? token.endsWith('--port=') : stryMutAct_9fa48("2420") ? false : stryMutAct_9fa48("2419") ? true : (stryCov_9fa48("2419", "2420", "2421"), token.startsWith(stryMutAct_9fa48("2422") ? "" : (stryCov_9fa48("2422"), '--port=')))) {
      if (stryMutAct_9fa48("2423")) {
        {}
      } else {
        stryCov_9fa48("2423");
        const value = stryMutAct_9fa48("2424") ? token : (stryCov_9fa48("2424"), token.slice((stryMutAct_9fa48("2425") ? "" : (stryCov_9fa48("2425"), '--port=')).length));
        return parseDevOptions(tail, stryMutAct_9fa48("2426") ? {} : (stryCov_9fa48("2426"), {
          ...acc,
          port: parsePort(value)
        }));
      }
    }
    if (stryMutAct_9fa48("2429") ? token !== '--port' : stryMutAct_9fa48("2428") ? false : stryMutAct_9fa48("2427") ? true : (stryCov_9fa48("2427", "2428", "2429"), token === (stryMutAct_9fa48("2430") ? "" : (stryCov_9fa48("2430"), '--port')))) {
      if (stryMutAct_9fa48("2431")) {
        {}
      } else {
        stryCov_9fa48("2431");
        const [next, ...rest] = tail;
        const port = parsePort(requireArg(next, stryMutAct_9fa48("2432") ? "" : (stryCov_9fa48("2432"), 'port')));
        return parseDevOptions(rest, stryMutAct_9fa48("2433") ? {} : (stryCov_9fa48("2433"), {
          ...acc,
          port
        }));
      }
    }
    if (stryMutAct_9fa48("2436") ? token.endsWith('--host=') : stryMutAct_9fa48("2435") ? false : stryMutAct_9fa48("2434") ? true : (stryCov_9fa48("2434", "2435", "2436"), token.startsWith(stryMutAct_9fa48("2437") ? "" : (stryCov_9fa48("2437"), '--host=')))) {
      if (stryMutAct_9fa48("2438")) {
        {}
      } else {
        stryCov_9fa48("2438");
        const value = stryMutAct_9fa48("2440") ? token.trim() : stryMutAct_9fa48("2439") ? token.slice('--host='.length) : (stryCov_9fa48("2439", "2440"), token.slice((stryMutAct_9fa48("2441") ? "" : (stryCov_9fa48("2441"), '--host=')).length).trim());
        if (stryMutAct_9fa48("2444") ? value.length !== 0 : stryMutAct_9fa48("2443") ? false : stryMutAct_9fa48("2442") ? true : (stryCov_9fa48("2442", "2443", "2444"), value.length === 0)) {
          if (stryMutAct_9fa48("2445")) {
            {}
          } else {
            stryCov_9fa48("2445");
            throw new CommandUsageError(stryMutAct_9fa48("2446") ? "" : (stryCov_9fa48("2446"), 'Invalid host value'));
          }
        }
        return parseDevOptions(tail, stryMutAct_9fa48("2447") ? {} : (stryCov_9fa48("2447"), {
          ...acc,
          host: value
        }));
      }
    }
    if (stryMutAct_9fa48("2450") ? token !== '--host' : stryMutAct_9fa48("2449") ? false : stryMutAct_9fa48("2448") ? true : (stryCov_9fa48("2448", "2449", "2450"), token === (stryMutAct_9fa48("2451") ? "" : (stryCov_9fa48("2451"), '--host')))) {
      if (stryMutAct_9fa48("2452")) {
        {}
      } else {
        stryCov_9fa48("2452");
        const [next, ...rest] = tail;
        const value = requireArg(next, stryMutAct_9fa48("2453") ? "" : (stryCov_9fa48("2453"), 'host'));
        return parseDevOptions(rest, stryMutAct_9fa48("2454") ? {} : (stryCov_9fa48("2454"), {
          ...acc,
          host: value
        }));
      }
    }
    if (stryMutAct_9fa48("2457") ? token !== '--no-auto-git' : stryMutAct_9fa48("2456") ? false : stryMutAct_9fa48("2455") ? true : (stryCov_9fa48("2455", "2456", "2457"), token === (stryMutAct_9fa48("2458") ? "" : (stryCov_9fa48("2458"), '--no-auto-git')))) {
      if (stryMutAct_9fa48("2459")) {
        {}
      } else {
        stryCov_9fa48("2459");
        return parseDevOptions(tail, stryMutAct_9fa48("2460") ? {} : (stryCov_9fa48("2460"), {
          ...acc,
          noAutoGit: stryMutAct_9fa48("2461") ? false : (stryCov_9fa48("2461"), true)
        }));
      }
    }
    if (stryMutAct_9fa48("2464") ? token !== '--no-auto-open' : stryMutAct_9fa48("2463") ? false : stryMutAct_9fa48("2462") ? true : (stryCov_9fa48("2462", "2463", "2464"), token === (stryMutAct_9fa48("2465") ? "" : (stryCov_9fa48("2465"), '--no-auto-open')))) {
      if (stryMutAct_9fa48("2466")) {
        {}
      } else {
        stryCov_9fa48("2466");
        return parseDevOptions(tail, stryMutAct_9fa48("2467") ? {} : (stryCov_9fa48("2467"), {
          ...acc,
          noAutoOpen: stryMutAct_9fa48("2468") ? false : (stryCov_9fa48("2468"), true)
        }));
      }
    }
    if (stryMutAct_9fa48("2471") ? token.endsWith('--debounce=') : stryMutAct_9fa48("2470") ? false : stryMutAct_9fa48("2469") ? true : (stryCov_9fa48("2469", "2470", "2471"), token.startsWith(stryMutAct_9fa48("2472") ? "" : (stryCov_9fa48("2472"), '--debounce=')))) {
      if (stryMutAct_9fa48("2473")) {
        {}
      } else {
        stryCov_9fa48("2473");
        const value = stryMutAct_9fa48("2474") ? token : (stryCov_9fa48("2474"), token.slice((stryMutAct_9fa48("2475") ? "" : (stryCov_9fa48("2475"), '--debounce=')).length));
        const debounce = Number.parseInt(value, 10);
        if (stryMutAct_9fa48("2478") ? (!Number.isInteger(debounce) || debounce < 100) && debounce > 10000 : stryMutAct_9fa48("2477") ? false : stryMutAct_9fa48("2476") ? true : (stryCov_9fa48("2476", "2477", "2478"), (stryMutAct_9fa48("2480") ? !Number.isInteger(debounce) && debounce < 100 : stryMutAct_9fa48("2479") ? false : (stryCov_9fa48("2479", "2480"), (stryMutAct_9fa48("2481") ? Number.isInteger(debounce) : (stryCov_9fa48("2481"), !Number.isInteger(debounce))) || (stryMutAct_9fa48("2484") ? debounce >= 100 : stryMutAct_9fa48("2483") ? debounce <= 100 : stryMutAct_9fa48("2482") ? false : (stryCov_9fa48("2482", "2483", "2484"), debounce < 100)))) || (stryMutAct_9fa48("2487") ? debounce <= 10000 : stryMutAct_9fa48("2486") ? debounce >= 10000 : stryMutAct_9fa48("2485") ? false : (stryCov_9fa48("2485", "2486", "2487"), debounce > 10000)))) {
          if (stryMutAct_9fa48("2488")) {
            {}
          } else {
            stryCov_9fa48("2488");
            throw new CommandUsageError(stryMutAct_9fa48("2489") ? "" : (stryCov_9fa48("2489"), 'Debounce must be between 100ms and 10s'));
          }
        }
        return parseDevOptions(tail, stryMutAct_9fa48("2490") ? {} : (stryCov_9fa48("2490"), {
          ...acc,
          debounceMs: debounce
        }));
      }
    }
    throw new CommandUsageError(stryMutAct_9fa48("2491") ? `` : (stryCov_9fa48("2491"), `Unknown dev option: ${token}`));
  }
};
const handleDev: CommandHandler = async (args, context) => {
  if (stryMutAct_9fa48("2492")) {
    {}
  } else {
    stryCov_9fa48("2492");
    const options = parseDevOptions(args);
    const devServer = new KanbanDevServer(stryMutAct_9fa48("2493") ? {} : (stryCov_9fa48("2493"), {
      boardFile: context.boardFile,
      tasksDir: context.tasksDir,
      host: options.host,
      port: options.port,
      autoGit: stryMutAct_9fa48("2494") ? options.noAutoGit : (stryCov_9fa48("2494"), !options.noAutoGit),
      autoOpen: stryMutAct_9fa48("2495") ? options.noAutoOpen : (stryCov_9fa48("2495"), !options.noAutoOpen),
      debounceMs: options.debounceMs
    }));

    // Handle graceful shutdown
    const cleanup = async () => {
      if (stryMutAct_9fa48("2496")) {
        {}
      } else {
        stryCov_9fa48("2496");
        console.log(stryMutAct_9fa48("2497") ? "" : (stryCov_9fa48("2497"), '\n[kanban-dev] Shutting down development server...'));
        await devServer.stop();
        process.exit(0);
      }
    };
    process.on(stryMutAct_9fa48("2498") ? "" : (stryCov_9fa48("2498"), 'SIGINT'), cleanup);
    process.on(stryMutAct_9fa48("2499") ? "" : (stryCov_9fa48("2499"), 'SIGTERM'), cleanup);
    try {
      if (stryMutAct_9fa48("2500")) {
        {}
      } else {
        stryCov_9fa48("2500");
        await devServer.start();
        console.log(stryMutAct_9fa48("2501") ? "" : (stryCov_9fa48("2501"), '[kanban-dev] Development server is running. Press Ctrl+C to stop.'));

        // Keep the process alive
        return new Promise(() => {}); // Never resolves
      }
    } catch (error) {
      if (stryMutAct_9fa48("2502")) {
        {}
      } else {
        stryCov_9fa48("2502");
        console.error(stryMutAct_9fa48("2503") ? "" : (stryCov_9fa48("2503"), '[kanban-dev] Failed to start development server:'), error);
        throw error;
      }
    }
  }
};
const handleShowTransitions: CommandHandler = async (_args, context) => {
  if (stryMutAct_9fa48("2504")) {
    {}
  } else {
    stryCov_9fa48("2504");
    try {
      if (stryMutAct_9fa48("2505")) {
        {}
      } else {
        stryCov_9fa48("2505");
        // Try multiple reasonable config paths
        const possiblePaths = stryMutAct_9fa48("2506") ? [] : (stryCov_9fa48("2506"), [
        // From current working directory (could be repo root)
        path.resolve(process.cwd(), stryMutAct_9fa48("2507") ? "" : (stryCov_9fa48("2507"), 'promethean.kanban.json')),
        // From board file directory (go up from docs/agile/boards)
        path.resolve(path.dirname(context.boardFile), stryMutAct_9fa48("2508") ? "" : (stryCov_9fa48("2508"), '../promethean.kanban.json')),
        // From board file directory (go up two levels to repo root)
        path.resolve(path.dirname(context.boardFile), stryMutAct_9fa48("2509") ? "" : (stryCov_9fa48("2509"), '../../promethean.kanban.json')),
        // From board file directory (go up three levels from boards to repo root)
        path.resolve(path.dirname(context.boardFile), stryMutAct_9fa48("2510") ? "" : (stryCov_9fa48("2510"), '../../../promethean.kanban.json')),
        // From package location (kanban package to repo root)
        path.resolve(__dirname, stryMutAct_9fa48("2511") ? "" : (stryCov_9fa48("2511"), '../../promethean.kanban.json')),
        // Direct relative to board file
        context.boardFile.replace(stryMutAct_9fa48("2512") ? "" : (stryCov_9fa48("2512"), '/boards/generated.md'), stryMutAct_9fa48("2513") ? "" : (stryCov_9fa48("2513"), '/promethean.kanban.json'))]);
        let transitionRulesEngine: TransitionRulesEngine | undefined;
        try {
          if (stryMutAct_9fa48("2514")) {
            {}
          } else {
            stryCov_9fa48("2514");
            transitionRulesEngine = await createTransitionRulesEngine(possiblePaths);
          }
        } catch (error) {
          if (stryMutAct_9fa48("2515")) {
            {}
          } else {
            stryCov_9fa48("2515");
            // Gracefully handle missing config or initialization errors
            console.warn(stryMutAct_9fa48("2516") ? "" : (stryCov_9fa48("2516"), 'Warning: Transition rules engine not available:'), error instanceof Error ? error.message : String(error));
          }
        }
        if (stryMutAct_9fa48("2519") ? false : stryMutAct_9fa48("2518") ? true : stryMutAct_9fa48("2517") ? transitionRulesEngine : (stryCov_9fa48("2517", "2518", "2519"), !transitionRulesEngine)) {
          if (stryMutAct_9fa48("2520")) {
            {}
          } else {
            stryCov_9fa48("2520");
            throw new Error(stryMutAct_9fa48("2521") ? "" : (stryCov_9fa48("2521"), 'Could not find or load transition rules configuration'));
          }
        }
        const overview = transitionRulesEngine.getTransitionsOverview();
        console.log(stryMutAct_9fa48("2522") ? "" : (stryCov_9fa48("2522"), '# 🔄 Kanban Transition Rules Overview'));
        console.log(stryMutAct_9fa48("2523") ? "Stryker was here!" : (stryCov_9fa48("2523"), ''));
        console.log(stryMutAct_9fa48("2524") ? `` : (stryCov_9fa48("2524"), `## Status: ${overview.enabled ? stryMutAct_9fa48("2525") ? "" : (stryCov_9fa48("2525"), '✅ Enabled') : stryMutAct_9fa48("2526") ? "" : (stryCov_9fa48("2526"), '❌ Disabled')}`));
        console.log(stryMutAct_9fa48("2527") ? `` : (stryCov_9fa48("2527"), `## Enforcement: ${overview.enforcementMode}`));
        if (stryMutAct_9fa48("2529") ? false : stryMutAct_9fa48("2528") ? true : (stryCov_9fa48("2528", "2529"), overview.dslAvailable)) {
          if (stryMutAct_9fa48("2530")) {
            {}
          } else {
            stryCov_9fa48("2530");
            console.log(stryMutAct_9fa48("2531") ? `` : (stryCov_9fa48("2531"), `## DSL: 🟢 Clojure DSL available`));
          }
        } else {
          if (stryMutAct_9fa48("2532")) {
            {}
          } else {
            stryCov_9fa48("2532");
            console.log(stryMutAct_9fa48("2533") ? `` : (stryCov_9fa48("2533"), `## DSL: 🔴 Clojure DSL not available`));
          }
        }
        console.log(stryMutAct_9fa48("2534") ? "Stryker was here!" : (stryCov_9fa48("2534"), ''));
        if (stryMutAct_9fa48("2538") ? overview.validTransitions.length <= 0 : stryMutAct_9fa48("2537") ? overview.validTransitions.length >= 0 : stryMutAct_9fa48("2536") ? false : stryMutAct_9fa48("2535") ? true : (stryCov_9fa48("2535", "2536", "2537", "2538"), overview.validTransitions.length > 0)) {
          if (stryMutAct_9fa48("2539")) {
            {}
          } else {
            stryCov_9fa48("2539");
            console.log(stryMutAct_9fa48("2540") ? "" : (stryCov_9fa48("2540"), '## Valid Transitions:'));
            for (const transition of overview.validTransitions) {
              if (stryMutAct_9fa48("2541")) {
                {}
              } else {
                stryCov_9fa48("2541");
                console.log(stryMutAct_9fa48("2542") ? `` : (stryCov_9fa48("2542"), `- ${transition.from} → ${transition.to}`));
                if (stryMutAct_9fa48("2544") ? false : stryMutAct_9fa48("2543") ? true : (stryCov_9fa48("2543", "2544"), transition.description)) {
                  if (stryMutAct_9fa48("2545")) {
                    {}
                  } else {
                    stryCov_9fa48("2545");
                    console.log(stryMutAct_9fa48("2546") ? `` : (stryCov_9fa48("2546"), `  ${transition.description}`));
                  }
                }
              }
            }
            console.log(stryMutAct_9fa48("2547") ? "Stryker was here!" : (stryCov_9fa48("2547"), ''));
          }
        }
        if (stryMutAct_9fa48("2551") ? overview.globalRules.length <= 0 : stryMutAct_9fa48("2550") ? overview.globalRules.length >= 0 : stryMutAct_9fa48("2549") ? false : stryMutAct_9fa48("2548") ? true : (stryCov_9fa48("2548", "2549", "2550", "2551"), overview.globalRules.length > 0)) {
          if (stryMutAct_9fa48("2552")) {
            {}
          } else {
            stryCov_9fa48("2552");
            console.log(stryMutAct_9fa48("2553") ? "" : (stryCov_9fa48("2553"), '## Global Rules:'));
            for (const rule of overview.globalRules) {
              if (stryMutAct_9fa48("2554")) {
                {}
              } else {
                stryCov_9fa48("2554");
                console.log(stryMutAct_9fa48("2555") ? `` : (stryCov_9fa48("2555"), `- ${rule}`));
              }
            }
            console.log(stryMutAct_9fa48("2556") ? "Stryker was here!" : (stryCov_9fa48("2556"), ''));
          }
        }
        return overview;
      }
    } catch (error) {
      if (stryMutAct_9fa48("2557")) {
        {}
      } else {
        stryCov_9fa48("2557");
        console.error(stryMutAct_9fa48("2558") ? "" : (stryCov_9fa48("2558"), 'Error loading transition rules:'), error instanceof Error ? error.message : String(error));
        return stryMutAct_9fa48("2559") ? {} : (stryCov_9fa48("2559"), {
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }
};
const handleShowProcess: CommandHandler = async (_args, _context) => {
  if (stryMutAct_9fa48("2560")) {
    {}
  } else {
    stryCov_9fa48("2560");
    const section = stryMutAct_9fa48("2561") ? "" : (stryCov_9fa48("2561"), 'overview');

    // Resolve the process.md path relative to the kanban package
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const repoRoot = path.resolve(__dirname, stryMutAct_9fa48("2562") ? "" : (stryCov_9fa48("2562"), '../../../..'));
    const processDocPath = path.join(repoRoot, stryMutAct_9fa48("2563") ? "" : (stryCov_9fa48("2563"), 'docs/agile/process.md'));
    try {
      if (stryMutAct_9fa48("2564")) {
        {}
      } else {
        stryCov_9fa48("2564");
        const processContent = await readFile(processDocPath, stryMutAct_9fa48("2565") ? "" : (stryCov_9fa48("2565"), 'utf8'));

        // Extract the overview section
        const sectionRegex = new RegExp(stryMutAct_9fa48("2566") ? `` : (stryCov_9fa48("2566"), `^#{1,3}\\s+.*${section}.*$[\\s\\S]*?(?=\\n#{1,3}\\s+|\\n$|$)`), stryMutAct_9fa48("2567") ? "" : (stryCov_9fa48("2567"), 'im'));
        const match = processContent.match(sectionRegex);
        if (stryMutAct_9fa48("2569") ? false : stryMutAct_9fa48("2568") ? true : (stryCov_9fa48("2568", "2569"), match)) {
          if (stryMutAct_9fa48("2570")) {
            {}
          } else {
            stryCov_9fa48("2570");
            console.log(stryMutAct_9fa48("2571") ? match[0] : (stryCov_9fa48("2571"), match[0].trim()));
          }
        } else {
          if (stryMutAct_9fa48("2572")) {
            {}
          } else {
            stryCov_9fa48("2572");
            console.log(stryMutAct_9fa48("2573") ? "" : (stryCov_9fa48("2573"), '# 📋 Promethean Development Process'));
            console.log(stryMutAct_9fa48("2574") ? "Stryker was here!" : (stryCov_9fa48("2574"), ''));
            console.log(stryMutAct_9fa48("2575") ? "" : (stryCov_9fa48("2575"), 'This document outlines the 6-step workflow for task development in the Promethean framework.'));
            console.log(stryMutAct_9fa48("2576") ? "Stryker was here!" : (stryCov_9fa48("2576"), ''));
            console.log(stryMutAct_9fa48("2577") ? "" : (stryCov_9fa48("2577"), 'Key transitions: Incoming→Accepted→Breakdown→Ready→Todo→In Progress→Review→Document→Done'));
            console.log(stryMutAct_9fa48("2578") ? "Stryker was here!" : (stryCov_9fa48("2578"), ''));
            console.log(stryMutAct_9fa48("2579") ? "" : (stryCov_9fa48("2579"), 'For detailed process information, see: docs/agile/process.md'));
          }
        }
      }
    } catch (error) {
      if (stryMutAct_9fa48("2580")) {
        {}
      } else {
        stryCov_9fa48("2580");
        const message = error instanceof Error ? error.message : String(error);
        console.error(stryMutAct_9fa48("2581") ? `` : (stryCov_9fa48("2581"), `Error reading process document: ${message}`));
      }
    }
    return null;
  }
};
const handleList: CommandHandler = stryMutAct_9fa48("2582") ? () => undefined : (stryCov_9fa48("2582"), (() => {
  const handleList: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("2583")) {
      {}
    } else {
      stryCov_9fa48("2583");
      // Default columns to show
      const defaultColumns = stryMutAct_9fa48("2584") ? [] : (stryCov_9fa48("2584"), [stryMutAct_9fa48("2585") ? "" : (stryCov_9fa48("2585"), 'ready'), stryMutAct_9fa48("2586") ? "" : (stryCov_9fa48("2586"), 'todo'), stryMutAct_9fa48("2587") ? "" : (stryCov_9fa48("2587"), 'in_progress'), stryMutAct_9fa48("2588") ? "" : (stryCov_9fa48("2588"), 'in_review'), stryMutAct_9fa48("2589") ? "" : (stryCov_9fa48("2589"), 'document')]);

      // Parse optional columns filter
      let columnsToShow = defaultColumns;
      const showAll = stryMutAct_9fa48("2592") ? args.includes('--all') && args.includes('-a') : stryMutAct_9fa48("2591") ? false : stryMutAct_9fa48("2590") ? true : (stryCov_9fa48("2590", "2591", "2592"), args.includes(stryMutAct_9fa48("2593") ? "" : (stryCov_9fa48("2593"), '--all')) || args.includes(stryMutAct_9fa48("2594") ? "" : (stryCov_9fa48("2594"), '-a')));
      if (stryMutAct_9fa48("2596") ? false : stryMutAct_9fa48("2595") ? true : (stryCov_9fa48("2595", "2596"), showAll)) {
        if (stryMutAct_9fa48("2597")) {
          {}
        } else {
          stryCov_9fa48("2597");
          columnsToShow = board.columns.map(stryMutAct_9fa48("2598") ? () => undefined : (stryCov_9fa48("2598"), col => columnKey(col.name)));
        }
      } else {
        if (stryMutAct_9fa48("2599")) {
          {}
        } else {
          stryCov_9fa48("2599");
          const customColumns = stryMutAct_9fa48("2600") ? args : (stryCov_9fa48("2600"), args.filter(stryMutAct_9fa48("2601") ? () => undefined : (stryCov_9fa48("2601"), arg => stryMutAct_9fa48("2602") ? arg.startsWith('--') : (stryCov_9fa48("2602"), !(stryMutAct_9fa48("2603") ? arg.endsWith('--') : (stryCov_9fa48("2603"), arg.startsWith(stryMutAct_9fa48("2604") ? "" : (stryCov_9fa48("2604"), '--'))))))));
          if (stryMutAct_9fa48("2608") ? customColumns.length <= 0 : stryMutAct_9fa48("2607") ? customColumns.length >= 0 : stryMutAct_9fa48("2606") ? false : stryMutAct_9fa48("2605") ? true : (stryCov_9fa48("2605", "2606", "2607", "2608"), customColumns.length > 0)) {
            if (stryMutAct_9fa48("2609")) {
              {}
            } else {
              stryCov_9fa48("2609");
              columnsToShow = customColumns.map(stryMutAct_9fa48("2610") ? () => undefined : (stryCov_9fa48("2610"), col => columnKey(col)));
            }
          }
        }
      }
      console.log(stryMutAct_9fa48("2611") ? "" : (stryCov_9fa48("2611"), '📋 Kanban Board Status'));
      console.log(stryMutAct_9fa48("2612") ? "Stryker was here!" : (stryCov_9fa48("2612"), ''));
      let totalViolations = 0;
      const allTasks: any[] = stryMutAct_9fa48("2613") ? ["Stryker was here"] : (stryCov_9fa48("2613"), []);
      for (const columnName of columnsToShow) {
        if (stryMutAct_9fa48("2614")) {
          {}
        } else {
          stryCov_9fa48("2614");
          const column = board.columns.find(stryMutAct_9fa48("2615") ? () => undefined : (stryCov_9fa48("2615"), col => stryMutAct_9fa48("2618") ? columnKey(col.name) !== columnName : stryMutAct_9fa48("2617") ? false : stryMutAct_9fa48("2616") ? true : (stryCov_9fa48("2616", "2617", "2618"), columnKey(col.name) === columnName)));
          if (stryMutAct_9fa48("2621") ? false : stryMutAct_9fa48("2620") ? true : stryMutAct_9fa48("2619") ? column : (stryCov_9fa48("2619", "2620", "2621"), !column)) continue;
          const displayName = column.name;
          const taskCount = column.tasks.length;
          const limit = column.limit;

          // Check for WIP limit violations
          const wipViolation = stryMutAct_9fa48("2624") ? limit || taskCount > limit : stryMutAct_9fa48("2623") ? false : stryMutAct_9fa48("2622") ? true : (stryCov_9fa48("2622", "2623", "2624"), limit && (stryMutAct_9fa48("2627") ? taskCount <= limit : stryMutAct_9fa48("2626") ? taskCount >= limit : stryMutAct_9fa48("2625") ? true : (stryCov_9fa48("2625", "2626", "2627"), taskCount > limit)));
          if (stryMutAct_9fa48("2629") ? false : stryMutAct_9fa48("2628") ? true : (stryCov_9fa48("2628", "2629"), wipViolation)) stryMutAct_9fa48("2630") ? totalViolations-- : (stryCov_9fa48("2630"), totalViolations++);

          // Display column header with status indicators
          let statusIcon = stryMutAct_9fa48("2631") ? "" : (stryCov_9fa48("2631"), '✅');
          if (stryMutAct_9fa48("2633") ? false : stryMutAct_9fa48("2632") ? true : (stryCov_9fa48("2632", "2633"), wipViolation)) {
            if (stryMutAct_9fa48("2634")) {
              {}
            } else {
              stryCov_9fa48("2634");
              statusIcon = stryMutAct_9fa48("2635") ? "" : (stryCov_9fa48("2635"), '🚨');
            }
          } else if (stryMutAct_9fa48("2638") ? taskCount !== 0 : stryMutAct_9fa48("2637") ? false : stryMutAct_9fa48("2636") ? true : (stryCov_9fa48("2636", "2637", "2638"), taskCount === 0)) {
            if (stryMutAct_9fa48("2639")) {
              {}
            } else {
              stryCov_9fa48("2639");
              statusIcon = stryMutAct_9fa48("2640") ? "" : (stryCov_9fa48("2640"), '⭕');
            }
          } else if (stryMutAct_9fa48("2643") ? limit || taskCount >= limit * 0.8 : stryMutAct_9fa48("2642") ? false : stryMutAct_9fa48("2641") ? true : (stryCov_9fa48("2641", "2642", "2643"), limit && (stryMutAct_9fa48("2646") ? taskCount < limit * 0.8 : stryMutAct_9fa48("2645") ? taskCount > limit * 0.8 : stryMutAct_9fa48("2644") ? true : (stryCov_9fa48("2644", "2645", "2646"), taskCount >= (stryMutAct_9fa48("2647") ? limit / 0.8 : (stryCov_9fa48("2647"), limit * 0.8)))))) {
            if (stryMutAct_9fa48("2648")) {
              {}
            } else {
              stryCov_9fa48("2648");
              statusIcon = stryMutAct_9fa48("2649") ? "" : (stryCov_9fa48("2649"), '⚠️');
            }
          }
          console.log(stryMutAct_9fa48("2650") ? `` : (stryCov_9fa48("2650"), `${statusIcon} ${displayName} (${taskCount}${limit ? stryMutAct_9fa48("2651") ? `` : (stryCov_9fa48("2651"), `/${limit}`) : stryMutAct_9fa48("2652") ? "Stryker was here!" : (stryCov_9fa48("2652"), '')})`));
          if (stryMutAct_9fa48("2654") ? false : stryMutAct_9fa48("2653") ? true : (stryCov_9fa48("2653", "2654"), wipViolation)) {
            if (stryMutAct_9fa48("2655")) {
              {}
            } else {
              stryCov_9fa48("2655");
              console.log(stryMutAct_9fa48("2656") ? `` : (stryCov_9fa48("2656"), `   ❌ WIP LIMIT VIOLATION: ${taskCount} > ${limit}`));
            }
          }

          // Show tasks in this column
          if (stryMutAct_9fa48("2660") ? column.tasks.length <= 0 : stryMutAct_9fa48("2659") ? column.tasks.length >= 0 : stryMutAct_9fa48("2658") ? false : stryMutAct_9fa48("2657") ? true : (stryCov_9fa48("2657", "2658", "2659", "2660"), column.tasks.length > 0)) {
            if (stryMutAct_9fa48("2661")) {
              {}
            } else {
              stryCov_9fa48("2661");
              column.tasks.forEach(task => {
                if (stryMutAct_9fa48("2662")) {
                  {}
                } else {
                  stryCov_9fa48("2662");
                  const priority = task.priority ? stryMutAct_9fa48("2663") ? `` : (stryCov_9fa48("2663"), ` [${task.priority}]`) : stryMutAct_9fa48("2664") ? "Stryker was here!" : (stryCov_9fa48("2664"), '');
                  const uuid = stryMutAct_9fa48("2665") ? task.uuid : (stryCov_9fa48("2665"), task.uuid.slice(0, 8));
                  console.log(stryMutAct_9fa48("2666") ? `` : (stryCov_9fa48("2666"), `   • ${task.title}${priority} (${uuid}...)`));
                }
              });
              // Collect tasks for markdown output
              allTasks.push(...(stryMutAct_9fa48("2667") ? column.tasks : (stryCov_9fa48("2667"), column.tasks.slice())));
            }
          } else {
            if (stryMutAct_9fa48("2668")) {
              {}
            } else {
              stryCov_9fa48("2668");
              console.log(stryMutAct_9fa48("2669") ? `` : (stryCov_9fa48("2669"), `   (empty)`));
            }
          }
          console.log(stryMutAct_9fa48("2670") ? "Stryker was here!" : (stryCov_9fa48("2670"), ''));
        }
      }

      // Summary
      if (stryMutAct_9fa48("2674") ? totalViolations <= 0 : stryMutAct_9fa48("2673") ? totalViolations >= 0 : stryMutAct_9fa48("2672") ? false : stryMutAct_9fa48("2671") ? true : (stryCov_9fa48("2671", "2672", "2673", "2674"), totalViolations > 0)) {
        if (stryMutAct_9fa48("2675")) {
          {}
        } else {
          stryCov_9fa48("2675");
          console.log(stryMutAct_9fa48("2676") ? `` : (stryCov_9fa48("2676"), `🚨 ${totalViolations} process violation(s) found`));
        }
      } else {
        if (stryMutAct_9fa48("2677")) {
          {}
        } else {
          stryCov_9fa48("2677");
          console.log(stryMutAct_9fa48("2678") ? "" : (stryCov_9fa48("2678"), '✅ No process violations detected'));
        }
      }

      // Show WIP limits summary
      const limitedColumns = stryMutAct_9fa48("2679") ? board.columns : (stryCov_9fa48("2679"), board.columns.filter(stryMutAct_9fa48("2680") ? () => undefined : (stryCov_9fa48("2680"), col => col.limit)));
      if (stryMutAct_9fa48("2684") ? limitedColumns.length <= 0 : stryMutAct_9fa48("2683") ? limitedColumns.length >= 0 : stryMutAct_9fa48("2682") ? false : stryMutAct_9fa48("2681") ? true : (stryCov_9fa48("2681", "2682", "2683", "2684"), limitedColumns.length > 0)) {
        if (stryMutAct_9fa48("2685")) {
          {}
        } else {
          stryCov_9fa48("2685");
          console.log(stryMutAct_9fa48("2686") ? "Stryker was here!" : (stryCov_9fa48("2686"), ''));
          console.log(stryMutAct_9fa48("2687") ? "" : (stryCov_9fa48("2687"), '📊 WIP Limits Summary:'));
          limitedColumns.forEach(col => {
            if (stryMutAct_9fa48("2688")) {
              {}
            } else {
              stryCov_9fa48("2688");
              const percentage = col.limit ? Math.round(stryMutAct_9fa48("2689") ? col.tasks.length / col.limit / 100 : (stryCov_9fa48("2689"), (stryMutAct_9fa48("2690") ? col.tasks.length * col.limit : (stryCov_9fa48("2690"), col.tasks.length / col.limit)) * 100)) : 0;
              const status = (stryMutAct_9fa48("2694") ? percentage <= 100 : stryMutAct_9fa48("2693") ? percentage >= 100 : stryMutAct_9fa48("2692") ? false : stryMutAct_9fa48("2691") ? true : (stryCov_9fa48("2691", "2692", "2693", "2694"), percentage > 100)) ? stryMutAct_9fa48("2695") ? "" : (stryCov_9fa48("2695"), '🚨') : (stryMutAct_9fa48("2699") ? percentage <= 80 : stryMutAct_9fa48("2698") ? percentage >= 80 : stryMutAct_9fa48("2697") ? false : stryMutAct_9fa48("2696") ? true : (stryCov_9fa48("2696", "2697", "2698", "2699"), percentage > 80)) ? stryMutAct_9fa48("2700") ? "" : (stryCov_9fa48("2700"), '⚠️') : stryMutAct_9fa48("2701") ? "" : (stryCov_9fa48("2701"), '✅');
              console.log(stryMutAct_9fa48("2702") ? `` : (stryCov_9fa48("2702"), `   ${status} ${col.name}: ${col.tasks.length}/${col.limit} (${percentage}%)`));
            }
          });
        }
      }

      // Return tasks for markdown output, along with violations metadata
      return stryMutAct_9fa48("2703") ? {} : (stryCov_9fa48("2703"), {
        tasks: allTasks,
        violations: totalViolations
      });
    }
  });
  return handleList;
})());
const handleAudit: CommandHandler = stryMutAct_9fa48("2704") ? () => undefined : (stryCov_9fa48("2704"), (() => {
  const handleAudit: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("2705")) {
      {}
    } else {
      stryCov_9fa48("2705");
      const configResult = await loadKanbanConfig(stryMutAct_9fa48("2706") ? {} : (stryCov_9fa48("2706"), {
        argv: process.argv,
        env: process.env
      }));
      const eventLogManager = makeEventLogManager(configResult.config);
      const dryRun = stryMutAct_9fa48("2707") ? args.includes('--fix') : (stryCov_9fa48("2707"), !args.includes(stryMutAct_9fa48("2708") ? "" : (stryCov_9fa48("2708"), '--fix')));
      const verbose = args.includes(stryMutAct_9fa48("2709") ? "" : (stryCov_9fa48("2709"), '--verbose'));
      const columnFilter = stryMutAct_9fa48("2710") ? args.find(arg => arg.startsWith('--column=')).split('=')[1] : (stryCov_9fa48("2710"), args.find(stryMutAct_9fa48("2711") ? () => undefined : (stryCov_9fa48("2711"), arg => stryMutAct_9fa48("2712") ? arg.endsWith('--column=') : (stryCov_9fa48("2712"), arg.startsWith(stryMutAct_9fa48("2713") ? "" : (stryCov_9fa48("2713"), '--column=')))))?.split(stryMutAct_9fa48("2714") ? "" : (stryCov_9fa48("2714"), '='))[1]);
      console.log(stryMutAct_9fa48("2715") ? `` : (stryCov_9fa48("2715"), `🔍 Kanban Audit ${dryRun ? stryMutAct_9fa48("2716") ? "" : (stryCov_9fa48("2716"), '(DRY RUN)') : stryMutAct_9fa48("2717") ? "" : (stryCov_9fa48("2717"), '(FIX MODE)')}`));
      if (stryMutAct_9fa48("2719") ? false : stryMutAct_9fa48("2718") ? true : (stryCov_9fa48("2718", "2719"), columnFilter)) {
        if (stryMutAct_9fa48("2720")) {
          {}
        } else {
          stryCov_9fa48("2720");
          console.log(stryMutAct_9fa48("2721") ? `` : (stryCov_9fa48("2721"), `📋 Filtering by column: ${columnFilter}`));
        }
      }
      console.log(stryMutAct_9fa48("2722") ? "Stryker was here!" : (stryCov_9fa48("2722"), ''));

      // Get all task histories from event log
      const allHistories = await eventLogManager.getAllTaskHistories();
      const allEvents = await eventLogManager.readEventLog();

      // Initialize git tracker for commit validation
      const gitTracker = new TaskGitTracker(stryMutAct_9fa48("2723") ? {} : (stryCov_9fa48("2723"), {
        repoRoot: process.cwd()
      }));
      console.log(stryMutAct_9fa48("2724") ? "" : (stryCov_9fa48("2724"), '🔍 Analyzing task state consistency...'));

      // Collect all tasks for concurrent processing
      const allTasks = board.columns.flatMap(column => {
        if (stryMutAct_9fa48("2725")) {
          {}
        } else {
          stryCov_9fa48("2725");
          if (stryMutAct_9fa48("2728") ? columnFilter || columnKey(column.name) !== columnKey(columnFilter) : stryMutAct_9fa48("2727") ? false : stryMutAct_9fa48("2726") ? true : (stryCov_9fa48("2726", "2727", "2728"), columnFilter && (stryMutAct_9fa48("2730") ? columnKey(column.name) === columnKey(columnFilter) : stryMutAct_9fa48("2729") ? true : (stryCov_9fa48("2729", "2730"), columnKey(column.name) !== columnKey(columnFilter))))) {
            if (stryMutAct_9fa48("2731")) {
              {}
            } else {
              stryCov_9fa48("2731");
              return stryMutAct_9fa48("2732") ? ["Stryker was here"] : (stryCov_9fa48("2732"), []);
            }
          }
          return column.tasks.map(stryMutAct_9fa48("2733") ? () => undefined : (stryCov_9fa48("2733"), task => stryMutAct_9fa48("2734") ? {} : (stryCov_9fa48("2734"), {
            task,
            columnName: column.name
          })));
        }
      });
      const totalTasks = allTasks.length;
      let processedTasks = 0;

      // Process all tasks concurrently
      const taskAnalyses = await Promise.all(allTasks.map(async ({
        task,
        columnName
      }) => {
        if (stryMutAct_9fa48("2735")) {
          {}
        } else {
          stryCov_9fa48("2735");
          const [replayResult, taskFilePath] = await Promise.all(stryMutAct_9fa48("2736") ? [] : (stryCov_9fa48("2736"), [eventLogManager.replayTaskTransitions(task.uuid, task.status), findTaskFilePath(context.tasksDir, task.uuid)]));
          const statusAnalysis = gitTracker.analyzeTaskStatus(task, stryMutAct_9fa48("2739") ? taskFilePath && `${context.tasksDir}/${task.uuid}.md` : stryMutAct_9fa48("2738") ? false : stryMutAct_9fa48("2737") ? true : (stryCov_9fa48("2737", "2738", "2739"), taskFilePath || (stryMutAct_9fa48("2740") ? `` : (stryCov_9fa48("2740"), `${context.tasksDir}/${task.uuid}.md`))));

          // Update progress
          stryMutAct_9fa48("2741") ? processedTasks-- : (stryCov_9fa48("2741"), processedTasks++);
          if (stryMutAct_9fa48("2744") ? processedTasks % 50 === 0 && processedTasks === totalTasks : stryMutAct_9fa48("2743") ? false : stryMutAct_9fa48("2742") ? true : (stryCov_9fa48("2742", "2743", "2744"), (stryMutAct_9fa48("2746") ? processedTasks % 50 !== 0 : stryMutAct_9fa48("2745") ? false : (stryCov_9fa48("2745", "2746"), (stryMutAct_9fa48("2747") ? processedTasks * 50 : (stryCov_9fa48("2747"), processedTasks % 50)) === 0)) || (stryMutAct_9fa48("2749") ? processedTasks !== totalTasks : stryMutAct_9fa48("2748") ? false : (stryCov_9fa48("2748", "2749"), processedTasks === totalTasks)))) {
            if (stryMutAct_9fa48("2750")) {
              {}
            } else {
              stryCov_9fa48("2750");
              process.stderr.write(stryMutAct_9fa48("2751") ? `` : (stryCov_9fa48("2751"), `\r📊 Progress: ${processedTasks}/${totalTasks} (${Math.round(stryMutAct_9fa48("2752") ? processedTasks / totalTasks / 100 : (stryCov_9fa48("2752"), (stryMutAct_9fa48("2753") ? processedTasks * totalTasks : (stryCov_9fa48("2753"), processedTasks / totalTasks)) * 100))}%)`));
            }
          }
          return stryMutAct_9fa48("2754") ? {} : (stryCov_9fa48("2754"), {
            task,
            columnName,
            replayResult,
            taskFilePath,
            statusAnalysis
          });
        }
      }));
      process.stderr.write(stryMutAct_9fa48("2755") ? "" : (stryCov_9fa48("2755"), '\r✅ Analysis complete\n'));

      // Aggregate results
      const results = stryMutAct_9fa48("2756") ? {} : (stryCov_9fa48("2756"), {
        inconsistencies: [] as Array<{
          task: any;
          current: string;
          expected: string;
          invalidEvent?: any;
        }>,
        orphanedTasks: [] as Array<{
          task: any;
          issues: string[];
          recommendations: string[];
        }>,
        untrackedTasks: [] as Array<{
          task: any;
          issues: string[];
          recommendations: string[];
        }>,
        tasksWithIssues: [] as Array<{
          task: any;
          issues: string[];
          recommendations: string[];
        }>,
        healthyTasks: 0
      });
      for (const analysis of taskAnalyses) {
        if (stryMutAct_9fa48("2757")) {
          {}
        } else {
          stryCov_9fa48("2757");
          const {
            task,
            replayResult,
            statusAnalysis
          } = analysis;
          if (stryMutAct_9fa48("2759") ? false : stryMutAct_9fa48("2758") ? true : (stryCov_9fa48("2758", "2759"), statusAnalysis.isTrulyOrphaned)) {
            if (stryMutAct_9fa48("2760")) {
              {}
            } else {
              stryCov_9fa48("2760");
              results.orphanedTasks.push(stryMutAct_9fa48("2761") ? {} : (stryCov_9fa48("2761"), {
                task,
                issues: statusAnalysis.issues,
                recommendations: statusAnalysis.recommendations
              }));
            }
          } else if (stryMutAct_9fa48("2763") ? false : stryMutAct_9fa48("2762") ? true : (stryCov_9fa48("2762", "2763"), statusAnalysis.isUntracked)) {
            if (stryMutAct_9fa48("2764")) {
              {}
            } else {
              stryCov_9fa48("2764");
              results.untrackedTasks.push(stryMutAct_9fa48("2765") ? {} : (stryCov_9fa48("2765"), {
                task,
                issues: statusAnalysis.issues,
                recommendations: statusAnalysis.recommendations
              }));
            }
          } else if (stryMutAct_9fa48("2768") ? false : stryMutAct_9fa48("2767") ? true : stryMutAct_9fa48("2766") ? statusAnalysis.isHealthy : (stryCov_9fa48("2766", "2767", "2768"), !statusAnalysis.isHealthy)) {
            if (stryMutAct_9fa48("2769")) {
              {}
            } else {
              stryCov_9fa48("2769");
              results.tasksWithIssues.push(stryMutAct_9fa48("2770") ? {} : (stryCov_9fa48("2770"), {
                task,
                issues: statusAnalysis.issues,
                recommendations: statusAnalysis.recommendations
              }));
            }
          } else {
            if (stryMutAct_9fa48("2771")) {
              {}
            } else {
              stryCov_9fa48("2771");
              stryMutAct_9fa48("2772") ? results.healthyTasks-- : (stryCov_9fa48("2772"), results.healthyTasks++);
            }
          }
          if (stryMutAct_9fa48("2775") ? replayResult.finalStatus === task.status : stryMutAct_9fa48("2774") ? false : stryMutAct_9fa48("2773") ? true : (stryCov_9fa48("2773", "2774", "2775"), replayResult.finalStatus !== task.status)) {
            if (stryMutAct_9fa48("2776")) {
              {}
            } else {
              stryCov_9fa48("2776");
              results.inconsistencies.push(stryMutAct_9fa48("2777") ? {} : (stryCov_9fa48("2777"), {
                task,
                current: task.status,
                expected: replayResult.finalStatus,
                invalidEvent: replayResult.invalidEvent
              }));
            }
          }
        }
      }

      // Calculate counts for compatibility
      const inconsistenciesFound = results.inconsistencies.length;
      const illegalTransitionsFound = stryMutAct_9fa48("2778") ? results.inconsistencies.length : (stryCov_9fa48("2778"), results.inconsistencies.filter(stryMutAct_9fa48("2779") ? () => undefined : (stryCov_9fa48("2779"), inc => inc.invalidEvent)).length);
      const orphanedTasksFound = results.orphanedTasks.length;
      const untrackedTasksFound = results.untrackedTasks.length;
      const healthyTasksFound = results.healthyTasks;
      let inconsistenciesFixed = 0;

      // Output results
      if (stryMutAct_9fa48("2782") ? false : stryMutAct_9fa48("2781") ? true : stryMutAct_9fa48("2780") ? verbose : (stryCov_9fa48("2780", "2781", "2782"), !verbose)) {
        if (stryMutAct_9fa48("2783")) {
          {}
        } else {
          stryCov_9fa48("2783");
          // Summarized output for normal mode (default)
          console.log(stryMutAct_9fa48("2784") ? `` : (stryCov_9fa48("2784"), `📊 AUDIT RESULTS:`));
          console.log(stryMutAct_9fa48("2785") ? `` : (stryCov_9fa48("2785"), `   ✅ Healthy tasks: ${healthyTasksFound}`));
          if (stryMutAct_9fa48("2789") ? inconsistenciesFound <= 0 : stryMutAct_9fa48("2788") ? inconsistenciesFound >= 0 : stryMutAct_9fa48("2787") ? false : stryMutAct_9fa48("2786") ? true : (stryCov_9fa48("2786", "2787", "2788", "2789"), inconsistenciesFound > 0)) {
            if (stryMutAct_9fa48("2790")) {
              {}
            } else {
              stryCov_9fa48("2790");
              console.log(stryMutAct_9fa48("2791") ? `` : (stryCov_9fa48("2791"), `   ❌ Inconsistencies: ${inconsistenciesFound}`));
            }
          }
          if (stryMutAct_9fa48("2795") ? illegalTransitionsFound <= 0 : stryMutAct_9fa48("2794") ? illegalTransitionsFound >= 0 : stryMutAct_9fa48("2793") ? false : stryMutAct_9fa48("2792") ? true : (stryCov_9fa48("2792", "2793", "2794", "2795"), illegalTransitionsFound > 0)) {
            if (stryMutAct_9fa48("2796")) {
              {}
            } else {
              stryCov_9fa48("2796");
              console.log(stryMutAct_9fa48("2797") ? `` : (stryCov_9fa48("2797"), `   🚨 Illegal transitions: ${illegalTransitionsFound}`));
            }
          }
          if (stryMutAct_9fa48("2801") ? orphanedTasksFound <= 0 : stryMutAct_9fa48("2800") ? orphanedTasksFound >= 0 : stryMutAct_9fa48("2799") ? false : stryMutAct_9fa48("2798") ? true : (stryCov_9fa48("2798", "2799", "2800", "2801"), orphanedTasksFound > 0)) {
            if (stryMutAct_9fa48("2802")) {
              {}
            } else {
              stryCov_9fa48("2802");
              console.log(stryMutAct_9fa48("2803") ? `` : (stryCov_9fa48("2803"), `   🚨 Orphaned tasks: ${orphanedTasksFound}`));
            }
          }
          if (stryMutAct_9fa48("2807") ? untrackedTasksFound <= 0 : stryMutAct_9fa48("2806") ? untrackedTasksFound >= 0 : stryMutAct_9fa48("2805") ? false : stryMutAct_9fa48("2804") ? true : (stryCov_9fa48("2804", "2805", "2806", "2807"), untrackedTasksFound > 0)) {
            if (stryMutAct_9fa48("2808")) {
              {}
            } else {
              stryCov_9fa48("2808");
              console.log(stryMutAct_9fa48("2809") ? `` : (stryCov_9fa48("2809"), `   ⚠️  Untracked tasks: ${untrackedTasksFound}`));
            }
          }
          if (stryMutAct_9fa48("2813") ? results.tasksWithIssues.length <= 0 : stryMutAct_9fa48("2812") ? results.tasksWithIssues.length >= 0 : stryMutAct_9fa48("2811") ? false : stryMutAct_9fa48("2810") ? true : (stryCov_9fa48("2810", "2811", "2812", "2813"), results.tasksWithIssues.length > 0)) {
            if (stryMutAct_9fa48("2814")) {
              {}
            } else {
              stryCov_9fa48("2814");
              console.log(stryMutAct_9fa48("2815") ? `` : (stryCov_9fa48("2815"), `   ⚠️  Tasks with issues: ${results.tasksWithIssues.length}`));
            }
          }
          console.log(stryMutAct_9fa48("2816") ? "Stryker was here!" : (stryCov_9fa48("2816"), ''));
          if (stryMutAct_9fa48("2819") ? (inconsistenciesFound > 0 || orphanedTasksFound > 0) && untrackedTasksFound > 0 : stryMutAct_9fa48("2818") ? false : stryMutAct_9fa48("2817") ? true : (stryCov_9fa48("2817", "2818", "2819"), (stryMutAct_9fa48("2821") ? inconsistenciesFound > 0 && orphanedTasksFound > 0 : stryMutAct_9fa48("2820") ? false : (stryCov_9fa48("2820", "2821"), (stryMutAct_9fa48("2824") ? inconsistenciesFound <= 0 : stryMutAct_9fa48("2823") ? inconsistenciesFound >= 0 : stryMutAct_9fa48("2822") ? false : (stryCov_9fa48("2822", "2823", "2824"), inconsistenciesFound > 0)) || (stryMutAct_9fa48("2827") ? orphanedTasksFound <= 0 : stryMutAct_9fa48("2826") ? orphanedTasksFound >= 0 : stryMutAct_9fa48("2825") ? false : (stryCov_9fa48("2825", "2826", "2827"), orphanedTasksFound > 0)))) || (stryMutAct_9fa48("2830") ? untrackedTasksFound <= 0 : stryMutAct_9fa48("2829") ? untrackedTasksFound >= 0 : stryMutAct_9fa48("2828") ? false : (stryCov_9fa48("2828", "2829", "2830"), untrackedTasksFound > 0)))) {
            if (stryMutAct_9fa48("2831")) {
              {}
            } else {
              stryCov_9fa48("2831");
              console.log(stryMutAct_9fa48("2832") ? "" : (stryCov_9fa48("2832"), '💡 Use --verbose for detailed breakdown'));
              if (stryMutAct_9fa48("2834") ? false : stryMutAct_9fa48("2833") ? true : (stryCov_9fa48("2833", "2834"), dryRun)) {
                if (stryMutAct_9fa48("2835")) {
                  {}
                } else {
                  stryCov_9fa48("2835");
                  console.log(stryMutAct_9fa48("2836") ? "" : (stryCov_9fa48("2836"), '💡 Use --fix to automatically correct inconsistencies'));
                }
              }
            }
          }
        }
      } else {
        if (stryMutAct_9fa48("2837")) {
          {}
        } else {
          stryCov_9fa48("2837");
          // Detailed output for verbose mode
          for (const orphaned of results.orphanedTasks) {
            if (stryMutAct_9fa48("2838")) {
              {}
            } else {
              stryCov_9fa48("2838");
              console.log(stryMutAct_9fa48("2839") ? `` : (stryCov_9fa48("2839"), `🚨 TRULY ORPHANED TASK: "${orphaned.task.title}"`));
              console.log(stryMutAct_9fa48("2840") ? `` : (stryCov_9fa48("2840"), `   Task ID: ${orphaned.task.uuid}`));
              console.log(stryMutAct_9fa48("2841") ? `` : (stryCov_9fa48("2841"), `   Status: ${orphaned.task.status}`));
              console.log(stryMutAct_9fa48("2842") ? `` : (stryCov_9fa48("2842"), `   Issues: ${orphaned.issues.join(stryMutAct_9fa48("2843") ? "" : (stryCov_9fa48("2843"), ', '))}`));
              console.log(stryMutAct_9fa48("2844") ? `` : (stryCov_9fa48("2844"), `   Recommendations:`));
              orphaned.recommendations.forEach(stryMutAct_9fa48("2845") ? () => undefined : (stryCov_9fa48("2845"), rec => console.log(stryMutAct_9fa48("2846") ? `` : (stryCov_9fa48("2846"), `     • ${rec}`))));
              console.log(stryMutAct_9fa48("2847") ? "Stryker was here!" : (stryCov_9fa48("2847"), ''));
            }
          }
          for (const untracked of results.untrackedTasks) {
            if (stryMutAct_9fa48("2848")) {
              {}
            } else {
              stryCov_9fa48("2848");
              console.log(stryMutAct_9fa48("2849") ? `` : (stryCov_9fa48("2849"), `⚠️  UNTRACKED TASK: "${untracked.task.title}"`));
              console.log(stryMutAct_9fa48("2850") ? `` : (stryCov_9fa48("2850"), `   Task ID: ${untracked.task.uuid}`));
              console.log(stryMutAct_9fa48("2851") ? `` : (stryCov_9fa48("2851"), `   Status: ${untracked.task.status}`));
              console.log(stryMutAct_9fa48("2852") ? `` : (stryCov_9fa48("2852"), `   Issues: ${untracked.issues.join(stryMutAct_9fa48("2853") ? "" : (stryCov_9fa48("2853"), ', '))}`));
              console.log(stryMutAct_9fa48("2854") ? `` : (stryCov_9fa48("2854"), `   Recommendations:`));
              untracked.recommendations.forEach(stryMutAct_9fa48("2855") ? () => undefined : (stryCov_9fa48("2855"), rec => console.log(stryMutAct_9fa48("2856") ? `` : (stryCov_9fa48("2856"), `     • ${rec}`))));
              console.log(stryMutAct_9fa48("2857") ? "Stryker was here!" : (stryCov_9fa48("2857"), ''));
            }
          }
          for (const issue of results.tasksWithIssues) {
            if (stryMutAct_9fa48("2858")) {
              {}
            } else {
              stryCov_9fa48("2858");
              console.log(stryMutAct_9fa48("2859") ? `` : (stryCov_9fa48("2859"), `⚠️  TASK WITH ISSUES: "${issue.task.title}"`));
              console.log(stryMutAct_9fa48("2860") ? `` : (stryCov_9fa48("2860"), `   Task ID: ${issue.task.uuid}`));
              console.log(stryMutAct_9fa48("2861") ? `` : (stryCov_9fa48("2861"), `   Status: ${issue.task.status}`));
              console.log(stryMutAct_9fa48("2862") ? `` : (stryCov_9fa48("2862"), `   Issues: ${issue.issues.join(stryMutAct_9fa48("2863") ? "" : (stryCov_9fa48("2863"), ', '))}`));
              console.log(stryMutAct_9fa48("2864") ? `` : (stryCov_9fa48("2864"), `   Recommendations:`));
              issue.recommendations.forEach(stryMutAct_9fa48("2865") ? () => undefined : (stryCov_9fa48("2865"), rec => console.log(stryMutAct_9fa48("2866") ? `` : (stryCov_9fa48("2866"), `     • ${rec}`))));
              console.log(stryMutAct_9fa48("2867") ? "Stryker was here!" : (stryCov_9fa48("2867"), ''));
            }
          }
          for (const inconsistency of results.inconsistencies) {
            if (stryMutAct_9fa48("2868")) {
              {}
            } else {
              stryCov_9fa48("2868");
              console.log(stryMutAct_9fa48("2869") ? `` : (stryCov_9fa48("2869"), `❌ INCONSISTENCY: Task "${inconsistency.task.title}"`));
              console.log(stryMutAct_9fa48("2870") ? `` : (stryCov_9fa48("2870"), `   Current status: ${inconsistency.current}`));
              console.log(stryMutAct_9fa48("2871") ? `` : (stryCov_9fa48("2871"), `   Expected status: ${inconsistency.expected}`));
              console.log(stryMutAct_9fa48("2872") ? `` : (stryCov_9fa48("2872"), `   Task ID: ${inconsistency.task.uuid}`));
              if (stryMutAct_9fa48("2874") ? false : stryMutAct_9fa48("2873") ? true : (stryCov_9fa48("2873", "2874"), inconsistency.invalidEvent)) {
                if (stryMutAct_9fa48("2875")) {
                  {}
                } else {
                  stryCov_9fa48("2875");
                  console.log(stryMutAct_9fa48("2876") ? `` : (stryCov_9fa48("2876"), `   🚨 ILLEGAL TRANSITION: ${inconsistency.invalidEvent.fromStatus} → ${inconsistency.invalidEvent.toStatus}`));
                  console.log(stryMutAct_9fa48("2877") ? `` : (stryCov_9fa48("2877"), `   Event ID: ${inconsistency.invalidEvent.id}`));
                  console.log(stryMutAct_9fa48("2878") ? `` : (stryCov_9fa48("2878"), `   Timestamp: ${inconsistency.invalidEvent.timestamp}`));
                }
              }
              if (stryMutAct_9fa48("2881") ? false : stryMutAct_9fa48("2880") ? true : stryMutAct_9fa48("2879") ? dryRun : (stryCov_9fa48("2879", "2880", "2881"), !dryRun)) {
                if (stryMutAct_9fa48("2882")) {
                  {}
                } else {
                  stryCov_9fa48("2882");
                  try {
                    if (stryMutAct_9fa48("2883")) {
                      {}
                    } else {
                      stryCov_9fa48("2883");
                      // Fix the task status
                      await updateStatus(board as Board, inconsistency.task.uuid, inconsistency.expected, context.boardFile, context.tasksDir, undefined, stryMutAct_9fa48("2884") ? `` : (stryCov_9fa48("2884"), `Audit correction: Reset to last valid state from event log`), eventLogManager, stryMutAct_9fa48("2885") ? "" : (stryCov_9fa48("2885"), 'system'));
                      stryMutAct_9fa48("2886") ? inconsistenciesFixed-- : (stryCov_9fa48("2886"), inconsistenciesFixed++);
                      console.log(stryMutAct_9fa48("2887") ? `` : (stryCov_9fa48("2887"), `   ✅ FIXED: Status reset to ${inconsistency.expected}`));
                    }
                  } catch (error) {
                    if (stryMutAct_9fa48("2888")) {
                      {}
                    } else {
                      stryCov_9fa48("2888");
                      console.log(stryMutAct_9fa48("2889") ? `` : (stryCov_9fa48("2889"), `   ❌ FAILED TO FIX: ${error}`));
                    }
                  }
                }
              }
              console.log(stryMutAct_9fa48("2890") ? "Stryker was here!" : (stryCov_9fa48("2890"), ''));
            }
          }
        }
      }

      // Check for tasks that exist in event log but not in board
      const boardTaskIds = new Set(allTasks.map(stryMutAct_9fa48("2891") ? () => undefined : (stryCov_9fa48("2891"), ({
        task
      }) => task.uuid)));
      const orphanedEvents = stryMutAct_9fa48("2892") ? Array.from(allHistories.entries()).map(([taskId, events]) => ({
        taskId,
        events
      })) : (stryCov_9fa48("2892"), Array.from(allHistories.entries()).filter(stryMutAct_9fa48("2893") ? () => undefined : (stryCov_9fa48("2893"), ([taskId, events]) => stryMutAct_9fa48("2896") ? !boardTaskIds.has(taskId) || events.length > 0 : stryMutAct_9fa48("2895") ? false : stryMutAct_9fa48("2894") ? true : (stryCov_9fa48("2894", "2895", "2896"), (stryMutAct_9fa48("2897") ? boardTaskIds.has(taskId) : (stryCov_9fa48("2897"), !boardTaskIds.has(taskId))) && (stryMutAct_9fa48("2900") ? events.length <= 0 : stryMutAct_9fa48("2899") ? events.length >= 0 : stryMutAct_9fa48("2898") ? true : (stryCov_9fa48("2898", "2899", "2900"), events.length > 0))))).map(stryMutAct_9fa48("2901") ? () => undefined : (stryCov_9fa48("2901"), ([taskId, events]) => stryMutAct_9fa48("2902") ? {} : (stryCov_9fa48("2902"), {
        taskId,
        events
      }))));
      if (stryMutAct_9fa48("2906") ? orphanedEvents.length <= 0 : stryMutAct_9fa48("2905") ? orphanedEvents.length >= 0 : stryMutAct_9fa48("2904") ? false : stryMutAct_9fa48("2903") ? true : (stryCov_9fa48("2903", "2904", "2905", "2906"), orphanedEvents.length > 0)) {
        if (stryMutAct_9fa48("2907")) {
          {}
        } else {
          stryCov_9fa48("2907");
          if (stryMutAct_9fa48("2909") ? false : stryMutAct_9fa48("2908") ? true : (stryCov_9fa48("2908", "2909"), verbose)) {
            if (stryMutAct_9fa48("2910")) {
              {}
            } else {
              stryCov_9fa48("2910");
              for (const {
                taskId,
                events
              } of orphanedEvents) {
                if (stryMutAct_9fa48("2911")) {
                  {}
                } else {
                  stryCov_9fa48("2911");
                  console.log(stryMutAct_9fa48("2912") ? `` : (stryCov_9fa48("2912"), `⚠️  ORPHANED EVENTS: Task ${taskId} has ${events.length} events but not found in board`));
                  const lastEvent = events[stryMutAct_9fa48("2913") ? events.length + 1 : (stryCov_9fa48("2913"), events.length - 1)];
                  if (stryMutAct_9fa48("2915") ? false : stryMutAct_9fa48("2914") ? true : (stryCov_9fa48("2914", "2915"), lastEvent)) {
                    if (stryMutAct_9fa48("2916")) {
                      {}
                    } else {
                      stryCov_9fa48("2916");
                      console.log(stryMutAct_9fa48("2917") ? `` : (stryCov_9fa48("2917"), `   Last event: ${lastEvent.toStatus} at ${lastEvent.timestamp}`));
                    }
                  }
                  console.log(stryMutAct_9fa48("2918") ? "Stryker was here!" : (stryCov_9fa48("2918"), ''));
                }
              }
            }
          } else {
            if (stryMutAct_9fa48("2919")) {
              {}
            } else {
              stryCov_9fa48("2919");
              console.log(stryMutAct_9fa48("2920") ? `` : (stryCov_9fa48("2920"), `⚠️  Orphaned events: ${orphanedEvents.length} tasks have events but not in board`));
            }
          }
        }
      }

      // Handle untracked tasks in fix mode
      if (stryMutAct_9fa48("2923") ? !dryRun || untrackedTasksFound > 0 : stryMutAct_9fa48("2922") ? false : stryMutAct_9fa48("2921") ? true : (stryCov_9fa48("2921", "2922", "2923"), (stryMutAct_9fa48("2924") ? dryRun : (stryCov_9fa48("2924"), !dryRun)) && (stryMutAct_9fa48("2927") ? untrackedTasksFound <= 0 : stryMutAct_9fa48("2926") ? untrackedTasksFound >= 0 : stryMutAct_9fa48("2925") ? true : (stryCov_9fa48("2925", "2926", "2927"), untrackedTasksFound > 0)))) {
        if (stryMutAct_9fa48("2928")) {
          {}
        } else {
          stryCov_9fa48("2928");
          console.log(stryMutAct_9fa48("2929") ? "" : (stryCov_9fa48("2929"), '🔧 UNTRACKED TASKS:'));
          console.log(stryMutAct_9fa48("2930") ? "" : (stryCov_9fa48("2930"), '📝 Commit tracking will be updated automatically on next kanban operation'));
          console.log(stryMutAct_9fa48("2931") ? "Stryker was here!" : (stryCov_9fa48("2931"), ''));
          if (stryMutAct_9fa48("2933") ? false : stryMutAct_9fa48("2932") ? true : (stryCov_9fa48("2932", "2933"), verbose)) {
            if (stryMutAct_9fa48("2934")) {
              {}
            } else {
              stryCov_9fa48("2934");
              for (const untracked of results.untrackedTasks) {
                if (stryMutAct_9fa48("2935")) {
                  {}
                } else {
                  stryCov_9fa48("2935");
                  console.log(stryMutAct_9fa48("2936") ? `` : (stryCov_9fa48("2936"), `⚠️  UNTRACKED TASK: "${untracked.task.title}"`));
                  console.log(stryMutAct_9fa48("2937") ? `` : (stryCov_9fa48("2937"), `   Task ID: ${untracked.task.uuid}`));
                  console.log(stryMutAct_9fa48("2938") ? `` : (stryCov_9fa48("2938"), `   Status: ${untracked.task.status}`));
                  console.log(stryMutAct_9fa48("2939") ? `` : (stryCov_9fa48("2939"), `   Recommendation: Commit tracking will be updated on next operation`));
                  console.log(stryMutAct_9fa48("2940") ? "Stryker was here!" : (stryCov_9fa48("2940"), ''));
                }
              }
            }
          }
        }
      }

      // Pantheon-driven column normalization
      const canonicalStatuses = Array.from(stryMutAct_9fa48("2941") ? configResult.config.statusValues && [] : (stryCov_9fa48("2941"), configResult.config.statusValues ?? (stryMutAct_9fa48("2942") ? ["Stryker was here"] : (stryCov_9fa48("2942"), []))));
      const columnAnalysis = await analyzeColumnNormalization(board.columns.map(stryMutAct_9fa48("2943") ? () => undefined : (stryCov_9fa48("2943"), col => col.name)), canonicalStatuses);
      const actionableGroups = stryMutAct_9fa48("2944") ? columnAnalysis.groups : (stryCov_9fa48("2944"), columnAnalysis.groups.filter(stryMutAct_9fa48("2945") ? () => undefined : (stryCov_9fa48("2945"), group => stryMutAct_9fa48("2946") ? group.members.every(member => member.action !== 'keep') : (stryCov_9fa48("2946"), group.members.some(stryMutAct_9fa48("2947") ? () => undefined : (stryCov_9fa48("2947"), member => stryMutAct_9fa48("2950") ? member.action === 'keep' : stryMutAct_9fa48("2949") ? false : stryMutAct_9fa48("2948") ? true : (stryCov_9fa48("2948", "2949", "2950"), member.action !== (stryMutAct_9fa48("2951") ? "" : (stryCov_9fa48("2951"), 'keep')))))))));
      if (stryMutAct_9fa48("2955") ? actionableGroups.length <= 0 : stryMutAct_9fa48("2954") ? actionableGroups.length >= 0 : stryMutAct_9fa48("2953") ? false : stryMutAct_9fa48("2952") ? true : (stryCov_9fa48("2952", "2953", "2954", "2955"), actionableGroups.length > 0)) {
        if (stryMutAct_9fa48("2956")) {
          {}
        } else {
          stryCov_9fa48("2956");
          console.log(stryMutAct_9fa48("2957") ? "" : (stryCov_9fa48("2957"), '🧠 Pantheon Workflow: Column Normalization'));
          for (const group of actionableGroups) {
            if (stryMutAct_9fa48("2958")) {
              {}
            } else {
              stryCov_9fa48("2958");
              console.log(stryMutAct_9fa48("2959") ? `` : (stryCov_9fa48("2959"), `   Canonical column "${group.canonicalName}":`));
              for (const member of group.members) {
                if (stryMutAct_9fa48("2960")) {
                  {}
                } else {
                  stryCov_9fa48("2960");
                  if (stryMutAct_9fa48("2963") ? member.action !== 'keep' : stryMutAct_9fa48("2962") ? false : stryMutAct_9fa48("2961") ? true : (stryCov_9fa48("2961", "2962", "2963"), member.action === (stryMutAct_9fa48("2964") ? "" : (stryCov_9fa48("2964"), 'keep')))) continue;
                  const verb = (stryMutAct_9fa48("2967") ? member.action !== 'merge' : stryMutAct_9fa48("2966") ? false : stryMutAct_9fa48("2965") ? true : (stryCov_9fa48("2965", "2966", "2967"), member.action === (stryMutAct_9fa48("2968") ? "" : (stryCov_9fa48("2968"), 'merge')))) ? stryMutAct_9fa48("2969") ? "" : (stryCov_9fa48("2969"), 'merge into') : stryMutAct_9fa48("2970") ? "" : (stryCov_9fa48("2970"), 'rename to');
                  console.log(stryMutAct_9fa48("2971") ? `` : (stryCov_9fa48("2971"), `     • ${member.originalName} → ${verb} ${group.canonicalName} (${member.reason})`));
                }
              }
            }
          }
          if (stryMutAct_9fa48("2973") ? false : stryMutAct_9fa48("2972") ? true : (stryCov_9fa48("2972", "2973"), dryRun)) {
            if (stryMutAct_9fa48("2974")) {
              {}
            } else {
              stryCov_9fa48("2974");
              console.log(stryMutAct_9fa48("2975") ? "" : (stryCov_9fa48("2975"), '   💡 Run with --fix to apply these column normalization changes automatically'));
            }
          } else {
            if (stryMutAct_9fa48("2976")) {
              {}
            } else {
              stryCov_9fa48("2976");
              const applied = applyColumnNormalization(board as Board, columnAnalysis);
              if (stryMutAct_9fa48("2980") ? applied <= 0 : stryMutAct_9fa48("2979") ? applied >= 0 : stryMutAct_9fa48("2978") ? false : stryMutAct_9fa48("2977") ? true : (stryCov_9fa48("2977", "2978", "2979", "2980"), applied > 0)) {
                if (stryMutAct_9fa48("2981")) {
                  {}
                } else {
                  stryCov_9fa48("2981");
                  await writeBoard(context.boardFile, board as Board);
                  console.log(stryMutAct_9fa48("2982") ? `` : (stryCov_9fa48("2982"), `   ✅ Applied ${applied} column normalization ${(stryMutAct_9fa48("2985") ? applied !== 1 : stryMutAct_9fa48("2984") ? false : stryMutAct_9fa48("2983") ? true : (stryCov_9fa48("2983", "2984", "2985"), applied === 1)) ? stryMutAct_9fa48("2986") ? "" : (stryCov_9fa48("2986"), 'update') : stryMutAct_9fa48("2987") ? "" : (stryCov_9fa48("2987"), 'updates')}`));
                }
              } else {
                if (stryMutAct_9fa48("2988")) {
                  {}
                } else {
                  stryCov_9fa48("2988");
                  console.log(stryMutAct_9fa48("2989") ? "" : (stryCov_9fa48("2989"), '   ℹ️ Column names already aligned with canonical workflow states'));
                }
              }
            }
          }
          console.log(stryMutAct_9fa48("2990") ? "Stryker was here!" : (stryCov_9fa48("2990"), ''));
        }
      }

      // Final summary
      const totalTasksAnalyzed = allTasks.length;
      console.log(stryMutAct_9fa48("2991") ? "" : (stryCov_9fa48("2991"), '📊 AUDIT SUMMARY:'));
      console.log(stryMutAct_9fa48("2992") ? `` : (stryCov_9fa48("2992"), `   Total tasks analyzed: ${totalTasksAnalyzed}`));
      console.log(stryMutAct_9fa48("2993") ? `` : (stryCov_9fa48("2993"), `   Total events in log: ${allEvents.length}`));
      console.log(stryMutAct_9fa48("2994") ? `` : (stryCov_9fa48("2994"), `   Inconsistencies found: ${inconsistenciesFound}`));
      console.log(stryMutAct_9fa48("2995") ? `` : (stryCov_9fa48("2995"), `   Illegal transitions: ${illegalTransitionsFound}`));
      console.log(stryMutAct_9fa48("2996") ? "Stryker was here!" : (stryCov_9fa48("2996"), ''));
      console.log(stryMutAct_9fa48("2997") ? "" : (stryCov_9fa48("2997"), '🔍 TASK STATUS BREAKDOWN:'));
      console.log(stryMutAct_9fa48("2998") ? `` : (stryCov_9fa48("2998"), `   ✅ Healthy tasks: ${healthyTasksFound} (${(stryMutAct_9fa48("2999") ? healthyTasksFound / totalTasksAnalyzed / 100 : (stryCov_9fa48("2999"), (stryMutAct_9fa48("3000") ? healthyTasksFound * totalTasksAnalyzed : (stryCov_9fa48("3000"), healthyTasksFound / totalTasksAnalyzed)) * 100)).toFixed(1)}%)`));
      console.log(stryMutAct_9fa48("3001") ? `` : (stryCov_9fa48("3001"), `   ⚠️  Untracked tasks: ${untrackedTasksFound} (${(stryMutAct_9fa48("3002") ? untrackedTasksFound / totalTasksAnalyzed / 100 : (stryCov_9fa48("3002"), (stryMutAct_9fa48("3003") ? untrackedTasksFound * totalTasksAnalyzed : (stryCov_9fa48("3003"), untrackedTasksFound / totalTasksAnalyzed)) * 100)).toFixed(1)}%)`));
      console.log(stryMutAct_9fa48("3004") ? `` : (stryCov_9fa48("3004"), `   🚨 Truly orphaned tasks: ${orphanedTasksFound} (${(stryMutAct_9fa48("3005") ? orphanedTasksFound / totalTasksAnalyzed / 100 : (stryCov_9fa48("3005"), (stryMutAct_9fa48("3006") ? orphanedTasksFound * totalTasksAnalyzed : (stryCov_9fa48("3006"), orphanedTasksFound / totalTasksAnalyzed)) * 100)).toFixed(1)}%)`));
      if (stryMutAct_9fa48("3009") ? false : stryMutAct_9fa48("3008") ? true : stryMutAct_9fa48("3007") ? dryRun : (stryCov_9fa48("3007", "3008", "3009"), !dryRun)) {
        if (stryMutAct_9fa48("3010")) {
          {}
        } else {
          stryCov_9fa48("3010");
          console.log(stryMutAct_9fa48("3011") ? `` : (stryCov_9fa48("3011"), `   Inconsistencies fixed: ${inconsistenciesFixed}`));
        }
      }
      console.log(stryMutAct_9fa48("3012") ? "Stryker was here!" : (stryCov_9fa48("3012"), ''));
      if (stryMutAct_9fa48("3016") ? inconsistenciesFound <= 0 : stryMutAct_9fa48("3015") ? inconsistenciesFound >= 0 : stryMutAct_9fa48("3014") ? false : stryMutAct_9fa48("3013") ? true : (stryCov_9fa48("3013", "3014", "3015", "3016"), inconsistenciesFound > 0)) {
        if (stryMutAct_9fa48("3017")) {
          {}
        } else {
          stryCov_9fa48("3017");
          if (stryMutAct_9fa48("3019") ? false : stryMutAct_9fa48("3018") ? true : (stryCov_9fa48("3018", "3019"), dryRun)) {
            if (stryMutAct_9fa48("3020")) {
              {}
            } else {
              stryCov_9fa48("3020");
              console.log(stryMutAct_9fa48("3021") ? "" : (stryCov_9fa48("3021"), '💡 Run with --fix to automatically correct these inconsistencies'));
            }
          } else {
            if (stryMutAct_9fa48("3022")) {
              {}
            } else {
              stryCov_9fa48("3022");
              console.log(stryMutAct_9fa48("3023") ? "" : (stryCov_9fa48("3023"), '✅ Audit completed with automatic corrections'));
            }
          }
        }
      } else {
        if (stryMutAct_9fa48("3024")) {
          {}
        } else {
          stryCov_9fa48("3024");
          console.log(stryMutAct_9fa48("3025") ? "" : (stryCov_9fa48("3025"), '✅ No inconsistencies found - board state is consistent with event log'));
        }
      }

      // Return structure expected by markdown formatter
      const issues = stryMutAct_9fa48("3026") ? ["Stryker was here"] : (stryCov_9fa48("3026"), []);
      if (stryMutAct_9fa48("3030") ? inconsistenciesFound <= 0 : stryMutAct_9fa48("3029") ? inconsistenciesFound >= 0 : stryMutAct_9fa48("3028") ? false : stryMutAct_9fa48("3027") ? true : (stryCov_9fa48("3027", "3028", "3029", "3030"), inconsistenciesFound > 0)) {
        if (stryMutAct_9fa48("3031")) {
          {}
        } else {
          stryCov_9fa48("3031");
          issues.push(stryMutAct_9fa48("3032") ? {} : (stryCov_9fa48("3032"), {
            type: stryMutAct_9fa48("3033") ? "" : (stryCov_9fa48("3033"), 'error'),
            message: stryMutAct_9fa48("3034") ? `` : (stryCov_9fa48("3034"), `${inconsistenciesFound} status inconsistency${(stryMutAct_9fa48("3037") ? inconsistenciesFound !== 1 : stryMutAct_9fa48("3036") ? false : stryMutAct_9fa48("3035") ? true : (stryCov_9fa48("3035", "3036", "3037"), inconsistenciesFound === 1)) ? stryMutAct_9fa48("3038") ? "Stryker was here!" : (stryCov_9fa48("3038"), '') : stryMutAct_9fa48("3039") ? "" : (stryCov_9fa48("3039"), 'es')} found`)
          }));
        }
      }
      if (stryMutAct_9fa48("3043") ? illegalTransitionsFound <= 0 : stryMutAct_9fa48("3042") ? illegalTransitionsFound >= 0 : stryMutAct_9fa48("3041") ? false : stryMutAct_9fa48("3040") ? true : (stryCov_9fa48("3040", "3041", "3042", "3043"), illegalTransitionsFound > 0)) {
        if (stryMutAct_9fa48("3044")) {
          {}
        } else {
          stryCov_9fa48("3044");
          issues.push(stryMutAct_9fa48("3045") ? {} : (stryCov_9fa48("3045"), {
            type: stryMutAct_9fa48("3046") ? "" : (stryCov_9fa48("3046"), 'error'),
            message: stryMutAct_9fa48("3047") ? `` : (stryCov_9fa48("3047"), `${illegalTransitionsFound} illegal transition${(stryMutAct_9fa48("3050") ? illegalTransitionsFound !== 1 : stryMutAct_9fa48("3049") ? false : stryMutAct_9fa48("3048") ? true : (stryCov_9fa48("3048", "3049", "3050"), illegalTransitionsFound === 1)) ? stryMutAct_9fa48("3051") ? "Stryker was here!" : (stryCov_9fa48("3051"), '') : stryMutAct_9fa48("3052") ? "" : (stryCov_9fa48("3052"), 's')} found`)
          }));
        }
      }
      if (stryMutAct_9fa48("3056") ? orphanedTasksFound <= 0 : stryMutAct_9fa48("3055") ? orphanedTasksFound >= 0 : stryMutAct_9fa48("3054") ? false : stryMutAct_9fa48("3053") ? true : (stryCov_9fa48("3053", "3054", "3055", "3056"), orphanedTasksFound > 0)) {
        if (stryMutAct_9fa48("3057")) {
          {}
        } else {
          stryCov_9fa48("3057");
          issues.push(stryMutAct_9fa48("3058") ? {} : (stryCov_9fa48("3058"), {
            type: stryMutAct_9fa48("3059") ? "" : (stryCov_9fa48("3059"), 'error'),
            message: stryMutAct_9fa48("3060") ? `` : (stryCov_9fa48("3060"), `${orphanedTasksFound} orphaned task${(stryMutAct_9fa48("3063") ? orphanedTasksFound !== 1 : stryMutAct_9fa48("3062") ? false : stryMutAct_9fa48("3061") ? true : (stryCov_9fa48("3061", "3062", "3063"), orphanedTasksFound === 1)) ? stryMutAct_9fa48("3064") ? "Stryker was here!" : (stryCov_9fa48("3064"), '') : stryMutAct_9fa48("3065") ? "" : (stryCov_9fa48("3065"), 's')} found`)
          }));
        }
      }
      if (stryMutAct_9fa48("3069") ? untrackedTasksFound <= 0 : stryMutAct_9fa48("3068") ? untrackedTasksFound >= 0 : stryMutAct_9fa48("3067") ? false : stryMutAct_9fa48("3066") ? true : (stryCov_9fa48("3066", "3067", "3068", "3069"), untrackedTasksFound > 0)) {
        if (stryMutAct_9fa48("3070")) {
          {}
        } else {
          stryCov_9fa48("3070");
          issues.push(stryMutAct_9fa48("3071") ? {} : (stryCov_9fa48("3071"), {
            type: stryMutAct_9fa48("3072") ? "" : (stryCov_9fa48("3072"), 'warning'),
            message: stryMutAct_9fa48("3073") ? `` : (stryCov_9fa48("3073"), `${untrackedTasksFound} untracked task${(stryMutAct_9fa48("3076") ? untrackedTasksFound !== 1 : stryMutAct_9fa48("3075") ? false : stryMutAct_9fa48("3074") ? true : (stryCov_9fa48("3074", "3075", "3076"), untrackedTasksFound === 1)) ? stryMutAct_9fa48("3077") ? "Stryker was here!" : (stryCov_9fa48("3077"), '') : stryMutAct_9fa48("3078") ? "" : (stryCov_9fa48("3078"), 's')} found`)
          }));
        }
      }
      if (stryMutAct_9fa48("3082") ? results.tasksWithIssues.length <= 0 : stryMutAct_9fa48("3081") ? results.tasksWithIssues.length >= 0 : stryMutAct_9fa48("3080") ? false : stryMutAct_9fa48("3079") ? true : (stryCov_9fa48("3079", "3080", "3081", "3082"), results.tasksWithIssues.length > 0)) {
        if (stryMutAct_9fa48("3083")) {
          {}
        } else {
          stryCov_9fa48("3083");
          issues.push(stryMutAct_9fa48("3084") ? {} : (stryCov_9fa48("3084"), {
            type: stryMutAct_9fa48("3085") ? "" : (stryCov_9fa48("3085"), 'warning'),
            message: stryMutAct_9fa48("3086") ? `` : (stryCov_9fa48("3086"), `${results.tasksWithIssues.length} task${(stryMutAct_9fa48("3089") ? results.tasksWithIssues.length !== 1 : stryMutAct_9fa48("3088") ? false : stryMutAct_9fa48("3087") ? true : (stryCov_9fa48("3087", "3088", "3089"), results.tasksWithIssues.length === 1)) ? stryMutAct_9fa48("3090") ? "Stryker was here!" : (stryCov_9fa48("3090"), '') : stryMutAct_9fa48("3091") ? "" : (stryCov_9fa48("3091"), 's')} with issues`)
          }));
        }
      }
      return stryMutAct_9fa48("3092") ? {} : (stryCov_9fa48("3092"), {
        issues,
        summary: stryMutAct_9fa48("3093") ? {} : (stryCov_9fa48("3093"), {
          total: totalTasksAnalyzed,
          errors: stryMutAct_9fa48("3094") ? inconsistenciesFound + illegalTransitionsFound - orphanedTasksFound : (stryCov_9fa48("3094"), (stryMutAct_9fa48("3095") ? inconsistenciesFound - illegalTransitionsFound : (stryCov_9fa48("3095"), inconsistenciesFound + illegalTransitionsFound)) + orphanedTasksFound),
          warnings: stryMutAct_9fa48("3096") ? untrackedTasksFound - results.tasksWithIssues.length : (stryCov_9fa48("3096"), untrackedTasksFound + results.tasksWithIssues.length)
        }),
        // Keep old structure for backward compatibility
        inconsistenciesFound,
        inconsistenciesFixed,
        illegalTransitionsFound,
        orphanedTasksFound,
        untrackedTasksFound,
        healthyTasksFound,
        dryRun
      });
    }
  });
  return handleAudit;
})());
const handleCommitStats: CommandHandler = stryMutAct_9fa48("3097") ? () => undefined : (stryCov_9fa48("3097"), (() => {
  const handleCommitStats: CommandHandler = (_args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("3098")) {
      {}
    } else {
      stryCov_9fa48("3098");
      const gitTracker = new TaskGitTracker(stryMutAct_9fa48("3099") ? {} : (stryCov_9fa48("3099"), {
        repoRoot: process.cwd()
      }));

      // Collect all tasks from the board and convert to expected format
      const allTasks: any[] = stryMutAct_9fa48("3100") ? ["Stryker was here"] : (stryCov_9fa48("3100"), []);
      for (const column of board.columns) {
        if (stryMutAct_9fa48("3101")) {
          {}
        } else {
          stryCov_9fa48("3101");
          for (const task of column.tasks) {
            if (stryMutAct_9fa48("3102")) {
              {}
            } else {
              stryCov_9fa48("3102");
              allTasks.push(stryMutAct_9fa48("3103") ? {} : (stryCov_9fa48("3103"), {
                frontmatter: task // Task object itself contains the frontmatter fields
              }));
            }
          }
        }
      }

      // Get commit tracking statistics
      const stats = gitTracker.getCommitTrackingStats(allTasks);
      console.log(stryMutAct_9fa48("3104") ? "" : (stryCov_9fa48("3104"), '📊 Kanban Commit Tracking Statistics'));
      console.log(stryMutAct_9fa48("3105") ? "Stryker was here!" : (stryCov_9fa48("3105"), ''));
      console.log(stryMutAct_9fa48("3106") ? `` : (stryCov_9fa48("3106"), `Total tasks: ${stats.total}`));
      console.log(stryMutAct_9fa48("3107") ? `` : (stryCov_9fa48("3107"), `Tasks with commit tracking: ${stats.withCommitTracking}`));
      console.log(stryMutAct_9fa48("3108") ? `` : (stryCov_9fa48("3108"), `Orphaned tasks: ${stats.orphaned}`));
      console.log(stryMutAct_9fa48("3109") ? `` : (stryCov_9fa48("3109"), `Tracking coverage: ${(stryMutAct_9fa48("3110") ? 100 + stats.orphanageRate : (stryCov_9fa48("3110"), 100 - stats.orphanageRate)).toFixed(1)}%`));
      console.log(stryMutAct_9fa48("3111") ? "Stryker was here!" : (stryCov_9fa48("3111"), ''));
      if (stryMutAct_9fa48("3115") ? stats.orphaned <= 0 : stryMutAct_9fa48("3114") ? stats.orphaned >= 0 : stryMutAct_9fa48("3113") ? false : stryMutAct_9fa48("3112") ? true : (stryCov_9fa48("3112", "3113", "3114", "3115"), stats.orphaned > 0)) {
        if (stryMutAct_9fa48("3116")) {
          {}
        } else {
          stryCov_9fa48("3116");
          console.log(stryMutAct_9fa48("3117") ? `` : (stryCov_9fa48("3117"), `⚠️  Found ${stats.orphaned} orphaned task(s) lacking proper commit tracking`));
          console.log(stryMutAct_9fa48("3118") ? "" : (stryCov_9fa48("3118"), '   Run "pnpm kanban audit --fix" to add commit tracking to these tasks'));
          console.log(stryMutAct_9fa48("3119") ? "Stryker was here!" : (stryCov_9fa48("3119"), ''));
        }
      }
      if (stryMutAct_9fa48("3123") ? stats.withCommitTracking <= 0 : stryMutAct_9fa48("3122") ? stats.withCommitTracking >= 0 : stryMutAct_9fa48("3121") ? false : stryMutAct_9fa48("3120") ? true : (stryCov_9fa48("3120", "3121", "3122", "3123"), stats.withCommitTracking > 0)) {
        if (stryMutAct_9fa48("3124")) {
          {}
        } else {
          stryCov_9fa48("3124");
          console.log(stryMutAct_9fa48("3125") ? "" : (stryCov_9fa48("3125"), '✅ Commit tracking is working for tracked tasks'));
          console.log(stryMutAct_9fa48("3126") ? "" : (stryCov_9fa48("3126"), '   Each task change creates a git commit with standardized messages'));
          console.log(stryMutAct_9fa48("3127") ? "" : (stryCov_9fa48("3127"), '   Task files include lastCommitSha and commitHistory fields'));
          console.log(stryMutAct_9fa48("3128") ? "Stryker was here!" : (stryCov_9fa48("3128"), ''));
        }
      }
      return stats;
    }
  });
  return handleCommitStats;
})());
const handleEnforceWipLimits: CommandHandler = stryMutAct_9fa48("3129") ? () => undefined : (stryCov_9fa48("3129"), (() => {
  const handleEnforceWipLimits: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("3130")) {
      {}
    } else {
      stryCov_9fa48("3130");
      const configResult = await loadKanbanConfig(stryMutAct_9fa48("3131") ? {} : (stryCov_9fa48("3131"), {
        argv: process.argv,
        env: process.env
      }));
      const eventLogManager = makeEventLogManager(configResult.config);
      const dryRun = stryMutAct_9fa48("3132") ? args.includes('--fix') : (stryCov_9fa48("3132"), !args.includes(stryMutAct_9fa48("3133") ? "" : (stryCov_9fa48("3133"), '--fix')));
      const columnFilter = stryMutAct_9fa48("3134") ? args.find(arg => arg.startsWith('--column=')).split('=')[1] : (stryCov_9fa48("3134"), args.find(stryMutAct_9fa48("3135") ? () => undefined : (stryCov_9fa48("3135"), arg => stryMutAct_9fa48("3136") ? arg.endsWith('--column=') : (stryCov_9fa48("3136"), arg.startsWith(stryMutAct_9fa48("3137") ? "" : (stryCov_9fa48("3137"), '--column=')))))?.split(stryMutAct_9fa48("3138") ? "" : (stryCov_9fa48("3138"), '='))[1]);
      console.log(stryMutAct_9fa48("3139") ? `` : (stryCov_9fa48("3139"), `🚧 WIP Limits Enforcement ${dryRun ? stryMutAct_9fa48("3140") ? "" : (stryCov_9fa48("3140"), '(DRY RUN)') : stryMutAct_9fa48("3141") ? "" : (stryCov_9fa48("3141"), '(FIX MODE)')}`));
      if (stryMutAct_9fa48("3143") ? false : stryMutAct_9fa48("3142") ? true : (stryCov_9fa48("3142", "3143"), columnFilter)) {
        if (stryMutAct_9fa48("3144")) {
          {}
        } else {
          stryCov_9fa48("3144");
          console.log(stryMutAct_9fa48("3145") ? `` : (stryCov_9fa48("3145"), `📋 Filtering by column: ${columnFilter}`));
        }
      }
      console.log(stryMutAct_9fa48("3146") ? "Stryker was here!" : (stryCov_9fa48("3146"), ''));
      let totalViolations = 0;
      let totalCorrections = 0;
      for (const column of board.columns) {
        if (stryMutAct_9fa48("3147")) {
          {}
        } else {
          stryCov_9fa48("3147");
          if (stryMutAct_9fa48("3150") ? columnFilter || columnKey(column.name) !== columnKey(columnFilter) : stryMutAct_9fa48("3149") ? false : stryMutAct_9fa48("3148") ? true : (stryCov_9fa48("3148", "3149", "3150"), columnFilter && (stryMutAct_9fa48("3152") ? columnKey(column.name) === columnKey(columnFilter) : stryMutAct_9fa48("3151") ? true : (stryCov_9fa48("3151", "3152"), columnKey(column.name) !== columnKey(columnFilter))))) {
            if (stryMutAct_9fa48("3153")) {
              {}
            } else {
              stryCov_9fa48("3153");
              continue;
            }
          }
          if (stryMutAct_9fa48("3156") ? column.limit || column.tasks.length > column.limit : stryMutAct_9fa48("3155") ? false : stryMutAct_9fa48("3154") ? true : (stryCov_9fa48("3154", "3155", "3156"), column.limit && (stryMutAct_9fa48("3159") ? column.tasks.length <= column.limit : stryMutAct_9fa48("3158") ? column.tasks.length >= column.limit : stryMutAct_9fa48("3157") ? true : (stryCov_9fa48("3157", "3158", "3159"), column.tasks.length > column.limit)))) {
            if (stryMutAct_9fa48("3160")) {
              {}
            } else {
              stryCov_9fa48("3160");
              const violationCount = stryMutAct_9fa48("3161") ? column.tasks.length + column.limit : (stryCov_9fa48("3161"), column.tasks.length - column.limit);
              stryMutAct_9fa48("3162") ? totalViolations -= violationCount : (stryCov_9fa48("3162"), totalViolations += violationCount);
              console.log(stryMutAct_9fa48("3163") ? `` : (stryCov_9fa48("3163"), `🚨 WIP VIOLATION: ${column.name}`));
              console.log(stryMutAct_9fa48("3164") ? `` : (stryCov_9fa48("3164"), `   Current: ${column.tasks.length}/${column.limit} (${violationCount} over limit)`));

              // Sort tasks by priority (lower priority number = higher priority)
              const sortedTasks = stryMutAct_9fa48("3165") ? [...column.tasks] : (stryCov_9fa48("3165"), (stryMutAct_9fa48("3166") ? [] : (stryCov_9fa48("3166"), [...column.tasks])).sort((a, b) => {
                if (stryMutAct_9fa48("3167")) {
                  {}
                } else {
                  stryCov_9fa48("3167");
                  const priorityA = getPriorityNumeric(a.priority);
                  const priorityB = getPriorityNumeric(b.priority);
                  return stryMutAct_9fa48("3168") ? priorityB + priorityA : (stryCov_9fa48("3168"), priorityB - priorityA); // Reverse sort (higher priority first)
                }
              }));

              // Tasks to move back (lowest priority)
              const tasksToMove = stryMutAct_9fa48("3169") ? sortedTasks : (stryCov_9fa48("3169"), sortedTasks.slice(stryMutAct_9fa48("3170") ? +violationCount : (stryCov_9fa48("3170"), -violationCount)));
              console.log(stryMutAct_9fa48("3171") ? `` : (stryCov_9fa48("3171"), `   Tasks to move back: ${tasksToMove.length}`));
              for (const task of tasksToMove) {
                if (stryMutAct_9fa48("3172")) {
                  {}
                } else {
                  stryCov_9fa48("3172");
                  console.log(stryMutAct_9fa48("3173") ? `` : (stryCov_9fa48("3173"), `   - "${task.title}" (${task.priority})`));
                  if (stryMutAct_9fa48("3176") ? false : stryMutAct_9fa48("3175") ? true : stryMutAct_9fa48("3174") ? dryRun : (stryCov_9fa48("3174", "3175", "3176"), !dryRun)) {
                    if (stryMutAct_9fa48("3177")) {
                      {}
                    } else {
                      stryCov_9fa48("3177");
                      try {
                        if (stryMutAct_9fa48("3178")) {
                          {}
                        } else {
                          stryCov_9fa48("3178");
                          // Find the previous column in the workflow
                          const previousColumn = findPreviousColumn(column.name, board.columns);
                          if (stryMutAct_9fa48("3180") ? false : stryMutAct_9fa48("3179") ? true : (stryCov_9fa48("3179", "3180"), previousColumn)) {
                            if (stryMutAct_9fa48("3181")) {
                              {}
                            } else {
                              stryCov_9fa48("3181");
                              await updateStatus(board as Board, task.uuid, previousColumn.name, context.boardFile, context.tasksDir, undefined, stryMutAct_9fa48("3182") ? `` : (stryCov_9fa48("3182"), `WIP limit enforcement: moved from ${column.name} to ${previousColumn.name}`), eventLogManager, stryMutAct_9fa48("3183") ? "" : (stryCov_9fa48("3183"), 'system'));
                              stryMutAct_9fa48("3184") ? totalCorrections-- : (stryCov_9fa48("3184"), totalCorrections++);
                              console.log(stryMutAct_9fa48("3185") ? `` : (stryCov_9fa48("3185"), `     ✅ Moved to ${previousColumn.name}`));
                            }
                          } else {
                            if (stryMutAct_9fa48("3186")) {
                              {}
                            } else {
                              stryCov_9fa48("3186");
                              console.log(stryMutAct_9fa48("3187") ? `` : (stryCov_9fa48("3187"), `     ⚠️  No previous column found for ${column.name}`));
                            }
                          }
                        }
                      } catch (error) {
                        if (stryMutAct_9fa48("3188")) {
                          {}
                        } else {
                          stryCov_9fa48("3188");
                          console.log(stryMutAct_9fa48("3189") ? `` : (stryCov_9fa48("3189"), `     ❌ Failed to move: ${error}`));
                        }
                      }
                    }
                  }
                }
              }
              console.log(stryMutAct_9fa48("3190") ? "Stryker was here!" : (stryCov_9fa48("3190"), ''));
            }
          }
        }
      }
      console.log(stryMutAct_9fa48("3191") ? "" : (stryCov_9fa48("3191"), '📊 WIP ENFORCEMENT SUMMARY:'));
      console.log(stryMutAct_9fa48("3192") ? `` : (stryCov_9fa48("3192"), `   Total violations: ${totalViolations}`));
      console.log(stryMutAct_9fa48("3193") ? `` : (stryCov_9fa48("3193"), `   Total corrections: ${totalCorrections}`));
      if (stryMutAct_9fa48("3197") ? totalViolations <= 0 : stryMutAct_9fa48("3196") ? totalViolations >= 0 : stryMutAct_9fa48("3195") ? false : stryMutAct_9fa48("3194") ? true : (stryCov_9fa48("3194", "3195", "3196", "3197"), totalViolations > 0)) {
        if (stryMutAct_9fa48("3198")) {
          {}
        } else {
          stryCov_9fa48("3198");
          if (stryMutAct_9fa48("3200") ? false : stryMutAct_9fa48("3199") ? true : (stryCov_9fa48("3199", "3200"), dryRun)) {
            if (stryMutAct_9fa48("3201")) {
              {}
            } else {
              stryCov_9fa48("3201");
              console.log(stryMutAct_9fa48("3202") ? "" : (stryCov_9fa48("3202"), '💡 Run with --fix to automatically move lowest priority tasks'));
            }
          } else {
            if (stryMutAct_9fa48("3203")) {
              {}
            } else {
              stryCov_9fa48("3203");
              console.log(stryMutAct_9fa48("3204") ? "" : (stryCov_9fa48("3204"), '✅ WIP limits enforced'));
            }
          }
        }
      } else {
        if (stryMutAct_9fa48("3205")) {
          {}
        } else {
          stryCov_9fa48("3205");
          console.log(stryMutAct_9fa48("3206") ? "" : (stryCov_9fa48("3206"), '✅ No WIP limit violations found'));
        }
      }
      return stryMutAct_9fa48("3207") ? {} : (stryCov_9fa48("3207"), {
        violations: totalViolations,
        corrections: totalCorrections,
        dryRun
      });
    }
  });
  return handleEnforceWipLimits;
})());

// Helper function to find previous column in workflow
const findPreviousColumn = (currentColumnName: string, columns: ReadonlyArray<{
  name: string;
}>) => {
  if (stryMutAct_9fa48("3208")) {
    {}
  } else {
    stryCov_9fa48("3208");
    const workflowOrder = stryMutAct_9fa48("3209") ? [] : (stryCov_9fa48("3209"), [stryMutAct_9fa48("3210") ? "" : (stryCov_9fa48("3210"), 'icebox'), stryMutAct_9fa48("3211") ? "" : (stryCov_9fa48("3211"), 'incoming'), stryMutAct_9fa48("3212") ? "" : (stryCov_9fa48("3212"), 'accepted'), stryMutAct_9fa48("3213") ? "" : (stryCov_9fa48("3213"), 'breakdown'), stryMutAct_9fa48("3214") ? "" : (stryCov_9fa48("3214"), 'blocked'), stryMutAct_9fa48("3215") ? "" : (stryCov_9fa48("3215"), 'ready'), stryMutAct_9fa48("3216") ? "" : (stryCov_9fa48("3216"), 'todo'), stryMutAct_9fa48("3217") ? "" : (stryCov_9fa48("3217"), 'in_progress'), stryMutAct_9fa48("3218") ? "" : (stryCov_9fa48("3218"), 'review'), stryMutAct_9fa48("3219") ? "" : (stryCov_9fa48("3219"), 'document'), stryMutAct_9fa48("3220") ? "" : (stryCov_9fa48("3220"), 'done'), stryMutAct_9fa48("3221") ? "" : (stryCov_9fa48("3221"), 'rejected')]);
    const currentIndex = workflowOrder.findIndex(stryMutAct_9fa48("3222") ? () => undefined : (stryCov_9fa48("3222"), col => stryMutAct_9fa48("3225") ? columnKey(col) !== columnKey(currentColumnName) : stryMutAct_9fa48("3224") ? false : stryMutAct_9fa48("3223") ? true : (stryCov_9fa48("3223", "3224", "3225"), columnKey(col) === columnKey(currentColumnName))));
    if (stryMutAct_9fa48("3229") ? currentIndex > 0 : stryMutAct_9fa48("3228") ? currentIndex < 0 : stryMutAct_9fa48("3227") ? false : stryMutAct_9fa48("3226") ? true : (stryCov_9fa48("3226", "3227", "3228", "3229"), currentIndex <= 0)) return null;
    const previousColumnName = workflowOrder[stryMutAct_9fa48("3230") ? currentIndex + 1 : (stryCov_9fa48("3230"), currentIndex - 1)];
    if (stryMutAct_9fa48("3233") ? false : stryMutAct_9fa48("3232") ? true : stryMutAct_9fa48("3231") ? previousColumnName : (stryCov_9fa48("3231", "3232", "3233"), !previousColumnName)) return null;
    return stryMutAct_9fa48("3236") ? columns.find(col => columnKey(col.name) === columnKey(previousColumnName)) && null : stryMutAct_9fa48("3235") ? false : stryMutAct_9fa48("3234") ? true : (stryCov_9fa48("3234", "3235", "3236"), columns.find(stryMutAct_9fa48("3237") ? () => undefined : (stryCov_9fa48("3237"), col => stryMutAct_9fa48("3240") ? columnKey(col.name) !== columnKey(previousColumnName) : stryMutAct_9fa48("3239") ? false : stryMutAct_9fa48("3238") ? true : (stryCov_9fa48("3238", "3239", "3240"), columnKey(col.name) === columnKey(previousColumnName)))) || null);
  }
};

// Helper function to get numeric priority
const getPriorityNumeric = (priority: string | number | undefined): number => {
  if (stryMutAct_9fa48("3241")) {
    {}
  } else {
    stryCov_9fa48("3241");
    if (stryMutAct_9fa48("3244") ? typeof priority !== 'number' : stryMutAct_9fa48("3243") ? false : stryMutAct_9fa48("3242") ? true : (stryCov_9fa48("3242", "3243", "3244"), typeof priority === (stryMutAct_9fa48("3245") ? "" : (stryCov_9fa48("3245"), 'number')))) return priority;
    if (stryMutAct_9fa48("3248") ? typeof priority !== 'string' : stryMutAct_9fa48("3247") ? false : stryMutAct_9fa48("3246") ? true : (stryCov_9fa48("3246", "3247", "3248"), typeof priority === (stryMutAct_9fa48("3249") ? "" : (stryCov_9fa48("3249"), 'string')))) {
      if (stryMutAct_9fa48("3250")) {
        {}
      } else {
        stryCov_9fa48("3250");
        const match = priority.match(stryMutAct_9fa48("3252") ? /P(\D+)/i : stryMutAct_9fa48("3251") ? /P(\d)/i : (stryCov_9fa48("3251", "3252"), /P(\d+)/i));
        if (stryMutAct_9fa48("3255") ? match[1] : stryMutAct_9fa48("3254") ? false : stryMutAct_9fa48("3253") ? true : (stryCov_9fa48("3253", "3254", "3255"), match?.[1])) return parseInt(match[1], 10);
        if (stryMutAct_9fa48("3258") ? priority.toLowerCase() !== 'critical' : stryMutAct_9fa48("3257") ? false : stryMutAct_9fa48("3256") ? true : (stryCov_9fa48("3256", "3257", "3258"), (stryMutAct_9fa48("3259") ? priority.toUpperCase() : (stryCov_9fa48("3259"), priority.toLowerCase())) === (stryMutAct_9fa48("3260") ? "" : (stryCov_9fa48("3260"), 'critical')))) return 0;
        if (stryMutAct_9fa48("3263") ? priority.toLowerCase() !== 'high' : stryMutAct_9fa48("3262") ? false : stryMutAct_9fa48("3261") ? true : (stryCov_9fa48("3261", "3262", "3263"), (stryMutAct_9fa48("3264") ? priority.toUpperCase() : (stryCov_9fa48("3264"), priority.toLowerCase())) === (stryMutAct_9fa48("3265") ? "" : (stryCov_9fa48("3265"), 'high')))) return 1;
        if (stryMutAct_9fa48("3268") ? priority.toLowerCase() !== 'medium' : stryMutAct_9fa48("3267") ? false : stryMutAct_9fa48("3266") ? true : (stryCov_9fa48("3266", "3267", "3268"), (stryMutAct_9fa48("3269") ? priority.toUpperCase() : (stryCov_9fa48("3269"), priority.toLowerCase())) === (stryMutAct_9fa48("3270") ? "" : (stryCov_9fa48("3270"), 'medium')))) return 2;
        if (stryMutAct_9fa48("3273") ? priority.toLowerCase() !== 'low' : stryMutAct_9fa48("3272") ? false : stryMutAct_9fa48("3271") ? true : (stryCov_9fa48("3271", "3272", "3273"), (stryMutAct_9fa48("3274") ? priority.toUpperCase() : (stryCov_9fa48("3274"), priority.toLowerCase())) === (stryMutAct_9fa48("3275") ? "" : (stryCov_9fa48("3275"), 'low')))) return 3;
      }
    }
    return 3; // Default to low priority
  }
};

// WIP Limit Enforcement Commands

const handleWipMonitor: CommandHandler = stryMutAct_9fa48("3276") ? () => undefined : (stryCov_9fa48("3276"), (() => {
  const handleWipMonitor: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("3277")) {
      {}
    } else {
      stryCov_9fa48("3277");
      const configResult = await loadKanbanConfig();
      const wipEnforcement = await createWIPLimitEnforcement(stryMutAct_9fa48("3278") ? {} : (stryCov_9fa48("3278"), {
        config: configResult.config
      }));
      const monitor = await wipEnforcement.getCapacityMonitor(board as Board);
      const watchMode = args.includes(stryMutAct_9fa48("3279") ? "" : (stryCov_9fa48("3279"), '--watch'));
      const interval = parseInt(stryMutAct_9fa48("3282") ? args.find(arg => arg.startsWith('--interval='))?.split('=')[1] && '5000' : stryMutAct_9fa48("3281") ? false : stryMutAct_9fa48("3280") ? true : (stryCov_9fa48("3280", "3281", "3282"), (stryMutAct_9fa48("3283") ? args.find(arg => arg.startsWith('--interval=')).split('=')[1] : (stryCov_9fa48("3283"), args.find(stryMutAct_9fa48("3284") ? () => undefined : (stryCov_9fa48("3284"), arg => stryMutAct_9fa48("3285") ? arg.endsWith('--interval=') : (stryCov_9fa48("3285"), arg.startsWith(stryMutAct_9fa48("3286") ? "" : (stryCov_9fa48("3286"), '--interval=')))))?.split(stryMutAct_9fa48("3287") ? "" : (stryCov_9fa48("3287"), '='))[1])) || (stryMutAct_9fa48("3288") ? "" : (stryCov_9fa48("3288"), '5000'))));
      console.log(stryMutAct_9fa48("3289") ? "" : (stryCov_9fa48("3289"), '📊 Real-time WIP Capacity Monitor'));
      console.log(stryMutAct_9fa48("3290") ? `` : (stryCov_9fa48("3290"), `🕐 Last updated: ${new Date(monitor.timestamp).toLocaleString()}`));
      console.log(stryMutAct_9fa48("3291") ? "Stryker was here!" : (stryCov_9fa48("3291"), ''));
      const displayMonitor = (data: typeof monitor) => {
        if (stryMutAct_9fa48("3292")) {
          {}
        } else {
          stryCov_9fa48("3292");
          console.clear();
          console.log(stryMutAct_9fa48("3293") ? "" : (stryCov_9fa48("3293"), '📊 Real-time WIP Capacity Monitor'));
          console.log(stryMutAct_9fa48("3294") ? `` : (stryCov_9fa48("3294"), `🕐 Last updated: ${new Date(data.timestamp).toLocaleString()}`));
          console.log(stryMutAct_9fa48("3295") ? `` : (stryCov_9fa48("3295"), `🚨 Total violations: ${data.totalViolations}`));
          console.log(stryMutAct_9fa48("3296") ? `` : (stryCov_9fa48("3296"), `📈 Average utilization: ${data.utilization.average.toFixed(1)}%`));
          console.log(stryMutAct_9fa48("3297") ? "Stryker was here!" : (stryCov_9fa48("3297"), ''));
          for (const column of data.columns) {
            if (stryMutAct_9fa48("3298")) {
              {}
            } else {
              stryCov_9fa48("3298");
              const icon = (stryMutAct_9fa48("3301") ? column.status !== 'critical' : stryMutAct_9fa48("3300") ? false : stryMutAct_9fa48("3299") ? true : (stryCov_9fa48("3299", "3300", "3301"), column.status === (stryMutAct_9fa48("3302") ? "" : (stryCov_9fa48("3302"), 'critical')))) ? stryMutAct_9fa48("3303") ? "" : (stryCov_9fa48("3303"), '🚨') : (stryMutAct_9fa48("3306") ? column.status !== 'violation' : stryMutAct_9fa48("3305") ? false : stryMutAct_9fa48("3304") ? true : (stryCov_9fa48("3304", "3305", "3306"), column.status === (stryMutAct_9fa48("3307") ? "" : (stryCov_9fa48("3307"), 'violation')))) ? stryMutAct_9fa48("3308") ? "" : (stryCov_9fa48("3308"), '❌') : (stryMutAct_9fa48("3311") ? column.status !== 'warning' : stryMutAct_9fa48("3310") ? false : stryMutAct_9fa48("3309") ? true : (stryCov_9fa48("3309", "3310", "3311"), column.status === (stryMutAct_9fa48("3312") ? "" : (stryCov_9fa48("3312"), 'warning')))) ? stryMutAct_9fa48("3313") ? "" : (stryCov_9fa48("3313"), '⚠️') : stryMutAct_9fa48("3314") ? "" : (stryCov_9fa48("3314"), '✅');
              const utilizationBar = column.limit ? stryMutAct_9fa48("3315") ? '█'.repeat(Math.floor(column.utilization / 10)) - '░'.repeat(10 - Math.floor(column.utilization / 10)) : (stryCov_9fa48("3315"), (stryMutAct_9fa48("3316") ? "" : (stryCov_9fa48("3316"), '█')).repeat(Math.floor(stryMutAct_9fa48("3317") ? column.utilization * 10 : (stryCov_9fa48("3317"), column.utilization / 10))) + (stryMutAct_9fa48("3318") ? "" : (stryCov_9fa48("3318"), '░')).repeat(stryMutAct_9fa48("3319") ? 10 + Math.floor(column.utilization / 10) : (stryCov_9fa48("3319"), 10 - Math.floor(stryMutAct_9fa48("3320") ? column.utilization * 10 : (stryCov_9fa48("3320"), column.utilization / 10))))) : stryMutAct_9fa48("3321") ? "" : (stryCov_9fa48("3321"), 'N/A');
              console.log(stryMutAct_9fa48("3322") ? `` : (stryCov_9fa48("3322"), `${icon} ${column.name.padEnd(15)} ${column.current.toString().padStart(3)}/${stryMutAct_9fa48("3325") ? column.limit?.toString().padStart(3) && '∞' : stryMutAct_9fa48("3324") ? false : stryMutAct_9fa48("3323") ? true : (stryCov_9fa48("3323", "3324", "3325"), (stryMutAct_9fa48("3326") ? column.limit.toString().padStart(3) : (stryCov_9fa48("3326"), column.limit?.toString().padStart(3))) || (stryMutAct_9fa48("3327") ? "" : (stryCov_9fa48("3327"), '∞')))} ${utilizationBar} ${column.utilization.toFixed(1)}%`));
            }
          }
          console.log(stryMutAct_9fa48("3328") ? "Stryker was here!" : (stryCov_9fa48("3328"), ''));
          if (stryMutAct_9fa48("3332") ? data.totalViolations <= 0 : stryMutAct_9fa48("3331") ? data.totalViolations >= 0 : stryMutAct_9fa48("3330") ? false : stryMutAct_9fa48("3329") ? true : (stryCov_9fa48("3329", "3330", "3331", "3332"), data.totalViolations > 0)) {
            if (stryMutAct_9fa48("3333")) {
              {}
            } else {
              stryCov_9fa48("3333");
              console.log(stryMutAct_9fa48("3334") ? "" : (stryCov_9fa48("3334"), '💡 Run "kanban enforce-wip-limits --fix" to resolve violations'));
            }
          }
          if (stryMutAct_9fa48("3336") ? false : stryMutAct_9fa48("3335") ? true : (stryCov_9fa48("3335", "3336"), watchMode)) {
            if (stryMutAct_9fa48("3337")) {
              {}
            } else {
              stryCov_9fa48("3337");
              console.log(stryMutAct_9fa48("3338") ? "" : (stryCov_9fa48("3338"), '🔄 Watching for changes... (Ctrl+C to stop)'));
            }
          }
        }
      };
      if (stryMutAct_9fa48("3340") ? false : stryMutAct_9fa48("3339") ? true : (stryCov_9fa48("3339", "3340"), watchMode)) {
        if (stryMutAct_9fa48("3341")) {
          {}
        } else {
          stryCov_9fa48("3341");
          console.log(stryMutAct_9fa48("3342") ? "" : (stryCov_9fa48("3342"), '🔄 Starting real-time monitoring...'));
          const intervalId = setInterval(async () => {
            if (stryMutAct_9fa48("3343")) {
              {}
            } else {
              stryCov_9fa48("3343");
              const freshMonitor = await wipEnforcement.getCapacityMonitor();
              displayMonitor(freshMonitor);
            }
          }, interval);

          // Handle Ctrl+C to stop watching
          process.on(stryMutAct_9fa48("3344") ? "" : (stryCov_9fa48("3344"), 'SIGINT'), () => {
            if (stryMutAct_9fa48("3345")) {
              {}
            } else {
              stryCov_9fa48("3345");
              clearInterval(intervalId);
              console.log(stryMutAct_9fa48("3346") ? "" : (stryCov_9fa48("3346"), '\n👋 Monitoring stopped'));
              process.exit(0);
            }
          });

          // Initial display
          displayMonitor(monitor);
        }
      } else {
        if (stryMutAct_9fa48("3347")) {
          {}
        } else {
          stryCov_9fa48("3347");
          displayMonitor(monitor);
        }
      }
      return monitor;
    }
  });
  return handleWipMonitor;
})());
const handleWipCompliance: CommandHandler = stryMutAct_9fa48("3348") ? () => undefined : (stryCov_9fa48("3348"), (() => {
  const handleWipCompliance: CommandHandler = (args, context) => withBoard(context, async _board => {
    if (stryMutAct_9fa48("3349")) {
      {}
    } else {
      stryCov_9fa48("3349");
      const configResult = await loadKanbanConfig();
      const wipEnforcement = await createWIPLimitEnforcement(stryMutAct_9fa48("3350") ? {} : (stryCov_9fa48("3350"), {
        config: configResult.config
      }));
      const timeframe = (args.find(arg => arg.startsWith('--timeframe='))?.split('=')[1] || '24h') as '24h' | '7d' | '30d';
      const format = args.includes(stryMutAct_9fa48("3351") ? "" : (stryCov_9fa48("3351"), '--json')) ? stryMutAct_9fa48("3352") ? "" : (stryCov_9fa48("3352"), 'json') : stryMutAct_9fa48("3353") ? "" : (stryCov_9fa48("3353"), 'table');
      console.log(stryMutAct_9fa48("3354") ? `` : (stryCov_9fa48("3354"), `📋 WIP Compliance Report (${timeframe})`));
      console.log(stryMutAct_9fa48("3355") ? "Stryker was here!" : (stryCov_9fa48("3355"), ''));
      const report = await wipEnforcement.generateComplianceReport(timeframe);
      if (stryMutAct_9fa48("3358") ? format !== 'json' : stryMutAct_9fa48("3357") ? false : stryMutAct_9fa48("3356") ? true : (stryCov_9fa48("3356", "3357", "3358"), format === (stryMutAct_9fa48("3359") ? "" : (stryCov_9fa48("3359"), 'json')))) {
        if (stryMutAct_9fa48("3360")) {
          {}
        } else {
          stryCov_9fa48("3360");
          return report;
        }
      }
      console.log(stryMutAct_9fa48("3361") ? `` : (stryCov_9fa48("3361"), `📊 Summary:`));
      console.log(stryMutAct_9fa48("3362") ? `` : (stryCov_9fa48("3362"), `   Total violations: ${report.totalViolations}`));
      console.log(stryMutAct_9fa48("3363") ? `` : (stryCov_9fa48("3363"), `   Override rate: ${report.overrideRate.toFixed(1)}%`));
      console.log(stryMutAct_9fa48("3364") ? "Stryker was here!" : (stryCov_9fa48("3364"), ''));
      if (stryMutAct_9fa48("3368") ? Object.keys(report.violationsByColumn).length <= 0 : stryMutAct_9fa48("3367") ? Object.keys(report.violationsByColumn).length >= 0 : stryMutAct_9fa48("3366") ? false : stryMutAct_9fa48("3365") ? true : (stryCov_9fa48("3365", "3366", "3367", "3368"), Object.keys(report.violationsByColumn).length > 0)) {
        if (stryMutAct_9fa48("3369")) {
          {}
        } else {
          stryCov_9fa48("3369");
          console.log(stryMutAct_9fa48("3370") ? "" : (stryCov_9fa48("3370"), '📊 Violations by Column:'));
          for (const [column, count] of Object.entries(report.violationsByColumn)) {
            if (stryMutAct_9fa48("3371")) {
              {}
            } else {
              stryCov_9fa48("3371");
              console.log(stryMutAct_9fa48("3372") ? `` : (stryCov_9fa48("3372"), `   ${column}: ${count}`));
            }
          }
          console.log(stryMutAct_9fa48("3373") ? "Stryker was here!" : (stryCov_9fa48("3373"), ''));
        }
      }
      if (stryMutAct_9fa48("3377") ? Object.keys(report.violationsBySeverity).length <= 0 : stryMutAct_9fa48("3376") ? Object.keys(report.violationsBySeverity).length >= 0 : stryMutAct_9fa48("3375") ? false : stryMutAct_9fa48("3374") ? true : (stryCov_9fa48("3374", "3375", "3376", "3377"), Object.keys(report.violationsBySeverity).length > 0)) {
        if (stryMutAct_9fa48("3378")) {
          {}
        } else {
          stryCov_9fa48("3378");
          console.log(stryMutAct_9fa48("3379") ? "" : (stryCov_9fa48("3379"), '🚨 Violations by Severity:'));
          for (const [severity, count] of Object.entries(report.violationsBySeverity)) {
            if (stryMutAct_9fa48("3380")) {
              {}
            } else {
              stryCov_9fa48("3380");
              const icon = (stryMutAct_9fa48("3383") ? severity !== 'critical' : stryMutAct_9fa48("3382") ? false : stryMutAct_9fa48("3381") ? true : (stryCov_9fa48("3381", "3382", "3383"), severity === (stryMutAct_9fa48("3384") ? "" : (stryCov_9fa48("3384"), 'critical')))) ? stryMutAct_9fa48("3385") ? "" : (stryCov_9fa48("3385"), '🚨') : (stryMutAct_9fa48("3388") ? severity !== 'error' : stryMutAct_9fa48("3387") ? false : stryMutAct_9fa48("3386") ? true : (stryCov_9fa48("3386", "3387", "3388"), severity === (stryMutAct_9fa48("3389") ? "" : (stryCov_9fa48("3389"), 'error')))) ? stryMutAct_9fa48("3390") ? "" : (stryCov_9fa48("3390"), '❌') : stryMutAct_9fa48("3391") ? "" : (stryCov_9fa48("3391"), '⚠️');
              console.log(stryMutAct_9fa48("3392") ? `` : (stryCov_9fa48("3392"), `   ${icon} ${severity}: ${count}`));
            }
          }
          console.log(stryMutAct_9fa48("3393") ? "Stryker was here!" : (stryCov_9fa48("3393"), ''));
        }
      }
      if (stryMutAct_9fa48("3397") ? report.topViolatedColumns.length <= 0 : stryMutAct_9fa48("3396") ? report.topViolatedColumns.length >= 0 : stryMutAct_9fa48("3395") ? false : stryMutAct_9fa48("3394") ? true : (stryCov_9fa48("3394", "3395", "3396", "3397"), report.topViolatedColumns.length > 0)) {
        if (stryMutAct_9fa48("3398")) {
          {}
        } else {
          stryCov_9fa48("3398");
          console.log(stryMutAct_9fa48("3399") ? "" : (stryCov_9fa48("3399"), '🔥 Top Violated Columns:'));
          for (const {
            column,
            violations
          } of report.topViolatedColumns) {
            if (stryMutAct_9fa48("3400")) {
              {}
            } else {
              stryCov_9fa48("3400");
              console.log(stryMutAct_9fa48("3401") ? `` : (stryCov_9fa48("3401"), `   ${column}: ${violations} violations`));
            }
          }
          console.log(stryMutAct_9fa48("3402") ? "Stryker was here!" : (stryCov_9fa48("3402"), ''));
        }
      }
      if (stryMutAct_9fa48("3406") ? report.recommendations.length <= 0 : stryMutAct_9fa48("3405") ? report.recommendations.length >= 0 : stryMutAct_9fa48("3404") ? false : stryMutAct_9fa48("3403") ? true : (stryCov_9fa48("3403", "3404", "3405", "3406"), report.recommendations.length > 0)) {
        if (stryMutAct_9fa48("3407")) {
          {}
        } else {
          stryCov_9fa48("3407");
          console.log(stryMutAct_9fa48("3408") ? "" : (stryCov_9fa48("3408"), '💡 Recommendations:'));
          for (const recommendation of report.recommendations) {
            if (stryMutAct_9fa48("3409")) {
              {}
            } else {
              stryCov_9fa48("3409");
              console.log(stryMutAct_9fa48("3410") ? `` : (stryCov_9fa48("3410"), `   ${recommendation}`));
            }
          }
        }
      }
      return report;
    }
  });
  return handleWipCompliance;
})());
const handleWipViolations: CommandHandler = stryMutAct_9fa48("3411") ? () => undefined : (stryCov_9fa48("3411"), (() => {
  const handleWipViolations: CommandHandler = (args, context) => withBoard(context, async _board => {
    if (stryMutAct_9fa48("3412")) {
      {}
    } else {
      stryCov_9fa48("3412");
      const configResult = await loadKanbanConfig();
      const wipEnforcement = await createWIPLimitEnforcement(stryMutAct_9fa48("3413") ? {} : (stryCov_9fa48("3413"), {
        config: configResult.config
      }));
      const limit = parseInt(stryMutAct_9fa48("3416") ? args.find(arg => arg.startsWith('--limit='))?.split('=')[1] && '20' : stryMutAct_9fa48("3415") ? false : stryMutAct_9fa48("3414") ? true : (stryCov_9fa48("3414", "3415", "3416"), (stryMutAct_9fa48("3417") ? args.find(arg => arg.startsWith('--limit=')).split('=')[1] : (stryCov_9fa48("3417"), args.find(stryMutAct_9fa48("3418") ? () => undefined : (stryCov_9fa48("3418"), arg => stryMutAct_9fa48("3419") ? arg.endsWith('--limit=') : (stryCov_9fa48("3419"), arg.startsWith(stryMutAct_9fa48("3420") ? "" : (stryCov_9fa48("3420"), '--limit=')))))?.split(stryMutAct_9fa48("3421") ? "" : (stryCov_9fa48("3421"), '='))[1])) || (stryMutAct_9fa48("3422") ? "" : (stryCov_9fa48("3422"), '20'))));
      const column = stryMutAct_9fa48("3423") ? args.find(arg => arg.startsWith('--column=')).split('=')[1] : (stryCov_9fa48("3423"), args.find(stryMutAct_9fa48("3424") ? () => undefined : (stryCov_9fa48("3424"), arg => stryMutAct_9fa48("3425") ? arg.endsWith('--column=') : (stryCov_9fa48("3425"), arg.startsWith(stryMutAct_9fa48("3426") ? "" : (stryCov_9fa48("3426"), '--column=')))))?.split(stryMutAct_9fa48("3427") ? "" : (stryCov_9fa48("3427"), '='))[1]);
      const severity = args.find(arg => arg.startsWith('--severity='))?.split('=')[1] as 'warning' | 'error' | 'critical' | undefined;
      const since = stryMutAct_9fa48("3428") ? args.find(arg => arg.startsWith('--since=')).split('=')[1] : (stryCov_9fa48("3428"), args.find(stryMutAct_9fa48("3429") ? () => undefined : (stryCov_9fa48("3429"), arg => stryMutAct_9fa48("3430") ? arg.endsWith('--since=') : (stryCov_9fa48("3430"), arg.startsWith(stryMutAct_9fa48("3431") ? "" : (stryCov_9fa48("3431"), '--since=')))))?.split(stryMutAct_9fa48("3432") ? "" : (stryCov_9fa48("3432"), '='))[1]);
      console.log(stryMutAct_9fa48("3433") ? "" : (stryCov_9fa48("3433"), '🚨 WIP Limit Violations History'));
      if (stryMutAct_9fa48("3435") ? false : stryMutAct_9fa48("3434") ? true : (stryCov_9fa48("3434", "3435"), column)) console.log(stryMutAct_9fa48("3436") ? `` : (stryCov_9fa48("3436"), `📋 Column: ${column}`));
      if (stryMutAct_9fa48("3438") ? false : stryMutAct_9fa48("3437") ? true : (stryCov_9fa48("3437", "3438"), severity)) console.log(stryMutAct_9fa48("3439") ? `` : (stryCov_9fa48("3439"), `🔍 Severity: ${severity}`));
      if (stryMutAct_9fa48("3441") ? false : stryMutAct_9fa48("3440") ? true : (stryCov_9fa48("3440", "3441"), since)) console.log(stryMutAct_9fa48("3442") ? `` : (stryCov_9fa48("3442"), `📅 Since: ${since}`));
      console.log(stryMutAct_9fa48("3443") ? "Stryker was here!" : (stryCov_9fa48("3443"), ''));
      const violations = wipEnforcement.getViolationHistory(stryMutAct_9fa48("3444") ? {} : (stryCov_9fa48("3444"), {
        limit,
        column,
        severity,
        since
      }));
      if (stryMutAct_9fa48("3447") ? violations.length !== 0 : stryMutAct_9fa48("3446") ? false : stryMutAct_9fa48("3445") ? true : (stryCov_9fa48("3445", "3446", "3447"), violations.length === 0)) {
        if (stryMutAct_9fa48("3448")) {
          {}
        } else {
          stryCov_9fa48("3448");
          console.log(stryMutAct_9fa48("3449") ? "" : (stryCov_9fa48("3449"), '✅ No violations found matching the criteria'));
          return stryMutAct_9fa48("3450") ? ["Stryker was here"] : (stryCov_9fa48("3450"), []);
        }
      }
      for (const violation of violations) {
        if (stryMutAct_9fa48("3451")) {
          {}
        } else {
          stryCov_9fa48("3451");
          const icon = (stryMutAct_9fa48("3454") ? violation.severity !== 'critical' : stryMutAct_9fa48("3453") ? false : stryMutAct_9fa48("3452") ? true : (stryCov_9fa48("3452", "3453", "3454"), violation.severity === (stryMutAct_9fa48("3455") ? "" : (stryCov_9fa48("3455"), 'critical')))) ? stryMutAct_9fa48("3456") ? "" : (stryCov_9fa48("3456"), '🚨') : (stryMutAct_9fa48("3459") ? violation.severity !== 'error' : stryMutAct_9fa48("3458") ? false : stryMutAct_9fa48("3457") ? true : (stryCov_9fa48("3457", "3458", "3459"), violation.severity === (stryMutAct_9fa48("3460") ? "" : (stryCov_9fa48("3460"), 'error')))) ? stryMutAct_9fa48("3461") ? "" : (stryCov_9fa48("3461"), '❌') : stryMutAct_9fa48("3462") ? "" : (stryCov_9fa48("3462"), '⚠️');
          console.log(stryMutAct_9fa48("3463") ? `` : (stryCov_9fa48("3463"), `${icon} ${new Date(violation.timestamp).toLocaleString()}`));
          console.log(stryMutAct_9fa48("3464") ? `` : (stryCov_9fa48("3464"), `   Task: ${violation.taskTitle}`));
          console.log(stryMutAct_9fa48("3465") ? `` : (stryCov_9fa48("3465"), `   Column: ${violation.column} (${violation.current}/${violation.limit})`));
          console.log(stryMutAct_9fa48("3466") ? `` : (stryCov_9fa48("3466"), `   Utilization: ${violation.utilization.toFixed(1)}%`));
          console.log(stryMutAct_9fa48("3467") ? `` : (stryCov_9fa48("3467"), `   Blocked: ${violation.blocked ? stryMutAct_9fa48("3468") ? "" : (stryCov_9fa48("3468"), 'Yes') : stryMutAct_9fa48("3469") ? "" : (stryCov_9fa48("3469"), 'No')}`));
          if (stryMutAct_9fa48("3471") ? false : stryMutAct_9fa48("3470") ? true : (stryCov_9fa48("3470", "3471"), violation.overrideReason)) {
            if (stryMutAct_9fa48("3472")) {
              {}
            } else {
              stryCov_9fa48("3472");
              console.log(stryMutAct_9fa48("3473") ? `` : (stryCov_9fa48("3473"), `   🔓 Override: ${violation.overrideReason} by ${violation.overrideBy}`));
            }
          }
          if (stryMutAct_9fa48("3477") ? violation.suggestions.length <= 0 : stryMutAct_9fa48("3476") ? violation.suggestions.length >= 0 : stryMutAct_9fa48("3475") ? false : stryMutAct_9fa48("3474") ? true : (stryCov_9fa48("3474", "3475", "3476", "3477"), violation.suggestions.length > 0)) {
            if (stryMutAct_9fa48("3478")) {
              {}
            } else {
              stryCov_9fa48("3478");
              console.log(stryMutAct_9fa48("3479") ? `` : (stryCov_9fa48("3479"), `   💡 Suggestions:`));
              for (const suggestion of violation.suggestions) {
                if (stryMutAct_9fa48("3480")) {
                  {}
                } else {
                  stryCov_9fa48("3480");
                  console.log(stryMutAct_9fa48("3481") ? `` : (stryCov_9fa48("3481"), `     • ${suggestion.description}`));
                }
              }
            }
          }
          console.log(stryMutAct_9fa48("3482") ? "Stryker was here!" : (stryCov_9fa48("3482"), ''));
        }
      }
      return violations;
    }
  });
  return handleWipViolations;
})());
const handleWipSuggestions: CommandHandler = stryMutAct_9fa48("3483") ? () => undefined : (stryCov_9fa48("3483"), (() => {
  const handleWipSuggestions: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("3484")) {
      {}
    } else {
      stryCov_9fa48("3484");
      const configResult = await loadKanbanConfig();
      const wipEnforcement = await createWIPLimitEnforcement(stryMutAct_9fa48("3485") ? {} : (stryCov_9fa48("3485"), {
        config: configResult.config
      }));
      const column = requireArg(args[0], stryMutAct_9fa48("3486") ? "" : (stryCov_9fa48("3486"), 'column name'));
      const apply = args.includes(stryMutAct_9fa48("3487") ? "" : (stryCov_9fa48("3487"), '--apply'));
      console.log(stryMutAct_9fa48("3488") ? `` : (stryCov_9fa48("3488"), `💡 Capacity Balancing Suggestions for "${column}"`));
      console.log(stryMutAct_9fa48("3489") ? "Stryker was here!" : (stryCov_9fa48("3489"), ''));
      const suggestions = await wipEnforcement.generateCapacitySuggestions(column, board as Board);
      if (stryMutAct_9fa48("3492") ? suggestions.length !== 0 : stryMutAct_9fa48("3491") ? false : stryMutAct_9fa48("3490") ? true : (stryCov_9fa48("3490", "3491", "3492"), suggestions.length === 0)) {
        if (stryMutAct_9fa48("3493")) {
          {}
        } else {
          stryCov_9fa48("3493");
          console.log(stryMutAct_9fa48("3494") ? "" : (stryCov_9fa48("3494"), '✅ No capacity balancing suggestions needed'));
          return stryMutAct_9fa48("3495") ? ["Stryker was here"] : (stryCov_9fa48("3495"), []);
        }
      }
      for (const suggestion of suggestions) {
        if (stryMutAct_9fa48("3496")) {
          {}
        } else {
          stryCov_9fa48("3496");
          const icon = (stryMutAct_9fa48("3499") ? suggestion.priority !== 'high' : stryMutAct_9fa48("3498") ? false : stryMutAct_9fa48("3497") ? true : (stryCov_9fa48("3497", "3498", "3499"), suggestion.priority === (stryMutAct_9fa48("3500") ? "" : (stryCov_9fa48("3500"), 'high')))) ? stryMutAct_9fa48("3501") ? "" : (stryCov_9fa48("3501"), '🔥') : (stryMutAct_9fa48("3504") ? suggestion.priority !== 'medium' : stryMutAct_9fa48("3503") ? false : stryMutAct_9fa48("3502") ? true : (stryCov_9fa48("3502", "3503", "3504"), suggestion.priority === (stryMutAct_9fa48("3505") ? "" : (stryCov_9fa48("3505"), 'medium')))) ? stryMutAct_9fa48("3506") ? "" : (stryCov_9fa48("3506"), '⚡') : stryMutAct_9fa48("3507") ? "" : (stryCov_9fa48("3507"), '💡');
          console.log(stryMutAct_9fa48("3508") ? `` : (stryCov_9fa48("3508"), `${icon} ${suggestion.description}`));
          console.log(stryMutAct_9fa48("3509") ? `` : (stryCov_9fa48("3509"), `   Priority: ${suggestion.priority}`));
          console.log(stryMutAct_9fa48("3510") ? `` : (stryCov_9fa48("3510"), `   Impact: ${suggestion.impact.taskCount} tasks affected`));
          if (stryMutAct_9fa48("3513") ? suggestion.tasks || suggestion.tasks.length > 0 : stryMutAct_9fa48("3512") ? false : stryMutAct_9fa48("3511") ? true : (stryCov_9fa48("3511", "3512", "3513"), suggestion.tasks && (stryMutAct_9fa48("3516") ? suggestion.tasks.length <= 0 : stryMutAct_9fa48("3515") ? suggestion.tasks.length >= 0 : stryMutAct_9fa48("3514") ? true : (stryCov_9fa48("3514", "3515", "3516"), suggestion.tasks.length > 0)))) {
            if (stryMutAct_9fa48("3517")) {
              {}
            } else {
              stryCov_9fa48("3517");
              console.log(stryMutAct_9fa48("3518") ? `` : (stryCov_9fa48("3518"), `   Tasks to move:`));
              for (const task of suggestion.tasks) {
                if (stryMutAct_9fa48("3519")) {
                  {}
                } else {
                  stryCov_9fa48("3519");
                  console.log(stryMutAct_9fa48("3520") ? `` : (stryCov_9fa48("3520"), `     • ${task.title} (${task.priority})`));
                }
              }
            }
          }
          console.log(stryMutAct_9fa48("3521") ? "Stryker was here!" : (stryCov_9fa48("3521"), ''));
        }
      }
      if (stryMutAct_9fa48("3524") ? apply || suggestions.length > 0 : stryMutAct_9fa48("3523") ? false : stryMutAct_9fa48("3522") ? true : (stryCov_9fa48("3522", "3523", "3524"), apply && (stryMutAct_9fa48("3527") ? suggestions.length <= 0 : stryMutAct_9fa48("3526") ? suggestions.length >= 0 : stryMutAct_9fa48("3525") ? true : (stryCov_9fa48("3525", "3526", "3527"), suggestions.length > 0)))) {
        if (stryMutAct_9fa48("3528")) {
          {}
        } else {
          stryCov_9fa48("3528");
          console.log(stryMutAct_9fa48("3529") ? "" : (stryCov_9fa48("3529"), '🔧 Applying suggestions...'));
          // Implementation for applying suggestions would go here
          console.log(stryMutAct_9fa48("3530") ? "" : (stryCov_9fa48("3530"), '⚠️  Auto-apply feature not yet implemented'));
        }
      }
      return suggestions;
    }
  });
  return handleWipSuggestions;
})());

// CRUD Commands Implementation

const parseCreateTaskArgs = (args: ReadonlyArray<string>) => {
  if (stryMutAct_9fa48("3531")) {
    {}
  } else {
    stryCov_9fa48("3531");
    if (stryMutAct_9fa48("3534") ? args.length !== 0 : stryMutAct_9fa48("3533") ? false : stryMutAct_9fa48("3532") ? true : (stryCov_9fa48("3532", "3533", "3534"), args.length === 0)) {
      if (stryMutAct_9fa48("3535")) {
        {}
      } else {
        stryCov_9fa48("3535");
        throw new CommandUsageError(stryMutAct_9fa48("3536") ? "" : (stryCov_9fa48("3536"), 'create requires a title'));
      }
    }

    // Parse optional flags and separate title from flags
    const result: {
      title: string;
      content?: string;
      priority?: string;
      labels?: string[];
      status?: string;
    } = stryMutAct_9fa48("3537") ? {} : (stryCov_9fa48("3537"), {
      title: stryMutAct_9fa48("3538") ? "Stryker was here!" : (stryCov_9fa48("3538"), '')
    });
    const titleParts: string[] = stryMutAct_9fa48("3539") ? ["Stryker was here"] : (stryCov_9fa48("3539"), []);
    for (let i = 0; stryMutAct_9fa48("3542") ? i >= args.length : stryMutAct_9fa48("3541") ? i <= args.length : stryMutAct_9fa48("3540") ? false : (stryCov_9fa48("3540", "3541", "3542"), i < args.length); stryMutAct_9fa48("3543") ? i-- : (stryCov_9fa48("3543"), i++)) {
      if (stryMutAct_9fa48("3544")) {
        {}
      } else {
        stryCov_9fa48("3544");
        const arg = args[i];
        if (stryMutAct_9fa48("3547") ? false : stryMutAct_9fa48("3546") ? true : stryMutAct_9fa48("3545") ? arg : (stryCov_9fa48("3545", "3546", "3547"), !arg)) continue;

        // Handle flags
        if (stryMutAct_9fa48("3550") ? arg.endsWith('--title=') : stryMutAct_9fa48("3549") ? false : stryMutAct_9fa48("3548") ? true : (stryCov_9fa48("3548", "3549", "3550"), arg.startsWith(stryMutAct_9fa48("3551") ? "" : (stryCov_9fa48("3551"), '--title=')))) {
          if (stryMutAct_9fa48("3552")) {
            {}
          } else {
            stryCov_9fa48("3552");
            result.title = stryMutAct_9fa48("3555") ? arg.slice('--title='.length) && '' : stryMutAct_9fa48("3554") ? false : stryMutAct_9fa48("3553") ? true : (stryCov_9fa48("3553", "3554", "3555"), (stryMutAct_9fa48("3556") ? arg : (stryCov_9fa48("3556"), arg.slice((stryMutAct_9fa48("3557") ? "" : (stryCov_9fa48("3557"), '--title=')).length))) || (stryMutAct_9fa48("3558") ? "Stryker was here!" : (stryCov_9fa48("3558"), '')));
          }
        } else if (stryMutAct_9fa48("3561") ? arg.endsWith('--content=') : stryMutAct_9fa48("3560") ? false : stryMutAct_9fa48("3559") ? true : (stryCov_9fa48("3559", "3560", "3561"), arg.startsWith(stryMutAct_9fa48("3562") ? "" : (stryCov_9fa48("3562"), '--content=')))) {
          if (stryMutAct_9fa48("3563")) {
            {}
          } else {
            stryCov_9fa48("3563");
            result.content = stryMutAct_9fa48("3564") ? arg : (stryCov_9fa48("3564"), arg.slice((stryMutAct_9fa48("3565") ? "" : (stryCov_9fa48("3565"), '--content=')).length));
          }
        } else if (stryMutAct_9fa48("3568") ? arg.endsWith('--description=') : stryMutAct_9fa48("3567") ? false : stryMutAct_9fa48("3566") ? true : (stryCov_9fa48("3566", "3567", "3568"), arg.startsWith(stryMutAct_9fa48("3569") ? "" : (stryCov_9fa48("3569"), '--description=')))) {
          if (stryMutAct_9fa48("3570")) {
            {}
          } else {
            stryCov_9fa48("3570");
            result.content = stryMutAct_9fa48("3571") ? arg : (stryCov_9fa48("3571"), arg.slice((stryMutAct_9fa48("3572") ? "" : (stryCov_9fa48("3572"), '--description=')).length));
          }
        } else if (stryMutAct_9fa48("3575") ? arg === '--title' && i + 1 < args.length || args[i + 1] : stryMutAct_9fa48("3574") ? false : stryMutAct_9fa48("3573") ? true : (stryCov_9fa48("3573", "3574", "3575"), (stryMutAct_9fa48("3577") ? arg === '--title' || i + 1 < args.length : stryMutAct_9fa48("3576") ? true : (stryCov_9fa48("3576", "3577"), (stryMutAct_9fa48("3579") ? arg !== '--title' : stryMutAct_9fa48("3578") ? true : (stryCov_9fa48("3578", "3579"), arg === (stryMutAct_9fa48("3580") ? "" : (stryCov_9fa48("3580"), '--title')))) && (stryMutAct_9fa48("3583") ? i + 1 >= args.length : stryMutAct_9fa48("3582") ? i + 1 <= args.length : stryMutAct_9fa48("3581") ? true : (stryCov_9fa48("3581", "3582", "3583"), (stryMutAct_9fa48("3584") ? i - 1 : (stryCov_9fa48("3584"), i + 1)) < args.length)))) && args[stryMutAct_9fa48("3585") ? i - 1 : (stryCov_9fa48("3585"), i + 1)])) {
          if (stryMutAct_9fa48("3586")) {
            {}
          } else {
            stryCov_9fa48("3586");
            result.title = stryMutAct_9fa48("3589") ? args[i + 1] && '' : stryMutAct_9fa48("3588") ? false : stryMutAct_9fa48("3587") ? true : (stryCov_9fa48("3587", "3588", "3589"), args[stryMutAct_9fa48("3590") ? i - 1 : (stryCov_9fa48("3590"), i + 1)] || (stryMutAct_9fa48("3591") ? "Stryker was here!" : (stryCov_9fa48("3591"), '')));
            stryMutAct_9fa48("3592") ? i-- : (stryCov_9fa48("3592"), i++); // Skip next arg
          }
        } else if (stryMutAct_9fa48("3595") ? arg === '--content' && i + 1 < args.length || args[i + 1] : stryMutAct_9fa48("3594") ? false : stryMutAct_9fa48("3593") ? true : (stryCov_9fa48("3593", "3594", "3595"), (stryMutAct_9fa48("3597") ? arg === '--content' || i + 1 < args.length : stryMutAct_9fa48("3596") ? true : (stryCov_9fa48("3596", "3597"), (stryMutAct_9fa48("3599") ? arg !== '--content' : stryMutAct_9fa48("3598") ? true : (stryCov_9fa48("3598", "3599"), arg === (stryMutAct_9fa48("3600") ? "" : (stryCov_9fa48("3600"), '--content')))) && (stryMutAct_9fa48("3603") ? i + 1 >= args.length : stryMutAct_9fa48("3602") ? i + 1 <= args.length : stryMutAct_9fa48("3601") ? true : (stryCov_9fa48("3601", "3602", "3603"), (stryMutAct_9fa48("3604") ? i - 1 : (stryCov_9fa48("3604"), i + 1)) < args.length)))) && args[stryMutAct_9fa48("3605") ? i - 1 : (stryCov_9fa48("3605"), i + 1)])) {
          if (stryMutAct_9fa48("3606")) {
            {}
          } else {
            stryCov_9fa48("3606");
            result.content = args[stryMutAct_9fa48("3607") ? i - 1 : (stryCov_9fa48("3607"), i + 1)];
            stryMutAct_9fa48("3608") ? i-- : (stryCov_9fa48("3608"), i++); // Skip next arg
          }
        } else if (stryMutAct_9fa48("3611") ? arg === '--description' && i + 1 < args.length || args[i + 1] : stryMutAct_9fa48("3610") ? false : stryMutAct_9fa48("3609") ? true : (stryCov_9fa48("3609", "3610", "3611"), (stryMutAct_9fa48("3613") ? arg === '--description' || i + 1 < args.length : stryMutAct_9fa48("3612") ? true : (stryCov_9fa48("3612", "3613"), (stryMutAct_9fa48("3615") ? arg !== '--description' : stryMutAct_9fa48("3614") ? true : (stryCov_9fa48("3614", "3615"), arg === (stryMutAct_9fa48("3616") ? "" : (stryCov_9fa48("3616"), '--description')))) && (stryMutAct_9fa48("3619") ? i + 1 >= args.length : stryMutAct_9fa48("3618") ? i + 1 <= args.length : stryMutAct_9fa48("3617") ? true : (stryCov_9fa48("3617", "3618", "3619"), (stryMutAct_9fa48("3620") ? i - 1 : (stryCov_9fa48("3620"), i + 1)) < args.length)))) && args[stryMutAct_9fa48("3621") ? i - 1 : (stryCov_9fa48("3621"), i + 1)])) {
          if (stryMutAct_9fa48("3622")) {
            {}
          } else {
            stryCov_9fa48("3622");
            result.content = args[stryMutAct_9fa48("3623") ? i - 1 : (stryCov_9fa48("3623"), i + 1)];
            stryMutAct_9fa48("3624") ? i-- : (stryCov_9fa48("3624"), i++); // Skip next arg
          }
        } else if (stryMutAct_9fa48("3627") ? arg.endsWith('--priority=') : stryMutAct_9fa48("3626") ? false : stryMutAct_9fa48("3625") ? true : (stryCov_9fa48("3625", "3626", "3627"), arg.startsWith(stryMutAct_9fa48("3628") ? "" : (stryCov_9fa48("3628"), '--priority=')))) {
          if (stryMutAct_9fa48("3629")) {
            {}
          } else {
            stryCov_9fa48("3629");
            result.priority = stryMutAct_9fa48("3630") ? arg : (stryCov_9fa48("3630"), arg.slice((stryMutAct_9fa48("3631") ? "" : (stryCov_9fa48("3631"), '--priority=')).length));
          }
        } else if (stryMutAct_9fa48("3634") ? arg === '--priority' && i + 1 < args.length || args[i + 1] : stryMutAct_9fa48("3633") ? false : stryMutAct_9fa48("3632") ? true : (stryCov_9fa48("3632", "3633", "3634"), (stryMutAct_9fa48("3636") ? arg === '--priority' || i + 1 < args.length : stryMutAct_9fa48("3635") ? true : (stryCov_9fa48("3635", "3636"), (stryMutAct_9fa48("3638") ? arg !== '--priority' : stryMutAct_9fa48("3637") ? true : (stryCov_9fa48("3637", "3638"), arg === (stryMutAct_9fa48("3639") ? "" : (stryCov_9fa48("3639"), '--priority')))) && (stryMutAct_9fa48("3642") ? i + 1 >= args.length : stryMutAct_9fa48("3641") ? i + 1 <= args.length : stryMutAct_9fa48("3640") ? true : (stryCov_9fa48("3640", "3641", "3642"), (stryMutAct_9fa48("3643") ? i - 1 : (stryCov_9fa48("3643"), i + 1)) < args.length)))) && args[stryMutAct_9fa48("3644") ? i - 1 : (stryCov_9fa48("3644"), i + 1)])) {
          if (stryMutAct_9fa48("3645")) {
            {}
          } else {
            stryCov_9fa48("3645");
            result.priority = args[stryMutAct_9fa48("3646") ? i - 1 : (stryCov_9fa48("3646"), i + 1)];
            stryMutAct_9fa48("3647") ? i-- : (stryCov_9fa48("3647"), i++); // Skip next arg
          }
        } else if (stryMutAct_9fa48("3650") ? arg.endsWith('--status=') : stryMutAct_9fa48("3649") ? false : stryMutAct_9fa48("3648") ? true : (stryCov_9fa48("3648", "3649", "3650"), arg.startsWith(stryMutAct_9fa48("3651") ? "" : (stryCov_9fa48("3651"), '--status=')))) {
          if (stryMutAct_9fa48("3652")) {
            {}
          } else {
            stryCov_9fa48("3652");
            result.status = stryMutAct_9fa48("3653") ? arg : (stryCov_9fa48("3653"), arg.slice((stryMutAct_9fa48("3654") ? "" : (stryCov_9fa48("3654"), '--status=')).length));
          }
        } else if (stryMutAct_9fa48("3657") ? arg === '--status' && i + 1 < args.length || args[i + 1] : stryMutAct_9fa48("3656") ? false : stryMutAct_9fa48("3655") ? true : (stryCov_9fa48("3655", "3656", "3657"), (stryMutAct_9fa48("3659") ? arg === '--status' || i + 1 < args.length : stryMutAct_9fa48("3658") ? true : (stryCov_9fa48("3658", "3659"), (stryMutAct_9fa48("3661") ? arg !== '--status' : stryMutAct_9fa48("3660") ? true : (stryCov_9fa48("3660", "3661"), arg === (stryMutAct_9fa48("3662") ? "" : (stryCov_9fa48("3662"), '--status')))) && (stryMutAct_9fa48("3665") ? i + 1 >= args.length : stryMutAct_9fa48("3664") ? i + 1 <= args.length : stryMutAct_9fa48("3663") ? true : (stryCov_9fa48("3663", "3664", "3665"), (stryMutAct_9fa48("3666") ? i - 1 : (stryCov_9fa48("3666"), i + 1)) < args.length)))) && args[stryMutAct_9fa48("3667") ? i - 1 : (stryCov_9fa48("3667"), i + 1)])) {
          if (stryMutAct_9fa48("3668")) {
            {}
          } else {
            stryCov_9fa48("3668");
            result.status = args[stryMutAct_9fa48("3669") ? i - 1 : (stryCov_9fa48("3669"), i + 1)];
            stryMutAct_9fa48("3670") ? i-- : (stryCov_9fa48("3670"), i++); // Skip next arg
          }
        } else if (stryMutAct_9fa48("3673") ? arg.endsWith('--labels=') : stryMutAct_9fa48("3672") ? false : stryMutAct_9fa48("3671") ? true : (stryCov_9fa48("3671", "3672", "3673"), arg.startsWith(stryMutAct_9fa48("3674") ? "" : (stryCov_9fa48("3674"), '--labels=')))) {
          if (stryMutAct_9fa48("3675")) {
            {}
          } else {
            stryCov_9fa48("3675");
            const labelsStr = stryMutAct_9fa48("3676") ? arg : (stryCov_9fa48("3676"), arg.slice((stryMutAct_9fa48("3677") ? "" : (stryCov_9fa48("3677"), '--labels=')).length));
            result.labels = stryMutAct_9fa48("3678") ? labelsStr.split(',').map(l => l.trim()) : (stryCov_9fa48("3678"), labelsStr.split(stryMutAct_9fa48("3679") ? "" : (stryCov_9fa48("3679"), ',')).map(stryMutAct_9fa48("3680") ? () => undefined : (stryCov_9fa48("3680"), l => stryMutAct_9fa48("3681") ? l : (stryCov_9fa48("3681"), l.trim()))).filter(stryMutAct_9fa48("3682") ? () => undefined : (stryCov_9fa48("3682"), l => stryMutAct_9fa48("3686") ? l.length <= 0 : stryMutAct_9fa48("3685") ? l.length >= 0 : stryMutAct_9fa48("3684") ? false : stryMutAct_9fa48("3683") ? true : (stryCov_9fa48("3683", "3684", "3685", "3686"), l.length > 0))));
          }
        } else if (stryMutAct_9fa48("3689") ? arg === '--labels' && i + 1 < args.length || args[i + 1] : stryMutAct_9fa48("3688") ? false : stryMutAct_9fa48("3687") ? true : (stryCov_9fa48("3687", "3688", "3689"), (stryMutAct_9fa48("3691") ? arg === '--labels' || i + 1 < args.length : stryMutAct_9fa48("3690") ? true : (stryCov_9fa48("3690", "3691"), (stryMutAct_9fa48("3693") ? arg !== '--labels' : stryMutAct_9fa48("3692") ? true : (stryCov_9fa48("3692", "3693"), arg === (stryMutAct_9fa48("3694") ? "" : (stryCov_9fa48("3694"), '--labels')))) && (stryMutAct_9fa48("3697") ? i + 1 >= args.length : stryMutAct_9fa48("3696") ? i + 1 <= args.length : stryMutAct_9fa48("3695") ? true : (stryCov_9fa48("3695", "3696", "3697"), (stryMutAct_9fa48("3698") ? i - 1 : (stryCov_9fa48("3698"), i + 1)) < args.length)))) && args[stryMutAct_9fa48("3699") ? i - 1 : (stryCov_9fa48("3699"), i + 1)])) {
          if (stryMutAct_9fa48("3700")) {
            {}
          } else {
            stryCov_9fa48("3700");
            const labelsStr = args[stryMutAct_9fa48("3701") ? i - 1 : (stryCov_9fa48("3701"), i + 1)];
            if (stryMutAct_9fa48("3703") ? false : stryMutAct_9fa48("3702") ? true : (stryCov_9fa48("3702", "3703"), labelsStr)) {
              if (stryMutAct_9fa48("3704")) {
                {}
              } else {
                stryCov_9fa48("3704");
                result.labels = stryMutAct_9fa48("3705") ? labelsStr.split(',').map(l => l.trim()) : (stryCov_9fa48("3705"), labelsStr.split(stryMutAct_9fa48("3706") ? "" : (stryCov_9fa48("3706"), ',')).map(stryMutAct_9fa48("3707") ? () => undefined : (stryCov_9fa48("3707"), l => stryMutAct_9fa48("3708") ? l : (stryCov_9fa48("3708"), l.trim()))).filter(stryMutAct_9fa48("3709") ? () => undefined : (stryCov_9fa48("3709"), l => stryMutAct_9fa48("3713") ? l.length <= 0 : stryMutAct_9fa48("3712") ? l.length >= 0 : stryMutAct_9fa48("3711") ? false : stryMutAct_9fa48("3710") ? true : (stryCov_9fa48("3710", "3711", "3712", "3713"), l.length > 0))));
              }
            }
            stryMutAct_9fa48("3714") ? i-- : (stryCov_9fa48("3714"), i++); // Skip next arg
          }
        } else {
          if (stryMutAct_9fa48("3715")) {
            {}
          } else {
            stryCov_9fa48("3715");
            // Add to title parts (non-flag arguments)
            titleParts.push(arg);
          }
        }
      }
    }
    const titleFromParts = stryMutAct_9fa48("3716") ? titleParts.join(' ') : (stryCov_9fa48("3716"), titleParts.join(stryMutAct_9fa48("3717") ? "" : (stryCov_9fa48("3717"), ' ')).trim());
    if (stryMutAct_9fa48("3721") ? titleFromParts.length <= 0 : stryMutAct_9fa48("3720") ? titleFromParts.length >= 0 : stryMutAct_9fa48("3719") ? false : stryMutAct_9fa48("3718") ? true : (stryCov_9fa48("3718", "3719", "3720", "3721"), titleFromParts.length > 0)) {
      if (stryMutAct_9fa48("3722")) {
        {}
      } else {
        stryCov_9fa48("3722");
        result.title = titleFromParts;
      }
    }
    if (stryMutAct_9fa48("3725") ? !result.title && result.title.trim().length === 0 : stryMutAct_9fa48("3724") ? false : stryMutAct_9fa48("3723") ? true : (stryCov_9fa48("3723", "3724", "3725"), (stryMutAct_9fa48("3726") ? result.title : (stryCov_9fa48("3726"), !result.title)) || (stryMutAct_9fa48("3728") ? result.title.trim().length !== 0 : stryMutAct_9fa48("3727") ? false : (stryCov_9fa48("3727", "3728"), (stryMutAct_9fa48("3729") ? result.title.length : (stryCov_9fa48("3729"), result.title.trim().length)) === 0)))) {
      if (stryMutAct_9fa48("3730")) {
        {}
      } else {
        stryCov_9fa48("3730");
        throw new CommandUsageError(stryMutAct_9fa48("3731") ? "" : (stryCov_9fa48("3731"), 'create requires a title'));
      }
    }
    return result;
  }
};
const handleCreate: CommandHandler = stryMutAct_9fa48("3732") ? () => undefined : (stryCov_9fa48("3732"), (() => {
  const handleCreate: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("3733")) {
      {}
    } else {
      stryCov_9fa48("3733");
      const mutableBoard = board as unknown as Board;
      const taskArgs = parseCreateTaskArgs(args);
      const newTask = await createTask(mutableBoard, stryMutAct_9fa48("3736") ? taskArgs.status && 'incoming' : stryMutAct_9fa48("3735") ? false : stryMutAct_9fa48("3734") ? true : (stryCov_9fa48("3734", "3735", "3736"), taskArgs.status || (stryMutAct_9fa48("3737") ? "" : (stryCov_9fa48("3737"), 'incoming'))), stryMutAct_9fa48("3738") ? {} : (stryCov_9fa48("3738"), {
        title: taskArgs.title,
        content: taskArgs.content,
        priority: taskArgs.priority,
        labels: taskArgs.labels
      }), context.tasksDir, context.boardFile);
      console.log(stryMutAct_9fa48("3739") ? `` : (stryCov_9fa48("3739"), `✅ Created task "${newTask.title}" (${stryMutAct_9fa48("3740") ? newTask.uuid : (stryCov_9fa48("3740"), newTask.uuid.slice(0, 8))}...)`));
      console.log(stryMutAct_9fa48("3741") ? `` : (stryCov_9fa48("3741"), `   Status: ${newTask.status}`));
      if (stryMutAct_9fa48("3743") ? false : stryMutAct_9fa48("3742") ? true : (stryCov_9fa48("3742", "3743"), newTask.priority)) {
        if (stryMutAct_9fa48("3744")) {
          {}
        } else {
          stryCov_9fa48("3744");
          console.log(stryMutAct_9fa48("3745") ? `` : (stryCov_9fa48("3745"), `   Priority: ${newTask.priority}`));
        }
      }
      if (stryMutAct_9fa48("3748") ? newTask.labels || newTask.labels.length > 0 : stryMutAct_9fa48("3747") ? false : stryMutAct_9fa48("3746") ? true : (stryCov_9fa48("3746", "3747", "3748"), newTask.labels && (stryMutAct_9fa48("3751") ? newTask.labels.length <= 0 : stryMutAct_9fa48("3750") ? newTask.labels.length >= 0 : stryMutAct_9fa48("3749") ? true : (stryCov_9fa48("3749", "3750", "3751"), newTask.labels.length > 0)))) {
        if (stryMutAct_9fa48("3752")) {
          {}
        } else {
          stryCov_9fa48("3752");
          console.log(stryMutAct_9fa48("3753") ? `` : (stryCov_9fa48("3753"), `   Labels: ${newTask.labels.join(stryMutAct_9fa48("3754") ? "" : (stryCov_9fa48("3754"), ', '))}`));
        }
      }

      // Show commit tracking information
      if (stryMutAct_9fa48("3756") ? false : stryMutAct_9fa48("3755") ? true : (stryCov_9fa48("3755", "3756"), newTask.lastCommitSha)) {
        if (stryMutAct_9fa48("3757")) {
          {}
        } else {
          stryCov_9fa48("3757");
          console.log(stryMutAct_9fa48("3758") ? `` : (stryCov_9fa48("3758"), `   Commit: ${stryMutAct_9fa48("3759") ? newTask.lastCommitSha : (stryCov_9fa48("3759"), newTask.lastCommitSha.slice(0, 8))}...`));
        }
      }
      return newTask;
    }
  });
  return handleCreate;
})());
const parseUpdateTaskArgs = (args: ReadonlyArray<string>) => {
  if (stryMutAct_9fa48("3760")) {
    {}
  } else {
    stryCov_9fa48("3760");
    if (stryMutAct_9fa48("3763") ? args.length !== 0 : stryMutAct_9fa48("3762") ? false : stryMutAct_9fa48("3761") ? true : (stryCov_9fa48("3761", "3762", "3763"), args.length === 0)) {
      if (stryMutAct_9fa48("3764")) {
        {}
      } else {
        stryCov_9fa48("3764");
        throw new CommandUsageError(stryMutAct_9fa48("3765") ? "" : (stryCov_9fa48("3765"), 'update requires a task UUID'));
      }
    }
    const uuid = requireArg(args[0], stryMutAct_9fa48("3766") ? "" : (stryCov_9fa48("3766"), 'task UUID'));

    // Parse optional flags
    const result: {
      uuid: string;
      title?: string;
      content?: string;
      priority?: string;
      status?: string;
    } = stryMutAct_9fa48("3767") ? {} : (stryCov_9fa48("3767"), {
      uuid
    });
    for (let i = 1; stryMutAct_9fa48("3770") ? i >= args.length : stryMutAct_9fa48("3769") ? i <= args.length : stryMutAct_9fa48("3768") ? false : (stryCov_9fa48("3768", "3769", "3770"), i < args.length); stryMutAct_9fa48("3771") ? i-- : (stryCov_9fa48("3771"), i++)) {
      if (stryMutAct_9fa48("3772")) {
        {}
      } else {
        stryCov_9fa48("3772");
        const arg = args[i];
        if (stryMutAct_9fa48("3775") ? false : stryMutAct_9fa48("3774") ? true : stryMutAct_9fa48("3773") ? arg : (stryCov_9fa48("3773", "3774", "3775"), !arg)) continue;
        if (stryMutAct_9fa48("3778") ? arg.endsWith('--title=') : stryMutAct_9fa48("3777") ? false : stryMutAct_9fa48("3776") ? true : (stryCov_9fa48("3776", "3777", "3778"), arg.startsWith(stryMutAct_9fa48("3779") ? "" : (stryCov_9fa48("3779"), '--title=')))) {
          if (stryMutAct_9fa48("3780")) {
            {}
          } else {
            stryCov_9fa48("3780");
            result.title = stryMutAct_9fa48("3781") ? arg : (stryCov_9fa48("3781"), arg.slice((stryMutAct_9fa48("3782") ? "" : (stryCov_9fa48("3782"), '--title=')).length));
          }
        } else if (stryMutAct_9fa48("3785") ? arg === '--title' && i + 1 < args.length || args[i + 1] : stryMutAct_9fa48("3784") ? false : stryMutAct_9fa48("3783") ? true : (stryCov_9fa48("3783", "3784", "3785"), (stryMutAct_9fa48("3787") ? arg === '--title' || i + 1 < args.length : stryMutAct_9fa48("3786") ? true : (stryCov_9fa48("3786", "3787"), (stryMutAct_9fa48("3789") ? arg !== '--title' : stryMutAct_9fa48("3788") ? true : (stryCov_9fa48("3788", "3789"), arg === (stryMutAct_9fa48("3790") ? "" : (stryCov_9fa48("3790"), '--title')))) && (stryMutAct_9fa48("3793") ? i + 1 >= args.length : stryMutAct_9fa48("3792") ? i + 1 <= args.length : stryMutAct_9fa48("3791") ? true : (stryCov_9fa48("3791", "3792", "3793"), (stryMutAct_9fa48("3794") ? i - 1 : (stryCov_9fa48("3794"), i + 1)) < args.length)))) && args[stryMutAct_9fa48("3795") ? i - 1 : (stryCov_9fa48("3795"), i + 1)])) {
          if (stryMutAct_9fa48("3796")) {
            {}
          } else {
            stryCov_9fa48("3796");
            result.title = args[stryMutAct_9fa48("3797") ? i - 1 : (stryCov_9fa48("3797"), i + 1)];
            stryMutAct_9fa48("3798") ? i-- : (stryCov_9fa48("3798"), i++); // Skip next arg
          }
        } else if (stryMutAct_9fa48("3801") ? arg.endsWith('--content=') : stryMutAct_9fa48("3800") ? false : stryMutAct_9fa48("3799") ? true : (stryCov_9fa48("3799", "3800", "3801"), arg.startsWith(stryMutAct_9fa48("3802") ? "" : (stryCov_9fa48("3802"), '--content=')))) {
          if (stryMutAct_9fa48("3803")) {
            {}
          } else {
            stryCov_9fa48("3803");
            result.content = stryMutAct_9fa48("3804") ? arg : (stryCov_9fa48("3804"), arg.slice((stryMutAct_9fa48("3805") ? "" : (stryCov_9fa48("3805"), '--content=')).length));
          }
        } else if (stryMutAct_9fa48("3808") ? arg.endsWith('--description=') : stryMutAct_9fa48("3807") ? false : stryMutAct_9fa48("3806") ? true : (stryCov_9fa48("3806", "3807", "3808"), arg.startsWith(stryMutAct_9fa48("3809") ? "" : (stryCov_9fa48("3809"), '--description=')))) {
          if (stryMutAct_9fa48("3810")) {
            {}
          } else {
            stryCov_9fa48("3810");
            result.content = stryMutAct_9fa48("3811") ? arg : (stryCov_9fa48("3811"), arg.slice((stryMutAct_9fa48("3812") ? "" : (stryCov_9fa48("3812"), '--description=')).length));
          }
        } else if (stryMutAct_9fa48("3815") ? arg === '--content' && i + 1 < args.length || args[i + 1] : stryMutAct_9fa48("3814") ? false : stryMutAct_9fa48("3813") ? true : (stryCov_9fa48("3813", "3814", "3815"), (stryMutAct_9fa48("3817") ? arg === '--content' || i + 1 < args.length : stryMutAct_9fa48("3816") ? true : (stryCov_9fa48("3816", "3817"), (stryMutAct_9fa48("3819") ? arg !== '--content' : stryMutAct_9fa48("3818") ? true : (stryCov_9fa48("3818", "3819"), arg === (stryMutAct_9fa48("3820") ? "" : (stryCov_9fa48("3820"), '--content')))) && (stryMutAct_9fa48("3823") ? i + 1 >= args.length : stryMutAct_9fa48("3822") ? i + 1 <= args.length : stryMutAct_9fa48("3821") ? true : (stryCov_9fa48("3821", "3822", "3823"), (stryMutAct_9fa48("3824") ? i - 1 : (stryCov_9fa48("3824"), i + 1)) < args.length)))) && args[stryMutAct_9fa48("3825") ? i - 1 : (stryCov_9fa48("3825"), i + 1)])) {
          if (stryMutAct_9fa48("3826")) {
            {}
          } else {
            stryCov_9fa48("3826");
            result.content = args[stryMutAct_9fa48("3827") ? i - 1 : (stryCov_9fa48("3827"), i + 1)];
            stryMutAct_9fa48("3828") ? i-- : (stryCov_9fa48("3828"), i++); // Skip next arg
          }
        } else if (stryMutAct_9fa48("3831") ? arg === '--description' && i + 1 < args.length || args[i + 1] : stryMutAct_9fa48("3830") ? false : stryMutAct_9fa48("3829") ? true : (stryCov_9fa48("3829", "3830", "3831"), (stryMutAct_9fa48("3833") ? arg === '--description' || i + 1 < args.length : stryMutAct_9fa48("3832") ? true : (stryCov_9fa48("3832", "3833"), (stryMutAct_9fa48("3835") ? arg !== '--description' : stryMutAct_9fa48("3834") ? true : (stryCov_9fa48("3834", "3835"), arg === (stryMutAct_9fa48("3836") ? "" : (stryCov_9fa48("3836"), '--description')))) && (stryMutAct_9fa48("3839") ? i + 1 >= args.length : stryMutAct_9fa48("3838") ? i + 1 <= args.length : stryMutAct_9fa48("3837") ? true : (stryCov_9fa48("3837", "3838", "3839"), (stryMutAct_9fa48("3840") ? i - 1 : (stryCov_9fa48("3840"), i + 1)) < args.length)))) && args[stryMutAct_9fa48("3841") ? i - 1 : (stryCov_9fa48("3841"), i + 1)])) {
          if (stryMutAct_9fa48("3842")) {
            {}
          } else {
            stryCov_9fa48("3842");
            result.content = args[stryMutAct_9fa48("3843") ? i - 1 : (stryCov_9fa48("3843"), i + 1)];
            stryMutAct_9fa48("3844") ? i-- : (stryCov_9fa48("3844"), i++); // Skip next arg
          }
        } else if (stryMutAct_9fa48("3847") ? arg === '--description' && i + 1 < args.length || args[i + 1] : stryMutAct_9fa48("3846") ? false : stryMutAct_9fa48("3845") ? true : (stryCov_9fa48("3845", "3846", "3847"), (stryMutAct_9fa48("3849") ? arg === '--description' || i + 1 < args.length : stryMutAct_9fa48("3848") ? true : (stryCov_9fa48("3848", "3849"), (stryMutAct_9fa48("3851") ? arg !== '--description' : stryMutAct_9fa48("3850") ? true : (stryCov_9fa48("3850", "3851"), arg === (stryMutAct_9fa48("3852") ? "" : (stryCov_9fa48("3852"), '--description')))) && (stryMutAct_9fa48("3855") ? i + 1 >= args.length : stryMutAct_9fa48("3854") ? i + 1 <= args.length : stryMutAct_9fa48("3853") ? true : (stryCov_9fa48("3853", "3854", "3855"), (stryMutAct_9fa48("3856") ? i - 1 : (stryCov_9fa48("3856"), i + 1)) < args.length)))) && args[stryMutAct_9fa48("3857") ? i - 1 : (stryCov_9fa48("3857"), i + 1)])) {
          if (stryMutAct_9fa48("3858")) {
            {}
          } else {
            stryCov_9fa48("3858");
            result.content = args[stryMutAct_9fa48("3859") ? i - 1 : (stryCov_9fa48("3859"), i + 1)];
            stryMutAct_9fa48("3860") ? i-- : (stryCov_9fa48("3860"), i++); // Skip next arg
          }
        } else if (stryMutAct_9fa48("3863") ? arg.endsWith('--priority=') : stryMutAct_9fa48("3862") ? false : stryMutAct_9fa48("3861") ? true : (stryCov_9fa48("3861", "3862", "3863"), arg.startsWith(stryMutAct_9fa48("3864") ? "" : (stryCov_9fa48("3864"), '--priority=')))) {
          if (stryMutAct_9fa48("3865")) {
            {}
          } else {
            stryCov_9fa48("3865");
            result.priority = stryMutAct_9fa48("3866") ? arg : (stryCov_9fa48("3866"), arg.slice((stryMutAct_9fa48("3867") ? "" : (stryCov_9fa48("3867"), '--priority=')).length));
          }
        } else if (stryMutAct_9fa48("3870") ? arg === '--priority' && i + 1 < args.length || args[i + 1] : stryMutAct_9fa48("3869") ? false : stryMutAct_9fa48("3868") ? true : (stryCov_9fa48("3868", "3869", "3870"), (stryMutAct_9fa48("3872") ? arg === '--priority' || i + 1 < args.length : stryMutAct_9fa48("3871") ? true : (stryCov_9fa48("3871", "3872"), (stryMutAct_9fa48("3874") ? arg !== '--priority' : stryMutAct_9fa48("3873") ? true : (stryCov_9fa48("3873", "3874"), arg === (stryMutAct_9fa48("3875") ? "" : (stryCov_9fa48("3875"), '--priority')))) && (stryMutAct_9fa48("3878") ? i + 1 >= args.length : stryMutAct_9fa48("3877") ? i + 1 <= args.length : stryMutAct_9fa48("3876") ? true : (stryCov_9fa48("3876", "3877", "3878"), (stryMutAct_9fa48("3879") ? i - 1 : (stryCov_9fa48("3879"), i + 1)) < args.length)))) && args[stryMutAct_9fa48("3880") ? i - 1 : (stryCov_9fa48("3880"), i + 1)])) {
          if (stryMutAct_9fa48("3881")) {
            {}
          } else {
            stryCov_9fa48("3881");
            result.priority = args[stryMutAct_9fa48("3882") ? i - 1 : (stryCov_9fa48("3882"), i + 1)];
            stryMutAct_9fa48("3883") ? i-- : (stryCov_9fa48("3883"), i++); // Skip next arg
          }
        }
      }
    }
    return result;
  }
};
const handleUpdate: CommandHandler = stryMutAct_9fa48("3884") ? () => undefined : (stryCov_9fa48("3884"), (() => {
  const handleUpdate: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("3885")) {
      {}
    } else {
      stryCov_9fa48("3885");
      const mutableBoard = board as unknown as Board;
      const updateArgs = parseUpdateTaskArgs(args);
      let updatedTask;

      // Update title if provided
      if (stryMutAct_9fa48("3887") ? false : stryMutAct_9fa48("3886") ? true : (stryCov_9fa48("3886", "3887"), updateArgs.title)) {
        if (stryMutAct_9fa48("3888")) {
          {}
        } else {
          stryCov_9fa48("3888");
          updatedTask = await renameTask(mutableBoard, updateArgs.uuid, updateArgs.title, context.tasksDir, context.boardFile);
          if (stryMutAct_9fa48("3890") ? false : stryMutAct_9fa48("3889") ? true : (stryCov_9fa48("3889", "3890"), updatedTask)) {
            if (stryMutAct_9fa48("3891")) {
              {}
            } else {
              stryCov_9fa48("3891");
              console.log(stryMutAct_9fa48("3892") ? `` : (stryCov_9fa48("3892"), `✅ Updated title to "${updateArgs.title}"`));
            }
          }
        }
      }

      // Update content/description if provided
      if (stryMutAct_9fa48("3894") ? false : stryMutAct_9fa48("3893") ? true : (stryCov_9fa48("3893", "3894"), updateArgs.content)) {
        if (stryMutAct_9fa48("3895")) {
          {}
        } else {
          stryCov_9fa48("3895");
          updatedTask = await updateTaskDescription(mutableBoard, updateArgs.uuid, updateArgs.content, context.tasksDir, context.boardFile);
          if (stryMutAct_9fa48("3897") ? false : stryMutAct_9fa48("3896") ? true : (stryCov_9fa48("3896", "3897"), updatedTask)) {
            if (stryMutAct_9fa48("3898")) {
              {}
            } else {
              stryCov_9fa48("3898");
              console.log(stryMutAct_9fa48("3899") ? `` : (stryCov_9fa48("3899"), `✅ Updated task description`));
            }
          }
        }
      }
      if (stryMutAct_9fa48("3902") ? false : stryMutAct_9fa48("3901") ? true : stryMutAct_9fa48("3900") ? updatedTask : (stryCov_9fa48("3900", "3901", "3902"), !updatedTask)) {
        if (stryMutAct_9fa48("3903")) {
          {}
        } else {
          stryCov_9fa48("3903");
          throw new CommandUsageError(stryMutAct_9fa48("3904") ? `` : (stryCov_9fa48("3904"), `Task with UUID ${updateArgs.uuid} not found`));
        }
      }
      return updatedTask;
    }
  });
  return handleUpdate;
})());
const parseDeleteTaskArgs = (args: ReadonlyArray<string>) => {
  if (stryMutAct_9fa48("3905")) {
    {}
  } else {
    stryCov_9fa48("3905");
    if (stryMutAct_9fa48("3908") ? args.length !== 0 : stryMutAct_9fa48("3907") ? false : stryMutAct_9fa48("3906") ? true : (stryCov_9fa48("3906", "3907", "3908"), args.length === 0)) {
      if (stryMutAct_9fa48("3909")) {
        {}
      } else {
        stryCov_9fa48("3909");
        throw new CommandUsageError(stryMutAct_9fa48("3910") ? "" : (stryCov_9fa48("3910"), 'delete requires a task UUID'));
      }
    }
    const uuid = requireArg(args[0], stryMutAct_9fa48("3911") ? "" : (stryCov_9fa48("3911"), 'task UUID'));
    const confirm = stryMutAct_9fa48("3914") ? args.includes('--confirm') && args.includes('-y') : stryMutAct_9fa48("3913") ? false : stryMutAct_9fa48("3912") ? true : (stryCov_9fa48("3912", "3913", "3914"), args.includes(stryMutAct_9fa48("3915") ? "" : (stryCov_9fa48("3915"), '--confirm')) || args.includes(stryMutAct_9fa48("3916") ? "" : (stryCov_9fa48("3916"), '-y')));
    return stryMutAct_9fa48("3917") ? {} : (stryCov_9fa48("3917"), {
      uuid,
      confirm
    });
  }
};
const handleDelete: CommandHandler = stryMutAct_9fa48("3918") ? () => undefined : (stryCov_9fa48("3918"), (() => {
  const handleDelete: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("3919")) {
      {}
    } else {
      stryCov_9fa48("3919");
      const mutableBoard = board as unknown as Board;
      const deleteArgs = parseDeleteTaskArgs(args);

      // First, find the task to show what will be deleted
      const task = findTaskById(mutableBoard, deleteArgs.uuid);
      if (stryMutAct_9fa48("3922") ? false : stryMutAct_9fa48("3921") ? true : stryMutAct_9fa48("3920") ? task : (stryCov_9fa48("3920", "3921", "3922"), !task)) {
        if (stryMutAct_9fa48("3923")) {
          {}
        } else {
          stryCov_9fa48("3923");
          throw new CommandUsageError(stryMutAct_9fa48("3924") ? `` : (stryCov_9fa48("3924"), `Task with UUID ${deleteArgs.uuid} not found`));
        }
      }

      // Ask for confirmation unless --confirm flag is provided
      if (stryMutAct_9fa48("3927") ? false : stryMutAct_9fa48("3926") ? true : stryMutAct_9fa48("3925") ? deleteArgs.confirm : (stryCov_9fa48("3925", "3926", "3927"), !deleteArgs.confirm)) {
        if (stryMutAct_9fa48("3928")) {
          {}
        } else {
          stryCov_9fa48("3928");
          console.log(stryMutAct_9fa48("3929") ? `` : (stryCov_9fa48("3929"), `⚠️  About to delete task:`));
          console.log(stryMutAct_9fa48("3930") ? `` : (stryCov_9fa48("3930"), `   Title: ${task.title}`));
          console.log(stryMutAct_9fa48("3931") ? `` : (stryCov_9fa48("3931"), `   UUID: ${task.uuid}`));
          console.log(stryMutAct_9fa48("3932") ? `` : (stryCov_9fa48("3932"), `   Status: ${task.status}`));
          console.log(stryMutAct_9fa48("3933") ? "Stryker was here!" : (stryCov_9fa48("3933"), ''));
          console.log(stryMutAct_9fa48("3934") ? "" : (stryCov_9fa48("3934"), 'This action cannot be undone. Use --confirm to proceed with deletion.'));
          return stryMutAct_9fa48("3935") ? {} : (stryCov_9fa48("3935"), {
            deleted: stryMutAct_9fa48("3936") ? true : (stryCov_9fa48("3936"), false),
            task
          });
        }
      }
      const deleted = await deleteTask(mutableBoard, deleteArgs.uuid, context.tasksDir, context.boardFile);
      if (stryMutAct_9fa48("3938") ? false : stryMutAct_9fa48("3937") ? true : (stryCov_9fa48("3937", "3938"), deleted)) {
        if (stryMutAct_9fa48("3939")) {
          {}
        } else {
          stryCov_9fa48("3939");
          console.log(stryMutAct_9fa48("3940") ? `` : (stryCov_9fa48("3940"), `✅ Deleted task "${task.title}" (${stryMutAct_9fa48("3941") ? task.uuid : (stryCov_9fa48("3941"), task.uuid.slice(0, 8))}...)`));
          return stryMutAct_9fa48("3942") ? {} : (stryCov_9fa48("3942"), {
            deleted: stryMutAct_9fa48("3943") ? false : (stryCov_9fa48("3943"), true),
            task
          });
        }
      } else {
        if (stryMutAct_9fa48("3944")) {
          {}
        } else {
          stryCov_9fa48("3944");
          console.log(stryMutAct_9fa48("3945") ? `` : (stryCov_9fa48("3945"), `❌ Failed to delete task with UUID ${deleteArgs.uuid}`));
          return stryMutAct_9fa48("3946") ? {} : (stryCov_9fa48("3946"), {
            deleted: stryMutAct_9fa48("3947") ? true : (stryCov_9fa48("3947"), false),
            task
          });
        }
      }
    }
  });
  return handleDelete;
})());

// Epic command handlers
const parseCreateEpicArgs = (args: ReadonlyArray<string>) => {
  if (stryMutAct_9fa48("3948")) {
    {}
  } else {
    stryCov_9fa48("3948");
    if (stryMutAct_9fa48("3951") ? args.length !== 0 : stryMutAct_9fa48("3950") ? false : stryMutAct_9fa48("3949") ? true : (stryCov_9fa48("3949", "3950", "3951"), args.length === 0)) {
      if (stryMutAct_9fa48("3952")) {
        {}
      } else {
        stryCov_9fa48("3952");
        throw new CommandUsageError(stryMutAct_9fa48("3953") ? "" : (stryCov_9fa48("3953"), 'create-epic requires a title'));
      }
    }
    const title = requireArg(args[0], stryMutAct_9fa48("3954") ? "" : (stryCov_9fa48("3954"), 'epic title'));
    const content = stryMutAct_9fa48("3956") ? args.find(arg => arg.startsWith('--content=')).slice(11) : stryMutAct_9fa48("3955") ? args.find(arg => arg.startsWith('--content=')) : (stryCov_9fa48("3955", "3956"), args.find(stryMutAct_9fa48("3957") ? () => undefined : (stryCov_9fa48("3957"), arg => stryMutAct_9fa48("3958") ? arg.endsWith('--content=') : (stryCov_9fa48("3958"), arg.startsWith(stryMutAct_9fa48("3959") ? "" : (stryCov_9fa48("3959"), '--content=')))))?.slice(11));
    const subtaskUuids = stryMutAct_9fa48("3960") ? args.map(arg => arg.slice(10)) : (stryCov_9fa48("3960"), args.filter(stryMutAct_9fa48("3961") ? () => undefined : (stryCov_9fa48("3961"), arg => stryMutAct_9fa48("3962") ? arg.endsWith('--subtask=') : (stryCov_9fa48("3962"), arg.startsWith(stryMutAct_9fa48("3963") ? "" : (stryCov_9fa48("3963"), '--subtask='))))).map(stryMutAct_9fa48("3964") ? () => undefined : (stryCov_9fa48("3964"), arg => stryMutAct_9fa48("3965") ? arg : (stryCov_9fa48("3965"), arg.slice(10)))));
    return stryMutAct_9fa48("3966") ? {} : (stryCov_9fa48("3966"), {
      title,
      content,
      subtaskUuids
    });
  }
};
const handleCreateEpic: CommandHandler = stryMutAct_9fa48("3967") ? () => undefined : (stryCov_9fa48("3967"), (() => {
  const handleCreateEpic: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("3968")) {
      {}
    } else {
      stryCov_9fa48("3968");
      const mutableBoard = board as unknown as Board;
      const epicArgs = parseCreateEpicArgs(args);

      // Validate subtask UUIDs if provided
      if (stryMutAct_9fa48("3972") ? epicArgs.subtaskUuids.length <= 0 : stryMutAct_9fa48("3971") ? epicArgs.subtaskUuids.length >= 0 : stryMutAct_9fa48("3970") ? false : stryMutAct_9fa48("3969") ? true : (stryCov_9fa48("3969", "3970", "3971", "3972"), epicArgs.subtaskUuids.length > 0)) {
        if (stryMutAct_9fa48("3973")) {
          {}
        } else {
          stryCov_9fa48("3973");
          for (const subtaskUuid of epicArgs.subtaskUuids) {
            if (stryMutAct_9fa48("3974")) {
              {}
            } else {
              stryCov_9fa48("3974");
              const subtask = findTaskById(mutableBoard, subtaskUuid);
              if (stryMutAct_9fa48("3977") ? false : stryMutAct_9fa48("3976") ? true : stryMutAct_9fa48("3975") ? subtask : (stryCov_9fa48("3975", "3976", "3977"), !subtask)) {
                if (stryMutAct_9fa48("3978")) {
                  {}
                } else {
                  stryCov_9fa48("3978");
                  throw new CommandUsageError(stryMutAct_9fa48("3979") ? `` : (stryCov_9fa48("3979"), `Subtask with UUID ${subtaskUuid} not found`));
                }
              }
              if (stryMutAct_9fa48("3981") ? false : stryMutAct_9fa48("3980") ? true : (stryCov_9fa48("3980", "3981"), isEpic(subtask))) {
                if (stryMutAct_9fa48("3982")) {
                  {}
                } else {
                  stryCov_9fa48("3982");
                  throw new CommandUsageError(stryMutAct_9fa48("3983") ? `` : (stryCov_9fa48("3983"), `Cannot add epic ${subtaskUuid} as a subtask`));
                }
              }
            }
          }
        }
      }
      const newEpic = createEpic(epicArgs.title, epicArgs.content, epicArgs.subtaskUuids);

      // Add epic to the incoming column
      const incomingColumn = mutableBoard.columns.find(stryMutAct_9fa48("3984") ? () => undefined : (stryCov_9fa48("3984"), col => stryMutAct_9fa48("3987") ? col.name !== 'incoming' : stryMutAct_9fa48("3986") ? false : stryMutAct_9fa48("3985") ? true : (stryCov_9fa48("3985", "3986", "3987"), col.name === (stryMutAct_9fa48("3988") ? "" : (stryCov_9fa48("3988"), 'incoming')))));
      if (stryMutAct_9fa48("3990") ? false : stryMutAct_9fa48("3989") ? true : (stryCov_9fa48("3989", "3990"), incomingColumn)) {
        if (stryMutAct_9fa48("3991")) {
          {}
        } else {
          stryCov_9fa48("3991");
          incomingColumn.tasks.push(newEpic);
        }
      }

      // Link subtasks to epic if provided
      if (stryMutAct_9fa48("3995") ? epicArgs.subtaskUuids.length <= 0 : stryMutAct_9fa48("3994") ? epicArgs.subtaskUuids.length >= 0 : stryMutAct_9fa48("3993") ? false : stryMutAct_9fa48("3992") ? true : (stryCov_9fa48("3992", "3993", "3994", "3995"), epicArgs.subtaskUuids.length > 0)) {
        if (stryMutAct_9fa48("3996")) {
          {}
        } else {
          stryCov_9fa48("3996");
          for (const subtaskUuid of epicArgs.subtaskUuids) {
            if (stryMutAct_9fa48("3997")) {
              {}
            } else {
              stryCov_9fa48("3997");
              const result = addSubtaskToEpic(mutableBoard, newEpic.uuid, subtaskUuid);
              if (stryMutAct_9fa48("4000") ? false : stryMutAct_9fa48("3999") ? true : stryMutAct_9fa48("3998") ? result.success : (stryCov_9fa48("3998", "3999", "4000"), !result.success)) {
                if (stryMutAct_9fa48("4001")) {
                  {}
                } else {
                  stryCov_9fa48("4001");
                  console.warn(stryMutAct_9fa48("4002") ? `` : (stryCov_9fa48("4002"), `⚠️  Failed to link subtask ${subtaskUuid}: ${result.reason}`));
                }
              }
            }
          }
        }
      }
      console.log(stryMutAct_9fa48("4003") ? `` : (stryCov_9fa48("4003"), `✅ Created epic "${newEpic.title}" (${stryMutAct_9fa48("4004") ? newEpic.uuid : (stryCov_9fa48("4004"), newEpic.uuid.slice(0, 8))}...)`));
      console.log(stryMutAct_9fa48("4005") ? `` : (stryCov_9fa48("4005"), `   Status: ${newEpic.status}`));
      console.log(stryMutAct_9fa48("4006") ? `` : (stryCov_9fa48("4006"), `   Epic Status: ${newEpic.epicStatus}`));
      if (stryMutAct_9fa48("4010") ? epicArgs.subtaskUuids.length <= 0 : stryMutAct_9fa48("4009") ? epicArgs.subtaskUuids.length >= 0 : stryMutAct_9fa48("4008") ? false : stryMutAct_9fa48("4007") ? true : (stryCov_9fa48("4007", "4008", "4009", "4010"), epicArgs.subtaskUuids.length > 0)) {
        if (stryMutAct_9fa48("4011")) {
          {}
        } else {
          stryCov_9fa48("4011");
          console.log(stryMutAct_9fa48("4012") ? `` : (stryCov_9fa48("4012"), `   Subtasks: ${epicArgs.subtaskUuids.length}`));
        }
      }
      return newEpic;
    }
  });
  return handleCreateEpic;
})());
const parseAddTaskArgs = (args: ReadonlyArray<string>) => {
  if (stryMutAct_9fa48("4013")) {
    {}
  } else {
    stryCov_9fa48("4013");
    if (stryMutAct_9fa48("4017") ? args.length >= 2 : stryMutAct_9fa48("4016") ? args.length <= 2 : stryMutAct_9fa48("4015") ? false : stryMutAct_9fa48("4014") ? true : (stryCov_9fa48("4014", "4015", "4016", "4017"), args.length < 2)) {
      if (stryMutAct_9fa48("4018")) {
        {}
      } else {
        stryCov_9fa48("4018");
        throw new CommandUsageError(stryMutAct_9fa48("4019") ? "" : (stryCov_9fa48("4019"), 'add-task requires epic UUID and task UUID'));
      }
    }
    const epicUuid = requireArg(args[0], stryMutAct_9fa48("4020") ? "" : (stryCov_9fa48("4020"), 'epic UUID'));
    const taskUuid = requireArg(args[1], stryMutAct_9fa48("4021") ? "" : (stryCov_9fa48("4021"), 'task UUID'));
    return stryMutAct_9fa48("4022") ? {} : (stryCov_9fa48("4022"), {
      epicUuid,
      taskUuid
    });
  }
};
const handleAddTask: CommandHandler = stryMutAct_9fa48("4023") ? () => undefined : (stryCov_9fa48("4023"), (() => {
  const handleAddTask: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("4024")) {
      {}
    } else {
      stryCov_9fa48("4024");
      const mutableBoard = board as unknown as Board;
      const taskArgs = parseAddTaskArgs(args);
      const result = addSubtaskToEpic(mutableBoard, taskArgs.epicUuid, taskArgs.taskUuid);
      if (stryMutAct_9fa48("4027") ? false : stryMutAct_9fa48("4026") ? true : stryMutAct_9fa48("4025") ? result.success : (stryCov_9fa48("4025", "4026", "4027"), !result.success)) {
        if (stryMutAct_9fa48("4028")) {
          {}
        } else {
          stryCov_9fa48("4028");
          throw new CommandUsageError(stryMutAct_9fa48("4031") ? result.reason && 'Failed to add task to epic' : stryMutAct_9fa48("4030") ? false : stryMutAct_9fa48("4029") ? true : (stryCov_9fa48("4029", "4030", "4031"), result.reason || (stryMutAct_9fa48("4032") ? "" : (stryCov_9fa48("4032"), 'Failed to add task to epic'))));
        }
      }
      const epic = findTaskById(mutableBoard, taskArgs.epicUuid);
      const task = findTaskById(mutableBoard, taskArgs.taskUuid);
      console.log(stryMutAct_9fa48("4033") ? `` : (stryCov_9fa48("4033"), `✅ Added task "${stryMutAct_9fa48("4034") ? task.title : (stryCov_9fa48("4034"), task?.title)}" to epic "${stryMutAct_9fa48("4035") ? epic.title : (stryCov_9fa48("4035"), epic?.title)}"`));
      console.log(stryMutAct_9fa48("4036") ? `` : (stryCov_9fa48("4036"), `   Epic UUID: ${stryMutAct_9fa48("4037") ? taskArgs.epicUuid : (stryCov_9fa48("4037"), taskArgs.epicUuid.slice(0, 8))}...`));
      console.log(stryMutAct_9fa48("4038") ? `` : (stryCov_9fa48("4038"), `   Task UUID: ${stryMutAct_9fa48("4039") ? taskArgs.taskUuid : (stryCov_9fa48("4039"), taskArgs.taskUuid.slice(0, 8))}...`));
      return stryMutAct_9fa48("4040") ? {} : (stryCov_9fa48("4040"), {
        success: stryMutAct_9fa48("4041") ? false : (stryCov_9fa48("4041"), true),
        epic,
        task
      });
    }
  });
  return handleAddTask;
})());
const parseRemoveTaskArgs = (args: ReadonlyArray<string>) => {
  if (stryMutAct_9fa48("4042")) {
    {}
  } else {
    stryCov_9fa48("4042");
    if (stryMutAct_9fa48("4046") ? args.length >= 2 : stryMutAct_9fa48("4045") ? args.length <= 2 : stryMutAct_9fa48("4044") ? false : stryMutAct_9fa48("4043") ? true : (stryCov_9fa48("4043", "4044", "4045", "4046"), args.length < 2)) {
      if (stryMutAct_9fa48("4047")) {
        {}
      } else {
        stryCov_9fa48("4047");
        throw new CommandUsageError(stryMutAct_9fa48("4048") ? "" : (stryCov_9fa48("4048"), 'remove-task requires epic UUID and task UUID'));
      }
    }
    const epicUuid = requireArg(args[0], stryMutAct_9fa48("4049") ? "" : (stryCov_9fa48("4049"), 'epic UUID'));
    const taskUuid = requireArg(args[1], stryMutAct_9fa48("4050") ? "" : (stryCov_9fa48("4050"), 'task UUID'));
    return stryMutAct_9fa48("4051") ? {} : (stryCov_9fa48("4051"), {
      epicUuid,
      taskUuid
    });
  }
};
const handleRemoveTask: CommandHandler = stryMutAct_9fa48("4052") ? () => undefined : (stryCov_9fa48("4052"), (() => {
  const handleRemoveTask: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("4053")) {
      {}
    } else {
      stryCov_9fa48("4053");
      const mutableBoard = board as unknown as Board;
      const taskArgs = parseRemoveTaskArgs(args);
      const result = removeSubtaskFromEpic(mutableBoard, taskArgs.epicUuid, taskArgs.taskUuid);
      if (stryMutAct_9fa48("4056") ? false : stryMutAct_9fa48("4055") ? true : stryMutAct_9fa48("4054") ? result.success : (stryCov_9fa48("4054", "4055", "4056"), !result.success)) {
        if (stryMutAct_9fa48("4057")) {
          {}
        } else {
          stryCov_9fa48("4057");
          throw new CommandUsageError(stryMutAct_9fa48("4060") ? result.reason && 'Failed to remove task from epic' : stryMutAct_9fa48("4059") ? false : stryMutAct_9fa48("4058") ? true : (stryCov_9fa48("4058", "4059", "4060"), result.reason || (stryMutAct_9fa48("4061") ? "" : (stryCov_9fa48("4061"), 'Failed to remove task from epic'))));
        }
      }
      const epic = findTaskById(mutableBoard, taskArgs.epicUuid);
      const task = findTaskById(mutableBoard, taskArgs.taskUuid);
      console.log(stryMutAct_9fa48("4062") ? `` : (stryCov_9fa48("4062"), `✅ Removed task "${stryMutAct_9fa48("4063") ? task.title : (stryCov_9fa48("4063"), task?.title)}" from epic "${stryMutAct_9fa48("4064") ? epic.title : (stryCov_9fa48("4064"), epic?.title)}"`));
      console.log(stryMutAct_9fa48("4065") ? `` : (stryCov_9fa48("4065"), `   Epic UUID: ${stryMutAct_9fa48("4066") ? taskArgs.epicUuid : (stryCov_9fa48("4066"), taskArgs.epicUuid.slice(0, 8))}...`));
      console.log(stryMutAct_9fa48("4067") ? `` : (stryCov_9fa48("4067"), `   Task UUID: ${stryMutAct_9fa48("4068") ? taskArgs.taskUuid : (stryCov_9fa48("4068"), taskArgs.taskUuid.slice(0, 8))}...`));
      return stryMutAct_9fa48("4069") ? {} : (stryCov_9fa48("4069"), {
        success: stryMutAct_9fa48("4070") ? false : (stryCov_9fa48("4070"), true),
        epic,
        task
      });
    }
  });
  return handleRemoveTask;
})());
const handleListEpics: CommandHandler = stryMutAct_9fa48("4071") ? () => undefined : (stryCov_9fa48("4071"), (() => {
  const handleListEpics: CommandHandler = (_, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("4072")) {
      {}
    } else {
      stryCov_9fa48("4072");
      const mutableBoard = board as unknown as Board;
      const epics = getAllEpics(mutableBoard);
      if (stryMutAct_9fa48("4075") ? epics.length !== 0 : stryMutAct_9fa48("4074") ? false : stryMutAct_9fa48("4073") ? true : (stryCov_9fa48("4073", "4074", "4075"), epics.length === 0)) {
        if (stryMutAct_9fa48("4076")) {
          {}
        } else {
          stryCov_9fa48("4076");
          console.log(stryMutAct_9fa48("4077") ? "" : (stryCov_9fa48("4077"), 'No epics found.'));
          return stryMutAct_9fa48("4078") ? {} : (stryCov_9fa48("4078"), {
            epics: stryMutAct_9fa48("4079") ? ["Stryker was here"] : (stryCov_9fa48("4079"), [])
          });
        }
      }
      console.log(stryMutAct_9fa48("4080") ? `` : (stryCov_9fa48("4080"), `Found ${epics.length} epic(s):`));
      console.log(stryMutAct_9fa48("4081") ? "Stryker was here!" : (stryCov_9fa48("4081"), ''));
      for (const epic of epics) {
        if (stryMutAct_9fa48("4082")) {
          {}
        } else {
          stryCov_9fa48("4082");
          const subtasks = getEpicSubtasks(mutableBoard, epic);
          console.log(stryMutAct_9fa48("4083") ? `` : (stryCov_9fa48("4083"), `📋 ${epic.title}`));
          console.log(stryMutAct_9fa48("4084") ? `` : (stryCov_9fa48("4084"), `   UUID: ${epic.uuid}`));
          console.log(stryMutAct_9fa48("4085") ? `` : (stryCov_9fa48("4085"), `   Status: ${epic.status} (Epic: ${epic.epicStatus})`));
          console.log(stryMutAct_9fa48("4086") ? `` : (stryCov_9fa48("4086"), `   Subtasks: ${subtasks.length}`));
          if (stryMutAct_9fa48("4090") ? subtasks.length <= 0 : stryMutAct_9fa48("4089") ? subtasks.length >= 0 : stryMutAct_9fa48("4088") ? false : stryMutAct_9fa48("4087") ? true : (stryCov_9fa48("4087", "4088", "4089", "4090"), subtasks.length > 0)) {
            if (stryMutAct_9fa48("4091")) {
              {}
            } else {
              stryCov_9fa48("4091");
              console.log(stryMutAct_9fa48("4092") ? `` : (stryCov_9fa48("4092"), `   Subtask breakdown:`));
              const statusCounts = subtasks.reduce((acc, task) => {
                if (stryMutAct_9fa48("4093")) {
                  {}
                } else {
                  stryCov_9fa48("4093");
                  acc[task.status] = stryMutAct_9fa48("4094") ? (acc[task.status] || 0) - 1 : (stryCov_9fa48("4094"), (stryMutAct_9fa48("4097") ? acc[task.status] && 0 : stryMutAct_9fa48("4096") ? false : stryMutAct_9fa48("4095") ? true : (stryCov_9fa48("4095", "4096", "4097"), acc[task.status] || 0)) + 1);
                  return acc;
                }
              }, {} as Record<string, number>);
              Object.entries(statusCounts).forEach(([status, count]) => {
                if (stryMutAct_9fa48("4098")) {
                  {}
                } else {
                  stryCov_9fa48("4098");
                  console.log(stryMutAct_9fa48("4099") ? `` : (stryCov_9fa48("4099"), `     ${status}: ${count}`));
                }
              });
            }
          }
          console.log(stryMutAct_9fa48("4100") ? "Stryker was here!" : (stryCov_9fa48("4100"), ''));
        }
      }
      return stryMutAct_9fa48("4101") ? {} : (stryCov_9fa48("4101"), {
        epics
      });
    }
  });
  return handleListEpics;
})());
const handleEpicStatus: CommandHandler = stryMutAct_9fa48("4102") ? () => undefined : (stryCov_9fa48("4102"), (() => {
  const handleEpicStatus: CommandHandler = (args, context) => withBoard(context, async board => {
    if (stryMutAct_9fa48("4103")) {
      {}
    } else {
      stryCov_9fa48("4103");
      if (stryMutAct_9fa48("4106") ? args.length !== 0 : stryMutAct_9fa48("4105") ? false : stryMutAct_9fa48("4104") ? true : (stryCov_9fa48("4104", "4105", "4106"), args.length === 0)) {
        if (stryMutAct_9fa48("4107")) {
          {}
        } else {
          stryCov_9fa48("4107");
          throw new CommandUsageError(stryMutAct_9fa48("4108") ? "" : (stryCov_9fa48("4108"), 'epic-status requires an epic UUID'));
        }
      }
      const mutableBoard = board as unknown as Board;
      const epicUuid = requireArg(args[0], stryMutAct_9fa48("4109") ? "" : (stryCov_9fa48("4109"), 'epic UUID'));
      const epic = findTaskById(mutableBoard, epicUuid);
      if (stryMutAct_9fa48("4112") ? false : stryMutAct_9fa48("4111") ? true : stryMutAct_9fa48("4110") ? epic : (stryCov_9fa48("4110", "4111", "4112"), !epic)) {
        if (stryMutAct_9fa48("4113")) {
          {}
        } else {
          stryCov_9fa48("4113");
          throw new CommandUsageError(stryMutAct_9fa48("4114") ? `` : (stryCov_9fa48("4114"), `Epic with UUID ${epicUuid} not found`));
        }
      }
      if (stryMutAct_9fa48("4117") ? false : stryMutAct_9fa48("4116") ? true : stryMutAct_9fa48("4115") ? isEpic(epic) : (stryCov_9fa48("4115", "4116", "4117"), !isEpic(epic))) {
        if (stryMutAct_9fa48("4118")) {
          {}
        } else {
          stryCov_9fa48("4118");
          throw new CommandUsageError(stryMutAct_9fa48("4119") ? `` : (stryCov_9fa48("4119"), `Task ${epicUuid} is not an epic`));
        }
      }
      const subtasks = getEpicSubtasks(mutableBoard, epic);
      console.log(stryMutAct_9fa48("4120") ? `` : (stryCov_9fa48("4120"), `📋 Epic: ${epic.title}`));
      console.log(stryMutAct_9fa48("4121") ? `` : (stryCov_9fa48("4121"), `   UUID: ${epic.uuid}`));
      console.log(stryMutAct_9fa48("4122") ? `` : (stryCov_9fa48("4122"), `   Status: ${epic.status} (Epic: ${epic.epicStatus})`));
      console.log(stryMutAct_9fa48("4123") ? `` : (stryCov_9fa48("4123"), `   Subtasks: ${subtasks.length}`));
      console.log(stryMutAct_9fa48("4124") ? "Stryker was here!" : (stryCov_9fa48("4124"), ''));
      if (stryMutAct_9fa48("4128") ? subtasks.length <= 0 : stryMutAct_9fa48("4127") ? subtasks.length >= 0 : stryMutAct_9fa48("4126") ? false : stryMutAct_9fa48("4125") ? true : (stryCov_9fa48("4125", "4126", "4127", "4128"), subtasks.length > 0)) {
        if (stryMutAct_9fa48("4129")) {
          {}
        } else {
          stryCov_9fa48("4129");
          console.log(stryMutAct_9fa48("4130") ? "" : (stryCov_9fa48("4130"), 'Subtasks:'));
          for (const subtask of subtasks) {
            if (stryMutAct_9fa48("4131")) {
              {}
            } else {
              stryCov_9fa48("4131");
              console.log(stryMutAct_9fa48("4132") ? `` : (stryCov_9fa48("4132"), `   • ${subtask.title}`));
              console.log(stryMutAct_9fa48("4133") ? `` : (stryCov_9fa48("4133"), `     UUID: ${subtask.uuid}`));
              console.log(stryMutAct_9fa48("4134") ? `` : (stryCov_9fa48("4134"), `     Status: ${subtask.status}`));
              console.log(stryMutAct_9fa48("4135") ? "Stryker was here!" : (stryCov_9fa48("4135"), ''));
            }
          }
        }
      } else {
        if (stryMutAct_9fa48("4136")) {
          {}
        } else {
          stryCov_9fa48("4136");
          console.log(stryMutAct_9fa48("4137") ? "" : (stryCov_9fa48("4137"), 'No subtasks found for this epic.'));
        }
      }
      return stryMutAct_9fa48("4138") ? {} : (stryCov_9fa48("4138"), {
        epic,
        subtasks
      });
    }
  });
  return handleEpicStatus;
})());
const handleInit: CommandHandler = async (args, _context) => {
  if (stryMutAct_9fa48("4139")) {
    {}
  } else {
    stryCov_9fa48("4139");
    // Check both args and raw process.argv for --config flag
    const rawConfigArg = process.argv.find(stryMutAct_9fa48("4140") ? () => undefined : (stryCov_9fa48("4140"), arg => stryMutAct_9fa48("4141") ? arg.endsWith('--config=') : (stryCov_9fa48("4141"), arg.startsWith(stryMutAct_9fa48("4142") ? "" : (stryCov_9fa48("4142"), '--config=')))));
    const configPath = stryMutAct_9fa48("4145") ? (rawConfigArg?.slice(9) || args.find(arg => arg.startsWith('--config='))?.slice(9)) && 'promethean.kanban.json' : stryMutAct_9fa48("4144") ? false : stryMutAct_9fa48("4143") ? true : (stryCov_9fa48("4143", "4144", "4145"), (stryMutAct_9fa48("4147") ? rawConfigArg?.slice(9) && args.find(arg => arg.startsWith('--config='))?.slice(9) : stryMutAct_9fa48("4146") ? false : (stryCov_9fa48("4146", "4147"), (stryMutAct_9fa48("4149") ? rawConfigArg.slice(9) : stryMutAct_9fa48("4148") ? rawConfigArg : (stryCov_9fa48("4148", "4149"), rawConfigArg?.slice(9))) || (stryMutAct_9fa48("4151") ? args.find(arg => arg.startsWith('--config=')).slice(9) : stryMutAct_9fa48("4150") ? args.find(arg => arg.startsWith('--config=')) : (stryCov_9fa48("4150", "4151"), args.find(stryMutAct_9fa48("4152") ? () => undefined : (stryCov_9fa48("4152"), arg => stryMutAct_9fa48("4153") ? arg.endsWith('--config=') : (stryCov_9fa48("4153"), arg.startsWith(stryMutAct_9fa48("4154") ? "" : (stryCov_9fa48("4154"), '--config=')))))?.slice(9))))) || (stryMutAct_9fa48("4155") ? "" : (stryCov_9fa48("4155"), 'promethean.kanban.json')));
    const force = stryMutAct_9fa48("4158") ? args.includes('--force') && args.includes('-f') : stryMutAct_9fa48("4157") ? false : stryMutAct_9fa48("4156") ? true : (stryCov_9fa48("4156", "4157", "4158"), args.includes(stryMutAct_9fa48("4159") ? "" : (stryCov_9fa48("4159"), '--force')) || args.includes(stryMutAct_9fa48("4160") ? "" : (stryCov_9fa48("4160"), '-f')));

    // Check if config already exists
    try {
      if (stryMutAct_9fa48("4161")) {
        {}
      } else {
        stryCov_9fa48("4161");
        await readFile(configPath, stryMutAct_9fa48("4162") ? "" : (stryCov_9fa48("4162"), 'utf8'));
        if (stryMutAct_9fa48("4165") ? false : stryMutAct_9fa48("4164") ? true : stryMutAct_9fa48("4163") ? force : (stryCov_9fa48("4163", "4164", "4165"), !force)) {
          if (stryMutAct_9fa48("4166")) {
            {}
          } else {
            stryCov_9fa48("4166");
            console.log(stryMutAct_9fa48("4167") ? `` : (stryCov_9fa48("4167"), `❌ Configuration file "${configPath}" already exists.`));
            console.log(stryMutAct_9fa48("4168") ? "" : (stryCov_9fa48("4168"), '   Use --force to overwrite existing configuration.'));
            return stryMutAct_9fa48("4169") ? {} : (stryCov_9fa48("4169"), {
              created: stryMutAct_9fa48("4170") ? true : (stryCov_9fa48("4170"), false),
              reason: stryMutAct_9fa48("4171") ? "" : (stryCov_9fa48("4171"), 'exists')
            });
          }
        }
      }
    } catch {
      // File doesn't exist, which is what we want
    }

    // Simple starter configuration
    const simpleConfig = stryMutAct_9fa48("4172") ? {} : (stryCov_9fa48("4172"), {
      _comment: stryMutAct_9fa48("4173") ? "" : (stryCov_9fa48("4173"), 'Promethean Kanban Configuration - Simple starter config'),
      _description: stryMutAct_9fa48("4174") ? "" : (stryCov_9fa48("4174"), 'Basic kanban configuration for new projects. Customize as needed.'),
      _usage: stryMutAct_9fa48("4175") ? "" : (stryCov_9fa48("4175"), "Use 'kanban regenerate' to create the board from tasks."),
      tasksDir: stryMutAct_9fa48("4176") ? "" : (stryCov_9fa48("4176"), 'docs/agile/tasks'),
      indexFile: stryMutAct_9fa48("4177") ? "Stryker was here!" : (stryCov_9fa48("4177"), ''),
      boardFile: stryMutAct_9fa48("4178") ? "" : (stryCov_9fa48("4178"), 'docs/agile/boards/generated.md'),
      cachePath: stryMutAct_9fa48("4179") ? "" : (stryCov_9fa48("4179"), 'docs/agile/boards/.cache'),
      exts: stryMutAct_9fa48("4180") ? [] : (stryCov_9fa48("4180"), [stryMutAct_9fa48("4181") ? "" : (stryCov_9fa48("4181"), '.md')]),
      requiredFields: stryMutAct_9fa48("4182") ? [] : (stryCov_9fa48("4182"), [stryMutAct_9fa48("4183") ? "" : (stryCov_9fa48("4183"), 'title'), stryMutAct_9fa48("4184") ? "" : (stryCov_9fa48("4184"), 'status'), stryMutAct_9fa48("4185") ? "" : (stryCov_9fa48("4185"), 'priority')]),
      statusValues: stryMutAct_9fa48("4186") ? [] : (stryCov_9fa48("4186"), [stryMutAct_9fa48("4187") ? "" : (stryCov_9fa48("4187"), 'incoming'), stryMutAct_9fa48("4188") ? "" : (stryCov_9fa48("4188"), 'ready'), stryMutAct_9fa48("4189") ? "" : (stryCov_9fa48("4189"), 'todo'), stryMutAct_9fa48("4190") ? "" : (stryCov_9fa48("4190"), 'in_progress'), stryMutAct_9fa48("4191") ? "" : (stryCov_9fa48("4191"), 'review'), stryMutAct_9fa48("4192") ? "" : (stryCov_9fa48("4192"), 'done')]),
      priorityValues: stryMutAct_9fa48("4193") ? [] : (stryCov_9fa48("4193"), [stryMutAct_9fa48("4194") ? "" : (stryCov_9fa48("4194"), 'P0'), stryMutAct_9fa48("4195") ? "" : (stryCov_9fa48("4195"), 'P1'), stryMutAct_9fa48("4196") ? "" : (stryCov_9fa48("4196"), 'P2'), stryMutAct_9fa48("4197") ? "" : (stryCov_9fa48("4197"), 'P3')]),
      wipLimits: stryMutAct_9fa48("4198") ? {} : (stryCov_9fa48("4198"), {
        incoming: 999,
        ready: 10,
        todo: 5,
        in_progress: 3,
        review: 3,
        done: 999
      }),
      _starter_tasks: stryMutAct_9fa48("4199") ? [] : (stryCov_9fa48("4199"), [stryMutAct_9fa48("4200") ? {} : (stryCov_9fa48("4200"), {
        title: stryMutAct_9fa48("4201") ? "" : (stryCov_9fa48("4201"), 'Set up development environment'),
        status: stryMutAct_9fa48("4202") ? "" : (stryCov_9fa48("4202"), 'todo'),
        priority: stryMutAct_9fa48("4203") ? "" : (stryCov_9fa48("4203"), 'P0'),
        content: stryMutAct_9fa48("4204") ? "" : (stryCov_9fa48("4204"), 'Install dependencies, configure IDE, set up git hooks')
      }), stryMutAct_9fa48("4205") ? {} : (stryCov_9fa48("4205"), {
        title: stryMutAct_9fa48("4206") ? "" : (stryCov_9fa48("4206"), 'Create project documentation'),
        status: stryMutAct_9fa48("4207") ? "" : (stryCov_9fa48("4207"), 'incoming'),
        priority: stryMutAct_9fa48("4208") ? "" : (stryCov_9fa48("4208"), 'P1'),
        content: stryMutAct_9fa48("4209") ? "" : (stryCov_9fa48("4209"), 'Add README, setup instructions, and project overview')
      }), stryMutAct_9fa48("4210") ? {} : (stryCov_9fa48("4210"), {
        title: stryMutAct_9fa48("4211") ? "" : (stryCov_9fa48("4211"), 'Implement core feature'),
        status: stryMutAct_9fa48("4212") ? "" : (stryCov_9fa48("4212"), 'incoming'),
        priority: stryMutAct_9fa48("4213") ? "" : (stryCov_9fa48("4213"), 'P2'),
        content: stryMutAct_9fa48("4214") ? "" : (stryCov_9fa48("4214"), 'Build the main functionality for the project')
      })])
    });
    try {
      if (stryMutAct_9fa48("4215")) {
        {}
      } else {
        stryCov_9fa48("4215");
        // Ensure directory exists
        const configDir = path.dirname(configPath);
        await mkdir(configDir, stryMutAct_9fa48("4216") ? {} : (stryCov_9fa48("4216"), {
          recursive: stryMutAct_9fa48("4217") ? false : (stryCov_9fa48("4217"), true)
        }));

        // Write configuration file
        await writeFile(configPath, JSON.stringify(simpleConfig, null, 2), stryMutAct_9fa48("4218") ? "" : (stryCov_9fa48("4218"), 'utf8'));
        console.log(stryMutAct_9fa48("4219") ? `` : (stryCov_9fa48("4219"), `✅ Created kanban configuration: ${configPath}`));
        console.log(stryMutAct_9fa48("4220") ? "Stryker was here!" : (stryCov_9fa48("4220"), ''));
        console.log(stryMutAct_9fa48("4221") ? "" : (stryCov_9fa48("4221"), '📋 Next steps:'));
        console.log(stryMutAct_9fa48("4222") ? `` : (stryCov_9fa48("4222"), `   1. Create tasks directory: mkdir -p ${simpleConfig.tasksDir}`));
        console.log(stryMutAct_9fa48("4223") ? `` : (stryCov_9fa48("4223"), `   2. Add some task files to ${simpleConfig.tasksDir}/`));
        console.log(stryMutAct_9fa48("4224") ? `` : (stryCov_9fa48("4224"), `   3. Generate board: kanban regenerate`));
        console.log(stryMutAct_9fa48("4225") ? "Stryker was here!" : (stryCov_9fa48("4225"), ''));
        console.log(stryMutAct_9fa48("4226") ? "" : (stryCov_9fa48("4226"), '💡 Example task file format:'));
        console.log(stryMutAct_9fa48("4227") ? "" : (stryCov_9fa48("4227"), '---'));
        console.log(stryMutAct_9fa48("4228") ? "" : (stryCov_9fa48("4228"), 'title: "My Task"'));
        console.log(stryMutAct_9fa48("4229") ? "" : (stryCov_9fa48("4229"), 'status: "todo"'));
        console.log(stryMutAct_9fa48("4230") ? "" : (stryCov_9fa48("4230"), 'priority: "P1"'));
        console.log(stryMutAct_9fa48("4231") ? "" : (stryCov_9fa48("4231"), '---'));
        console.log(stryMutAct_9fa48("4232") ? "Stryker was here!" : (stryCov_9fa48("4232"), ''));
        console.log(stryMutAct_9fa48("4233") ? "" : (stryCov_9fa48("4233"), 'Task description goes here...'));
        return stryMutAct_9fa48("4234") ? {} : (stryCov_9fa48("4234"), {
          created: stryMutAct_9fa48("4235") ? false : (stryCov_9fa48("4235"), true),
          path: configPath
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("4236")) {
        {}
      } else {
        stryCov_9fa48("4236");
        const message = error instanceof Error ? error.message : String(error);
        console.error(stryMutAct_9fa48("4237") ? `` : (stryCov_9fa48("4237"), `❌ Failed to create configuration: ${message}`));
        return stryMutAct_9fa48("4238") ? {} : (stryCov_9fa48("4238"), {
          created: stryMutAct_9fa48("4239") ? true : (stryCov_9fa48("4239"), false),
          reason: message
        });
      }
    }
  }
};

/**
 * Handle heal command for kanban board healing operations
 */
const handleHeal: CommandHandler = stryMutAct_9fa48("4240") ? () => undefined : (stryCov_9fa48("4240"), (() => {
  const handleHeal: CommandHandler = (args, context) => withBoard(context, async () => {
    if (stryMutAct_9fa48("4241")) {
      {}
    } else {
      stryCov_9fa48("4241");
      const {
        createHealCommand
      } = await import(stryMutAct_9fa48("4242") ? "" : (stryCov_9fa48("4242"), '../lib/heal/heal-command.js'));
      if (stryMutAct_9fa48("4245") ? args.length !== 0 : stryMutAct_9fa48("4244") ? false : stryMutAct_9fa48("4243") ? true : (stryCov_9fa48("4243", "4244", "4245"), args.length === 0)) {
        if (stryMutAct_9fa48("4246")) {
          {}
        } else {
          stryCov_9fa48("4246");
          throw new CommandUsageError(stryMutAct_9fa48("4247") ? "" : (stryCov_9fa48("4247"), 'heal command requires a reason for healing operation'));
        }
      }
      const reason = args.join(stryMutAct_9fa48("4248") ? "" : (stryCov_9fa48("4248"), ' '));
      const healCommand = createHealCommand(context.boardFile, context.tasksDir);
      const argv = stryMutAct_9fa48("4251") ? context.argv && [] : stryMutAct_9fa48("4250") ? false : stryMutAct_9fa48("4249") ? true : (stryCov_9fa48("4249", "4250", "4251"), context.argv || (stryMutAct_9fa48("4252") ? ["Stryker was here"] : (stryCov_9fa48("4252"), [])));

      // Parse command line options
      const options = stryMutAct_9fa48("4253") ? {} : (stryCov_9fa48("4253"), {
        reason,
        dryRun: argv.includes(stryMutAct_9fa48("4254") ? "" : (stryCov_9fa48("4254"), '--dry-run')),
        createTags: stryMutAct_9fa48("4255") ? argv.includes('--no-tags') : (stryCov_9fa48("4255"), !argv.includes(stryMutAct_9fa48("4256") ? "" : (stryCov_9fa48("4256"), '--no-tags'))),
        pushTags: argv.includes(stryMutAct_9fa48("4257") ? "" : (stryCov_9fa48("4257"), '--push-tags')),
        analyzeGit: stryMutAct_9fa48("4258") ? argv.includes('--no-git') : (stryCov_9fa48("4258"), !argv.includes(stryMutAct_9fa48("4259") ? "" : (stryCov_9fa48("4259"), '--no-git'))),
        gitHistoryDepth: parseArgValue(argv, stryMutAct_9fa48("4260") ? "" : (stryCov_9fa48("4260"), '--git-depth'), 50),
        searchTerms: parseArgValues(argv, stryMutAct_9fa48("4261") ? "" : (stryCov_9fa48("4261"), '--search')),
        columnFilter: parseArgValues(argv, stryMutAct_9fa48("4262") ? "" : (stryCov_9fa48("4262"), '--column')),
        labelFilter: parseArgValues(argv, stryMutAct_9fa48("4263") ? "" : (stryCov_9fa48("4263"), '--label')),
        includeTaskAnalysis: stryMutAct_9fa48("4264") ? argv.includes('--no-task-analysis') : (stryCov_9fa48("4264"), !argv.includes(stryMutAct_9fa48("4265") ? "" : (stryCov_9fa48("4265"), '--no-task-analysis'))),
        includePerformanceMetrics: stryMutAct_9fa48("4266") ? argv.includes('--no-metrics') : (stryCov_9fa48("4266"), !argv.includes(stryMutAct_9fa48("4267") ? "" : (stryCov_9fa48("4267"), '--no-metrics')))
      });
      console.log(stryMutAct_9fa48("4268") ? `` : (stryCov_9fa48("4268"), `🏥 Starting kanban healing operation...`));
      console.log(stryMutAct_9fa48("4269") ? `` : (stryCov_9fa48("4269"), `   Reason: ${reason}`));
      console.log(stryMutAct_9fa48("4270") ? `` : (stryCov_9fa48("4270"), `   Dry run: ${options.dryRun ? stryMutAct_9fa48("4271") ? "" : (stryCov_9fa48("4271"), 'Yes') : stryMutAct_9fa48("4272") ? "" : (stryCov_9fa48("4272"), 'No')}`));
      console.log(stryMutAct_9fa48("4273") ? `` : (stryCov_9fa48("4273"), `   Create tags: ${options.createTags ? stryMutAct_9fa48("4274") ? "" : (stryCov_9fa48("4274"), 'Yes') : stryMutAct_9fa48("4275") ? "" : (stryCov_9fa48("4275"), 'No')}`));
      console.log(stryMutAct_9fa48("4276") ? "Stryker was here!" : (stryCov_9fa48("4276"), ''));
      if (stryMutAct_9fa48("4278") ? false : stryMutAct_9fa48("4277") ? true : (stryCov_9fa48("4277", "4278"), argv.includes(stryMutAct_9fa48("4279") ? "" : (stryCov_9fa48("4279"), '--recommendations')))) {
        if (stryMutAct_9fa48("4280")) {
          {}
        } else {
          stryCov_9fa48("4280");
          // Show healing recommendations
          const recommendations = await healCommand.getHealingRecommendations(options);
          console.log(stryMutAct_9fa48("4281") ? "" : (stryCov_9fa48("4281"), '🔍 Healing Recommendations:'));
          if (stryMutAct_9fa48("4285") ? recommendations.recommendations.length <= 0 : stryMutAct_9fa48("4284") ? recommendations.recommendations.length >= 0 : stryMutAct_9fa48("4283") ? false : stryMutAct_9fa48("4282") ? true : (stryCov_9fa48("4282", "4283", "4284", "4285"), recommendations.recommendations.length > 0)) {
            if (stryMutAct_9fa48("4286")) {
              {}
            } else {
              stryCov_9fa48("4286");
              recommendations.recommendations.forEach(rec => {
                if (stryMutAct_9fa48("4287")) {
                  {}
                } else {
                  stryCov_9fa48("4287");
                  console.log(stryMutAct_9fa48("4288") ? `` : (stryCov_9fa48("4288"), `   • ${rec}`));
                }
              });
            }
          } else {
            if (stryMutAct_9fa48("4289")) {
              {}
            } else {
              stryCov_9fa48("4289");
              console.log(stryMutAct_9fa48("4290") ? "" : (stryCov_9fa48("4290"), '   No specific recommendations at this time.'));
            }
          }
          if (stryMutAct_9fa48("4294") ? recommendations.criticalIssues.length <= 0 : stryMutAct_9fa48("4293") ? recommendations.criticalIssues.length >= 0 : stryMutAct_9fa48("4292") ? false : stryMutAct_9fa48("4291") ? true : (stryCov_9fa48("4291", "4292", "4293", "4294"), recommendations.criticalIssues.length > 0)) {
            if (stryMutAct_9fa48("4295")) {
              {}
            } else {
              stryCov_9fa48("4295");
              console.log(stryMutAct_9fa48("4296") ? "Stryker was here!" : (stryCov_9fa48("4296"), ''));
              console.log(stryMutAct_9fa48("4297") ? "" : (stryCov_9fa48("4297"), '⚠️  Critical Issues:'));
              recommendations.criticalIssues.forEach(issue => {
                if (stryMutAct_9fa48("4298")) {
                  {}
                } else {
                  stryCov_9fa48("4298");
                  const icon = (stryMutAct_9fa48("4301") ? issue.severity !== 'critical' : stryMutAct_9fa48("4300") ? false : stryMutAct_9fa48("4299") ? true : (stryCov_9fa48("4299", "4300", "4301"), issue.severity === (stryMutAct_9fa48("4302") ? "" : (stryCov_9fa48("4302"), 'critical')))) ? stryMutAct_9fa48("4303") ? "" : (stryCov_9fa48("4303"), '🚨') : (stryMutAct_9fa48("4306") ? issue.severity !== 'high' : stryMutAct_9fa48("4305") ? false : stryMutAct_9fa48("4304") ? true : (stryCov_9fa48("4304", "4305", "4306"), issue.severity === (stryMutAct_9fa48("4307") ? "" : (stryCov_9fa48("4307"), 'high')))) ? stryMutAct_9fa48("4308") ? "" : (stryCov_9fa48("4308"), '⚠️') : (stryMutAct_9fa48("4311") ? issue.severity !== 'medium' : stryMutAct_9fa48("4310") ? false : stryMutAct_9fa48("4309") ? true : (stryCov_9fa48("4309", "4310", "4311"), issue.severity === (stryMutAct_9fa48("4312") ? "" : (stryCov_9fa48("4312"), 'medium')))) ? stryMutAct_9fa48("4313") ? "" : (stryCov_9fa48("4313"), '⚡') : stryMutAct_9fa48("4314") ? "" : (stryCov_9fa48("4314"), 'ℹ️');
                  console.log(stryMutAct_9fa48("4315") ? `` : (stryCov_9fa48("4315"), `   ${icon} ${issue.description}`));
                  console.log(stryMutAct_9fa48("4316") ? `` : (stryCov_9fa48("4316"), `      Suggested action: ${issue.suggestedAction}`));
                }
              });
            }
          }
          if (stryMutAct_9fa48("4320") ? recommendations.relatedScars.length <= 0 : stryMutAct_9fa48("4319") ? recommendations.relatedScars.length >= 0 : stryMutAct_9fa48("4318") ? false : stryMutAct_9fa48("4317") ? true : (stryCov_9fa48("4317", "4318", "4319", "4320"), recommendations.relatedScars.length > 0)) {
            if (stryMutAct_9fa48("4321")) {
              {}
            } else {
              stryCov_9fa48("4321");
              console.log(stryMutAct_9fa48("4322") ? "Stryker was here!" : (stryCov_9fa48("4322"), ''));
              console.log(stryMutAct_9fa48("4323") ? "" : (stryCov_9fa48("4323"), '📚 Related Healing Operations:'));
              recommendations.relatedScars.forEach(scar => {
                if (stryMutAct_9fa48("4324")) {
                  {}
                } else {
                  stryCov_9fa48("4324");
                  console.log(stryMutAct_9fa48("4325") ? `` : (stryCov_9fa48("4325"), `   • ${scar.scar.tag} (relevance: ${Math.round(stryMutAct_9fa48("4326") ? scar.relevance / 100 : (stryCov_9fa48("4326"), scar.relevance * 100))}%)`));
                  console.log(stryMutAct_9fa48("4327") ? `` : (stryCov_9fa48("4327"), `     ${scar.reason}`));
                }
              });
            }
          }
          return stryMutAct_9fa48("4328") ? {} : (stryCov_9fa48("4328"), {
            recommendations
          });
        }
      }
      if (stryMutAct_9fa48("4330") ? false : stryMutAct_9fa48("4329") ? true : (stryCov_9fa48("4329", "4330"), context.argv.includes(stryMutAct_9fa48("4331") ? "" : (stryCov_9fa48("4331"), '--analyze-history')))) {
        if (stryMutAct_9fa48("4332")) {
          {}
        } else {
          stryCov_9fa48("4332");
          // Show scar history analysis
          const analysis = await healCommand.getScarHistoryAnalysis();
          console.log(stryMutAct_9fa48("4333") ? "" : (stryCov_9fa48("4333"), '📈 Scar History Analysis:'));
          console.log(stryMutAct_9fa48("4334") ? `` : (stryCov_9fa48("4334"), `   Total healing operations: ${analysis.totalScars}`));
          console.log(stryMutAct_9fa48("4335") ? `` : (stryCov_9fa48("4335"), `   Success rate: ${analysis.successRate.toFixed(1)}%`));
          if (stryMutAct_9fa48("4337") ? false : stryMutAct_9fa48("4336") ? true : (stryCov_9fa48("4336", "4337"), analysis.averageHealingTime)) {
            if (stryMutAct_9fa48("4338")) {
              {}
            } else {
              stryCov_9fa48("4338");
              console.log(stryMutAct_9fa48("4339") ? `` : (stryCov_9fa48("4339"), `   Average healing time: ${analysis.averageHealingTime.toFixed(1)} hours`));
            }
          }
          if (stryMutAct_9fa48("4343") ? analysis.commonReasons.length <= 0 : stryMutAct_9fa48("4342") ? analysis.commonReasons.length >= 0 : stryMutAct_9fa48("4341") ? false : stryMutAct_9fa48("4340") ? true : (stryCov_9fa48("4340", "4341", "4342", "4343"), analysis.commonReasons.length > 0)) {
            if (stryMutAct_9fa48("4344")) {
              {}
            } else {
              stryCov_9fa48("4344");
              console.log(stryMutAct_9fa48("4345") ? "Stryker was here!" : (stryCov_9fa48("4345"), ''));
              console.log(stryMutAct_9fa48("4346") ? "" : (stryCov_9fa48("4346"), '🔝 Most Common Healing Reasons:'));
              stryMutAct_9fa48("4347") ? analysis.commonReasons.forEach(reason => {
                console.log(`   ${reason.reason}: ${reason.count} times (${reason.percentage.toFixed(1)}%)`);
              }) : (stryCov_9fa48("4347"), analysis.commonReasons.slice(0, 5).forEach(reason => {
                if (stryMutAct_9fa48("4348")) {
                  {}
                } else {
                  stryCov_9fa48("4348");
                  console.log(stryMutAct_9fa48("4349") ? `` : (stryCov_9fa48("4349"), `   ${reason.reason}: ${reason.count} times (${reason.percentage.toFixed(1)}%)`));
                }
              }));
            }
          }
          if (stryMutAct_9fa48("4353") ? analysis.frequentlyHealedFiles.length <= 0 : stryMutAct_9fa48("4352") ? analysis.frequentlyHealedFiles.length >= 0 : stryMutAct_9fa48("4351") ? false : stryMutAct_9fa48("4350") ? true : (stryCov_9fa48("4350", "4351", "4352", "4353"), analysis.frequentlyHealedFiles.length > 0)) {
            if (stryMutAct_9fa48("4354")) {
              {}
            } else {
              stryCov_9fa48("4354");
              console.log(stryMutAct_9fa48("4355") ? "Stryker was here!" : (stryCov_9fa48("4355"), ''));
              console.log(stryMutAct_9fa48("4356") ? "" : (stryCov_9fa48("4356"), '📁 Frequently Healed Files:'));
              stryMutAct_9fa48("4357") ? analysis.frequentlyHealedFiles.forEach(file => {
                console.log(`   ${file.file}: ${file.count} times`);
              }) : (stryCov_9fa48("4357"), analysis.frequentlyHealedFiles.slice(0, 10).forEach(file => {
                if (stryMutAct_9fa48("4358")) {
                  {}
                } else {
                  stryCov_9fa48("4358");
                  console.log(stryMutAct_9fa48("4359") ? `` : (stryCov_9fa48("4359"), `   ${file.file}: ${file.count} times`));
                }
              }));
            }
          }
          return stryMutAct_9fa48("4360") ? {} : (stryCov_9fa48("4360"), {
            analysis
          });
        }
      }

      // Execute the healing operation
      const result = await healCommand.execute(options);
      console.log(stryMutAct_9fa48("4361") ? "Stryker was here!" : (stryCov_9fa48("4361"), ''));
      console.log(stryMutAct_9fa48("4362") ? "" : (stryCov_9fa48("4362"), '🏥 Healing Operation Results:'));
      console.log(stryMutAct_9fa48("4363") ? `` : (stryCov_9fa48("4363"), `   Status: ${result.status}`));
      console.log(stryMutAct_9fa48("4364") ? `` : (stryCov_9fa48("4364"), `   Summary: ${result.summary}`));
      console.log(stryMutAct_9fa48("4365") ? `` : (stryCov_9fa48("4365"), `   Tasks modified: ${result.tasksModified}`));
      console.log(stryMutAct_9fa48("4366") ? `` : (stryCov_9fa48("4366"), `   Files changed: ${result.filesChanged}`));
      if (stryMutAct_9fa48("4368") ? false : stryMutAct_9fa48("4367") ? true : (stryCov_9fa48("4367", "4368"), result.contextBuildTime)) {
        if (stryMutAct_9fa48("4369")) {
          {}
        } else {
          stryCov_9fa48("4369");
          console.log(stryMutAct_9fa48("4370") ? `` : (stryCov_9fa48("4370"), `   Context build time: ${result.contextBuildTime}ms`));
        }
      }
      if (stryMutAct_9fa48("4372") ? false : stryMutAct_9fa48("4371") ? true : (stryCov_9fa48("4371", "4372"), result.healingTime)) {
        if (stryMutAct_9fa48("4373")) {
          {}
        } else {
          stryCov_9fa48("4373");
          console.log(stryMutAct_9fa48("4374") ? `` : (stryCov_9fa48("4374"), `   Healing time: ${result.healingTime}ms`));
        }
      }
      if (stryMutAct_9fa48("4376") ? false : stryMutAct_9fa48("4375") ? true : (stryCov_9fa48("4375", "4376"), result.totalTime)) {
        if (stryMutAct_9fa48("4377")) {
          {}
        } else {
          stryCov_9fa48("4377");
          console.log(stryMutAct_9fa48("4378") ? `` : (stryCov_9fa48("4378"), `   Total time: ${result.totalTime}ms`));
        }
      }
      if (stryMutAct_9fa48("4380") ? false : stryMutAct_9fa48("4379") ? true : (stryCov_9fa48("4379", "4380"), result.scar)) {
        if (stryMutAct_9fa48("4381")) {
          {}
        } else {
          stryCov_9fa48("4381");
          console.log(stryMutAct_9fa48("4382") ? "Stryker was here!" : (stryCov_9fa48("4382"), ''));
          console.log(stryMutAct_9fa48("4383") ? "" : (stryCov_9fa48("4383"), '🏷️  Scar Record Created:'));
          console.log(stryMutAct_9fa48("4384") ? `` : (stryCov_9fa48("4384"), `   Tag: ${result.scar.tag}`));
          console.log(stryMutAct_9fa48("4385") ? `` : (stryCov_9fa48("4385"), `   Range: ${stryMutAct_9fa48("4386") ? result.scar.startSha : (stryCov_9fa48("4386"), result.scar.startSha.substring(0, 8))}..${stryMutAct_9fa48("4387") ? result.scar.endSha : (stryCov_9fa48("4387"), result.scar.endSha.substring(0, 8))}`));
        }
      }
      if (stryMutAct_9fa48("4389") ? false : stryMutAct_9fa48("4388") ? true : (stryCov_9fa48("4388", "4389"), result.tagResult)) {
        if (stryMutAct_9fa48("4390")) {
          {}
        } else {
          stryCov_9fa48("4390");
          console.log(stryMutAct_9fa48("4391") ? "Stryker was here!" : (stryCov_9fa48("4391"), ''));
          console.log(stryMutAct_9fa48("4392") ? "" : (stryCov_9fa48("4392"), '🏷️  Git Tag:'));
          if (stryMutAct_9fa48("4394") ? false : stryMutAct_9fa48("4393") ? true : (stryCov_9fa48("4393", "4394"), result.tagResult.success)) {
            if (stryMutAct_9fa48("4395")) {
              {}
            } else {
              stryCov_9fa48("4395");
              console.log(stryMutAct_9fa48("4396") ? `` : (stryCov_9fa48("4396"), `   Created: ${result.tagResult.tag}`));
            }
          } else {
            if (stryMutAct_9fa48("4397")) {
              {}
            } else {
              stryCov_9fa48("4397");
              console.log(stryMutAct_9fa48("4398") ? `` : (stryCov_9fa48("4398"), `   Failed: ${result.tagResult.error}`));
            }
          }
        }
      }
      if (stryMutAct_9fa48("4402") ? result.errors.length <= 0 : stryMutAct_9fa48("4401") ? result.errors.length >= 0 : stryMutAct_9fa48("4400") ? false : stryMutAct_9fa48("4399") ? true : (stryCov_9fa48("4399", "4400", "4401", "4402"), result.errors.length > 0)) {
        if (stryMutAct_9fa48("4403")) {
          {}
        } else {
          stryCov_9fa48("4403");
          console.log(stryMutAct_9fa48("4404") ? "Stryker was here!" : (stryCov_9fa48("4404"), ''));
          console.log(stryMutAct_9fa48("4405") ? "" : (stryCov_9fa48("4405"), '❌ Errors:'));
          result.errors.forEach(error => {
            if (stryMutAct_9fa48("4406")) {
              {}
            } else {
              stryCov_9fa48("4406");
              console.log(stryMutAct_9fa48("4407") ? `` : (stryCov_9fa48("4407"), `   • ${error}`));
            }
          });
        }
      }
      return result;
    }
  });
  return handleHeal;
})());

/**
 * Parse a single argument value (e.g., --depth 50)
 */
function parseArgValue(argv: ReadonlyArray<string>, flag: string, defaultValue: any): any {
  if (stryMutAct_9fa48("4408")) {
    {}
  } else {
    stryCov_9fa48("4408");
    const index = argv.indexOf(flag);
    if (stryMutAct_9fa48("4411") ? index === -1 && index === argv.length - 1 : stryMutAct_9fa48("4410") ? false : stryMutAct_9fa48("4409") ? true : (stryCov_9fa48("4409", "4410", "4411"), (stryMutAct_9fa48("4413") ? index !== -1 : stryMutAct_9fa48("4412") ? false : (stryCov_9fa48("4412", "4413"), index === (stryMutAct_9fa48("4414") ? +1 : (stryCov_9fa48("4414"), -1)))) || (stryMutAct_9fa48("4416") ? index !== argv.length - 1 : stryMutAct_9fa48("4415") ? false : (stryCov_9fa48("4415", "4416"), index === (stryMutAct_9fa48("4417") ? argv.length + 1 : (stryCov_9fa48("4417"), argv.length - 1)))))) {
      if (stryMutAct_9fa48("4418")) {
        {}
      } else {
        stryCov_9fa48("4418");
        return defaultValue;
      }
    }
    const value = argv[stryMutAct_9fa48("4419") ? index - 1 : (stryCov_9fa48("4419"), index + 1)];
    if (stryMutAct_9fa48("4422") ? false : stryMutAct_9fa48("4421") ? true : stryMutAct_9fa48("4420") ? value : (stryCov_9fa48("4420", "4421", "4422"), !value)) {
      if (stryMutAct_9fa48("4423")) {
        {}
      } else {
        stryCov_9fa48("4423");
        return defaultValue;
      }
    }

    // Try to parse as number
    const numValue = parseInt(value, 10);
    if (stryMutAct_9fa48("4426") ? false : stryMutAct_9fa48("4425") ? true : stryMutAct_9fa48("4424") ? isNaN(numValue) : (stryCov_9fa48("4424", "4425", "4426"), !isNaN(numValue))) {
      if (stryMutAct_9fa48("4427")) {
        {}
      } else {
        stryCov_9fa48("4427");
        return numValue;
      }
    }

    // Return as string
    return value;
  }
}

/**
 * Parse multiple argument values (e.g., --search term1 --search term2)
 */
function parseArgValues(argv: ReadonlyArray<string>, flag: string): string[] {
  if (stryMutAct_9fa48("4428")) {
    {}
  } else {
    stryCov_9fa48("4428");
    const values: string[] = stryMutAct_9fa48("4429") ? ["Stryker was here"] : (stryCov_9fa48("4429"), []);
    let index = argv.indexOf(flag);
    while (stryMutAct_9fa48("4431") ? index !== -1 || index < argv.length - 1 : stryMutAct_9fa48("4430") ? false : (stryCov_9fa48("4430", "4431"), (stryMutAct_9fa48("4433") ? index === -1 : stryMutAct_9fa48("4432") ? true : (stryCov_9fa48("4432", "4433"), index !== (stryMutAct_9fa48("4434") ? +1 : (stryCov_9fa48("4434"), -1)))) && (stryMutAct_9fa48("4437") ? index >= argv.length - 1 : stryMutAct_9fa48("4436") ? index <= argv.length - 1 : stryMutAct_9fa48("4435") ? true : (stryCov_9fa48("4435", "4436", "4437"), index < (stryMutAct_9fa48("4438") ? argv.length + 1 : (stryCov_9fa48("4438"), argv.length - 1)))))) {
      if (stryMutAct_9fa48("4439")) {
        {}
      } else {
        stryCov_9fa48("4439");
        const value = argv[stryMutAct_9fa48("4440") ? index - 1 : (stryCov_9fa48("4440"), index + 1)];
        if (stryMutAct_9fa48("4443") ? !value && value.startsWith('--') : stryMutAct_9fa48("4442") ? false : stryMutAct_9fa48("4441") ? true : (stryCov_9fa48("4441", "4442", "4443"), (stryMutAct_9fa48("4444") ? value : (stryCov_9fa48("4444"), !value)) || (stryMutAct_9fa48("4445") ? value.endsWith('--') : (stryCov_9fa48("4445"), value.startsWith(stryMutAct_9fa48("4446") ? "" : (stryCov_9fa48("4446"), '--')))))) {
          if (stryMutAct_9fa48("4447")) {
            {}
          } else {
            stryCov_9fa48("4447");
            break; // Next flag encountered
          }
        }
        values.push(value);
        index = argv.indexOf(flag, stryMutAct_9fa48("4448") ? index - 1 : (stryCov_9fa48("4448"), index + 1));
      }
    }
    return values;
  }
}

// Create rebuild event log command handler
const handleRebuildEventLog = createRebuildEventLogCommand(stryMutAct_9fa48("4449") ? "" : (stryCov_9fa48("4449"), 'docs/agile/boards/generated.md'), stryMutAct_9fa48("4450") ? "" : (stryCov_9fa48("4450"), 'docs/agile/tasks')).execute;
export const COMMAND_HANDLERS: Readonly<Record<string, CommandHandler>> = Object.freeze(stryMutAct_9fa48("4451") ? {} : (stryCov_9fa48("4451"), {
  heal: handleHeal,
  count: handleCount,
  getColumn: handleGetColumn,
  getByColumn: handleGetByColumn,
  find: handleFind,
  'find-by-title': handleFindByTitle,
  update_status: handleUpdateStatus,
  'update-status': handleUpdateStatus,
  move_up: handleMove(stryMutAct_9fa48("4452") ? +1 : (stryCov_9fa48("4452"), -1)),
  move_down: handleMove(1),
  pull: handlePull,
  push: handlePush,
  sync: handleSync,
  regenerate: handleRegenerate,
  'generate-by-tags': handleGenerateByTags,
  indexForSearch: handleIndexForSearch,
  search: handleSearch,
  ui: handleUi,
  dev: handleDev,
  process: handleProcess,
  'show-process': handleShowProcess,
  'show-transitions': handleShowTransitions,
  'compare-tasks': handleCompareTasks,
  'breakdown-task': handleBreakdownTask,
  'prioritize-tasks': handlePrioritizeTasks,
  list: handleList,
  audit: handleAudit,
  'enforce-wip-limits': handleEnforceWipLimits,
  'wip-monitor': handleWipMonitor,
  'wip-compliance': handleWipCompliance,
  'wip-violations': handleWipViolations,
  'wip-suggestions': handleWipSuggestions,
  'commit-stats': handleCommitStats,
  // CRUD commands
  create: handleCreate,
  update: handleUpdate,
  delete: handleDelete,
  // Epic commands
  'create-epic': handleCreateEpic,
  'add-task': handleAddTask,
  'remove-task': handleRemoveTask,
  'list-epics': handleListEpics,
  'epic-status': handleEpicStatus,
  // Setup commands
  init: handleInit,
  // Event log commands
  'rebuild-event-log': handleRebuildEventLog
}));
export const AVAILABLE_COMMANDS: ReadonlyArray<string> = Object.freeze(Object.keys(COMMAND_HANDLERS));
export const REMOTE_COMMANDS: ReadonlyArray<string> = Object.freeze(stryMutAct_9fa48("4453") ? AVAILABLE_COMMANDS : (stryCov_9fa48("4453"), AVAILABLE_COMMANDS.filter(stryMutAct_9fa48("4454") ? () => undefined : (stryCov_9fa48("4454"), command => stryMutAct_9fa48("4457") ? command === 'ui' : stryMutAct_9fa48("4456") ? false : stryMutAct_9fa48("4455") ? true : (stryCov_9fa48("4455", "4456", "4457"), command !== (stryMutAct_9fa48("4458") ? "" : (stryCov_9fa48("4458"), 'ui')))))));
export const executeCommand = async (command: string, args: ReadonlyArray<string>, context: CliContext): Promise<CommandResult> => {
  if (stryMutAct_9fa48("4459")) {
    {}
  } else {
    stryCov_9fa48("4459");
    const handler = COMMAND_HANDLERS[command];
    if (stryMutAct_9fa48("4462") ? false : stryMutAct_9fa48("4461") ? true : stryMutAct_9fa48("4460") ? handler : (stryCov_9fa48("4460", "4461", "4462"), !handler)) {
      if (stryMutAct_9fa48("4463")) {
        {}
      } else {
        stryCov_9fa48("4463");
        throw new CommandNotFoundError(command);
      }
    }
    return handler(args, context);
  }
};