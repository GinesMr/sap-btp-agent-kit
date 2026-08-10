# AGENTS.md — SAP BTP Knowledge Base: Agent Operating Protocol

This file governs how all agents consuming this repository must behave. Rules are mandatory, not optional.

---

## Mandatory Reading Order

Before responding to any SAP BTP question or proposing any solution:

1. Read `catalog/agent-service-index.yaml` — machine-readable service index.
2. Load the relevant `skills/<skill-name>/SKILL.md` for the task type.
3. Treat `catalog/official-sources.md` as the index of truth for external verification.
4. Consult `catalog/capability-map.md` to navigate from need to candidate services.

---

## Response Classification

Every factual claim in a response MUST be labeled:

| Label | Meaning |
|-------|---------|
| `FACT` | Confirmed in official SAP documentation, source cited. |
| `RECOMMENDATION` | Best practice or informed opinion, basis stated. |
| `ASSUMPTION` | Inferred from context, not directly verified. |
| `REQUIRES_VALIDATION` | Cannot be confirmed without checking official docs, entitlements, or account configuration. |

Never present a `REQUIRES_VALIDATION` claim as a `FACT`.

---

## Mandatory Rules

### Services and Availability
- Do not recommend a service without citing its official documentation.
- Never assume a service is available in all regions, accounts, or entitlements.
- Always verify: region, entitlement, service plan, compatible runtime, product status (GA / Beta / Deprecated / Unknown).
- If any of these cannot be confirmed, mark as `REQUIRES_VALIDATION`.

### Security
- Never expose on-premise systems, SAP databases, or internal SAP APIs directly to the Internet.
- Always apply least-privilege: users and services get minimum required permissions.
- Mandate OAuth 2.0 / OIDC for API authentication; no basic auth in production.
- Require secret rotation — no hardcoded credentials in code, config, or environment variables.
- Always define audit logging requirements before production deployment.
- Enforce environment separation: DEV / TEST / PROD with distinct subaccounts and credentials.
- No free SQL against SAP databases from agent-controlled code without a validated business API layer.

### Write Operations
- SAP write operations (create, update, delete business objects) require:
  1. Validated input parameters (schema + business rules).
  2. Authorization check (user role + permission).
  3. Full traceability (user, intent, tool, parameters, result, error).
  4. Human confirmation for high-risk operations (financial postings, mass updates, deletions).

### Cost and Commercials
- Before selecting a service, verify: entitlement availability, service plan, cost model (PAYG / CPEA / subscription), resource limits.
- Never assume Free Tier or Trial availability for production workloads.
- Refer to SAP Discovery Center for current commercial information. Mark pricing as `REQUIRES_VALIDATION` unless sourced from official SAP pricing pages.

### Citations
- Every architectural design must cite the official documents consulted.
- Format: `[Document Title](URL) — verified YYYY-MM-DD`

---

## Standard Agent Workflow

When given a SAP BTP design or implementation problem, follow this sequence:

```
1. UNDERSTAND      → Clarify the problem: systems, users, data, constraints, region.
2. DECOMPOSE       → Identify: data layer, identity, connectivity, runtime, integration needs.
3. CATALOG SEARCH  → Query catalog/agent-service-index.yaml for candidate services.
4. SKILL LOAD      → Select and load the relevant SKILL.md.
5. OFFICIAL CHECK  → Verify candidate services against official SAP documentation.
6. ALTERNATIVES    → Propose at least two architectural options with tradeoffs.
7. ARCHITECTURE    → Define the recommended architecture with components and flows.
8. RISK REGISTER   → List: entitlement risks, security gaps, PoC validations needed.
9. IMPL PLAN       → Use templates/implementation-plan.md to structure the delivery.
10. CHECKLIST      → Use templates/threat-model.md and service-evaluation.md for final review.
```

---

## Skill Selection Guide

| Task Type | Skill to Load |
|-----------|--------------|
| Platform design, account model, landscape | `skills/sap-btp-platform-architect/SKILL.md` |
| Application development, CAP, APIs, SDKs | `skills/sap-btp-developer/SKILL.md` |
| Identity, OAuth, roles, certificates | `skills/sap-btp-security/SKILL.md` |
| Integrations, iFlows, connectors, events | `skills/sap-btp-integration/SKILL.md` |
| AI models, RAG, generative AI, Joule | `skills/sap-btp-ai/SKILL.md` |
| Monitoring, logging, CI/CD, ALM | `skills/sap-btp-operations/SKILL.md` |
| SAP Business One + BTP + MCP | `skills/sap-b1-btp-integration/SKILL.md` |

---

## Antipatterns — Always Avoid

- Recommending deprecated services as the primary solution.
- Proposing architecture without verifying regional availability.
- Connecting LLMs or agents directly to SAP HANA SQL or raw Service Layer.
- Skipping XSUAA / IAS trust configuration for any user-facing application.
- Using single subaccount for DEV + PROD workloads.
- Hardcoding credentials in MTA descriptors, CAP config, or Kubernetes secrets without proper secret management.
- Recommending Python or .NET as first-class BTP runtimes without clarifying containerization requirements.
- Marking PoC patterns as production-ready without validation.

---

## Template Usage

| Situation | Template |
|-----------|---------|
| Evaluating whether to adopt a BTP service | `templates/service-evaluation.md` |
| Recording an architectural decision | `templates/architecture-decision-record.md` |
| Planning a proof of concept | `templates/poc-plan.md` |
| Assessing security threats | `templates/threat-model.md` |
| Structuring implementation | `templates/implementation-plan.md` |

---

## Repository Map

```
sap-btp-knowledge-base/
├── AGENTS.md                        ← You are here. Read first.
├── README.md                        ← Human-readable intro and navigation.
├── catalog/
│   ├── agent-service-index.yaml     ← Machine-readable service index (YAML).
│   ├── service-catalog.md           ← Full service catalog with structured fichas.
│   ├── capability-map.md            ← Need → candidate services mapping.
│   ├── official-sources.md          ← Verified official URLs and source index.
│   └── glossary.md                  ← BTP terminology.
├── guides/                          ← Deep-dive technical guides by domain.
├── skills/                          ← Agent skill files (SKILL.md per role).
├── templates/                       ← Reusable decision and planning templates.
└── examples/                        ← Architecture patterns (not official docs).
```
