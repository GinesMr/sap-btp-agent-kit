# Application Development — SAP BTP

Complete guide to building applications on SAP BTP: frameworks, languages, tools, and deployment.

**Official sources:**
- CAP: https://cap.cloud.sap/docs/
- BAS: https://help.sap.com/docs/bas
- Cloud SDK: https://sap.github.io/cloud-sdk/
- Build Code: https://help.sap.com/docs/build-code

**Last verified:** 2026-08-10

---

## Language Support on BTP — Honest Assessment

| Language | Support Level | Path | Notes |
|----------|--------------|------|-------|
| **Node.js / TypeScript** | First-class | CAP + CF/Kyma | Recommended for new apps |
| **Java** | First-class | CAP + Spring Boot + CF/Kyma | Recommended for enterprise Java teams |
| **ABAP** | First-class | ABAP Environment + RAP | Only in ABAP env; cloud ABAP differs from on-premise |
| **Python** | Supported via buildpacks/containers | CF buildpack or Kyma container | No native CAP; integrate via REST APIs |
| **.NET / C#** | Supported via containers | Kyma container | No native CAP; integrate via REST APIs |
| **Go** | Supported via buildpacks/containers | CF buildpack or Kyma container | No native CAP |
| **Ruby** | Supported via buildpack | CF buildpack | Limited SAP tooling |

**Key fact:** Python, .NET, and Go can run on BTP, but they lack:
- Native CAP framework support.
- Native Cloud SDK with OData client generation.
- Built-in XSUAA/IAS integration libraries (must implement manually or use community libraries).

For these languages, integrate BTP services via REST APIs and handle OAuth 2.0 token acquisition manually.

---

## SAP Cloud Application Programming Model (CAP)

### What is CAP?

CAP is an opinionated, open-source (Apache 2.0) framework for building SAP business applications. It uses:
- **CDS (Core Data Services):** Domain-specific language for data models, services, and annotations.
- **Node.js runtime** (recommended for most projects): `@sap/cds` package.
- **Java runtime:** `com.sap.cds` Maven/Gradle dependency + Spring Boot.

### CDS Model Example

```cds
// schema.cds
namespace my.bookshop;

entity Books {
  key ID   : Integer;
  title    : String(111);
  stock    : Integer;
}

entity Orders {
  key ID    : UUID;
  book      : Association to Books;
  quantity  : Integer;
  createdAt : DateTime @cds.on.insert : $now;
}
```

### Service Definition

```cds
// service.cds
using my.bookshop as db from '../db/schema';

service CatalogService {
  entity Books as projection on db.Books;
  
  @requires: 'authenticated-user'
  entity Orders as projection on db.Orders;
}
```

CAP generates OData v4 APIs automatically from service definitions. REST APIs also available.

### Authorization with CDS Annotations

```cds
annotate CatalogService.Orders with @(
  restrict: [
    { grant: ['READ'], to: ['Viewer'] },
    { grant: ['*'],    to: ['Admin'] }
  ]
);
```

### CAP and HANA Cloud

- Local development: SQLite (zero config).
- Production: HANA Cloud via HDI container.
- CDS handles database schema deployment automatically.

```bash
# Generate HANA artifacts
cds add hana

# Deploy schema
cds deploy --to hana
```

### CAP CLI Commands

```bash
cds init myproject         # Initialize new CAP project
cds watch                  # Start development server with live reload
cds build                  # Build for deployment
cds deploy --to sqlite     # Deploy to SQLite locally
cds deploy --to hana       # Deploy to HANA Cloud
```

### Official docs: https://cap.cloud.sap/docs/

---

## SAP Business Application Studio (BAS)

Cloud-based IDE purpose-built for SAP development. Available in the browser.

**Dev space types:**
- SAP CAP Development
- SAP Fiori Development
- ABAP Development
- Mobile Development (MDK)
- Low-Code Development (Build Apps)

**Key extensions pre-installed:**
- CDS Language Server
- Fiori Tools
- MTA Tools
- Cloud Connector Tunnel

**Alternatives:** VS Code with `@sap/cds-lsp` and Fiori tools extensions (full CAP/Fiori dev supported locally).

**Official docs:** https://help.sap.com/docs/bas

---

## SAP Cloud SDK

