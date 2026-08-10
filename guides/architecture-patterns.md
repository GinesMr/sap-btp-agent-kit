# Architecture Patterns — SAP BTP

Common architectural patterns for BTP solutions, with components, trade-offs, and decision guidance.

**These are design patterns, not official SAP documentation. Validate all service choices against official sources before implementation.**

**Last verified:** 2026-08-10

---

## Pattern 1: Standard CAP Full-Stack Application

**Use case:** Line-of-business application with Fiori UI, business logic, and HANA Cloud database.

```
[Browser]
    ↓ HTTPS + OIDC (IAS)
[Application Router] — serves Fiori UI + routes API calls
    ↓ JWT validation
[CAP Service] — business logic, OData/REST API
    ↓ HDI binding
[HANA Cloud] — relational data
    
Additional services:
- XSUAA: authorization
- Destination Service: external system connections
- Audit Log: compliance
```

**Components:**
| Component | BTP Service |
|-----------|------------|
| Identity | IAS + XSUAA |
| UI hosting | HTML5 App Repository + Work Zone |
| Backend | CAP (CF) |
| Database | HANA Cloud |
| Logging | Cloud Logging |

**Trade-offs:**
- Pros: Fast to build, SAP tooling native, good OSS community.
- Cons: CF-specific; Python/Go devs need to adapt.

**Decision criteria:** Choose this for standard business application development with Node.js or Java.

---

## Pattern 2: Event-Driven Integration

**Use case:** SAP S/4HANA publishes business events; BTP processes and routes them.

```
[S/4HANA] — business event (order created)
    ↓ AMQP/REST publish
[SAP Event Mesh] — topic/queue
    ↓ subscription
[CAP Service / iFlow] — process event
    ↓
[Target System(s)] — e.g., legacy system, notification, analytics
```

**Components:**
| Component | BTP Service |
|-----------|------------|
| Event broker | SAP Event Mesh |
| Processing | CAP or Integration Suite iFlow |
| Storage | HANA Cloud (event log) |
| Monitoring | Alert Notification |

**Trade-offs:**
- Pros: Decoupled; S/4HANA unblocked; retry possible.
- Cons: Eventual consistency; debugging across async hops harder.

**Decision criteria:** Choose for high-volume, decoupled integration. Avoid for synchronous real-time requirements.

---

## Pattern 3: Hybrid Integration (On-Premise + Cloud)

**Use case:** BTP application needs to read/write data from on-premise SAP ERP or B1.

```
[BTP Application]
    ↓ Destination Service (OnPremise proxy type)
[Connectivity Service]
    ↓ (tunnel)
[Cloud Connector] (on-premise)
    ↓
[On-Premise System] — SAP ERP, SAP B1 Service Layer
```

**Components:**
| Component | BTP Service / Location |
|-----------|----------------------|
| Connectivity | Connectivity Service + Destination Service |
| Tunnel agent | Cloud Connector (on-premise) |
| Auth | XSUAA + Principal Propagation |
| Backend call | Cloud SDK (Java/JS) |

**Trade-offs:**
- Pros: No network exposure of on-premise; standard SAP pattern.
- Cons: Cloud Connector is a single point of failure without HA setup; latency added.

**Decision criteria:** Use for all on-premise connectivity. No exceptions for exposing on-premise directly.

---

## Pattern 4: API Facade with Governance

**Use case:** Organization wants to expose internal APIs to external developers with governance.

```
[External Developer App]
    ↓ OAuth 2.0 / API Key
[API Management] — rate limiting, auth, logging
    ↓ reverse proxy
[Backend API] — CAP, Integration Suite, or any REST service
    ↓
[Data layer]
```

**Components:**
| Component | BTP Service |
|-----------|------------|
| API gateway | API Management (Integration Suite) |
| Developer onboarding | Developer Portal |
| Backend | CAP or Integration Suite |
| Auth | XSUAA / IAS |

**Trade-offs:**
- Pros: Full governance; developer self-service; analytics.
- Cons: Requires Integration Suite license; adds latency.

**Decision criteria:** Use when external developers need structured API access with quotas and analytics.

---

## Pattern 5: AI-Powered Business Assistant

**Use case:** LLM-powered assistant accessing SAP system data via controlled tools.

