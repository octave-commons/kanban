#!/usr/bin/env node
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
import { loadKanbanConfig } from './board/config.js';
import { printJSONL } from './lib/jsonl.js';
import { printMarkdown } from './lib/markdown-output.js';
import { processSync } from './process/sync.js';
import { docguard } from './process/docguard.js';
import { AVAILABLE_COMMANDS, CommandNotFoundError, CommandUsageError, executeCommand, type CliContext } from './cli/command-handlers.js';
const LEGACY_FLAG_MAP = Object.freeze(new Map<string, string>(stryMutAct_9fa48("4464") ? [] : (stryCov_9fa48("4464"), [stryMutAct_9fa48("4465") ? [] : (stryCov_9fa48("4465"), [stryMutAct_9fa48("4466") ? "" : (stryCov_9fa48("4466"), '--kanban'), stryMutAct_9fa48("4467") ? "" : (stryCov_9fa48("4467"), '--board-file')]), stryMutAct_9fa48("4468") ? [] : (stryCov_9fa48("4468"), [stryMutAct_9fa48("4469") ? "" : (stryCov_9fa48("4469"), '--tasks'), stryMutAct_9fa48("4470") ? "" : (stryCov_9fa48("4470"), '--tasks-dir')])])));
const LEGACY_FLAG_ENTRIES = Array.from(LEGACY_FLAG_MAP.entries());
const normalizeLegacyToken = stryMutAct_9fa48("4471") ? () => undefined : (stryCov_9fa48("4471"), (() => {
  const normalizeLegacyToken = (token: string): string => LEGACY_FLAG_ENTRIES.reduce((current, [legacy, mapped]) => {
    if (stryMutAct_9fa48("4472")) {
      {}
    } else {
      stryCov_9fa48("4472");
      if (stryMutAct_9fa48("4475") ? current !== legacy : stryMutAct_9fa48("4474") ? false : stryMutAct_9fa48("4473") ? true : (stryCov_9fa48("4473", "4474", "4475"), current === legacy)) {
        if (stryMutAct_9fa48("4476")) {
          {}
        } else {
          stryCov_9fa48("4476");
          return mapped;
        }
      }
      if (stryMutAct_9fa48("4479") ? current.endsWith(`${legacy}=`) : stryMutAct_9fa48("4478") ? false : stryMutAct_9fa48("4477") ? true : (stryCov_9fa48("4477", "4478", "4479"), current.startsWith(stryMutAct_9fa48("4480") ? `` : (stryCov_9fa48("4480"), `${legacy}=`)))) {
        if (stryMutAct_9fa48("4481")) {
          {}
        } else {
          stryCov_9fa48("4481");
          return stryMutAct_9fa48("4482") ? `` : (stryCov_9fa48("4482"), `${mapped}=${stryMutAct_9fa48("4483") ? current : (stryCov_9fa48("4483"), current.slice(stryMutAct_9fa48("4484") ? legacy.length - 1 : (stryCov_9fa48("4484"), legacy.length + 1)))}`);
        }
      }
      return current;
    }
  }, token);
  return normalizeLegacyToken;
})());
const normalizeLegacyArgs = stryMutAct_9fa48("4485") ? () => undefined : (stryCov_9fa48("4485"), (() => {
  const normalizeLegacyArgs = (args: ReadonlyArray<string>): ReadonlyArray<string> => args.map(normalizeLegacyToken);
  return normalizeLegacyArgs;
})());
const LEGACY_ENV_MAPPINGS = Object.freeze([['KANBAN_PATH', 'KANBAN_BOARD_FILE'], ['TASKS_PATH', 'KANBAN_TASKS_DIR']] as const);
const applyLegacyEnv = (env: Readonly<NodeJS.ProcessEnv>): Readonly<NodeJS.ProcessEnv> => {
  if (stryMutAct_9fa48("4486")) {
    {}
  } else {
    stryCov_9fa48("4486");
    const patches = LEGACY_ENV_MAPPINGS.reduce<ReadonlyArray<readonly [string, string]>>((acc, [legacy, modern]) => {
      if (stryMutAct_9fa48("4487")) {
        {}
      } else {
        stryCov_9fa48("4487");
        const legacyValue = env[legacy];
        if (stryMutAct_9fa48("4490") ? typeof legacyValue === 'string' || typeof env[modern] !== 'string' : stryMutAct_9fa48("4489") ? false : stryMutAct_9fa48("4488") ? true : (stryCov_9fa48("4488", "4489", "4490"), (stryMutAct_9fa48("4492") ? typeof legacyValue !== 'string' : stryMutAct_9fa48("4491") ? true : (stryCov_9fa48("4491", "4492"), typeof legacyValue === (stryMutAct_9fa48("4493") ? "" : (stryCov_9fa48("4493"), 'string')))) && (stryMutAct_9fa48("4495") ? typeof env[modern] === 'string' : stryMutAct_9fa48("4494") ? true : (stryCov_9fa48("4494", "4495"), typeof env[modern] !== (stryMutAct_9fa48("4496") ? "" : (stryCov_9fa48("4496"), 'string')))))) {
          if (stryMutAct_9fa48("4497")) {
            {}
          } else {
            stryCov_9fa48("4497");
            return stryMutAct_9fa48("4498") ? [] : (stryCov_9fa48("4498"), [...acc, [modern, legacyValue] as const]);
          }
        }
        return acc;
      }
    }, stryMutAct_9fa48("4499") ? ["Stryker was here"] : (stryCov_9fa48("4499"), []));
    if (stryMutAct_9fa48("4502") ? patches.length !== 0 : stryMutAct_9fa48("4501") ? false : stryMutAct_9fa48("4500") ? true : (stryCov_9fa48("4500", "4501", "4502"), patches.length === 0)) {
      if (stryMutAct_9fa48("4503")) {
        {}
      } else {
        stryCov_9fa48("4503");
        return stryMutAct_9fa48("4504") ? {} : (stryCov_9fa48("4504"), {
          ...env
        });
      }
    }
    return stryMutAct_9fa48("4505") ? {} : (stryCov_9fa48("4505"), {
      ...env,
      ...Object.fromEntries(patches)
    });
  }
};
const COMMAND_LIST = AVAILABLE_COMMANDS;

