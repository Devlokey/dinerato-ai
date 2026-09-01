# -*- coding: utf-8 -*-
"""
Agent Governance & Permissions Controller
Whitelisted endpoints for capability verification and financial threshold governance.
"""

try:
    import frappe
except ImportError:
    frappe = None

AGENT_PERMISSIONS_MATRIX = {
    "agent-1": {
        "name": "Procurement Analyst Agent",
        "readData": True,
        "writeData": False,
        "sendEmails": False,
        "makeCalls": False,
        "approvePurchases": False,
        "createPOs": False
    },
    "agent-2": {
        "name": "PO Expediting Agent",
        "readData": True,
        "writeData": True,
        "sendEmails": False,
        "makeCalls": False,
        "approvePurchases": False,
        "createPOs": False
    },
    "agent-3": {
        "name": "Supplier Communication Agent",
        "readData": True,
        "writeData": False,
        "sendEmails": True,
        "makeCalls": False,
        "approvePurchases": False,
        "createPOs": False
    },
    "agent-4": {
        "name": "Voice Negotiation Agent",
        "readData": True,
        "writeData": False,
        "sendEmails": False,
        "makeCalls": True,
        "approvePurchases": False,
        "createPOs": False
    },
    "agent-5": {
        "name": "Sourcing Agent",
        "readData": True,
        "writeData": False,
        "sendEmails": False,
        "makeCalls": False,
        "approvePurchases": False,
        "createPOs": False
    },
    "agent-6": {
        "name": "RFQ Agent",
        "readData": True,
        "writeData": True,
        "sendEmails": True,
        "makeCalls": False,
        "approvePurchases": False,
        "createPOs": True
    },
    "agent-7": {
        "name": "Quote Intelligence Agent",
        "readData": True,
        "writeData": False,
        "sendEmails": False,
        "makeCalls": False,
        "approvePurchases": False,
        "createPOs": False
    }
}


def whitelist_decorator(fn):
    if frappe and hasattr(frappe, "whitelist"):
        return frappe.whitelist()(fn)
    return fn


@whitelist_decorator
def get_permission_matrix():
    """
    Returns the complete 7-agent capability matrix across 6 permission dimensions.
    """
    return {
        "success": True,
        "agents": AGENT_PERMISSIONS_MATRIX
    }


@whitelist_decorator
def check_agent_permission(agent_id, capability):
    """
    Validates whether a specific agent has permission to execute a capability.
    """
    agent = AGENT_PERMISSIONS_MATRIX.get(agent_id)
    if not agent:
        return {"success": False, "allowed": False, "error": f"Unknown agent_id: {agent_id}"}

    allowed = bool(agent.get(capability, False))
    return {
        "success": True,
        "agent_id": agent_id,
        "agent_name": agent["name"],
        "capability": capability,
        "allowed": allowed
    }
