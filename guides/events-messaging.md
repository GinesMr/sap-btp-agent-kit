# Events & Messaging — SAP BTP

Guide to event-driven architecture on SAP BTP using Event Mesh and Advanced Event Mesh.

**Official sources:**
- Event Mesh: https://help.sap.com/docs/sap-event-mesh
- Advanced Event Mesh: https://help.sap.com/docs/sap-advanced-event-mesh

**Last verified:** 2026-08-10

---

## Event-Driven Architecture on BTP

Publish/subscribe messaging decouples producers from consumers:
- Producer publishes an event without knowing who consumes it.
- Consumers subscribe to topics or queues.
- Broker (Event Mesh) stores and delivers messages.

**Benefits:** Loose coupling, independent scaling, retry and replay, temporal decoupling.

---

## SAP Event Mesh

Managed message broker on BTP. Supports queues (point-to-point) and topics (publish/subscribe).

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Queue** | FIFO message store. One consumer per queue. Guaranteed delivery. |
| **Topic** | Publish/subscribe. Multiple consumers. No persistent storage by default. |
| **Topic Subscription** | Creates a queue from a topic pattern. Makes topic messages persistent. |
| **Namespace** | Groups topics and queues for a service instance. |
| **Webhook** | Delivers messages to HTTP endpoints. |

### Service Plans

`REQUIRES_VALIDATION:` Verify current plans at Discovery Center. Plans include `dev` (limited) and others with different capacities.

### Event Mesh vs Queue: When to Use Each

| Scenario | Queue | Topic |
|----------|-------|-------|
| Work distribution (one processor per item) | ✓ | ✗ |
| Broadcasting events to multiple consumers | ✗ | ✓ (+ subscription) |
| Guaranteed exactly-once processing | ✓ | ✗ (topics alone) |
| Fan-out to multiple independent services | ✗ | ✓ |

### Publishing Events (REST API)

```javascript
const { QueueSenderService } = require('@sap/xb-msg-amqp-v100');
// Or use REST API directly:

const response = await fetch(`${messagingUrl}/messagingrest/v1/queues/MyQueue/messages`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ orderId: 'SO-1234', status: 'created' })
});
```

### CAP + Event Mesh Integration

CAP supports event emission natively:

```javascript
// In CAP service
const messaging = await cds.connect.to('messaging');

// Publish event
await messaging.emit('OrderCreated', { ID: order.ID, customer: order.customer });

// Subscribe to event
messaging.on('OrderCreated', async (msg) => {
    console.log('Processing order:', msg.data.ID);
});
```

### Security

- Use OAuth 2.0 for all Event Mesh API calls.
- Namespace-based isolation between applications.
- No public endpoint exposure — Event Mesh is accessed via BTP service binding.

**Official docs:** https://help.sap.com/docs/sap-event-mesh

---

## SAP Advanced Event Mesh

Enterprise-grade event streaming based on Solace technology. Separate service from Event Mesh.

### When to Choose Advanced Event Mesh

| Scenario | Event Mesh | Advanced Event Mesh |
|----------|-----------|---------------------|
| Simple BTP app messaging | ✓ | Overkill |
| High-throughput (millions/day) | Limited | ✓ |
| Low latency (sub-millisecond) | Limited | ✓ |
| Multi-protocol (AMQP, MQTT, REST, JMS, WebSocket) | Partial | ✓ |
| IoT device messaging | Limited | ✓ |
| Multi-region event distribution | Limited | ✓ |

### Protocols Supported

- AMQP 1.0
- MQTT 3.1 / 5.0
- REST
- JMS
- WebSocket
- SMF (Solace native)

### Concepts

- **Event Broker Service:** A dedicated broker instance.
- **VPN:** Virtual Private Network within the broker for tenant isolation.
- **Queue / Topic Endpoint:** Similar to Event Mesh but with higher performance.
- **Mesh:** Network of interconnected broker instances for global distribution.

`REQUIRES_VALIDATION:` Feature availability and pricing for SAP Advanced Event Mesh — verify at https://help.sap.com/docs/sap-advanced-event-mesh and SAP Discovery Center.

---

## S/4HANA Event Publishing to BTP

SAP S/4HANA Cloud publishes business events to Event Mesh:

```
S/4HANA Cloud
    ↓ business event (e.g., BusinessPartner.Changed)
SAP Event Mesh (topic)
    ↓ topic subscription
CAP Consumer / iFlow
    ↓
Action (update local cache, notify downstream system, etc.)
```

**Setup steps:**
1. Configure Event Mesh instance in BTP.
2. Configure S/4HANA Enterprise Event Enablement (via S/4HANA admin).
3. Map S/4HANA business events to Event Mesh topics.
4. Create topic subscription (topic → queue).
5. Build consumer application.

`REQUIRES_VALIDATION:` S/4HANA event catalog and setup — verify at SAP Business Accelerator Hub event catalog: https://api.sap.com/

---

## Integration Advisor and B2B Messaging

For EDI/B2B scenarios (AS2, X12, EDIFACT):
- Use Integration Advisor to define message implementation guidelines (MIG) and mapping guidelines (MAG).
- Deploy generated mappings in Cloud Integration iFlows.
- Use Event Mesh for downstream delivery after transformation.

---

## Messaging Checklist

- [ ] Chosen Event Mesh or Advanced Event Mesh based on volume and protocol needs.
- [ ] Namespace design defined.
- [ ] Queue vs topic strategy per use case.
- [ ] Dead letter handling for unprocessable messages.
- [ ] Message retention period defined.
- [ ] Consumer idempotency implemented (duplicate message handling).
- [ ] OAuth 2.0 for all producer and consumer connections.
- [ ] Monitoring configured (Alert Notification on queue depth or errors).
- [ ] Tested with production-equivalent volume.
