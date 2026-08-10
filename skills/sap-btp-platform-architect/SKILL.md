---
name: sap-btp-platform-architect
description: >
  Designs SAP BTP platform architecture: account model, subaccount strategy,
  region selection, environment choice, entitlements, security foundations,
  and governance. Use when the task involves structuring a BTP landscape,
  choosing runtimes, or planning platform adoption.
---

## Objective

Design sound, secure, and cost-efficient SAP BTP platform architectures. Translate business and technical requirements into account structures, service selections, and deployment strategies.

## Problems This Skill Solves

- Which runtime? (CF vs Kyma vs ABAP)
- How to structure subaccounts for a project or enterprise?
- What entitlements are needed and in which region?
- How to set up DEV/TEST/PROD separation?
- How to govern a multi-team BTP landscape?

## Required Reading

1. `catalog/agent-service-index.yaml` — verify candidate services.
2. `guides/platform-foundations.md` — account model fundamentals.
3. `guides/account-model-landscape.md` — hierarchy and region strategy.
4. `guides/runtime-environments.md` — CF vs Kyma vs ABAP.
5. `guides/security-identity.md` — mandatory security foundations.
6. `guides/commercial-governance.md` — cost models and governance.

## Official Sources to Verify

- Account model: https://help.sap.com/docs/btp/sap-business-technology-platform/account-model
- Regions: https://help.sap.com/docs/btp/sap-business-technology-platform/regions
- Service availability: https://discovery-center.cloud.sap/serviceCatalog

## Reasoning Flow

1. Identify the organization's systems, teams, regions, and compliance requirements.
2. Consult `catalog/agent-service-index.yaml` for candidate services.
3. Read `guides/platform-foundations.md` and `guides/account-model-landscape.md`.
4. Verify service and runtime availability in the required region.
5. Propose subaccount structure (minimum: DEV, TEST, PROD).
6. Select runtime(s) based on team skills and workload type.
7. Identify entitlements needed per subaccount.
8. Define identity and security foundations (IAS, XSUAA, trust).
9. Estimate cost drivers; flag REQUIRES_VALIDATION for pricing.
10. Output: architecture diagram (text), service list, entitlement list, risk register.

## Discovery Questions

- What regions are required (data residency, user geography)?
- What environments: CF, Kyma, ABAP, or combination?
- What is the team's language expertise (Node.js, Java, ABAP)?
- How many projects/teams will share this BTP contract?
- What on-premise systems exist? SAP B1, S/4HANA, other?
- What are the compliance requirements (GDPR, SOC2, industry)?
- What commercial model is in place? CPEA, PAYG, Trial?
- Is multi-tenancy (SaaS) a requirement?

## Candidate Services by Need

| Need | Services |
|------|---------|
| App runtime | CF, Kyma, ABAP Environment |
| Identity | IAS, XSUAA, IPS |
| Database | HANA Cloud |
| Secrets | Credential Store |
| Audit | Audit Log Service |
| Admin tooling | BTP CLI, Terraform BTP Provider |
| Cost tracking | BTP Cockpit usage analytics |

## Security Rules

- Separate subaccount for every environment (DEV/TEST/PROD).
- IAS as central identity provider for all user-facing apps.
- Restrict global account admin to 2-3 named individuals.
- No shared credentials between environments.
- Data residency region must match compliance requirements.

## Antipatterns

- DEV and PROD in the same subaccount.
- Assuming all services available in all regions without checking.
- Choosing Kyma for teams without Kubernetes expertise.
- Recommending ABAP Environment for non-ABAP projects.
- Ignoring entitlement planning until deployment day.

## Output Checklist

- [ ] Subaccount layout defined (name, region, purpose, environment).
- [ ] Runtime selected and justified.
- [ ] Entitlements per subaccount listed.
- [ ] Region validated for all required services at Discovery Center.
- [ ] Identity and trust configuration described.
- [ ] Cost drivers identified; pricing marked REQUIRES_VALIDATION.
- [ ] Risk register with REQUIRES_VALIDATION items.
- [ ] Next step: service evaluation template or PoC plan.

## Response Format

```
## Platform Architecture Recommendation

### Subaccount Structure
[Table of subaccounts with: name, region, environment, purpose]

### Runtime Justification
[Why CF / Kyma / ABAP for this use case]

### Required Entitlements
[Service, plan, subaccount]

### Identity Configuration
[IAS trust setup, XSUAA or OIDC, role collections approach]

### Cost Drivers
[Key services and cost factors — all marked REQUIRES_VALIDATION]

### Risks and Validations Needed
[REQUIRES_VALIDATION items]

### Sources Consulted
[Document + URL — verified YYYY-MM-DD]
```

## REQUIRES_VALIDATION Triggers

Mark as REQUIRES_VALIDATION if:
- Service availability in region is not confirmed.
- Pricing or plan limits are referenced.
- Kyma or ABAP environment availability in a specific region.
- Multi-tenancy patterns not directly verified.
- IaC (Terraform) provider features not confirmed.
