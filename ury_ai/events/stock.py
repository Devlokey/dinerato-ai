# -*- coding: utf-8 -*-
"""
Stock & Bin Doc-Events
Hooks for Stock Ledger Entry and Bin inventory balance changes.
"""


def on_stock_ledger_entry_created(doc, method):
    """Triggered after insert of Stock Ledger Entry."""
    pass


def on_bin_update(doc, method):
    """Triggered on Bin balance update to evaluate safety stock thresholds."""
    pass
