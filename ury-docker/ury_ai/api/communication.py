# -*- coding: utf-8 -*-
"""
Supplier Communication Agent API Controller
Whitelisted endpoints for email dispatches, notification tracking, and audit logging.
"""

try:
    import frappe
except ImportError:
    frappe = None

from ury_ai.services.audit_chain import append_audit_entry


def whitelist_decorator(fn):
    if frappe and hasattr(frappe, "whitelist"):
        return frappe.whitelist()(fn)
    return fn


@whitelist_decorator
def send_supplier_notification(recipient_email, subject, message_body, po_reference=None, agent_id="agent-3"):
    """
    Dispatches automated email or notification update with audit tracking.
    """
    if frappe:
        frappe.sendmail(
            recipients=[recipient_email],
            subject=subject,
            message=message_body
        )

    audit_entry = append_audit_entry(
        agent_id=agent_id,
        agent_name="Supplier Communication Agent",
        action=f"Dispatched Confirmation Email to {recipient_email}",
        object_type="Purchase Order" if po_reference else "Supplier Notification",
        object_id=po_reference or recipient_email,
        method="Automated Email Broadcast",
        status="Sent",
        approved_by="System (Automated)",
        payload_summary={
            "recipient": recipient_email,
            "subject": subject,
            "po_reference": po_reference
        }
    )

    return {
        "success": True,
        "recipient": recipient_email,
        "subject": subject,
        "delivery_status": "SENT",
        "audit_id": audit_entry.get("audit_id")
    }
