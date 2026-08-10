# Commercial & Governance — SAP BTP

Guide to BTP commercial models, cost management, and governance practices.

**Official sources:**
- BTP Pricing: https://www.sap.com/products/technology-platform/pricing.html (REQUIRES_VALIDATION — verify current page)
- Discovery Center (service plans): https://discovery-center.cloud.sap/serviceCatalog
- BTP Account Model: https://help.sap.com/docs/btp/sap-business-technology-platform/account-model

**Last verified:** 2026-08-10

---

## Commercial Models

`REQUIRES_VALIDATION:` All pricing, plan names, and commercial terms change. Always verify current information with your SAP account executive or at SAP Discovery Center before making purchasing decisions.

### Trial

- **Duration:** 90 days (typical).
- **Purpose:** Learning and experimentation only.
- **Limitations:** Resource limits, not all services available, not for production.
- **Cost:** Free.
- **Upgrade path:** Convert to free tier or PAYG account.

### Free Tier

- **Duration:** No expiration.
- **Purpose:** Development, PoC, learning.
- **Limitation:** Limited capacity per service. Not for production SLAs.
- **Cost:** Free within plan limits.
- **Key point:** Free tier is available for select services — not all. Check per-service.

### Pay-As-You-Go (PAYG)

- **Commitment:** None.
- **Pricing:** Per unit of consumption (per message, per GB, per compute hour).
- **Advantage:** No upfront cost; pay for what you use.
- **Disadvantage:** Higher per-unit cost than CPEA; no volume discounts.
- **Suitable for:** Variable or unpredictable workloads; initial production before volume is known.

### Cloud Platform Enterprise Agreement (CPEA)

- **Commitment:** Annual or multi-year spend commitment.
- **Pricing:** Lower per-unit cost than PAYG; credits consumed from the committed pool.
- **Advantage:** Cost predictability; better unit pricing; unified commercial model for all BTP services.
- **Disadvantage:** Commitment required; risk of over- or under-spending.
- **Suitable for:** Enterprise production deployments with predictable consumption.

### Subscription

- **Model:** Fixed price per user, tenant, or capacity unit per month/year.
- **Examples:** Integration Suite subscription, SAP Analytics Cloud subscription, Build Work Zone.
- **Note:** Some products have their own subscription model separate from CPEA.

---

## Cost Management

### Cost Drivers on BTP

| Service | Primary Cost Driver |
|---------|-------------------|
| Cloud Foundry Runtime | Memory (GB-hours) |
| Kyma Runtime | Node size and count |
| HANA Cloud | Compute (vCPUs) + Storage (GB) |
| AI Core / Generative AI Hub | Token count per LLM call |
| Integration Suite / Cloud Integration | Message count |
| Event Mesh | Message count + storage |
| Datasphere | Capacity units |
| SAP Analytics Cloud | Named users |

### Cost Monitoring

- BTP Cockpit provides consumption dashboards per subaccount.
- Set up **Alert Notification** for quota thresholds.
- Review consumption reports monthly.
- Use **directories** to aggregate costs by business unit.

### Cost Optimization Tips

1. **Right-size HANA Cloud:** Scale down compute during off-hours (if supported by plan).
2. **Use Free Tier for dev:** Avoid consuming paid quotas in development.
3. **Monitor AI token usage:** LLM costs grow rapidly — set per-user or per-session limits.
4. **Archive cold data:** Move from HANA Cloud in-memory tier to Data Lake (REQUIRES_VALIDATION).
5. **Stop unused deployments:** CF apps and Kyma pods with zero traffic still consume memory.
6. **Optimize iFlow volumes:** Review Integration Suite message counts — unnecessary retries inflate costs.

---

## Governance Framework

### Account Governance

| Area | Governance Practice |
|------|-------------------|
| Global Account Access | Max 2-3 named admins; no shared accounts |
| Subaccount Creation | Approval process for new subaccounts |
| Entitlement Distribution | Controlled by global account admin |
| User Management | Provisioned via IPS from corporate directory |
| Role Assignments | Group-based; reviewed quarterly |

### Security Governance

- Role assignment review: quarterly.
- Credential rotation: documented schedule per secret type.
- Audit log review: monthly minimum.
- Security assessment: annually or before major releases.

### Change Governance

- All production changes via Transport Management Service.
- No manual deployments to production.
- Rollback plan required for each production change.
- Post-implementation review for major changes.

### Data Governance

- Data classification: identify PII, confidential, public data.
- Data retention policy per data type.
- GDPR data subject rights procedure.
- Data residency documentation per subaccount.

---

## Entitlement Management

### Best Practices

1. **Assign minimum entitlements.** Grant quotas as needed, not in bulk.
2. **Monitor quota usage.** Alert when usage exceeds 80% of quota.
3. **Review unused entitlements.** Reclaim and redistribute unused quotas quarterly.
4. **Document rationale.** Keep a record of why each entitlement was granted.

### Entitlement Audit

Monthly check:
- Services with 0 instances (paid entitlement, no usage).
- Services near quota limit (risk of service disruption).
- Free tier services being used in production (policy violation).

---

## SAP BTP Cockpit Governance Settings

Configure in BTP Cockpit:
- **Custom Properties:** Tag subaccounts with cost center, project, owner.
- **Usage Analytics:** Enable for consumption reporting.
- **Notifications:** Configure for entitlement thresholds.

`REQUIRES_VALIDATION:` Advanced governance features — verify current BTP Cockpit capabilities.
