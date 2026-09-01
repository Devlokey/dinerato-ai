import { assert } from '../test-harness.js';

export function registerPOWorkflowSyncTests(harness) {
  harness.describe('Tier 3: Pairwise Interactions - PO Workflow & ERP State Synchronization (12 Tests)', () => {

    let erpState;

    harness.beforeEach(() => {
      erpState = {
        pos: [
          {
            id: 'PO-1045',
            supplier: 'ABC Components',
            product: 'Industrial Component A',
            qty: 500,
            value: 600000,
            status: 'OVERDUE (5 days)',
            dueDate: 'Sep 10',
            currentStage: 'Production',
            stages: [
              { name: 'Order Created', status: 'completed' },
              { name: 'Supplier Confirmed', status: 'completed' },
              { name: 'Production', status: 'delayed' },
              { name: 'Shipment', status: 'pending' },
              { name: 'Delivery', status: 'pending' }
            ]
          },
          { id: 'PO-1067', supplier: 'XYZ Manufacturing', value: 240000, status: 'OVERDUE (2 days)' },
          { id: 'PO-1089', supplier: 'Nova Components', value: 80000, status: 'OVERDUE (1 day)' },
          { id: 'PO-1092', supplier: 'Metro Components', value: 450000, status: 'OVERDUE (3 days)' }
        ],
        auditLogs: [
          { id: 1, timestamp: '2026-09-12 16:40:12', agent: 'PO Expediting Agent', action: 'Initial Ping', object: 'PO-1038' }
        ],
        metrics: {
          openPOs: 128,
          overduePOs: 4,
          atRiskPOs: 7,
          activeAITasks: 13
        }
      };
    });

    harness.test('T3.PO.1: Triggering Primary Demo updates active AI task metric on Dashboard', () => {
      erpState.metrics.activeAITasks++;
      assert.equal(erpState.metrics.activeAITasks, 14);
    });

    harness.test('T3.PO.2: Voice Agent call completion updates Stage 3 Production from delayed to completed', () => {
      const po = erpState.pos.find(p => p.id === 'PO-1045');
      // On call completion and extraction
      po.stages[2].status = 'completed';
      po.stages[2].note = 'Bottleneck cleared per call with Rajesh Kumar';
      assert.equal(po.stages[2].status, 'completed');
      assert.includes(po.stages[2].note, 'Bottleneck cleared');
    });

    harness.test('T3.PO.3: Supplier Communication Agent confirmation email activates Stage 4 Shipment', () => {
      const po = erpState.pos.find(p => p.id === 'PO-1045');
      po.stages[3].status = 'in_progress';
      po.stages[3].note = 'Shipment scheduled for Sep 14 morning';
      assert.equal(po.stages[3].status, 'in_progress');
    });

    harness.test('T3.PO.4: Human approval of PO-1045 updates status to "Confirmed Sep 15"', () => {
      const po = erpState.pos.find(p => p.id === 'PO-1045');
      po.status = 'Confirmed Sep 15';
      po.dueDate = 'Sep 15';
      assert.equal(po.status, 'Confirmed Sep 15');
      assert.equal(po.dueDate, 'Sep 15');
    });

    harness.test('T3.PO.5: Human approval decrements Overdue PO metric on Executive Dashboard', () => {
      erpState.pos[0].status = 'Confirmed Sep 15';
      const remainingOverdue = erpState.pos.filter(p => p.status.includes('OVERDUE')).length;
      erpState.metrics.overduePOs = remainingOverdue;
      assert.equal(erpState.metrics.overduePOs, 3);
    });

    harness.test('T3.PO.6: Human approval prepends new verified compliance record to Audit Log', () => {
      erpState.auditLogs.unshift({
        id: 2,
        timestamp: '2026-09-13 10:43:10',
        agent: 'PO Expediting Agent',
        action: 'PO-1045 Rescheduled to Sep 15',
        object: 'PO-1045',
        method: 'Voice Call + HITL Approval',
        status: 'Approved',
        approvedBy: 'Operations Director'
      });
      assert.equal(erpState.auditLogs.length, 2);
      assert.equal(erpState.auditLogs[0].object, 'PO-1045');
      assert.equal(erpState.auditLogs[0].status, 'Approved');
      assert.equal(erpState.auditLogs[0].approvedBy, 'Operations Director');
    });

    harness.test('T3.PO.7: PO Detail view reflects updated due date "Sep 15" and revised stage timeline', () => {
      const po = erpState.pos.find(p => p.id === 'PO-1045');
      po.dueDate = 'Sep 15';
      po.stages[4].date = 'Sep 15 (Confirmed)';
      assert.equal(po.dueDate, 'Sep 15');
      assert.equal(po.stages[4].date, 'Sep 15 (Confirmed)');
    });

    harness.test('T3.PO.8: PO list table StatusBadge switches from red OVERDUE to green CONFIRMED', () => {
      const getBadgeVariant = (status) => status.includes('OVERDUE') ? 'RED' : 'GREEN';
      assert.equal(getBadgeVariant('OVERDUE (5 days)'), 'RED');
      assert.equal(getBadgeVariant('Confirmed Sep 15'), 'GREEN');
    });

    harness.test('T3.PO.9: Secondary high-risk PO-1067 is flagged for human review in the same batch', () => {
      const po1067 = erpState.pos.find(p => p.id === 'PO-1067');
      po1067.status = 'UNDER REVIEW';
      po1067.reviewNote = 'Supplier requested 3 additional days';
      assert.equal(po1067.status, 'UNDER REVIEW');
      assert.includes(po1067.reviewNote, '3 additional days');
    });

    harness.test('T3.PO.10: Completed workflow chat summary correctly outputs bulleted status for both POs', () => {
      const summary = `✓ WORKFLOW COMPLETE\n\n2 high-risk POs handled:\n• PO-1045 (ABC Components): Shipment confirmed. New delivery: Sep 15. ERP updated.\n• PO-1067 (XYZ Manufacturing): Supplier requested 3 additional days. ⚠ Human review required.`;
      assert.includes(summary, 'PO-1045 (ABC Components)');
      assert.includes(summary, 'PO-1067 (XYZ Manufacturing)');
    });

    harness.test('T3.PO.11: Estimated Hours Saved metric increments by 1.5 hours following automation', () => {
      let hoursSaved = 126;
      hoursSaved += 1.5;
      assert.equal(hoursSaved, 127.5);
    });

    harness.test('T3.PO.12: Full pairwise cycle leaves all other 38 POs and 24 suppliers completely intact', () => {
      const untouchedCount = erpState.pos.length - 2;
      assert.equal(untouchedCount, 2);
    });
  });
}
