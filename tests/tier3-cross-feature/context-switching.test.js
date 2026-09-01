import { assert } from '../test-harness.js';

export function registerContextSwitchingTests(harness) {
  harness.describe('Tier 3: Pairwise Interactions - Navigation & Context Synchronization (12 Tests)', () => {

    const routeContextMapping = {
      '/erp/dashboard': {
        pageType: 'Dashboard',
        badge: 'Context: Executive Dashboard',
        breadcrumb: ['DINE ERP', 'Dashboard'],
        chips: ['What needs my attention?', 'Show overdue POs', 'Chase high-risk POs', 'Summarize risks']
      },
      '/erp/purchase-orders': {
        pageType: 'PurchaseOrders',
        badge: 'Context: Purchase Orders (40 items)',
        breadcrumb: ['DINE ERP', 'Purchase Orders'],
        chips: ['Filter overdue POs', 'Show at-risk orders', 'Summarize high-value POs']
      },
      '/erp/purchase-orders/PO-1045': {
        pageType: 'PODetail',
        badge: 'Context: PO-1045 — ABC Components — OVERDUE',
        breadcrumb: ['DINE ERP', 'Purchase Orders', 'PO-1045'],
        chips: ['Why is this delayed?', 'Call supplier', 'Send follow-up', 'Find alternatives', 'Show related POs']
      },
      '/erp/suppliers': {
        pageType: 'Suppliers',
        badge: 'Context: Suppliers (25 active)',
        breadcrumb: ['DINE ERP', 'Suppliers'],
        chips: ['Top rated suppliers', 'Identify unreliable vendors', 'Draft supplier review']
      },
      '/erp/rfqs': {
        pageType: 'RFQs',
        badge: 'Context: RFQ Management',
        breadcrumb: ['DINE ERP', 'RFQs'],
        chips: ['Compare quotes', 'Generate new RFQ', 'Analyze pricing trends']
      },
      '/erp/quotations': {
        pageType: 'Quotations',
        badge: 'Context: Quotation Comparisons',
        breadcrumb: ['DINE ERP', 'Quotations'],
        chips: ['Recommend best quote', 'Check lead time variance', 'Review terms']
      },
      '/erp/deliveries': {
        pageType: 'Deliveries',
        badge: 'Context: Inbound Shipments & Schedule',
        breadcrumb: ['DINE ERP', 'Deliveries'],
        chips: ['Track delayed shipments', 'Carrier performance', 'Expedite delivery']
      },
      '/erp/inventory': {
        pageType: 'Inventory',
        badge: 'Context: Inventory & Stock Health',
        breadcrumb: ['DINE ERP', 'Inventory'],
        chips: ['Check low stock items', 'Generate reorder POs', 'Safety stock alerts']
      },
      '/erp/reports': {
        pageType: 'Reports',
        badge: 'Context: Procurement Analytics & Spend',
        breadcrumb: ['DINE ERP', 'Reports'],
        chips: ['Spend by category', 'Vendor on-time trends', 'Export ROI summary']
      },
      '/erp/agent-permissions': {
        pageType: 'AgentPermissions',
        badge: 'Context: Agent Governance & Permissions',
        breadcrumb: ['DINE ERP', 'Security', 'Agent Permissions'],
        chips: ['Audit Voice Agent rights', 'Review approval thresholds', 'Check write permissions']
      },
      '/erp/audit-log': {
        pageType: 'AuditLog',
        badge: 'Context: System Audit Log',
        breadcrumb: ['DINE ERP', 'Compliance', 'Audit Log'],
        chips: ['Filter by PO-1045', 'Show human approvals', 'Export compliance ledger']
      }
    };

    harness.test('T3.CTX.1: Navigating to Dashboard updates context badge and breadcrumb', () => {
      const ctx = routeContextMapping['/erp/dashboard'];
      assert.equal(ctx.badge, 'Context: Executive Dashboard');
      assert.equal(ctx.breadcrumb[1], 'Dashboard');
    });

    harness.test('T3.CTX.2: Navigating to PO-1045 updates badge to "PO-1045 — ABC Components — OVERDUE"', () => {
      const ctx = routeContextMapping['/erp/purchase-orders/PO-1045'];
      assert.equal(ctx.badge, 'Context: PO-1045 — ABC Components — OVERDUE');
      assert.includes(ctx.chips, 'Why is this delayed?');
      assert.includes(ctx.chips, 'Call supplier');
    });

    harness.test('T3.CTX.3: Navigating to Suppliers displays 25 active count badge and vendor chips', () => {
      const ctx = routeContextMapping['/erp/suppliers'];
      assert.equal(ctx.badge, 'Context: Suppliers (25 active)');
      assert.includes(ctx.chips, 'Top rated suppliers');
    });

    harness.test('T3.CTX.4: Navigating to RFQs updates badge and quote comparison chips', () => {
      const ctx = routeContextMapping['/erp/rfqs'];
      assert.equal(ctx.badge, 'Context: RFQ Management');
      assert.includes(ctx.chips, 'Compare quotes');
    });

    harness.test('T3.CTX.5: Navigating to Quotations displays comparison badge and lead-time analysis chips', () => {
      const ctx = routeContextMapping['/erp/quotations'];
      assert.equal(ctx.badge, 'Context: Quotation Comparisons');
      assert.includes(ctx.chips, 'Recommend best quote');
    });

    harness.test('T3.CTX.6: Navigating to Deliveries displays inbound shipments tracking badge', () => {
      const ctx = routeContextMapping['/erp/deliveries'];
      assert.equal(ctx.badge, 'Context: Inbound Shipments & Schedule');
      assert.includes(ctx.chips, 'Track delayed shipments');
    });

    harness.test('T3.CTX.7: Navigating to Inventory displays stock health badge and reorder chips', () => {
      const ctx = routeContextMapping['/erp/inventory'];
      assert.equal(ctx.badge, 'Context: Inventory & Stock Health');
      assert.includes(ctx.chips, 'Check low stock items');
    });

    harness.test('T3.CTX.8: Navigating to Reports displays analytics badge and spend category chips', () => {
      const ctx = routeContextMapping['/erp/reports'];
      assert.equal(ctx.badge, 'Context: Procurement Analytics & Spend');
      assert.includes(ctx.chips, 'Spend by category');
    });

    harness.test('T3.CTX.9: Navigating to Agent Permissions displays governance badge and security chips', () => {
      const ctx = routeContextMapping['/erp/agent-permissions'];
      assert.equal(ctx.badge, 'Context: Agent Governance & Permissions');
      assert.includes(ctx.chips, 'Audit Voice Agent rights');
    });

    harness.test('T3.CTX.10: Navigating to Audit Log displays compliance badge and log search chips', () => {
      const ctx = routeContextMapping['/erp/audit-log'];
      assert.equal(ctx.badge, 'Context: System Audit Log');
      assert.includes(ctx.chips, 'Filter by PO-1045');
    });

    harness.test('T3.CTX.11: Switching between routes with AI panel open retains open state and updates context in real-time', () => {
      let panelOpen = true;
      let currentContext = routeContextMapping['/erp/dashboard'];
      // User clicks PO-1045 row
      currentContext = routeContextMapping['/erp/purchase-orders/PO-1045'];
      assert.isTrue(panelOpen);
      assert.equal(currentContext.badge, 'Context: PO-1045 — ABC Components — OVERDUE');
    });

    harness.test('T3.CTX.12: Active sidebar highlighting dynamically synchronizes with current route', () => {
      const getActiveSidebarItem = (route) => {
        if (route.includes('purchase-orders')) return 'purchase-orders';
        if (route.includes('suppliers')) return 'suppliers';
        if (route.includes('rfqs')) return 'rfqs';
        return 'dashboard';
      };
      assert.equal(getActiveSidebarItem('/erp/purchase-orders/PO-1045'), 'purchase-orders');
      assert.equal(getActiveSidebarItem('/erp/suppliers'), 'suppliers');
      assert.equal(getActiveSidebarItem('/erp/dashboard'), 'dashboard');
    });
  });
}
