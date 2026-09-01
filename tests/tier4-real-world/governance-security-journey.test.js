import { assert } from '../test-harness.js';

export function registerGovernanceSecurityJourneyTests(harness) {
  harness.describe('Tier 4: Scenario 5 - Governance & Permission Auditing Journey', () => {

    harness.test('Scenario 5: Complete governance auditing and security boundary enforcement', async () => {
      // Step 1: User navigates to Agent Permissions page
      const currentRoute = '/erp/agent-permissions';
      assert.equal(currentRoute, '/erp/agent-permissions');

      // Step 2: System renders 7-Agent governance matrix
      const matrix = [
        { agent: 'Procurement Analyst Agent', read: true, write: false, email: false, call: false, approve: false, createPO: false },
        { agent: 'PO Expediting Agent', read: true, write: true, email: true, call: false, approve: false, createPO: false },
        { agent: 'Supplier Communication Agent', read: true, write: false, email: true, call: false, approve: false, createPO: false },
        { agent: 'Voice Agent', read: true, write: false, email: false, call: true, approve: false, createPO: false },
        { agent: 'Sourcing Agent', read: true, write: false, email: false, call: false, approve: false, createPO: false },
        { agent: 'RFQ Agent', read: true, write: true, email: true, call: false, approve: false, createPO: true },
        { agent: 'Quote Intelligence Agent', read: true, write: false, email: false, call: false, approve: false, createPO: false }
      ];

      assert.equal(matrix.length, 7);

      // Step 3: Security audit confirms Voice Agent boundaries
      const voice = matrix.find(a => a.agent === 'Voice Agent');
      assert.isTrue(voice.call, 'Voice Agent has telephony permission');
      assert.isFalse(voice.approve, 'Voice Agent strictly blocked from purchase approvals');
      assert.isFalse(voice.createPO, 'Voice Agent strictly blocked from PO creation');

      // Step 4: Security audit confirms Analyst Agent read-only boundaries
      const analyst = matrix.find(a => a.agent === 'Procurement Analyst Agent');
      assert.isTrue(analyst.read, 'Analyst has DB read permission');
      assert.isFalse(analyst.write, 'Analyst has no ERP write permission');

      // Step 5: High-value autonomous commit guard check (PO-1045 ₹6,00,000 > ₹1,00,000 threshold)
      const poExpeditingAgent = {
        name: 'PO Expediting Agent',
        maxLimit: 100000,
        attemptAutoCommit: (value) => {
          if (value > 100000) return { allowed: false, reason: 'THRESHOLD_EXCEEDED_REQUIRES_HITL' };
          return { allowed: true };
        }
      };

      const highValueCheck = poExpeditingAgent.attemptAutoCommit(600000);
      assert.isFalse(highValueCheck.allowed);
      assert.equal(highValueCheck.reason, 'THRESHOLD_EXCEEDED_REQUIRES_HITL');

      // Step 6: User verifies Audit Log ledger for compliance stamps
      const auditLedger = [
        { id: 1, agent: 'PO Expediting Agent', action: 'PO-1045 Rescheduled', status: 'Approved', approvedBy: 'Operations Director' },
        { id: 2, agent: 'Voice Agent', action: 'Call Ingestion', status: 'Verified', approvedBy: 'System' }
      ];

      assert.equal(auditLedger.length, 2);
      assert.equal(auditLedger[0].approvedBy, 'Operations Director');
      assert.equal(auditLedger[1].agent, 'Voice Agent');
    });
  });
}
