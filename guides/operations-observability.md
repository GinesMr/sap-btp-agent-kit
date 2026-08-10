# Operations & Observability — SAP BTP

Guide to monitoring, logging, alerting, CI/CD, and lifecycle management for BTP solutions.

**Official sources:**
- Cloud Logging: https://help.sap.com/docs/cloud-logging
- Alert Notification: https://help.sap.com/docs/alert-notification
- Cloud ALM: https://help.sap.com/docs/cloud-alm
- CI/CD Service: https://help.sap.com/docs/continuous-integration-and-delivery
- Transport Management: https://help.sap.com/docs/transport-management-service

**Last verified:** 2026-08-10

---

## Observability Stack on BTP

```
Application Logs → SAP Cloud Logging (search + dashboards)
Business Events → SAP Audit Log Service (compliance)
Alerts → Alert Notification Service (email, Slack, webhook)
SAP Solution Health → SAP Cloud ALM
Change Management → Transport Management Service
Build + Deploy → SAP CI/CD Service
```

---

## SAP Cloud Logging

### What it does

Managed log management based on OpenSearch. Collects logs from:
- Cloud Foundry applications (forwarded via CF log drain).
- Kyma workloads (via Fluentd/Fluent Bit integration).
- Custom log shipper.

### Key Features

- Full-text search across logs.
- Kibana-compatible dashboards.
- Log-based alerting rules.
- Access control per log space.

### CF Log Forwarding

CF applications write to stdout/stderr — Cloud Logging collects these automatically when the log drain is configured.

```bash
# Create Cloud Logging instance
cf create-service cloud-logging standard mylogger

# Create service binding (provides drain URL)
cf bind-service myapp mylogger
```

### Log Retention

`REQUIRES_VALIDATION:` Retention periods vary by plan. Verify before planning compliance-driven retention.

**Official docs:** https://help.sap.com/docs/cloud-logging

---

## SAP Alert Notification Service

### Purpose

Event-driven alerting routing platform. Receives events from BTP services and routes to human-readable channels.

### Alert Sources

- BTP service events (instance creation/deletion failures).
- Application-published events (custom).
- Cloud Foundry platform events.
- Integration Suite errors.
- Kyma events.

### Notification Channels

| Channel | Notes |
|---------|-------|
| Email | Direct email notifications |
| Slack | Requires Slack webhook configuration |
| PagerDuty | Incident management integration |
| Custom Webhook | Any HTTPS endpoint |
| MS Teams | Via webhook |

### Creating an Alert

```json
{
  "eventType": "SAP-CLOUD-LOGGING-APPLICATION-LOG-ERROR",
  "condition": {
    "severities": ["ERROR", "FATAL"]
  },
  "actions": [{
    "type": "EMAIL",
    "to": ["oncall@company.com"]
  }]
}
```

**Security rule:** Webhook endpoints must be HTTPS. Validate webhook signatures where supported.

**Official docs:** https://help.sap.com/docs/alert-notification

---

## SAP Audit Log Service

### Purpose

Immutable audit trail for security and compliance:
- Authentication events.
- Authorization decisions.
- Data access and modifications.
- Admin operations.

### Integration

Applications write audit log entries via the Audit Log API (REST). CF-bound service provides credentials.

```javascript
// Node.js example
const { AuditLogClient } = require('@sap/audit-log');
const auditClient = new AuditLogClient(xsenv.getServices({ auditlog: ... }));

await auditClient.write({
    type: 'data-access',
    object: { type: 'SalesOrder', id: 'SO-1234' },
    tenant: tenantId,
    user: '$USER'
});
```

**Retention:** `REQUIRES_VALIDATION` — verify retention period per plan and regulatory requirement.

**Official docs:** https://help.sap.com/docs/btp/sap-business-technology-platform/audit-log-service

---

## SAP Cloud ALM

### What it does

Application Lifecycle Management platform for SAP cloud solutions:

**Operations module:**
- Health monitoring of SAP cloud services.
- Business process monitoring.
- Integration monitoring (Integration Suite).
- Alert correlation and incident management.

