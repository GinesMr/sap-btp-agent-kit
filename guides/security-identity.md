# Security & Identity — SAP BTP

Security design is not optional in BTP. Every application deployment requires deliberate identity, authorization, and network decisions. This guide covers the mandatory security architecture for BTP solutions.

**Official sources:**
- Cloud Identity Services: https://help.sap.com/docs/cloud-identity-services
- XSUAA: https://help.sap.com/docs/btp/sap-business-technology-platform/authorization-and-trust-management-in-cloud-foundry-environment
- Audit Log: https://help.sap.com/docs/btp/sap-business-technology-platform/audit-log-service

**Last verified:** 2026-08-10

---

## Identity Architecture on BTP

BTP uses a layered identity model:

```
Corporate IdP (Azure AD, Okta, ADFS)
    ↓ Federation (SAML / OIDC)
SAP IAS (Identity Authentication Service)
    ↓ Propagation
XSUAA (Cloud Foundry) / Kyma OIDC
    ↓ JWT token
BTP Application
```

**Key principle:** IAS is the recommended identity hub. It acts as a proxy between corporate IdPs and BTP, decoupling applications from specific corporate directories.

---

## SAP Identity Authentication Service (IAS)

**What it does:**
- Authenticates users via SAML 2.0, OpenID Connect (OIDC), and custom forms.
- Acts as corporate IdP proxy (corporate IdP → IAS → BTP app).
- Enforces MFA, risk-based authentication, and conditional access.
- Each BTP global account comes with one IAS tenant.

**Authentication flows:**
- **OIDC Authorization Code:** Standard for browser-based applications.
- **Client Credentials:** Machine-to-machine (no user involved).
- **SAML Federation:** Enterprise SSO with corporate directories.

**Security rules:**
- Always enable MFA for admin users.
- Configure risk-based authentication (block suspicious logins).
- Use IAS as proxy, not as primary corporate directory.
- Keep IAS admin accounts separate from SAP S-User accounts.

**Official docs:** https://help.sap.com/docs/cloud-identity-services

---

## SAP Identity Provisioning Service (IPS)

**What it does:**
- Automates user and group lifecycle between identity systems using SCIM.
- Sources: LDAP, Active Directory, Azure AD, IAS, SAP systems.
- Targets: IAS, BTP subaccounts, SAP cloud products.

**Provisioning flows:**
- **Source → Target:** Users created in source are synced to target.
- **Read jobs:** One-way sync on schedule.
- **Write jobs:** Provision to target on-demand.

**Security rules:**
- Deprovision users promptly when they leave the organization.
- Map groups, not individual users, for role assignment.
- Audit provisioning jobs regularly.

**Official docs:** https://help.sap.com/docs/cloud-identity-services

---

## XSUAA — Authorization in Cloud Foundry

**What it does:**
- Issues OAuth 2.0 JWT access tokens for CF applications.
- Manages scopes, role templates, and role collections.
- Handles token exchange to call backend SAP systems.

**Key concepts:**

| Concept | Description |
|---------|-------------|
| Scope | Named permission (e.g., `app.read`, `app.write`) |
| Role Template | Named set of scopes defined in `xs-security.json` |
| Role | Instance of a role template, optionally with attribute values |
| Role Collection | Named bundle of roles assigned to users/groups |

**xs-security.json structure:**
```json
{
  "xsappname": "my-app",
  "tenant-mode": "dedicated",
  "scopes": [
    { "name": "$XSAPPNAME.read", "description": "Read access" }
  ],
  "role-templates": [
    {
      "name": "Viewer",
      "description": "Can read data",
      "scope-references": ["$XSAPPNAME.read"]
    }
  ]
}
```

**Security rules:**
- Define minimal scope sets — grant only what is needed.
- Do not share XSUAA instances between unrelated services.
- Configure short token expiry times (15-60 min for access tokens).
- Always validate JWT tokens server-side.
- Use principal propagation for calling backend SAP systems on behalf of the user.

---

## OAuth 2.0 Grant Types Used in BTP

