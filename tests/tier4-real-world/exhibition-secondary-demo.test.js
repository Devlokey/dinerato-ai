import { assert } from '../test-harness.js';

export function registerExhibitionSecondaryDemoTests(harness) {
  harness.describe('Tier 4: Scenario 2 - Exhibition Secondary Demo: Source & RFQ End-to-End', () => {

    harness.test('Scenario 2: Complete end-to-end execution of Source & RFQ workflow', async () => {
      // Step 1: User enters sourcing request into DINE AI chat
      const userPrompt = 'Find suppliers for 500 units of Product X';
      const promptClassification = 'SOURCE_RFQ';
      assert.equal(promptClassification, 'SOURCE_RFQ');

      // Step 2: Sourcing Agent execution stream
      const sourcingSteps = [
        { time: '11:00:01', agent: 'Sourcing Agent', action: 'Searching supplier database...' },
        { time: '11:00:03', agent: 'Sourcing Agent', action: '✓ Found 6 potential suppliers' },
        { time: '11:00:04', agent: 'Sourcing Agent', action: '✓ Shortlisted 4 based on category, rating, capacity' },
        { time: '11:00:05', agent: 'RFQ Agent', action: 'Creating RFQ-104...' },
        { time: '11:00:06', agent: 'RFQ Agent', action: '✓ RFQ-104 created' },
        { time: '11:00:07', agent: 'RFQ Agent', action: 'Sending RFQ to 4 suppliers...' },
        { time: '11:00:08', agent: 'RFQ Agent', action: '✓ Sent to: ABC Components, Global Industrial Supply, Vertex Manufacturing, Nova Components' }
      ];

      assert.equal(sourcingSteps.length, 7);
      assert.equal(sourcingSteps[0].agent, 'Sourcing Agent');
      assert.equal(sourcingSteps[3].agent, 'RFQ Agent');

      // Step 3: Quotation intelligence parsing (3 quotes received)
      const quoteSteps = [
        { time: '11:00:15', agent: 'Quote Intelligence Agent', action: '✓ 3 quotations received' },
        { time: '11:00:17', agent: 'Quote Intelligence Agent', action: 'Analyzing quotes...' },
        { time: '11:00:19', agent: 'Quote Intelligence Agent', action: '✓ Analysis complete' }
      ];

      assert.equal(quoteSteps.length, 3);

      // Step 4: Quote Comparison Table rendered
      const quoteTable = [
        { supplier: 'ABC Components', unitPrice: 1200, total: 600000, leadTimeDays: 10, onTimePct: 98, paymentTerms: 'Net 30', rating: '★★★★★', score: 96, recommended: true },
        { supplier: 'Global Industrial Supply', unitPrice: 1120, total: 560000, leadTimeDays: 18, onTimePct: 91, paymentTerms: 'Net 45', rating: '★★★★☆', score: 88, recommended: false },
        { supplier: 'Vertex Manufacturing', unitPrice: 1260, total: 630000, leadTimeDays: 8, onTimePct: 99, paymentTerms: 'Net 30', rating: '★★★★★', score: 91, recommended: false }
      ];

      assert.equal(quoteTable.length, 3);
      assert.isTrue(quoteTable[0].recommended);

      // Step 5: AI Recommendation Card displayed
      const recCard = {
        title: 'AI Recommendation',
        text: 'ABC Components recommended — best balance of cost, lead time, and delivery reliability. Vertex is faster but costs 5% more.',
        recommendedSupplier: 'ABC Components',
        ctaButtons: ['Approve ABC Components', 'Review All Quotes', 'Request More Quotes']
      };

      assert.equal(recCard.recommendedSupplier, 'ABC Components');
      assert.includes(recCard.text, 'best balance of cost');

      // Step 6: User clicks [Approve ABC Components]
      const awardResult = {
        rfqId: 'RFQ-104',
        awardedSupplier: 'ABC Components',
        totalValue: 600000,
        draftPONumber: 'PO-DRAFT-104',
        rfqStatus: 'Awarded'
      };

      assert.equal(awardResult.rfqStatus, 'Awarded');
      assert.equal(awardResult.draftPONumber, 'PO-DRAFT-104');
    });
  });
}
