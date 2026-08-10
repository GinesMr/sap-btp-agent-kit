# AI Capabilities — SAP BTP

SAP AI Foundation on BTP provides infrastructure for building, deploying, and governing AI/ML workloads. This guide covers the AI services, their architecture, and how to build AI-powered solutions.

**Official sources:**
- SAP AI Core: https://help.sap.com/docs/sap-ai-core
- SAP AI Launchpad: https://help.sap.com/docs/ai-launchpad
- Generative AI Hub: https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/generative-ai-hub-in-sap-ai-core
- Joule: https://help.sap.com/docs/joule

**Last verified:** 2026-08-10

---

## SAP AI Foundation — Architecture Overview

```
SAP AI Foundation
├── SAP AI Core           ← Infrastructure: training, inference, LLM access
│   └── Generative AI Hub ← Unified LLM API gateway
├── SAP AI Launchpad      ← UI for ML lifecycle management
├── SAP HANA Cloud        ← Vector store for RAG
└── Joule                 ← Embedded AI copilot in SAP products
```

**Key distinction:**
- **SAP AI Core:** The platform. Runs ML training, hosts model endpoints, provides Generative AI Hub.
- **SAP AI Launchpad:** The management UI for AI Core.
- **Generative AI Hub:** The LLM access capability within AI Core.
- **Joule:** Pre-built copilot embedded in SAP products — not a custom AI platform.

---

## SAP AI Core

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Resource Group** | Isolated namespace for AI scenarios. Tenant isolation unit. |
| **Application** | A registered AI application (links to a Git repository with ML code). |
| **Scenario** | A named AI use case within an application. |
| **Configuration** | Parameters for a training run or deployment. |
| **Execution** | A training job run. |
| **Artifact** | Output of a training execution (model files, datasets). |
| **Deployment** | A running inference endpoint serving a model. |

### AI Core Workflow

```
1. Register Application (Git repo with AI code)
2. Create Resource Group
3. Create Configuration (parameters + artifact references)
4. Run Execution (training job → Argo Workflows)
5. Register Artifact (model output)
6. Create Deployment (inference endpoint)
7. Call Deployment (HTTP endpoint for predictions)
```

### AI Core API (REST)

All AI Core operations are performed via REST API:
```
Base URL: https://api.ai.{region}.aws.ml.hana.ondemand.com/v2
Auth: OAuth 2.0 (client credentials from service binding)
```

Example — List deployments:
```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.ai.eu10.aws.ml.hana.ondemand.com/v2/lm/deployments"
```

### Python SDK (AI Core SDK)

```python
from ai_core_sdk.ai_core_v2_client import AICoreV2Client

ai_client = AICoreV2Client(
    base_url=credentials["serviceurls"]["AI_API_URL"],
    auth_url=credentials["uaa"]["url"],
    client_id=credentials["uaa"]["clientid"],
    client_secret=credentials["uaa"]["clientsecret"]
)

deployments = ai_client.deployment.query(resource_group="default")
```

**Official docs:** https://help.sap.com/docs/sap-ai-core

---

## SAP Generative AI Hub

### Purpose

Unified access to multiple LLM providers through a single SAP API. Provides:
- Model selection across providers (OpenAI, Anthropic, Google, Mistral, open-source).
- Prompt lifecycle management.
- Prompt templates and versioning.
- Content filtering (configurable).
- Orchestration layer (chains, agents).

### Available Models

`REQUIRES_VALIDATION:` Model availability changes frequently. Always check the current model catalog at:
https://help.sap.com/docs/sap-ai-core/sap-ai-core-service-guide/models-and-scenarios-in-sap-generative-ai-hub

At the time of writing, models from OpenAI (GPT-4, GPT-4o), Anthropic (Claude models), Google (Gemini), Meta (Llama), and Mistral were accessible — but availability varies by region.

### Using Generative AI Hub (Python)

```python
from gen_ai_hub.proxy.native.openai import openai

# The API is OpenAI-compatible
response = openai.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain SAP BTP in 3 sentences."}
    ]
)
print(response.choices[0].message.content)
```

### Orchestration Service (within Generative AI Hub)

The Orchestration Service provides:
- **Templating:** Parameterized prompts with variable substitution.
- **Content Filtering:** Block harmful content (SAP and/or Azure Content Safety).
- **Grounding:** Inject document context into prompts (RAG).
- **Module pipeline:** Chain templating → filtering → LLM → output filtering.

