#!/usr/bin/env node
// @ts-nocheck

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tasksDir = path.join(__dirname, '../../../docs/agile/tasks');

console.log('🚀 Fast parallel bulk commit tracking initialization...');

// Get current git hash
const currentSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();

async function processTaskFile(file) {
  const filePath = path.join(tasksDir, file);

  try {
    const content = await fs.readFile(filePath, 'utf8');

    // Skip if already has commit tracking
    if (content.includes('lastCommitSha:') || content.includes('commitHistory:')) {
      return { file, updated: false };
    }

    // Add commit tracking fields to frontmatter
    const updated = content.replace(/^(---\n.*?\n---)/ms, (frontmatter) => {
      if (frontmatter.includes('lastCommitSha:')) return frontmatter;

      // Insert before the closing ---
      return frontmatter.replace(
        /---$/,
        `lastCommitSha: "${currentSha}"\ncommitHistory: \n  - sha: "${currentSha}"\n    timestamp: "${new Date().toISOString()}"\n    action: "Bulk commit tracking initialization"\n---`,
      );
    });

    await fs.writeFile(filePath, updated);
    return { file, updated: true };
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
    return { file, updated: false, error: error.message };
  }
}

async function main() {
  try {
    const files = (await fs.readdir(tasksDir)).filter((f) => f.endsWith('.md'));
    console.log(`📁 Processing ${files.length} task files in parallel...`);

    // Process ALL files in parallel with Promise.all
    const startTime = Date.now();
    const results = await Promise.all(files.map(processTaskFile));
    const endTime = Date.now();

    const updatedCount = results.filter((r) => r.updated).length;
    const errorCount = results.filter((r) => r.error).length;

    console.log(`✅ Updated ${updatedCount} task files with commit tracking`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} files had errors`);
    }
    console.log(`⚡ Completed in ${endTime - startTime}ms (parallel processing)`);

    // Single bulk commit
    if (updatedCount > 0) {
      execSync('git add docs/agile/tasks/*.md', { stdio: 'inherit' });
      execSync(
        `git commit -m "Bulk initialize commit tracking for ${updatedCount} kanban tasks

- Add lastCommitSha and commitHistory fields  
- Eliminate orphaned task false positives
- Improve kanban auditability
- Processed in parallel with Promise.all"`,
        { stdio: 'inherit' },
      );
      console.log('✅ Committed all changes in single bulk operation');
    } else {
      console.log('ℹ️  No tasks needed updating');
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
