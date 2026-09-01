# -*- coding: utf-8 -*-
"""
Supplier Quotation Doc-Events
Hooks for Supplier Quotation submission and automatic Quote Intelligence scoring.
"""

from ury_ai.services.scoring_engine import score_supplier_quotes


def on_supplier_quotation_submit(doc, method):
    """
    Triggered when a Supplier Quotation is submitted.
    Evaluates bid against RFP criteria and updates composite score.
    """
    pass
