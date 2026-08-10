# Example: Secure Business API on SAP BTP

**Type:** Architecture Pattern (not official SAP documentation)  
**Status:** Established pattern — validate service availability for your region before implementation.  
**Last updated:** 2026-08-10

---

## Scenario

Build a secure RESTful/OData API for business data (e.g., product catalog, customer data) deployed on SAP BTP Cloud Foundry, accessible by web apps and external consumers.

---

## Architecture

```
[External Client / Fiori App / Third-party App]
    │ HTTPS + OAuth 2.0 Bearer Token
    ▼
[SAP IAS] ──────── (SSO + MFA)
    │ Identity propagation
    ▼
[Application Router] ──── [XSUAA] (token validation + scope check)
    │ Validated JWT
    ▼
[CAP Service (Cloud Foundry)]
    │ Authorization annotations (CDS @requires / @restrict)
    │ Business logic (Node.js or Java)
    │
    ├─── [HANA Cloud via HDI] (persistent data)
    └─── [Destination Service] (calls to external systems)
    
[Audit Log Service] ← (security events)
[Cloud Logging]     ← (application logs)
[Alert Notification] ← (operational alerts)
```

---

## Services Used

| Service | Role | Plan (indicative) |
|---------|------|------------------|
| Cloud Foundry Runtime | Application host | standard |
| CAP (Node.js or Java) | API framework | Open-source |
| XSUAA | OAuth 2.0 authorization | application |
| IAS | Identity provider (SSO, MFA) | Bundled |
| HANA Cloud | Persistent database | hana |
| Destination Service | External system connectivity | lite |
| Audit Log Service | Security audit trail | standard |
| Cloud Logging | Application logs | standard |
| Alert Notification | Operational alerts | standard |

`REQUIRES_VALIDATION:` All service plans and pricing — verify at https://discovery-center.cloud.sap/serviceCatalog.

---

## Key Decisions

### Decision 1: XSUAA for Authorization

**Choice:** XSUAA (not IAS-native OIDC directly)  
**Reason:** CF application pattern; CAP has native XSUAA integration.  
**Trade-off:** CF-specific; not portable to Kyma without changes.

### Decision 2: CAP as API Framework

**Choice:** CAP Node.js  
**Reason:** Native OData v4 generation; built-in XSUAA integration; CDS authorization annotations.  
**Trade-off:** Node.js only (no Python/Go natively).

### Decision 3: HANA Cloud as Database

**Choice:** HANA Cloud (HDI container)  
**Reason:** CAP native integration; production-grade; no self-management.  
**Trade-off:** Cost at scale; not suitable for free tier at volume.

---

## Security Configuration

### xs-security.json

```json
{
  "xsappname": "product-api",
  "tenant-mode": "dedicated",
  "scopes": [
    { "name": "$XSAPPNAME.read", "description": "Read product data" },
    { "name": "$XSAPPNAME.write", "description": "Modify product data" }
  ],
  "role-templates": [
    {
      "name": "ProductViewer",
      "description": "Read access to products",
      "scope-references": ["$XSAPPNAME.read"]
    },
    {
      "name": "ProductEditor",
      "description": "Read and write access",
      "scope-references": ["$XSAPPNAME.read", "$XSAPPNAME.write"]
    }
  ]
}
```

### CDS Authorization

```cds
service ProductService {
  @requires: 'authenticated-user'
  entity Products as projection on db.Products;
  
  annotate Products with @(
    restrict: [
      { grant: ['READ'], to: ['ProductViewer', 'ProductEditor'] },
      { grant: ['CREATE', 'UPDATE', 'DELETE'], to: ['ProductEditor'] }
    ]
  );
}
```

---

## mta.yaml (Simplified)

```yaml
_schema-version: "3.1"
ID: product-api
version: 1.0.0

modules:
  - name: product-api-srv
    type: nodejs
    path: gen/srv
    requires:
      - name: product-api-hana
      - name: product-api-xsuaa
      - name: product-api-logs
      - name: product-api-audit

  - name: product-api-db-deployer
    type: hdb
    path: gen/db
    requires:
      - name: product-api-hana

resources:
  - name: product-api-hana
    type: com.sap.xs.hana-hdi-container
    parameters:
      service: hana
      service-plan: hdi-shared

  - name: product-api-xsuaa
    type: com.sap.xs.uaa
    parameters:
      service-plan: application
      config: xs-security.json

  - name: product-api-logs
    type: org.cloudfoundry.managed-service
    parameters:
      service: cloud-logging
      service-plan: standard

  - name: product-api-audit
    type: org.cloudfoundry.managed-service
    parameters:
      service: auditlog
      service-plan: standard
```

---

## Data Flow: Authenticated Request

```
1. User requests token from IAS (OIDC Authorization Code flow)
2. IAS issues JWT (with user attributes)
3. JWT forwarded to Application Router
4. App Router validates token with XSUAA; checks scopes
5. App Router forwards request to CAP service with validated JWT
6. CAP validates JWT again; applies CDS authorization annotations
7. CAP queries HANA Cloud via HDI binding
8. CAP returns OData response
9. Security events written to Audit Log Service
```

---

## Risks

| Risk | Mitigation |
|------|-----------|
| Token scope too broad | Review xs-security.json carefully; minimal scopes |
| HANA Cloud cost spike | Monitor query plans; right-size instance |
| On-premise connectivity (if needed later) | Add Cloud Connector + Connectivity Service |
| Multi-tenancy (if needed later) | Requires significant CAP refactoring — plan early |

---

## Validations Pending

- [ ] Service plans available in target region (Discovery Center).
- [ ] HANA Cloud free tier sufficient for development phase.
- [ ] Audit Log retention period meets compliance requirement.
- [ ] IAS tenant configuration with corporate IdP (if required).
