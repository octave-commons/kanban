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
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import type { ExecutionContext } from 'ava';
import { executeCommand, type CliContext } from '../cli/command-handlers.js';
import { loadBoard } from '../lib/kanban.js';
import { withTempDir } from './helpers.js';

// Re-export withTempDir for test files
export { withTempDir };

/**
 * CLI testing utilities that bypass environment issues by using direct function calls
 * instead of process spawning.
 */

export interface CliTestResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  result?: unknown;
}
export interface BoardFixture {
  name: string;
  columns: Array<{
    name: string;
    count: number;
    limit: number | null;
    tasks: Array<{
      uuid: string;
      title: string;
      status: string;
      priority: string;
      labels: string[];
      created_at: string;
      content: string;
    }>;
  }>;
}

/**
 * Load a board fixture from JSON file
 */
export const loadBoardFixture = async (fixturePath: string): Promise<BoardFixture> => {
  if (stryMutAct_9fa48("25604")) {
    {}
  } else {
    stryCov_9fa48("25604");
    const content = await readFile(fixturePath, stryMutAct_9fa48("25605") ? "" : (stryCov_9fa48("25605"), 'utf8'));
    return JSON.parse(content) as BoardFixture;
  }
};

/**
 * Convert fixture data to board format and write to board file
 */
export const setupBoardFromFixture = async (t: ExecutionContext, fixturePath: string): Promise<{
  context: CliContext;
  fixture: BoardFixture;
}> => {
  if (stryMutAct_9fa48("25606")) {
    {}
  } else {
    stryCov_9fa48("25606");
    const tempDir = await withTempDir(t);
    const boardPath = path.join(tempDir, stryMutAct_9fa48("25607") ? "" : (stryCov_9fa48("25607"), 'board.md'));
    const tasksDir = path.join(tempDir, stryMutAct_9fa48("25608") ? "" : (stryCov_9fa48("25608"), 'tasks'));
    const fixture = await loadBoardFixture(fixturePath);

    // Create empty board file - the kanban functions will write to it
    await writeFile(boardPath, stryMutAct_9fa48("25609") ? "Stryker was here!" : (stryCov_9fa48("25609"), ''), stryMutAct_9fa48("25610") ? "" : (stryCov_9fa48("25610"), 'utf8'));
    const context: CliContext = stryMutAct_9fa48("25611") ? {} : (stryCov_9fa48("25611"), {
      boardFile: boardPath,
      tasksDir,
      argv: stryMutAct_9fa48("25612") ? ["Stryker was here"] : (stryCov_9fa48("25612"), [])
    });
    return stryMutAct_9fa48("25613") ? {} : (stryCov_9fa48("25613"), {
      context,
      fixture
    });
  }
};

/**
 * Execute a kanban command and capture results
 */
export const executeKanbanCommand = async (command: string, args: string[], context: CliContext): Promise<CliTestResult> => {
  if (stryMutAct_9fa48("25614")) {
    {}
  } else {
    stryCov_9fa48("25614");
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    let stdout = stryMutAct_9fa48("25615") ? "Stryker was here!" : (stryCov_9fa48("25615"), '');
    let stderr = stryMutAct_9fa48("25616") ? "Stryker was here!" : (stryCov_9fa48("25616"), '');
    let exitCode = 0;
    let result: unknown;
    try {
      if (stryMutAct_9fa48("25617")) {
        {}
      } else {
        stryCov_9fa48("25617");
        // Capture console output
        console.log = (...args: any[]) => {
          if (stryMutAct_9fa48("25618")) {
            {}
          } else {
            stryCov_9fa48("25618");
            stryMutAct_9fa48("25619") ? stdout -= args.join(' ') + '\n' : (stryCov_9fa48("25619"), stdout += args.join(stryMutAct_9fa48("25620") ? "" : (stryCov_9fa48("25620"), ' ')) + (stryMutAct_9fa48("25621") ? "" : (stryCov_9fa48("25621"), '\n')));
          }
        };
        console.error = (...args: any[]) => {
          if (stryMutAct_9fa48("25622")) {
            {}
          } else {
            stryCov_9fa48("25622");
            stryMutAct_9fa48("25623") ? stderr -= args.join(' ') + '\n' : (stryCov_9fa48("25623"), stderr += args.join(stryMutAct_9fa48("25624") ? "" : (stryCov_9fa48("25624"), ' ')) + (stryMutAct_9fa48("25625") ? "" : (stryCov_9fa48("25625"), '\n')));
          }
        };

        // Execute the command
        result = await executeCommand(command, args, context);
      }
    } catch (error) {
      if (stryMutAct_9fa48("25626")) {
        {}
      } else {
        stryCov_9fa48("25626");
        stryMutAct_9fa48("25627") ? stderr -= error instanceof Error ? error.message : String(error) : (stryCov_9fa48("25627"), stderr += error instanceof Error ? error.message : String(error));
        exitCode = 1;
      }
    } finally {
      if (stryMutAct_9fa48("25628")) {
        {}
      } else {
        stryCov_9fa48("25628");
        // Restore console methods
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
      }
    }
    return stryMutAct_9fa48("25629") ? {} : (stryCov_9fa48("25629"), {
      stdout,
      stderr,
      exitCode,
      result
    });
  }
};

