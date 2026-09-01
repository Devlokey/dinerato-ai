# -*- coding: utf-8 -*-
"""
Multi-Criteria Quotation Scoring Engine
Weights: Price (40%), Delivery Speed / Lead Time (35%), Historical Reliability (25%)
"""


def score_supplier_quotes(quotes, weights=None):
    """
    Computes composite normalized scores for a list of supplier quotations.
    """
    if weights is None:
        weights = {"price": 0.40, "lead_time": 0.35, "reliability": 0.25}

    if not quotes:
        return []

    min_price = min(q["unit_price"] for q in quotes)
    min_lead = min(q["lead_time_days"] for q in quotes)

    scored = []
    for q in quotes:
        # Price score: lower is better (ratio of min_price / price)
        price_score = (min_price / q["unit_price"]) * 100.0
        # Lead time score: shorter is better (ratio of min_lead / lead_time)
        lead_score = (min_lead / q["lead_time_days"]) * 100.0
        # Reliability score: on-time percentage (0-100)
        rel_score = float(q["on_time_rate"])

        composite = (
            weights["price"] * price_score +
            weights["lead_time"] * lead_score +
            weights["reliability"] * rel_score
        )

        scored.append({
            **q,
            "price_score": round(price_score, 1),
            "lead_time_score": round(lead_score, 1),
            "reliability_score": round(rel_score, 1),
            "composite_score": round(composite, 1)
        })

    # Sort descending by composite score
    scored.sort(key=lambda x: x["composite_score"], reverse=True)

    for idx, s in enumerate(scored):
        s["rank"] = idx + 1
        s["is_recommended"] = (idx == 0)

    return scored
