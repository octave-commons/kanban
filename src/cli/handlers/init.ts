import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

import type { CommandHandler } from '../types.js';

const handleInit: CommandHandler = async (args) => {
  const rawConfigArg = process.argv.find((arg) => arg.startsWith('--config='));
  const configPath =
    rawConfigArg?.slice(9) ||
    args.find((arg) => arg.startsWith('--config='))?.slice(9) ||
    'promethean.kanban.json';
  const force = args.includes('--force') || args.includes('-f');

  try {
    await readFile(configPath, 'utf8');
    if (!force) {
      console.log(`❌ Configuration file "${configPath}" already exists.`);
      console.log('   Use --force to overwrite existing configuration.');
      return { created: false, reason: 'exists' };
    }
  } catch {
    // File doesn't exist
  }

  const simpleConfig = {
    _comment: 'Promethean Kanban Configuration - Simple starter config',
    _description: 'Basic kanban configuration for new projects. Customize as needed.',
    _usage: "Use 'kanban regenerate' to create the board from tasks.",

    tasksDir: 'docs/agile/tasks',
    indexFile: '',
    boardFile: 'docs/agile/boards/generated.md',
    cachePath: 'docs/agile/boards/.cache',
    exts: ['.md'],

    requiredFields: ['title', 'status', 'priority'],

    statusValues: ['todo', 'doing', 'done'],

    priorityValues: ['P0', 'P1', 'P2', 'P3'],

    wipLimits: {
      todo: 10,
      doing: 5,
      done: 999,
    },

    _starter_tasks: [
      {
        title: 'Set up development environment',
        status: 'todo',
        priority: 'P0',
        content: 'Install dependencies, configure IDE, set up git hooks',
      },
      {
        title: 'Create project documentation',
        status: 'doing',
        priority: 'P1',
        content: 'Add README, setup instructions, and project overview',
      },
      {
        title: 'Implement core feature',
        status: 'doing',
        priority: 'P2',
        content: 'Build the main functionality for the project',
      },
    ],
  };

  try {
    const configDir = path.dirname(configPath);
    await mkdir(configDir, { recursive: true });
    await writeFile(configPath, JSON.stringify(simpleConfig, null, 2), 'utf8');

    console.log(`✅ Created kanban configuration: ${configPath}`);
    console.log('');
    console.log('📋 Next steps:');
    console.log(`   1. Create tasks directory: mkdir -p ${simpleConfig.tasksDir}`);
    console.log(`   2. Add some task files to ${simpleConfig.tasksDir}/`);
    console.log('   3. Generate board: kanban regenerate');
    console.log('');
    console.log('💡 Example task file format:');
    console.log('---');
    console.log('title: "My Task"');
    console.log('status: "todo"');
    console.log('priority: "P1"');
    console.log('---');
    console.log('');
    console.log('Task description goes here...');

    return { created: true, path: configPath };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed to create configuration: ${message}`);
    return { created: false, reason: message };
  }
};

export { handleInit };