### Java SDK

Provides type-safe OData client generation from SAP Business Accelerator Hub API specifications.

**Key features:**
- Auto-generated OData v2/v4 clients for S/4HANA, SAP B1, etc.
- Destination Service integration (no manual HTTP client setup).
- Resilience patterns (retry, circuit breaker via Resilience4j).
- Multi-tenancy support.

```java
// Example: read BusinessPartner from S/4HANA
List<BusinessPartner> partners = BusinessPartnerService.create()
    .getAllBusinessPartner()
    .top(10)
    .executeRequest(HttpDestinationAccessor.getDestination("S4HANA_DEST"));
```

**Official docs:** https://sap.github.io/cloud-sdk/

### JavaScript / TypeScript SDK

Same capabilities as Java SDK but for Node.js projects.

```typescript
import { businessPartnerService } from '@sap/cloud-sdk-vdm-business-partner-service';

const partners = await businessPartnerService()
  .businessPartnerApi
  .requestBuilder()
  .getAll()
  .top(10)
  .execute({ destinationName: 'S4HANA_DEST' });
```

**Official docs:** https://sap.github.io/cloud-sdk/docs/js/getting-started

---

## SAP Build Code

AI-powered development environment on BTP:
- Built on Business Application Studio.
- Joule copilot for code generation (CDS models, UI, tests).
- Generates CAP + Fiori projects from natural language descriptions.
- Accelerates standard SAP app development.

`REQUIRES_VALIDATION:` Joule availability in Build Code depends on region and contract. Verify before planning.

**Official docs:** https://help.sap.com/docs/build-code

---

## SAP Fiori and UI Development

### Fiori Elements (Recommended for BTP apps)

Fiori Elements generates UIs automatically from OData annotations in CDS. Minimal front-end code needed.

Templates:
- List Report + Object Page
- Worklist
- Analytical List Page
- Form-based

**Key:** Fiori Elements reads OData metadata and renders UI at runtime — reducing frontend code significantly.

### Free-Style UI5

For custom UI requirements not covered by Fiori Elements. Uses SAPUI5 / OpenUI5 JavaScript framework.

### Fiori Launchpad

Container that hosts multiple Fiori apps in a centralized portal. On BTP: hosted in SAP Build Work Zone or a standalone HTML5 application repository.

---

## Local Development Workflow

```bash
# 1. Install CAP
npm install -g @sap/cds-dk

# 2. Initialize project
cds init myapp && cd myapp

# 3. Add features
cds add hana xsuaa fiori

# 4. Define model (schema.cds) and services (service.cds)

# 5. Run locally
cds watch    # watches for changes, serves on localhost:4004

# 6. Test locally
curl http://localhost:4004/catalog/Books

# 7. Build for deployment
cds build
mbt build

# 8. Deploy to CF
cf login
cf deploy myapp_1.0.0.mtar
```

---

## HTML5 Application Repository

SAP-managed service for hosting static web content (HTML5 apps, Fiori apps) on BTP.

- **Managed HTML5 apps:** Hosted by SAP, versioned, served via CDN.
- **Application Router:** Routes requests to the correct backend service or UI5 app.
- Integrates with Build Work Zone for Fiori launchpad hosting.

`REQUIRES_VALIDATION:` HTML5 Application Repository service plan and availability — verify at Discovery Center.

---

## Deployment Considerations

### Manifest vs. MTA

| Method | Use Case |
|--------|---------|
| `cf push` + `manifest.yml` | Single-module apps, simple deployments |
| MTA (mta.yaml + mbt + cf deploy) | Multi-module apps, service orchestration |

### Environment Variables and Configuration

- **Never hardcode** credentials, URLs, or environment-specific config.
- Use **CF environment variables** or **Kyma ConfigMaps/Secrets** for configuration.
- Use **Destination Service** for remote system connections.
- Use **MTA parameters** for environment-specific overrides.

### Testing Strategy

| Type | Tool | Notes |
|------|------|-------|
| Unit | Jest (Node.js), JUnit (Java) | Test CDS handlers and business logic |
| Integration | `@cap-js/sqlite` | Test end-to-end locally against SQLite |
| API | Postman, REST client | Test OData services |
| Load | k6, Gatling | Test scaling behavior before go-live |
