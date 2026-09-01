# -*- coding: utf-8 -*-
"""
Voice Negotiation Agent API Controller
Whitelisted endpoints for telephony dialogue execution, transcript logging, and NLP extraction.
"""

try:
    import frappe
except ImportError:
    frappe = None

from ury_ai.services.voice_simulator import generate_voice_call_transcript
from ury_ai.services.audit_chain import append_audit_entry


def whitelist_decorator(fn):
    if frappe and hasattr(frappe, "whitelist"):
        return frappe.whitelist()(fn)
    return fn


@whitelist_decorator
def simulate_supplier_call(po_name="PO-1045", supplier_id="SUP-001", agent_id="agent-4"):
    """
    Simulate phone dialogue with supplier and extract delivery commitment date.
    """
    call_sim = generate_voice_call_transcript(po_name=po_name)
    call_id = f"CALL-{po_name.replace('PO-', '')}"

    if frappe:
        call_doc = frappe.new_doc("URY AI Call Log")
        call_doc.po_reference = po_name
        call_doc.duration_seconds = call_sim["duration_seconds"]
        call_doc.extracted_commitment_date = call_sim["extracted_data"]["commitment_date"]
        call_doc.extracted_delay_reason = call_sim["extracted_data"]["delay_reason"]
        call_doc.confidence_score = call_sim["extracted_data"]["confidence_score"] * 100.0
        call_doc.insert(ignore_permissions=True)
        call_id = call_doc.name

    audit_entry = append_audit_entry(
        agent_id=agent_id,
        agent_name="Voice Agent",
        action=f"Autonomous Telephone Negotiation with Supplier re: {po_name}",
        object_type="Purchase Order",
        object_id=po_name,
        method="Simulated Telephony Voice Call (42s)",
        status="Completed",
        approved_by="System (Automated)",
        payload_summary={
            "po_name": po_name,
            "call_id": call_id,
            "duration": call_sim["duration_seconds"],
            "commitment_date": call_sim["extracted_data"]["commitment_date"],
            "confidence": call_sim["extracted_data"]["confidence_score"]
        }
    )

    return {
        "success": True,
        "call_id": call_id,
        "duration": call_sim["duration_seconds"],
        "confidence": call_sim["extracted_data"]["confidence_score"],
        "extracted_data": call_sim["extracted_data"],
        "transcript": call_sim["transcript"],
        "audit_id": audit_entry.get("audit_id")
    }
