# Threat Model Template — SAP BTP

Use STRIDE methodology (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) to identify and mitigate threats in BTP solutions.

---

## System Under Analysis

**System name:**  
**Date:**  
**Analysts:**  
**Scope:** [What components and data flows are in scope?]

---

## Architecture Diagram

```
[Draw text-based architecture showing:
- Users and external systems
- BTP components (apps, services, databases)
- Data flows (arrows with protocols)
- Trust boundaries (dashed lines)
- On-premise systems and Cloud Connector]

Example:
Internet
  │ HTTPS
  ▼
[IAS] ← SSO
  │ JWT
  ▼
[Application Router] ── [XSUAA]
  │ JWT (validated)
  ▼
[CAP Service (CF)]
  │ HDI
  ▼
[HANA Cloud]
  │ Cloud Connector
  ▼
[On-premise SAP B1]
```

---

## Data Classification

| Data Type | Classification | Location | Retention |
|-----------|---------------|----------|-----------|
| User PII (name, email) | Confidential | HANA Cloud | [Period] |
| Business data (orders, invoices) | Confidential | HANA Cloud / B1 | [Period] |
| Authentication tokens (JWT) | Secret | In-memory only | Short-lived |
| API credentials | Secret | Credential Store / Destination | Until rotation |
| Audit logs | Confidential | Audit Log Service | [Regulatory period] |
| Application logs | Internal | Cloud Logging | [Period] |

---

## Trust Boundaries

| Boundary | Between | Controls |
|----------|---------|---------|
| Internet → BTP | External users and BTP apps | IAS, XSUAA, TLS |
| BTP → On-premise | BTP and on-premise systems | Cloud Connector, Destination, TLS |
| App → Database | CAP service and HANA Cloud | HDI, IP allowlist, TLS |
| Agent → Tool | LLM orchestrator and tool API | Auth, input validation, rate limiting |

---

## STRIDE Threat Analysis

### Identity Layer (IAS, XSUAA)

| Threat | STRIDE | Likelihood | Impact | Mitigation |
|--------|--------|-----------|--------|-----------|
| Account takeover (stolen credentials) | S | Medium | High | MFA, anomaly detection in IAS |
| JWT token forgery | S, T | Low | High | XSUAA signature validation; short expiry |
| Token replay attack | S | Medium | High | Short-lived tokens; use refresh tokens |
| Unauthorized role assignment | EoP | Low | High | Restrict role collection admin; audit quarterly |
| Corporate IdP misconfiguration | S | Low | High | Test end-to-end login before go-live |

### Application Layer (CAP, BTP Apps)

| Threat | STRIDE | Likelihood | Impact | Mitigation |
|--------|--------|-----------|--------|-----------|
| Injection (OData, URL, body) | T | Medium | High | CAP input validation; parameterized queries |
| Missing authorization check | EoP | Medium | High | `@requires` / `@restrict` on all entities |
| SSRF (forged server-side requests) | T | Low | High | Whitelist allowed destinations |
| Sensitive data in logs | ID | Medium | Medium | Never log tokens, passwords, PII |
| Session fixation | S | Low | Medium | XSUAA session management; rotate tokens |

### Data Layer (HANA Cloud)

| Threat | STRIDE | Likelihood | Impact | Mitigation |
|--------|--------|-----------|--------|-----------|
| Unauthorized data access | ID, EoP | Low | High | HDI container isolation; IP allowlist |
| SQL injection via application | T | Low | High | CAP/ORM parameterized queries |
| Data exfiltration via API | ID | Medium | High | Rate limiting; field-level access control |
| Backup compromise | ID | Low | High | SAP-managed encryption; access to backups restricted |
| Unencrypted data at rest | ID | Low | High | HANA Cloud encrypts by default — verify |

### Connectivity Layer (Cloud Connector, Destinations)

| Threat | STRIDE | Likelihood | Impact | Mitigation |
|--------|--------|-----------|--------|-----------|
| Cloud Connector host compromise | T, EoP | Low | Critical | Harden host OS; minimal access; monitoring |
| Credential theft from Destination | ID | Low | High | Use OAuth/cert; no Basic Auth in prod |
| Man-in-the-middle on tunnel | T, ID | Low | High | TLS-only; verify certificates |
| Excessive resource exposure in CC | EoP | Medium | High | Restrict system mapping to minimum paths |
| Credential rotation failure | ID | Medium | High | Rotation calendar; alerts on expiry |

### AI / Agent Layer (if applicable)

| Threat | STRIDE | Likelihood | Impact | Mitigation |
|--------|--------|-----------|--------|-----------|
| Prompt injection by malicious user | T, EoP | High | High | Input sanitization; system prompt hardening |
| Agent performing unauthorized write | EoP | Medium | High | Typed API layer; auth per tool; approval gates |
| PII leakage to LLM provider | ID | Medium | High | Minimize data sent; data classification |
| LLM generating SQL (data access) | T, ID | High | High | No SQL tools; typed API only |
| Replay of agent tool calls | T | Low | Medium | Tool call idempotency; logging |
| Cost exhaustion (token abuse) | DoS | Medium | Medium | Per-user token limits; rate limiting |

### Operations Layer (CI/CD, Monitoring)

| Threat | STRIDE | Likelihood | Impact | Mitigation |
|--------|--------|-----------|--------|-----------|
| Credential leak in CI/CD pipeline | ID | Medium | High | Secrets in CI/CD vault; no YAML secrets |
| Unauthorized production deployment | EoP | Low | High | TMS approval gates; audit trail |
| Log tampering | T, R | Low | High | Audit Log Service (immutable) |
| Monitoring blind spot | R | Medium | Medium | Full coverage of critical paths |
| Alert fatigue (too many alerts) | DoS (operational) | Medium | Medium | Tune alert thresholds; prioritize |

---

## Summary Risk Register

| ID | Threat | Service/Layer | Likelihood | Impact | Status | Owner |
|----|--------|--------------|-----------|--------|--------|-------|
| T-01 | | | | | Open/Mitigated | |
| T-02 | | | | | | |

---

## Compliance Mapping

| Requirement | Control | Status |
|-------------|---------|--------|
| GDPR Art. 32 (data security) | Encryption at rest and in transit | VERIFIED / REQUIRES_VALIDATION |
| GDPR Art. 17 (right to erasure) | IPS deletion; HANA data deletion | REQUIRES_VALIDATION |
| SOC 2 (audit logging) | Audit Log Service | VERIFIED |
| SOX (access control) | Role collections; separation of duties | In review |

---

## Security Checklist (Go-Live Gate)

- [ ] All STRIDE threats analyzed and mitigated or accepted.
- [ ] MFA enabled for all admin accounts.
- [ ] No hardcoded credentials in code, config, or Git.
- [ ] Audit logging enabled and tested.
- [ ] Token expiry configured (access: 15-60 min).
- [ ] Cloud Connector system mapping restricted to minimum paths.
- [ ] HANA Cloud IP allowlist configured.
- [ ] AI layer: no SQL tools, typed API only, approval gates.
- [ ] Threat model reviewed with security team.
- [ ] Penetration test scheduled (if required by policy).
