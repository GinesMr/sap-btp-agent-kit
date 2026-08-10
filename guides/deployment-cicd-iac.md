# Deployment, CI/CD & Infrastructure as Code — SAP BTP

Guide to deploying applications, building CI/CD pipelines, and managing BTP infrastructure as code.

**Official sources:**
- CI/CD Service: https://help.sap.com/docs/continuous-integration-and-delivery
- Transport Management: https://help.sap.com/docs/transport-management-service
- BTP CLI: https://help.sap.com/docs/btp/sap-business-technology-platform/account-administration-using-sap-btp-command-line-interface-btp-cli
- MTA: https://help.sap.com/docs/btp/sap-business-technology-platform/multitarget-applications-in-cloud-foundry-environment

**Last verified:** 2026-08-10

---

## Deployment Methods

### CF Push (Simple)

```bash
cf push myapp -f manifest.yml
```

For single-module apps without complex dependencies.

**manifest.yml:**
```yaml
applications:
  - name: myapp
    memory: 256M
    instances: 2
    buildpacks:
      - nodejs_buildpack
    env:
      NODE_ENV: production
```

### MTA Deploy (Multi-Module)

For apps with multiple modules and service dependencies:

```bash
# Build
mbt build -p=cf

# Deploy
cf deploy ./mta_archives/myapp_1.0.0.mtar
```

MTA handles creation of service instances, bindings, and module deployment in the correct order.

### Kyma Deployment (Helm)

```bash
helm install myapp ./helm-chart \
  --namespace mynamespace \
  --set image.repository=my-registry/myapp \
  --set image.tag=1.0.0
```

Or via `kubectl apply` with Kubernetes manifests.

---

## SAP CI/CD Service

### Pipeline Job Types

| Job Type | Use Case |
|----------|---------|
| SAP Cloud Application Programming Model | CAP Node.js/Java build + CF deploy |
| SAP Fiori in the Cloud | Fiori app build + deploy |
| SAP Fiori for the ABAP Platform | ABAP-based Fiori deployment |
| Kyma Runtime | Container build + Kyma deploy |
| Container-Based Applications | Generic container build + deploy |

### Setting Up a CI/CD Pipeline

1. In BTP Cockpit → CI/CD Service → Credentials: Add Git credentials.
2. Create a new Job: select job type and Git repository.
3. Configure stages (build, test, deploy).
4. Trigger manually or via Git webhook.

### Webhook Integration

Configure Git provider (GitHub, GitLab) to send webhook to CI/CD Service on push/PR merge → automatic pipeline trigger.

### CI/CD Job Security

- Git credentials stored in CI/CD credential vault.
- Deployment credentials injected at runtime.
- No secrets in pipeline YAML files.

**Official docs:** https://help.sap.com/docs/continuous-integration-and-delivery

---

## Transport Management Service (TMS)

TMS manages the formal transport of changes across landscape nodes:

```
Node: DEV CF Subaccount
    ↓ transport request (after CI/CD build)
Node: TEST CF Subaccount
    ↓ human approval (QA sign-off)
Node: PROD CF Subaccount
```

### Setup

1. Configure transport routes (DEV → TEST → PROD).
2. Configure transport nodes (one per subaccount/environment).
3. Integrate with CI/CD Service to create transport requests automatically.
4. Configure approval workflows.

**Official docs:** https://help.sap.com/docs/transport-management-service

---

## BTP Terraform Provider

`REQUIRES_VALIDATION:` SAP provides an official Terraform provider for managing BTP resources declaratively.

**Provider:** `SAP/btp` (verify current version at https://registry.terraform.io/providers/SAP/btp/latest)

### What Can Be Managed with Terraform

```hcl
# Create subaccount
resource "btp_subaccount" "prod" {
  name      = "my-prod-subaccount"
  region    = "eu10"
  subdomain = "my-prod"
}

# Assign entitlement
resource "btp_subaccount_entitlement" "hana" {
  subaccount_id = btp_subaccount.prod.id
  service_name  = "hana-cloud"
  plan_name     = "hana"
}

# Create service instance
resource "btp_subaccount_service_instance" "hana_instance" {
  subaccount_id = btp_subaccount.prod.id
  service_plan_id = data.btp_subaccount_service_plan.hana.id
  name           = "my-hana-cloud"
}
```

### IaC Best Practices

1. **State file:** Store Terraform state in a remote backend (not local).
2. **Secrets:** Never put credentials in Terraform files; use variables or vault integration.
3. **Plan before apply:** Always review `terraform plan` output before `terraform apply`.
4. **Separate state per environment:** One state file per subaccount (DEV/TEST/PROD).
5. **Version pin:** Pin provider versions to avoid unexpected updates.

---

## End-to-End Deployment Pipeline

Recommended pipeline for a CAP application:

```
Git Push (developer)
    ↓ webhook
CI/CD Service
    ├── Stage: Build (mbt build)
    ├── Stage: Unit Tests (jest / JUnit)
    ├── Stage: Lint + Security Scan
    ├── Stage: Deploy to DEV (cf deploy)
    └── Stage: Create Transport Request (TMS)
        ↓
Transport Management Service
    ├── DEV → TEST (automated)
    ├── Integration Tests in TEST
    └── TEST → PROD (human approval required)
        ↓
Production CF Subaccount
```

---

## Docker and Container Registry

For Kyma deployments:
- Build Docker images in CI/CD pipeline.
- Push to a container registry (Docker Hub, GitHub Container Registry, or SAP-internal).
- `REQUIRES_VALIDATION:` SAP provides a container registry option for BTP — verify availability.
- Reference image in Helm chart / Kubernetes manifests.

### Container Security

- Scan container images for CVEs (Trivy, Grype, or similar).
- Never run containers as root.
- Use minimal base images (distroless or alpine).
- Pin image tags (not `latest`) in production.

---

## Deployment Checklist

Before deploying to production:

- [ ] MTA descriptor reviewed and service plans validated.
- [ ] Environment-specific configuration externalized (not hardcoded).
- [ ] All tests pass in CI pipeline.
- [ ] Security scan passes.
- [ ] Transport Management approval received.
- [ ] Rollback plan documented.
- [ ] Monitoring configured for new services.
- [ ] Alert Notification rules updated if new endpoints exposed.
- [ ] HANA Cloud schema changes reviewed (backward compatible?).
- [ ] Team notified of deployment window.
