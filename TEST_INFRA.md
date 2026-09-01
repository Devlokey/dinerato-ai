# E2E Test Infra: URY AI ERP Multi-Agent System

## Test Philosophy
- Requirement-driven, opaque-box and white-box multi-tier verification.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Combinatorial + Real-World Workload Simulation + Adversarial Stress Testing.
- Pass Criteria: 100% pass rate across all test suites with zero regressions.

## Feature Inventory
| # | Feature | Source | Tier 1 (Req Coverage) | Tier 2 (Boundary & Corner) | Tier 3 (Pairwise Sync) | Tier 4 (Real-World) |
|---|---------|--------|:---------------------:|:--------------------------:|:----------------------:|:-------------------:|
| 1 | Frappe Custom App & REST APIs | ORIGINAL_REQUEST R1 | 25 tests | 25 tests | 6 tests | Journey 1 & 2 |
| 2 | DocType Sync & DocStatus Transitions | ORIGINAL_REQUEST R1 | 20 tests | 20 tests | 5 tests | Journey 1 & 4 |
| 3 | Cryptographic Audit Hash-Chain | ORIGINAL_REQUEST R1 | 15 tests | 15 tests | 4 tests | Journey 1 & 3 |
| 4 | 7-Agent Autonomous Engine | ORIGINAL_REQUEST R2 | 35 tests | 35 tests | 7 tests | Journey 1, 2, 3 |
| 5 | Primary Flow (Chase Overdue POs) | ORIGINAL_REQUEST R2 | 20 tests | 20 tests | 4 tests | Journey 1 |
| 6 | Secondary Flow (Source & RFQ) | ORIGINAL_REQUEST R2 | 20 tests | 20 tests | 4 tests | Journey 2 |
| 7 | Embedded UI Copilot & Context Sync | ORIGINAL_REQUEST R3 | 10 tests | 10 tests | 2 tests | Journey 3 |
| 8 | Voice Call Simulator Overlay | ORIGINAL_REQUEST R3 | 5 tests | 12 tests | 1 test | Journey 1 |
| 9 | HITL Financial Threshold Modal | ORIGINAL_REQUEST R3 | 5 tests | 15 tests | 1 test | Journey 1 |
| **Total** | | | **155 tests** | **152 tests** | **34 tests** | **5 Full Journeys** |

## Test Architecture
- **Master Test Runner**: `tests/run-all-tests.js`
  - Invocable via Node.js CLI.
  - Zero third-party runtime dependencies.
  - Generates structured console output and exit code 0 on 100% pass.
- **Adversarial Stress Suite**: `tests/adversarial-stress-suite.js`
  - High-concurrency stress testing, malformed payloads, injection attempts, ReDoS, state race conditions (1,175 assertions).

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | End-to-End Overdue PO Expediting with Voice Negotiation & HITL | F1, F2, F3, F4, F5, F7, F8, F9 | High |
| 2 | Complete Supplier Sourcing, RFQ Dispatch, Quote Ingestion & Ranking | F1, F2, F3, F4, F6, F7 | High |
| 3 | Cross-Module Context Synchronization & Heuristic Suggestion Generation | F4, F7, F1 | Medium |
| 4 | Audit Tamper Detection & Cryptographic Hash-Chain Integrity | F1, F3, F4 | High |
| 5 | Simultaneous Multi-Agent Intent Concurrency & Cancellation Safety | F4, F5, F6, F7 | High |

## Coverage Thresholds
- Tier 1: ≥ 5 tests per feature (155 total)
- Tier 2: ≥ 5 tests per feature (152 total)
- Tier 3: Pairwise coverage across major feature interactions (34 total)
- Tier 4: ≥ 5 realistic enterprise journeys (5 complete journeys)
- Adversarial Hardening (Tier 5): ≥ 1,000 security/stress assertions (1,175 total)
- Target: 100% pass rate (exit code 0)
