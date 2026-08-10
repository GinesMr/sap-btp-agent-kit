# Runtime Environments — SAP BTP

Choosing the right runtime environment is one of the most consequential decisions in a BTP project. This guide covers the three main environments, their trade-offs, and when to use each.

**Official sources:**
- CF: https://help.sap.com/docs/btp/sap-business-technology-platform/cloud-foundry-environment
- Kyma: https://help.sap.com/docs/btp/sap-business-technology-platform/kyma-environment
- ABAP: https://help.sap.com/docs/abap-cloud

**Last verified:** 2026-08-10

---

## Comparison Matrix

| Dimension | Cloud Foundry | Kyma | ABAP Environment |
|-----------|--------------|------|-----------------|
| **Abstraction** | PaaS (app-centric) | Kubernetes (container-centric) | Managed ABAP system |
| **Primary languages** | Java, Node.js (first-class), Python, Go (buildpacks) | Any (Docker containers) | ABAP |
| **SAP SDK support** | CAP, Cloud SDK Java/JS | Custom integration via REST | ABAP SDK, RAP |
| **Scaling** | Automatic (CF push) | Manual Kubernetes HPA/KEDA | Managed by SAP |
| **State management** | Stateless (backing services) | Stateful possible (PVCs) | SAP-managed |
| **Complexity** | Low-medium | Medium-high | Low (for ABAP devs) |
| **Kubernetes features** | None | Full | None |
| **Auth approach** | XSUAA (primary) | IAS OIDC (recommended) | IAS |
| **MTA support** | Yes | Partial | No |
| **Best for** | CAP apps, Fiori backends | Containers, microservices, serverless | ABAP cloud services |

---

## Cloud Foundry Environment

### Architecture

CF organizes applications into:
- **Org:** Maps to a BTP subaccount.
- **Space:** Isolated environment within an org (e.g., dev-space, prod-space).
- **Application:** A deployed CF app instance.
- **Service instance:** A BTP service provisioned in a space.
- **Service binding:** The link between a service instance and an app, injecting credentials.

```
Subaccount → CF Org → Space → Apps + Service Instances
```

### Key Concepts

**Buildpacks:** CF uses buildpacks to convert application source into a runnable container. SAP-supported buildpacks: Java, Node.js, Python, Go, Ruby, and more via community.

**VCAP_SERVICES:** Environment variable injected into CF apps containing service credentials from all bound service instances.

**Memory quota:** CF assigns memory per application. Apps exceeding their limit are killed and restarted.

**Scaling:**
- **Horizontal:** `cf scale myapp -i 3` (3 instances).
- **Vertical:** `cf scale myapp -m 512M` (512 MB memory).

### Deployment

```bash
# Build and deploy
cf push myapp -f manifest.yml

# Or using MTA
mbt build
cf deploy myapp_1.0.0.mtar
```

### When to Choose CF

- Team knows Java or Node.js.
- Building CAP applications.
- Simpler infrastructure requirements.
- Standard BTP integration patterns (XSUAA, Destination Service).
- Shorter path to production.

---

## Kyma Environment

### Architecture

Kyma is a managed Kubernetes cluster on BTP:

```
Subaccount → Kyma Cluster → Namespaces → Pods, Services, Functions
```

**Key Kyma components:**
- **Kyma Eventing:** Built-in event subscription and delivery (based on NATS/Event Mesh).
- **Kyma Functions:** Serverless Node.js and Python functions.
- **Service Catalog:** Binds BTP services as Kubernetes secrets.
- **Istio:** Service mesh providing mTLS and observability.
- **API Gateway:** Exposes services externally via APIRules.

### Service Binding in Kyma

BTP services are bound to Kyma namespaces as Kubernetes secrets. CAP supports Kyma deployment via the `@sap/xsenv` library or Kyma-native binding.

### Authentication in Kyma

**Recommended:** IAS-based OIDC (not XSUAA directly).

