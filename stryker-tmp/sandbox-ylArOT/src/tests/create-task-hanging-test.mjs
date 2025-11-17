#!/usr/bin/env node
// @ts-nocheck

/**
 * E2E Test to Diagnose pnpm kanban create Hanging Issue
 *
 * This test creates an isolated environment to reproduce the hanging bug
 * and identify exactly where the process gets stuck.
 */

import { execSync, spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const TEST_TIMEOUT = 30000; // 30 seconds
const LOG_FILE = 'test-kanban-create-hanging.log';
const TEST_DIR = 'test-kanban-hanging-temp';

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  const coloredMessage = `${colors[color]}${message}${colors.reset}`;
  const logMessage = `[${timestamp}] ${message}\n`;

  console.log(coloredMessage);

  // Write to log file
  writeFile(LOG_FILE, logMessage, { flag: 'a' }).catch(console.error);
}

async function setupTestEnvironment() {
  log('Setting up test environment...', 'cyan');

  try {
    // Clean up any existing test directory
    await rm(TEST_DIR, { recursive: true, force: true }).catch(() => {});

    // Create test directory structure
    await mkdir(TEST_DIR, { recursive: true });
    await mkdir(path.join(TEST_DIR, 'docs', 'agile', 'tasks'), { recursive: true });
    await mkdir(path.join(TEST_DIR, 'docs', 'agile', 'boards'), { recursive: true });

    // Create minimal kanban config
    const config = {
      _comment: 'Test configuration for hanging bug reproduction',
      tasksDir: 'docs/agile/tasks',
      indexFile: '',
      boardFile: 'docs/agile/boards/generated.md',
      cachePath: 'docs/agile/boards/.cache',
      exts: ['.md'],
      requiredFields: ['title', 'status', 'priority'],
      statusValues: ['incoming', 'ready', 'todo', 'in_progress', 'review', 'done'],
      priorityValues: ['P0', 'P1', 'P2', 'P3'],
      wipLimits: {
        incoming: 999,
        ready: 10,
        todo: 5,
        in_progress: 3,
        review: 3,
        done: 999,
      },
    };

    await writeFile(path.join(TEST_DIR, 'promethean.kanban.json'), JSON.stringify(config, null, 2));

    // Create minimal board file
    const boardContent = `# Kanban Board

## Incoming (0/999)

## Ready (0/10)

## Todo (0/5)

## In Progress (0/3)

## Review (0/3)

## Done (0/999)
`;

    await writeFile(path.join(TEST_DIR, 'docs', 'agile', 'boards', 'generated.md'), boardContent);

    // Initialize git repository
    execSync('git init', { cwd: TEST_DIR });
    execSync('git config user.name "Test User"', { cwd: TEST_DIR });
    execSync('git config user.email "test@example.com"', { cwd: TEST_DIR });
    execSync('git add .', { cwd: TEST_DIR });
    execSync('git commit -m "Initial test setup"', { cwd: TEST_DIR });

    log('Test environment setup complete', 'green');
    return true;
  } catch (error) {
    log(`Failed to setup test environment: ${error.message}`, 'red');
    return false;
  }
}

async function runKanbanCreateWithTimeout(taskTitle) {
  return new Promise((resolve, reject) => {
    log(`Starting: pnpm kanban create "${taskTitle}"`, 'blue');

    const startTime = Date.now();
    let lastOutput = Date.now();

    const child = spawn('pnpm', ['kanban', 'create', taskTitle], {
      cwd: TEST_DIR,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, NODE_ENV: 'test' },
    });

    let stdout = '';
    let stderr = '';
    let monitoringInterval;

    // Monitor for hanging
    monitoringInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeSinceLastOutput = Date.now() - lastOutput;

      if (elapsed > TEST_TIMEOUT) {
        log(`❌ TEST TIMEOUT after ${elapsed}ms`, 'red');
        log(`Time since last output: ${timeSinceLastOutput}ms`, 'red');
        log('Process appears to be hanging!', 'red');

        child.kill('SIGTERM');
        clearInterval(monitoringInterval);

        resolve({
          success: false,
          timeout: true,
          elapsed,
          stdout,
          stderr,
          lastOutput: timeSinceLastOutput,
        });
        return;
      }

      if (timeSinceLastOutput > 5000) {
        log(`⚠️  No output for ${timeSinceLastOutput}ms - potential hang detected`, 'yellow');
      }

      log(`⏱️  Elapsed: ${elapsed}ms | Last output: ${timeSinceLastOutput}ms ago`, 'magenta');
    }, 2000);

    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      lastOutput = Date.now();
      log(`STDOUT: ${output.trim()}`, 'cyan');
    });

    child.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      lastOutput = Date.now();
      log(`STDERR: ${output.trim()}`, 'yellow');
    });

    child.on('close', (code) => {
      clearInterval(monitoringInterval);
      const elapsed = Date.now() - startTime;

      if (code === 0) {
        log(`✅ Process completed successfully in ${elapsed}ms`, 'green');
        resolve({
          success: true,
          code,
          elapsed,
          stdout,
          stderr,
        });
      } else {
        log(`❌ Process failed with code ${code} after ${elapsed}ms`, 'red');
        resolve({
          success: false,
          code,
          elapsed,
          stdout,
          stderr,
        });
      }
    });

    child.on('error', (error) => {
      clearInterval(monitoringInterval);
      log(`❌ Process error: ${error.message}`, 'red');
      reject(error);
    });
  });
}

