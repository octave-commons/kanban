import { createTaskAIManager } from './task-content/index.js';
import type { Board } from './types.js';
import { locateTask } from './task-lifecycle.js';
import { syncBoardAndTasks } from './task-sync.js';
import type {
  TaskAnalysisResult,
  TaskRewriteResult,
  TaskBreakdownResult,
} from './task-content/types.js';

export const analyzeTask = async (
  board: Board,
  uuid: string,
  analysisType: 'quality' | 'complexity' | 'completeness' | 'breakdown' | 'prioritization',
  _tasksDir: string,
  _boardPath: string,
  context?: {
    projectInfo?: string;
    teamContext?: string;
    deadlines?: string[];
    dependencies?: string[];
  },
  options?: {
    createBackup?: boolean;
    dryRun?: boolean;
  },
): Promise<TaskAnalysisResult | undefined> => {
  try {
    const located = locateTask(board, uuid);
    if (!located) return undefined;

    const aiManager = createTaskAIManager({
      model: 'qwen3:8b',
    });

    const result = await aiManager.analyzeTask({
      uuid,
      analysisType,
      context,
      options,
    });

    return result;
  } catch (error) {
    console.error(`Failed to analyze task ${uuid}:`, error);
    return undefined;
  }
};

export const rewriteTask = async (
  board: Board,
  uuid: string,
  rewriteType: 'improve' | 'simplify' | 'expand' | 'restructure' | 'summarize',
  tasksDir: string,
  boardPath: string,
  options?: {
    instructions?: string;
    targetAudience?: 'developer' | 'manager' | 'stakeholder' | 'team';
    tone?: 'formal' | 'casual' | 'technical' | 'executive';
    createBackup?: boolean;
    dryRun?: boolean;
  },
): Promise<TaskRewriteResult | undefined> => {
  try {
    const located = locateTask(board, uuid);
    if (!located) return undefined;

    const aiManager = createTaskAIManager({
      model: 'qwen3:8b',
    });

    const result = await aiManager.rewriteTask({
      uuid,
      rewriteType,
      instructions: options?.instructions,
      targetAudience: options?.targetAudience,
      tone: options?.tone,
      options,
    });

    if (result.success && !options?.dryRun) {
      await syncBoardAndTasks(board, tasksDir, boardPath);
    }

    return result;
  } catch (error) {
    console.error(`Failed to rewrite task ${uuid}:`, error);
    return undefined;
  }
};

export const breakdownTask = async (
  board: Board,
  uuid: string,
  breakdownType: 'subtasks' | 'steps' | 'phases' | 'components',
  _tasksDir: string,
  _boardPath: string,
  options?: {
    maxSubtasks?: number;
    complexity?: 'simple' | 'medium' | 'complex';
    includeEstimates?: boolean;
    createBackup?: boolean;
    dryRun?: boolean;
  },
): Promise<TaskBreakdownResult | undefined> => {
  try {
    const located = locateTask(board, uuid);
    if (!located) return undefined;

    const aiManager = createTaskAIManager({
      model: 'qwen3:8b',
    });

    const result = await aiManager.breakdownTask({
      uuid,
      breakdownType,
      maxSubtasks: options?.maxSubtasks || 8,
      complexity: options?.complexity || 'medium',
      includeEstimates: options?.includeEstimates !== false,
      options,
    });

    return result;
  } catch (error) {
    console.error(`Failed to breakdown task ${uuid}:`, error);
    return undefined;
  }
};