```yaml
apiVersion: gateway.kyma-project.io/v1beta1
kind: APIRule
spec:
  service:
    name: myservice
    port: 8080
  rules:
    - accessStrategies:
        - handler: oauth2_introspection
          config:
            required_scope: ["read"]
```

### When to Choose Kyma

- Containerized microservices architecture.
- Multi-language services (Python, Go, .NET, etc.).
- Need for Kubernetes-native features (PVCs, DaemonSets, custom operators).
- Serverless functions with event triggers.
- Teams with Kubernetes expertise.

### Kyma Considerations

- **Higher cost:** Node-based pricing is significantly higher than CF memory-based.
- **Higher complexity:** Kubernetes expertise required for operations.
- **Managed cluster:** SAP manages Kubernetes control plane; customer manages workloads.
- `REQUIRES_VALIDATION:` Kyma availability varies by region — verify at Discovery Center.

---

## ABAP Environment

### Architecture

The ABAP Environment is a managed ABAP application server in the cloud. It uses HANA Cloud as its database and exposes services via RESTful ABAP (RAP model).

```
ABAP Environment → ABAP Application Server → HANA Cloud
                        ↓ OData v4 / REST APIs
```

### ABAP RESTful Application Programming Model (RAP)

RAP is the modern ABAP programming model for cloud:
- CDS Views for data modeling.
- Behavior Definitions for business logic.
- OData v4 services automatically generated.
- CRUD, actions, validations, determinations.

### Development Tooling

- **Eclipse ADT (ABAP Development Tools):** Primary IDE for ABAP cloud development.
- **ABAP Git:** Source code management for ABAP objects.
- **abapGit:** Open-source Git client for ABAP (community project).

### When to Choose ABAP Environment

- ABAP development team building new cloud-ready ABAP services.
- Extending SAP S/4HANA Cloud with custom ABAP.
- Migrating specific ABAP functionality to cloud while maintaining ABAP investment.

### ABAP Environment Limitations

- Cannot run on-premise ABAP code without adaptation (Function Modules, classic BAPIs not supported).
- Learning ABAP RAP required.
- Higher cost than CF for equivalent compute.

---

## Multi-Environment Architecture

A single subaccount can enable multiple environments simultaneously:

```
Subaccount (PROD)
├── Cloud Foundry (CAP backend, Fiori router)
├── Kyma (containerized microservices, functions)
└── ABAP (ABAP-specific OData services)
```

Services (HANA Cloud, XSUAA, Destination) can be shared across CF and Kyma within the same subaccount.

---

## MTA (Multi-Target Application)

MTA packages multiple application modules (front-end, back-end, services) into a single deployable unit.

**mta.yaml structure:**
```yaml
_schema-version: "3.1"
ID: my-btp-app
version: 1.0.0

modules:
  - name: my-backend
    type: nodejs
    path: backend/
    requires: [hana-db, xsuaa]

  - name: my-ui
    type: html5
    path: ui/

resources:
  - name: hana-db
    type: com.sap.xs.hana-schema
  - name: xsuaa
    type: com.sap.xs.uaa
    parameters:
      config: xs-security.json
```

**Build and deploy:**
```bash
mbt build                           # produces .mtar archive
cf deploy my-btp-app_1.0.0.mtar    # CF deployment
```

**Source:** https://help.sap.com/docs/btp/sap-business-technology-platform/multitarget-applications-in-cloud-foundry-environment

---

## Runtime Selection Decision Tree

```
Does the team know ABAP?
  YES → Will they build OData services or extend S/4 Cloud?
          YES → ABAP Environment
          NO  → Consider CAP (ABAP skills partially transferable)
  NO  →
    Does the workload require containerization or Kubernetes features?
      YES → Kyma
      NO  →
        Is it a standard SAP business app (Fiori, OData, CAP)?
          YES → Cloud Foundry
          NO  → Evaluate Kyma (containerized) vs CF (buildpack)
```
