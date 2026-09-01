#!/usr/bin/env node

/**
 * Master E2E Test Runner for DINE AI
 * Executes all 4 Tiers of specifications and tests.
 */

import { createHarness } from './test-harness.js';
import { registerMockDataTests } from './tier1-feature-coverage/mock-data.test.js';
import { registerERPPagesTests } from './tier1-feature-coverage/erp-pages.test.js';
import { registerAgentRuntimeTests } from './tier1-feature-coverage/agent-runtime.test.js';
import { registerDineAIPanelTests } from './tier1-feature-coverage/dineai-panel.test.js';
import { registerExhibitionModeTests } from './tier1-feature-coverage/exhibition-mode.test.js';

import { registerOfflineFallbackTests } from './tier2-boundary-corner/offline-fallback.test.js';
import { registerApprovalThresholdsTests } from './tier2-boundary-corner/approval-thresholds.test.js';
import { registerSearchFiltersTests } from './tier2-boundary-corner/search-filters.test.js';
import { registerResetStateTests } from './tier2-boundary-corner/reset-state.test.js';

import { registerPOWorkflowSyncTests } from './tier3-cross-feature/po-workflow-erp-sync.test.js';
import { registerRFQToQuoteFlowTests } from './tier3-cross-feature/rfq-to-quote-flow.test.js';
import { registerContextSwitchingTests } from './tier3-cross-feature/context-switching.test.js';

import { registerExhibitionPrimaryDemoTests } from './tier4-real-world/exhibition-primary-demo.test.js';
import { registerExhibitionSecondaryDemoTests } from './tier4-real-world/exhibition-secondary-demo.test.js';
import { registerFreeExplorationJourneyTests } from './tier4-real-world/free-exploration-journey.test.js';
import { registerDemoResetResilienceTests } from './tier4-real-world/demo-reset-resilience.test.js';
import { registerGovernanceSecurityJourneyTests } from './tier4-real-world/governance-security-journey.test.js';

// ANSI styling helpers
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

