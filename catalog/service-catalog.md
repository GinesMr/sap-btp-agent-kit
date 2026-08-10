# SAP BTP Service Catalog

Structured fichas for all major SAP BTP services and capabilities. Each entry follows a uniform format for agent and human consumption.

**Verification note:** All entries verified against official SAP documentation. Items marked `REQUIRES_VALIDATION` could not be fully confirmed at the time of writing. Pricing and regional availability must always be checked at https://discovery-center.cloud.sap/serviceCatalog.

**Last updated:** 2026-08-10

---

## Table of Contents

1. [Foundation & Platform Administration](#1-foundation--platform-administration)
2. [Runtime Environments](#2-runtime-environments)
3. [Application Development](#3-application-development)
4. [Integration & Connectivity](#4-integration--connectivity)
5. [Data & Analytics](#5-data--analytics)
6. [Artificial Intelligence](#6-artificial-intelligence)
7. [Security & Identity](#7-security--identity)
8. [Automation & Low-Code](#8-automation--low-code)
9. [Operations, Observability & Governance](#9-operations-observability--governance)

---

## 1. Foundation & Platform Administration

### Global Account

- **ID interno:** `btp-global-account`
- **Categoría:** Foundation & Account Management
- **Estado:** `GA`
- **Descripción breve:** Top-level entity representing an SAP BTP contract. The global account is the root node of the BTP account hierarchy; all directories, subaccounts, entitlements, and quotas flow from it.
- **Problema que resuelve:** Centralized governance of all BTP resources, entitlements, and spending for an organization.
- **Casos de uso:** Managing multiple projects/teams under one BTP contract. Distributing entitlements to subaccounts. Tracking consumption across the organization.
- **Cuándo usarlo:** Always — every BTP deployment requires a global account.
- **Cuándo evitarlo:** Not applicable — mandatory.
- **Prerrequisitos:** SAP account, signed BTP contract.
- **Runtime o entorno compatible:** N/A (administrative entity).
- **Identidad, permisos y seguridad:** Global account administrators have full control. Restrict to a small group. Use named accounts, not shared credentials.
- **Conectividad necesaria:** Internet access to cockpit.btp.cloud.sap.
- **Entitlement y service plan:** N/A.
- **Disponibilidad regional:** REQUIRES_VALIDATION — global account itself is global; subaccounts are region-specific.
- **Coste / consumo:** `verificar en fuente oficial`
- **Interfaces disponibles:** SAP BTP Cockpit (UI), BTP CLI, BTP REST APIs.
- **Servicios relacionados:** Subaccounts, Directories, BTP Cockpit, BTP CLI.
- **Alternativas dentro de BTP:** N/A.
- **Limitaciones y riesgos:** Single point of governance — loss of admin access is critical.
- **Prioridad de aprendizaje:** `core`
- **Documentación oficial:** https://help.sap.com/docs/btp/sap-business-technology-platform/account-model
- **Discovery Center:** https://discovery-center.cloud.sap/
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### Subaccount

- **ID interno:** `btp-subaccount`
- **Categoría:** Foundation & Account Management
- **Estado:** `GA`
- **Descripción breve:** The operative unit in BTP. Applications are deployed in subaccounts; services are consumed at subaccount level. Each subaccount has its own region, users, trust configuration, entitlements, and environments.
- **Problema que resuelve:** Isolation between projects, teams, or environments (DEV/TEST/PROD).
- **Casos de uso:** One subaccount per environment (DEV, TEST, PROD). Separate subaccounts per business unit. Isolating production from development.
- **Cuándo usarlo:** For every deployment. Always separate environments by subaccount.
- **Cuándo evitarlo:** Don't mix environments in a single subaccount.
- **Prerrequisitos:** Global account.
- **Runtime o entorno compatible:** Cloud Foundry, Kyma, ABAP (enabled per subaccount).
- **Identidad, permisos y seguridad:** Trust must be configured per subaccount. Users are subaccount-specific unless using shared IAS.
- **Conectividad necesaria:** Internet to BTP region endpoints.
- **Entitlement y service plan:** Entitlements allocated per subaccount from global account quota.
- **Disponibilidad regional:** Subaccounts are assigned to a specific region (e.g., eu10, us10, ap10).
- **Coste / consumo:** `verificar en fuente oficial`
- **Interfaces disponibles:** SAP BTP Cockpit, BTP CLI.
- **Servicios relacionados:** Global Account, Directories, Environments, XSUAA, IAS.
- **Alternativas dentro de BTP:** N/A.
- **Limitaciones y riesgos:** Subaccounts in different regions cannot share CF spaces or Kyma clusters. Region choice affects latency and data residency.
- **Prioridad de aprendizaje:** `core`
- **Documentación oficial:** https://help.sap.com/docs/btp/sap-business-technology-platform/account-model
- **Discovery Center:** https://discovery-center.cloud.sap/
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### Directory

- **ID interno:** `btp-directory`
- **Categoría:** Foundation & Account Management
- **Estado:** `GA`
- **Descripción breve:** Optional structural grouping node between a global account and subaccounts. Directories can manage entitlements and quotas for the subaccounts they contain.
- **Problema que resuelve:** Organizing large numbers of subaccounts (by region, business unit, or project) and delegating entitlement management.
- **Casos de uso:** Multi-country SAP deployments. Large enterprises with multiple BUs on BTP.
- **Cuándo usarlo:** When managing 10+ subaccounts and needing delegation of administration.
- **Cuándo evitarlo:** Small deployments with few subaccounts.
- **Prerrequisitos:** Global account.
- **Runtime o entorno compatible:** N/A (administrative entity).
- **Identidad, permisos y seguridad:** Directory administrators can manage entitlements within their directory.
- **Conectividad necesaria:** BTP Cockpit / CLI.
- **Entitlement y service plan:** N/A directly; manages entitlements for child subaccounts.
- **Disponibilidad regional:** N/A.
- **Coste / consumo:** `verificar en fuente oficial`
- **Interfaces disponibles:** SAP BTP Cockpit, BTP CLI.
- **Servicios relacionados:** Global Account, Subaccounts.
- **Alternativas dentro de BTP:** N/A.
- **Limitaciones y riesgos:** Not all entitlement types can be managed at directory level — verify per service.
- **Prioridad de aprendizaje:** `important`
- **Documentación oficial:** https://help.sap.com/docs/btp/sap-business-technology-platform/account-model
- **Discovery Center:** https://discovery-center.cloud.sap/
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### SAP BTP Cockpit

- **ID interno:** `btp-cockpit`
- **Categoría:** Foundation & Account Management
- **Estado:** `GA`
- **Descripción breve:** Web-based administration UI for BTP. Manage accounts, entitlements, service instances, users, environments, and deployments from a browser.
- **Problema que resuelve:** Visual management of all BTP resources without CLI.
- **Casos de uso:** Day-to-day administration, entitlement distribution, service provisioning, user management.
- **Cuándo usarlo:** For interactive administration.
- **Cuándo evitarlo:** For automated operations — use BTP CLI or Terraform.
- **Prerrequisitos:** BTP account with appropriate role.
- **Runtime o entorno compatible:** N/A (web UI).
- **Identidad, permisos y seguridad:** Role collections control cockpit access. Use named accounts.
- **Conectividad necesaria:** Internet to cockpit.btp.cloud.sap.
- **Entitlement y service plan:** N/A.
- **Disponibilidad regional:** Global (manages regional resources).
- **Coste / consumo:** Free (part of BTP platform).
- **Interfaces disponibles:** Web UI.
- **Servicios relacionados:** BTP CLI, Global Account, Subaccounts.
- **Alternativas dentro de BTP:** BTP CLI for automation.
- **Limitaciones y riesgos:** No bulk operations; not suitable for IaC workflows.
- **Prioridad de aprendizaje:** `core`
- **Documentación oficial:** https://help.sap.com/docs/btp/sap-business-technology-platform/btp-cockpit
- **Discovery Center:** https://discovery-center.cloud.sap/
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### SAP Discovery Center

- **ID interno:** `discovery-center`
- **Categoría:** Foundation & Account Management
- **Estado:** `GA`
- **Descripción breve:** SAP's portal for discovering BTP services, viewing regional availability, exploring service plans and pricing, and following guided learning missions.
- **Problema que resuelve:** Finding the right BTP service for a need, understanding commercial options, and planning BTP adoption.
- **Casos de uso:** Service discovery before implementation. Verifying regional availability. Finding official pricing. Accessing guided missions.
- **Cuándo usarlo:** Before recommending or selecting any BTP service.
- **Cuándo evitarlo:** N/A — use it always as part of service evaluation.
- **Prerrequisitos:** None (public portal).
- **Runtime o entorno compatible:** N/A.
- **Identidad, permisos y seguridad:** Public access; some features require SAP login.
- **Conectividad necesaria:** Internet.
- **Entitlement y service plan:** N/A.
- **Disponibilidad regional:** Global portal.
- **Coste / consumo:** Free.
- **Interfaces disponibles:** Web UI at https://discovery-center.cloud.sap/.
- **Servicios relacionados:** All BTP services.
- **Alternativas dentro de BTP:** SAP Help Portal for documentation.
- **Limitaciones y riesgos:** Information may lag behind actual service availability — always verify in cockpit.
- **Prioridad de aprendizaje:** `core`
- **Documentación oficial:** https://discovery-center.cloud.sap/
- **Discovery Center:** https://discovery-center.cloud.sap/
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

## 2. Runtime Environments

### Cloud Foundry Environment

- **ID interno:** `cloud-foundry-environment`
- **Categoría:** Runtime Environment
- **Estado:** `GA`
- **Descripción breve:** PaaS runtime based on the open-source Cloud Foundry platform. Supports Java, Node.js, Python, Go, Ruby, and other buildpack-based apps. Provides CF Spaces for workload isolation.
- **Problema que resuelve:** Deploying and scaling cloud-native applications without managing infrastructure.
- **Casos de uso:** CAP Node.js and Java apps. SAP Fiori backend services. Microservices with service broker integration.
- **Cuándo usarlo:** For most BTP application workloads, especially CAP-based.
- **Cuándo evitarlo:** Containerized workloads requiring Kubernetes semantics (use Kyma). ABAP development (use ABAP Environment).
- **Prerrequisitos:** CF environment enabled in subaccount. CF org and space created.
- **Runtime o entorno compatible:** CF (standalone runtime).
- **Identidad, permisos y seguridad:** XSUAA for application-level auth. CF org/space roles for deployment access. Network isolation between orgs.
- **Conectividad necesaria:** BTP endpoints for deployment and service binding.
- **Entitlement y service plan:** Cloud Foundry Runtime entitlement. Quota: memory GB.
- **Disponibilidad regional:** Available in most BTP regions — verify at Discovery Center.
- **Coste / consumo:** `verificar en fuente oficial` (charged per GB of runtime memory).
- **Interfaces disponibles:** CF CLI (cf command), BTP Cockpit, BTP CLI, CF API.
- **Servicios relacionados:** XSUAA, Destination Service, Connectivity Service, HANA Cloud.
- **Alternativas dentro de BTP:** Kyma (Kubernetes-based), ABAP Environment.
- **Limitaciones y riesgos:** No Kubernetes features. Buildpack updates managed by SAP. Memory limits per plan. Stateful workloads not natively supported.
- **Prioridad de aprendizaje:** `core`
- **Documentación oficial:** https://help.sap.com/docs/btp/sap-business-technology-platform/cloud-foundry-environment
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/cloud-foundry-runtime
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### Kyma Environment

- **ID interno:** `kyma-environment`
- **Categoría:** Runtime Environment
- **Estado:** `GA`
- **Descripción breve:** Managed Kubernetes-based runtime on BTP. Open-source Kyma project. Supports containerized microservices, serverless functions, event-driven architecture, and service mesh.
- **Problema que resuelve:** Running containerized workloads with Kubernetes semantics on BTP.
- **Casos de uso:** Microservices needing Docker/Kubernetes. Serverless functions (Node.js, Python). Event-driven architectures. Extension of SAP S/4HANA using side-by-side extensibility.
- **Cuándo usarlo:** Containerized apps, multi-language services, or when Kubernetes control is needed.
- **Cuándo evitarlo:** Simple CRUD apps where CF + CAP is faster to build. Teams without Kubernetes expertise.
- **Prerrequisitos:** Kyma environment enabled. Docker registry. kubectl configured.
- **Runtime o entorno compatible:** Kubernetes (Kyma).
- **Identidad, permisos y seguridad:** IAS-based OIDC (recommended over XSUAA for Kyma). Kubernetes RBAC. Istio service mesh for mTLS.
- **Conectividad necesaria:** Kubernetes API server endpoint.
- **Entitlement y service plan:** Kyma Runtime entitlement. Plans vary by node size.
- **Disponibilidad regional:** REQUIRES_VALIDATION — not available in all regions; check Discovery Center.
- **Coste / consumo:** `verificar en fuente oficial` (node-based pricing).
- **Interfaces disponibles:** kubectl, Kyma Console UI, BTP CLI, Helm charts.
- **Servicios relacionados:** IAS, HANA Cloud, Event Mesh, Destination Service.
- **Alternativas dentro de BTP:** Cloud Foundry Environment.
- **Limitaciones y riesgos:** Kubernetes expertise required. Managed updates may affect cluster configuration. Node costs are significant.
- **Prioridad de aprendizaje:** `important`
- **Documentación oficial:** https://help.sap.com/docs/btp/sap-business-technology-platform/kyma-environment
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/kyma-runtime
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### ABAP Environment

- **ID interno:** `abap-environment`
- **Categoría:** Runtime Environment
- **Estado:** `GA`
- **Descripción breve:** Managed ABAP runtime in the cloud. Allows ABAP developers to build cloud-ready RESTful ABAP services using the ABAP RESTful Application Programming Model (RAP). No on-premise ABAP installation needed.
- **Problema que resuelve:** Enabling ABAP developers to build cloud services without managing infrastructure.
- **Casos de uso:** Custom OData services in ABAP. Extending S/4HANA Cloud with ABAP. New ABAP cloud-native apps.
- **Cuándo usarlo:** ABAP-skilled teams building new services or extending S/4HANA Cloud.
- **Cuándo evitarlo:** Non-ABAP teams. Direct migration of classic on-premise ABAP without adaptation.
- **Prerrequisitos:** ABAP environment entitlement. Eclipse with ABAP Development Tools (ADT).
- **Runtime o entorno compatible:** ABAP.
- **Identidad, permisos y seguridad:** IAS for user authentication. Business catalogs for authorization.
- **Conectividad necesaria:** Eclipse ADT to ABAP system; HTTPS.
- **Entitlement y service plan:** ABAP environment entitlement. Plans vary by size.
- **Disponibilidad regional:** REQUIRES_VALIDATION — verify per region at Discovery Center.
- **Coste / consumo:** `verificar en fuente oficial`
- **Interfaces disponibles:** Eclipse ADT, ABAP RESTful APIs, OData.
- **Servicios relacionados:** IAS, HANA Cloud.
- **Alternativas dentro de BTP:** CAP (Java/Node.js) for non-ABAP teams.
- **Limitaciones y riesgos:** Classic ABAP patterns (Function Modules, BAPIs) not supported in cloud ABAP. Learning ABAP RAP required.
- **Prioridad de aprendizaje:** `specialist`
- **Documentación oficial:** https://help.sap.com/docs/abap-cloud
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/abap-environment
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

## 3. Application Development

### SAP Cloud Application Programming Model (CAP)

- **ID interno:** `cap`
- **Categoría:** Application Development
- **Estado:** `GA`
- **Descripción breve:** Open-source framework (Apache 2.0) for building enterprise-grade cloud applications. Uses CDS (Core Data Services) for domain modeling and generates OData v4 and REST APIs automatically. Supports Node.js and Java runtimes. First-class integration with BTP services.
- **Problema que resuelve:** Rapid development of full-stack cloud business applications with minimal boilerplate.
- **Casos de uso:** Business applications with OData APIs and Fiori UI. SAP BTP extensions for S/4HANA or B1. Microservices with HANA Cloud persistence.
- **Cuándo usarlo:** Default choice for new BTP application development in Node.js or Java.
- **Cuándo evitarlo:** Purely Python, .NET, or Go projects (no native CAP support). Pure UI-only scenarios.
- **Prerrequisitos:** Node.js 18+ or Java 17+. CF or Kyma runtime for deployment. HANA Cloud for production persistence.
- **Runtime o entorno compatible:** Cloud Foundry, Kyma.
- **Identidad, permisos y seguridad:** Native XSUAA integration. CDS annotations for declarative authorization (requires, restrict). Multitenancy support built-in.
- **Conectividad necesaria:** Service bindings to HANA Cloud, XSUAA, Destination Service.
- **Entitlement y service plan:** CAP itself is free (open-source); depends on runtime entitlements.
- **Disponibilidad regional:** Available wherever CF or Kyma runs.
- **Coste / consumo:** Free framework; costs from runtime and services.
- **Interfaces disponibles:** CLI (cds), CDS LSP (VS Code / BAS), REST/OData APIs at runtime.
- **Servicios relacionados:** HANA Cloud, XSUAA, Destination Service, BAS, Build Code.
- **Alternativas dentro de BTP:** ABAP RAP (for ABAP teams), Build Apps (no-code).
- **Limitaciones y riesgos:** Python and .NET not natively supported — require containerization or REST API approach. Learning CDS required. Production requires HANA Cloud (SQLite only for local dev).
- **Prioridad de aprendizaje:** `core`
- **Documentación oficial:** https://cap.cloud.sap/docs/
- **Discovery Center:** N/A (open-source framework)
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### SAP Business Application Studio (BAS)

- **ID interno:** `bas`
- **Categoría:** Application Development
- **Estado:** `GA`
- **Descripción breve:** Cloud-based IDE on BTP, purpose-built for SAP development. Provides dev spaces optimized for CAP, Fiori, ABAP, and Mobile development. Runs in browser.
- **Problema que resuelve:** Consistent SAP development environment without local setup.
- **Casos de uso:** CAP and Fiori development. ABAP development (via ADT-compatible tooling). Mobile app development with MDK.
- **Cuándo usarlo:** Teams requiring standardized SAP dev environments. Customer demos and workshops.
- **Cuándo evitarlo:** Teams that strongly prefer local VS Code (which is supported for CAP via extensions).
- **Prerrequisitos:** BAS subscription entitlement.
- **Runtime o entorno compatible:** N/A (IDE).
- **Identidad, permisos y seguridad:** IAS/XSUAA for login. Dev space isolation.
- **Conectividad necesaria:** Internet + BTP subaccount.
- **Entitlement y service plan:** BAS subscription. Plans: free, standard.
- **Disponibilidad regional:** REQUIRES_VALIDATION — verify per region.
- **Coste / consumo:** `verificar en fuente oficial`
- **Interfaces disponibles:** Browser-based IDE.
- **Servicios relacionados:** CAP, Build Code, CF Environment.
- **Alternativas dentro de BTP:** Local VS Code + CAP CDS extension.
- **Limitaciones y riesgos:** Internet connectivity required. Dev spaces have resource limits.
- **Prioridad de aprendizaje:** `core`
- **Documentación oficial:** https://help.sap.com/docs/bas
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/business-application-studio
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### Language Support Clarification

> **FACT:** SAP BTP provides **first-class support** for Java and Node.js/TypeScript via CAP and Cloud SDK.
>
> **FACT:** ABAP is first-class in the ABAP Environment.
>
> **FACT:** Python, .NET, Go, and Ruby can run in CF via buildpacks or in Kyma via containers, but have **no native CAP or Cloud SDK equivalents** — they require custom integration with BTP services via REST APIs.
>
> **RECOMMENDATION:** For new BTP projects, choose Node.js/TypeScript (CAP) or Java (CAP/Cloud SDK). Use Python or .NET only when existing team expertise or library requirements justify the additional integration effort.

---

## 4. Integration & Connectivity

### SAP Integration Suite

- **ID interno:** `integration-suite`
- **Categoría:** Integration & Connectivity
- **Estado:** `GA`
- **Descripción breve:** SAP's cloud integration platform. A unified subscription that provides: Cloud Integration (CPI), API Management, Event Mesh, Open Connectors, Integration Advisor, and Business Rules Engine. The primary integration tool for SAP landscapes.
- **Problema que resuelve:** Connecting SAP and non-SAP systems, orchestrating complex message flows, managing APIs, and enabling event-driven integration.
- **Casos de uso:** S/4HANA ↔ SAP B1 integration. EDI/B2B. API publishing. Cross-cloud event routing.
- **Cuándo usarlo:** Whenever integration requires transformation, routing, B2B protocols, or API governance.
- **Cuándo evitarlo:** Simple API calls with no transformation — use Cloud SDK + Destination Service directly.
- **Prerrequisitos:** Integration Suite subscription. Activation of required capabilities.
- **Runtime o entorno compatible:** Cloud Foundry (managed service).
- **Identidad, permisos y seguridad:** OAuth 2.0 for all API interactions. Credential management in secure parameters. Role-based access to capabilities.
- **Conectividad necesaria:** Internet + optionally Cloud Connector for on-premise.
- **Entitlement y service plan:** Integration Suite subscription. Capability-based licensing (verify per capability).
- **Disponibilidad regional:** REQUIRES_VALIDATION — not all capabilities available in all regions.
- **Coste / consumo:** `verificar en fuente oficial` (message-based pricing for Cloud Integration).
- **Interfaces disponibles:** Integration Suite UI, Cloud Integration Designer, API Management portal, REST APIs.
- **Servicios relacionados:** Cloud Connector, Destination Service, Event Mesh, XSUAA.
- **Alternativas dentro de BTP:** For simple cases: Destination Service + Cloud SDK.
- **Limitaciones y riesgos:** Licensing complexity (each capability may need separate activation). iFlow debugging requires expertise.
- **Prioridad de aprendizaje:** `core`
- **Documentación oficial:** https://help.sap.com/docs/integration-suite
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/integration-suite
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### SAP Cloud Connector

- **ID interno:** `cloud-connector`
- **Categoría:** Integration & Connectivity
- **Estado:** `GA`
- **Descripción breve:** On-premise software agent that establishes a secure reverse tunnel between BTP and on-premise systems. Eliminates the need for inbound firewall rules.
- **Problema que resuelve:** Secure access to on-premise systems (SAP ERP, B1, databases) from BTP without exposing the internal network.
- **Casos de uso:** BTP apps calling S/4HANA on-premise. Integration Suite connecting to on-premise SAP. Accessing HANA on-premise databases from BTP.
- **Cuándo usarlo:** Whenever BTP needs to reach systems in a private network.
- **Cuándo evitarlo:** Cloud-to-cloud connectivity. Systems already accessible via public API.
- **Prerrequisitos:** Java 11+ on on-premise server. Network access from server to BTP region endpoint. Connectivity Service entitlement in BTP.
- **Runtime o entorno compatible:** On-premise (agent); integrates with CF and Kyma BTP runtimes.
- **Identidad, permisos y seguridad:** TLS-encrypted tunnel. Authentication via BTP subaccount credentials. Restrict exposed resources to minimum paths/ports. The on-premise host must be hardened.
- **Conectividad necesaria:** Outbound HTTPS from on-premise host to BTP region.
- **Entitlement y service plan:** Connectivity Service entitlement covers Cloud Connector usage.
- **Disponibilidad regional:** Connects to specific BTP region.
- **Coste / consumo:** `verificar en fuente oficial` (Connectivity Service pricing).
- **Interfaces disponibles:** Cloud Connector Admin UI (localhost), BTP Cockpit (connection status), configuration files.
- **Servicios relacionados:** Connectivity Service, Destination Service, Integration Suite.
- **Alternativas dentro de BTP:** Private Link Service (cloud-provider-specific — REQUIRES_VALIDATION).
- **Limitaciones y riesgos:** Single point of failure if not set up in HA mode. On-premise host security is customer responsibility. Not designed for high-bandwidth data transfer.
- **Prioridad de aprendizaje:** `core`
- **Documentación oficial:** https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/cloud-connector
- **Discovery Center:** N/A (on-premise component)
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

## 5. Data & Analytics

### SAP HANA Cloud

- **ID interno:** `hana-cloud`
- **Categoría:** Data & Analytics
- **Estado:** `GA`
- **Descripción breve:** Cloud-native in-memory database. Supports relational SQL, graph, spatial, document store, and Python ML (PAL). Provides vector capabilities for AI workloads. The primary database for BTP applications.
- **Problema que resuelve:** High-performance, multi-model database for BTP applications, analytics, and AI.
- **Casos de uso:** CAP application persistence. HANA-native analytics. Vector storage for RAG (verify version compatibility). Real-time operational reporting.
- **Cuándo usarlo:** Production persistence for CAP apps. Scenarios requiring in-memory performance. Vector workloads (verify availability).
- **Cuándo evitarlo:** Simple key-value storage. Cost-constrained prototypes where SQLite local is sufficient. Non-relational document scenarios where other solutions fit better.
- **Prerrequisitos:** HANA Cloud entitlement. Service instance in subaccount.
- **Runtime o entorno compatible:** CF (service), Kyma (service), standalone.
- **Identidad, permisos y seguridad:** HDI containers for app isolation. Encryption at rest and in transit. No direct SQL access from external or agent processes. Database users must be scoped to minimum privileges.
- **Conectividad necesaria:** Allowed IPs or Cloud Connector for on-premise access.
- **Entitlement y service plan:** HANA Cloud entitlement. Plans differ by compute and storage capacity.
- **Disponibilidad regional:** Available in major BTP regions — verify at Discovery Center.
- **Coste / consumo:** `verificar en fuente oficial` (compute + storage).
- **Interfaces disponibles:** SQL, JDBC, ODBC, OData (via CAP), SAP HANA Database Explorer (UI).
- **Servicios relacionados:** CAP, Datasphere, AI Core, Analytics Cloud.
- **Alternativas dentro de BTP:** PostgreSQL on BTP (REQUIRES_VALIDATION — verify availability), Object Store for unstructured data.
- **Limitaciones y riesgos:** Cost scales with compute. Vector engine feature availability depends on HANA Cloud version — REQUIRES_VALIDATION.
- **Prioridad de aprendizaje:** `core`
- **Documentación oficial:** https://help.sap.com/docs/hana-cloud
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/sap-hana-cloud
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### SAP Datasphere

- **ID interno:** `datasphere`
- **Categoría:** Data & Analytics
- **Estado:** `GA`
- **Descripción breve:** Cloud data warehouse and data management platform. Supports data federation (query remote data without moving it), data replication, semantic data modeling, and data marketplace.
- **Problema que resuelve:** Enterprise data warehouse consolidation and data governance across heterogeneous sources.
- **Casos de uso:** Enterprise DWH on BTP. Data federation across SAP and non-SAP systems. Semantic modeling for analytics.
- **Cuándo usarlo:** When unified data access, governance, and modeling across multiple sources is needed.
- **Cuándo evitarlo:** OLTP transactional workloads. Simple application persistence.
- **Prerrequisitos:** Datasphere subscription (separate from HANA Cloud).
- **Runtime o entorno compatible:** Standalone SaaS.
- **Identidad, permisos y seguridad:** IAS for SSO. Space-based access control. Data privacy settings.
- **Conectividad necesaria:** Internet + optional Cloud Connector for on-premise sources.
- **Entitlement y service plan:** Datasphere subscription. Capacity-based pricing.
- **Disponibilidad regional:** REQUIRES_VALIDATION — verify at Discovery Center.
- **Coste / consumo:** `verificar en fuente oficial`
- **Interfaces disponibles:** Datasphere UI, SQL, REST APIs, BTP integration.
- **Servicios relacionados:** HANA Cloud, Analytics Cloud, Integration Suite.
- **Alternativas dentro de BTP:** HANA Cloud for pure database needs.
- **Limitaciones y riesgos:** Separate product with its own licensing. Not a replacement for HANA Cloud.
- **Prioridad de aprendizaje:** `important`
- **Documentación oficial:** https://help.sap.com/docs/SAP_DATASPHERE
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/sap-datasphere
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

## 6. Artificial Intelligence

### SAP AI Core

- **ID interno:** `ai-core`
- **Categoría:** Artificial Intelligence
- **Estado:** `GA`
- **Descripción breve:** Managed AI infrastructure service on BTP. Provides ML training pipelines (Argo Workflows), model deployment, inference endpoints, and the Generative AI Hub for LLM access. Central AI runtime for SAP AI Foundation.
- **Problema que resuelve:** Running, managing, and governing AI/ML workloads on BTP.
- **Casos de uso:** Deploying custom ML models for inference. Accessing GPT-4, Claude, Gemini via Generative AI Hub. RAG pipelines with HANA Cloud. Enterprise AI scenarios.
- **Cuándo usarlo:** Any production AI/ML scenario on BTP. Access to SAP-managed LLMs.
- **Cuándo evitarlo:** Simple rule-based automation. Embedded Business AI features in SAP products (those are pre-built and don't require AI Core setup).
- **Prerrequisitos:** AI Core entitlement. Resource group configured. Service instance bound.
- **Runtime o entorno compatible:** CF, Kyma, standalone.
- **Identidad, permisos y seguridad:** OAuth 2.0 for AI Core API access. Resource groups for tenant isolation. Secret management built-in. Do not expose inference endpoints publicly.
- **Conectividad necesaria:** Internet to AI Core API endpoints.
- **Entitlement y service plan:** AI Core entitlement. Plans: free tier (limited), standard, extended.
- **Disponibilidad regional:** REQUIRES_VALIDATION — not all regions available; check Discovery Center.
- **Coste / consumo:** `verificar en fuente oficial` (token-based for LLMs, compute for training).
- **Interfaces disponibles:** REST APIs, Python SDK (AI Core SDK), AI Launchpad UI.
- **Servicios relacionados:** AI Launchpad, HANA Cloud, Destination Service, Generative AI Hub.
- **Alternativas dentro de BTP:** Direct external LLM API calls (no SAP governance), embedded Joule (no custom models).
- **Limitaciones y riesgos:** LLM model availability varies by region and provider. Training pipeline requires Argo Workflows knowledge. Cost can be significant at scale.
- **Prioridad de aprendizaje:** `important`
- **Documentación oficial:** https://help.sap.com/docs/sap-ai-core
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/sap-ai-core
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### SAP Generative AI Hub

- **ID interno:** `generative-ai-hub`
- **Categoría:** Artificial Intelligence
- **Estado:** `GA`
- **Descripción breve:** Capability within SAP AI Core providing a unified API gateway to multiple large language model providers (OpenAI, Anthropic, Google, Mistral, open-source models). Includes prompt lifecycle management and content filtering.
- **Problema que resuelve:** Accessing multiple LLMs through a single SAP-governed endpoint with consistent API and security controls.
- **Casos de uso:** Building LLM-powered BTP apps. Prompt management and versioning. Model evaluation and comparison. RAG-based document Q&A.
- **Cuándo usarlo:** Any generative AI scenario on BTP that requires SAP governance.
- **Cuándo evitarlo:** Scenarios where direct API calls to LLM providers are simpler and no SAP governance is needed.
- **Prerrequisitos:** AI Core entitlement with Generative AI Hub plan. Model deployment configured.
- **Runtime o entorno compatible:** Standalone (accessed via REST API).
- **Identidad, permisos y seguridad:** OAuth 2.0 via AI Core. Input/output can be logged. Content filtering configurable.
- **Conectividad necesaria:** Internet to AI Core endpoints.
- **Entitlement y service plan:** Included in AI Core; model-specific plans may apply.
- **Disponibilidad regional:** REQUIRES_VALIDATION — model availability varies by region.
- **Coste / consumo:** `verificar en fuente oficial` (per-token pricing per model).
- **Interfaces disponibles:** REST API (OpenAI-compatible), Python SDK, AI Launchpad.
- **Servicios relacionados:** AI Core, AI Launchpad, HANA Cloud (for RAG).
- **Alternativas dentro de BTP:** N/A (unique SAP service).
- **Limitaciones y riesgos:** Not all LLM providers/models available in all regions. Prompt injection risks must be mitigated at application level.
- **Prioridad de aprendizaje:** `important`
- **Documentación oficial:** https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/generative-ai-hub-in-sap-ai-core
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/sap-ai-core
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### Joule (SAP AI Copilot)

- **ID interno:** `joule`
- **Categoría:** Artificial Intelligence
- **Estado:** `GA`
- **Descripción breve:** SAP's generative AI copilot embedded across SAP products (SAP S/4HANA, SuccessFactors, Ariba, BTP Build Code, etc.). Provides natural language interaction for business processes and development.
- **Problema que resuelve:** AI-assisted work within SAP products without custom AI development.
- **Casos de uso:** Code generation in Build Code. Business process Q&A in S/4HANA. Report generation in SAP Analytics Cloud.
- **Cuándo usarlo:** When the target SAP product supports Joule integration.
- **Cuándo evitarlo:** Custom AI scenarios requiring bespoke models or pipelines — use AI Core.
- **Prerrequisitos:** Joule entitlement. Supported SAP product.
- **Runtime o entorno compatible:** Embedded in SAP SaaS products.
- **Identidad, permisos y seguridad:** Inherits the product's security model. No additional configuration usually needed.
- **Conectividad necesaria:** Standard SAP product connectivity.
- **Entitlement y service plan:** REQUIRES_VALIDATION — availability varies by product and contract.
- **Disponibilidad regional:** REQUIRES_VALIDATION — verify per product.
- **Coste / consumo:** `verificar en fuente oficial`
- **Interfaces disponibles:** Embedded UI in SAP products.
- **Servicios relacionados:** AI Core, Generative AI Hub, Build Code.
- **Alternativas dentro de BTP:** Custom LLM integration via AI Core.
- **Limitaciones y riesgos:** Availability depends on product-specific roadmap. Not configurable with custom models.
- **Prioridad de aprendizaje:** `important`
- **Documentación oficial:** https://help.sap.com/docs/joule
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/joule
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

## 7. Security & Identity

### SAP Cloud Identity Services (IAS + IPS)

- **ID interno:** `cloud-identity-services`
- **Categoría:** Security & Identity
- **Estado:** `GA`
- **Descripción breve:** Umbrella service encompassing Identity Authentication Service (IAS) and Identity Provisioning Service (IPS). IAS is the cloud identity provider; IPS automates user lifecycle management.
- **Problema que resuelve:** Cloud-based identity for BTP applications: authentication, SSO, MFA, and user provisioning.
- **Casos de uso:** SSO for BTP applications. MFA enforcement. Federated identity from Azure AD or Okta. Automated user sync from LDAP.
- **Cuándo usarlo:** Always — every user-facing BTP application needs an identity provider.
- **Cuándo evitarlo:** Machine-to-machine authentication only (use XSUAA client credentials).
- **Prerrequisitos:** IAS tenant (provisioned with BTP global account).
- **Runtime o entorno compatible:** All BTP runtimes; standalone SaaS.
- **Identidad, permisos y seguridad:** Configure MFA for all admin users. Use risk-based authentication rules. Never share IAS admin credentials.
- **Conectividad necesaria:** Internet to IAS tenant URL.
- **Entitlement y service plan:** Included with BTP global account (one tenant). Additional tenants: REQUIRES_VALIDATION.
- **Disponibilidad regional:** IAS is globally available (cloud service).
- **Coste / consumo:** `verificar en fuente oficial`
- **Interfaces disponibles:** IAS Admin Console (UI), REST APIs (SCIM, OIDC, SAML metadata).
- **Servicios relacionados:** XSUAA, BTP Subaccounts, all BTP applications.
- **Alternativas dentro de BTP:** XSUAA (CF-specific, for machine auth). External IdP direct trust (less recommended).
- **Limitaciones y riesgos:** IAS is the recommended IdP for all new BTP apps; migrating from XSUAA-only to IAS adds complexity.
- **Prioridad de aprendizaje:** `core`
- **Documentación oficial:** https://help.sap.com/docs/cloud-identity-services
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/identity-authentication
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### Authorization and Trust Management Service (XSUAA)

- **ID interno:** `xsuaa`
- **Categoría:** Security & Identity
- **Estado:** `GA`
- **Descripción breve:** SAP's OAuth 2.0 authorization server on Cloud Foundry (based on Cloud Foundry UAA). Issues JWT access tokens. Manages scopes, role templates, and role collections for CF applications.
- **Problema que resuelve:** OAuth 2.0 authorization for Cloud Foundry applications. Service-to-service token flows.
- **Casos de uso:** CAP applications needing user authentication + authorization. Service-to-service OAuth client credentials. JWT token exchange for calling SAP backends.
- **Cuándo usarlo:** CF-based applications. Any scenario needing OAuth 2.0 authorization on BTP.
- **Cuándo evitarlo:** Kyma-native apps (use IAS OIDC). Non-CF runtimes.
- **Prerrequisitos:** CF environment. XSUAA service instance. xs-security.json (scopes, role templates).
- **Runtime o entorno compatible:** Cloud Foundry.
- **Identidad, permisos y seguridad:** Define minimal scope sets. Short token expiry. One XSUAA instance per service (avoid sharing). Trust IAS for user authentication.
- **Conectividad necesaria:** Internal to CF (via service binding).
- **Entitlement y service plan:** Authorization and Trust Management entitlement. Plans: application, broker, space.
- **Disponibilidad regional:** Available in all CF-enabled regions.
- **Coste / consumo:** `verificar en fuente oficial`
- **Interfaces disponibles:** CF service binding (VCAP_SERVICES), OAuth 2.0 endpoints, REST management API.
- **Servicios relacionados:** IAS, CAP, Application Router, CF Environment.
- **Alternativas dentro de BTP:** IAS (for OIDC); Kyma uses Kubernetes-native auth.
- **Limitaciones y riesgos:** CF-specific — not native to Kyma. XSUAA-to-IAS migration adds complexity if done later.
- **Prioridad de aprendizaje:** `core`
- **Documentación oficial:** https://help.sap.com/docs/btp/sap-business-technology-platform/authorization-and-trust-management-in-cloud-foundry-environment
- **Discovery Center:** N/A
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

## 8. Automation & Low-Code

### SAP Build Process Automation

- **ID interno:** `build-process-automation`
- **Categoría:** Automation & Low-Code
- **Estado:** `GA`
- **Descripción breve:** Low-code automation platform for workflow automation, robotic process automation (RPA), business rules, forms, and human approval tasks. Part of the SAP Build portfolio.
- **Problema que resuelve:** Automating business processes without heavy coding. Replacing manual approvals, repetitive UI tasks, and rule-based decisions.
- **Casos de uso:** Purchase order approval workflows. RPA bots for SAP GUI or web UI automation. Business rules for pricing or eligibility. Employee onboarding forms.
- **Cuándo usarlo:** When business processes can be automated with low-code tools and pre-built connectors.
- **Cuándo evitarlo:** Complex backend integration logic (use Integration Suite). Custom-coded high-performance workflows (use CAP).
- **Prerrequisitos:** SAP Build Process Automation entitlement. Bot agent for RPA.
- **Runtime o entorno compatible:** Standalone SaaS.
- **Identidad, permisos y seguridad:** IAS for SSO. Bot credentials stored in credential vault. Human approval steps for high-risk operations.
- **Conectividad necesaria:** Internet + optionally Cloud Connector for on-premise systems.
- **Entitlement y service plan:** SAP Build Process Automation subscription. Capacity-based.
- **Disponibilidad regional:** REQUIRES_VALIDATION — verify at Discovery Center.
- **Coste / consumo:** `verificar en fuente oficial`
- **Interfaces disponibles:** SAP Build Process Automation UI, REST APIs, SAP Inbox for approvals.
- **Servicios relacionados:** Build Apps, Build Work Zone, Integration Suite.
- **Alternativas dentro de BTP:** Custom workflow with CAP + BTP workflow APIs.
- **Limitaciones y riesgos:** Bot maintenance when UI changes. Complex multi-system workflows may need Integration Suite.
- **Prioridad de aprendizaje:** `important`
- **Documentación oficial:** https://help.sap.com/docs/build-process-automation
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/sap-build-process-automation
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

## 9. Operations, Observability & Governance

### SAP Cloud ALM

- **ID interno:** `cloud-alm`
- **Categoría:** Operations & Observability
- **Estado:** `GA`
- **Descripción breve:** SAP's Application Lifecycle Management platform for cloud solutions. Provides health monitoring, implementation project management (SAP Activate), change and deployment tracking, and intelligent alerting.
- **Problema que resuelve:** End-to-end SAP solution lifecycle management and operations monitoring.
- **Casos de uso:** Monitoring BTP and SAP cloud application health. Implementation project tracking. Centralized alert correlation.
- **Cuándo usarlo:** Any SAP cloud deployment requiring professional ALM and monitoring.
- **Cuándo evitarlo:** Custom application logging (use Cloud Logging). Simple non-SAP workloads.
- **Prerrequisitos:** SAP Cloud ALM entitlement (typically with SAP Enterprise Support). SAP Business Technology Platform.
- **Runtime o entorno compatible:** Standalone SaaS.
- **Identidad, permisos y seguridad:** IAS for SSO. Role-based access to monitoring features.
- **Conectividad necesaria:** Cloud ALM to monitored systems (cloud-based agents).
- **Entitlement y service plan:** Cloud ALM included with SAP Enterprise Support or CPEA — REQUIRES_VALIDATION.
- **Disponibilidad regional:** Global SaaS.
- **Coste / consumo:** `verificar en fuente oficial`
- **Interfaces disponibles:** Cloud ALM UI, REST APIs.
- **Servicios relacionados:** Cloud Logging, Alert Notification, Transport Management.
- **Alternativas dentro de BTP:** Cloud Logging + Alert Notification for custom app monitoring.
- **Limitaciones y riesgos:** Primarily designed for SAP-managed services; custom app coverage limited.
- **Prioridad de aprendizaje:** `important`
- **Documentación oficial:** https://help.sap.com/docs/cloud-alm
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/sap-cloud-alm
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`

---

### SAP BTP Continuous Integration & Delivery Service

- **ID interno:** `cicd-service`
- **Categoría:** Operations & Observability
- **Estado:** `GA`
- **Descripción breve:** Managed CI/CD pipeline service on BTP. Provides pre-configured job templates for CAP, SAP Fiori, and Kyma deployments. Eliminates need for Jenkins or external CI/CD for standard SAP project types.
- **Problema que resuelve:** Automated build and deployment for BTP projects without managing CI/CD infrastructure.
- **Casos de uso:** Automated CAP app builds and CF deployments. Fiori app deployment. Kyma-based microservice pipelines.
- **Cuándo usarlo:** Standard BTP projects needing CI/CD with minimal DevOps overhead.
- **Cuándo evitarlo:** Complex enterprise pipelines requiring advanced features (use Jenkins, GitHub Actions, or Azure DevOps).
- **Prerrequisitos:** CI/CD Service entitlement. Git repository (GitHub, GitLab, Bitbucket, Gerrit).
- **Runtime o entorno compatible:** Cloud Foundry, Kyma.
- **Identidad, permisos y seguridad:** Credentials stored in CI/CD service. Git webhooks over HTTPS.
- **Conectividad necesaria:** Internet to Git provider.
- **Entitlement y service plan:** CI/CD Service entitlement. Plans: free tier, standard.
- **Disponibilidad regional:** REQUIRES_VALIDATION — verify at Discovery Center.
- **Coste / consumo:** `verificar en fuente oficial`
- **Interfaces disponibles:** BTP Cockpit integration, REST API, YAML job configuration.
- **Servicios relacionados:** Transport Management Service, Cloud ALM.
- **Alternativas dentro de BTP:** External CI/CD (GitHub Actions, Jenkins) with BTP CLI for deployment.
- **Limitaciones y riesgos:** Limited to SAP-specific job types. Advanced pipelines require external tools.
- **Prioridad de aprendizaje:** `important`
- **Documentación oficial:** https://help.sap.com/docs/continuous-integration-and-delivery
- **Discovery Center:** https://discovery-center.cloud.sap/serviceCatalog/continuous-integration-and-delivery
- **Fecha de verificación:** 2026-08-10
- **Estado de validación:** `VERIFIED`
