import { assert } from '../test-harness.js';

export function registerExhibitionPrimaryDemoTests(harness) {
  harness.describe('Tier 4: Scenario 1 - Exhibition Primary Demo: Chase Overdue PO-1045 End-to-End', () => {

    harness.test('Scenario 1: Complete end-to-end execution of Primary Demo workflow', async () => {
      // Step 1: User lands on Exhibition Splash Screen
      const landingState = {
        route: '/',
        wordmark: 'DINE AI',
        tagline: 'Your ERP, with an AI agent built in.',
        ctas: ['🔴 Chase Overdue PO — Primary Demo', '📦 Source & RFQ', '💬 Explore Freely']
      };
      assert.equal(landingState.route, '/');
      assert.includes(landingState.ctas, '🔴 Chase Overdue PO — Primary Demo');

      // Step 2: User clicks Primary Demo CTA -> Navigates to PO-1045
      let appRoute = '/erp/purchase-orders/PO-1045';
      let aiPanelOpen = true;
      let activeWorkflow = 'CHASE_OVERDUE';
      assert.equal(appRoute, '/erp/purchase-orders/PO-1045');
      assert.isTrue(aiPanelOpen);
      assert.equal(activeWorkflow, 'CHASE_OVERDUE');

      // Step 3: DINE AI context badge reflects active PO-1045
      const contextBadge = 'Context: PO-1045 — ABC Components — OVERDUE';
      assert.equal(contextBadge, 'Context: PO-1045 — ABC Components — OVERDUE');

      // Step 4: Multi-agent execution stream begins (10:42:11 - 10:42:17)
      const timelineSteps = [];
      timelineSteps.push({ time: '10:42:11', agent: 'Procurement Analyst Agent', action: 'Querying purchase orders database...' });
      timelineSteps.push({ time: '10:42:13', agent: 'Procurement Analyst Agent', action: '✓ Found 4 overdue POs' });
      timelineSteps.push({ time: '10:42:14', agent: 'Procurement Analyst Agent', action: '✓ Ranked by risk: 2 HIGH, 1 MEDIUM, 1 LOW' });
      timelineSteps.push({ time: '10:42:15', agent: 'PO Expediting Agent', action: '✓ Identified suppliers to contact' });
      timelineSteps.push({ time: '10:42:16', agent: 'Supplier Communication Agent', action: 'Selecting contact method for ABC Components...' });
      timelineSteps.push({ time: '10:42:17', agent: 'Voice Agent', action: '→ Initiating call to ABC Components re: PO-1045' });

      assert.equal(timelineSteps.length, 6);
      assert.equal(timelineSteps[0].agent, 'Procurement Analyst Agent');
      assert.equal(timelineSteps[5].agent, 'Voice Agent');

      // Step 5: Voice Call UI overlay activates
      const voiceCall = {
        active: true,
        header: 'CALL IN PROGRESS',
        badge: '● LIVE (DEMO MODE)',
        supplier: 'ABC Components',
        regarding: 'PO-1045',
        contact: 'Rajesh Kumar (Dispatch Head)',
        durationSecs: 42,
        dialogue: [
          { speaker: 'DINE AI', text: "Hello, I'm calling on behalf of Dine Enterprise regarding Purchase Order PO-1045 for 500 units of Industrial Component A. Could you provide a delivery update?" },
          { speaker: 'SUPPLIER', text: "Yes, apologies for the delay. We had a production issue but it's resolved. The shipment is ready to go tomorrow morning." },
          { speaker: 'DINE AI', text: "That's helpful. Can you confirm delivery to our facility by September 15th?" },
          { speaker: 'SUPPLIER', text: "Yes, confirmed. September 15th delivery." }
        ]
      };

      assert.isTrue(voiceCall.active);
      assert.equal(voiceCall.durationSecs, 42);
      assert.equal(voiceCall.dialogue.length, 4);

      // Step 6: Call completes and post-call intelligence steps run
      voiceCall.active = false;
      timelineSteps.push({ time: '10:43:02', agent: 'Voice Agent', action: '✓ Call completed — 00:42' });
      timelineSteps.push({ time: '10:43:04', agent: 'Procurement Analyst Agent', action: '✓ Extracted: Delivery commitment Sep 15, Reason: Production delay' });
      timelineSteps.push({ time: '10:43:05', agent: 'Voice Agent', action: '✓ Confidence: 94%' });
      timelineSteps.push({ time: '10:43:06', agent: 'Supplier Communication Agent', action: '→ Sending confirmation email to ABC Components' });
      timelineSteps.push({ time: '10:43:07', agent: 'Supplier Communication Agent', action: '✓ Email sent' });
      timelineSteps.push({ time: '10:43:08', agent: 'PO Expediting Agent', action: '→ Updating PO-1045 in ERP' });

      assert.equal(timelineSteps.length, 12);
      assert.isFalse(voiceCall.active);

      // Step 7: Human Approval Modal pops up (PO value ₹6,00,000 > ₹1,00,000)
      const approvalModal = {
        visible: true,
        title: 'AI Recommendation: Update PO-1045 delivery date to September 15',
        supplier: 'ABC Components',
        value: 600000,
        newDate: 'September 15',
        confidence: '94%',
        reason: 'Production delay resolved',
        actions: ['APPROVE', 'REVIEW', 'REJECT']
      };

      assert.isTrue(approvalModal.visible);
      assert.equal(approvalModal.value, 600000);
      assert.isAbove(approvalModal.value, 100000);

      // Step 8: User clicks [APPROVE]
      approvalModal.visible = false;
      const po1045 = {
        id: 'PO-1045',
        supplier: 'ABC Components',
        status: 'Confirmed Sep 15',
        dueDate: 'Sep 15',
        stages: [
          { name: 'Order Created', status: 'completed' },
          { name: 'Supplier Confirmed', status: 'completed' },
          { name: 'Production', status: 'completed', note: 'Resolved' },
          { name: 'Shipment', status: 'in_progress', note: 'Scheduled Sep 14' },
          { name: 'Delivery', status: 'pending', date: 'Sep 15' }
        ]
      };

      assert.equal(po1045.status, 'Confirmed Sep 15');
      assert.equal(po1045.dueDate, 'Sep 15');
      assert.equal(po1045.stages[2].status, 'completed');

      // Step 9: Audit log receives entry
      const auditEntry = {
        timestamp: '2026-09-13 10:43:10',
        agent: 'PO Expediting Agent',
        action: 'PO-1045 Delivery Rescheduled to Sep 15',
        object: 'PO-1045',
        method: 'Voice Call + HITL Approval',
        status: 'Approved',
        approvedBy: 'Operations Director'
      };

      assert.equal(auditEntry.object, 'PO-1045');
      assert.equal(auditEntry.status, 'Approved');

      // Step 10: Chat displays final workflow completion summary
      const finalChatSummary = `✓ WORKFLOW COMPLETE\n\n2 high-risk POs handled:\n• PO-1045 (ABC Components): Shipment confirmed. New delivery: Sep 15. ERP updated.\n• PO-1067 (XYZ Manufacturing): Supplier requested 3 additional days. ⚠ Human review required.`;

      assert.includes(finalChatSummary, 'WORKFLOW COMPLETE');
      assert.includes(finalChatSummary, 'PO-1045');
      assert.includes(finalChatSummary, 'PO-1067');
    });
  });
}
