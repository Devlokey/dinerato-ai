// Run all test suites
console.log('\n======================================================');
console.log('       EMPIRICAL CHALLENGER VALIDATION HARNESS        ');
console.log('======================================================\n');

const results = await harness.runAll('Adversarial-Challenger');

for (const suite of results.suites) {
  console.log(`\n--- ${suite.suiteName} (${suite.passed}/${suite.passed + suite.failed}) ---`);
  for (const t of suite.results) {
    if (t.passed) {
      console.log(`  ✓ ${t.name} (${t.duration}ms)`);
    } else {
      console.error(`  ❌ ${t.name}: ${t.error}`);
    }
  }
}

console.log('\n------------------------------------------------------');
console.log(`Summary: ${results.passed}/${results.total} Passed (${results.failed} Failed) in ${results.duration}ms`);
console.log('------------------------------------------------------\n');

if (results.failed > 0) {
  console.error(`❌ ${results.failed} TESTS FAILED!`);
  process.exit(1);
} else {
  console.log('✔ ALL EMPIRICAL CHALLENGES PASSED (100% PASS RATE).');
}
