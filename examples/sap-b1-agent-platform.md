# Example: AI Agent Platform Connected to SAP Business One

**Type:** Architecture Pattern (not official SAP documentation)  
**Status:** PoC pattern — individual components verified; end-to-end must be validated before production.  
**Last updated:** 2026-08-10

---

## Scenario

Build an AI-powered business assistant that helps sales and operations users work with SAP Business One — checking stock, creating quotes, and querying orders — via natural language, from a web app or Microsoft Teams.

---

## Architecture

```
[User via Teams / Web App]
    │ HTTPS + IAS authentication
    ▼
┌─────────────────────────────────────────────────┐
│ SAP BTP Subaccount (Cloud Foundry)              │
│                                                  │
│  [Agent Orchestrator (CAP Node.js)]              │
│       │                                          │
│       ├──► [AI Core — Generative AI Hub]  ◄─────────── LLM (GPT-4o / Claude)
│       │        Reasoning + tool selection          │
│       │                                          │
│       └──► [B1 Tool API (CAP service)]   ──────────────┐
│                 get_customer()                    │    │
│                 check_stock()                     │    │
│                 create_quote()                    │    │
│                 get_open_orders()                 │    │
│                                                  │    │
│  [HANA Cloud]                                    │    │
│   ├── Conversation history                        │    │
│   └── User session context                       │    │
│                                                  │    │
│  [Cloud Logging] ← all tool call logs             │    │
│  [Audit Log]     ← compliance events              │    │
└─────────────────────────────────────────────────┘    │
                                                        │ Destination Service (OnPremise)
                                                        ▼
[Customer Network]
  [Cloud Connector] ───────────────────────────────────►
       │ forwards
       ▼
  [SAP B1 Service Layer — HTTPS — port 50000]
       │
       ▼
  [SAP Business One + HANA on-premise]
```

---

## Services Used

| Service | Role |
|---------|------|
| AI Core + Generative AI Hub | LLM access |
| CAP (Cloud Foundry) | Agent orchestrator + B1 tool API |
| HANA Cloud | Conversation history + session state |
| XSUAA | OAuth 2.0 authorization |
| IAS | User identity (SSO from Teams / web) |
| Destination Service | B1 Service Layer connection config |
| Connectivity Service | Cloud Connector tunnel integration |
| Cloud Connector (on-premise) | Secure tunnel to B1 |
| Cloud Logging | Operation logs |
| Audit Log Service | Compliance events |

---

## B1 Tool Inventory

### Read Tools (Low Risk — Auto-Execute)

| Tool | B1 API Call | Purpose |
|------|------------|---------|
| `get_customer(code)` | GET /BusinessPartners('{code}') | Get BP details |
| `list_open_orders(customer)` | GET /SalesOrders?$filter=... | List open orders |
| `check_stock(item_code)` | GET /Items('{code}') | Check stock level |
| `get_product(code)` | GET /Items('{code}') | Get product details |
| `get_invoice(doc_num)` | GET /Invoices({doc_num}) | Get invoice |
| `search_customers(query)` | GET /BusinessPartners?$filter=... | Search BPs |

### Write Tools (Medium Risk — Soft Confirm)

| Tool | B1 API Call | Risk | Confirmation |
|------|------------|------|-------------|
| `create_quote(customer, items)` | POST /Quotations | Medium | "I'll create a quote for X. Confirm?" |
| `create_order(customer, items)` | POST /SalesOrders | High | "Creating order for €X. Confirm?" |
| `update_order_note(order_id, note)` | PATCH /SalesOrders({id}) | Low | Soft confirm |

### Prohibited (Never via Agent)

| Operation | Reason |
|-----------|--------|
| POST /Invoices | Financial posting — manual only |
| POST /Payments | Financial posting — manual only |
| DELETE on any object | Irreversible — manual only |
| Modify price lists | Master data — restricted manual process |
| Change GL accounts | Finance — manual + audit |

---

## B1 Tool Implementation (Node.js + CAP)

```javascript
// b1-service.js — Service Layer session management

class B1SessionManager {
    constructor(destination, companyDb) {
        this.destination = destination;
        this.companyDb = companyDb;
        this.sessionCookie = null;
        this.sessionExpiry = null;
    }
    
    async getSession() {
        if (this.sessionCookie && Date.now() < this.sessionExpiry) {
            return this.sessionCookie;
        }
        return this.login();
    }
    
    async login() {
        const response = await executeHttpRequest(this.destination, {
            method: 'POST',
            url: '/Login',
            data: {
                CompanyDB: this.companyDb,
                UserName: process.env.B1_SERVICE_USER,
                Password: process.env.B1_SERVICE_PASS
            }
        });
        
        this.sessionCookie = response.headers['set-cookie'];
        this.sessionExpiry = Date.now() + (20 * 60 * 1000); // 20 min
        return this.sessionCookie;
    }
}

// Tool: get_customer
async function get_customer({ customer_code }, userId) {
    // Authorization check
    checkPermission(userId, 'customer.read');
    
    // Get session
    const session = await b1Session.getSession();
    
    // Call Service Layer
    const response = await executeHttpRequest(b1Destination, {
        method: 'GET',
        url: `/BusinessPartners('${encodeURIComponent(customer_code)}')`,
        headers: { Cookie: session.join('; ') }
    });
    
    // Log operation
    await logOperation({
        user: userId,
        tool: 'get_customer',
        params: { customer_code },
        result: 'success',
        timestamp: new Date()
    });
    
    // Return sanitized data (not full B1 object)
    const bp = response.data;
    return {
        code: bp.CardCode,
        name: bp.CardName,
        email: bp.EmailAddress,
        phone: bp.Phone1,
        credit_limit: bp.CreditLimit,
        current_balance: bp.CurrentAccountBalance
    };
}
```

