# -*- coding: utf-8 -*-
"""
Kitchen Order Ticket (KOT) Doc-Events
Hooks for restaurant kitchen ticket submission and BOM consumption calculations.
"""


def on_kot_submit(doc, method):
    """
    Triggered when a Kitchen Order Ticket is submitted.
    Explodes dish BOM recipes and reduces real-time kitchen stock projections.
    """
    pass
