# -*- coding: utf-8 -*-
app_name = "ury_ai"
app_title = "URY AI Restaurant Multi-Agent Operations"
app_publisher = "URY ERP Team"
app_description = "Autonomous multi-agent AI procurement and operations layer for URY ERP & ERPNext"
app_email = "dev@ury-erp.org"
app_license = "MIT"

# Inclusion of JavaScript / CSS Assets in Frappe Desk & URY POS
app_include_js = [
    "/assets/ury_ai/js/ury_ai_copilot_drawer.bundle.js"
]
app_include_css = [
    "/assets/ury_ai/css/ury_ai_copilot.css"
]

# Doc-Events: Hooking into ERPNext & URY Restaurant DocTypes
doc_events = {
    "Purchase Order": {
        "on_update": "ury_ai.events.purchase_order.on_po_update",
        "on_submit": "ury_ai.events.purchase_order.on_po_submit",
        "on_cancel": "ury_ai.events.purchase_order.on_po_cancel"
    },
    "Stock Ledger Entry": {
        "after_insert": "ury_ai.events.stock.on_stock_ledger_entry_created"
    },
    "Bin": {
        "on_update": "ury_ai.events.stock.on_bin_update"
    },
    "Kitchen Order Ticket": {
        "on_submit": "ury_ai.events.kitchen.on_kot_submit"
    },
    "URY Order": {
        "on_submit": "ury_ai.events.order.on_ury_order_submit"
    },
    "Supplier Quotation": {
        "on_submit": "ury_ai.events.quotation.on_supplier_quotation_submit"
    }
}

# Scheduled background jobs for autonomous agent sweeps
scheduler_events = {
    "hourly": [
        "ury_ai.api.po.check_overdue_purchase_orders_job"
    ],
    "daily": [
        "ury_ai.api.procurement.compute_daily_restaurant_consumption_job",
        "ury_ai.api.sourcing.update_supplier_performance_indexes_job"
    ]
}

# Standard fixtures to populate initial Agent Permission Matrix & system records
fixtures = [
    {"doctype": "URY AI Agent"},
    {"doctype": "Custom Field", "filters": [["dt", "in", ["Supplier", "Purchase Order", "Supplier Quotation"]]]}
]
