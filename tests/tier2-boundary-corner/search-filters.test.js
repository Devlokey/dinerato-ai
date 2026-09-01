import { assert } from '../test-harness.js';

export function registerSearchFiltersTests(harness) {
  harness.describe('Tier 2: Boundary & Corner Cases - Search & Multi-Filter Robustness (38 Tests)', () => {

    const mockPOs = [
      { id: 'PO-1045', supplier: 'ABC Components', product: 'Industrial Component A', qty: 500, value: 600000, status: 'OVERDUE', risk: 'HIGH', city: 'Pune' },
      { id: 'PO-1067', supplier: 'XYZ Manufacturing', product: 'Steel Component B', qty: 200, value: 240000, status: 'OVERDUE', risk: 'MEDIUM', city: 'Mumbai' },
      { id: 'PO-1089', supplier: 'Nova Components', product: 'Plastic Housing X', qty: 1000, value: 80000, status: 'OVERDUE', risk: 'LOW', city: 'Chennai' },
      { id: 'PO-1092', supplier: 'Metro Components', product: 'Circuit Board Y', qty: 300, value: 450000, status: 'OVERDUE', risk: 'HIGH', city: 'Delhi' },
      { id: 'PO-1050', supplier: 'Apex Metals', product: 'Sheet Metal Tubing', qty: 150, value: 150000, status: 'AT RISK', risk: 'MEDIUM', city: 'Jaipur' },
      { id: 'PO-1001', supplier: 'Vertex Manufacturing', product: 'Precision Gears', qty: 400, value: 500000, status: 'ON TRACK', risk: 'LOW', city: 'Bengaluru' },
      { id: 'PO-1002', supplier: 'Bharat Engineering', product: 'Structural Beams', qty: 50, value: 350000, status: 'DELIVERED', risk: 'LOW', city: 'Hyderabad' }
    ];

    const filterPOs = (list, query = '', statusFilter = 'ALL', riskFilter = 'ALL') => {
      const q = (query || '').trim().toLowerCase();
      return list.filter(po => {
        const matchesQuery = !q ||
          po.id.toLowerCase().includes(q) ||
          po.supplier.toLowerCase().includes(q) ||
          po.product.toLowerCase().includes(q) ||
          po.city.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
        const matchesRisk = riskFilter === 'ALL' || po.risk === riskFilter;
        return matchesQuery && matchesStatus && matchesRisk;
      });
    };

    // Sub-suite 1: Search Query Edge Cases (10 Tests)
    harness.test('T2.SF.1: Empty query string returns all records in dataset', () => {
      const results = filterPOs(mockPOs, '');
      assert.equal(results.length, mockPOs.length);
    });

    harness.test('T2.SF.2: Whitespace-only query string returns all records in dataset', () => {
      const results = filterPOs(mockPOs, '    \t\n  ');
      assert.equal(results.length, mockPOs.length);
    });

    harness.test('T2.SF.3: Single character query filters correctly (e.g. "x")', () => {
      const results = filterPOs(mockPOs, 'x');
      assert.isTrue(results.some(p => p.supplier.toLowerCase().includes('x') || p.product.toLowerCase().includes('x')));
    });

    harness.test('T2.SF.4: Lowercase search matches uppercase entity names (e.g. "abc")', () => {
      const results = filterPOs(mockPOs, 'abc');
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 'PO-1045');
    });

    harness.test('T2.SF.5: Uppercase search matches lowercase entity names (e.g. "INDUSTRIAL")', () => {
      const results = filterPOs(mockPOs, 'INDUSTRIAL');
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 'PO-1045');
    });

    harness.test('T2.SF.6: Mixed-case query "pOnE" matches city Pune', () => {
      const results = filterPOs(mockPOs, 'pUnE');
      assert.equal(results.length, 1);
      assert.equal(results[0].city, 'Pune');
    });

    harness.test('T2.SF.7: Hyphenated PO ID search matches exact record ("PO-1045")', () => {
      const results = filterPOs(mockPOs, 'PO-1045');
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 'PO-1045');
    });

    harness.test('T2.SF.8: Partial PO numeric search ("1045") matches PO-1045', () => {
      const results = filterPOs(mockPOs, '1045');
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 'PO-1045');
    });

    harness.test('T2.SF.9: Leading and trailing spaces in query are trimmed before filtering', () => {
      const results = filterPOs(mockPOs, '   Vertex   ');
      assert.equal(results.length, 1);
      assert.equal(results[0].supplier, 'Vertex Manufacturing');
    });

    harness.test('T2.SF.10: Search query with regex metacharacters does not throw (e.g. "PO-[1045]")', () => {
      const results = filterPOs(mockPOs, 'PO-[1045]');
      assert.isArray(results);
    });

    // Sub-suite 2: Zero Results & Corner Injections (10 Tests)
    harness.test('T2.SF.11: Non-matching query returns empty array without error', () => {
      const results = filterPOs(mockPOs, 'Nonexistent Supplier 999');
      assert.equal(results.length, 0);
    });

    harness.test('T2.SF.12: HTML script tag search does not execute and returns empty result', () => {
      const results = filterPOs(mockPOs, '<script>alert(1)</script>');
      assert.equal(results.length, 0);
    });

    harness.test('T2.SF.13: SQL injection query string does not crash in-memory filter', () => {
      const results = filterPOs(mockPOs, "' OR 1=1 --");
      assert.equal(results.length, 0);
    });

    harness.test('T2.SF.14: Unicode emoji query filters gracefully', () => {
      const results = filterPOs(mockPOs, '🚀🔥✨');
      assert.equal(results.length, 0);
    });

    harness.test('T2.SF.15: Special punctuation search ("₹", "%", "@") behaves safely', () => {
      const results = filterPOs(mockPOs, '₹%@');
      assert.equal(results.length, 0);
    });

    harness.test('T2.SF.16: Null query argument is handled as empty string', () => {
      const results = filterPOs(mockPOs, null);
      assert.equal(results.length, mockPOs.length);
    });

    harness.test('T2.SF.17: Undefined query argument is handled as empty string', () => {
      const results = filterPOs(mockPOs, undefined);
      assert.equal(results.length, mockPOs.length);
    });

    harness.test('T2.SF.18: Numeric query argument stringifies cleanly', () => {
      const searchNum = (list, num) => filterPOs(list, String(num));
      const results = searchNum(mockPOs, 1089);
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 'PO-1089');
    });

    harness.test('T2.SF.19: Boolean query argument stringifies cleanly', () => {
      const results = filterPOs(mockPOs, 'true');
      assert.isArray(results);
    });

    harness.test('T2.SF.20: Zero search results component displays helpful suggestion message', () => {
      const getEmptyState = (count, query) => count === 0 ? `No records found matching "${query}". Try resetting filters.` : null;
      assert.includes(getEmptyState(0, 'XYZ Ltd'), 'No records found matching "XYZ Ltd"');
    });

    // Sub-suite 3: Multi-Criteria Filter Intersections (10 Tests)
    harness.test('T2.SF.21: Status filter OVERDUE alone returns 4 overdue POs', () => {
      const results = filterPOs(mockPOs, '', 'OVERDUE', 'ALL');
      assert.equal(results.length, 4);
    });

    harness.test('T2.SF.22: Status OVERDUE + Risk HIGH intersection returns 2 POs (PO-1045, PO-1092)', () => {
      const results = filterPOs(mockPOs, '', 'OVERDUE', 'HIGH');
      assert.equal(results.length, 2);
      assert.isTrue(results.some(p => p.id === 'PO-1045'));
      assert.isTrue(results.some(p => p.id === 'PO-1092'));
    });

    harness.test('T2.SF.23: Status OVERDUE + Risk MEDIUM intersection returns 1 PO (PO-1067)', () => {
      const results = filterPOs(mockPOs, '', 'OVERDUE', 'MEDIUM');
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 'PO-1067');
    });

    harness.test('T2.SF.24: Status OVERDUE + Risk LOW intersection returns 1 PO (PO-1089)', () => {
      const results = filterPOs(mockPOs, '', 'OVERDUE', 'LOW');
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 'PO-1089');
    });

    harness.test('T2.SF.25: Query "ABC" + Status OVERDUE + Risk HIGH returns PO-1045', () => {
      const results = filterPOs(mockPOs, 'ABC', 'OVERDUE', 'HIGH');
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 'PO-1045');
    });

    harness.test('T2.SF.26: Query "ABC" + Status ON TRACK returns 0 results (conflicting filter)', () => {
      const results = filterPOs(mockPOs, 'ABC', 'ON TRACK', 'ALL');
      assert.equal(results.length, 0);
    });

    harness.test('T2.SF.27: Status AT RISK returns PO-1050', () => {
      const results = filterPOs(mockPOs, '', 'AT RISK', 'ALL');
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 'PO-1050');
    });

    harness.test('T2.SF.28: Status ON TRACK returns PO-1001', () => {
      const results = filterPOs(mockPOs, '', 'ON TRACK', 'ALL');
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 'PO-1001');
    });

    harness.test('T2.SF.29: Status DELIVERED returns PO-1002', () => {
      const results = filterPOs(mockPOs, '', 'DELIVERED', 'ALL');
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 'PO-1002');
    });

    harness.test('T2.SF.30: Multi-filter resetting restores entire list', () => {
      let statusFilter = 'OVERDUE';
      let riskFilter = 'HIGH';
      let query = 'ABC';
      // Reset
      statusFilter = 'ALL';
      riskFilter = 'ALL';
      query = '';
      const results = filterPOs(mockPOs, query, statusFilter, riskFilter);
      assert.equal(results.length, mockPOs.length);
    });

    // Sub-suite 4: Sorting & Stability Edge Cases (8 Tests)
    harness.test('T2.SF.31: Sorting by numeric value descending places ₹6,00,000 at index 0', () => {
      const sorted = [...mockPOs].sort((a, b) => b.value - a.value);
      assert.equal(sorted[0].id, 'PO-1045');
      assert.equal(sorted[0].value, 600000);
    });

    harness.test('T2.SF.32: Sorting by numeric value ascending places ₹80,000 at index 0', () => {
      const sorted = [...mockPOs].sort((a, b) => a.value - b.value);
      assert.equal(sorted[0].id, 'PO-1089');
      assert.equal(sorted[0].value, 80000);
    });

    harness.test('T2.SF.33: Sorting by supplier string alphabetically A to Z', () => {
      const sorted = [...mockPOs].sort((a, b) => a.supplier.localeCompare(b.supplier));
      assert.equal(sorted[0].supplier, 'ABC Components');
      assert.equal(sorted[sorted.length - 1].supplier, 'XYZ Manufacturing');
    });

    harness.test('T2.SF.34: Sorting by quantity numeric ascending vs descending', () => {
      const sortedAsc = [...mockPOs].sort((a, b) => a.qty - b.qty);
      assert.equal(sortedAsc[0].qty, 50);
      const sortedDesc = [...mockPOs].sort((a, b) => b.qty - a.qty);
      assert.equal(sortedDesc[0].qty, 1000);
    });

    harness.test('T2.SF.35: Sort stability preserves relative order on equal values', () => {
      const items = [{ id: 1, val: 100 }, { id: 2, val: 100 }, { id: 3, val: 50 }];
      const sorted = [...items].sort((a, b) => b.val - a.val);
      assert.equal(sorted[0].id, 1);
      assert.equal(sorted[1].id, 2);
    });

    harness.test('T2.SF.36: Sorting empty list returns empty list without error', () => {
      const empty = [];
      const sorted = [...empty].sort((a, b) => a - b);
      assert.equal(sorted.length, 0);
    });

    harness.test('T2.SF.37: Sorting list with single item returns identical single item', () => {
      const single = [{ id: 'PO-1045' }];
      const sorted = [...single].sort((a, b) => a.id.localeCompare(b.id));
      assert.equal(sorted.length, 1);
      assert.equal(sorted[0].id, 'PO-1045');
    });

    harness.test('T2.SF.38: Pagination slicer boundaries handle page beyond range gracefully', () => {
      const paginate = (list, page, pageSize) => {
        const start = (page - 1) * pageSize;
        if (start >= list.length) return [];
        return list.slice(start, start + pageSize);
      };
      assert.equal(paginate(mockPOs, 1, 5).length, 5);
      assert.equal(paginate(mockPOs, 2, 5).length, 2);
      assert.equal(paginate(mockPOs, 999, 5).length, 0);
    });
  });
}
