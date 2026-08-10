---
name: sap-btp-developer
description: >
  Guides application development on SAP BTP: CAP, Cloud SDK, BAS, Fiori,
  ABAP RAP, and deployment. Use when the task involves building, structuring,
  or debugging a BTP application. Also covers language support and tooling choices.
---

## Objective

Provide actionable development guidance for building applications on SAP BTP. Focus on correct patterns, security integration, and deployment.

## Problems This Skill Solves

- How to structure a CAP project?
- How to call S/4HANA or SAP B1 from a BTP app?
- Which language and framework to use?
- How to authenticate users and authorize operations?
- How to deploy to CF or Kyma?
- How to test a CAP or Fiori application?

## Required Reading

1. `catalog/agent-service-index.yaml` — check candidate services.
2. `guides/application-development.md` — frameworks, languages, tools.
3. `guides/runtime-environments.md` — CF, Kyma, ABAP.
4. `guides/security-identity.md` — auth patterns.
5. `guides/connectivity-destinations.md` — calling remote systems.

## Official Sources to Verify

- CAP: https://cap.cloud.sap/docs/
- Cloud SDK Java: https://sap.github.io/cloud-sdk/
- Cloud SDK JS: https://sap.github.io/cloud-sdk/docs/js/getting-started
- BAS: https://help.sap.com/docs/bas
- API catalog: https://api.sap.com/

## Reasoning Flow

1. Clarify what the app must do: data, users, integrations, runtime.
2. Select language + framework (Node.js/CAP, Java/CAP, ABAP RAP, or Python/container).
3. Consult `catalog/agent-service-index.yaml` for required services.
4. Design data model (CDS entities for CAP).
5. Design service layer (CDS service + handlers).
6. Plan authentication (XSUAA for CF, IAS OIDC for Kyma).
7. Plan data layer (HANA Cloud + HDI for production).
8. Plan external connectivity (Destination Service + Cloud SDK).
9. Define deployment (MTA for CF, Helm for Kyma).
10. Provide code patterns and checklist.

## Discovery Questions

- Node.js or Java? (or ABAP for ABAP teams)
- CF or Kyma runtime?
- What external systems must the app call? (S/4HANA, B1, third-party API?)
- Is multi-tenancy required?
- Is Fiori UI needed?
- What is the team's testing strategy?
- Local development or cloud-only?

## Candidate Services by Task

| Task | Services |
|------|---------|
| OData/REST API backend | CAP + CF or Kyma |
| SAP system connectivity | Cloud SDK + Destination Service |
| UI development | BAS, Fiori Elements, HTML5 App Repo |
| Database | HANA Cloud |
| Auth | XSUAA (CF), IAS (Kyma) |
| AI-assisted dev | Build Code + Joule |

## Security Rules

- Always integrate XSUAA (CF) or IAS OIDC (Kyma) — no anonymous production endpoints.
- Use CDS annotations for declarative authorization (not manual role checks in handlers).
- No hardcoded credentials — use service bindings and Destination Service.
- Validate all user input before calling external systems.
- Use `@cds.on.insert: $user` for automatic user tracking.

## Antipatterns

- Using Python or .NET without acknowledging the lack of native CAP/SDK support.
- Deploying to production with SQLite (local dev only).
- Hardcoding SAP system URLs or credentials in code.
- Skipping XSUAA authorization (no `@requires` annotations).
- Using `SELECT *` without pagination on large HANA tables.
- Ignoring MTA — using raw `cf push` for multi-module apps.

## Output Checklist

- [ ] Language and framework justified.
- [ ] CDS data model drafted (if CAP).
- [ ] Service API defined.
- [ ] Authentication mechanism described.
- [ ] Authorization annotations or logic included.
- [ ] External systems called via Destination Service / Cloud SDK.
- [ ] Deployment method (MTA or Helm) described.
- [ ] Security checklist covered.
- [ ] Sources cited.

## Response Format

```
## Development Approach

### Technology Stack
[Language, framework, runtime, key libraries]

### Data Model (CDS or schema)
[Entity definitions]

### Service API
[Endpoints, operations, authorization]

### External Connectivity
[Destination names, auth types, Cloud SDK usage]

### Deployment
[MTA structure or Kyma manifests]

### Key Code Patterns
[Relevant code snippets]

### Sources Consulted
[Document + URL — verified YYYY-MM-DD]
```

## REQUIRES_VALIDATION Triggers

- Language/SDK compatibility with a specific BTP service not confirmed.
- Joule or Build Code availability in specific region.
- Third-party library behavior with XSUAA not verified.
- Feature flags or CAP-experimental features.
