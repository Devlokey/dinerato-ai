# Project: URY AI ERP — Autonomous Multi-Agent Procurement & Operations Layer

## Executive Architecture
An enterprise-grade autonomous multi-agent procurement and operations layer integrated into URY ERP (Frappe Framework & ERPNext restaurant management system). It bridges restaurant front-of-house/kitchen demand (URY Order, KOT) with back-of-house procurement (Purchase Orders, RFQs, Supplier Quotations, Inventory Bins, Stock Ledger) via 7 specialized autonomous agents, cryptographic audit trails, an embedded copilot drawer, a simulated voice negotiation engine, and Human-in-the-Loop financial governance.

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 URY AI Embedded Copilot                │
                  │  (Floating Pill Trigger · Context Sync · Live Timeline)│
                  └───────────────┬───────────────────────┬────────────────┘
                                  │                       │
         ┌────────────────────────▼────────┐    ┌─────────▼────────────────────────┐
         │     Primary Workflow Engine     │    │     Secondary Workflow Engine    │
         │     "Chase Overdue POs"         │    │        "Source & RFQ"            │
         │   (Analysis → Voice → HITL)     │    │ (Shortlist → RFQ → Quote Score)  │
         └────────────────┬────────────────┘    └─────────┬────────────────────────┘
                          │                               │
                          └───────────────┬───────────────┘
                                          │
                  ┌───────────────────────▼────────────────────────┐
                  │      7-Agent Core Execution & Governance       │
                  │ 1. Procurement Analyst   5. Sourcing Agent    │
                  │ 2. PO Expediting Agent   6. RFQ Agent          │
                  │ 3. Voice Negotiation     7. Quote Intelligence │
                  │ 4. Supplier Communication                      │
                  └───────────────────────┬────────────────────────┘
                                          │
                  ┌───────────────────────▼────────────────────────┐
                  │    Frappe Custom App (`ury_ai`) & Doc-Events   │
                  │ · Whitelisted REST Controllers (14 APIs)       │
                  │ · ERPNext DocTypes (PO, RFQ, Supplier, Item)   │
                  │ · URY Entities (URY Order, KOT, Kitchen Bins)  │
                  │ · Cryptographic Hash-Chained Audit Trail       │
                  │ · DocStatus State Machine (0=Draft, 1=Submit)  │
                  └────────────────────────────────────────────────┘
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Frappe Custom App Structure | `ury_ai` custom app scaffold, hooks, scheduled tasks, desk/POS injection | M1 | Survey (R1) |
| 2 | ERPNext DocType Integration | Connect agents to PO, Supplier, RFQ, Supplier Quotation, Item, Bin, SLE | M1 | Survey (R1) |
| 3 | URY Restaurant Entity Hooks | Doc-events for URY Order, Kitchen Order Ticket, real-time consumption | M1 | Survey (R1) |
| 4 | DocStatus Lifecycle Governance | State machine transitions across Draft (0), Submitted (1), Cancelled (2) | M1 | Survey (R1) |
| 5 | Whitelisted REST Controllers | 14 `@frappe.whitelist()` endpoints for PO, RFQ, quotes, supplier scoring | M1 | Survey (R1) |
| 6 | Cryptographic Audit Trail | SHA-256 hash-chained immutable audit log (`URY AI Audit Log`) | M1 | Survey (R1) |
| 7 | 7-Agent Core Architecture | Modular classes for Analyst, Expediting, Voice, Comm, Sourcing, RFQ, Quote | M2 | Survey (R2) |
| 8 | Intent Routing Engine | Keyword, regex, fuzzy, and contextual intent classifier routing to agents | M2 | Survey (R2) |
| 9 | Primary Flow: Chase Overdue POs | Risk analysis, supplier contact, simulated voice call, HITL gate, PO update | M2 | Survey (R2) |
| 10 | Secondary Flow: Source & RFQ | Vendor shortlisting, RFQ package creation, quote ingestion, multi-criteria scoring | M2 | Survey (R2) |
| 11 | Agent Permissions Matrix | 7x6 capability governance grid (Read, Write, Email, Call, Approve, Create PO) | M2 | Survey (R2) |
| 12 | Embedded Floating AI Drawer | Bottom-right pill trigger, 380-420px slide-in panel, live system status | M3 | Survey (R3) |
| 13 | Live Page Context Sync | Dynamic sync across 11 routes/DocTypes with context-aware prompt chips | M3 | Survey (R3) |
| 14 | Real-Time Execution Timeline | Monospace timestamped steps with agent badges, spinners, and checkmarks | M3 | Survey (R3) |
| 15 | Voice Call Simulator Overlay | Telephony UI with active timer, animated audio waveform, and dialogue typewriter | M3 | Survey (R3) |
| 16 | HITL Approval Modals | Strict governance modal for transactions > ₹1,00,000 (PO-1045 ₹6,00,000) | M3 | Survey (R3) |
| 17 | 4-Tier Automated Test Suite | 346 tests across Feature Coverage, Boundary, Pairwise, Real-World Scenarios | M4 | Survey (R4) |
| 18 | Adversarial Stress Suite | 1,175 assertions verifying ReDoS, SQLi, XSS, payload floods, state race conditions | M4 | Survey (R4) |
| 19 | Dual-Track Acceptance Signoff | Final automated verification pass guaranteeing 100% compliance across R1-R4 | M4 | Survey (R4) |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Backend & Frappe Integration | Frappe custom app (`ury_ai`), DocType models, DocStatus hooks, 14 whitelisted REST controllers, SHA-256 audit logger | None | DONE |
| M2 | 7-Agent Autonomous Engine | 7 Agent classes, intent classifier, primary "Chase Overdue PO" flow, secondary "Source & RFQ" flow, permissions validator | M1 | DONE |
| M3 | Embedded UI Copilot & Telephony | Floating trigger, context sync drawer, real-time timeline, voice call overlay, HITL modal, permissions UI | M1, M2 | DONE |
| M4 | E2E Verification & Adversarial Suite | 4-tier test runner (346 tests), adversarial stress suite (1,175 assertions), 100% pass verification | M1, M2, M3 | DONE |

