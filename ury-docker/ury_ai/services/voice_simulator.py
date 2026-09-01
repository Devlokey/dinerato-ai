# -*- coding: utf-8 -*-
"""
Voice Negotiation Dialogue State Machine & NLP Simulator
Generates deterministic transcripts, waveforms, and entity extraction for phone expediting.
"""


def generate_voice_call_transcript(po_name="PO-1045", supplier_name="ABC Components", item_name="Industrial Component A", qty=500):
    """
    Returns structured dialogue transcript, extracted commitments, and confidence score.
    """
    transcript = [
        {
            "speaker": "DINE AI",
            "text": f"Hello, I'm calling on behalf of Dine Enterprise regarding Purchase Order {po_name} for {qty} units of {item_name}. Could you provide a delivery update?"
        },
        {
            "speaker": "SUPPLIER",
            "text": "Yes, apologies for the delay. We had a production issue but it's resolved. The shipment is ready to go tomorrow morning."
        },
        {
            "speaker": "DINE AI",
            "text": "That's helpful. Can you confirm delivery to our facility by September 15th?"
        },
        {
            "speaker": "SUPPLIER",
            "text": "Yes, confirmed. September 15th delivery."
        }
    ]

    extracted_data = {
        "commitment_date": "2026-09-15",
        "delay_reason": "Production delay resolved. Shipment ready tomorrow morning.",
        "contact_spoken_to": "Rajesh Kumar (Dispatch Head)",
        "confidence_score": 0.94
    }

    return {
        "duration_seconds": 42,
        "transcript": transcript,
        "extracted_data": extracted_data
    }
