#!/usr/bin/env node
// @ts-nocheck

// Simple test script for heal functionality
import { createHealCommand } from './dist/lib/heal/heal-command.js';

async function testHeal() {
  try {
    console.log('🏥 Testing heal command creation...');

    const boardFile = '/tmp/test-board.md';
    const tasksDir = '/tmp/test-tasks';

    const healCommand = createHealCommand(boardFile, tasksDir);

    console.log('✅ Heal command created successfully!');
    console.log('🔧 Testing recommendations...');

    const recommendations = await healCommand.getHealingRecommendations({
      reason: 'Test healing operation',
      dryRun: true,
      createTags: false,
      pushTags: false,
      analyzeGit: false,
      gitHistoryDepth: 10,
      searchTerms: [],
      columnFilter: [],
      labelFilter: [],
      includeTaskAnalysis: true,
      includePerformanceMetrics: true,
    });

    console.log('✅ Recommendations generated successfully!');
    console.log('📊 Recommendations:', recommendations.recommendations.length);
    console.log('⚠️  Critical issues:', recommendations.criticalIssues.length);
    console.log('📚 Related scars:', recommendations.relatedScars.length);

    console.log('');
    console.log('🎉 Heal command test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testHeal();