## Interface Contracts
### Frappe REST API ↔ Multi-Agent Orchestrator
- `POST /api/method/ury_ai.api.po.get_overdue_pos`: Returns list of overdue POs with risk metrics, supplier info, line items.
- `POST /api/method/ury_ai.api.po.update_delivery_schedule`: Accepts `{ po_name, new_delivery_date, reason, confidence, approver }`, updates PO record, and logs SHA-256 audit entry.
- `POST /api/method/ury_ai.api.sourcing.shortlist_suppliers`: Accepts `{ category, min_rating, required_capacity }`, returns scored vendor list.
- `POST /api/method/ury_ai.api.rfq.create_rfq`: Accepts `{ items, suppliers, schedule_date }`, creates ERPNext RFQ record in Draft state.
- `POST /api/method/ury_ai.api.quote.score_quotations`: Accepts `{ rfq_name }`, evaluates bids across price (40%), delivery speed (35%), reliability (25%), returns ranked recommendation.

### Multi-Agent Orchestrator ↔ UI Copilot
- `orchestrator.executeIntent(intent, context, onStep, onStatusChange)`: Dispatches workflow, emits real-time step events `{ id, timestamp, agent, text, status, icon }`.
- `onVoiceCallStart(callPayload)`: Triggers full-screen interactive telephony overlay with dialogue script and audio waveform.
- `onRequestApproval(approvalPayload)`: Triggers HITL approval modal with financial threshold enforcement.
- `onWorkflowComplete(summaryPayload)`: Emits final completion card and updates mutable ERP state.

## Code Layout
```
├── ury_ai/                            # Frappe custom app
│   ├── hooks.py                       # Doc-events & desk asset bindings
│   ├── api/                           # Whitelisted REST controllers
│   │   ├── po.py                      # PO expediting & schedule updates
│   │   ├── sourcing.py                # Supplier shortlisting
│   │   ├── rfq.py                     # RFQ creation & dispatch
│   │   ├── quote.py                   # Quotation intelligence scoring
│   │   ├── voice.py                   # Call logging & dialogue extraction
│   │   └── audit.py                   # Hash-chained audit verification
│   └── doctypes/                      # Custom DocTypes
├── src/                               # Frontend & In-Memory Agent Engine
│   ├── agents/                        # 7 Core Autonomous Agents
│   │   ├── orchestrator.js            # Central intent router & coordinator
│   │   ├── analystAgent.js            # Stock risk & consumption analysis
│   │   ├── poExpeditingAgent.js       # PO milestone tracking
│   │   ├── voiceAgent.js              # Telephony dialogue & negotiation
│   │   ├── supplierCommunicationAgent.js # Email & messaging dispatch
│   │   ├── sourcingAgent.js           # Supplier discovery & evaluation
│   │   ├── rfqAgent.js                # RFQ packaging
│   │   └── quoteIntelligenceAgent.js  # Quotation ranking matrix
│   ├── components/
│   │   ├── erp/                       # URY ERP / Frappe Desk shell & pages
│   │   └── dineai/                    # Copilot drawer, timeline, voice, HITL
│   ├── context/                       # ERP & Agent reactive contexts
│   └── data/mockData.js               # Initial state (40 POs, 25 Suppliers, 30 RFQs)
└── tests/                             # Verification Harness
    ├── run-all-tests.js               # 4-Tier zero-dependency E2E test runner (346 tests)
    └── adversarial-stress-suite.js    # Adversarial stress harness (1,175 assertions)
```
