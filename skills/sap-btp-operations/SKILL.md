---
name: sap-btp-operations
description: >
  Designs operations, monitoring, CI/CD, and lifecycle management for SAP BTP solutions.
  Use when the task involves deployment pipelines, logging, alerting, change management,
  or production readiness for BTP applications.
---

## Objective

Ensure BTP solutions are production-ready with proper monitoring, CI/CD pipelines, change management, and operational runbooks.

## Problems This Skill Solves

- How to set up CI/CD for a CAP or Kyma application?
- How to configure centralized logging and alerting?
- How to manage DEV → TEST → PROD transport?
- What monitoring is needed before go-live?
- How to manage BTP infrastructure as code?

## Required Reading

1. `catalog/agent-service-index.yaml` — Cloud Logging, Alert Notification, CI/CD, TMS entries.
2. `guides/operations-observability.md` — full operations reference.
3. `guides/deployment-cicd-iac.md` — CI/CD and IaC patterns.

## Official Sources to Verify

- CI/CD Service: https://help.sap.com/docs/continuous-integration-and-delivery
- Transport Management: https://help.sap.com/docs/transport-management-service
- Cloud Logging: https://help.sap.com/docs/cloud-logging
- Alert Notification: https://help.sap.com/docs/alert-notification
- Cloud ALM: https://help.sap.com/docs/cloud-alm

## Reasoning Flow

1. Inventory the deployment artifacts: apps, services, configurations.
2. Design CI/CD pipeline: stages, triggers, approvals.
3. Design transport route (DEV → TEST → PROD via TMS).
4. Design logging: Cloud Logging for apps, Audit Log for compliance.
5. Design alerting: Alert Notification for critical events.
6. Configure Cloud ALM if SAP landscape monitoring is needed.
7. Define on-call rotation and incident response.
8. Document backup and recovery procedures (HANA Cloud).
9. Plan secret rotation calendar.
10. Output: operations design + go-live checklist.

## Discovery Questions

- What Git provider is used? (GitHub, GitLab, Bitbucket)
- What approval process is required before production deployment?
- What log retention period is required (compliance)?
- Who is on-call? What channels for alerts (email, Slack, PagerDuty)?
- Is Cloud ALM already in use for SAP landscape?
- What is the deployment frequency? (continuous, weekly, monthly)
- Are there existing CI/CD tools to integrate with?
- Is IaC (Terraform) required for account management?

## Candidate Services by Need

| Need | Service |
|------|---------|
| Application logging | Cloud Logging |
| Compliance audit trail | Audit Log Service |
| Alerting | Alert Notification Service |
| SAP landscape monitoring | Cloud ALM |
| CI/CD pipelines | SAP CI/CD Service or external |
| DEV→PROD transport | Transport Management Service |
| BTP account IaC | Terraform BTP Provider |

## Security Rules

- No manual deployments to production — use CI/CD + TMS.
- CI/CD credentials in CI/CD service credential vault (not pipeline YAML).
- TMS production transport requires human approval.
- Audit log access restricted to security team.
- Log retention defined and meets compliance requirement before go-live.
- Secret rotation calendar documented and enforced.

## Antipatterns

- `cf push` directly to production.
- Credentials in CI/CD pipeline YAML or Git.
- No alerting on critical service failures.
- Missing rollback plan.
- Manual approval skipped under time pressure.
- Not testing rollback procedure before go-live.
- Mixing application and audit logs in the same destination.

## Output Checklist

- [ ] CI/CD pipeline configured and tested end-to-end.
- [ ] Transport Management routes defined (DEV → TEST → PROD).
- [ ] Cloud Logging configured.
- [ ] Alert Notification configured for critical events.
- [ ] Audit Log enabled for compliance events.
- [ ] Cloud ALM connected (if SAP landscape).
- [ ] On-call rotation and escalation path documented.
- [ ] Backup and recovery procedure documented and tested.
- [ ] Secret rotation calendar set.
- [ ] Go-live checklist reviewed.

## Response Format

```
## Operations Design

### CI/CD Pipeline
[Stages, triggers, tool (SAP CI/CD or external), approvals]

### Transport Management
[Nodes, routes, approval gates]

### Logging
[Cloud Logging config, log sources, retention]

### Alerting
[Alert Notification rules, notification channels]

### Monitoring
[Cloud ALM scope, key metrics, dashboards]

### Incident Response
[On-call, escalation, common runbook entries]

### Sources Consulted
[Document + URL — verified YYYY-MM-DD]
```

## REQUIRES_VALIDATION Triggers

- Terraform BTP provider capabilities for specific resource types.
- Cloud ALM entitlement conditions.
- CI/CD Service support for non-standard project types.
- Log retention limits per plan.
