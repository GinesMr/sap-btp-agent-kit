# SAP Business One Integration with BTP

Guide for integrating SAP Business One (SAP B1) with SAP BTP, and for building agentic AI platforms connected to SAP B1.

**Status note:** Many B1-BTP integration patterns are established practice, but some specifics (service availability, official MCP integration) require validation. Items marked `REQUIRES_VALIDATION` must be confirmed with SAP documentation before implementation.

**Official sources:**
- SAP B1 Service Layer: https://help.sap.com/docs/SAP_BUSINESS_ONE_SERVICE_LAYER
- SAP Business Accelerator Hub (B1 APIs): https://api.sap.com/package/SAPB1/overview
- SAP Integration Suite: https://help.sap.com/docs/integration-suite

**Last verified:** 2026-08-10

---

## SAP Business One Overview

SAP Business One (B1) is an ERP solution for small and medium enterprises (SME). Key technical facts:

- **Editions:** SAP Business One (SQL Server), SAP Business One, version for SAP HANA.
- **Deployment:** On-premise or hosted (not a native cloud SaaS).
- **Primary API:** Service Layer (RESTful OData-based API).
- **Secondary APIs:** DI API (COM-based, Windows-only), DI Server (remote DI API).
- **Database:** Microsoft SQL Server or SAP HANA on-premise.

**Important:** SAP B1 is fundamentally an on-premise system. Any BTP integration must account for hybrid connectivity requirements.

---

## SAP B1 Service Layer

The Service Layer is the recommended API for programmatic access to SAP B1 data.

### Characteristics

- RESTful API based on OData v4.
- Authenticates users via SAP B1 username/password (session cookie).
- Runs as a service on the SAP B1 server (or a dedicated Service Layer host).
- HTTPS strongly recommended.
- All B1 business objects accessible: BusinessPartners, SalesOrders, Invoices, Items, etc.

### Authentication Flow

```
1. POST /b1s/v2/Login
   Body: { "CompanyDB": "MYDB", "UserName": "manager", "Password": "***" }
   
2. Response: Set-Cookie: B1SESSION=xxxx; ROUTEID=.node1
   
3. Include cookie in all subsequent requests:
   Cookie: B1SESSION=xxxx; ROUTEID=.node1
```

**Security issue:** Session cookie is stateful. Each session must be explicitly logged out. Sessions expire after inactivity.

### Key Endpoints (Examples)

```
GET    /b1s/v2/BusinessPartners          # List business partners
GET    /b1s/v2/BusinessPartners('C001')  # Get specific BP
POST   /b1s/v2/SalesOrders               # Create sales order
PATCH  /b1s/v2/SalesOrders(1)            # Update sales order
POST   /b1s/v2/SalesOrders(1)/Close     # Close sales order (action)
```

**Official API catalog:** https://api.sap.com/package/SAPB1/overview

---

## Integration Architecture: SAP B1 + BTP

### Recommended Architecture

```
                    [BTP Subaccount]
User / Agent        
    ↓               
[Application/Agent UI]
    ↓
[BTP Application / CAP / MCP Server]    ← Domain validation layer
    ↓
[Connectivity Service + Destination]    ← Credential management
    ↓
[Cloud Connector]                       ← Tunnel (on customer network)
    ↓ (private tunnel)
[SAP B1 Service Layer]                  ← On-premise
    ↓
[SAP Business One + HANA]              ← Database (on-premise)
```

### Network Rules (Mandatory)

1. **SAP B1 server must never be directly accessible from the Internet.** No public IP, no DMZ exposure.
2. All BTP → B1 communication goes through Cloud Connector tunnel.
3. Cloud Connector installed on the customer network, outbound-only connection to BTP.
4. Service Layer must use HTTPS (not HTTP) even on the internal network.

### What Runs Where

| Component | Location | Notes |
|-----------|----------|-------|
| SAP B1 + HANA | Customer on-premise | Never expose to Internet |
| Service Layer | On-premise (B1 server or dedicated host) | HTTPS required |
| Cloud Connector | On-premise (customer network) | Outbound HTTPS to BTP |
| BTP Application / CAP | BTP Subaccount | Domain logic, auth, API |
| BTP Destination | BTP Subaccount | Stores Service Layer URL + auth |
| User Interface | BTP or external | Authenticated via IAS |

---

## Calling SAP B1 from BTP Applications

### Destination Configuration

Create a Destination in BTP for SAP B1 Service Layer:

```
Name: SAP_B1_SERVICE_LAYER
Type: HTTP
URL: http://b1-virtual-host:50000/b1s/v2
ProxyType: OnPremise   (via Cloud Connector)
Authentication: BasicAuthentication
User: b1_service_user
Password: [stored securely]
```

**Note:** Use a dedicated B1 service user with minimum required permissions — not a named user.

### Cloud Connector System Mapping

In Cloud Connector, map:
- Internal host: `b1server.internal.company.com:50000`
- Virtual host: `b1-virtual-host:50000`
- Protocol: HTTP (or HTTPS if Service Layer configured for it)
- Accessible resources: `/b1s/v2/*`

### CAP Service Calling B1 Service Layer

