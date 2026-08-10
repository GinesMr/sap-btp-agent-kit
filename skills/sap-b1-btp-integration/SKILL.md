---
name: sap-b1-btp-integration
description: >
  Designs integration between SAP Business One (on-premise) and SAP BTP,
  including agentic AI patterns using MCP and Service Layer. Use when the task
  involves connecting SAP B1 to BTP, building AI assistants for B1, or designing
  hybrid ERP + cloud architectures.
---

## Objective

Design secure, validated, and production-grade integrations between SAP Business One and SAP BTP. Enforce mandatory safety rules for AI agent access to B1 data and operations.

## Problems This Skill Solves

- How to connect SAP B1 (on-premise) to BTP applications?
- How to build an AI assistant that can read and act on SAP B1?
- What is the secure architecture for LLM + B1 Service Layer?
- How to design MCP tools for SAP B1 operations?
- What can live on BTP and what must stay on-premise?

## Required Reading

1. `catalog/agent-service-index.yaml` — Cloud Connector, Destination, AI Core entries.
2. `guides/sap-b1-integration.md` — full B1 integration reference.
3. `guides/agentic-ai-mcp.md` — MCP and agent patterns.
4. `guides/connectivity-destinations.md` — Cloud Connector and Destination setup.
5. `guides/security-identity.md` — authentication and authorization.

## Official Sources to Verify

- SAP B1 Service Layer: https://help.sap.com/docs/SAP_BUSINESS_ONE_SERVICE_LAYER
- SAP Business Accelerator Hub (B1 APIs): https://api.sap.com/package/SAPB1/overview
- Cloud Connector: https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/cloud-connector
- SAP AI Core: https://help.sap.com/docs/sap-ai-core

## Reasoning Flow

1. Confirm SAP B1 version and deployment (on-premise, hosted).
2. Confirm Service Layer is installed and HTTPS-accessible on internal network.
3. Design Cloud Connector setup (install on customer network, connect to BTP).
4. Design Destination Service entry for Service Layer.
5. Design BTP application layer (CAP or MCP server as the typed business API).
6. Define tool inventory: what B1 operations can the AI trigger?
7. Apply risk classification to each tool (read / low-risk write / high-risk write).
8. Define authorization per tool (user roles).
9. Define logging per operation.
10. Define human approval thresholds.
11. Mark any unconfirmed patterns as PoC requiring validation.

## Discovery Questions

- What SAP B1 version and database (SQL Server or HANA)?
- Is Service Layer already installed? Is it HTTPS-configured?
- What operations must the integration support? (read orders, create quotes, etc.)
- Is there an AI assistant use case? What tools should the agent have?
- What user roles access the system? (sales, warehouse, finance, etc.)
- What is the approval policy for creates/updates/deletes?
- What logging/compliance requirements apply?
- What BTP services are already in place?

## Architecture (Standard)

```
User / AI Assistant
    ↓ IAS authenticated
BTP Application (CAP / MCP Server) — Authorization layer
    ↓ Destination (OnPremise)
Cloud Connector (on customer network)
    ↓ secure tunnel
SAP B1 Service Layer (on-premise, HTTPS)
    ↓
SAP Business One + HANA
```

## Tool Risk Classification

| Tool Category | Risk | Approval Required |
|---------------|------|-------------------|
| Read (get customer, list orders, check stock) | Low | None |
| Create draft/quote | Medium | Soft confirm from user |
| Create order / invoice | High | Explicit user confirm |
| Cancel / close document | High | Explicit user confirm |
| Modify master data | Very High | Senior approval + audit |
| Financial posting | Critical | Manual only — never AI-automated |

## Mandatory Security Rules

1. SAP B1 server never exposed directly to Internet.
2. All BTP → B1 access via Cloud Connector tunnel.
3. LLMs must never directly call B1 Service Layer — always via typed API or MCP.
4. Service Layer user: dedicated technical account with minimum permissions.
5. User identity tracked separately through the application layer (not via B1 session user).
6. Every operation logged: user, intent, tool, parameters, result, timestamp.
7. Human approval required for write operations above risk threshold.
8. No raw SQL against B1 HANA from any automated process.

## Antipatterns

- LLM generating OData queries sent directly to Service Layer.
- Using B1 admin user as the technical service account.
- Exposing Service Layer to the Internet (even with auth).
- No logging of AI-initiated B1 operations.
- Auto-approving invoice creation or financial operations.
- Treating this pattern as production-ready without PoC validation.

## Output Checklist

- [ ] Cloud Connector installed and connected to BTP subaccount.
- [ ] Service Layer accessible via HTTPS on internal network.
- [ ] Destination configured (URL, OnPremise proxy, auth).
- [ ] BTP application layer designed (typed API / MCP server).
- [ ] Tool inventory defined with risk classification.
- [ ] Authorization per tool mapped to user roles.
- [ ] Logging plan for all operations.
- [ ] Human approval mechanism for high-risk operations.
- [ ] Unconfirmed patterns explicitly marked as PoC.
- [ ] PoC plan created (use `templates/poc-plan.md`).

## Response Format

```
## SAP B1 + BTP Integration Design

### Architecture
[Text diagram: User → BTP App → Cloud Connector → B1 Service Layer]

### What Lives Where
[BTP components vs on-premise components]

### Connectivity Setup
[Cloud Connector, Destination Service configuration]

### Tool / API Design
[Tool list, inputs, validation, risk level, approval requirement]

### Authorization Model
[User roles → allowed tools]

### Logging and Audit
[What is logged, where, for how long]

### PoC Validation Plan
[What must be validated before production]

### Sources Consulted
[Document + URL — verified YYYY-MM-DD]
```

## REQUIRES_VALIDATION Triggers

- Official SAP MCP SDK or framework for BTP.
- Integration Suite pre-built content for SAP B1.
- SAP B1 Integration Hub availability and supported operations.
- Specific Service Layer OData operations for B1 version.
- Performance characteristics of Service Layer under agent load.
- Any pattern where LLM directly controls B1 write operations without a typed intermediary.
