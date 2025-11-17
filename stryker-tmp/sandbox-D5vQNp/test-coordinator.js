#!/usr/bin/env node
// @ts-nocheck

// Test script for kanban healing coordinator
import { createKanbanHealingCoordinator } from './dist/lib/healing/kanban-healing-coordinator.js';

async function testCoordinator() {
  try {
    console.log('🏥 Testing kanban healing coordinator...');

    const coordinator = createKanbanHealingCoordinator({
      boardPath: '/tmp/test-board.md',
      tasksDir: '/tmp/test-tasks',
      repoRoot: '/home/err/devel/promethean',
      enableMCPBridge: true,
      enableAgentIntegration: true,
      fallbackToNonGit: true,
      loggingLevel: 'info',
    });

    console.log('✅ Coordinator created successfully!');
    console.log('🔍 Testing integration status...');

    const status = await coordinator.getIntegrationStatus();
    console.log('📊 Integration status:');
    console.log(`  Kanban: ${status.kanban.available ? '✅' : '❌'}`);
    console.log(`  MCP: ${status.mcp.available ? '✅' : '❌'}`);
    console.log(`  Agents: ${status.agents.available ? '✅' : '❌'}`);
    console.log(`  Git: ${status.git.available ? '✅' : '❌'}`);

    console.log('🎯 Testing recommendations...');
    const recommendations = await coordinator.getComprehensiveRecommendations(
      'Test healing operation',
      { dryRun: true },
    );

    console.log('✅ Recommendations generated successfully!');
    console.log(`📚 Recommendations: ${recommendations.recommendations.length}`);
    console.log(`⚠️  Critical issues: ${recommendations.criticalIssues.length}`);
    console.log(`🔗 Sources: ${recommendations.sources.join(', ')}`);

    console.log('');
    console.log('🎉 Coordinator test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testCoordinator();