/**
 * Get current task order in a column
 */
export const getTaskOrder = async (context: CliContext, columnName: string): Promise<string[]> => {
  if (stryMutAct_9fa48("25630")) {
    {}
  } else {
    stryCov_9fa48("25630");
    const board = await loadBoard(context.boardFile, context.tasksDir);
    const column = board.columns.find(stryMutAct_9fa48("25631") ? () => undefined : (stryCov_9fa48("25631"), col => stryMutAct_9fa48("25634") ? col.name.toLowerCase() !== columnName.toLowerCase() : stryMutAct_9fa48("25633") ? false : stryMutAct_9fa48("25632") ? true : (stryCov_9fa48("25632", "25633", "25634"), (stryMutAct_9fa48("25635") ? col.name.toUpperCase() : (stryCov_9fa48("25635"), col.name.toLowerCase())) === (stryMutAct_9fa48("25636") ? columnName.toUpperCase() : (stryCov_9fa48("25636"), columnName.toLowerCase())))));
    if (stryMutAct_9fa48("25639") ? false : stryMutAct_9fa48("25638") ? true : stryMutAct_9fa48("25637") ? column : (stryCov_9fa48("25637", "25638", "25639"), !column)) {
      if (stryMutAct_9fa48("25640")) {
        {}
      } else {
        stryCov_9fa48("25640");
        throw new Error(stryMutAct_9fa48("25641") ? `` : (stryCov_9fa48("25641"), `Column '${columnName}' not found`));
      }
    }
    return column.tasks.map(stryMutAct_9fa48("25642") ? () => undefined : (stryCov_9fa48("25642"), task => task.uuid));
  }
};

/**
 * Verify board file persistence
 */
export const verifyBoardPersistence = async (context: CliContext, expectedTaskOrder: Record<string, string[]>): Promise<boolean> => {
  if (stryMutAct_9fa48("25643")) {
    {}
  } else {
    stryCov_9fa48("25643");
    try {
      if (stryMutAct_9fa48("25644")) {
        {}
      } else {
        stryCov_9fa48("25644");
        const board = await loadBoard(context.boardFile, context.tasksDir);
        for (const [columnName, expectedOrder] of Object.entries(expectedTaskOrder)) {
          if (stryMutAct_9fa48("25645")) {
            {}
          } else {
            stryCov_9fa48("25645");
            const column = board.columns.find(stryMutAct_9fa48("25646") ? () => undefined : (stryCov_9fa48("25646"), col => stryMutAct_9fa48("25649") ? col.name.toLowerCase() !== columnName.toLowerCase() : stryMutAct_9fa48("25648") ? false : stryMutAct_9fa48("25647") ? true : (stryCov_9fa48("25647", "25648", "25649"), (stryMutAct_9fa48("25650") ? col.name.toUpperCase() : (stryCov_9fa48("25650"), col.name.toLowerCase())) === (stryMutAct_9fa48("25651") ? columnName.toUpperCase() : (stryCov_9fa48("25651"), columnName.toLowerCase())))));
            if (stryMutAct_9fa48("25654") ? false : stryMutAct_9fa48("25653") ? true : stryMutAct_9fa48("25652") ? column : (stryCov_9fa48("25652", "25653", "25654"), !column)) {
              if (stryMutAct_9fa48("25655")) {
                {}
              } else {
                stryCov_9fa48("25655");
                return stryMutAct_9fa48("25656") ? true : (stryCov_9fa48("25656"), false);
              }
            }
            const actualOrder = column.tasks.map(stryMutAct_9fa48("25657") ? () => undefined : (stryCov_9fa48("25657"), task => task.uuid));
            if (stryMutAct_9fa48("25660") ? JSON.stringify(actualOrder) === JSON.stringify(expectedOrder) : stryMutAct_9fa48("25659") ? false : stryMutAct_9fa48("25658") ? true : (stryCov_9fa48("25658", "25659", "25660"), JSON.stringify(actualOrder) !== JSON.stringify(expectedOrder))) {
              if (stryMutAct_9fa48("25661")) {
                {}
              } else {
                stryCov_9fa48("25661");
                return stryMutAct_9fa48("25662") ? true : (stryCov_9fa48("25662"), false);
              }
            }
          }
        }
        return stryMutAct_9fa48("25663") ? false : (stryCov_9fa48("25663"), true);
      }
    } catch (error) {
      if (stryMutAct_9fa48("25664")) {
        {}
      } else {
        stryCov_9fa48("25664");
        return stryMutAct_9fa48("25665") ? true : (stryCov_9fa48("25665"), false);
      }
    }
  }
};

