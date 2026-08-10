# Service Evaluation Template

Use this template before committing to a SAP BTP service for a use case. Fill in every section. Do not leave sections empty — mark as REQUIRES_VALIDATION if unknown.

---

## Service Under Evaluation

**Service Name:**  
**Service ID (from agent-service-index.yaml):**  
**Date:**  
**Evaluator:**  
**Use Case:**  

---

## 1. Business Need

**What problem does this service solve?**

> [Describe the specific business or technical need that motivated evaluating this service]

**Alternatives considered:**

| Alternative | Reason Not Selected |
|-------------|---------------------|
| | |

---

## 2. Official Documentation Review

**Primary documentation URL:**  
**Date documentation reviewed:**  
**Key sections reviewed:**  

- [ ] Service overview / what it does
- [ ] Service plans and pricing
- [ ] Regional availability
- [ ] Prerequisites
- [ ] Known limitations
- [ ] Security considerations

---

## 3. Availability Check

| Check | Status | Notes |
|-------|--------|-------|
| Service available in required region | VERIFIED / REQUIRES_VALIDATION | Region: |
| Service status (GA / Beta / Deprecated) | VERIFIED / REQUIRES_VALIDATION | |
| Entitlement available in global account | VERIFIED / REQUIRES_VALIDATION | |
| Required service plan available | VERIFIED / REQUIRES_VALIDATION | Plan: |

**Discovery Center verification:** https://discovery-center.cloud.sap/serviceCatalog  
**Date verified:**  

---

## 4. Technical Fit

**Runtime compatibility:**

| Runtime | Compatible? | Notes |
|---------|------------|-------|
| Cloud Foundry | Yes / No / REQUIRES_VALIDATION | |
| Kyma | Yes / No / REQUIRES_VALIDATION | |
| ABAP Environment | Yes / No / REQUIRES_VALIDATION | |
| Standalone | Yes / No / REQUIRES_VALIDATION | |

**Language/SDK support:**

| Language | Support Level | Notes |
|----------|--------------|-------|
| Node.js | Native / Via REST / None | |
| Java | Native / Via REST / None | |
| Python | Native / Via REST / None | |
| ABAP | Native / Via REST / None | |

**Integration with other required services:**

| Service | Integration | Notes |
|---------|------------|-------|
| | Compatible / REQUIRES_VALIDATION | |

---

## 5. Security Assessment

**Authentication required:**  
**Authorization model:**  
**Data encryption (in transit):** Yes / No / REQUIRES_VALIDATION  
**Data encryption (at rest):** Yes / No / REQUIRES_VALIDATION  
**Audit logging:** Yes / No / REQUIRES_VALIDATION  
**Data residency:** [Does the service keep data in the selected region?]  

**Security risks identified:**

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| | | | |

---

## 6. Commercial Assessment

**Service plan:** [Plan name]  
**Pricing model:** REQUIRES_VALIDATION (verify at official pricing source)  
**Estimated monthly cost:** REQUIRES_VALIDATION  
**Cost driver:** [What drives the cost — messages, compute, storage, users]  
**Free tier available:** Yes / No / REQUIRES_VALIDATION  
**Included in existing CPEA/contract:** Yes / No / REQUIRES_VALIDATION  

---

## 7. Operational Considerations

**Monitoring:** [How to monitor this service — metrics available]  
**Alerting:** [Alert Notification integration available?]  
**SLA / Uptime:** REQUIRES_VALIDATION  
**Backup:** [Managed by SAP or customer responsibility?]  
**Support:** [SAP support tier required?]  

---

## 8. Known Limitations

List limitations discovered in official documentation:

1.  
2.  
3.  

---

## 9. Decision

**Recommendation:** ADOPT / ADOPT WITH CONDITIONS / DEFER / REJECT  

**Reasoning:**  

**Conditions (if applicable):**  

**Open items (REQUIRES_VALIDATION):**

| Item | Owner | Target Date |
|------|-------|------------|
| | | |

---

## 10. Next Steps

- [ ] PoC validation (use `templates/poc-plan.md`)
- [ ] Architecture Decision Record (use `templates/architecture-decision-record.md`)
- [ ] Request entitlement from global account admin
- [ ] Security review (use `templates/threat-model.md`)
