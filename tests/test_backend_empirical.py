# -*- coding: utf-8 -*-
"""
Challenger 1: Python Backend & Cryptographic Audit Verification
Tests ury_ai Python modules for SHA-256 audit chaining, quote scoring mathematics,
and API threshold enforcement.
"""

import sys
import os
import copy

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ury_ai.services.audit_chain import append_audit_entry, verify_chain_integrity, calculate_hash
from ury_ai.services.scoring_engine import score_supplier_quotes
from ury_ai.api.po import update_po_schedule_date, get_overdue_purchase_orders

def run_backend_tests():
    total = 0
    passed = 0
    failed = 0

    def check(cond, msg):
        nonlocal total, passed, failed
        total += 1
        if cond:
            passed += 1
            print(f"  ✓ [PASS] {msg}")
        else:
            failed += 1
            print(f"  ✗ [FAIL] {msg}")

    print("\n======================================================================")
    print("      CHALLENGER 1: PYTHON BACKEND & CRYPTOGRAPHIC VERIFICATION       ")
    print("======================================================================\n")

    # 1. Cryptographic Hash-Chained Audit Trail
    print("▶ CATEGORY 1: SHA-256 Hash Chained Audit Trail & Tamper Detection")
    
    # Append 5 records
    for i in range(1, 6):
        rec = append_audit_entry(
            agent_id=f"agent-{i}",
            agent_name=f"Agent {i}",
            action=f"Action-{i}",
            object_type="Purchase Order",
            object_id=f"PO-104{i}",
            method="Automated Simulation",
            status="Success",
            approved_by="System Test",
            payload_summary={"test_idx": i, "value": i * 10000}
        )
        check(rec["curr_hash"] is not None and len(rec["curr_hash"]) == 64, f"Record {i} generated valid 64-char SHA-256 hash")

    # Verify pristine chain
    verify_res = verify_chain_integrity()
    check(verify_res["valid"] is True, f"Pristine audit chain verification: VALID (Total blocks: {verify_res['total_records']})")
    check(len(verify_res["errors"]) == 0, "No errors found in valid chain")

    # Tamper Test: Modify payload in a past block and assert verification FAILS
    from ury_ai.services import audit_chain
    tampered_chain = copy.deepcopy(audit_chain._in_memory_chain)
    tampered_chain[1]["payload_summary"]["value"] = 999999999 # Alter value in block 2

    tampered_verify = verify_chain_integrity(tampered_chain)
    check(tampered_verify["valid"] is False, "Tampered chain detected as INVALID")
    check(len(tampered_verify["errors"]) > 0, f"Tamper detector surfaced {len(tampered_verify['errors'])} cryptographic violations")

    # 2. Multi-Criteria Quotation Scoring Mathematics
    print("\n▶ CATEGORY 2: Multi-Criteria Quotation Scoring Mathematics")
    
    quotes = [
        {
            "supplier": "ABC Components",
            "unit_price": 1200.0,
            "lead_time_days": 10,
            "on_time_rate": 98.0
        },
        {
            "supplier": "Global Industrial Supply",
            "unit_price": 1120.0,
            "lead_time_days": 18,
            "on_time_rate": 91.0
        },
        {
            "supplier": "Vertex Manufacturing",
            "unit_price": 1260.0,
            "lead_time_days": 8,
            "on_time_rate": 99.0
        }
    ]

    scored = score_supplier_quotes(quotes)
    check(len(scored) == 3, "Scoring engine processed all 3 quotes")
    check(scored[0]["rank"] == 1, "Rank 1 assigned to top composite score")
    check(scored[0]["is_recommended"] is True, "Top ranked quote is flagged is_recommended = True")
    check(scored[1]["is_recommended"] is False, "Rank 2 quote is_recommended = False")
    check(scored[2]["is_recommended"] is False, "Rank 3 quote is_recommended = False")

    # Check that ABC Components is the highest scoring balanced choice
    check(scored[0]["supplier"] == "ABC Components", f"Top recommended supplier is ABC Components (Got: {scored[0]['supplier']})")
    check(scored[0]["composite_score"] >= 95.0, f"ABC Components composite score is >= 95.0 ({scored[0]['composite_score']})")

    # Test edge case: Single quote
    single_scored = score_supplier_quotes([quotes[0]])
    check(len(single_scored) == 1 and single_scored[0]["rank"] == 1, "Single quote scored correctly")

    # Test edge case: Empty quote list
    empty_scored = score_supplier_quotes([])
    check(len(empty_scored) == 0, "Empty quote list returns empty array")

    # 3. Purchase Order API Controllers & Threshold Gating
    print("\n▶ CATEGORY 3: API Controllers & Threshold Enforcement")

    overdue_res = get_overdue_purchase_orders()
    check(overdue_res["success"] is True, "get_overdue_purchase_orders returns success = True")
    check(overdue_res["total_overdue"] == 4, f"Overdue PO count is 4 (Got: {overdue_res['total_overdue']})")
    check(overdue_res["risk_breakdown"]["high"] == 2, "High risk count is 2")
    check(overdue_res["risk_breakdown"]["medium"] == 1, "Medium risk count is 1")
    check(overdue_res["risk_breakdown"]["low"] == 1, "Low risk count is 1")

    # Test threshold enforcement without approval token for PO > ₹1,00,000
    blocked_update = update_po_schedule_date(
        po_name="PO-1045",
        new_schedule_date="2026-09-15",
        reason="Vendor delayed",
        approval_token=None
    )
    check(blocked_update["success"] is False, "PO-1045 update without approval token is BLOCKED")
    check(blocked_update["error_code"] == "URY_ERR_THRESHOLD_EXCEEDED", "Returned URY_ERR_THRESHOLD_EXCEEDED error code")
    check(blocked_update["requires_hitl"] is True, "Flagged requires_hitl = True")

    # Test threshold approval WITH token
    approved_update = update_po_schedule_date(
        po_name="PO-1045",
        new_schedule_date="2026-09-15",
        reason="Production delay resolved via Voice Call",
        approval_token="HITL-TOKEN-998811",
        approved_by="Operations Director"
    )
    check(approved_update["success"] is True, "PO-1045 update with approval token SUCCEEDS")
    check(approved_update["status"] == "Confirmed 2026-09-15", "Status updated to Confirmed 2026-09-15")
    check(approved_update["hash"] is not None and len(approved_update["hash"]) == 64, "Audit hash created for update")

    print("\n======================================================================")
    print(f"Total Backend Assertions: {total} | Passed: {passed} | Failed: {failed}")
    print("======================================================================\n")

    if failed > 0:
        sys.exit(1)
    else:
        print("✔ ALL BACKEND VERIFICATIONS PASSED (100% Success Rate).")
        sys.exit(0)

if __name__ == "__main__":
    run_backend_tests()
