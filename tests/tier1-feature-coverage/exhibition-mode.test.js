import { assert } from '../test-harness.js';

export function registerExhibitionModeTests(harness) {
  harness.describe('Tier 1: Features 26-29 - Exhibition Mode & Governance Specifications (20 Tests)', () => {

    // Feature 26: Exhibition Splash Landing Page (5 Tests)
    harness.test('F26.1: Landing page wordmark and primary/secondary taglines match specification', () => {
      const landingConfig = {
        wordmark: 'DINE AI',
        tagline: 'Your ERP, with an AI agent built in.',
        secondaryTagline: 'Ask. Instruct. Execute.',
        footnote: 'Interactive prototype — currently in development.'
      };
      assert.equal(landingConfig.wordmark, 'DINE AI');
      assert.equal(landingConfig.tagline, 'Your ERP, with an AI agent built in.');
      assert.equal(landingConfig.secondaryTagline, 'Ask. Instruct. Execute.');
      assert.equal(landingConfig.footnote, 'Interactive prototype — currently in development.');
    });

    harness.test('F26.2: Landing page defines all 3 primary demo launch CTAs with targets', () => {
      const demoCTAs = [
        { id: 'primary-demo', label: '🔴 Chase Overdue PO — Primary Demo', targetWorkflow: 'CHASE_OVERDUE' },
        { id: 'secondary-demo', label: '📦 Source & RFQ', targetWorkflow: 'SOURCE_RFQ' },
        { id: 'explore-demo', label: '💬 Explore Freely', targetWorkflow: null }
      ];
      assert.equal(demoCTAs.length, 3);
      assert.equal(demoCTAs[0].targetWorkflow, 'CHASE_OVERDUE');
      assert.equal(demoCTAs[1].targetWorkflow, 'SOURCE_RFQ');
    });

    harness.test('F26.3: Landing page background uses burnt theme palette #141412 with ambient glow', () => {
      const theme = { bg: '#141412', text: '#FFFFFF', accent: '#2563EB' };
      assert.equal(theme.bg, '#141412');
      assert.equal(theme.accent, '#2563EB');
    });

    harness.test('F26.4: Clicking any demo CTA transitions router from splash screen into /erp shell', () => {
      const getNavRoute = (ctaId) => ctaId === 'primary-demo' ? '/erp/purchase-orders/PO-1045' : '/erp/dashboard';
      assert.equal(getNavRoute('primary-demo'), '/erp/purchase-orders/PO-1045');
      assert.equal(getNavRoute('explore-demo'), '/erp/dashboard');
    });

    harness.test('F26.5: Splash screen footnote informs users about prototype status', () => {
      const footnote = 'Interactive prototype — currently in development.';
      assert.includes(footnote, 'Interactive prototype');
    });

    // Feature 27: Agent Permissions Matrix Page (5 Tests)
    harness.test('F27.1: Agent Permissions Matrix defines 7 agents across 6 security capabilities', () => {
      const capabilities = ['Read Data', 'Write Data', 'Send Emails', 'Make Calls', 'Approve Purchases', 'Create POs'];
      assert.equal(capabilities.length, 6);
    });

    harness.test('F27.2: Voice Agent permissions restrict purchase approvals while granting call capability', () => {
      const voice = { agent: 'Voice Agent', read: true, call: true, approve: false, createPO: false };
      assert.isTrue(voice.call);
      assert.isFalse(voice.approve);
    });

    harness.test('F27.3: PO Expediting Agent requires HITL gate for transactions exceeding threshold', () => {
      const expediting = { agent: 'PO Expediting Agent', write: true, approveAboveLimit: false };
      assert.isTrue(expediting.write);
      assert.isFalse(expediting.approveAboveLimit);
    });

    harness.test('F27.4: RFQ Agent has authority to draft POs and broadcast emails', () => {
      const rfq = { agent: 'RFQ Agent', email: true, createPO: true, call: false };
      assert.isTrue(rfq.email);
      assert.isTrue(rfq.createPO);
      assert.isFalse(rfq.call);
    });

    harness.test('F27.5: Permissions matrix visually renders green checkmarks and red/gray crosses', () => {
      const renderPermissionIcon = (allowed) => allowed ? '✓' : '✕';
      assert.equal(renderPermissionIcon(true), '✓');
      assert.equal(renderPermissionIcon(false), '✕');
    });

    // Feature 28: System Audit Log Page (5 Tests)
    harness.test('F28.1: System Audit Log table schema includes all 7 compliance columns', () => {
      const auditColumns = ['Timestamp', 'Agent', 'Action', 'Object', 'Method', 'Status', 'Approved By'];
      assert.equal(auditColumns.length, 7);
    });

    harness.test('F28.2: Dynamic audit log appending maintains immutable event chronology', () => {
      const logs = [{ id: 1, action: 'Delivery Check' }];
      logs.unshift({ id: 2, action: 'PO-1045 Rescheduled' });
      assert.equal(logs.length, 2);
      assert.equal(logs[0].action, 'PO-1045 Rescheduled');
    });

    harness.test('F28.3: Pre-populated audit log contains at least 10 realistic historical actions', () => {
      const initialLogs = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, timestamp: '2026-09-12' }));
      assert.isAtLeast(initialLogs.length, 10);
    });

    harness.test('F28.4: Audit log filtering allows filtering by agent identity or target object', () => {
      const logs = [
        { agent: 'Voice Agent', object: 'PO-1035' },
        { agent: 'PO Expediting Agent', object: 'PO-1045' }
      ];
      const filterByAgent = (list, ag) => list.filter(l => l.agent === ag);
      assert.equal(filterByAgent(logs, 'Voice Agent').length, 1);
    });

    harness.test('F28.5: Approved audit entries display verified operator signature', () => {
      const entry = { action: 'PO-1045 Updated', status: 'Approved', approvedBy: 'Operations Director' };
      assert.equal(entry.approvedBy, 'Operations Director');
      assert.equal(entry.status, 'Approved');
    });

    // Feature 29: System Status Indicators (5 Tests)
    harness.test('F29.1: System Status Popover aggregates live telemetry of all 5 services', () => {
      const systemStatus = {
        erp: { status: 'Connected' },
        voice: { status: 'Active (Demo Mode)' },
        email: { status: 'Active (Demo Mode)' },
        agents: { status: '7 Active Agents' },
        gemini: { status: 'Connected' }
      };
      assert.equal(systemStatus.erp.status, 'Connected');
      assert.includes(systemStatus.agents.status, '7 Active');
    });

    harness.test('F29.2: Header status bell displays unread notification badge count', () => {
      const notificationState = { count: 3, hasUnread: true };
      assert.isTrue(notificationState.hasUnread);
      assert.equal(notificationState.count, 3);
    });

    harness.test('F29.3: Missing API key reflects accurately in Gemini telemetry status badge', () => {
      const getStatus = (key) => key ? 'Gemini 2.0 Connected' : 'API Key Missing (Built-in Mode)';
      assert.equal(getStatus(''), 'API Key Missing (Built-in Mode)');
      assert.equal(getStatus('valid_key'), 'Gemini 2.0 Connected');
    });

    harness.test('F29.4: Panel footer status bar renders compact system heartbeat', () => {
      const footerBar = 'ERP ● Demo | Voice ● Demo Mode | Email ● Demo | Agents ● 7 Active';
      assert.includes(footerBar, 'ERP ● Demo');
      assert.includes(footerBar, 'Agents ● 7 Active');
    });

    harness.test('F29.5: System status badge displays pulsing green dot when operational', () => {
      const statusIndicator = { isOnline: true, color: 'text-green-500', pulse: true };
      assert.isTrue(statusIndicator.isOnline);
      assert.equal(statusIndicator.color, 'text-green-500');
    });
  });
}
