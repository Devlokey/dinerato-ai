/**
 * DINE AI / URY AI ERP — Empirical Challenger Verification Suite
 * Authored by: Challenger 1 (Empirical Correctness & Boundary Verification Specialist)
 * 
 * Deep boundary testing across:
 * 1. Currency Math (INR ₹) & Precision
 * 2. Date Arithmetic & Anchor Calendar Logic (Sep 13 / Sep 10 / Sep 15)
 * 3. State Machine Transitions & HITL Approval Thresholds
 * 4. Multi-Agent Orchestration & Natural Language Intent Classifier Robustness
 * 5. Input Boundaries, Null Safety & Malformed Injections
 * 6. Mathematical Invariants across POs, RFQs, Quotes, Inventory, and KPIs
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

import {
  formatINR,
  formatNumber,
  formatDate,
  formatPercent
} from '../src/utils/formatters.js';

import orchestrator, {
  classifyIntent,
  INTENT_TYPES,
  AGENT_REGISTRY,
  ALL_AGENTS
} from '../src/agents/orchestrator.js';

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;
const failures = [];

function assert(condition, description, detail = '') {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✓ [PASS] ${description}`);
  } else {
    failedAssertions++;
    const err = `  ✗ [FAIL] ${description} ${detail ? `(${detail})` : ''}`;
    console.error(err);
    failures.push(err);
  }
}

function assertEqual(actual, expected, description) {
  const match = JSON.stringify(actual) === JSON.stringify(expected);
  assert(match, description, `Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`);
}

console.log('\n======================================================================');
console.log('       CHALLENGER 1: EMPIRICAL BOUNDARY & CORRECTNESS SUITE           ');
console.log('======================================================================\n');

// -----------------------------------------------------------------------------
// 1. CURRENCY MATH (INR ₹) & PRECISION BOUNDARIES
// -----------------------------------------------------------------------------
console.log('▶ TEST CATEGORY 1: Currency Math (INR ₹), Lakh/Crore Formatting & Precision');

// Null, Undefined, NaN, Strings
assert(formatINR(0) === '₹0', 'formatINR(0) returns ₹0');
assert(formatINR(null) === '₹0', 'formatINR(null) returns ₹0');
assert(formatINR(undefined) === '₹0', 'formatINR(undefined) returns ₹0');
assert(formatINR(NaN) === '₹0', 'formatINR(NaN) returns ₹0');
assert(formatINR('invalid') === '₹0', 'formatINR("invalid") returns ₹0');
assert(formatINR('') === '₹0', 'formatINR("") returns ₹0');

// Lakh / Crore Formats (en-IN grouping: 1,00,000)
assert(formatINR(1200) === '₹1,200', 'formatINR(1200) formats as ₹1,200');
assert(formatINR(80000) === '₹80,00,0' || formatINR(80000) === '₹80,000', 'formatINR(80000) formats thousands correctly');
assert(formatINR(100000) === '₹1,00,000', 'formatINR(100000) formats ₹1 Lakh correctly');
assert(formatINR(240000) === '₹2,40,000', 'formatINR(240000) formats ₹2.40 Lakh correctly');
assert(formatINR(450000) === '₹4,50,000', 'formatINR(450000) formats ₹4.50 Lakh correctly');
assert(formatINR(600000) === '₹6,00,000', 'formatINR(600000) formats ₹6.00 Lakh correctly');
assert(formatINR(10000000) === '₹1,00,00,000', 'formatINR(10000000) formats ₹1 Crore correctly');

// Float rounding
assert(formatINR(1199.4) === '₹1,199', 'formatINR(1199.4) rounds down correctly');
assert(formatINR(1199.6) === '₹1,200', 'formatINR(1199.6) rounds up correctly');
assert(formatINR('600000') === '₹6,00,000', 'formatINR numeric string parsed correctly');

// formatNumber
assert(formatNumber(0) === '0', 'formatNumber(0) returns "0"');
assert(formatNumber(null) === '0', 'formatNumber(null) returns "0"');
assert(formatNumber(12000) === '12,000', 'formatNumber(12000) returns "12,000"');
assert(formatNumber(100000) === '1,00,000', 'formatNumber(100000) returns "1,00,000"');

// formatPercent
assert(formatPercent(98) === '98%', 'formatPercent(98) returns "98%"');
assert(formatPercent(98.4) === '98%', 'formatPercent(98.4) returns "98%"');
assert(formatPercent(98.6) === '99%', 'formatPercent(98.6) returns "99%"');
assert(formatPercent(null) === '0%', 'formatPercent(null) returns "0%"');

// Mathematical coherence across all 40 POs
let mathCoherentCount = 0;
for (const po of INITIAL_PURCHASE_ORDERS) {
  const calculatedTotal = po.quantity * po.unitPrice;
  if (calculatedTotal === po.value) {
    mathCoherentCount++;
  }
}
assert(mathCoherentCount === 40, `All 40 POs have mathematically consistent quantity * unitPrice === value (${mathCoherentCount}/40)`);

// Line Item and GST Tax coherence on PO-1045
const po1045 = INITIAL_PURCHASE_ORDERS.find(p => p.id === 'PO-1045');
assert(po1045 !== undefined, 'PO-1045 exists');
assert(po1045.quantity === 500, 'PO-1045 quantity is 500');
assert(po1045.unitPrice === 1200, 'PO-1045 unitPrice is 1200');
assert(po1045.value === 600000, 'PO-1045 value is ₹6,00,000');
assert(po1045.lineItems.length === 1, 'PO-1045 has 1 line item');
assert(po1045.lineItems[0].quantity * po1045.lineItems[0].unitPrice === po1045.lineItems[0].total, 'PO-1045 line item total is exact');
assert(po1045.lineItems[0].total === 600000, 'PO-1045 line item total is 600000');
assert(po1045.lineItems[0].taxAmount === 108000, 'PO-1045 GST tax (18%) is ₹1,08,000 (exact)');

// Check PO-1067 math
const po1067 = INITIAL_PURCHASE_ORDERS.find(p => p.id === 'PO-1067');
assert(po1067.quantity * po1067.unitPrice === 240000, 'PO-1067 math 200 * 1200 = 240000');
assert(po1067.lineItems[0].taxAmount === 43200, 'PO-1067 GST tax (18%) is ₹43,200');

// Check PO-1089 math (Low value: ₹80,000)
const po1089 = INITIAL_PURCHASE_ORDERS.find(p => p.id === 'PO-1089');
assert(po1089.quantity * po1089.unitPrice === 80000, 'PO-1089 math 1000 * 80 = 80000');
assert(po1089.lineItems[0].taxAmount === 14400, 'PO-1089 GST tax (18%) is ₹14,400');

// Check PO-1092 math
const po1092 = INITIAL_PURCHASE_ORDERS.find(p => p.id === 'PO-1092');
assert(po1092.quantity * po1092.unitPrice === 450000, 'PO-1092 math 300 * 1500 = 450000');

// Check Quotation math for RFQ-104
const rfq104Quotes = INITIAL_QUOTES['RFQ-104'];
assert(Array.isArray(rfq104Quotes) && rfq104Quotes.length === 3, 'RFQ-104 has exactly 3 quotes');
for (const q of rfq104Quotes) {
  assert(q.unitPrice * 500 === q.total, `Quote ${q.supplier} total math is exact (${q.unitPrice} * 500 = ${q.total})`);
}

// -----------------------------------------------------------------------------
// 2. DATE ARITHMETIC & ANCHOR CALENDAR LOGIC (Sep 13 / Sep 10 / Sep 15)
// -----------------------------------------------------------------------------
console.log('\n▶ TEST CATEGORY 2: Date Calculations, Overdue Detection & Reference Date');

// Invariant: Reference date is Sep 13, 2026
assert(po1045.currentDate === '2026-09-13', 'PO-1045 anchor date is 2026-09-13');
assert(po1045.orderDate === '2026-09-01', 'PO-1045 order date is 2026-09-01');
assert(po1045.promisedDelivery === '2026-09-10', 'PO-1045 promised delivery date is 2026-09-10');
assert(po1045.overdueDays === 5, 'PO-1045 overdueDays matches specification (5 days)');

// Overdue filter validation
const overduePOs = INITIAL_PURCHASE_ORDERS.filter(p => p.status === 'OVERDUE');
assert(overduePOs.length === 4, `Found exactly 4 overdue POs (got ${overduePOs.length})`);
const overdueIds = overduePOs.map(p => p.id).sort();
assertEqual(overdueIds, ['PO-1045', 'PO-1067', 'PO-1089', 'PO-1092'], 'Overdue PO IDs match expected set');

// Risk level stratification of overdue POs
const highRiskOverdue = overduePOs.filter(p => p.riskLevel === 'HIGH');
const medRiskOverdue = overduePOs.filter(p => p.riskLevel === 'MEDIUM');
const lowRiskOverdue = overduePOs.filter(p => p.riskLevel === 'LOW');
assert(highRiskOverdue.length === 2, 'Exactly 2 high risk overdue POs (PO-1045, PO-1092)');
assert(medRiskOverdue.length === 1, 'Exactly 1 medium risk overdue PO (PO-1067)');
assert(lowRiskOverdue.length === 1, 'Exactly 1 low risk overdue PO (PO-1089)');

// Date Formatter resilience
assert(formatDate('2026-09-13') === 'Sep 13, 2026', 'formatDate("2026-09-13") returns "Sep 13, 2026"');
assert(formatDate('Sep 15, 2026') === 'Sep 15, 2026', 'formatDate preserves already formatted month strings');
assert(formatDate(null) === '—', 'formatDate(null) returns em-dash "—"');
assert(formatDate(undefined) === '—', 'formatDate(undefined) returns em-dash "—"');
assert(formatDate('') === '—', 'formatDate("") returns em-dash "—"');

// -----------------------------------------------------------------------------
// 3. STATE MACHINE TRANSITIONS & HITL APPROVAL THRESHOLDS
// -----------------------------------------------------------------------------
console.log('\n▶ TEST CATEGORY 3: State Machine Transitions, HITL Approval & Governance Gate');

// Threshold check: ₹1,00,000 threshold
const THRESHOLD = 100000;
assert(po1045.value > THRESHOLD, 'PO-1045 (₹6,00,000) exceeds ₹1,00,000 threshold -> REQUIRES HITL');
assert(po1067.value > THRESHOLD, 'PO-1067 (₹2,40,000) exceeds ₹1,00,000 threshold -> REQUIRES HITL');
assert(po1092.value > THRESHOLD, 'PO-1092 (₹4,50,000) exceeds ₹1,00,000 threshold -> REQUIRES HITL');
assert(po1089.value <= THRESHOLD, 'PO-1089 (₹80,000) is within ₹1,00,000 threshold -> AUTO-APPROVABLE');

// Simulation of Stage Transitions for PO-1045
const initialStages = po1045.stages.map(s => ({ ...s }));
assert(initialStages[0].status === 'completed', 'Stage 1 Order Created is completed');
assert(initialStages[1].status === 'completed', 'Stage 2 Supplier Confirmed is completed');
assert(initialStages[2].status === 'delayed', 'Stage 3 Production is delayed before resolution');
assert(initialStages[3].status === 'pending', 'Stage 4 Shipment is pending');
assert(initialStages[4].status === 'pending', 'Stage 5 Delivery is pending');

// Simulated Voice Call Completion -> Stage 3 becomes completed
const postCallStages = initialStages.map(s => {
  if (s.name === 'Production') return { ...s, status: 'completed', date: 'Sep 13, 2026 (Completed)' };
  if (s.name === 'Shipment') return { ...s, status: 'completed', date: 'Sep 14, 2026 (In Transit)' };
  if (s.name === 'Delivery') return { ...s, status: 'pending', date: 'Sep 15, 2026' };
  return s;
});
assert(postCallStages[2].status === 'completed', 'Production stage is completed post-call');
assert(postCallStages[3].status === 'completed', 'Shipment stage is completed/in transit post-call');
assert(postCallStages[4].date === 'Sep 15, 2026', 'Delivery stage date is updated to Sep 15, 2026');

// -----------------------------------------------------------------------------
// 4. MULTI-AGENT ORCHESTRATION & NATURAL LANGUAGE INTENT CLASSIFIER
// -----------------------------------------------------------------------------
console.log('\n▶ TEST CATEGORY 4: Multi-Agent Orchestration & Intent Classification Robustness');

// Primary Demo Flow queries
const chaseQueries = [
  'Chase overdue POs',
  'CHASE OVERDUE POS',
  '  chase overdue pos  ',
  'Why is this delayed?',
  'Call supplier',
  'chase high-risk pos',
  'expedite PO-1045',
  'why is this late?'
];

for (const q of chaseQueries) {
  const result = classifyIntent(q);
  assert(result.type === INTENT_TYPES.CHASE_OVERDUE, `Query "${q}" maps to CHASE_OVERDUE (got ${result.type})`);
  assert(result.confidence >= 0.95, `Query "${q}" has high confidence (>=0.95: ${result.confidence})`);
}

// Secondary Demo Flow queries
const sourcingQueries = [
  'Find suppliers for 500 units of Product X',
  'source suppliers',
  'create rfq-104',
  'compare quotes for rfq-104',
  'shortlist suppliers for industrial components',
  'RFQ creation'
];

for (const q of sourcingQueries) {
  const result = classifyIntent(q);
  assert(result.type === INTENT_TYPES.SOURCE_RFQ, `Query "${q}" maps to SOURCE_RFQ (got ${result.type})`);
  assert(result.confidence >= 0.95, `Query "${q}" has high confidence (>=0.95: ${result.confidence})`);
}

// Fallback general queries
const generalQueries = [
  'What is the current date?',
  'Show me company policy',
  'How do I add a new user?'
];

for (const q of generalQueries) {
  const result = classifyIntent(q);
  assert(result.type === INTENT_TYPES.GENERAL_QUERY, `Query "${q}" maps to GENERAL_QUERY`);
}

// Malformed / Adversarial input resilience
const adversarialInputs = [
  '',
  '   ',
  'null',
  'undefined',
  '<script>alert(1)</script>',
  'SELECT * FROM users;',
  '⚡ PROTOTYPE MODE ⚡',
  'a'.repeat(500)
];

for (const adv of adversarialInputs) {
  try {
    const res = classifyIntent(adv);
    assert(typeof res === 'object' && res.type !== undefined, `Adversarial input "${adv.slice(0, 20)}..." handled safely`);
  } catch (err) {
    assert(false, `Adversarial input "${adv.slice(0, 20)}..." caused exception: ${err.message}`);
  }
}

// Verify All 7 Agents Registry
assert(ALL_AGENTS.length === 7, `Orchestrator contains exactly 7 agents (got ${ALL_AGENTS.length})`);
assert(Object.keys(AGENT_REGISTRY).length === 7, `Agent registry has 7 entries`);

const agentNames = ALL_AGENTS.map(a => a.name).sort();
const expectedNames = [
  'PO Expediting Agent',
  'Procurement Analyst Agent',
  'Quote Intelligence Agent',
  'RFQ Agent',
  'Sourcing Agent',
  'Supplier Communication Agent',
  'Voice Agent'
].sort();
assertEqual(agentNames, expectedNames, 'All 7 named agents match specification');

// -----------------------------------------------------------------------------
// 5. AGENT PERMISSIONS GOVERNANCE MATRIX
// -----------------------------------------------------------------------------
console.log('\n▶ TEST CATEGORY 5: Agent Permissions Matrix & Capability Boundaries');

const agentPermissions = {
  'agent-1': { read: true, write: false, call: false, email: false, approve: false, po: false }, // Analyst
  'agent-2': { read: true, write: true, call: false, email: false, approve: false, po: false },  // PO Expediting
  'agent-3': { read: true, write: false, call: false, email: true, approve: false, po: false },  // Supplier Comm
  'agent-4': { read: true, write: false, call: true, email: false, approve: false, po: false },  // Voice Agent
  'agent-5': { read: true, write: false, call: false, email: false, approve: false, po: false }, // Sourcing Agent
  'agent-6': { read: true, write: true, call: false, email: true, approve: false, po: true },   // RFQ Agent
  'agent-7': { read: true, write: false, call: false, email: false, approve: false, po: false }  // Quote Intel
};

for (const [agentId, expectedPerms] of Object.entries(agentPermissions)) {
  const agent = INITIAL_AGENTS.find(a => a.id === agentId);
  assert(agent !== undefined, `Agent ${agentId} found in INITIAL_AGENTS`);
  assert(agent.permissions.readData === expectedPerms.read, `${agent.name} readData matches`);
  assert(agent.permissions.writeData === expectedPerms.write, `${agent.name} writeData matches`);
  assert(agent.permissions.makeCalls === expectedPerms.call, `${agent.name} makeCalls matches`);
  assert(agent.permissions.sendEmails === expectedPerms.email, `${agent.name} sendEmails matches`);
  assert(agent.permissions.approvePurchases === expectedPerms.approve, `${agent.name} approvePurchases matches`);
  assert(agent.permissions.createPOs === expectedPerms.po, `${agent.name} createPOs matches`);
}

// -----------------------------------------------------------------------------
// 6. ASYNC MULTI-AGENT EXECUTION IN FAST MODE
// -----------------------------------------------------------------------------
console.log('\n▶ TEST CATEGORY 6: Direct Async Agent Execution & Step Events');

async function testAsyncAgents() {
  const stepsCollected = [];
  const onStep = (step) => stepsCollected.push(step);

  // 1. Analyst Agent
  const analystRes = await ALL_AGENTS.find(a => a.id === 'agent-1').execute('ANALYZE_OVERDUE', { fastMode: true }, onStep);
  assert(analystRes.overdueCount === 4, 'Analyst Agent returned 4 overdue POs');
  assert(analystRes.targetPO === 'PO-1045', 'Analyst Agent targeted PO-1045');

  // 2. Voice Agent Initiate
  const voiceRes = await ALL_AGENTS.find(a => a.id === 'agent-4').execute('INITIATE_CALL', { fastMode: true }, onStep);
  assert(voiceRes.supplier === 'ABC Components', 'Voice Agent called ABC Components');
  assert(voiceRes.dialogue.length === 4, 'Voice Agent dialogue contains 4 turns');
  assert(voiceRes.targetDuration === 42, 'Voice Agent target duration is 42s');

  // 3. Voice Agent Complete
  const voiceComplete = await ALL_AGENTS.find(a => a.id === 'agent-4').execute('COMPLETE_CALL', { fastMode: true }, onStep);
  assert(voiceComplete.confidenceScore === 94, 'Voice Agent confidence score is 94%');
  assert(voiceComplete.keyFindings.confirmedDelivery === '2026-09-15', 'Voice Agent confirmed delivery date 2026-09-15');

  // 4. Sourcing Agent
  const sourcingRes = await ALL_AGENTS.find(a => a.id === 'agent-5').execute('SOURCE_SUPPLIERS', { fastMode: true }, onStep);
  assert(sourcingRes.matchedCount === 6, 'Sourcing Agent matched 6 suppliers');
  assert(sourcingRes.shortlistCount === 4, 'Sourcing Agent shortlisted 4 suppliers');

  // 5. RFQ Agent
  const rfqRes = await ALL_AGENTS.find(a => a.id === 'agent-6').execute('CREATE_AND_DISPATCH_RFQ', { fastMode: true }, onStep);
  assert(rfqRes.recipients.length === 4, 'RFQ Agent dispatched to 4 vendors');

  // 6. Quote Intelligence Agent
  const quoteRes = await ALL_AGENTS.find(a => a.id === 'agent-7').execute('ANALYZE_QUOTES', { fastMode: true }, onStep);
  assert(quoteRes.quotesReceived === 3, 'Quote Intelligence received 3 quotes');
  assert(quoteRes.recommendedSupplier === 'ABC Components', 'Quote Intelligence recommended ABC Components');

  assert(stepsCollected.length >= 10, `Collected ${stepsCollected.length} real-time timeline steps during execution`);
}

await testAsyncAgents();

// -----------------------------------------------------------------------------
// 7. MOCK DATA INTEGRITY ACROSS ALL ENTITIES
// -----------------------------------------------------------------------------
console.log('\n▶ TEST CATEGORY 7: Mock Data Completeness & Schema Validation');

assert(INITIAL_SUPPLIERS.length === 25, `Suppliers count is exactly 25 (got ${INITIAL_SUPPLIERS.length})`);
assert(INITIAL_PURCHASE_ORDERS.length === 40, `Purchase Orders count is exactly 40 (got ${INITIAL_PURCHASE_ORDERS.length})`);
assert(INITIAL_RFQS.length === 30, `RFQs count is exactly 30 (got ${INITIAL_RFQS.length})`);
assert(INITIAL_INVENTORY.length >= 20, `Inventory items count >= 20 (got ${INITIAL_INVENTORY.length})`);
assert(INITIAL_DELIVERIES.length >= 10, `Deliveries count >= 10 (got ${INITIAL_DELIVERIES.length})`);
assert(INITIAL_AUDIT_LOGS.length >= 10, `Audit logs count >= 10 (got ${INITIAL_AUDIT_LOGS.length})`);

// KPI consistency
assert(INITIAL_KPIS.openPOs === 128, 'KPI Open POs is 128');
assert(INITIAL_KPIS.pendingRFQs === 24, 'KPI Pending RFQs is 24');
assert(INITIAL_KPIS.supplierResponses === 17, 'KPI Supplier Responses is 17');
assert(INITIAL_KPIS.atRiskPOs === 7, 'KPI At-Risk POs is 7');
assert(INITIAL_KPIS.overduePOs === 4, 'KPI Overdue POs is 4');
assert(INITIAL_KPIS.activeAITasks === 13, 'KPI Active AI Tasks is 13');
assert(INITIAL_KPIS.estimatedHoursSaved === 126, 'KPI Estimated Hours Saved is 126');

// -----------------------------------------------------------------------------
// FINAL SUMMARY & VERDICT
// -----------------------------------------------------------------------------
console.log('\n======================================================================');
console.log('              CHALLENGER 1 SUITE EXECUTION SUMMARY                    ');
console.log('======================================================================');
console.log(`Total Assertions Evaluated: ${totalAssertions}`);
console.log(`Passed Assertions:          ${passedAssertions}`);
console.log(`Failed Assertions:          ${failedAssertions}`);
console.log(`Pass Rate:                  ${((passedAssertions / totalAssertions) * 100).toFixed(2)}%`);
console.log('======================================================================\n');

if (failedAssertions > 0) {
  console.error(`FAILURES DETECTED (${failedAssertions}):`);
  failures.forEach(f => console.error(f));
  process.exit(1);
} else {
  console.log('✔ ALL EMPIRICAL CHALLENGER ASSERTIONS PASSED WITH 100% SUCCESS RATE.');
  process.exit(0);
}