| Grant Type | Use Case | Example |
|-----------|---------|---------|
| Authorization Code + PKCE | User login in browser apps | Fiori app authenticating via IAS |
| Client Credentials | Service-to-service | Integration iFlow calling API |
| JWT Bearer | Token exchange (on behalf of user) | CAP calling S/4HANA as logged-in user |
| Refresh Token | Renewing access tokens | Long-running user sessions |

---

## Network Security

**Golden rules:**
1. Never expose on-premise systems directly to the Internet.
2. Use SAP Cloud Connector for all on-premise connectivity.
3. TLS (HTTPS) for all communication — no HTTP in production.
4. Restrict Destination Service configurations to minimum paths.
5. Use network zones: BTP apps should not be on the same network as core ERP.

**BTP network perimeter:**
- CF apps get public HTTPS URLs by default. Protect them with XSUAA/IAS.
- Kyma services can be internal (ClusterIP) or external (LoadBalancer). Default to internal.
- On-premise systems reachable only via Cloud Connector — no inbound ports opened.

---

## Secret Management

**Do not:**
- Hardcode credentials in code, config files, or MTA descriptors.
- Store passwords in Git repositories.
- Put client secrets in environment variables in plain text.

**Do:**
- Use **SAP Credential Store** for runtime secrets accessed by applications.
- Use **Destination Service** for outbound connection credentials.
- Use **CI/CD Service credential store** for pipeline credentials.
- Rotate secrets regularly. Automate rotation where possible.
- Use service bindings (CF `VCAP_SERVICES`, Kyma secrets) for injecting credentials.

**Official docs:** https://help.sap.com/docs/credential-store

---

## Audit Logging

BTP applications should produce audit logs for:
- Authentication events (login, logout, failed attempts).
- Authorization decisions (access granted, access denied).
- Data access (read of sensitive records).
- Data modification (create, update, delete of business data).
- Admin operations (user changes, configuration changes).

**SAP Audit Log Service** stores immutable audit records.  
**SAP Cloud Logging** is for application operational logs (not the compliance audit trail).

**Security rule:** Define audit log retention period before go-live. Verify retention period meets regulatory requirements for your industry.

**Official docs:** https://help.sap.com/docs/btp/sap-business-technology-platform/audit-log-service

---

## Role Design Principles

1. **Role per job function, not per user.** Design roles based on what users need to do.
2. **Principle of least privilege.** Roles should contain only the permissions necessary.
3. **Role collections for assignment.** Assign role collections to user groups from IAS/LDAP, not individual users.
4. **Environment separation.** Roles in DEV subaccount should not apply to PROD.
5. **Review regularly.** Audit role assignments quarterly.

---

## Trust Configuration

**Trust configuration** defines which identity providers are trusted for a subaccount.

- By default, BTP subaccounts trust SAP IAS (or the default SAP identity provider for older accounts).
- Configure corporate IdP trust through IAS proxy (recommended over direct trust).
- Validate trust configuration before go-live — authentication failures in production are critical.

**Steps for IAS trust setup:**
1. Configure corporate IdP → IAS federation (SAML or OIDC).
2. Add IAS as trusted IdP in BTP subaccount trust configuration.
3. Map IAS groups/attributes to BTP role collections.
4. Test end-to-end login before go-live.

---

## Security Checklist (Application Go-Live)

- [ ] IAS configured as trust provider for all user-facing applications.
- [ ] MFA enabled for privileged and admin users.
- [ ] Corporate IdP federated via IAS (not directly to BTP).
- [ ] XSUAA scopes defined with least privilege.
- [ ] Role collections assigned to groups (not individual users).
- [ ] No hardcoded credentials in code, config, or Git.
- [ ] Credential Store or Destination Service used for all secrets.
- [ ] Audit logging enabled and retention period defined.
- [ ] TLS (HTTPS) enforced — no HTTP endpoints.
- [ ] Token expiry configured (short-lived access tokens).
- [ ] DEV, TEST, PROD in separate subaccounts with separate trust.
- [ ] On-premise connectivity only via Cloud Connector (no public exposure).
- [ ] Network access to HANA Cloud restricted by IP allowlist.
- [ ] Security review completed against `templates/threat-model.md`.
