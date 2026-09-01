# -*- coding: utf-8 -*-
"""
Empirical Security Challenge: Cryptographic Audit Hash-Chain Tamper Detection
Tests SHA-256 block hashing, chain continuity, and tamper detection under adversarial mutations.
"""

import sys
import os
import copy
import json

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ury_ai.services.audit_chain import (
    calculate_hash,
    append_audit_entry,
    verify_chain_integrity,
    _in_memory_chain,
    _seed_hash
)
from ury_ai.api.audit import get_audit_logs, verify_audit_integrity
from ury_ai.services.scoring_engine import score_supplier_quotes
from ury_ai.api.po import get_overdue_purchase_orders, update_po_schedule_date
from ury_ai.api.sourcing import shortlist_suppliers
from ury_ai.api.rfq import create_rfq
from ury_ai.api.quote import score_quotations
from ury_ai.api.voice import simulate_supplier_call
from ury_ai.api.governance import get_permission_matrix, check_agent_permission

def run_cryptographic_audit_challenges():
    print("======================================================================")
    print("   EMPIRICAL CHALLENGE: Cryptographic Hash-Chain & Backend Security   ")
    print("======================================================================")
    
    passed = 0
    failed = 0

    def assert_eq(actual, expected, msg):
        nonlocal passed, failed
        if actual == expected:
            passed += 1
            print(f"  [PASS] {msg}")
        else:
            failed += 1
            print(f"  [FAIL] {msg} | Expected: {expected}, Got: {actual}")

    def assert_true(cond, msg):
        nonlocal passed, failed
        if cond:
            passed += 1
            print(f"  [PASS] {msg}")
        else:
            failed += 1
            print(f"  [FAIL] {msg} | Condition was False")

    # Clear memory chain for clean test
    _in_memory_chain.clear()

    # Challenge 1: Empty chain integrity
    res = verify_chain_integrity()
    assert_true(res["valid"] and res["total_records"] == 0, "Empty hash chain is valid with 0 records")

    # Challenge 2: Genesis block and sequential chaining
    entry1 = append_audit_entry(
        agent_id="agent-2",
        agent_name="PO Expediting Agent",
        action="PO Anomaly Detection",
        object_type="Purchase Order",
        object_id="PO-1045",
        method="Automated Rule",
        status="Detected",
        approved_by="System",
        payload_summary={"overdue_days": 5, "risk": "HIGH"}
    )
    assert_eq(entry1["prev_hash"], _seed_hash, "Genesis block prev_hash matches 64-char seed hash")
    assert_eq(len(entry1["curr_hash"]), 64, "Genesis block curr_hash is 64 hex characters (SHA-256)")

    # Append 15 entries
    for i in range(2, 16):
        append_audit_entry(
            agent_id=f"agent-{i % 7 + 1}",
            agent_name="Autonomous Agent",
            action=f"Operation {i}",
            object_type="Entity",
            object_id=f"OBJ-{1000 + i}",
            method="Auto",
            status="Processed",
            approved_by="System",
            payload_summary={"step": i, "val": i * 100}
        )

    res = verify_chain_integrity()
    assert_true(res["valid"], "Chain of 15 blocks validates with 100% cryptographic integrity")
    assert_eq(res["total_records"], 15, "Total records count matches 15")
    assert_eq(len(res["errors"]), 0, "Zero errors reported on pristine chain")

    # Challenge 3: Tamper Detection - Payload Alteration on Middle Block (Block #7)
    tampered_chain = copy.deepcopy(_in_memory_chain)
    tampered_chain[6]["payload_summary"]["val"] = 999999  # mutate payload
    tamper_res = verify_chain_integrity(tampered_chain)
    assert_true(not tamper_res["valid"], "Tampering with Block #7 payload is detected")
    assert_true(any(e["index"] == 6 for e in tamper_res["errors"]), "Tamper error explicitly identifies Block #7 (index 6)")

    # Challenge 4: Tamper Detection - Status Mutation on Block #3
    tampered_chain = copy.deepcopy(_in_memory_chain)
    tampered_chain[2]["status"] = "REJECTED_UNAUTHORIZED"
    tamper_res = verify_chain_integrity(tampered_chain)
    assert_true(not tamper_res["valid"], "Tampering with Block #3 status is detected")
    assert_true(any("Hash mismatch" in e["reason"] for e in tamper_res["errors"]), "Hash mismatch correctly flagged")

    # Challenge 5: Tamper Detection - Genesis Block prev_hash Alteration
    tampered_chain = copy.deepcopy(_in_memory_chain)
    tampered_chain[0]["prev_hash"] = "1111111111111111111111111111111111111111111111111111111111111111"
    tamper_res = verify_chain_integrity(tampered_chain)
    assert_true(not tamper_res["valid"], "Tampering with Genesis block prev_hash is detected")
    assert_true(any(e["index"] == 0 for e in tamper_res["errors"]), "Error pinpointed to Genesis block (index 0)")

    # Challenge 6: Tamper Detection - Timestamp Alteration
    tampered_chain = copy.deepcopy(_in_memory_chain)
    tampered_chain[4]["timestamp"] = "1970-01-01T00:00:00Z"
    tamper_res = verify_chain_integrity(tampered_chain)
    assert_true(not tamper_res["valid"], "Backdated timestamp modification is detected")

    # Challenge 7: Tamper Detection - Nonce Modification
    tampered_chain = copy.deepcopy(_in_memory_chain)
    tampered_chain[8]["nonce"] = "0002"
    tamper_res = verify_chain_integrity(tampered_chain)
    assert_true(not tamper_res["valid"], "Nonce alteration is detected")

    # Challenge 8: Tamper Detection - Agent Identity Modification
    tampered_chain = copy.deepcopy(_in_memory_chain)
    tampered_chain[5]["agent_id"] = "rogue-agent-99"
    tamper_res = verify_chain_integrity(tampered_chain)
    assert_true(not tamper_res["valid"], "Agent ID identity spoofing is detected")

    # Challenge 9: Tamper Detection - Block Deletion
    tampered_chain = copy.deepcopy(_in_memory_chain)
    del tampered_chain[4]  # delete block index 4
    tamper_res = verify_chain_integrity(tampered_chain)
    assert_true(not tamper_res["valid"], "Block deletion creates broken hash link and is detected")
    assert_true(any("Broken prev_hash" in e["reason"] for e in tamper_res["errors"]), "Broken link detected at deletion point")

    # Challenge 10: Tamper Detection - Block Insertion
    tampered_chain = copy.deepcopy(_in_memory_chain)
    rogue_block = copy.deepcopy(tampered_chain[2])
    rogue_block["audit_id"] = "AUD-ROGUE"
    tampered_chain.insert(3, rogue_block)
    tamper_res = verify_chain_integrity(tampered_chain)
    assert_true(not tamper_res["valid"], "Rogue block insertion into middle of chain is detected")

    # Challenge 11: Deterministic Serialization under Key Order Changes
    payload_a = {"z": 100, "a": "hello", "m": [1, 2, 3]}
    payload_b = {"a": "hello", "m": [1, 2, 3], "z": 100}
    h_a = calculate_hash(_seed_hash, "2026-09-01T00:00:00Z", "agent-1", "act", "obj", "ok", "user", payload_a)
    h_b = calculate_hash(_seed_hash, "2026-09-01T00:00:00Z", "agent-1", "act", "obj", "ok", "user", payload_b)
    assert_eq(h_a, h_b, "Hash calculation is invariant to dictionary key insertion ordering (sort_keys=True)")

    # Challenge 12: API Verification Endpoint
    api_verify = verify_audit_integrity()
    assert_true(api_verify["success"], "verify_audit_integrity() endpoint returns success: True")
    assert_true(api_verify["is_intact"], "verify_audit_integrity() reports is_intact: True on pristine chain")
    assert_true(not api_verify["tamper_detected"], "verify_audit_integrity() reports tamper_detected: False")

    # Test scoring with quote objects
    test_quotes = [
        {"supplier": "ABC", "unit_price": 1200, "lead_time_days": 10, "on_time_rate": 98},
        {"supplier": "Global", "unit_price": 1120, "lead_time_days": 18, "on_time_rate": 91},
        {"supplier": "Vertex", "unit_price": 1260, "lead_time_days": 8, "on_time_rate": 99}
    ]
    scored = score_supplier_quotes(test_quotes)
    assert_eq(len(scored), 3, "Scoring engine scores all 3 quotes")
    assert_true(all(0.0 <= s["composite_score"] <= 100.0 for s in scored), "All quote scores in range [0, 100]")
    assert_true(scored[0]["rank"] == 1 and scored[0]["is_recommended"], "Top ranked quote marked as recommended")

    # Empty list handling
    assert_eq(score_supplier_quotes([]), [], "Empty quote list returns empty array")

    # Challenge 14: Sourcing and PO Controller Robustness
    shortlisted = shortlist_suppliers(category="Raw Produce", min_rating=4.5)
    assert_true(shortlisted["success"], "shortlist_suppliers returns success")
    assert_true(len(shortlisted["suppliers"]) > 0, "shortlist_suppliers returns candidates")
    for s in shortlisted["suppliers"]:
        assert_true(s["rating"] >= 4.5, f"Supplier {s['name']} meets min_rating 4.5")

    # PO retrieval and detail
    overdue = get_overdue_purchase_orders()
    assert_true(overdue["success"], "get_overdue_purchase_orders returns success")
    assert_true(overdue["total_overdue"] >= 4, "get_overdue_purchase_orders finds overdue POs")

    # HITL financial threshold enforcement on PO-1045
    hitl_blocked = update_po_schedule_date("PO-1045", "2026-09-15", "Rescheduled")
    assert_true(not hitl_blocked["success"], "Update > ₹1,00,000 without approval token is rejected")
    assert_eq(hitl_blocked["error_code"], "URY_ERR_THRESHOLD_EXCEEDED", "Error code URY_ERR_THRESHOLD_EXCEEDED raised")

    hitl_approved = update_po_schedule_date("PO-1045", "2026-09-15", "Rescheduled", approval_token="TOKEN-HITL-1045")
    assert_true(hitl_approved["success"], "Update with approval token succeeds and appends to audit log")

    # Governance & Capability checks
    agent_perms = get_permission_matrix()
    assert_true(agent_perms["success"], "get_permission_matrix returns success")
    assert_eq(len(agent_perms["agents"]), 7, "Permissions matrix returns exactly 7 agents")

    voice_cap = check_agent_permission("agent-4", "makeCalls")
    assert_true(voice_cap["allowed"], "Voice Agent has makeCalls permission")
    voice_appr = check_agent_permission("agent-4", "approvePurchases")
    assert_true(not voice_appr["allowed"], "Voice Agent is strictly blocked from approvePurchases")

    # Voice Call simulation endpoint
    call_res = simulate_supplier_call("PO-1045", "SUP-001")
    assert_true(call_res["success"], "simulate_supplier_call returns success")
    assert_eq(call_res["duration"], 42, "Voice call duration is exactly 42 seconds")
    assert_eq(call_res["extracted_data"]["commitment_date"], "2026-09-15", "Extracted commitment date is Sep 15")

    # RFQ Creation & Quote Scoring endpoints
    rfq_res = create_rfq()
    assert_true(rfq_res["success"], "create_rfq returns success")
    assert_eq(rfq_res["docstatus"], 0, "Created RFQ is in Draft state (docstatus = 0)")

    quote_res = score_quotations("RFQ-104")
    assert_true(quote_res["success"], "score_quotations returns success")
    assert_eq(len(quote_res["quotes"]), 3, "score_quotations ranks 3 received quotes")
    assert_eq(quote_res["recommended_supplier"], quote_res["quotes"][0]["supplier"], "Recommended supplier matches rank #1 quote")

    from ury_ai.api.quote import create_purchase_order_from_quote
    draft_po = create_purchase_order_from_quote(quote_id="QT-104-1", supplier="ABC Components")
    assert_true(draft_po["success"], "create_purchase_order_from_quote succeeds")
    assert_eq(draft_po["docstatus"], 0, "New PO is created in Draft state (docstatus = 0)")

    print("----------------------------------------------------------------------")
    print(f"Cryptographic & Backend Challenges Summary: {passed} passed, {failed} failed")
    print("----------------------------------------------------------------------")
    return failed == 0

if __name__ == "__main__":
    success = run_cryptographic_audit_challenges()
    sys.exit(0 if success else 1)