async function analyzeResults(results) {
  log('\n=== ANALYSIS ===', 'blue');

  if (results.timeout) {
    log('🔍 HANGING DETECTED!', 'red');
    log(`Process hung after ${results.elapsed}ms`, 'red');
    log(`Time since last output: ${results.lastOutput}ms`, 'red');

    // Analyze where it might have hung based on output
    if (results.stdout.includes('Reading tasks folder')) {
      log('📍 Likely hanging in: readTasksFolder operation', 'yellow');
    } else if (results.stdout.includes('Duplicate task detected')) {
      log('📍 Likely hanging in: Duplicate task detection logic', 'yellow');
    } else if (results.stdout.includes('Git tracking')) {
      log('📍 Likely hanging in: Git tracking operations', 'yellow');
    } else if (results.stdout.includes('persistBoardAndTasks')) {
      log('📍 Likely hanging in: Board/task persistence', 'yellow');
    } else if (results.stdout.length === 0) {
      log('📍 Likely hanging in: Early initialization or argument parsing', 'yellow');
    } else {
      log('📍 Unknown hanging location - need more instrumentation', 'yellow');
    }
  } else if (results.success) {
    log('✅ No hanging detected - command completed successfully', 'green');
    log(`Total execution time: ${results.elapsed}ms`, 'green');
  } else {
    log('❌ Command failed but did not hang', 'red');
    log(`Exit code: ${results.code}`, 'red');
    log(`Execution time: ${results.elapsed}ms`, 'red');
  }

  // Log full output for debugging
  log('\n=== FULL STDOUT ===', 'blue');
  console.log(results.stdout || '(no stdout)');

  log('\n=== FULL STDERR ===', 'blue');
  console.log(results.stderr || '(no stderr)');
}

async function cleanup() {
  try {
    await rm(TEST_DIR, { recursive: true, force: true });
    log('Test environment cleaned up', 'green');
  } catch (error) {
    log(`Cleanup failed: ${error.message}`, 'yellow');
  }
}

async function main() {
  log('🔍 Starting Kanban Create Hanging Bug Diagnosis', 'blue');
  log(`Test timeout: ${TEST_TIMEOUT}ms`, 'blue');
  log(`Log file: ${LOG_FILE}`, 'blue');

  try {
    // Setup test environment
    const setupSuccess = await setupTestEnvironment();
    if (!setupSuccess) {
      process.exit(1);
    }

    // Test scenarios
    const testCases = [
      'Test Task Basic',
      'Test Task With Special Characters !@#$%',
      'Test Task With Very Long Name That Might Cause Issues In File System Operations Or Slug Generation Logic',
    ];

    for (const testCase of testCases) {
      log(`\n🧪 Testing: ${testCase}`, 'blue');
      log('='.repeat(50), 'blue');

      const results = await runKanbanCreateWithTimeout(testCase);
      await analyzeResults(results);

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    log(`❌ Test execution failed: ${error.message}`, 'red');
    log(error.stack, 'red');
  } finally {
    await cleanup();
    log('\n🏁 Test execution completed', 'blue');
    log(`📄 Full log available in: ${LOG_FILE}`, 'blue');
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  log('\n🛑 Test interrupted by user', 'yellow');
  cleanup().then(() => process.exit(1));
});

main().catch((error) => {
  log(`❌ Fatal error: ${error.message}`, 'red');
  cleanup().then(() => process.exit(1));
});
