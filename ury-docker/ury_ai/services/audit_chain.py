# -*- coding: utf-8 -*-
"""
Cryptographic SHA-256 Hash Chained Audit Engine
Provides immutable audit log entries with verifiable block chaining.
"""

import hashlib
import json
from datetime import datetime

try:
    import frappe
except ImportError:
    frappe = None

_in_memory_chain = []
_seed_hash = "0000000000000000000000000000000000000000000000000000000000000000"


def calculate_hash(prev_hash, timestamp, agent_id, action, object_id, status, approved_by, payload_summary, nonce="0001"):
    """
    Computes deterministic SHA-256 block hash for an audit record.
    """
    payload_str = json.dumps(payload_summary, sort_keys=True)
    payload_hash = hashlib.sha256(payload_str.encode("utf-8")).hexdigest()
    raw = f"{prev_hash}|{timestamp}|{agent_id}|{action}|{object_id}|{status}|{approved_by}|{payload_hash}|{nonce}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def append_audit_entry(agent_id, agent_name, action, object_type, object_id, method, status, approved_by, payload_summary):
    """
    Appends a new audit record to the cryptographic hash chain.
    """
    timestamp = datetime.utcnow().isoformat() + "Z"
    prev_hash = _in_memory_chain[-1]["curr_hash"] if _in_memory_chain else _seed_hash
    audit_id = f"AUD-{1000 + len(_in_memory_chain) + 1}"
    nonce = "0001"

    curr_hash = calculate_hash(
        prev_hash=prev_hash,
        timestamp=timestamp,
        agent_id=agent_id,
        action=action,
        object_id=object_id,
        status=status,
        approved_by=approved_by,
        payload_summary=payload_summary,
        nonce=nonce
    )

    record = {
        "audit_id": audit_id,
        "timestamp": timestamp,
        "agent_id": agent_id,
        "agent_name": agent_name,
        "action": action,
        "object_type": object_type,
        "object_id": object_id,
        "method": method,
        "status": status,
        "approved_by": approved_by,
        "payload_summary": payload_summary,
        "prev_hash": prev_hash,
        "curr_hash": curr_hash,
        "nonce": nonce
    }

    _in_memory_chain.append(record)

    if frappe:
        doc = frappe.new_doc("URY AI Audit Log")
        doc.update(record)
        doc.insert(ignore_permissions=True)

    return record


def verify_chain_integrity(records=None):
    """
    Validates complete SHA-256 hash chain from genesis block to tip.
    """
    chain = records if records is not None else _in_memory_chain
    if not chain:
        return {"valid": True, "total_records": 0, "errors": []}

    errors = []
    expected_prev = _seed_hash

    for idx, rec in enumerate(chain):
        if rec.get("prev_hash") != expected_prev:
            errors.append({
                "index": idx,
                "audit_id": rec.get("audit_id"),
                "reason": f"Broken prev_hash: expected {expected_prev}, found {rec.get('prev_hash')}"
            })

        recomputed = calculate_hash(
            prev_hash=rec.get("prev_hash"),
            timestamp=rec.get("timestamp"),
            agent_id=rec.get("agent_id"),
            action=rec.get("action"),
            object_id=rec.get("object_id"),
            status=rec.get("status"),
            approved_by=rec.get("approved_by"),
            payload_summary=rec.get("payload_summary", {}),
            nonce=rec.get("nonce", "0001")
        )

        if recomputed != rec.get("curr_hash"):
            errors.append({
                "index": idx,
                "audit_id": rec.get("audit_id"),
                "reason": f"Hash mismatch: recomputed {recomputed} vs recorded {rec.get('curr_hash')}"
            })

        expected_prev = rec.get("curr_hash")

    return {
        "valid": len(errors) == 0,
        "total_records": len(chain),
        "errors": errors
    }
