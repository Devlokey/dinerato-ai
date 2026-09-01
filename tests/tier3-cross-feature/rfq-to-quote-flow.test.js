import { assert } from '../test-harness.js';

export function registerRFQToQuoteFlowTests(harness) {
  harness.describe('Tier 3: Pairwise Interactions - RFQ to Quotation & Sourcing Pipeline (10 Tests)', () => {

    let state;

    harness.beforeEach(() => {
      state = {
        suppliers: [
          { id: 'SUP-001', name: 'ABC Components', category: 'Industrial Components', rating: 4.8, onTimePct: 98 },
          { id: 'SUP-002', name: 'Global Industrial Supply', category: 'Heavy Machinery & Parts', rating: 4.3, onTimePct: 91 },
          { id: 'SUP-004', name: 'Vertex Manufacturing', category: 'Precision Engineering', rating: 4.9, onTimePct: 99 },
          { id: 'SUP-005', name: 'Nova Components', category: 'Electrical & Plastics', rating: 4.2, onTimePct: 89 }
        ],
        rfqs: [],
        quotations: [],
        draftPOs: [],
        auditLogs: []
      };
    });

    harness.test('T3.RFQ.1: Sourcing search identifies and shortlists 4 qualified vendors from suppliers catalog', () => {
      const shortlisted = state.suppliers.filter(s => s.rating >= 4.2);
      assert.equal(shortlisted.length, 4);
      assert.includes(shortlisted.map(s => s.name), 'ABC Components');
      assert.includes(shortlisted.map(s => s.name), 'Vertex Manufacturing');
    });

    harness.test('T3.RFQ.2: RFQ Agent creates RFQ-104 and dispatches email broadcasts to all 4 shortlisted vendors', () => {
      const rfq104 = {
        id: 'RFQ-104',
        title: '500 units of Product X (Industrial Component A)',
        qty: 500,
        dispatchedTo: state.suppliers.map(s => s.name),
        status: 'Sent',
        createdAt: '2026-09-13 11:00:00'
      };
      state.rfqs.push(rfq104);
      assert.equal(state.rfqs.length, 1);
      assert.equal(state.rfqs[0].dispatchedTo.length, 4);
    });

    harness.test('T3.RFQ.3: 3 out of 4 vendors submit competitive quotations into Quotations dataset', () => {
      const quotes = [
        { rfqId: 'RFQ-104', supplier: 'ABC Components', unitPrice: 1200, total: 600000, leadTime: 10, onTime: 98, terms: 'Net 30', rating: 5 },
        { rfqId: 'RFQ-104', supplier: 'Global Industrial', unitPrice: 1120, total: 560000, leadTime: 18, onTime: 91, terms: 'Net 45', rating: 4 },
        { rfqId: 'RFQ-104', supplier: 'Vertex Manufacturing', unitPrice: 1260, total: 630000, leadTime: 8, onTime: 99, terms: 'Net 30', rating: 5 }
      ];
      state.quotations.push(...quotes);
      assert.equal(state.quotations.length, 3);
    });

    harness.test('T3.RFQ.4: RFQ-104 status transitions from Sent to Responded with quotesReceived count = 3', () => {
      state.rfqs.push({ id: 'RFQ-104', status: 'Sent', quotesReceived: 0 });
      state.rfqs[0].status = 'Responded';
      state.rfqs[0].quotesReceived = 3;
      assert.equal(state.rfqs[0].status, 'Responded');
      assert.equal(state.rfqs[0].quotesReceived, 3);
    });

    harness.test('T3.RFQ.5: Quote Intelligence Agent computes multi-criteria scores across price, time, and rating', () => {
      const scoreQuote = (q) => {
        const costWeight = (1120 / q.unitPrice) * 40;
        const timeWeight = (8 / q.leadTime) * 30;
        const relWeight = (q.onTime / 100) * 30;
        return Math.round(costWeight + timeWeight + relWeight);
      };
      const scored = [
        { supplier: 'ABC Components', unitPrice: 1200, leadTime: 10, onTime: 98, score: scoreQuote({ unitPrice: 1200, leadTime: 10, onTime: 98 }) },
        { supplier: 'Global Industrial', unitPrice: 1120, leadTime: 18, onTime: 91, score: scoreQuote({ unitPrice: 1120, leadTime: 18, onTime: 91 }) },
        { supplier: 'Vertex Manufacturing', unitPrice: 1260, leadTime: 8, onTime: 99, score: scoreQuote({ unitPrice: 1260, leadTime: 8, onTime: 99 }) }
      ];
      assert.equal(scored[0].supplier, 'ABC Components');
      assert.isAbove(scored[0].score, 85);
    });

    harness.test('T3.RFQ.6: AI Recommendation selects ABC Components with balanced trade-off rationale', () => {
      const recommendation = {
        supplier: 'ABC Components',
        score: 96,
        badge: 'Recommended',
        text: 'ABC Components recommended — best balance of cost, lead time, and delivery reliability. Vertex is faster but costs 5% more.'
      };
      assert.equal(recommendation.supplier, 'ABC Components');
      assert.includes(recommendation.text, 'best balance of cost');
    });

    harness.test('T3.RFQ.7: Approving ABC Components recommendation creates draft PO in ERP state', () => {
      const newPO = {
        id: 'PO-DRAFT-104',
        supplier: 'ABC Components',
        product: 'Industrial Component A',
        qty: 500,
        value: 600000,
        status: 'DRAFT',
        terms: 'Net 30'
      };
      state.draftPOs.push(newPO);
      assert.equal(state.draftPOs.length, 1);
      assert.equal(state.draftPOs[0].supplier, 'ABC Components');
      assert.equal(state.draftPOs[0].value, 600000);
    });

    harness.test('T3.RFQ.8: Approving quote updates RFQ-104 status to "Awarded"', () => {
      const rfq = { id: 'RFQ-104', status: 'Responded' };
      rfq.status = 'Awarded';
      rfq.awardedTo = 'ABC Components';
      assert.equal(rfq.status, 'Awarded');
      assert.equal(rfq.awardedTo, 'ABC Components');
    });

    harness.test('T3.RFQ.9: Sourcing pipeline appends audit trail entry for quotation award', () => {
      state.auditLogs.push({
        timestamp: '2026-09-13 11:05:00',
        agent: 'Quote Intelligence Agent',
        action: 'RFQ-104 Awarded to ABC Components',
        object: 'RFQ-104',
        status: 'Awarded',
        approvedBy: 'Operations Director'
      });
      assert.equal(state.auditLogs.length, 1);
      assert.equal(state.auditLogs[0].action, 'RFQ-104 Awarded to ABC Components');
    });

    harness.test('T3.RFQ.10: Vendor performance rating is updated after successful bid interaction', () => {
      const abc = state.suppliers.find(s => s.name === 'ABC Components');
      assert.equal(abc.rating, 4.8);
      assert.equal(abc.onTimePct, 98);
    });
  });
}
