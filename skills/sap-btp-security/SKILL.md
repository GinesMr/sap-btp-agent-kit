---
name: sap-btp-security
description: >
  Designs and reviews security for SAP BTP solutions: identity, authorization,
  network, secrets, audit, and compliance. Use when the task involves authentication
  flows, role design, trust configuration, threat modeling, or security review.
---

## Objective

Ensure BTP solutions are secure by design. Define identity architecture, authorization model, network controls, secret management, and compliance posture.

## Problems This Skill Solves

- How to configure SSO for a BTP application?
- How to design OAuth 2.0 flows for service-to-service calls?
- How to federate corporate IdP (Azure AD, Okta) with BTP?
- How to design role collections and authorization?
- What security controls are needed for a go-live?
- How to prevent secrets from leaking?

## Required Reading

1. `catalog/agent-service-index.yaml` — check IAS, XSUAA, Credential Store, Audit Log entries.
2. `guides/security-identity.md` — full security reference.
3. `guides/platform-foundations.md` — account isolation.
4. `templates/threat-model.md` — security assessment template.

## Official Sources to Verify

- Cloud Identity Services (IAS/IPS): https://help.sap.com/docs/cloud-identity-services
- XSUAA: https://help.sap.com/docs/btp/sap-business-technology-platform/authorization-and-trust-management-in-cloud-foundry-environment
- Audit Log: https://help.sap.com/docs/btp/sap-business-technology-platform/audit-log-service
- Credential Store: https://help.sap.com/docs/credential-store

## Reasoning Flow

1. Identify all users and services that interact with the system.
2. Map authentication requirements per actor.
3. Design IAS trust configuration (corporate IdP federation).
4. Define XSUAA scopes and role templates (for CF apps).
5. Map roles to business functions (principle of least privilege).
6. Identify all secrets and plan their storage.
7. Define audit logging requirements.
8. Apply network security rules.
9. Complete threat model (`templates/threat-model.md`).
10. Output: security architecture + go-live checklist.

## Discovery Questions

- Who are the users? Internal employees, external partners, customers?
- What corporate IdP is in use? (Azure AD, Okta, ADFS, LDAP)
- Is MFA required? For all users or just admins?
- What service-to-service calls exist?
- Is principal propagation needed to backend SAP systems?
- What data is sensitive? (PII, financial, confidential business data)
- What compliance requirements apply? (GDPR, SOX, ISO 27001, industry-specific)
- Are there on-premise systems to connect?

## Candidate Services by Need

| Need | Service |
|------|---------|
| User authentication (SSO, MFA) | IAS |
| User provisioning from AD/LDAP | IPS |
| OAuth 2.0 for CF apps | XSUAA |
| Secret storage at runtime | Credential Store |
| Connection config + credentials | Destination Service |
| Compliance audit trail | Audit Log Service |
| Application logging | Cloud Logging |

## Security Rules (Mandatory)

1. IAS as identity provider for all user-facing apps (not direct XSUAA login).
2. MFA for all admin and privileged users.
3. Least privilege: users and services get minimum required permissions.
4. No basic auth in production — OAuth 2.0 or certificates only.
5. No hardcoded credentials — use Credential Store or Destination Service.
6. Separate subaccounts for DEV/TEST/PROD; separate trust configurations.
7. On-premise systems accessible only via Cloud Connector (no inbound exposure).
8. Audit logging enabled for security events, data access, and admin operations.
9. Short token expiry (15-60 min for access tokens; configure refresh separately).
10. HTTPS everywhere — no HTTP in production.

## Antipatterns

- Federating corporate IdP directly to BTP subaccounts without IAS as proxy.
- Using shared admin accounts.
- Storing secrets in MTA descriptors, Kubernetes ConfigMaps (not Secrets), or Git.
- Giving CF org admin access to all developers.
- No audit logging in production.
- Same role collection used across DEV and PROD.
- Not testing end-to-end login before go-live.

## Output Checklist

- [ ] Identity provider (IAS) configured.
- [ ] Corporate IdP federation documented.
- [ ] MFA policy defined.
- [ ] XSUAA scopes and roles designed (CF apps).
- [ ] Role collections mapped to business roles.
- [ ] All secrets identified and storage planned.
- [ ] Audit log events defined.
- [ ] Network controls specified (Cloud Connector, HTTPS, HANA IP allowlist).
- [ ] Token expiry configured.
- [ ] Threat model completed.
- [ ] Security checklist reviewed.

## Response Format

```
## Security Architecture

### Identity and Authentication
[IAS configuration, corporate IdP federation, MFA]

### Authorization Model
[XSUAA scopes, role templates, role collections]

### Secret Management
[What secrets exist, where stored, rotation plan]

### Network Security
[Cloud Connector usage, HTTPS, IP restrictions]

### Audit and Compliance
[Audit log events, retention, compliance mapping]

### Threat Model Summary
[Key threats and mitigations — reference templates/threat-model.md]

### Sources Consulted
[Document + URL — verified YYYY-MM-DD]
```

## REQUIRES_VALIDATION Triggers

- Certificate-based authentication setup specifics not confirmed.
- Specific compliance certification status of a BTP service.
- Custom IAS authentication policies beyond standard configuration.
- Private Link Service availability for specific region.