async function main() {
  console.log(`\n${c.bold}${c.cyan}======================================================================${c.reset}`);
  console.log(`${c.bold}${c.cyan}               DINE AI - COMPREHENSIVE E2E TEST RUNNER               ${c.reset}`);
  console.log(`${c.bold}${c.cyan}======================================================================${c.reset}\n`);

  const startTime = Date.now();
  const summary = {
    tier1: { passed: 0, failed: 0, total: 0, duration: 0 },
    tier2: { passed: 0, failed: 0, total: 0, duration: 0 },
    tier3: { passed: 0, failed: 0, total: 0, duration: 0 },
    tier4: { passed: 0, failed: 0, total: 0, duration: 0 },
  };

  // Tier 1 Execution
  console.log(`${c.bold}${c.blue}[TIER 1] Feature Coverage & Specification Conformance${c.reset}`);
  const t1Harness = createHarness();
  registerMockDataTests(t1Harness);
  registerERPPagesTests(t1Harness);
  registerAgentRuntimeTests(t1Harness);
  registerDineAIPanelTests(t1Harness);
  registerExhibitionModeTests(t1Harness);
  const t1Res = await t1Harness.runAll('Tier 1: Feature Coverage');
  summary.tier1 = t1Res;
  printSuiteSummary('Tier 1', t1Res);

  // Tier 2 Execution
  console.log(`\n${c.bold}${c.blue}[TIER 2] Boundary Value & Corner Case Hardening${c.reset}`);
  const t2Harness = createHarness();
  registerOfflineFallbackTests(t2Harness);
  registerApprovalThresholdsTests(t2Harness);
  registerSearchFiltersTests(t2Harness);
  registerResetStateTests(t2Harness);
  const t2Res = await t2Harness.runAll('Tier 2: Boundary & Corner');
  summary.tier2 = t2Res;
  printSuiteSummary('Tier 2', t2Res);

  // Tier 3 Execution
  console.log(`\n${c.bold}${c.blue}[TIER 3] Cross-Feature Pairwise Interactions${c.reset}`);
  const t3Harness = createHarness();
  registerPOWorkflowSyncTests(t3Harness);
  registerRFQToQuoteFlowTests(t3Harness);
  registerContextSwitchingTests(t3Harness);
  const t3Res = await t3Harness.runAll('Tier 3: Pairwise');
  summary.tier3 = t3Res;
  printSuiteSummary('Tier 3', t3Res);

  // Tier 4 Execution
  console.log(`\n${c.bold}${c.blue}[TIER 4] Real-World Full User Journeys${c.reset}`);
  const t4Harness = createHarness();
  registerExhibitionPrimaryDemoTests(t4Harness);
  registerExhibitionSecondaryDemoTests(t4Harness);
  registerFreeExplorationJourneyTests(t4Harness);
  registerDemoResetResilienceTests(t4Harness);
  registerGovernanceSecurityJourneyTests(t4Harness);
  const t4Res = await t4Harness.runAll('Tier 4: Real World');
  summary.tier4 = t4Res;
  printSuiteSummary('Tier 4', t4Res);

  // Grand Summary
  const totalPassed = summary.tier1.passed + summary.tier2.passed + summary.tier3.passed + summary.tier4.passed;
  const totalFailed = summary.tier1.failed + summary.tier2.failed + summary.tier3.failed + summary.tier4.failed;
  const totalTests = totalPassed + totalFailed;
  const totalDuration = Date.now() - startTime;

  console.log(`\n${c.bold}${c.cyan}======================================================================${c.reset}`);
  console.log(`${c.bold}${c.cyan}                         FINAL TEST RESULTS                          ${c.reset}`);
  console.log(`${c.bold}${c.cyan}======================================================================${c.reset}`);
  console.log(`  Tier 1 (Feature Coverage):   ${c.green}${summary.tier1.passed} passed${c.reset}, ${summary.tier1.failed > 0 ? c.red : c.gray}${summary.tier1.failed} failed${c.reset} (${summary.tier1.total} tests) [${summary.tier1.duration}ms]`);
  console.log(`  Tier 2 (Boundary & Corner):  ${c.green}${summary.tier2.passed} passed${c.reset}, ${summary.tier2.failed > 0 ? c.red : c.gray}${summary.tier2.failed} failed${c.reset} (${summary.tier2.total} tests) [${summary.tier2.duration}ms]`);
  console.log(`  Tier 3 (Pairwise Sync):      ${c.green}${summary.tier3.passed} passed${c.reset}, ${summary.tier3.failed > 0 ? c.red : c.gray}${summary.tier3.failed} failed${c.reset} (${summary.tier3.total} tests) [${summary.tier3.duration}ms]`);
  console.log(`  Tier 4 (Real-World Journeys):${c.green}${summary.tier4.passed} passed${c.reset}, ${summary.tier4.failed > 0 ? c.red : c.gray}${summary.tier4.failed} failed${c.reset} (${summary.tier4.total} tests) [${summary.tier4.duration}ms]`);
  console.log(`${c.bold}${c.cyan}----------------------------------------------------------------------${c.reset}`);
  console.log(`  ${c.bold}TOTAL:${c.reset} ${c.bold}${totalTests} tests | ${c.green}${totalPassed} passed${c.reset} | ${totalFailed > 0 ? `${c.red}${totalFailed} failed` : `${c.green}0 failed`}${c.reset} in ${totalDuration}ms`);
  console.log(`${c.bold}${c.cyan}======================================================================${c.reset}\n`);

  if (totalFailed > 0) {
    console.error(`${c.bold}${c.red}✖ TEST SUITE FAILED with ${totalFailed} errors.${c.reset}\n`);
    process.exit(1);
  } else {
    console.log(`${c.bold}${c.green}✔ ALL TEST TIERS PASSED PERFECTLY (100% Pass Rate).${c.reset}\n`);
    process.exit(0);
  }
}

function printSuiteSummary(tierName, res) {
  for (const suite of res.suites) {
    console.log(`  ${c.bold}${suite.suiteName}${c.reset}`);
    for (const test of suite.results) {
      if (test.passed) {
        console.log(`    ${c.green}✓${c.reset} ${c.gray}${test.name}${c.reset} ${c.gray}(${test.duration}ms)${c.reset}`);
      } else {
        console.log(`    ${c.red}✖ ${test.name}${c.reset}`);
        console.log(`      ${c.red}Error: ${test.error}${c.reset}`);
        if (test.stack) {
          console.log(`      ${c.gray}${test.stack}${c.reset}`);
        }
      }
    }
  }
}

main().catch(err => {
  console.error('Fatal error running tests:', err);
  process.exit(1);
});