---

## Conversation Flow Example

```
User: "Check stock for item A001 and if we have more than 50, create a quote 
       for customer C001 for 20 units at price 99 EUR"

Agent reasoning:
  1. Call get_product("A001") → {stock: 150, price: 99}
  2. Stock (150) > 50 → condition met
  3. Would create quote: C001, [{A001, 20, 99}] = €1,980
  4. Value €1,980 < €10,000 threshold → soft confirm

Agent response:
  "Item A001 has 150 units in stock. I'd like to create a quote for customer C001 
   for 20 units at €99 each (total: €1,980). Shall I proceed?"

User: "Yes, go ahead"

Agent:
  1. Calls create_quote({customer:"C001", items:[{code:"A001",qty:20,price:99}]})
  2. Tool validates customer, items, business rules
  3. Calls B1 POST /Quotations
  4. Logs: user, intent, tool, params, B1 quote ID

Agent response:
  "Quote QT-00042 has been created for customer C001 for 20 units of A001 at €99 
   (total: €1,980). The quote number is QT-00042."
```

---

## Security Implementation

### XSUAA Authorization per Tool

```json
{
  "scopes": [
    { "name": "$XSAPPNAME.b1.read", "description": "Read B1 data via agent" },
    { "name": "$XSAPPNAME.b1.quote.create", "description": "Create B1 quotes" },
    { "name": "$XSAPPNAME.b1.order.create", "description": "Create B1 orders" }
  ],
  "role-templates": [
    {
      "name": "AgentViewer",
      "scope-references": ["$XSAPPNAME.b1.read"]
    },
    {
      "name": "AgentSalesUser",
      "scope-references": [
        "$XSAPPNAME.b1.read",
        "$XSAPPNAME.b1.quote.create",
        "$XSAPPNAME.b1.order.create"
      ]
    }
  ]
}
```

### Audit Log Entry Format

```json
{
  "timestamp": "2026-08-10T14:35:22Z",
  "session_id": "sess-abc123",
  "user": "jsmith@company.com",
  "user_intent": "Create quote for C001 for 20 units of A001",
  "tool": "create_quote",
  "tool_input": {
    "customer_code": "C001",
    "items": [{ "code": "A001", "qty": 20, "price": 99 }]
  },
  "tool_output": {
    "quote_id": "QT-00042",
    "status": "created",
    "total_value": 1980
  },
  "b1_document_number": 42,
  "approval_required": false,
  "latency_ms": 850,
  "llm_tokens": { "prompt": 920, "completion": 145 }
}
```

---

## PoC Validation Plan

Before going to production, validate:

1. **Cloud Connector tunnel** — stable connection to B1 Service Layer.
2. **Service Layer session management** — session pool behavior under concurrent users.
3. **B1 API performance** — measure response time per endpoint under load.
4. **LLM tool calling accuracy** — does the LLM correctly call tools with valid parameters?
5. **Authorization gates** — verify each role can only invoke permitted tools.
6. **Approval thresholds** — test confirmation flow for orders above threshold.
7. **Error handling** — what happens when B1 is unavailable? Does the agent fail gracefully?
8. **Log completeness** — verify every tool call produces a complete audit log entry.

Use `templates/poc-plan.md` to structure the PoC.

---

## What Lives Where

| Component | Location | Reason |
|-----------|----------|--------|
| SAP B1 + HANA | Customer on-premise | Core ERP — never expose |
| B1 Service Layer | Customer on-premise | B1 API — never public |
| Cloud Connector | Customer on-premise | Outbound tunnel agent |
| B1 Service credentials | BTP Destination Service | Centralized secret management |
| Agent orchestrator | BTP Cloud Foundry | Cloud compute + BTP services |
| LLM access | BTP AI Core | SAP-governed LLM gateway |
| Conversation history | BTP HANA Cloud | Persistent user context |
| Audit logs | BTP Cloud Logging + HANA | Compliance + query-able |
| User identity | BTP IAS | Central SSO |

---

## Risks

| Risk | Mitigation |
|------|-----------|
| B1 session expiry mid-conversation | Session manager with auto-re-login |
| LLM generates invalid B1 parameters | Tool input validation + type enforcement |
| Agent creates duplicate documents | Idempotency check before B1 call |
| B1 API changes break tools | Version-specific tool implementations |
| Cost overrun (LLM tokens) | Per-user daily token budget |
| Prompt injection through B1 data | Sanitize B1 data before including in LLM context |

---

## REQUIRES_VALIDATION

- [ ] Official SAP MCP framework / SDK for BTP production use.
- [ ] B1 Service Layer performance under concurrent agent requests.
- [ ] Integration Suite pre-built B1 content packages (check https://api.sap.com/package/SAPB1).
- [ ] AI Core model availability in required region.
- [ ] HANA Cloud vector engine (if RAG over B1 documents needed).
- [ ] B1 webhook or event capability for real-time notifications to agent.