/**
 * Performance measurement utility
 */
export const measurePerformance = async <T,>(operation: () => Promise<T>): Promise<{
  result: T;
  durationMs: number;
}> => {
  if (stryMutAct_9fa48("25666")) {
    {}
  } else {
    stryCov_9fa48("25666");
    const startTime = performance.now();
    const result = await operation();
    const endTime = performance.now();
    return stryMutAct_9fa48("25667") ? {} : (stryCov_9fa48("25667"), {
      result,
      durationMs: Math.round(stryMutAct_9fa48("25668") ? endTime + startTime : (stryCov_9fa48("25668"), endTime - startTime))
    });
  }
};

/**
 * Create a large board for performance testing
 */
export const createLargeBoard = async (taskCount: number): Promise<BoardFixture> => {
  if (stryMutAct_9fa48("25669")) {
    {}
  } else {
    stryCov_9fa48("25669");
    const tasks = stryMutAct_9fa48("25670") ? ["Stryker was here"] : (stryCov_9fa48("25670"), []);
    for (let i = 1; stryMutAct_9fa48("25673") ? i > taskCount : stryMutAct_9fa48("25672") ? i < taskCount : stryMutAct_9fa48("25671") ? false : (stryCov_9fa48("25671", "25672", "25673"), i <= taskCount); stryMutAct_9fa48("25674") ? i-- : (stryCov_9fa48("25674"), i++)) {
      if (stryMutAct_9fa48("25675")) {
        {}
      } else {
        stryCov_9fa48("25675");
        const paddedIndex = i.toString().padStart(3, stryMutAct_9fa48("25676") ? "" : (stryCov_9fa48("25676"), '0'));
        tasks.push(stryMutAct_9fa48("25677") ? {} : (stryCov_9fa48("25677"), {
          uuid: stryMutAct_9fa48("25678") ? `` : (stryCov_9fa48("25678"), `perf-task-${paddedIndex}`),
          title: stryMutAct_9fa48("25679") ? `` : (stryCov_9fa48("25679"), `Performance test task ${i}`),
          status: stryMutAct_9fa48("25680") ? "" : (stryCov_9fa48("25680"), 'Todo'),
          priority: `P${(i % 3 + 1).toString()}` as string,
          labels: stryMutAct_9fa48("25681") ? [] : (stryCov_9fa48("25681"), [stryMutAct_9fa48("25682") ? `` : (stryCov_9fa48("25682"), `category-${stryMutAct_9fa48("25683") ? i % 5 - 1 : (stryCov_9fa48("25683"), (stryMutAct_9fa48("25684") ? i * 5 : (stryCov_9fa48("25684"), i % 5)) + 1)}`), stryMutAct_9fa48("25685") ? `` : (stryCov_9fa48("25685"), `performance-test`)]),
          created_at: stryMutAct_9fa48("25686") ? `` : (stryCov_9fa48("25686"), `2025-01-01T${Math.floor(stryMutAct_9fa48("25687") ? i * 4 : (stryCov_9fa48("25687"), i / 4)).toString().padStart(2, stryMutAct_9fa48("25688") ? "" : (stryCov_9fa48("25688"), '0'))}:${(stryMutAct_9fa48("25689") ? i % 4 / 15 : (stryCov_9fa48("25689"), (stryMutAct_9fa48("25690") ? i * 4 : (stryCov_9fa48("25690"), i % 4)) * 15)).toString().padStart(2, stryMutAct_9fa48("25691") ? "" : (stryCov_9fa48("25691"), '0'))}:00.000Z`),
          content: stryMutAct_9fa48("25692") ? `` : (stryCov_9fa48("25692"), `This is performance test task number ${i} with some content to simulate real tasks.`)
        }));
      }
    }
    return stryMutAct_9fa48("25693") ? {} : (stryCov_9fa48("25693"), {
      name: stryMutAct_9fa48("25694") ? "" : (stryCov_9fa48("25694"), 'Large Performance Test Board'),
      columns: stryMutAct_9fa48("25695") ? [] : (stryCov_9fa48("25695"), [stryMutAct_9fa48("25696") ? {} : (stryCov_9fa48("25696"), {
        name: stryMutAct_9fa48("25697") ? "" : (stryCov_9fa48("25697"), 'Todo'),
        count: taskCount,
        limit: null,
        tasks
      })])
    });
  }
};

