# Capability Map — SAP BTP

Navigate from a business or technical need to candidate BTP services and the validation required before choosing.

---

## How to Use This Map

1. Find your need in the left column.
2. Review candidate services (not exhaustive).
3. Apply the validation required before recommending.
4. Cross-reference with `catalog/agent-service-index.yaml` for machine-readable details.
5. Load the relevant `SKILL.md` for deeper guidance.

---

## Application Development

| Need | Candidate Services / Tools | Validation Required |
|------|---------------------------|---------------------|
| Build cloud-native business apps | CAP (Node.js / Java), CF / Kyma runtime | Verify runtime choice vs. team skills |
| Low-code / no-code application | SAP Build Apps, Build Code | Verify plan; Build Apps ≠ Build Code |
| SAP Fiori UX on BTP | Fiori tools + CAP + BAS, Fiori launchpad on Work Zone | Verify Fiori version; Work Zone license |
| ABAP cloud development | ABAP Environment on BTP | Verify entitlement; ABAP cloud ≠ on-premise ABAP |
| Cloud IDE | SAP Business Application Studio | Default for SAP dev; verify plan |
| AI-assisted development | SAP Build Code + Joule | Joule availability varies by plan and region |
| Containerized workloads | Kyma environment | Kubernetes expertise required |

---

## Integration & Connectivity

| Need | Candidate Services / Tools | Validation Required |
|------|---------------------------|---------------------|
| Orchestrate integrations (ETL, B2B, point-to-point) | SAP Integration Suite – Cloud Integration | Verify license tier; iFlow limits |
| Expose and govern APIs | API Management (within Integration Suite) | Separate entitlement from Cloud Integration |
| Connect SAP on-premise (ERP, B1, S/4) | SAP Cloud Connector + Connectivity Service + Destination Service | Cloud Connector installed on-premise required |
| Pre-built connectors to 3rd-party cloud apps | Open Connectors (within Integration Suite) | Verify connector availability per app |
| Messaging and event streaming | SAP Event Mesh | Validate volume, topics, queues per plan |
| High-throughput, multi-protocol events | SAP Advanced Event Mesh | Separate service; verify pricing |
| API discovery and catalog | SAP Business Accelerator Hub | Public catalog; private APIs need API Management |
| B2B messaging (EDI) | Integration Advisor + Cloud Integration | Verify B2B content packages |
| OData / REST API from SAP backend | SAP Business Accelerator Hub, CAP OData | Verify API version (v2/v4) |

---

## Data & Analytics

| Need | Candidate Services / Tools | Validation Required |
|------|---------------------------|---------------------|
| Relational database on BTP | SAP HANA Cloud | Multiple plans; verify storage and compute tier |
| Data warehouse / federation | SAP Datasphere | Separate product; verify license |
| Business intelligence and dashboards | SAP Analytics Cloud | Separate product; verify license |
| Vector storage for RAG | SAP HANA Cloud (vector engine) | Feature availability – REQUIRES_VALIDATION per version |
| Real-time data replication | SAP HANA Cloud Data Integration, Datasphere | Verify replication method and source system |
| Data governance | SAP Datasphere | Verify data catalog capabilities |
| Relational persistence for CAP apps | SAP HANA Cloud (CAP binding) | Service instance in same subaccount |

---

## Security & Identity

| Need | Candidate Services / Tools | Validation Required |
|------|---------------------------|---------------------|
| User authentication (SSO, MFA) | SAP IAS (Cloud Identity Services) | Tenant per global account; custom domain optional |
| User provisioning / sync from LDAP/AD | SAP IPS (Cloud Identity Services) | Source/target connector availability |
| OAuth 2.0 authorization for apps | XSUAA (Authorization and Trust Management) | CF-specific; Kyma uses IAS-based OIDC |
| Role-based access control | Role Collections + Role Templates (XSUAA/IAS) | Design role model before implementation |
| Federated identity (Azure AD, Okta) | IAS as proxy, trust configuration | IAS configured as corporate IdP proxy |
| Secret management | SAP Credential Store | Verify plan; not a full HSM solution |
| Audit logging | Audit Log Service | Verify retention period per plan |
| Certificate management | Subscription to certificate services | REQUIRES_VALIDATION — verify current offering |
| Data privacy / GDPR compliance | IPS (data deletion), Audit Log, IAS | Consult SAP Trust Center |

