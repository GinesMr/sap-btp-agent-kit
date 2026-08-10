---
name: sap-btp-integration
description: >
  Designs integration solutions on SAP BTP: Integration Suite iFlows, API Management,
  event-driven patterns, on-premise connectivity, and B2B. Use when the task involves
  connecting SAP or non-SAP systems, orchestrating data flows, or managing APIs.
---

## Objective

Design integration architectures on SAP BTP. Select the right integration pattern, service, and configuration for connecting systems reliably and securely.

## Problems This Skill Solves

- How to connect SAP S/4HANA to a third-party system?
- When to use Integration Suite vs direct API calls?
- How to design an event-driven integration?
- How to connect on-premise SAP systems to BTP?
- How to manage and govern APIs exposed to external consumers?
- How to handle EDI/B2B message formats?

## Required Reading

1. `catalog/agent-service-index.yaml` — Integration Suite, Cloud Connector, Event Mesh entries.
2. `guides/integration-api-management.md` — Integration Suite guide.
3. `guides/connectivity-destinations.md` — Destination Service and Cloud Connector.
4. `guides/events-messaging.md` — Event Mesh and Advanced Event Mesh.
5. `guides/architecture-patterns.md` — integration patterns.

## Official Sources to Verify

- Integration Suite: https://help.sap.com/docs/integration-suite
- Cloud Integration: https://help.sap.com/docs/cloud-integration
- Cloud Connector: https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/cloud-connector
- Business Accelerator Hub: https://api.sap.com/
- Event Mesh: https://help.sap.com/docs/sap-event-mesh

## Reasoning Flow

1. Identify systems to integrate: source, target, protocol, data format.
2. Determine integration pattern: synchronous API, async event, batch/file, B2B.
3. Consult `catalog/agent-service-index.yaml` for candidate services.
4. Check Business Accelerator Hub for pre-built content (iFlows, connectors).
5. Design connectivity (on-premise → Cloud Connector; cloud → Destination Service).
6. Define transformation and mapping requirements.
7. Plan error handling and retry strategy.
8. Define monitoring and alerting.
9. Identify entitlement and licensing requirements.
10. Output: integration design + checklist.

## Discovery Questions

- What systems are involved? Cloud or on-premise? SAP or non-SAP?
- What protocols? REST, OData, SOAP, SFTP, AS2, AMQP, RFC?
- What data formats? JSON, XML, CSV, EDI (X12, EDIFACT)?
- Is the flow synchronous (real-time) or asynchronous (decoupled)?
- What volume? Messages/day or GB/day?
- Is transformation needed or is it pass-through?
- Is B2B (external partner) involved?
- What are the error handling requirements?

## Integration Pattern Selection

| Scenario | Pattern | Service |
|----------|---------|---------|
| Real-time API call, no transformation | Direct + Destination | Cloud SDK + Destination |
| Complex transformation, routing | Mediated | Cloud Integration (iFlow) |
| On-premise system connectivity | Hybrid | Cloud Connector + Connectivity |
| Third-party SaaS app | Pre-built connector | Open Connectors |
| SAP event publishing | Event-driven | Event Mesh |
| High-volume streaming | Event streaming | Advanced Event Mesh |
| EDI/B2B | B2B mediated | Cloud Integration + Integration Advisor |
| External API governance | API facade | API Management |

## Security Rules

- OAuth 2.0 for all API connections in iFlows (no plain Basic Auth in production).
- Credentials stored in Integration Suite Secure Parameters (not iFlow properties).
- mTLS for B2B partner connections.
- No sensitive data in message processing logs.
- Cloud Connector system mappings restricted to minimum required paths.
- API Management: enforce auth policy on all published APIs.

## Antipatterns

- Using Integration Suite for simple API calls with no transformation.
- Hardcoding credentials in iFlow properties or message mappings.
- No error handling in iFlows (silent failures).
- Logging full message payloads including PII.
- Calling on-premise systems without Cloud Connector.
- No retry logic for transient failures.
- Not checking Business Accelerator Hub for pre-built content.

## Output Checklist

- [ ] Integration pattern selected and justified.
- [ ] Connectivity method defined (direct/Destination, Cloud Connector, Open Connectors).
- [ ] Transformation requirements identified.
- [ ] Error handling strategy defined.
- [ ] Retry and dead letter strategy specified.
- [ ] Monitoring and alerting configured.
- [ ] Security: credentials in Secure Parameters, OAuth used.
- [ ] Volume estimate and Integration Suite license impact assessed.
- [ ] Pre-built content checked at https://api.sap.com/.
- [ ] REQUIRES_VALIDATION items listed.

## Response Format

```
## Integration Design

### Systems and Flow
[Source → Transformation → Target; synchronous or async]

### Services Selected
[Integration Suite / Cloud Connector / Event Mesh / etc.]

### Connectivity
[Destination config, Cloud Connector system mapping]

### Transformation
[Mapping approach, format conversion]

### Error Handling
[Retry, dead letter, alerting]

### Security
[Auth type, credential storage]

### Monitoring
[Monitoring points, alert conditions]

### Sources Consulted
[Document + URL — verified YYYY-MM-DD]
```

## REQUIRES_VALIDATION Triggers

- Specific iFlow pre-built package availability for a system.
- Integration Suite capability availability in specific region.
- Advanced Event Mesh pricing and plan limits.
- B2B protocol support specifics for a partner.
- Master Data Integration or SAP Graph current status.
