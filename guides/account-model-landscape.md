# Account Model & Landscape — SAP BTP

Detailed guide to the BTP account hierarchy, landscape organization, and governance model.

**Official source:** https://help.sap.com/docs/btp/sap-business-technology-platform/account-model  
**Last verified:** 2026-08-10

---

## Account Hierarchy

```
SAP BTP Contract
    └── Global Account (1 per contract)
            ├── Directory A (optional)
            │       ├── Subaccount: Dev-EU
            │       ├── Subaccount: Test-EU
            │       └── Subaccount: Prod-EU
            ├── Directory B
            │       ├── Subaccount: Dev-US
            │       └── Subaccount: Prod-US
            └── Subaccount: Shared-Services
```

---

## Global Account

- **One per SAP contract.** All entitlements originate here.
- Global account administrators have full control over all subaccounts.
- Cockpit URL: https://cockpit.btp.cloud.sap
- Role: **Global Account Administrator** (restricted access; use named accounts).
- Entitlements are purchased at global account level and distributed downward.

**Best practice:** Restrict global account administrator role to 2-3 named individuals. Use directories and subaccount admin roles for delegation.

---

## Directory

Optional intermediate level for organizing subaccounts:

- **Purpose:** Group subaccounts by region, business unit, or project.
- **Entitlement management:** Directories can hold an entitlement quota and distribute to child subaccounts.
- **Administration delegation:** Directory administrator can manage subaccounts within the directory.
- **Nesting:** Directories can be nested (directory within directory).

**When to use directories:**
- Managing 10+ subaccounts.
- Multiple business units on a single BTP contract.
- Delegating administration to regional teams.

---

## Subaccount

The fundamental operational unit:

| Property | Description |
|----------|-------------|
| Region | Fixed at creation; determines data residency and available services |
| Beta features | Can be enabled per subaccount for non-production |
| Environments | CF, Kyma, ABAP enabled per subaccount |
| Users | Managed per subaccount (or via IAS) |
| Trust | IdP configuration per subaccount |
| Entitlements | Assigned from global account / directory |
| Cost | Consumption tracked at subaccount level |

**Immutable after creation:** A subaccount's region cannot be changed. Plan region selection carefully considering:
- Data residency requirements (GDPR, local regulations).
- Latency to end users.
- Service availability in the region.
- Cloud provider preference (AWS, Azure, GCP).

---

## Environment vs Subaccount

A single subaccount can host multiple environments simultaneously:

```
Subaccount (eu10)
├── Cloud Foundry Environment
│   └── Org: myorg
│       ├── Space: dev
│       ├── Space: test
│       └── Space: prod
├── Kyma Environment
│   └── Cluster: mycluster
└── ABAP Environment (if entitled)
```

**Important:** CF Spaces provide environment isolation within CF — but for true environment separation (different teams, different access controls, separate billing visibility), use **separate subaccounts**.

---

## Standard Subaccount Layout — Enterprise

| Subaccount | Environment | Purpose |
|-----------|------------|---------|
| `global-dev` | CF + Kyma | Developer sandbox |
| `project-a-dev` | CF | Project A development |
| `project-a-test` | CF | Project A testing / QA |
| `project-a-prod` | CF | Project A production |
| `shared-services` | CF | Shared services (IAS config, shared APIs) |
| `integration-dev` | CF | Integration Suite development |
| `integration-prod` | CF | Integration Suite production |

**Minimum recommended:** At least 3 subaccounts: Dev, Test, Prod. Never mix non-production and production.

---

## Regions and Availability Zones

### Region Codes

| Code | Location | Provider |
|------|----------|---------|
| eu10 | Europe (Frankfurt) | AWS |
| eu20 | Europe (Netherlands) | Azure |
| us10 | US East (VA) | AWS |
| us20 | US West (WA) | Azure |
| ap10 | Australia (Sydney) | AWS |
| ap11 | Asia Pacific (Singapore) | AWS |
| jp10 | Japan (Tokyo) | AWS |
| br10 | Brazil (São Paulo) | AWS |

`REQUIRES_VALIDATION:` This table may be incomplete or outdated. Always check current regions at https://help.sap.com/docs/btp/sap-business-technology-platform/regions.

### Availability Zones

Within a region, BTP services may run across multiple availability zones for resilience. This is managed by SAP — customers typically select region, not AZ.

---

## Entitlements and Quotas

### Entitlement Lifecycle

```
1. SAP grants service entitlements to Global Account (based on contract)
2. Global Account Admin assigns entitlements to Subaccount
3. Subaccount Admin creates Service Instances using the assigned quota
4. Application binds to Service Instance
```

### Entitlement Types

- **Quota-based:** Maximum number of instances or resources (e.g., 5 HANA Cloud instances).
- **Service-plan based:** Access to a specific service plan (e.g., AI Core standard plan).
- **Subscription-based:** Activate a SaaS application (e.g., Integration Suite subscription).

### Checking Entitlements

Via BTP Cockpit: Subaccount → Service Marketplace → View All Services.  
Via BTP CLI: `btp list accounts/entitlements`

---

## User Management

### User Types

| Type | Managed By | Use |
|------|-----------|-----|
| Platform user | BTP / IAS | BTP Cockpit, CLI access |
| Business user | IAS / corporate IdP | Application end users |
| Technical user | BTP (service keys) | Service-to-service |

### Role Assignment

- Users are assigned **Role Collections** in BTP.
- Role Collections contain **Roles** from specific applications and services.
- Role Collections are assigned in: Subaccount → Security → Role Collections.

**Best practice:** Assign role collections to user **groups** (from IAS/corporate IdP), not individual users. This makes user offboarding automatic.

---

## Cost Governance

### Cost Allocation

- Costs are tracked at subaccount level.
- BTP Cockpit provides consumption dashboards per subaccount.
- Use directories to aggregate consumption across related subaccounts.

### Cost Controls

- Set up alerts via Alert Notification Service for quota consumption.
- Use Free Tier plans for development where available.
- Monitor AI Core token consumption closely (can grow rapidly).
- HANA Cloud compute is expensive at scale — right-size instances.

`REQUIRES_VALIDATION:` Advanced cost management features — verify current capabilities at BTP Cockpit or via SAP Discovery Center.

---

## Landscape vs Environment

| Term | Meaning |
|------|---------|
| **Landscape** | SAP internal term for a set of regions on the same infrastructure version. Not directly controlled by customers. |
| **Region** | Geographic deployment location of a subaccount. Customer-controlled selection. |
| **Environment** | Runtime type (CF, Kyma, ABAP) within a subaccount. Customer-enabled. |
| **Space** (CF) | Isolation unit within a CF Org. Not a replacement for subaccount separation. |
| **Namespace** (Kyma) | Isolation unit within a Kyma cluster. Not a replacement for subaccount separation. |