---

## RAG Architecture on BTP

Retrieval-Augmented Generation (RAG) on BTP:

```
User Query
    ↓
1. Embed query (embedding model via AI Core)
    ↓
2. Similarity search (HANA Cloud vector engine)
    ↓ top-k relevant documents
3. Construct prompt (Generative AI Hub Orchestration)
    ↓ query + context
4. LLM generates answer (GPT-4, Claude, etc.)
    ↓
5. Return answer to user
```

**Services involved:**
- **SAP AI Core / Generative AI Hub:** Embedding model + LLM.
- **SAP HANA Cloud:** Vector store (via `VECTOR` column type or vector engine).
- **CAP (optional):** Backend API orchestrating the flow.
- **SAP Build Work Zone or custom UI:** User interface.

`REQUIRES_VALIDATION:` HANA Cloud vector engine feature availability depends on the HANA Cloud version and service plan. Verify before planning production RAG workloads.

---

## SAP AI Launchpad

Web UI for managing AI Core:
- View and manage resource groups, applications, scenarios, configurations.
- Monitor training executions and deployment status.
- Register models and artifacts.
- Access Generative AI Hub prompt management.

**Key note:** AI Launchpad is a consumer of AI Core — it does not add AI functionality but provides a visual interface for operations.

**Official docs:** https://help.sap.com/docs/ai-launchpad

---

## Joule

SAP's embedded AI copilot:
- Available in SAP S/4HANA Cloud, SuccessFactors, Ariba, BTP Build Code, and other products.
- Powered by SAP's AI models (built on Generative AI Hub).
- Natural language interface for business tasks within SAP products.
- Not a developer API — it is a user-facing copilot within specific SAP products.

**Developer use case:** SAP Build Code integrates Joule to generate CAP models, OData services, and Fiori apps from natural language descriptions.

`REQUIRES_VALIDATION:` Joule availability per product and region — check the SAP Roadmap and Discovery Center.

**Official docs:** https://help.sap.com/docs/joule

---

## AI Security and Governance

### Security Principles for AI on BTP

1. **No direct database access from LLMs.** Always use a typed API or MCP server as the intermediary.
2. **Input validation.** Validate and sanitize user input before passing to LLMs (prompt injection defense).
3. **Output validation.** Validate LLM output before using it in business logic.
4. **Content filtering.** Enable SAP Generative AI Hub content filtering for production.
5. **Least privilege for AI Core.** Resource groups isolate AI workloads.
6. **Audit LLM interactions.** Log user queries and LLM responses for compliance.
7. **Human approval for write operations.** AI agents should not execute SAP write operations without human confirmation for high-risk actions.
8. **Data minimization.** Do not send more data than necessary to LLM (privacy).

### Prompt Injection Defense

- Validate and sanitize user inputs.
- Use system prompts to define boundaries clearly.
- Use content filtering in Generative AI Hub.
- Monitor for anomalous LLM behavior.

### Model Governance

- Track which model version is used in production (model pinning).
- Re-evaluate prompts and behavior when model versions change.
- Test model outputs before promoting to production.

---

## AI Capability Selection Guide

| Need | Recommended Approach |
|------|---------------------|
| Access GPT-4 / Claude on BTP | Generative AI Hub via AI Core |
| Deploy custom ML model | AI Core training + inference deployment |
| RAG on business documents | AI Core (embedding) + HANA Cloud (vector) + Generative AI Hub (LLM) |
| Embedded AI in SAP products | Joule (product-specific availability) |
| AI-assisted development | SAP Build Code + Joule |
| AI workflow automation | Build Process Automation + AI capabilities |
| AI agent with tools | AI Core + CAP API + MCP or function calling |

---

## Getting Started Checklist

- [ ] AI Core entitlement confirmed in subaccount.
- [ ] Region verified — AI Core and Generative AI Hub available.
- [ ] Model availability confirmed for required LLM.
- [ ] Resource group created.
- [ ] Service instance created and bound.
- [ ] OAuth credentials obtained (from service binding).
- [ ] HANA Cloud available if RAG is needed.
- [ ] Security review: no direct DB access from LLM, content filtering configured.
- [ ] Cost model understood: per-token pricing for LLMs.
- [ ] Human approval mechanism in place for write operations.