**Implementation module:**
- Project management for SAP implementations (SAP Activate).
- Change management.
- User acceptance testing.

**Deploy module:**
- Deployment tracking.
- Change impact analysis.

### Availability

`REQUIRES_VALIDATION:` Cloud ALM is typically included with SAP Enterprise Support or CPEA — verify current entitlement at https://help.sap.com/docs/cloud-alm.

**Official docs:** https://help.sap.com/docs/cloud-alm

---

## SAP BTP CI/CD Service

### Supported Project Types

Pre-configured job templates for:
- **SAP Cloud Application Programming Model (CAP):** Node.js and Java.
- **SAP Fiori:** Freestyle and Fiori Elements.
- **SAP Fiori for ABAP Platform.**
- **Kyma:** Docker build + Helm deployment.
- **Cloud Foundry:** General CF deployment.

### Pipeline Configuration

```yaml
# .pipeline/config.yml (example)
general:
  buildTool: "mta"
  
stages:
  Build:
    executeNpmRun: true
  
  Deploy to Cloud Foundry:
    cfApiEndpoint: "https://api.cf.eu10.hana.ondemand.com"
    cfOrg: "myorg"
    cfSpace: "prod"
    deployTool: "mtaDeployPlugin"
```

### Source Code Repositories

Supported Git providers:
- GitHub
- GitLab
- Bitbucket
- Gerrit

### When to Use External CI/CD Instead

Use Jenkins, GitHub Actions, or Azure DevOps when:
- Complex multi-stage pipelines needed.
- Advanced testing strategies (contract testing, chaos engineering).
- Custom deployment targets not supported by SAP CI/CD.

**Official docs:** https://help.sap.com/docs/continuous-integration-and-delivery

---

## Transport Management Service

### Purpose

Manages the controlled transport of application changes across BTP landscapes (DEV → TEST → PROD):

- Import queues for each target node.
- Manual or automated approvals.
- Audit trail of all transports.
- Transport route configuration.

### Transport Process

```
Developer deploys to DEV subaccount
    ↓ creates transport request
Transport Management Service
    ↓ approval (manual or automated)
Test subaccount
    ↓ approval (manual)
Production subaccount
```

### Integration with CI/CD

CI/CD Service can trigger transport requests after successful builds. Transport Management then governs the final deployment to production.

**Official docs:** https://help.sap.com/docs/transport-management-service

---

## BTP Terraform Provider

`REQUIRES_VALIDATION:` SAP provides an official Terraform provider for BTP (`hashicorp/btp`) for Infrastructure as Code management of:
- Global accounts and subaccounts.
- Entitlements.
- Service instances.
- Trust configurations.
- Environment instances (CF, Kyma).

Verify current provider capabilities at: https://registry.terraform.io/providers/SAP/btp/latest

---

## Operational Runbook Template

For every production BTP deployment, create a runbook covering:

1. **Service dependencies:** Which BTP services are critical (HANA Cloud, AI Core, Integration Suite)?
2. **Monitoring:** What dashboards to check (Cloud ALM, Cloud Logging)?
3. **Alerting:** What alerts are configured? Who gets notified?
4. **Incident response:** Steps for common failures (app crash, DB unavailable, Cloud Connector down).
5. **Backup and recovery:** HANA Cloud backup schedule and restore procedure.
6. **Secrets rotation:** Which credentials expire when? Who rotates them?
7. **Deployment:** How to deploy a change to production?
8. **Rollback:** How to roll back a failed deployment?

---

## Operations Checklist (Go-Live)

- [ ] Cloud Logging configured and receiving application logs.
- [ ] Alert Notification configured for critical service events.
- [ ] Audit Log Service enabled for security and compliance events.
- [ ] Cloud ALM connected to monitored services.
- [ ] CI/CD pipeline configured and tested.
- [ ] Transport Management routes defined for DEV → TEST → PROD.
- [ ] Monitoring dashboard created for key metrics.
- [ ] On-call rotation defined.
- [ ] Incident response runbook written.
- [ ] Backup and recovery tested (HANA Cloud).
- [ ] Secret rotation calendar defined.
- [ ] Cost alerts configured.