---

## AI & Machine Learning

| Need | Candidate Services / Tools | Validation Required |
|------|---------------------------|---------------------|
| Run ML models in production | SAP AI Core | Verify region, model deployment pipeline |
| Manage ML lifecycle (experiments, models) | SAP AI Launchpad | Requires AI Core |
| Access LLMs via SAP-managed API | SAP Generative AI Hub (in AI Core) | Model availability varies by region |
| RAG / document grounding | HANA Cloud (vector) + AI Core + orchestration | Multi-service pattern; verify each component |
| AI-embedded in SAP apps (Joule) | Joule integration per product | Joule availability is product-specific |
| Custom model training | SAP AI Core (training pipelines) | Requires Argo Workflows familiarity |
| AI observability | SAP AI Launchpad metrics | REQUIRES_VALIDATION — verify feature scope |
| Agentic AI orchestration on BTP | AI Core + CAP + MCP / API layer | Emerging pattern; validate officially |

---

## Automation & Low-Code

| Need | Candidate Services / Tools | Validation Required |
|------|---------------------------|---------------------|
| Workflow automation | SAP Build Process Automation | Includes RPA and workflow; verify plan |
| RPA (attended / unattended bots) | SAP Build Process Automation – RPA | Verify bot capacity per plan |
| Business rules engine | SAP Build Process Automation | Verify rule complexity support |
| Human approval workflows | SAP Build Process Automation | Integrates with SAP Inbox |
| No-code app builder | SAP Build Apps | Verify mobile/web output capabilities |
| Digital workplace / portal | SAP Build Work Zone | Standard vs. Advanced edition differ significantly |
| Forms for data capture | SAP Build Process Automation – Forms | Verify standalone vs. workflow-embedded |

---

## Operations & Observability

| Need | Candidate Services / Tools | Validation Required |
|------|---------------------------|---------------------|
| Centralized log management | SAP Cloud Logging | Verify retention and ingestion limits |
| Alerting and notifications | Alert Notification Service | Supports email, Slack, webhook; verify plan |
| Application performance monitoring | SAP Cloud ALM | Cloud ALM is separate from BTP consumption |
| Change and transport management | Transport Management Service | Required for managed transports in CF/Kyma |
| CI/CD pipeline for BTP | SAP CI/CD Service (BTP) | Supports CF, Kyma; verify pipeline jobs |
| Infrastructure as Code | BTP Terraform provider (HashiCorp) | REQUIRES_VALIDATION — community + SAP supported |
| Cost and quota tracking | BTP Cockpit + Discovery Center | Real-time; verify export/alert options |
| Distributed tracing | SAP Cloud ALM, Cloud Logging integration | REQUIRES_VALIDATION — verify trace correlation |

---

## Specific Integration Scenarios

| Scenario | Pattern | Key Services |
|----------|---------|-------------|
| SAP S/4HANA Cloud ↔ BTP | Integration Suite iFlow + Destination | Integration Suite, Connectivity, XSUAA |
| SAP B1 on-premise ↔ BTP | Cloud Connector + Service Layer + CAP/MCP | Cloud Connector, Connectivity, Destination, CAP |
| Third-party SaaS ↔ BTP | Open Connectors or custom REST connector | Integration Suite, Open Connectors |
| Event-driven SAP S/4 → BTP | SAP Event Mesh + S/4 event publishing | Event Mesh, Integration Suite |
| Agent AI → Business data | AI Core + MCP server + Destination + Business API | AI Core, CAP, Destination, XSUAA |
| External IdP → BTP apps | IAS (proxy mode) + XSUAA + trust config | IAS, XSUAA, trust configuration |

---

## Decision Validation Checklist

Before finalizing a service choice:

- [ ] Service is GA (not Beta or Deprecated) — check Discovery Center.
- [ ] Service available in required region — check Discovery Center > Service Catalog.
- [ ] Entitlement available in global account — check BTP Cockpit > Entitlements.
- [ ] Service plan matches requirements — verify plan limits and pricing.
- [ ] Runtime compatibility confirmed — CF, Kyma, ABAP, or standalone.
- [ ] Identity integration planned — XSUAA, IAS, or both.
- [ ] Cost model understood — PAYG, CPEA, subscription, or free tier.
- [ ] Official documentation reviewed — cite the URL.