```
[User via Teams / Web / Copilot]
    ↓ IAS authenticated request
[Agent Orchestrator (CAP + Generative AI Hub)]
    ↓ LLM reasoning + tool calls
[Domain API / MCP Server] — typed business operations
    ↓ via Destination + Cloud Connector
[SAP Backend] — B1 Service Layer, S/4HANA, etc.
    
Supporting services:
- HANA Cloud: conversation history + vector search
- Cloud Logging: operation audit trail
- XSUAA: per-user authorization
```

**Components:**
| Component | BTP Service |
|-----------|------------|
| LLM access | AI Core + Generative AI Hub |
| Orchestration | CAP (CF) |
| Tool layer | MCP Server or typed REST API |
| Vector store | HANA Cloud |
| Identity | IAS + XSUAA |

**Trade-offs:**
- Pros: Natural language interface; flexible tool composition.
- Cons: LLM cost; response latency; prompt injection risk; regulatory uncertainty.

**Decision criteria:** Use when natural language interaction adds clear business value. Always maintain typed business API layer.

---

## Pattern 6: Multi-Tenant SaaS on BTP

**Use case:** Building a multi-tenant SaaS application on BTP to sell to multiple SAP customers.

```
[Tenant A Users]    [Tenant B Users]
        ↓                   ↓
[IAS - Tenant A]    [IAS - Tenant B]
        ↓                   ↓
[Application Router + XSUAA (tenant-aware)]
        ↓
[CAP Multitenant Service]
        ↓ tenant isolation
[HANA Cloud - HDI container per tenant]
```

**Key concepts:**
- **Provider subaccount:** Where the SaaS app runs.
- **Consumer subaccount:** Where tenants subscribe to the app.
- **Subscription:** Tenant onboarding via SAP SaaS Provisioning Service.
- **Tenant isolation:** HDI containers for database; XSUAA for authorization.

**Trade-offs:**
- Pros: Scalable; each tenant isolated; SAP-native SaaS model.
- Cons: Significant complexity; CAP multitenant features required; onboarding automation needed.

**Decision criteria:** Use for ISV applications targeting SAP ecosystem customers.

**Source:** https://cap.cloud.sap/docs/guides/multitenancy/

---

## Pattern 7: Data-Driven Analytics Platform

**Use case:** Centralize and analyze data from multiple SAP and non-SAP systems.

```
[S/4HANA]  [SAP B1]  [Salesforce]  [CSV Files]
     ↓           ↓         ↓              ↓
[SAP Datasphere] — federation + replication + modeling
     ↓
[SAP Analytics Cloud] — dashboards + planning
     ↓
[Business Users]
```

**Trade-offs:**
- Pros: SAP-native analytics; integration with SAP data.
- Cons: Datasphere and SAC are separate products with separate licensing.

**Decision criteria:** Use when centralizing SAP data analytics is the primary need. Avoid for application-level reporting (use HANA Cloud + CAP instead).

---

## Architecture Decision Factors

When designing a BTP solution, evaluate:

| Factor | Questions |
|--------|-----------|
| Data residency | Where must data physically reside? Which region(s)? |
| Latency | What response time SLA? Synchronous or async? |
| Scale | Expected concurrent users? Peak load? |
| Security | Who can access what? Identity provider? MFA? |
| Budget | Available entitlements? CPEA or PAYG? |
| Team skills | Node.js? Java? ABAP? Kubernetes? |
| Connectivity | Cloud-only or hybrid? Which on-premise systems? |
| Lifecycle | How often will this change? Who will maintain it? |

---

## Anti-Patterns

| Anti-Pattern | Problem | Correct Pattern |
|--------------|---------|----------------|
| Monolith on CF | Scaling and deployment issues | Modular CAP or Kyma microservices |
| Sharing subaccount across DEV/PROD | Security and isolation failure | Separate subaccounts per environment |
| Hardcoded credentials | Security exposure | Destination Service + Credential Store |
| Direct DB access from UI | Security | Backend service layer required |
| No error handling in iFlows | Silent failures | Dead letter queue + alerting |
| Manual transport between environments | Error-prone | Transport Management Service |
| LLM with unrestricted tool access | Security risk | Typed tool API with auth and validation |
