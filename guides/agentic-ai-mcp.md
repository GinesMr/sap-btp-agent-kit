# Agentic AI & MCP on SAP BTP

Architecture guide for building AI agent systems on SAP BTP using the Model Context Protocol (MCP), SAP AI Core, and enterprise integration patterns.

**This guide covers emerging architectural patterns. Many elements are established practice, but MCP-specific SAP tooling is rapidly evolving. Items marked `REQUIRES_VALIDATION` must be verified before production implementation.**

**Official sources:**
- SAP AI Core: https://help.sap.com/docs/sap-ai-core
- Generative AI Hub: https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/generative-ai-hub-in-sap-ai-core
- MCP specification: https://modelcontextprotocol.io (external, open protocol)

**Last verified:** 2026-08-10

---

## Agentic AI Architecture Principles

An AI agent is a system where an LLM can:
1. Receive a user goal.
2. Plan a sequence of actions.
3. Call tools (APIs, databases, services) to fulfill the goal.
4. Observe results and adapt.
5. Return a final answer.

**Critical principle for enterprise:** Every tool the agent can call must be a controlled, authorized, typed business operation — never raw database access or unrestricted API calls.

---

## Standard Agent Architecture on BTP

```
┌──────────────────────────────────────────────┐
│ User Layer                                   │
│  Teams / Web App / Copilot / Custom UI       │
└──────────────────┬───────────────────────────┘
                   │ authenticated request (IAS/XSUAA)
┌──────────────────▼───────────────────────────┐
│ Orchestration Layer (BTP)                    │
│  AI Orchestrator (LLM via Generative AI Hub) │
│  CAP backend or agent framework              │
│  Session + conversation management           │
└──────────┬────────────────┬──────────────────┘
           │ tool calls     │ tool calls
┌──────────▼──────┐ ┌───────▼────────────────┐
│ MCP Server A    │ │ MCP Server B / API     │
│ (SAP B1 tools)  │ │ (S/4HANA / ERP tools)  │
└──────┬──────────┘ └───────┬────────────────┘
       │                    │
       ▼ via Cloud Connector ▼ via Destination
┌─────────────────────────────────────────────┐
│ Backend Systems (on-premise or cloud)        │
│  SAP B1 Service Layer                        │
│  SAP S/4HANA                                │
│  SAP HANA Cloud                             │
└─────────────────────────────────────────────┘
```

---

## Model Context Protocol (MCP)

MCP is an open protocol (by Anthropic) for connecting AI assistants to external tools and data sources in a standardized way.

**MCP components:**
- **MCP Host:** The AI application (agent orchestrator).
- **MCP Client:** Protocol client within the host.
- **MCP Server:** Exposes tools, resources, and prompts to the agent.

**MCP transports:**
- **stdio:** Local process communication (development and local tools).
- **HTTP + SSE:** Network-based communication (recommended for BTP deployment).

### MCP Server on BTP (CAP-based)

A CAP application on BTP can serve as an MCP server:

```typescript
// mcp-server.ts (Node.js + CAP or Express)
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
    name: "sap-b1-mcp",
    version: "1.0.0"
});

// Tool: get customer
server.tool(
    "get_customer",
    { customer_code: z.string() },
    async ({ customer_code }) => {
        // Validate input, check authorization
        validateCustomerCode(customer_code);
        checkUserPermission("customer.read", currentUser);
        
        // Call B1 Service Layer (via Destination + Cloud Connector)
        const customer = await b1Client.getBusinessPartner(customer_code);
        
        // Log operation
        await auditLog.write({
            user: currentUser,
            tool: "get_customer",
            params: { customer_code },
            result: "success"
        });
        
        return {
            content: [{
                type: "text",
                text: JSON.stringify(customer)
            }]
        };
    }
);
```

`REQUIRES_VALIDATION:` Official SAP-supported MCP SDK and framework for BTP. Use the open-source MCP SDK from https://modelcontextprotocol.io; verify SAP's official MCP tooling and any BTP-specific SDKs.

---

## Tool Design Principles for SAP Agents

### Principle 1: Operations, Not SQL

Tools must represent **business operations**, not database queries:

```
❌ Bad:  execute_sql("SELECT * FROM ORDR WHERE CardCode = ?")
✓ Good: get_open_orders(customer_code: string) → OrderList
```

### Principle 2: Validate Before Execute

Every write tool must:
1. Validate input schema (types, ranges, formats).
2. Check business rules (credit limit, stock availability).
3. Check user authorization for the operation.
4. Require human confirmation for high-risk operations.
5. Execute only if all checks pass.
6. Log the operation.

### Principle 3: Read-Heavy Design

Design agent tools to be read-heavy:
- Reading is safe and reversible.
- Writing carries risk — require explicit user confirmation for mutations.
- Provide preview/explain capabilities ("What would this do?") before execution.

### Principle 4: Idempotent Operations

Write operations should be idempotent where possible — calling the same tool twice with the same parameters should not create duplicate business objects.

### Principle 5: Human in the Loop for High Risk

Define risk thresholds:
```
order_value < 1000 EUR → auto-approve
order_value 1000-10000 EUR → soft confirm ("I will create an order for X EUR. Confirm?")
order_value > 10000 EUR → require explicit approval workflow (SAP Build Process Automation)
```

