# -*- coding: utf-8 -*-
"""
Purchase Order Doc-Events
Hooks for on_update, on_submit, and on_cancel on Purchase Order records.
"""

from ury_ai.services.audit_chain import append_audit_entry


def on_po_update(doc, method):
    """Triggered when a Purchase Order is modified."""
    # Check if PO is overdue and notify PO Expediting Agent
    pass


def on_po_submit(doc, method):
    """Triggered when a Purchase Order transitions to Submitted (docstatus=1)."""
    append_audit_entry(
        agent_id="agent-2",
        agent_name="PO Expediting Agent",
        action=f"PO Submitted: {doc.name}",
        object_type="Purchase Order",
        object_id=doc.name,
        method="Doc-Event Hook (on_submit)",
        status="Submitted",
        approved_by=getattr(doc, "modified_by", "System (Automated)"),
        payload_summary={
            "po_name": doc.name,
            "supplier": getattr(doc, "supplier", ""),
            "grand_total": getattr(doc, "grand_total", 0.0),
            "docstatus": 1
        }
    )


def on_po_cancel(doc, method):
    """Triggered when a Purchase Order is cancelled (docstatus=2)."""
    append_audit_entry(
        agent_id="agent-2",
        agent_name="PO Expediting Agent",
        action=f"PO Cancelled: {doc.name}",
        object_type="Purchase Order",
        object_id=doc.name,
        method="Doc-Event Hook (on_cancel)",
        status="Cancelled",
        approved_by=getattr(doc, "modified_by", "System (Automated)"),
        payload_summary={
            "po_name": doc.name,
            "docstatus": 2
        }
    )