/**
 * Generate random UUID for testing
 */
export const generateRandomUuid = (): string => {
  if (stryMutAct_9fa48("25698")) {
    {}
  } else {
    stryCov_9fa48("25698");
    return (stryMutAct_9fa48("25699") ? "" : (stryCov_9fa48("25699"), 'test-')) + (stryMutAct_9fa48("25700") ? Math.random().toString(36) : (stryCov_9fa48("25700"), Math.random().toString(36).substr(2, 9))) + (stryMutAct_9fa48("25701") ? "" : (stryCov_9fa48("25701"), '-')) + Date.now().toString(36);
  }
};

/**
 * Verify task exists in board
 */
export const verifyTaskExists = async (context: CliContext, taskUuid: string): Promise<boolean> => {
  if (stryMutAct_9fa48("25702")) {
    {}
  } else {
    stryCov_9fa48("25702");
    try {
      if (stryMutAct_9fa48("25703")) {
        {}
      } else {
        stryCov_9fa48("25703");
        const board = await loadBoard(context.boardFile, context.tasksDir);
        for (const column of board.columns) {
          if (stryMutAct_9fa48("25704")) {
            {}
          } else {
            stryCov_9fa48("25704");
            if (stryMutAct_9fa48("25707") ? column.tasks.every(task => task.uuid === taskUuid) : stryMutAct_9fa48("25706") ? false : stryMutAct_9fa48("25705") ? true : (stryCov_9fa48("25705", "25706", "25707"), column.tasks.some(stryMutAct_9fa48("25708") ? () => undefined : (stryCov_9fa48("25708"), task => stryMutAct_9fa48("25711") ? task.uuid !== taskUuid : stryMutAct_9fa48("25710") ? false : stryMutAct_9fa48("25709") ? true : (stryCov_9fa48("25709", "25710", "25711"), task.uuid === taskUuid))))) {
              if (stryMutAct_9fa48("25712")) {
                {}
              } else {
                stryCov_9fa48("25712");
                return stryMutAct_9fa48("25713") ? false : (stryCov_9fa48("25713"), true);
              }
            }
          }
        }
        return stryMutAct_9fa48("25714") ? true : (stryCov_9fa48("25714"), false);
      }
    } catch (error) {
      if (stryMutAct_9fa48("25715")) {
        {}
      } else {
        stryCov_9fa48("25715");
        return stryMutAct_9fa48("25716") ? true : (stryCov_9fa48("25716"), false);
      }
    }
  }
};

/**
 * Get task position in column
 */
export const getTaskPosition = async (context: CliContext, taskUuid: string): Promise<{
  column: string;
  position: number;
} | null> => {
  if (stryMutAct_9fa48("25717")) {
    {}
  } else {
    stryCov_9fa48("25717");
    try {
      if (stryMutAct_9fa48("25718")) {
        {}
      } else {
        stryCov_9fa48("25718");
        const board = await loadBoard(context.boardFile, context.tasksDir);
        for (const column of board.columns) {
          if (stryMutAct_9fa48("25719")) {
            {}
          } else {
            stryCov_9fa48("25719");
            const position = column.tasks.findIndex(stryMutAct_9fa48("25720") ? () => undefined : (stryCov_9fa48("25720"), task => stryMutAct_9fa48("25723") ? task.uuid !== taskUuid : stryMutAct_9fa48("25722") ? false : stryMutAct_9fa48("25721") ? true : (stryCov_9fa48("25721", "25722", "25723"), task.uuid === taskUuid)));
            if (stryMutAct_9fa48("25726") ? position === -1 : stryMutAct_9fa48("25725") ? false : stryMutAct_9fa48("25724") ? true : (stryCov_9fa48("25724", "25725", "25726"), position !== (stryMutAct_9fa48("25727") ? +1 : (stryCov_9fa48("25727"), -1)))) {
              if (stryMutAct_9fa48("25728")) {
                {}
              } else {
                stryCov_9fa48("25728");
                return stryMutAct_9fa48("25729") ? {} : (stryCov_9fa48("25729"), {
                  column: column.name,
                  position
                });
              }
            }
          }
        }
        return null;
      }
    } catch (error) {
      if (stryMutAct_9fa48("25730")) {
        {}
      } else {
        stryCov_9fa48("25730");
        return null;
      }
    }
  }
};