---

## Authorization Architecture

### User Identity Propagation

```
User authenticated via IAS
    ↓ JWT token (user identity)
Agent Orchestrator (validates JWT)
    ↓ includes user context in tool call
MCP Server (validates user has permission for this tool)
    ↓ uses technical credentials for backend call
Backend System (acts on behalf of user, logs user identity)
```

**Key:** The technical service account calling B1 Service Layer is NOT the user. The user identity is tracked separately through the application layer.

### Permission Matrix Design

```yaml
# Example permission matrix (implement in your auth layer)
permissions:
  customer.read:    roles: [agent-viewer, agent-user, agent-admin]
  order.read:       roles: [agent-viewer, agent-user, agent-admin]
  order.create:     roles: [agent-user, agent-admin]
  order.cancel:     roles: [agent-admin]
  invoice.create:   roles: [agent-admin]
  payment.post:     roles: []   # Never — manual only
```

---

## Conversation and Context Management

Agents need conversation history and business context. On BTP:

| Storage | Use Case |
|---------|---------|
| HANA Cloud (relational) | Persistent conversation history |
| HANA Cloud (vector) | Semantic retrieval of past conversations |
| CAP session (in-memory) | Short-lived session context |
| BTP Object Store | Attachments and documents |

---

## Observability for AI Agents

Every AI agent system on BTP should implement:

### Structured Logging (per operation)

```json
{
  "timestamp": "2026-08-10T14:30:00Z",
  "session_id": "sess-123",
  "user": "user@company.com",
  "user_intent": "Create sales order for customer C001",
  "tool_called": "create_sales_order",
  "tool_input": { "customer_code": "C001", "items": [...] },
  "tool_output": { "order_id": "SO-1234", "status": "created" },
  "latency_ms": 450,
  "llm_model": "gpt-4o",
  "token_usage": { "prompt": 850, "completion": 120 }
}
```

Log destination: SAP Cloud Logging.
Audit destination: SAP Audit Log Service or HANA Cloud (for business-level compliance).

### Metrics to Monitor

- LLM token consumption per user/session.
- Tool call success/failure rates.
- Latency per tool.
- Human approval trigger rate.
- Denied tool calls (authorization violations).

---

## Deployment Architecture on BTP

### Option A: CAP + AI Core (Recommended)

```
BTP Cloud Foundry:
├── CAP app (agent orchestrator + MCP server)
│   ├── Bound: AI Core (Generative AI Hub)
│   ├── Bound: HANA Cloud (conversation + state)
│   ├── Bound: XSUAA (authorization)
│   ├── Bound: Destination Service (B1, S/4 connections)
│   └── Bound: Connectivity Service (Cloud Connector)
└── Cloud Connector (on-premise) → B1 Service Layer
```

### Option B: Kyma (Container-based)

```
BTP Kyma:
├── Agent orchestrator (Docker container)
├── MCP servers (per system Docker containers)
├── API Gateway (expose agent endpoint)
└── Service bindings → AI Core, HANA, Destination
```

---

## Anti-Patterns — Never Do These

| Anti-Pattern | Risk | Correct Approach |
|--------------|------|-----------------|
| LLM generates SQL queries for HANA or B1 | SQL injection, data breach | Typed business API only |
| LLM calls Service Layer directly | No authz, no audit, no validation | MCP server as intermediary |
| Agent has B1 admin credentials | Full ERP access from AI | Scoped service user, minimum permissions |
| No logging of tool calls | No forensics, no compliance | Structured logging every operation |
| Auto-approve all write operations | Unwanted data mutations | Human confirmation for writes |
| No error handling in MCP tools | Agent gets confused, retries, duplicate data | Catch errors, return structured messages |
| Share one MCP session between users | User data leakage | Isolated session per user |

---

## BTP MCP Patterns — What is Validated vs PoC

| Pattern | Status |
|---------|--------|
| CAP app as HTTP API (tool layer) | VERIFIED — production pattern |
| AI Core + Generative AI Hub for LLM | VERIFIED — production |
| HANA Cloud as conversation store | VERIFIED — production |
| Cloud Connector → B1 Service Layer | VERIFIED — production |
| MCP server on BTP CF | `REQUIRES_VALIDATION` — MCP is new; verify SAP support |
| MCP server on Kyma | `REQUIRES_VALIDATION` — same as above |
| Official SAP MCP SDK | `REQUIRES_VALIDATION` — verify current SAP tooling |
| Joule as agent orchestrator | `REQUIRES_VALIDATION` — Joule is embedded, not a general orchestrator |

---

## Sample End-to-End Flow: "Check stock and quote"

```
User: "What is the available stock for item A001 and create a quote for customer C001 for 10 units?"

1. Agent receives request (authenticated user: user@company.com)
2. LLM plans:
   a. Call get_stock(item_code="A001")
   b. Call create_quote(customer="C001", items=[{code:"A001", qty:10}])
3. Tool: get_stock → OK → returns {item:"A001", stock:150}
4. LLM: "Stock available. Creating quote."
5. Tool: create_quote → validation passes → B1 creates quote → returns {quote_id:"QT-0042"}
6. LLM: "I've created quote QT-0042 for 10 units of A001 for customer C001. Stock: 150 available."
7. All steps logged with user identity, intent, tool, params, result.
```
