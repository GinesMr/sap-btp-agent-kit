# Platform Foundations — SAP BTP

Core concepts that every architect and developer must understand before working with SAP Business Technology Platform.

**Official root:** https://help.sap.com/docs/btp  
**Last verified:** 2026-08-10

---

## What is SAP BTP?

SAP Business Technology Platform (BTP) is SAP's unified cloud platform combining:

- **Database & Data Management** (HANA Cloud, Datasphere)
- **Analytics** (SAP Analytics Cloud)
- **Application Development & Automation** (CAP, Build Apps, Build Process Automation)
- **Integration** (Integration Suite)
- **Artificial Intelligence** (AI Core, Generative AI Hub)
- **Security & Identity** (Cloud Identity Services, XSUAA)

BTP is not a single product — it is a platform of services accessed through a shared account model and consumed via multiple runtimes.

**Source:** https://help.sap.com/docs/btp/sap-business-technology-platform/what-is-sap-business-technology-platform

---

## Account Hierarchy

```
Global Account
├── Directory (optional grouping)
│   ├── Subaccount (DEV)
│   ├── Subaccount (TEST)
│   └── Subaccount (PROD)
└── Subaccount (standalone)
```

| Level | Purpose | Isolation |
|-------|---------|-----------|
| Global Account | Contract with SAP; entitlement pool | Organizational |
| Directory | Grouping + delegated administration | Administrative |
| Subaccount | Deployment unit; services; users; trust | Full isolation |

**Key rule:** Applications and services run in **subaccounts**, not in the global account.

---

## Regions and Landscapes

BTP is available in multiple **regions** across infrastructure providers (AWS, Azure, GCP, Alibaba Cloud, and SAP's own data centers).

Each region is identified by a code (e.g., `eu10`, `us10`, `ap10`, `eu20`).

**Critical rules:**
- A subaccount is created in a specific region and cannot be moved.
- Not all services are available in all regions. Always verify at https://discovery-center.cloud.sap/serviceCatalog.
- Data residency is determined by the region — important for GDPR and compliance.
- Latency to users depends on geographic proximity.

**`REQUIRES_VALIDATION`:** Specific region availability for any service must be verified at time of planning, not assumed from this document.

---

## Environments

Within a subaccount, you can enable one or more **environments**:

| Environment | Technology | Primary Use Case |
|-------------|-----------|-----------------|
| Cloud Foundry | PaaS (CF) | Java/Node.js apps, CAP |
| Kyma | Managed Kubernetes | Containers, serverless, microservices |
| ABAP | Managed ABAP | ABAP cloud development |

A subaccount can have multiple environments enabled simultaneously.

---

## Entitlements and Quotas

**Entitlement:** The right to use a specific service and service plan.
**Quota:** The maximum amount of a resource granted.

Flow:
1. SAP grants entitlements to the **global account** based on the contract (CPEA, PAYG, or subscription).
2. Global account admin distributes entitlements to **subaccounts**.
3. Subaccount admin creates **service instances** within the allocated quota.

**Key rule:** A service is not usable in a subaccount until the appropriate entitlement is assigned. Always check entitlements in BTP Cockpit before troubleshooting service provisioning failures.

---

## Commercial Models

| Model | Description | Suitable For |
|-------|-------------|-------------|
| **Trial** | Free, time-limited (90 days). Not for production. | Learning and experimentation |
| **Free Tier** | Free, limited service plans. Not time-limited. | Development and PoC |
| **PAYG** | Pay-as-you-go. No commitment. Higher per-unit cost. | Variable workloads |
| **CPEA** | Cloud Platform Enterprise Agreement. Committed spend, lower unit cost. | Enterprise production |
| **Subscription** | Fixed price per user or tenant. | Specific products (SAC, Datasphere, etc.) |

`REQUIRES_VALIDATION`: Current plan names and conditions must be verified at https://www.sap.com/products/technology-platform/pricing.html and SAP Discovery Center.

---

## Service Lifecycle

1. **Enable environment** (CF, Kyma, ABAP) in subaccount.
2. **Assign entitlement** for a service in the subaccount.
3. **Create service instance** (via Cockpit, BTP CLI, or cf CLI).
4. **Create service binding** or **service key** to get credentials for applications.
5. **Bind** to application (injects credentials via `VCAP_SERVICES` in CF or Kubernetes secrets in Kyma).
6. **Consume** service from application code.

---

## Key Tools for Platform Administration

| Tool | Use Case | Link |
|------|---------|------|
| SAP BTP Cockpit | Web UI for all BTP administration | https://cockpit.btp.cloud.sap |
| BTP CLI (`btp`) | Command-line for account and service management | https://help.sap.com/docs/btp/sap-business-technology-platform/account-administration-using-sap-btp-command-line-interface-btp-cli |
| CF CLI (`cf`) | Deploying apps and managing CF spaces | https://docs.cloudfoundry.org/cf-cli/ |
| kubectl | Managing Kyma/Kubernetes workloads | https://kubernetes.io/docs/reference/kubectl/ |
| Terraform BTP Provider | IaC for BTP account and service management | REQUIRES_VALIDATION — verify current provider version |

---

## Multi-Target Applications (MTA)

MTA is SAP's packaging format for deploying applications with multiple modules (front-end, back-end, services) across CF or Kyma.

- **MTA descriptor:** `mta.yaml` — defines modules, resources, and dependencies.
- **Cloud MTA Build Tool (MBT):** Builds the `.mtar` archive.
- **Deploy:** Via CF CLI plugin or BTP CI/CD service.

**Source:** https://help.sap.com/docs/btp/sap-business-technology-platform/multitarget-applications-in-cloud-foundry-environment

---

## Design Principles for BTP Solutions

1. **Environment separation:** Always use separate subaccounts for DEV, TEST, PROD.
2. **Least privilege:** Minimum roles for users and services.
3. **Externalize configuration:** Use Destination Service, Credential Store, and environment variables — never hardcode.
4. **Stateless design:** CF apps should be stateless (no local filesystem state). Use HANA Cloud or Object Store.
5. **Secure by default:** OAuth 2.0 / OIDC everywhere, TLS required, no HTTP in production.
6. **Validate entitlements first:** Before architecting, confirm service availability, plan, and cost in the target region.
7. **Document decisions:** Use Architecture Decision Records (`templates/architecture-decision-record.md`).
