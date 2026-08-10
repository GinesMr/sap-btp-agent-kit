# SAP BTP Knowledge Base

**Agent-friendly. CLI-ready. Source-verified.**

A structured knowledge repository for SAP Business Technology Platform (BTP), designed to feed AI agents, support architects and developers, and serve as a practical reference for building enterprise solutions on BTP.

---

## Purpose

This repository is **not** a copy of SAP documentation. It is a curated, classified, and machine-readable knowledge system that:

- Maps business needs to BTP capabilities.
- Documents services with uniform, agent-consumable fichas.
- Provides agent skills for specific roles and domains.
- Includes templates for evaluation, architecture, security, and implementation.
- Cites official sources and marks unverified content as `REQUIRES_VALIDATION`.

---

## Who Should Use This

| Role | Start Here |
|------|-----------|
| AI Agent (CLI) | `AGENTS.md` → `catalog/agent-service-index.yaml` |
| Platform Architect | `guides/platform-foundations.md` → `guides/architecture-patterns.md` |
| Developer | `guides/application-development.md` → `guides/runtime-environments.md` |
| Integration Architect | `guides/integration-api-management.md` → `guides/connectivity-destinations.md` |
| Security Architect | `guides/security-identity.md` → `templates/threat-model.md` |
| AI Engineer | `guides/ai-capabilities.md` → `guides/agentic-ai-mcp.md` |
| SAP B1 / ERP Integrator | `guides/sap-b1-integration.md` → `examples/sap-b1-agent-platform.md` |

---

## Quick Navigation

### Catalog
- [Service Catalog](catalog/service-catalog.md) — all BTP services with structured fichas
- [Agent Service Index](catalog/agent-service-index.yaml) — YAML for CLI/agent consumption
- [Capability Map](catalog/capability-map.md) — need → service mapping
- [Official Sources](catalog/official-sources.md) — verified URLs and source index
- [Glossary](catalog/glossary.md) — BTP terminology

### Guides
- [Platform Foundations](guides/platform-foundations.md)
- [Account Model & Landscape](guides/account-model-landscape.md)
- [Runtime Environments](guides/runtime-environments.md)
- [Application Development](guides/application-development.md)
- [Security & Identity](guides/security-identity.md)
- [Connectivity & Destinations](guides/connectivity-destinations.md)
- [Integration & API Management](guides/integration-api-management.md)
- [Data & Analytics](guides/data-analytics.md)
- [AI Capabilities](guides/ai-capabilities.md)
- [Automation & Low-Code](guides/automation-low-code.md)
- [Events & Messaging](guides/events-messaging.md)
- [Operations & Observability](guides/operations-observability.md)
- [Commercial & Governance](guides/commercial-governance.md)
- [Deployment, CI/CD & IaC](guides/deployment-cicd-iac.md)
- [Architecture Patterns](guides/architecture-patterns.md)
- [SAP Business One Integration](guides/sap-b1-integration.md)
- [Agentic AI & MCP](guides/agentic-ai-mcp.md)

### Skills
- [Platform Architect](skills/sap-btp-platform-architect/SKILL.md)
- [Developer](skills/sap-btp-developer/SKILL.md)
- [Security](skills/sap-btp-security/SKILL.md)
- [Integration](skills/sap-btp-integration/SKILL.md)
- [AI](skills/sap-btp-ai/SKILL.md)
- [Operations](skills/sap-btp-operations/SKILL.md)
- [SAP B1 + BTP](skills/sap-b1-btp-integration/SKILL.md)

### Templates
- [Service Evaluation](templates/service-evaluation.md)
- [Architecture Decision Record](templates/architecture-decision-record.md)
- [PoC Plan](templates/poc-plan.md)
- [Threat Model](templates/threat-model.md)
- [Implementation Plan](templates/implementation-plan.md)

### Examples
- [Secure API on BTP](examples/secure-api-on-btp.md)
- [On-Premise Connectivity](examples/on-premise-connectivity.md)
- [AI Agent on BTP](examples/ai-agent-on-btp.md)
- [SAP B1 Agent Platform](examples/sap-b1-agent-platform.md)

---

## Content Quality Rules

| Label | Meaning |
|-------|---------|
| `VERIFIED` | Content confirmed against official SAP documentation. |
| `REQUIRES_VALIDATION` | Cannot be confirmed without account, region, or entitlement context. |

Pricing, regional availability, and service plans are always `REQUIRES_VALIDATION` unless sourced from official SAP pricing pages at time of reading.

---

## Official Root Sources

- SAP BTP Help Portal: https://help.sap.com/docs/btp
- SAP Discovery Center: https://discovery-center.cloud.sap/
- SAP Business Accelerator Hub: https://api.sap.com/
- SAP Developers: https://developers.sap.com/

---

## Last Updated

Date: 2026-08-10  
Maintained by: Knowledge base maintainer — update `catalog/official-sources.md` when adding new verified sources.
