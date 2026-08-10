# Automation & Low-Code — SAP BTP

Guide to SAP Build portfolio: process automation, RPA, app building, and digital workspaces.

**Official sources:**
- Build Apps: https://help.sap.com/docs/build-apps
- Build Process Automation: https://help.sap.com/docs/build-process-automation
- Build Work Zone: https://help.sap.com/docs/build-work-zone-standard-edition

**Last verified:** 2026-08-10

---

## SAP Build Portfolio Overview

| Product | Primary Capability | Target User |
|---------|-------------------|-------------|
| SAP Build Apps | Visual no-code/low-code app builder | Citizen developers, line-of-business |
| SAP Build Process Automation | Workflow + RPA + Business Rules | Process owners, automation specialists |
| SAP Build Work Zone | Digital workplace / Fiori launchpad | IT + end users |
| SAP Build Code | AI-assisted CAP + Fiori development | Developers |

**Key distinction:** SAP Build Apps and Build Code are different products despite similar names. Build Apps = no-code UI builder. Build Code = AI-assisted professional development (CAP/Fiori).

---

## SAP Build Apps

Visual application builder for web and mobile apps without code.

### Capabilities
- Drag-and-drop component library.
- Data binding to REST APIs, OData sources, HANA Cloud.
- Mobile app output (iOS, Android).
- Web app output.
- BTP service integration (auth via IAS).

### Use Cases
- Custom mobile apps for field workers.
- Simple data entry forms.
- Dashboard apps consuming existing APIs.
- Rapid prototyping for business users.

### Limitations
- Complex business logic is difficult without custom code.
- Not a replacement for CAP for backend-heavy applications.
- Performance may not match hand-coded applications at scale.

**Official docs:** https://help.sap.com/docs/build-apps

---

## SAP Build Process Automation (SBPA)

### Components

| Component | Description |
|-----------|-------------|
| **Workflow** | Design and execute multi-step approval or automation processes |
| **RPA Bots** | Automate repetitive UI tasks (attended or unattended) |
| **Business Rules** | Externalize business decisions (pricing, eligibility) |
| **Forms** | Design digital forms for data input |
| **Decision Tables** | Manage rules as tables (if/then logic) |
| **Process Visibility** | Monitor running process instances |

### Workflow Design

SBPA uses a visual BPMN-like designer for workflows:
- Human tasks (approvals via SAP Inbox).
- Service tasks (call external APIs).
- Automation tasks (trigger RPA bots).
- Decision tasks (apply business rules).
- Notifications.

### RPA Capabilities

- Record desktop/browser interactions.
- Automate SAP GUI, web browsers, Office applications.
- Attended bots: work alongside a user.
- Unattended bots: scheduled or triggered autonomously.
- Bot agent installed on Windows machine.

### Integration Points

- **SAP Inbox:** Human approval tasks delivered to SAP Inbox in Work Zone or standalone.
- **CAP + Integration Suite:** Trigger workflows from backend services.
- **SAP Build Apps:** Initiate processes from apps.

### Security
- Credentials for bot targets stored in credential vault.
- Role-based access to process design and execution.
- Human approval steps mandatory for high-risk operations.

**Official docs:** https://help.sap.com/docs/build-process-automation

---

## SAP Build Work Zone

Digital workplace for SAP, hosting Fiori launchpad and collaborative workspaces.

### Editions

| Edition | Capability |
|---------|-----------|
| **Standard Edition** | Fiori launchpad for multiple apps; role-based content |
| **Advanced Edition** | + Collaboration workspaces, rooms, content pages, SAP Mobile Start |

`REQUIRES_VALIDATION:` Verify current edition differences and pricing at Discovery Center.

### Key Capabilities

- **Fiori Launchpad:** Centralized entry point for Fiori apps from different SAP systems.
- **Content Federation:** Pull apps from S/4HANA, BTP, and other sources into one launchpad.
- **Workspace:** Team collaboration spaces (Advanced Edition).
- **SAP Mobile Start:** Mobile access to the launchpad (Advanced Edition).

### Fiori Launchpad Setup

1. Assign role collections that control which apps appear per user role.
2. Add SAP Fiori apps from BTP (HTML5 App Repository) or remote systems.
3. Configure trust between Work Zone and source systems (S/4HANA, etc.).

### Authentication

IAS is the primary identity provider for Work Zone. Users login via SSO.

**Official docs:** https://help.sap.com/docs/build-work-zone-standard-edition

---

## When Low-Code vs Pro-Code

| Scenario | Low-Code (Build Apps / SBPA) | Pro-Code (CAP / SDK) |
|----------|---------------------------|---------------------|
| Business user building a simple form app | ✓ | Overkill |
| Automating a manual approval process | ✓ (SBPA) | Possible but complex |
| Complex business logic with many conditions | Difficult | ✓ |
| Scalable multi-tenant SaaS | Not designed for | ✓ |
| Rapid prototype for stakeholder validation | ✓ | Slower |
| Enterprise-grade OData API with auth | Not suitable | ✓ |
| Connecting 150+ SaaS apps | ✓ (Open Connectors) | Manual work |

---

## Low-Code Security Considerations

- **Bot credentials:** Store in SBPA credential vault. Never embed in process definitions.
- **Human approval:** Always add approval steps before irreversible actions.
- **Role-based access:** Limit who can design and publish processes.
- **Bot audit:** Enable logging for all bot executions.
- **Data handling:** Bots may access sensitive data — apply GDPR controls.
