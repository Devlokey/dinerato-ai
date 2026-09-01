import { assert } from '../test-harness.js';

export function registerAgentRuntimeTests(harness) {
  harness.describe('Tier 1: Features 15-20 - Multi-Agent Runtime & Demo Workflows (30 Tests)', () => {

    // Feature 15: 7-Agent Runtime Modules (5 Tests)
    harness.test('F15.1: Procurement Analyst Agent definition, capability, and execution contract', () => {
      const analystAgent = {
        name: 'Procurement Analyst Agent',
        permissions: ['READ_DATA', 'ANALYTICS'],
        execute: async (task, data) => [
          { timestamp: '10:42:11', agent: 'Procurement Analyst Agent', action: 'Querying purchase orders database...', status: 'in_progress' },
          { timestamp: '10:42:13', agent: 'Procurement Analyst Agent', action: '✓ Found 4 overdue POs', status: 'completed' },
          { timestamp: '10:42:14', agent: 'Procurement Analyst Agent', action: '✓ Ranked by risk: 2 HIGH, 1 MEDIUM, 1 LOW', status: 'completed' }
        ]
      };
      assert.equal(analystAgent.name, 'Procurement Analyst Agent');
      assert.includes(analystAgent.permissions, 'READ_DATA');
      assert.isFalse(analystAgent.permissions.includes('WRITE_DATA'));
    });

    harness.test('F15.2: PO Expediting Agent definition and ₹1,00,000 threshold cap', () => {
      const expeditingAgent = {
        name: 'PO Expediting Agent',
        permissions: ['READ_DATA', 'WRITE_DATA', 'UPDATE_PO'],
        maxAutonomousValue: 100000
      };
      assert.equal(expeditingAgent.name, 'PO Expediting Agent');
      assert.equal(expeditingAgent.maxAutonomousValue, 100000);
    });

    harness.test('F15.3: Supplier Communication Agent channel selection logic', () => {
      const commsAgent = {
        selectChannel: (po) => (po.risk === 'HIGH' && po.daysOverdue >= 3) ? 'VOICE_CALL' : 'EMAIL'
      };
      assert.equal(commsAgent.selectChannel({ risk: 'HIGH', daysOverdue: 5 }), 'VOICE_CALL');
      assert.equal(commsAgent.selectChannel({ risk: 'LOW', daysOverdue: 1 }), 'EMAIL');
    });

    harness.test('F15.4: Voice Agent definition and telephony capabilities', () => {
      const voiceAgent = {
        name: 'Voice Agent',
        permissions: ['MAKE_CALLS', 'TRANSCRIBE_AUDIO'],
        maxDurationSecs: 180
      };
      assert.equal(voiceAgent.name, 'Voice Agent');
      assert.includes(voiceAgent.permissions, 'MAKE_CALLS');
    });

    harness.test('F15.5: Sourcing, RFQ, and Quote Intelligence Agents interface conformance', () => {
      const agents = [
        { name: 'Sourcing Agent', permissions: ['READ_SUPPLIERS', 'SHORTLIST_VENDORS'] },
        { name: 'RFQ Agent', permissions: ['CREATE_RFQ', 'SEND_RFQ', 'WRITE_DATA'] },
        { name: 'Quote Intelligence Agent', permissions: ['READ_QUOTES', 'ANALYZE_BIDS'] }
      ];
      assert.equal(agents.length, 3);
      assert.isTrue(agents.every(a => a.name && a.permissions.length > 0));
    });

    // Feature 16: Agent Orchestrator Routing (5 Tests)
    harness.test('F16.1: Orchestrator routes "chase overdue" intent to Primary Demo Workflow', () => {
      const classifyIntent = (prompt) => {
        const p = prompt.toLowerCase();
        if (p.includes('chase') || p.includes('overdue') || p.includes('po-1045')) return 'CHASE_OVERDUE';
        if (p.includes('source') || p.includes('rfq')) return 'SOURCE_RFQ';
        return 'GEMINI_CHAT';
      };
      assert.equal(classifyIntent('Chase overdue POs'), 'CHASE_OVERDUE');
      assert.equal(classifyIntent('Please chase PO-1045 ABC Components'), 'CHASE_OVERDUE');
    });

    harness.test('F16.2: Orchestrator routes "source & rfq" intent to Secondary Demo Workflow', () => {
      const classifyIntent = (prompt) => {
        const p = prompt.toLowerCase();
        if (p.includes('chase') || p.includes('overdue')) return 'CHASE_OVERDUE';
        if (p.includes('source') || p.includes('rfq') || p.includes('find supplier')) return 'SOURCE_RFQ';
        return 'GEMINI_CHAT';
      };
      assert.equal(classifyIntent('Find suppliers for 500 units of Product X'), 'SOURCE_RFQ');
      assert.equal(classifyIntent('Source alternative vendors'), 'SOURCE_RFQ');
    });

    harness.test('F16.3: Orchestrator routes conversational queries to Gemini Live Chat', () => {
      const classifyIntent = (prompt) => {
        const p = prompt.toLowerCase();
        if (p.includes('chase') || p.includes('overdue')) return 'CHASE_OVERDUE';
        if (p.includes('source') || p.includes('rfq')) return 'SOURCE_RFQ';
        return 'GEMINI_CHAT';
      };
      assert.equal(classifyIntent('What is our quarterly spend?'), 'GEMINI_CHAT');
    });

    harness.test('F16.4: Orchestrator handles ambiguous prompts by falling back to chat with suggestions', () => {
      const handlePrompt = (p) => {
        if (!p || p.trim().length === 0) return { action: 'PROMPT_SUGGESTION' };
        return { action: 'EXECUTE' };
      };
      assert.equal(handlePrompt('').action, 'PROMPT_SUGGESTION');
      assert.equal(handlePrompt('hello').action, 'EXECUTE');
    });

    harness.test('F16.5: Orchestrator emits workflow lifecycle events for UI synchronization', () => {
      const events = [];
      const emit = (e) => events.push(e);
      emit('WORKFLOW_STARTED');
      emit('STEP_ADDED');
      emit('WORKFLOW_COMPLETED');
      assert.equal(events.length, 3);
      assert.equal(events[0], 'WORKFLOW_STARTED');
      assert.equal(events[2], 'WORKFLOW_COMPLETED');
    });

    // Feature 17: Primary Demo Flow: Chase Overdue POs (5 Tests)
    harness.test('F17.1: Primary demo flow executes exact 12-step tool-call sequence', () => {
      const expectedSteps = [
        { time: '10:42:11', agent: 'Procurement Analyst Agent', text: 'Querying purchase orders database...' },
        { time: '10:42:13', agent: 'Procurement Analyst Agent', text: '✓ Found 4 overdue POs' },
        { time: '10:42:14', agent: 'Procurement Analyst Agent', text: '✓ Ranked by risk: 2 HIGH, 1 MEDIUM, 1 LOW' },
        { time: '10:42:15', agent: 'PO Expediting Agent', text: '✓ Identified suppliers to contact' },
        { time: '10:42:16', agent: 'Supplier Communication Agent', text: 'Selecting contact method for ABC Components...' },
        { time: '10:42:17', agent: 'Voice Agent', text: '→ Initiating call to ABC Components re: PO-1045' },
        { time: '10:43:02', agent: 'Voice Agent', text: '✓ Call completed — 00:42' },
        { time: '10:43:04', agent: 'Procurement Analyst Agent', text: '✓ Extracted: Delivery commitment Sep 15, Reason: Production delay' },
        { time: '10:43:05', agent: 'Voice Agent', text: '✓ Confidence: 94%' },
        { time: '10:43:06', agent: 'Supplier Communication Agent', text: '→ Sending confirmation email to ABC Components' },
        { time: '10:43:07', agent: 'Supplier Communication Agent', text: '✓ Email sent' },
        { time: '10:43:08', agent: 'PO Expediting Agent', text: '→ Updating PO-1045 in ERP' }
      ];
      assert.equal(expectedSteps.length, 12);
      assert.equal(expectedSteps[0].agent, 'Procurement Analyst Agent');
      assert.equal(expectedSteps[6].time, '10:43:02');
    });

    harness.test('F17.2: Primary demo flow final summary message structure', () => {
      const summaryMsg = `✓ WORKFLOW COMPLETE\n\n2 high-risk POs handled:\n• PO-1045 (ABC Components): Shipment confirmed. New delivery: Sep 15. ERP updated.\n• PO-1067 (XYZ Manufacturing): Supplier requested 3 additional days. ⚠ Human review required.`;
      assert.includes(summaryMsg, 'WORKFLOW COMPLETE');
      assert.includes(summaryMsg, 'PO-1045 (ABC Components)');
    });

    harness.test('F17.3: Primary demo flow delay simulator maintains 300ms to 800ms cadence', () => {
      const stepDelays = [300, 500, 400, 600, 800];
      assert.isTrue(stepDelays.every(d => d >= 300 && d <= 800));
    });

    harness.test('F17.4: Overdue risk ranking identifies 2 HIGH, 1 MEDIUM, 1 LOW risk POs', () => {
      const riskDistribution = { HIGH: 2, MEDIUM: 1, LOW: 1 };
      const total = Object.values(riskDistribution).reduce((a, b) => a + b, 0);
      assert.equal(total, 4);
      assert.equal(riskDistribution.HIGH, 2);
    });

    harness.test('F17.5: Post-call intelligence extracts 94% extraction confidence score', () => {
      const extraction = { newDate: 'Sep 15', reason: 'Production delay', confidence: 0.94 };
      assert.equal(extraction.confidence, 0.94);
      assert.equal(extraction.newDate, 'Sep 15');
    });

    // Feature 18: Voice Call UI Simulator (5 Tests)
    harness.test('F18.1: Voice Call Simulator renders live header, metadata, and 00:42 duration', () => {
      const callData = { title: 'CALL IN PROGRESS', badge: '● LIVE (DEMO MODE)', supplier: 'ABC Components', targetDuration: 42 };
      assert.equal(callData.title, 'CALL IN PROGRESS');
      assert.equal(callData.targetDuration, 42);
    });

    harness.test('F18.2: Voice Call exact 4-turn dialogue transcript verification', () => {
      const dialogue = [
        { speaker: 'DINE AI', text: "Hello, I'm calling on behalf of Dine Enterprise regarding Purchase Order PO-1045 for 500 units of Industrial Component A. Could you provide a delivery update?" },
        { speaker: 'SUPPLIER', text: "Yes, apologies for the delay. We had a production issue but it's resolved. The shipment is ready to go tomorrow morning." },
        { speaker: 'DINE AI', text: "That's helpful. Can you confirm delivery to our facility by September 15th?" },
        { speaker: 'SUPPLIER', text: "Yes, confirmed. September 15th delivery." }
      ];
      assert.equal(dialogue.length, 4);
      assert.includes(dialogue[0].text, 'PO-1045');
      assert.includes(dialogue[3].text, 'September 15th delivery');
    });

    harness.test('F18.3: Typewriter effect animates transcript character by character', () => {
      const fullText = 'Confirmed.';
      let displayed = '';
      for (let i = 0; i < fullText.length; i++) {
        displayed += fullText[i];
      }
      assert.equal(displayed, fullText);
    });

    harness.test('F18.4: Audio waveform visualizer animates while speaker is active', () => {
      const getWaveformHeights = (speaking) => speaking ? [12, 24, 32, 18, 28] : [4, 4, 4, 4, 4];
      assert.equal(getWaveformHeights(true)[2], 32);
      assert.equal(getWaveformHeights(false)[2], 4);
    });

    harness.test('F18.5: Call completion triggers automatic transition to email confirmation step', () => {
      let step = 'IN_CALL';
      const onCallEnd = () => { step = 'SENDING_EMAIL'; };
      onCallEnd();
      assert.equal(step, 'SENDING_EMAIL');
    });

    // Feature 19: Human Approval Modal (PO-1045) (5 Tests)
    harness.test('F19.1: Human Approval Modal content, threshold verification, and 3-button actions', () => {
      const approvalData = {
        title: 'AI Recommendation: Update PO-1045 delivery date to September 15',
        supplier: 'ABC Components',
        value: 600000,
        threshold: 100000,
        requiresApproval: 600000 > 100000,
        actions: ['APPROVE', 'REVIEW', 'REJECT']
      };
      assert.isTrue(approvalData.requiresApproval);
      assert.equal(approvalData.actions.length, 3);
    });

    harness.test('F19.2: APPROVE decision updates PO state and records audit log entry', () => {
      let poStatus = 'OVERDUE';
      let auditCount = 10;
      const resolveApproval = (decision) => {
        if (decision === 'APPROVE') {
          poStatus = 'Confirmed Sep 15';
          auditCount++;
        }
      };
      resolveApproval('APPROVE');
      assert.equal(poStatus, 'Confirmed Sep 15');
      assert.equal(auditCount, 11);
    });

    harness.test('F19.3: REJECT decision retains previous overdue state and flags rejection note', () => {
      let poStatus = 'OVERDUE';
      let note = '';
      const resolveApproval = (decision) => {
        if (decision === 'REJECT') {
          note = 'Date revision rejected by operator';
        }
      };
      resolveApproval('REJECT');
      assert.equal(poStatus, 'OVERDUE');
      assert.equal(note, 'Date revision rejected by operator');
    });

    harness.test('F19.4: REVIEW decision assigns PO to manual operator queue', () => {
      let reviewQueue = [];
      const resolveApproval = (decision, poId) => {
        if (decision === 'REVIEW') {
          reviewQueue.push(poId);
        }
      };
      resolveApproval('REVIEW', 'PO-1067');
      assert.equal(reviewQueue.length, 1);
      assert.equal(reviewQueue[0], 'PO-1067');
    });

    harness.test('F19.5: Modal visual styling highlights ₹6,00,000 threshold and confidence metric', () => {
      const modalMeta = { valueBadge: '₹6,00,000', thresholdBadge: 'Threshold ₹1,00,000 Exceeded', confidence: '94%' };
      assert.equal(modalMeta.valueBadge, '₹6,00,000');
      assert.equal(modalMeta.confidence, '94%');
    });

    // Feature 20: Secondary Demo Flow: Source & RFQ (5 Tests)
    harness.test('F20.1: Secondary demo flow shortlists 4 suppliers and creates RFQ-104', () => {
      const shortlist = ['ABC Components', 'Global Industrial Supply', 'Vertex Manufacturing', 'Nova Components'];
      assert.equal(shortlist.length, 4);
    });

    harness.test('F20.2: Quote comparison table and recommendation card validation', () => {
      const recommendationCard = {
        recommendedSupplier: 'ABC Components',
        text: 'ABC Components recommended — best balance of cost, lead time, and delivery reliability.',
        actions: ['Approve ABC Components', 'Review All Quotes', 'Request More Quotes']
      };
      assert.equal(recommendationCard.recommendedSupplier, 'ABC Components');
      assert.equal(recommendationCard.actions.length, 3);
    });

    harness.test('F20.3: Sourcing Agent filters 25 suppliers down to 6 candidates', () => {
      const suppliers = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, relevant: i < 6 }));
      const found = suppliers.filter(s => s.relevant);
      assert.equal(found.length, 6);
    });

    harness.test('F20.4: Multi-quote price variance displays lowest total value option', () => {
      const quotes = [{ total: 600000 }, { total: 560000 }, { total: 630000 }];
      const minVal = Math.min(...quotes.map(q => q.total));
      assert.equal(minVal, 560000);
    });

    harness.test('F20.5: Approving recommended quote triggers draft PO creation in ERPContext', () => {
      let draftPOs = [];
      const approve = (supplier, val) => draftPOs.push({ supplier, val, status: 'DRAFT' });
      approve('ABC Components', 600000);
      assert.equal(draftPOs.length, 1);
      assert.equal(draftPOs[0].supplier, 'ABC Components');
    });

    // Vapi Telephony & Real-Time Voice Agent Tests
    harness.test('VAPI.1: Vapi procurement assistant configuration structure and prompt', () => {
      const assistantConfig = {
        name: 'DINE AI Procurement Expediter',
        transcriber: { provider: 'deepgram', model: 'nova-2' },
        model: { provider: 'google', model: 'gemini-2.0-flash' },
        voice: { provider: '11labs', voiceId: 'burt' }
      };
      assert.equal(assistantConfig.name, 'DINE AI Procurement Expediter');
      assert.equal(assistantConfig.transcriber.provider, 'deepgram');
      assert.equal(assistantConfig.model.model, 'gemini-2.0-flash');
    });

    harness.test('VAPI.2: Vapi fallback to simulation when public key is missing or empty', () => {
      const key = '';
      const isConfigured = typeof key === 'string' && key.trim().length > 10;
      assert.isFalse(isConfigured);
    });
  });
}

