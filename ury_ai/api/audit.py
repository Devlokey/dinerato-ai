# -*- coding: utf-8 -*-
"""
Audit Log Controller & Verification API
Whitelisted endpoints for appending and cryptographically verifying immutable audit trails.
"""

try:
    import frappe
except ImportError:
    frappe = None

from ury_ai.services.audit_chain import append_audit_entry, verify_chain_integrity, _in_memory_chain


def whitelist_decorator(fn):
    if frappe and hasattr(frappe, "whitelist"):
        return frappe.whitelist()(fn)
    return fn


@whitelist_decorator
def append_audit_log(agent_id, agent_name, action, object_type, object_id, method, status, approved_by, payload_summary=None):
    """
    Appends a new audit record to the cryptographic hash chain.
    """
    if payload_summary is None:
        payload_summary = {}

    entry = append_audit_entry(
        agent_id=agent_id,
        agent_name=agent_name,
        action=action,
        object_type=object_type,
        object_id=object_id,
        method=method,
        status=status,
        approved_by=approved_by,
        payload_summary=payload_summary
    )
    return {
        "success": True,
        "entry": entry
    }


@whitelist_decorator
def get_audit_logs(limit=50, offset=0, agent_id=None, status=None):
    """
    Fetch audit records with optional filtering and pagination.
    """
    if frappe:
        filters = {}
        if agent_id:
            filters["agent_id"] = agent_id
        if status:
            filters["status"] = status
        logs = frappe.get_all(
            "URY AI Audit Log",
            filters=filters,
            fields=["name", "timestamp", "agent_name", "action", "object_id", "method", "status", "approved_by", "curr_hash", "prev_hash"],
            order_by="timestamp desc",
            limit_start=offset,
            limit_page_length=limit
        )
        return {"success": True, "total": len(logs), "audit_logs": logs}
    else:
        filtered = _in_memory_chain
        if agent_id:
            filtered = [r for r in filtered if r["agent_id"] == agent_id]
        if status:
            filtered = [r for r in filtered if r["status"] == status]
        return {
            "success": True,
            "total": len(filtered),
            "audit_logs": list(reversed(filtered[offset:offset+limit]))
        }


@whitelist_decorator
def verify_audit_integrity():
    """
    Walks SHA-256 hash chain and verifies zero tampering across all audit blocks.
    """
    result = verify_chain_integrity()
    return {
        "success": True,
        "is_intact": result["valid"],
        "total_records_checked": result["total_records"],
        "tamper_detected": not result["valid"],
        "errors": result["errors"]
    }
