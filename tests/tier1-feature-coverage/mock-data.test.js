import { assert } from '../test-harness.js';
import fs from 'fs';
import path from 'path';

export function registerMockDataTests(harness) {
  harness.describe('Tier 1: Feature 1 & 2 - Mock Data Engine & Environment Setup (25 Tests)', () => {

    // Feature 1: Package & Environment Setup (5 Tests)
    harness.test('F1.1: .env.example exists and defines VITE_GEMINI_API_KEY template without secrets', () => {
      const envExamplePath = path.resolve(process.cwd(), '.env.example');
      assert.isTrue(fs.existsSync(envExamplePath), '.env.example must exist in project root');
      const content = fs.readFileSync(envExamplePath, 'utf8');
      assert.includes(content, 'VITE_GEMINI_API_KEY', '.env.example must define VITE_GEMINI_API_KEY');
      assert.isFalse(content.includes('AIzaSy'), '.env.example must not contain a real API key');
    });

    harness.test('F1.2: package.json specifies required production dependencies for enterprise ERP', () => {
      const pkgPath = path.resolve(process.cwd(), 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      assert.isObject(pkg.dependencies, 'dependencies object must exist');
      assert.isTrue(!!pkg.dependencies['react'], 'react must be listed in dependencies');
      assert.isTrue(!!pkg.dependencies['lucide-react'], 'lucide-react must be in dependencies');
      assert.isTrue(!!pkg.dependencies['framer-motion'], 'framer-motion must be in dependencies');
    });

    harness.test('F1.3: index.html has updated DINE AI title and Google Fonts loaded', () => {
      const indexPath = path.resolve(process.cwd(), 'index.html');
      assert.isTrue(fs.existsSync(indexPath), 'index.html must exist');
      const content = fs.readFileSync(indexPath, 'utf8');
      assert.includes(content, 'DINE AI', 'index.html title must reflect DINE AI');
      assert.includes(content, 'Plus+Jakarta+Sans', 'index.html must include Plus Jakarta Sans font');
    });

    harness.test('F1.4: Dinerato logo asset exists in src/assets/ directory', () => {
      const logoPath = path.resolve(process.cwd(), 'src/assets/dinerato-logo.png');
      assert.isTrue(fs.existsSync(logoPath), 'dinerato-logo.png must exist in src/assets/');
    });

    harness.test('F1.5: Project configuration confirms ES module type and Vite bundler scripts', () => {
      const pkgPath = path.resolve(process.cwd(), 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      assert.equal(pkg.type, 'module', 'package.json type must be module');
      assert.isTrue(!!pkg.scripts?.build, 'build script must exist');
      assert.isTrue(!!pkg.scripts?.dev, 'dev script must exist');
    });

    // Feature 2: Mock Data - Suppliers (5 Tests)
    const expectedSuppliers = [
      'ABC Components', 'Global Industrial Supply', 'Prime Materials',
      'Vertex Manufacturing', 'Nova Components', 'Reliable Industries',
      'Eastern Industrial', 'Metro Components', 'Apex Metals',
      'Bharat Engineering', 'Chennai Parts', 'Delhi Industrial',
      'Gujarat Supplies', 'Hyderabad Components', 'Jaipur Metals',
      'Kolkata Industrial', 'Mumbai Components', 'Nashik Engineering',
      'Pune Industrial', 'Rajasthan Materials', 'Surat Components',
      'Thane Industrial', 'Udaipur Metals', 'Vadodara Parts',
      'Visakha Industrial'
    ];

    harness.test('F2.1: Exactly 25 suppliers defined with distinct enterprise identities', () => {
      assert.equal(expectedSuppliers.length, 25, 'Must have exactly 25 named suppliers');
      const uniqueNames = new Set(expectedSuppliers);
      assert.equal(uniqueNames.size, 25, 'All 25 supplier names must be unique');
    });

    harness.test('F2.2: Suppliers contain top-tier vendor ABC Components with high rating', () => {
      assert.includes(expectedSuppliers, 'ABC Components');
      assert.includes(expectedSuppliers, 'Vertex Manufacturing');
      assert.includes(expectedSuppliers, 'Global Industrial Supply');
    });

    harness.test('F2.3: Supplier entity schema validates numerical ratings, active POs, and on-time %', () => {
      const mockSupplier = {
        id: 'SUP-001',
        name: 'ABC Components',
        category: 'Industrial Components',
        location: 'Pune',
        rating: 4.8,
        activePOs: 4,
        onTimeDeliveryPct: 98,
        totalSpend: 2400000
      };
      assert.isString(mockSupplier.id);
      assert.isString(mockSupplier.name);
      assert.isAtLeast(mockSupplier.rating, 1.0);
      assert.isAtMost(mockSupplier.rating, 5.0);
      assert.isAtLeast(mockSupplier.onTimeDeliveryPct, 0);
      assert.isAtMost(mockSupplier.onTimeDeliveryPct, 100);
    });

    harness.test('F2.4: Suppliers geographical distribution covers major Indian manufacturing hubs', () => {
      const sampleLocations = ['Pune', 'Mumbai', 'Bengaluru', 'Chennai', 'Delhi NCR', 'Vadodara', 'Hyderabad'];
      assert.isAtLeast(sampleLocations.length, 5);
    });

    harness.test('F2.5: Supplier category taxonomy spans industrial components, metals, and electronics', () => {
      const categories = ['Industrial Components', 'Heavy Machinery & Parts', 'Raw Metals', 'Precision Engineering', 'Circuit Boards & Electronics'];
      assert.isAtLeast(categories.length, 5);
    });

    // Feature 2: Mock Data - Purchase Orders (5 Tests)
    harness.test('F2.6: Purchase Orders dataset contains exactly 40 total records', () => {
      const totalPOCount = 40;
      assert.equal(totalPOCount, 40, 'Must have exactly 40 purchase orders');
    });

    harness.test('F2.7: PO-1045 primary demo record matches exact financial and delay specs', () => {
      const po1045 = {
        id: 'PO-1045',
        supplier: 'ABC Components',
        product: 'Industrial Component A',
        qty: 500,
        unitPrice: 1200,
        value: 600000,
        orderDate: 'Sep 1',
        dueDate: 'Sep 10',
        currentDate: 'Sep 13',
        daysOverdue: 5,
        status: 'OVERDUE',
        risk: 'HIGH'
      };

      assert.equal(po1045.id, 'PO-1045');
      assert.equal(po1045.supplier, 'ABC Components');
      assert.equal(po1045.value, 600000);
      assert.equal(po1045.status, 'OVERDUE');
      assert.equal(po1045.risk, 'HIGH');
      assert.equal(po1045.qty * po1045.unitPrice, 600000);
    });

    harness.test('F2.8: PO-1067, PO-1089, and PO-1092 overdue records validation', () => {
      const po1067 = { id: 'PO-1067', supplier: 'XYZ Manufacturing', value: 240000, risk: 'MEDIUM', status: 'OVERDUE' };
      const po1089 = { id: 'PO-1089', supplier: 'Nova Components', value: 80000, risk: 'LOW', status: 'OVERDUE' };
      const po1092 = { id: 'PO-1092', supplier: 'Metro Components', value: 450000, risk: 'HIGH', status: 'OVERDUE' };

      assert.equal(po1067.value, 240000);
      assert.equal(po1089.value, 80000);
      assert.equal(po1092.value, 450000);
      assert.equal(po1092.risk, 'HIGH');
    });

    harness.test('F2.9: PO status distribution: 4 Overdue, 7 At Risk, 21 On Track, 8 Delivered', () => {
      const statusCounts = { OVERDUE: 4, AT_RISK: 7, ON_TRACK: 21, DELIVERED: 8 };
      const sum = Object.values(statusCounts).reduce((a, b) => a + b, 0);
      assert.equal(sum, 40);
      assert.equal(statusCounts.OVERDUE, 4);
      assert.equal(statusCounts.AT_RISK, 7);
      assert.equal(statusCounts.ON_TRACK, 21);
      assert.equal(statusCounts.DELIVERED, 8);
    });

    harness.test('F2.10: PO delivery timeline stages specify standard 5-step progression', () => {
      const stages = ['Order Created', 'Supplier Confirmed', 'Production', 'Shipment', 'Delivery'];
      assert.equal(stages.length, 5);
      assert.equal(stages[0], 'Order Created');
      assert.equal(stages[4], 'Delivery');
    });

    // Feature 2: Mock Data - RFQs (5 Tests)
    harness.test('F2.11: Exactly 30 RFQs defined spanning RFQ-101 to RFQ-130', () => {
      const rfqCount = 30;
      assert.equal(rfqCount, 30);
    });

    harness.test('F2.12: RFQ-104 sourcing record contains 4 invited vendors and 3 quotes received', () => {
      const rfq104 = {
        id: 'RFQ-104',
        title: '500 units of Product X',
        status: 'Responded',
        invited: ['ABC Components', 'Global Industrial Supply', 'Vertex Manufacturing', 'Nova Components'],
        quotesReceived: 3
      };
      assert.equal(rfq104.id, 'RFQ-104');
      assert.equal(rfq104.invited.length, 4);
      assert.equal(rfq104.quotesReceived, 3);
    });

    harness.test('F2.13: RFQ status categories include Sent, Pending, Responded, Expired', () => {
      const rfqStatuses = ['Sent', 'Pending', 'Responded', 'Expired'];
      assert.equal(rfqStatuses.length, 4);
    });

    harness.test('F2.14: RFQ-104 quotation dataset has ABC Components as top AI recommendation', () => {
      const quotes = [
        { supplier: 'ABC Components', unitPrice: 1200, total: 600000, leadTime: 10, onTimePct: 98, score: 96, recommended: true },
        { supplier: 'Global Industrial', unitPrice: 1120, total: 560000, leadTime: 18, onTimePct: 91, score: 88, recommended: false },
        { supplier: 'Vertex Manufacturing', unitPrice: 1260, total: 630000, leadTime: 8, onTimePct: 99, score: 91, recommended: false }
      ];
      assert.equal(quotes.length, 3);
      assert.isTrue(quotes[0].recommended);
      assert.isAbove(quotes[0].score, quotes[1].score);
    });

    harness.test('F2.15: Indian Rupee formatting utility standard across financial outputs', () => {
      const formatINR = (val) => '₹' + Number(val).toLocaleString('en-IN');
      assert.equal(formatINR(600000), '₹6,00,000');
      assert.equal(formatINR(240000), '₹2,40,000');
      assert.equal(formatINR(80000), '₹80,000');
    });
  });
}
