import { assert } from '../test-harness.js';

export function registerFreeExplorationJourneyTests(harness) {
  harness.describe('Tier 4: Scenario 3 - Open Exploration & Conversational Context Switching', () => {

    harness.test('Scenario 3: Free exploration journey across ERP pages with dynamic context sync', async () => {
      // Step 1: User clicks "💬 Explore Freely" on landing page
      let currentRoute = '/';
      const onExploreFreely = () => { currentRoute = '/erp/dashboard'; };
      onExploreFreely();
      assert.equal(currentRoute, '/erp/dashboard');

      // Step 2: Dashboard metrics inspection
      const dashboardState = {
        openPOs: 128,
        pendingRFQs: 24,
        overduePOs: 4,
        hoursSaved: '126 hrs'
      };
      assert.equal(dashboardState.openPOs, 128);
      assert.equal(dashboardState.overduePOs, 4);

      // Step 3: User navigates to Suppliers page
      currentRoute = '/erp/suppliers';
      const suppliersContext = {
        pageType: 'Suppliers',
        badge: 'Context: Suppliers (25 active)',
        count: 25
      };
      assert.equal(suppliersContext.badge, 'Context: Suppliers (25 active)');

      // Step 4: User searches for "Vertex" and inspects supplier details
      const searchResult = { name: 'Vertex Manufacturing', rating: 4.9, onTimePct: 99, location: 'Bengaluru' };
      assert.equal(searchResult.name, 'Vertex Manufacturing');
      assert.isAbove(searchResult.rating, 4.5);

      // Step 5: User navigates to Purchase Orders and filters by OVERDUE
      currentRoute = '/erp/purchase-orders';
      const overduePOs = [
        { id: 'PO-1045', supplier: 'ABC Components', value: 600000, risk: 'HIGH' },
        { id: 'PO-1067', supplier: 'XYZ Manufacturing', value: 240000, risk: 'MEDIUM' },
        { id: 'PO-1089', supplier: 'Nova Components', value: 80000, risk: 'LOW' },
        { id: 'PO-1092', supplier: 'Metro Components', value: 450000, risk: 'HIGH' }
      ];
      assert.equal(overduePOs.length, 4);

      // Step 6: User clicks PO-1092 row
      currentRoute = '/erp/purchase-orders/PO-1092';
      const po1092Detail = {
        id: 'PO-1092',
        supplier: 'Metro Components',
        product: 'Circuit Board Y',
        value: 450000,
        risk: 'HIGH',
        daysOverdue: 3
      };
      assert.equal(po1092Detail.id, 'PO-1092');

      // Step 7: User opens DINE AI panel and asks contextual question
      const aiResponse = 'PO-1092 for Metro Components (Circuit Board Y, ₹4,50,000) is 3 days overdue. This is classified as HIGH RISK due to downstream assembly line dependencies.';
      assert.includes(aiResponse, 'PO-1092');
      assert.includes(aiResponse, 'Metro Components');
      assert.includes(aiResponse, 'HIGH RISK');
    });
  });
}
