---
name: sap-btp-ai
description: >
  Designs AI and ML solutions on SAP BTP: AI Core, Generative AI Hub, RAG architectures,
  LLM integration, agent patterns, and AI governance. Use when the task involves
  generative AI, machine learning, RAG, or agentic AI on SAP BTP.
---

## Objective

Design AI-powered solutions on SAP BTP that are secure, governed, and reliable. Select the right AI service, define the architecture, and enforce mandatory security controls.

## Problems This Skill Solves

- How to access LLMs (GPT-4, Claude, Gemini) from a BTP application?
- How to build a RAG system on BTP?
- How to train and deploy a custom ML model?
- How to design an AI agent with tool access to SAP systems?
- How to govern AI usage (cost, compliance, safety)?
- What is the role of Joule vs custom AI?

## Required Reading

1. `catalog/agent-service-index.yaml` — AI Core, Generative AI Hub, Joule entries.
2. `guides/ai-capabilities.md` — AI services reference.
3. `guides/agentic-ai-mcp.md` — agent and MCP patterns.
4. `guides/security-identity.md` — AI security rules.
5. `guides/data-analytics.md` — HANA Cloud vector engine.

## Official Sources to Verify

- SAP AI Core: https://help.sap.com/docs/sap-ai-core
- Generative AI Hub: https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/generative-ai-hub-in-sap-ai-core
- Model catalog: https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/models-and-scenarios-in-sap-generative-ai-hub
- AI Launchpad: https://help.sap.com/docs/ai-launchpad
- Joule: https://help.sap.com/docs/joule

## Reasoning Flow

1. Clarify the AI use case: generative, predictive, agent, embedded.
2. Consult `catalog/agent-service-index.yaml` for candidate services.
3. Determine if custom model or LLM via Generative AI Hub.
4. Verify model availability in required region.
5. Design data layer (HANA Cloud vector for RAG, or training dataset).
6. Design the API/MCP tool layer (business operations, not raw DB).
7. Define authorization: who can trigger AI operations and what tools can they invoke.
8. Define audit and observability (log every LLM call and tool invocation).
9. Define cost controls (per-user token limits, rate limiting).
10. Apply safety controls (content filtering, human approval for writes).
11. Output: AI architecture + security checklist.

## Discovery Questions

- Generative AI (LLM) or traditional ML (classification, forecasting)?
- Custom model training needed, or use pre-trained LLMs via Generative AI Hub?
- Which LLM provider preference? (SAP evaluates model availability by region)
- RAG needed? What document corpus? Where stored?
- Is it an agentic AI (can call tools to act on systems)?
- What SAP systems can the AI interact with?
- What are the data privacy requirements for data sent to LLMs?
- What is the approval policy for AI-initiated write operations?

## AI Architecture Selection

| Use Case | Architecture |
|----------|-------------|
| Q&A on documents | RAG: AI Core (embedding) + HANA Cloud (vector) + Generative AI Hub (LLM) |
| Business assistant (read-only) | Generative AI Hub + CAP API (typed read tools) |
| Business assistant (write capable) | Generative AI Hub + MCP/API + human approval layer |
| Custom ML model (classification, forecasting) | AI Core training pipelines + AI Core inference |
| SAP product AI copilot | Joule (product-specific, not custom) |
| AI-assisted development | SAP Build Code + Joule |

## Security Rules (Non-Negotiable)

1. Never connect LLMs directly to HANA SQL or SAP Service Layer.
2. Always insert a typed business API or MCP server between LLM and backend.
3. Validate and sanitize all user inputs before passing to LLMs (prompt injection).
4. Enable content filtering in Generative AI Hub for production.
5. Log every LLM call: user, prompt summary, model, tokens used, response.
6. Log every tool call: user, tool name, parameters, result.
7. Human approval required for AI-initiated write operations above risk threshold.
8. No PII in prompts unless explicitly required and documented.
9. Resource group isolation in AI Core per team/application.
10. AI Core inference endpoints not exposed publicly without API gateway.

## Antipatterns

- LLM generating SQL queries executed against HANA directly.
- Agent with unrestricted access to all B1 or S/4 operations.
- No logging of LLM interactions (compliance and forensics failure).
- Auto-approving all AI-initiated write operations.
- Assuming model availability without verifying at Generative AI Hub model catalog.
- Using Joule as a general-purpose AI framework (it is embedded, not extensible).
- No cost control on LLM token usage.

## Output Checklist

- [ ] AI use case classified (generative / ML / agent / embedded).
- [ ] Service selected (AI Core / Generative AI Hub / Joule).
- [ ] Model availability in required region confirmed (REQUIRES_VALIDATION if not).
- [ ] RAG architecture described if needed (vector store, embedding, LLM).
- [ ] Tool/API layer designed (no direct DB access).
- [ ] Authorization for tool invocation defined.
- [ ] Logging and audit plan for LLM and tool calls.
- [ ] Content filtering and safety controls specified.
- [ ] Human approval threshold defined for write operations.
- [ ] Cost model understood (tokens, compute).

## Response Format

```
## AI Architecture

### Use Case Classification
[Generative / ML / Agent / Embedded]

### Services
[AI Core, Generative AI Hub, HANA Cloud vector, CAP, MCP]

### Data Flow
[User → LLM → Tools → Backend → Response]

### Tool Design
[Named tools, inputs, outputs, validation, authorization]

### RAG Design (if applicable)
[Embedding model, vector store, retrieval strategy, LLM]

### Security Controls
[Content filtering, logging, human approval thresholds]

### Cost Controls
[Token limits, rate limiting, monitoring]

### Sources Consulted
[Document + URL — verified YYYY-MM-DD]
```

## REQUIRES_VALIDATION Triggers

- Specific LLM model availability in required region.
- HANA Cloud vector engine availability for the service plan.
- Official SAP MCP SDK or framework.
- AI Core feature changes post knowledge cutoff.
- Joule availability in specific SAP product version.
