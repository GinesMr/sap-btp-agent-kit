# Glossary — SAP BTP

Key terms for the SAP Business Technology Platform ecosystem, ordered alphabetically. Used by agents to parse documentation and user requests correctly.

---

## A

**ABAP** — Advanced Business Application Programming. SAP's proprietary programming language. In BTP context, refers to the ABAP Environment (managed ABAP runtime in the cloud).

**Advanced Event Mesh** — SAP's enterprise-grade event broker service based on Solace technology, supporting high-throughput, multi-protocol event streaming.

**API Management** — Capability within SAP Integration Suite for publishing, governing, and monetizing APIs with policies, quotas, and developer portals.

**Application Router** — The central entry point for web applications deployed on BTP. Handles routing, authentication (XSUAA/IAS), and serves static content.

---

## B

**BAS** — SAP Business Application Studio. Cloud-based IDE for SAP development.

**BTP** — SAP Business Technology Platform. SAP's cloud platform integrating database, analytics, application development, automation, and integration capabilities.

**Build Code** — SAP's AI-powered development environment built on Business Application Studio, focused on CAP and Joule-assisted development.

---

## C

**CAP** — SAP Cloud Application Programming Model. An open-source framework for building enterprise-grade cloud applications using CDS, Node.js, and Java.

**CDS** — Core Data Services. A domain-specific language used in CAP for defining data models, services, and annotations.

**CPEA** — Cloud Platform Enterprise Agreement. SAP's enterprise licensing model for BTP services, offering consumption-based pricing within a committed spend.

**CF** — Cloud Foundry. One of the runtime environments available in BTP.

**Cloud Connector** — On-premise agent that creates a secure tunnel between BTP and on-premise systems without exposing the internal network to the Internet.

**Cloud Identity Services** — Umbrella service encompassing SAP Identity Authentication Service (IAS) and SAP Identity Provisioning Service (IPS).

---

## D

**Destination** — A named configuration in BTP that stores connectivity details (URL, authentication, certificates) for calling remote systems. Managed by the Destination Service.

**Directory** — A structural node in the BTP account hierarchy, sitting between Global Account and Subaccounts. Used for organizing subaccounts and managing entitlements.

**Discovery Center** — SAP's portal for discovering BTP services, their availability, pricing models, and guided learning missions.

---

## E

**Entitlement** — The right to use a specific BTP service and service plan, granted to a subaccount by the global account administrator.

**Event Mesh** — SAP's managed messaging service for asynchronous, decoupled communication between applications using queues and topics.

---

## F

**Free Tier** — A service plan offering limited free usage of certain BTP services, without time expiration. Different from Trial accounts.

---

## G

**Generative AI Hub** — Capability within SAP AI Core that provides access to large language models (LLMs) from multiple providers through a unified API.

**Global Account** — The top-level account in BTP hierarchy, representing a contract with SAP. Contains directories and subaccounts.

---

## H

**HANA Cloud** — SAP's cloud-native in-memory database, supporting SQL, graph, spatial, and document store capabilities.

---

## I

**IAS** — SAP Identity Authentication Service. Cloud identity provider supporting SAML, OIDC, and MFA for authenticating users.

**iFlow** — Integration Flow. A visual or XML-based integration pipeline in SAP Cloud Integration (part of Integration Suite).

**IPS** — SAP Identity Provisioning Service. Manages user and group provisioning between identity systems.

**Integration Suite** — SAP's cloud integration platform, encompassing Cloud Integration, API Management, Event Mesh, Open Connectors, and Integration Advisor.

---

## J

**Joule** — SAP's generative AI copilot, embedded across SAP products. Provides natural language interaction for business processes.

---

## K

**Kyma** — SAP's managed Kubernetes-based runtime environment on BTP, built on the open-source Kyma project. Supports serverless functions and microservices.

---

## L

**Landscape** — A grouping of BTP regions sharing the same infrastructure provider and geographic zone (e.g., AWS, Azure, GCP per region).

---

## M

**MCP** — Model Context Protocol. Open protocol for connecting AI agents to external tools and data sources via standardized servers.

**MTA** — Multi-Target Application. A packaging and deployment format for applications with multiple modules deployed to different BTP runtimes.

**MTAR** — Compiled/built MTA archive file (.mtar).

---

## O

**OIDC** — OpenID Connect. Identity layer on top of OAuth 2.0, used for authentication in BTP.

**Open Connectors** — Capability in Integration Suite providing pre-built connectors to 150+ third-party cloud applications.

---

## P

**PAYG** — Pay-As-You-Go. BTP commercial model where you pay for actual consumption without upfront commitment.

**Plan** — The specific tier or configuration of a BTP service instance (e.g., `application` plan for XSUAA, `lite` plan for Event Mesh).

---

## Q

**Quota** — The maximum amount of a resource (service instances, memory, routes) assigned to a subaccount or space.

---

## R

**Role Collection** — A named set of roles assigned to users or user groups in BTP, granting specific permissions to BTP cockpit, applications, or services.

**Runtime** — The execution environment for applications on BTP. Main options: Cloud Foundry, Kyma, ABAP Environment.

---

## S

**SAML** — Security Assertion Markup Language. Used for federated identity and single sign-on between IAS and corporate identity providers.

**Service Binding** — The mechanism linking a BTP service instance to an application, injecting credentials and configuration (VCAP_SERVICES in CF, secrets in Kyma).

**Service Instance** — A provisioned instance of a BTP service within a subaccount and space.

**Service Layer** — SAP Business One's REST API layer for accessing B1 business objects programmatically.

**Service Plan** — The pricing and feature tier of a BTP service (e.g., `standard`, `lite`, `free`).

**Subaccount** — The operative unit in BTP for deploying applications, consuming services, and managing users. Always belongs to a Global Account.

---

## T

**Trial Account** — A free, time-limited BTP account for learning and experimentation. Not for production.

**Trust Configuration** — The setup that defines which identity providers (IAS, Azure AD, etc.) are trusted for authenticating users in a subaccount.

---

## X

**XSUAA** — Extended Services for User Account and Authentication. SAP's OAuth 2.0 authorization server on BTP, built on Cloud Foundry UAA. Manages scopes, role templates, and JWT tokens for applications.

---

## Acronym Quick Reference

| Acronym | Full Name |
|---------|-----------|
| ALM | Application Lifecycle Management |
| BAS | Business Application Studio |
| BTP | Business Technology Platform |
| CAP | Cloud Application Programming Model |
| CDS | Core Data Services |
| CF | Cloud Foundry |
| CI/CD | Continuous Integration / Continuous Delivery |
| CPEA | Cloud Platform Enterprise Agreement |
| IaaS | Infrastructure as a Service |
| IAS | Identity Authentication Service |
| IPS | Identity Provisioning Service |
| MCP | Model Context Protocol |
| MTA | Multi-Target Application |
| OIDC | OpenID Connect |
| PAYG | Pay-As-You-Go |
| RAG | Retrieval-Augmented Generation |
| RPA | Robotic Process Automation |
| SAC | SAP Analytics Cloud |
| SAML | Security Assertion Markup Language |
| SDK | Software Development Kit |
| XSUAA | Extended Services for User Account and Authentication |
