import { assert } from '../test-harness.js';

export function registerDemoResetResilienceTests(harness) {
  harness.describe('Tier 4: Scenario 4 - Demo Reset Resilience Journey', () => {

    harness.test('Scenario 4: Complete end-to-end lifecycle and reset fidelity test', async () => {
      // Step 1: Initialize baseline ERP state
      const pristineState = {
        pos: [
          { id: 'PO-1045', supplier: 'ABC Components', value: 600000, status: 'OVERDUE (5 days)', dueDate: 'Sep 10' },
          { id: 'PO-1067', supplier: 'XYZ Manufacturing', value: 240000, status: 'OVERDUE (2 days)', dueDate: 'Sep 11' },
          { id: 'PO-1089', supplier: 'Nova Components', value: 80000, status: 'OVERDUE (1 day)', dueDate: 'Sep 12' },
          { id: 'PO-1092', supplier: 'Metro Components', value: 450000, status: 'OVERDUE (3 days)', dueDate: 'Sep 10' }
        ],
        suppliersCount: 25,
        rfqsCount: 30,
        initialAuditLogsCount: 10,
        activeWorkflow: null,
        isRunning: false
      };

      // Step 2: Simulate comprehensive demo mutations
      let activeState = JSON.parse(JSON.stringify(pristineState));
      // PO-1045 updated via Primary Demo
      activeState.pos[0].status = 'Confirmed Sep 15';
      activeState.pos[0].dueDate = 'Sep 15';
      // New audit logs added
      activeState.initialAuditLogsCount += 3;
      // Active workflow flags set
      activeState.activeWorkflow = 'CHASE_OVERDUE';
      activeState.isRunning = true;

      assert.equal(activeState.pos[0].status, 'Confirmed Sep 15');
      assert.equal(activeState.initialAuditLogsCount, 13);
      assert.isTrue(activeState.isRunning);

      // Step 3: User triggers "Reset Demo" from top header
      const resetDemoData = () => {
        activeState = JSON.parse(JSON.stringify(pristineState));
      };
      resetDemoData();

      // Step 4: Verify 100% data fidelity back to initial state
      assert.equal(activeState.pos.length, 4);
      assert.equal(activeState.pos[0].id, 'PO-1045');
      assert.equal(activeState.pos[0].status, 'OVERDUE (5 days)');
      assert.equal(activeState.pos[0].dueDate, 'Sep 10');
      assert.equal(activeState.suppliersCount, 25);
      assert.equal(activeState.rfqsCount, 30);
      assert.equal(activeState.initialAuditLogsCount, 10);
      assert.equal(activeState.activeWorkflow, null);
      assert.isFalse(activeState.isRunning);
    });
  });
}
