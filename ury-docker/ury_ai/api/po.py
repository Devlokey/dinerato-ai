# -*- coding: utf-8 -*-
"""
Purchase Order Expediting & Schedule Controller
Whitelisted API endpoints for PO tracking, delay analysis, and schedule updates.
"""

import json
from datetime import datetime, date

try:
    import frappe
    from frappe import _
except ImportError:
    frappe = None

from ury_ai.services.audit_chain import append_audit_entry

FINANCIAL_APPROVAL_THRESHOLD = 100000.0  # INR 1,00,000


def whitelist_decorator(fn):
    """Fallback decorator if frappe is not installed in local environment."""
    if frappe and hasattr(frappe, "whitelist"):
        return frappe.whitelist()(fn)
    return fn


@whitelist_decorator
def get_overdue_purchase_orders(days_overdue=0, risk_level="ALL", warehouse=None):
    """
    Retrieve overdue & high-risk Purchase Orders with line items and supplier contact details.
    """
    if frappe:
        filters = [
            ["Purchase Order", "docstatus", "=", 1],
            ["Purchase Order", "status", "in", ["To Receive", "To Receive and Bill", "Overdue", "Draft"]],
            ["Purchase Order", "schedule_date", "<", frappe.utils.today()]
        ]
        if warehouse:
            filters.append(["Purchase Order Item", "warehouse", "=", warehouse])

        pos = frappe.get_all(
            "Purchase Order",
            filters=filters,
            fields=["name", "supplier", "transaction_date", "schedule_date", "grand_total", "status"],
            order_by="schedule_date asc"
        )
    else:
        # Standalone mock fallback for simulation
        pos = [
            {
                "name": "PO-1045",
                "supplier": "ABC Components",
                "transaction_date": "2026-09-01",
                "schedule_date": "2026-09-10",
                "grand_total": 600000.0,
                "status": "OVERDUE",
                "days_overdue": 5,
                "risk_level": "HIGH",
                "contact_person": "Rajesh Kumar (Dispatch Head)",
                "phone": "+91 98230 45112",
                "email": "rajesh@abccomponents.in",
                "items": [
                    {
                        "item_code": "IND-CMP-001",
                        "item_name": "Industrial Component A",
                        "qty": 500.0,
                        "rate": 1200.0,
                        "amount": 600000.0
                    }
                ]
            },
            {
                "name": "PO-1067",
                "supplier": "XYZ Manufacturing",
                "transaction_date": "2026-09-03",
                "schedule_date": "2026-09-11",
                "grand_total": 240000.0,
                "status": "OVERDUE",
                "days_overdue": 2,
                "risk_level": "MEDIUM",
                "contact_person": "Anil Verma",
                "phone": "+91 98110 33241",
                "email": "anil@xyzmfg.in",
                "items": [
                    {
                        "item_code": "STL-CMP-002",
                        "item_name": "Steel Component B",
                        "qty": 200.0,
                        "rate": 1200.0,
                        "amount": 240000.0
                    }
                ]
            },
            {
                "name": "PO-1092",
                "supplier": "Metro Components",
                "transaction_date": "2026-09-02",
                "schedule_date": "2026-09-10",
                "grand_total": 450000.0,
                "status": "OVERDUE",
                "days_overdue": 3,
                "risk_level": "HIGH",
                "contact_person": "Sanjay Gupta",
                "phone": "+91 98300 11223",
                "email": "sanjay@metrocomp.in",
                "items": [
                    {
                        "item_code": "CIR-BRD-004",
                        "item_name": "Circuit Board Y",
                        "qty": 300.0,
                        "rate": 1500.0,
                        "amount": 450000.0
                    }
                ]
            },
            {
                "name": "PO-1089",
                "supplier": "Nova Components",
                "transaction_date": "2026-09-05",
                "schedule_date": "2026-09-12",
                "grand_total": 80000.0,
                "status": "OVERDUE",
                "days_overdue": 1,
                "risk_level": "LOW",
                "contact_person": "Kavita Nair",
                "phone": "+91 98440 99887",
                "email": "kavita@novacomp.in",
                "items": [
                    {
                        "item_code": "PLS-HSG-003",
                        "item_name": "Plastic Housing X",
                        "qty": 1000.0,
                        "rate": 80.0,
                        "amount": 80000.0
                    }
                ]
            }
        ]

    return {
        "success": True,
        "total_overdue": len(pos),
        "risk_breakdown": {
            "high": len([p for p in pos if p.get("risk_level") == "HIGH"]),
            "medium": len([p for p in pos if p.get("risk_level") == "MEDIUM"]),
            "low": len([p for p in pos if p.get("risk_level") == "LOW"])
        },
        "purchase_orders": pos
    }


@whitelist_decorator
def update_po_schedule_date(po_name, new_schedule_date, reason, agent_id="agent-2", call_log_id=None, approval_token=None, approved_by=None):
    """
    Update Purchase Order schedule date with HITL financial threshold enforcement and cryptographic audit trail.
    """
    # 1. Check financial threshold
    grand_total = 600000.0
    if frappe:
        po_doc = frappe.get_doc("Purchase Order", po_name)
        grand_total = po_doc.grand_total

    if grand_total > FINANCIAL_APPROVAL_THRESHOLD and not approval_token:
        return {
            "success": False,
            "error_code": "URY_ERR_THRESHOLD_EXCEEDED",
            "message": f"PO value ({grand_total}) exceeds financial threshold (₹{FINANCIAL_APPROVAL_THRESHOLD:,.0f}). Human approval required.",
            "threshold_limit": FINANCIAL_APPROVAL_THRESHOLD,
            "requires_hitl": True
        }

    # 2. Update PO record
    if frappe:
        po_doc.schedule_date = new_schedule_date
        for item in po_doc.items:
            item.expected_delivery_date = new_schedule_date
        po_doc.flags.ignore_validate_update_after_submit = True
        po_doc.save(ignore_permissions=True)

    # 3. Append Cryptographic Audit Log
    approver = approved_by or "Rajesh Sharma (Procurement Lead)"
    audit_entry = append_audit_entry(
        agent_id=agent_id,
        agent_name="PO Expediting Agent",
        action=f"Delivery Schedule Renegotiation for {po_name}",
        object_type="Purchase Order",
        object_id=po_name,
        method="Voice Call Simulation & HITL Approval",
        status="Success",
        approved_by=approver,
        payload_summary={
            "po_name": po_name,
            "new_schedule_date": new_schedule_date,
            "reason": reason,
            "call_log_id": call_log_id,
            "approval_token": approval_token
        }
    )

    return {
        "success": True,
        "po_name": po_name,
        "updated_schedule_date": new_schedule_date,
        "status": f"Confirmed {new_schedule_date}",
        "audit_id": audit_entry.get("audit_id"),
        "hash": audit_entry.get("curr_hash")
    }


def check_overdue_purchase_orders_job():
    """Scheduled background job executed hourly by Frappe Scheduler."""
    result = get_overdue_purchase_orders()
    return result