```javascript
// In CAP service handler (Node.js)
const { getDestination, executeHttpRequest } = require('@sap-cloud-sdk/http-client');

async function getBusinessPartner(bpCode) {
    const destination = await getDestination({ destinationName: 'SAP_B1_SERVICE_LAYER' });
    
    // First: login to get session
    const loginRes = await executeHttpRequest(destination, {
        method: 'POST',
        url: '/Login',
        data: {
            CompanyDB: process.env.B1_COMPANY,
            UserName: process.env.B1_USER,
            Password: process.env.B1_PASS
        }
    });
    
    const sessionCookie = loginRes.headers['set-cookie'];
    
    // Then: call API with session
    const bpRes = await executeHttpRequest(destination, {
        method: 'GET',
        url: `/BusinessPartners('${bpCode}')`,
        headers: { Cookie: sessionCookie.join('; ') }
    });
    
    return bpRes.data;
}
```

**Security note:** Session management for B1 Service Layer requires careful implementation. Consider a session pool or re-auth logic for production.

---

## AI Agent Architecture for SAP B1

### Pattern: Agent + MCP + Service Layer

```
User (Teams / Web / Copilot)
    ↓ natural language
AI Orchestrator (LLM via Generative AI Hub)
    ↓ tool calls
MCP Server or Domain API (on BTP)        ← Authorization + validation
    ↓ validated business operations
B1 Service Layer (via Cloud Connector)
    ↓
SAP Business One
```

### Why Not Connect LLM Directly to Service Layer?

**This is a critical security and reliability rule:**

1. **No access control:** Service Layer uses B1 user credentials — LLMs would have full B1 user permissions.
2. **No business validation:** LLMs can generate syntactically valid but semantically invalid payloads.
3. **No audit trail:** Direct LLM → B1 calls bypass the application layer that should log intent and context.
4. **No human approval:** High-risk operations (invoices, payments) need human confirmation.
5. **Prompt injection risk:** Malicious user input could manipulate LLM to perform unauthorized B1 operations.

**Solution:** Always insert a typed business API or MCP server between the LLM and B1.

### MCP Server Design for SAP B1

```
Tool: create_sales_order
  Input: {
    customer_code: string,
    items: [{item_code, quantity, price}],
    delivery_date: date
  }
  
  Business Logic:
    1. Validate customer exists in B1.
    2. Validate items and quantities.
    3. Check credit limit (business rule).
    4. Log: user, intent, parameters, timestamp.
    5. If order value > threshold → require human approval.
    6. Call B1 Service Layer POST /SalesOrders.
    7. Log: result or error.
    
  Returns: { order_id, status, message }
```

**MCP Tool Categories for SAP B1:**

| Category | Example Tools | Risk Level |
|----------|--------------|------------|
| Read-only | get_customer, list_open_orders, check_stock | Low |
| Write (low risk) | create_quote, update_contact | Medium |
| Write (high risk) | create_invoice, post_payment, cancel_order | High — require approval |
| Admin | change_price_list, modify_master_data | Very High — restrict severely |

### Required Logging per Operation

Every B1 operation via agent must log:
- Requesting user (authenticated identity).
- Stated intent (what the user asked for).
- Tool called.
- Parameters passed.
- B1 response or error.
- Timestamp.
- Approval status (if applicable).

Store logs in: Cloud Logging or HANA Cloud (for business-level audit).

---

## Integration Suite for SAP B1

SAP Integration Suite provides pre-built integration content for SAP B1:

`REQUIRES_VALIDATION:` Check SAP Business Accelerator Hub for current B1 integration packages: https://api.sap.com/package/SAPB1/overview

Integration patterns via Integration Suite:
- **B1 → Cloud:** Push B1 events (new order, invoice) via iFlow to BTP or external system.
- **Cloud → B1:** Create/update B1 business objects from cloud triggers.
- **B1 ↔ S/4HANA:** Synchronize master data between B1 and S/4HANA via Integration Suite.

---

## SAP Business One Integration Hub

`REQUIRES_VALIDATION:` SAP Business One Integration Hub is an add-on for SAP B1 that enables event-based integration. Verify current availability, supported versions, and documentation at:
https://help.sap.com/docs/sap-integration-suite/sap-integration-suite/sap-business-one

---

## What Lives Where — Decision Guide

| Concern | Location | Reasoning |
|---------|----------|-----------|
| Business data | SAP B1 on-premise | Core ERP data |
| Business logic validation | BTP CAP / MCP | Keep B1 clean; validation in BTP layer |
| User authentication | BTP IAS | Centralized identity |
| B1 service user credentials | BTP Destination Service | Never in code |
| Conversation history (AI) | BTP HANA Cloud | User-specific AI context |
| Audit logs | BTP Cloud Logging + HANA | Compliance and traceability |
| Agent orchestration | BTP AI Core | LLM access via Generative AI Hub |

---

## PoC Plan for B1 + BTP Integration

See `templates/poc-plan.md` for a template. Key validations for B1 PoC:

1. Cloud Connector connectivity from BTP to B1 Service Layer.
2. Authentication and session management with Service Layer.
3. CRUD operations on key B1 objects (BP, Orders, Invoices).
4. Error handling for B1 API errors.
5. Performance of Service Layer under load.
6. MCP or domain API layer between LLM and B1.
7. Logging and audit trail completeness.

**Mark as PoC:** Any direct LLM → B1 integration pattern should be explicitly labeled as a proof-of-concept requiring security review before production.
