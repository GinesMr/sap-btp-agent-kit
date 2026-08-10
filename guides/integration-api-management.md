# Integration & API Management — SAP BTP

SAP Integration Suite is the primary integration platform on BTP. This guide covers architecture, design patterns, and key services.

**Official sources:**
- Integration Suite: https://help.sap.com/docs/integration-suite
- Cloud Integration: https://help.sap.com/docs/cloud-integration
- SAP Business Accelerator Hub: https://api.sap.com/

**Last verified:** 2026-08-10

---

## SAP Integration Suite — Overview

Integration Suite is a **subscription** that bundles multiple integration capabilities. Each capability must be activated separately.

| Capability | Purpose | Pricing |
|-----------|---------|---------|
| Cloud Integration (CPI) | Message-based integration, iFlows | Message-volume based |
| API Management | API gateway, governance, developer portal | API call based |
| Open Connectors | Pre-built connectors to 150+ SaaS apps | Connector + call based |
| Integration Advisor | B2B message format mapping | REQUIRES_VALIDATION |
| Event Mesh | Queue/topic-based messaging | REQUIRES_VALIDATION |
| Business Rules | Rule-based decisions | REQUIRES_VALIDATION |

`REQUIRES_VALIDATION:` Exact pricing and bundling — verify at SAP Discovery Center and during licensing discussions.

---

## Cloud Integration (CPI)

### What is an iFlow?

An **Integration Flow (iFlow)** is a visual pipeline that:
1. Receives a message (HTTP, SFTP, AMQP, SOAP, RFC, etc.).
2. Transforms the message (Mapping, Groovy script, XSLT).
3. Routes based on conditions.
4. Sends to one or more receivers.

### iFlow Components

| Component | Description |
|-----------|-------------|
| Sender Channel | How the iFlow receives messages (HTTP, SFTP, AS2, etc.) |
| Receiver Channel | How the iFlow sends messages |
| Mapping | Transform message format (Message Mapping, XSLT, Groovy) |
| Router | Split flow based on conditions |
| Splitter | Divide one message into multiple |
| Aggregator | Combine multiple messages into one |
| Content Modifier | Add, change, or remove message content |
| Script | Groovy or JavaScript for custom logic |
| Persistence | Store and retrieve data (Data Store) |

### Security in iFlows

- Store credentials as **Secure Parameters** (never in iFlow properties directly).
- Use OAuth 2.0 for all outbound API calls.
- Enable message logging carefully — avoid logging sensitive data.
- Use **mTLS** for B2B connections.

### Monitoring

Cloud Integration provides built-in monitoring:
- **Message Processing Log:** Status, error, payload of each iFlow execution.
- **Integration Content Advisor:** Validates iFlow design.
- **Operations Dashboard:** Performance metrics.

---

## API Management

### API Gateway Architecture

```
External Client → API Proxy (API Management) → Backend Service
                     ↓ applies policies
                  [Auth, Rate Limit, Transform, Cache, Log]
```

### API Policy Types

| Policy | Purpose |
|--------|---------|
| OAuth 2.0 / API Key | Authentication |
| Quota | Rate limiting per consumer |
| Spike Arrest | Throttling to prevent spikes |
| Mediation | Transform request/response format |
| Cache | Cache responses to reduce backend load |
| Logging | Record API calls |
| CORS | Cross-origin resource sharing |

### API Product and Developer Portal

- **API Product:** A bundle of APIs exposed to developers.
- **Developer Portal:** Self-service portal for external API consumers to discover, subscribe, and test APIs.
- **Application:** A developer app that gets credentials (API key or OAuth) for consuming API Products.

### When API Management is Overkill

Do not use API Management for:
- Internal microservice-to-microservice calls (use service bindings and direct HTTP).
- Private APIs without external consumers.
- Simple single-API scenarios without governance needs.

---

## SAP Business Accelerator Hub

**URL:** https://api.sap.com/

The authoritative catalog of:
- SAP API specifications (OData v2/v4, REST, SOAP).
- Pre-built integration content packages.
- API sandboxes for testing.
- Event catalogs.

**For agents:** Always check the Business Accelerator Hub before building a custom connector to an SAP system — a pre-built API or integration package may already exist.

---

## Open Connectors

Pre-built connectors to 150+ cloud applications:
- Salesforce, ServiceNow, HubSpot, Slack, Dropbox, Google Drive, etc.
- Normalizes different APIs into a unified REST interface.
- Connector authentication handled by Open Connectors.

**Limitation:** Only for listed third-party applications. Custom on-premise systems need Cloud Integration with Cloud Connector.

---

## Integration Advisor

Tool for defining and mapping B2B message formats (EDI, IDOC, X12, EDIFACT):
- Message implementation guidelines (MIG).
- Mapping guidelines (MAG).
- Generates reusable mapping artifacts for use in Cloud Integration iFlows.

---

## Event-Driven Integration

### SAP Event Mesh

- Queue-based and topic-based messaging.
- AMQP, MQTT, REST protocols.
- Applications publish events; subscribers consume asynchronously.

**Common pattern — Event-driven S/4HANA integration:**
```
S/4HANA Business Event → Event Mesh Topic → iFlow Subscription → Target System
```

### SAP Advanced Event Mesh

For high-throughput scenarios:
- Based on Solace technology.
- Multi-protocol: AMQP, MQTT, REST, JMS, WebSocket.
- Higher volume and lower latency than Event Mesh.
- Separate service — not included in Integration Suite.

---

## Integration Patterns

### Pattern 1: Synchronous API Call

```
BTP App → Destination Service → REST API (cloud or on-premise via CC)
```
Best for: Real-time data retrieval. Simple CRUD operations.

### Pattern 2: Mediated Integration via CPI

```
Source System → iFlow (transform + route) → Target System
```
Best for: Format transformation. Complex routing. B2B. Error handling and retry.

### Pattern 3: Event-Driven

```
Source System → Event Mesh (publish) → Consumer App (subscribe)
```
Best for: Asynchronous processing. Decoupled systems. High-volume events.

### Pattern 4: API Facade via API Management

```
External Consumer → API Proxy → Multiple Backend Services
```
Best for: External API monetization. Governance. Rate limiting. Developer portal.

### Pattern 5: Batch File Transfer

```
Source → SFTP Server → CPI iFlow (SFTP sender) → Transform → Target
```
Best for: Legacy batch integration. File-based EDI.

---

## Master Data Integration (MDI)

`REQUIRES_VALIDATION:` SAP Master Data Integration (MDI) is a service for synchronizing master data (Business Partners, Products) across SAP cloud solutions. Verify current service scope, availability, and supported entities at https://help.sap.com/docs/sap-master-data-integration.

---

## SAP Graph

`REQUIRES_VALIDATION:` SAP Graph was announced as a unified graph-based API for SAP data across products. Verify current status, availability, and replacement options at the SAP Help Portal and SAP Roadmap Explorer, as its status may have changed.

---

## Integration Design Checklist

Before deploying an integration to production:

- [ ] Error handling defined for all failure modes.
- [ ] Retry logic implemented for transient failures.
- [ ] Dead letter queue or alerting for unprocessable messages.
- [ ] Credentials stored in Secure Parameters (not iFlow properties).
- [ ] Sensitive data not logged in Message Processing Log.
- [ ] Idempotency handled (duplicate message detection).
- [ ] Monitoring configured (Alert Notification for iFlow failures).
- [ ] Performance tested with expected message volume.
- [ ] Regional availability of Integration Suite confirmed.
- [ ] License (message volume) sufficient for expected traffic.
