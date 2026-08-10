# Data & Analytics — SAP BTP

Guide to data storage, processing, analytics, and governance services on SAP BTP.

**Official sources:**
- HANA Cloud: https://help.sap.com/docs/hana-cloud
- Datasphere: https://help.sap.com/docs/SAP_DATASPHERE
- Analytics Cloud: https://help.sap.com/docs/SAP_ANALYTICS_CLOUD

**Last verified:** 2026-08-10

---

## Data Service Overview

| Service | Primary Use | Type |
|---------|------------|------|
| SAP HANA Cloud | Application database + analytics + vector | PaaS database |
| SAP Datasphere | Data warehouse + data federation | SaaS |
| SAP Analytics Cloud | BI dashboards + planning + predictive | SaaS |

**Key fact:** These are three different products with different licensing. Using one does not include the others.

---

## SAP HANA Cloud

### What is HANA Cloud?

HANA Cloud is SAP's cloud-native in-memory database. It is:
- **Multi-model:** Relational SQL, graph, spatial, document store, and vector.
- **In-memory:** Primary data in memory for high performance, disk persistence for durability.
- **Cloud-managed:** SAP manages patching, backups, HA.
- **BTP-native:** Integrates directly with CAP, Datasphere, AI Core.

### Service Plans

`REQUIRES_VALIDATION:` Plans change over time. Always verify current plans at Discovery Center:

| Plan (indicative) | Description |
|------------------|-------------|
| `hana` | Standard HANA Cloud instance |
| `hana-free` | Free tier (limited capacity, not for production) |
| `hana-cloud-connection` | Additional connection options |

### CAP + HANA Cloud Integration

For CAP applications, HANA Cloud is the production database:

```bash
# Add HANA to CAP project
cds add hana

# Generated files:
# .hdiconfig — HDI container configuration
# db/src/ — Native HANA artifacts (if needed)

# Deploy schema to HANA
cds deploy --to hana
```

HDI (HANA Deployment Infrastructure) containers isolate each application's schema objects within a shared HANA Cloud instance.

### HANA Cloud Data Lake

`REQUIRES_VALIDATION:` HANA Cloud includes a Data Lake option for storing large volumes of cold data at lower cost than the in-memory tier. Verify current availability and plans at https://help.sap.com/docs/hana-cloud.

### Vector Engine

HANA Cloud supports vector operations for AI/ML workloads:
- `VECTOR` column type for storing embeddings.
- `COSINE_SIMILARITY()` and `L2DISTANCE()` functions for similarity search.
- Used in RAG architectures as the vector store.

`REQUIRES_VALIDATION:` Vector engine availability depends on HANA Cloud version and service plan. Verify before planning RAG production workloads.

### Security for HANA Cloud

- HDI containers provide application isolation.
- Encryption at rest and in transit by default.
- IP allowlisting for database access.
- No direct SQL from LLMs or external agents — always via application layer.
- Database users with minimum required privileges.

**Official docs:** https://help.sap.com/docs/hana-cloud

---

## SAP Datasphere

### What is Datasphere?

SAP Datasphere is a data management platform for:
- **Data warehouse:** Traditional DWH modeling and storage.
- **Data federation:** Query data from remote sources without physical replication.
- **Data marketplace:** Discover and consume external data products.
- **Business data graph:** Semantic layer across SAP and non-SAP data.
- **Data governance:** Data lineage, quality, and catalog.

### Spaces

Datasphere organizes data in **Spaces** — isolated namespaces with their own users, connections, and data assets.

### Connections

Datasphere can connect to:
- SAP systems: S/4HANA, BW, Business One (via Integration Suite).
- Cloud databases: HANA Cloud, Azure SQL, Snowflake.
- File sources: CSV, Parquet.
- Third-party: REQUIRES_VALIDATION — verify connector list.

### Federation vs Replication

| Approach | Description | Trade-off |
|----------|-------------|-----------|
| Federation | Query source data live | No data movement; source performance impacted |
| Replication | Copy data into Datasphere | Latency; data movement complexity |

### When Datasphere vs HANA Cloud

| Scenario | Choose |
|----------|--------|
| Application persistence (CAP app) | HANA Cloud |
| Cross-system analytics and DWH | Datasphere |
| Simple operational reporting | HANA Cloud (CAP + native SQL) |
| Enterprise data catalog | Datasphere |

**Official docs:** https://help.sap.com/docs/SAP_DATASPHERE

---

## SAP Analytics Cloud (SAC)

### What is SAC?

SAP Analytics Cloud is a cloud BI, planning, and predictive analytics platform:
- **Analytics:** Interactive dashboards and reports.
- **Planning:** Financial planning, budgeting, and forecasting.
- **Predictive:** Time series forecasting, classification, regression.

### Data Sources

SAC can connect to:
- SAP HANA Cloud and HANA on-premise.
- SAP Datasphere.
- SAP BW and BW/4HANA.
- SAP S/4HANA (OData).
- Generic OData sources.

### Embedded Analytics

SAC can be embedded in:
- SAP Build Work Zone (Fiori Launchpad context).
- Custom web applications via URL iFrame.
- SAP S/4HANA dashboards.

### When SAC vs Third-Party BI

| Scenario | SAC | Third-party (Power BI, Tableau) |
|----------|-----|--------------------------------|
| SAP-first analytics (BW, HANA) | Strong | OK with connector |
| Business planning (FP&A) | Native | Limited |
| Existing Microsoft investment | Complex | Power BI simpler |
| Non-SAP data sources | Possible | More native |

**Official docs:** https://help.sap.com/docs/SAP_ANALYTICS_CLOUD

---

## Data Persistence Options Summary

| Need | Service | Notes |
|------|---------|-------|
| CAP app relational data | HANA Cloud | Default for BTP apps |
| Key-value / session data | Redis on BTP | `REQUIRES_VALIDATION` — verify availability |
| File / object storage | Object Store Service | S3-compatible |
| Full-text search | HANA Cloud (full-text index) | Built into HANA |
| Vector search | HANA Cloud (vector engine) | Requires validation |
| DWH / analytics | Datasphere | Separate license |
| Time series | HANA Cloud | In-memory performance |

---

## Data Governance

### Data Privacy on BTP

- IPS handles user data deletion (GDPR right to erasure).
- Audit Log tracks data access for compliance.
- HANA Cloud encryption satisfies data-at-rest requirements.
- Data residency controlled by subaccount region selection.

### Data Lifecycle

Define before go-live:
- Retention period for each data type.
- Archival strategy for old data (HANA Data Lake — REQUIRES_VALIDATION).
- Deletion procedures for user-requested erasure.
- Backup and recovery objectives (managed by SAP for HANA Cloud — verify SLA).