/**
 * Detect the type of output based on command
 */
const detectOutputType = (cmd: string): 'task' | 'tasks' | 'board' | 'search' | 'count' | 'audit' | 'table' => {
  if (stryMutAct_9fa48("4506")) {
    {}
  } else {
    stryCov_9fa48("4506");
    switch (cmd) {
      case stryMutAct_9fa48("4508") ? "" : (stryCov_9fa48("4508"), 'find'):
        if (stryMutAct_9fa48("4507")) {} else {
          stryCov_9fa48("4507");
          return stryMutAct_9fa48("4509") ? "" : (stryCov_9fa48("4509"), 'task');
        }
      case stryMutAct_9fa48("4510") ? "" : (stryCov_9fa48("4510"), 'list'):
      case stryMutAct_9fa48("4511") ? "" : (stryCov_9fa48("4511"), 'pull'):
      case stryMutAct_9fa48("4512") ? "" : (stryCov_9fa48("4512"), 'push'):
      case stryMutAct_9fa48("4514") ? "" : (stryCov_9fa48("4514"), 'sync'):
        if (stryMutAct_9fa48("4513")) {} else {
          stryCov_9fa48("4513");
          return stryMutAct_9fa48("4515") ? "" : (stryCov_9fa48("4515"), 'tasks');
        }
      case stryMutAct_9fa48("4516") ? "" : (stryCov_9fa48("4516"), 'regenerate'):
      case stryMutAct_9fa48("4518") ? "" : (stryCov_9fa48("4518"), 'ui'):
        if (stryMutAct_9fa48("4517")) {} else {
          stryCov_9fa48("4517");
          return stryMutAct_9fa48("4519") ? "" : (stryCov_9fa48("4519"), 'board');
        }
      case stryMutAct_9fa48("4521") ? "" : (stryCov_9fa48("4521"), 'search'):
        if (stryMutAct_9fa48("4520")) {} else {
          stryCov_9fa48("4520");
          return stryMutAct_9fa48("4522") ? "" : (stryCov_9fa48("4522"), 'search');
        }
      case stryMutAct_9fa48("4524") ? "" : (stryCov_9fa48("4524"), 'count'):
        if (stryMutAct_9fa48("4523")) {} else {
          stryCov_9fa48("4523");
          return stryMutAct_9fa48("4525") ? "" : (stryCov_9fa48("4525"), 'count');
        }
      case stryMutAct_9fa48("4527") ? "" : (stryCov_9fa48("4527"), 'audit'):
        if (stryMutAct_9fa48("4526")) {} else {
          stryCov_9fa48("4526");
          return stryMutAct_9fa48("4528") ? "" : (stryCov_9fa48("4528"), 'audit');
        }
      default:
        if (stryMutAct_9fa48("4529")) {} else {
          stryCov_9fa48("4529");
          return stryMutAct_9fa48("4530") ? "" : (stryCov_9fa48("4530"), 'table');
        }
    }
  }
};
const HELP_TEXT = (stryMutAct_9fa48("4531") ? `` : (stryCov_9fa48("4531"), `Usage: kanban [--kanban path] [--tasks path] [--json] <subcommand> [args...]\n`)) + (stryMutAct_9fa48("4532") ? `` : (stryCov_9fa48("4532"), `Subcommands: ${(stryMutAct_9fa48("4533") ? [] : (stryCov_9fa48("4533"), [...COMMAND_LIST, stryMutAct_9fa48("4534") ? "" : (stryCov_9fa48("4534"), 'process_sync'), stryMutAct_9fa48("4535") ? "" : (stryCov_9fa48("4535"), 'doccheck')])).join(stryMutAct_9fa48("4536") ? "" : (stryCov_9fa48("4536"), ', '))}\n\n`)) + (stryMutAct_9fa48("4537") ? `` : (stryCov_9fa48("4537"), `Options:\n`)) + (stryMutAct_9fa48("4538") ? `` : (stryCov_9fa48("4538"), `  --json   - Output in JSONL format (default: markdown)\n\n`)) + (stryMutAct_9fa48("4539") ? `` : (stryCov_9fa48("4539"), `Setup:\n`)) + (stryMutAct_9fa48("4540") ? `` : (stryCov_9fa48("4540"), `  init     - Initialize a new kanban project with simple config\n\n`)) + (stryMutAct_9fa48("4541") ? `` : (stryCov_9fa48("4541"), `Core Operations:\n`)) + (stryMutAct_9fa48("4542") ? `` : (stryCov_9fa48("4542"), `  push     - Push board state to task files (board → files)\n`)) + (stryMutAct_9fa48("4543") ? `` : (stryCov_9fa48("4543"), `  pull     - Pull task file state to board (files → board)\n`)) + (stryMutAct_9fa48("4544") ? `` : (stryCov_9fa48("4544"), `  sync     - Bidirectional sync with conflict detection\n`)) + (stryMutAct_9fa48("4545") ? `` : (stryCov_9fa48("4545"), `  regenerate - Regenerate board from task files\n\n`)) + (stryMutAct_9fa48("4546") ? `` : (stryCov_9fa48("4546"), `Task Management:\n`)) + (stryMutAct_9fa48("4547") ? `` : (stryCov_9fa48("4547"), `  create   - Create new task\n`)) + (stryMutAct_9fa48("4548") ? `` : (stryCov_9fa48("4548"), `  update   - Update existing task\n`)) + (stryMutAct_9fa48("4549") ? `` : (stryCov_9fa48("4549"), `  delete   - Delete task\n`)) + (stryMutAct_9fa48("4550") ? `` : (stryCov_9fa48("4550"), `  list     - List tasks with status\n\n`)) + (stryMutAct_9fa48("4551") ? `` : (stryCov_9fa48("4551"), `Search & Navigation:\n`)) + (stryMutAct_9fa48("4552") ? `` : (stryCov_9fa48("4552"), `  find     - Find task by UUID\n`)) + (stryMutAct_9fa48("4553") ? `` : (stryCov_9fa48("4553"), `  search   - Search tasks by content\n`)) + (stryMutAct_9fa48("4554") ? `` : (stryCov_9fa48("4554"), `  count    - Count tasks in columns\n\n`)) + (stryMutAct_9fa48("4555") ? `` : (stryCov_9fa48("4555"), `Advanced:\n`)) + (stryMutAct_9fa48("4556") ? `` : (stryCov_9fa48("4556"), `  audit    - Audit board consistency\n`)) + (stryMutAct_9fa48("4557") ? `` : (stryCov_9fa48("4557"), `  heal     - Heal board issues with git tag management\n`)) + (stryMutAct_9fa48("4558") ? `` : (stryCov_9fa48("4558"), `  ui       - Start web UI\n`)) + (stryMutAct_9fa48("4559") ? `` : (stryCov_9fa48("4559"), `  dev      - Start development server\n\n`)) + (stryMutAct_9fa48("4560") ? `` : (stryCov_9fa48("4560"), `WIP Management:\n`)) + (stryMutAct_9fa48("4561") ? `` : (stryCov_9fa48("4561"), `  enforce-wip-limits - Enforce WIP limits and move excess tasks\n`)) + (stryMutAct_9fa48("4562") ? `` : (stryCov_9fa48("4562"), `  wip-monitor       - Real-time capacity monitoring\n`)) + (stryMutAct_9fa48("4563") ? `` : (stryCov_9fa48("4563"), `  wip-compliance    - Generate compliance reports\n`)) + (stryMutAct_9fa48("4564") ? `` : (stryCov_9fa48("4564"), `  wip-violations    - View violation history\n`)) + (stryMutAct_9fa48("4565") ? `` : (stryCov_9fa48("4565"), `  wip-suggestions  - Get capacity balancing suggestions`));
async function main(): Promise<void> {
  if (stryMutAct_9fa48("4566")) {
    {}
  } else {
    stryCov_9fa48("4566");
    const rawArgs = stryMutAct_9fa48("4567") ? process.argv : (stryCov_9fa48("4567"), process.argv.slice(2));
    const normalizedArgs = normalizeLegacyArgs(rawArgs);
    const helpRequested = stryMutAct_9fa48("4570") ? normalizedArgs.includes('--help') && normalizedArgs.includes('-h') : stryMutAct_9fa48("4569") ? false : stryMutAct_9fa48("4568") ? true : (stryCov_9fa48("4568", "4569", "4570"), normalizedArgs.includes(stryMutAct_9fa48("4571") ? "" : (stryCov_9fa48("4571"), '--help')) || normalizedArgs.includes(stryMutAct_9fa48("4572") ? "" : (stryCov_9fa48("4572"), '-h')));
    const jsonRequested = normalizedArgs.includes(stryMutAct_9fa48("4573") ? "" : (stryCov_9fa48("4573"), '--json'));

    // Special handling for init command - extract config path before config loading
    const [cmd, ...restArgs] = normalizedArgs;
    if (stryMutAct_9fa48("4576") ? cmd !== 'init' : stryMutAct_9fa48("4575") ? false : stryMutAct_9fa48("4574") ? true : (stryCov_9fa48("4574", "4575", "4576"), cmd === (stryMutAct_9fa48("4577") ? "" : (stryCov_9fa48("4577"), 'init')))) {
      if (stryMutAct_9fa48("4578")) {
        {}
      } else {
        stryCov_9fa48("4578");
        const context: CliContext = stryMutAct_9fa48("4579") ? {} : (stryCov_9fa48("4579"), {
          boardFile: stryMutAct_9fa48("4580") ? "Stryker was here!" : (stryCov_9fa48("4580"), ''),
          tasksDir: stryMutAct_9fa48("4581") ? "Stryker was here!" : (stryCov_9fa48("4581"), ''),
          argv: normalizedArgs
        });
        try {
          if (stryMutAct_9fa48("4582")) {
            {}
          } else {
            stryCov_9fa48("4582");
            const result = await executeCommand(cmd, restArgs, context);
            if (stryMutAct_9fa48("4585") ? typeof result !== 'undefined' || result !== null : stryMutAct_9fa48("4584") ? false : stryMutAct_9fa48("4583") ? true : (stryCov_9fa48("4583", "4584", "4585"), (stryMutAct_9fa48("4587") ? typeof result === 'undefined' : stryMutAct_9fa48("4586") ? true : (stryCov_9fa48("4586", "4587"), typeof result !== (stryMutAct_9fa48("4588") ? "" : (stryCov_9fa48("4588"), 'undefined')))) && (stryMutAct_9fa48("4590") ? result === null : stryMutAct_9fa48("4589") ? true : (stryCov_9fa48("4589", "4590"), result !== null)))) {
              if (stryMutAct_9fa48("4591")) {
                {}
              } else {
                stryCov_9fa48("4591");
                if (stryMutAct_9fa48("4593") ? false : stryMutAct_9fa48("4592") ? true : (stryCov_9fa48("4592", "4593"), jsonRequested)) {
                  if (stryMutAct_9fa48("4594")) {
                    {}
                  } else {
                    stryCov_9fa48("4594");
                    printJSONL(result);
                  }
                } else {
                  if (stryMutAct_9fa48("4595")) {
                    {}
                  } else {
                    stryCov_9fa48("4595");
                    printMarkdown(result, detectOutputType(cmd), stryMutAct_9fa48("4596") ? {} : (stryCov_9fa48("4596"), {
                      query: stryMutAct_9fa48("4599") ? restArgs[0] && '' : stryMutAct_9fa48("4598") ? false : stryMutAct_9fa48("4597") ? true : (stryCov_9fa48("4597", "4598", "4599"), restArgs[0] || (stryMutAct_9fa48("4600") ? "Stryker was here!" : (stryCov_9fa48("4600"), '')))
                    }));
                  }
                }
              }
            }
          }
        } catch (error: unknown) {
          if (stryMutAct_9fa48("4601")) {
            {}
          } else {
            stryCov_9fa48("4601");
            if (stryMutAct_9fa48("4604") ? error instanceof CommandUsageError && error instanceof CommandNotFoundError : stryMutAct_9fa48("4603") ? false : stryMutAct_9fa48("4602") ? true : (stryCov_9fa48("4602", "4603", "4604"), error instanceof CommandUsageError || error instanceof CommandNotFoundError)) {
              if (stryMutAct_9fa48("4605")) {
                {}
              } else {
                stryCov_9fa48("4605");
                console.error(error.message);
                process.exit(2);
              }
            }
            throw error;
          }
        }
        return;
      }
    }
    const {
      config,
      restArgs: configRestArgs
    } = await loadKanbanConfig(stryMutAct_9fa48("4606") ? {} : (stryCov_9fa48("4606"), {
      argv: normalizedArgs,
      env: applyLegacyEnv(process.env)
    }));

    // Filter out --json flag from command arguments
    const filteredArgs = stryMutAct_9fa48("4607") ? configRestArgs : (stryCov_9fa48("4607"), configRestArgs.filter(stryMutAct_9fa48("4608") ? () => undefined : (stryCov_9fa48("4608"), arg => stryMutAct_9fa48("4611") ? arg === '--json' : stryMutAct_9fa48("4610") ? false : stryMutAct_9fa48("4609") ? true : (stryCov_9fa48("4609", "4610", "4611"), arg !== (stryMutAct_9fa48("4612") ? "" : (stryCov_9fa48("4612"), '--json'))))));
    const [actualCmd, ...args] = filteredArgs;
    const boardFile = config.boardFile;
    const tasksDir = config.tasksDir;
    if (stryMutAct_9fa48("4615") ? helpRequested && !actualCmd : stryMutAct_9fa48("4614") ? false : stryMutAct_9fa48("4613") ? true : (stryCov_9fa48("4613", "4614", "4615"), helpRequested || (stryMutAct_9fa48("4616") ? actualCmd : (stryCov_9fa48("4616"), !actualCmd)))) {
      if (stryMutAct_9fa48("4617")) {
        {}
      } else {
        stryCov_9fa48("4617");
        console.log(HELP_TEXT);
        process.exit(0);
      }
    }
    const context: CliContext = stryMutAct_9fa48("4618") ? {} : (stryCov_9fa48("4618"), {
      boardFile,
      tasksDir,
      argv: normalizedArgs
    });
    if (stryMutAct_9fa48("4621") ? actualCmd !== 'process_sync' : stryMutAct_9fa48("4620") ? false : stryMutAct_9fa48("4619") ? true : (stryCov_9fa48("4619", "4620", "4621"), actualCmd === (stryMutAct_9fa48("4622") ? "" : (stryCov_9fa48("4622"), 'process_sync')))) {
      if (stryMutAct_9fa48("4623")) {
        {}
      } else {
        stryCov_9fa48("4623");
        const res = await processSync(stryMutAct_9fa48("4624") ? {} : (stryCov_9fa48("4624"), {
          processFile: process.env.KANBAN_PROCESS_FILE,
          owner: process.env.GITHUB_OWNER,
          repo: process.env.GITHUB_REPO,
          token: process.env.GITHUB_TOKEN
        }));
        printJSONL(res);
        return;
      }
    }
    if (stryMutAct_9fa48("4627") ? actualCmd !== 'doccheck' : stryMutAct_9fa48("4626") ? false : stryMutAct_9fa48("4625") ? true : (stryCov_9fa48("4625", "4626", "4627"), actualCmd === (stryMutAct_9fa48("4628") ? "" : (stryCov_9fa48("4628"), 'doccheck')))) {
      if (stryMutAct_9fa48("4629")) {
        {}
      } else {
        stryCov_9fa48("4629");
        const pr = stryMutAct_9fa48("4632") ? args[0] && process.env.PR_NUMBER : stryMutAct_9fa48("4631") ? false : stryMutAct_9fa48("4630") ? true : (stryCov_9fa48("4630", "4631", "4632"), args[0] || process.env.PR_NUMBER);
        await docguard(stryMutAct_9fa48("4633") ? {} : (stryCov_9fa48("4633"), {
          pr,
          owner: process.env.GITHUB_OWNER,
          repo: process.env.GITHUB_REPO,
          token: process.env.GITHUB_TOKEN
        }));
        return;
      }
    }
    try {
      if (stryMutAct_9fa48("4634")) {
        {}
      } else {
        stryCov_9fa48("4634");
        const result = await executeCommand(actualCmd, args, context);
        if (stryMutAct_9fa48("4637") ? typeof result !== 'undefined' || result !== null : stryMutAct_9fa48("4636") ? false : stryMutAct_9fa48("4635") ? true : (stryCov_9fa48("4635", "4636", "4637"), (stryMutAct_9fa48("4639") ? typeof result === 'undefined' : stryMutAct_9fa48("4638") ? true : (stryCov_9fa48("4638", "4639"), typeof result !== (stryMutAct_9fa48("4640") ? "" : (stryCov_9fa48("4640"), 'undefined')))) && (stryMutAct_9fa48("4642") ? result === null : stryMutAct_9fa48("4641") ? true : (stryCov_9fa48("4641", "4642"), result !== null)))) {
          if (stryMutAct_9fa48("4643")) {
            {}
          } else {
            stryCov_9fa48("4643");
            if (stryMutAct_9fa48("4645") ? false : stryMutAct_9fa48("4644") ? true : (stryCov_9fa48("4644", "4645"), jsonRequested)) {
              if (stryMutAct_9fa48("4646")) {
                {}
              } else {
                stryCov_9fa48("4646");
                printJSONL(result);
              }
            } else {
              if (stryMutAct_9fa48("4647")) {
                {}
              } else {
                stryCov_9fa48("4647");
                printMarkdown(result, detectOutputType(actualCmd), stryMutAct_9fa48("4648") ? {} : (stryCov_9fa48("4648"), {
                  query: args[0]
                }));
              }
            }
          }
        }
      }
    } catch (error: unknown) {
      if (stryMutAct_9fa48("4649")) {
        {}
      } else {
        stryCov_9fa48("4649");
        if (stryMutAct_9fa48("4652") ? error instanceof CommandUsageError && error instanceof CommandNotFoundError : stryMutAct_9fa48("4651") ? false : stryMutAct_9fa48("4650") ? true : (stryCov_9fa48("4650", "4651", "4652"), error instanceof CommandUsageError || error instanceof CommandNotFoundError)) {
          if (stryMutAct_9fa48("4653")) {
            {}
          } else {
            stryCov_9fa48("4653");
            console.error(error.message);
            process.exit(2);
          }
        }
        throw error;
      }
    }
  }
}
main().catch((error: unknown) => {
  if (stryMutAct_9fa48("4654")) {
    {}
  } else {
    stryCov_9fa48("4654");
    const message = error instanceof Error ? stryMutAct_9fa48("4655") ? error.stack && error.message : (stryCov_9fa48("4655"), error.stack ?? error.message) : String(error);
    console.error(message);
    process.exit(1);
  }
});