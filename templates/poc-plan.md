# Proof of Concept (PoC) Plan

Use this template to validate SAP BTP services, connectivity, entitlements, regions, and costs before committing to production implementation.

---

## PoC Identification

**PoC Name:**  
**Date:**  
**Team:**  
**Target delivery date:**  
**BTP Account (Trial/Dev subaccount):**  
**Region:**  

---

## PoC Objective

**What hypothesis does this PoC validate?**

> [State the specific technical or business hypothesis: "We believe that X service can do Y in Z region with acceptable performance and cost."]

**Success criteria (must be measurable):**

| Criterion | Target | Measurement Method |
|-----------|--------|-------------------|
| [e.g., Service Layer response time] | < 2 seconds | Direct measurement |
| [e.g., Entitlement available in eu10] | Yes | Check in Cockpit |
| [e.g., Cloud Connector tunnel stable] | > 99% uptime in test | 48h observation |

---

## Scope

**In scope:**

- [What will be built/tested]

**Out of scope (deferred to Phase 2 or production):**

- [What will NOT be validated in this PoC]

---

## Service Validation Checklist

For each service included in the PoC:

### Service: [Service Name]

- [ ] Entitlement assigned to PoC subaccount.
- [ ] Service plan selected (note: use dev/free tier for PoC).
- [ ] Service instance created.
- [ ] Service binding / service key obtained.
- [ ] Basic operation tested (CRUD, API call, etc.).
- [ ] Regional availability confirmed.
- [ ] Official documentation URL noted.
- [ ] Known limitations documented.

---

## Connectivity Validation

(Complete if on-premise systems are involved)

- [ ] Cloud Connector installed on test server.
- [ ] Cloud Connector connected to BTP PoC subaccount.
- [ ] System mapping configured (on-premise host → virtual host).
- [ ] Test application can reach on-premise system via BTP.
- [ ] HTTPS enforced for all connections.
- [ ] Authentication configured (not Basic Auth if avoidable).
- [ ] Connection latency measured: _______ ms (round-trip)

---

## Identity and Security Validation

- [ ] IAS tenant configured for PoC subaccount.
- [ ] Test user can log in via IAS.
- [ ] XSUAA service instance created (for CF apps).
- [ ] OAuth token obtained and used successfully.
- [ ] Role collections assigned and tested.
- [ ] No hardcoded credentials in PoC code.
- [ ] Audit Log tested (write and read an audit entry).

---

## Performance Validation

| Test | Description | Result | Pass/Fail |
|------|-------------|--------|----------|
| Baseline response time | [e.g., simple API call] | [ms] | |
| Load test (N concurrent users) | [Description] | [Result] | |
| Service Layer throughput | [calls/min] | [Measured] | |
| LLM response time | [if AI involved] | [ms] | |

---

## Cost Estimate Validation

For each service, run the PoC with production-representative load for at least 24 hours and record:

| Service | Plan | Units Consumed | Estimated Cost/Month | Notes |
|---------|------|---------------|---------------------|-------|
| | | | REQUIRES_VALIDATION | Verify at Discovery Center |
| | | | REQUIRES_VALIDATION | |

**Total estimated monthly cost:** REQUIRES_VALIDATION — verify at official pricing source.

---

## Risks Identified

| Risk | Observed | Mitigation Plan |
|------|---------|----------------|
| [Risk 1] | Yes/No/Partial | [Action] |
| [Risk 2] | | |

---

## REQUIRES_VALIDATION Items

Items that the PoC could not validate and require additional confirmation:

| Item | Why Not Validated | Next Step |
|------|------------------|-----------|
| | | |

---

## PoC Outcome

**Overall result:** SUCCESS / PARTIAL / FAILED  

**Key findings:**

1.  
2.  
3.  

**Decision:**

- [ ] Proceed to production implementation.
- [ ] Proceed with conditions: [conditions]
- [ ] Defer: [reason]
- [ ] Stop: [reason]

---

## Artifacts Produced

| Artifact | Location | Notes |
|----------|----------|-------|
| PoC source code | [Git repo / path] | [Notes] |
| Test results | [Location] | |
| ADR (if decision made) | `templates/architecture-decision-record.md` | |

---

## References

| Document | URL |
|----------|-----|
| SAP BTP Help Portal | https://help.sap.com/docs/btp |
| Discovery Center | https://discovery-center.cloud.sap/ |
| [Service-specific docs] | [URL] |
