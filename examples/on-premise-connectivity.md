# Example: On-Premise Connectivity via Cloud Connector

**Type:** Architecture Pattern (not official SAP documentation)  
**Status:** Established pattern — validate Cloud Connector version and entitlements before implementation.  
**Last updated:** 2026-08-10

---

## Scenario

A BTP application (CAP-based) needs to read and write data to an on-premise SAP system (SAP Business One or SAP ERP) without exposing the on-premise network to the Internet.

---

## Architecture

```
[BTP Subaccount — Cloud Foundry]
  [CAP Application]
       │
       │ (1) Calls Destination Service → gets "SAP_B1_DEST" config
       │ (2) Routes request via Connectivity Service
       ▼
[Connectivity Service] ──────────────────────────────────┐
                                                          │ encrypted tunnel (TLS)
[Customer Network — on-premise]                          │
  [Cloud Connector Agent] ←────────────────────────────── ┘
       │
       │ forwards to mapped virtual host
       ▼
  [SAP B1 Service Layer — HTTP(S)]
       │
       ▼
  [SAP Business One + HANA]
```

**Key point:** Traffic flows outbound-only from the customer network. No inbound firewall ports required.

---

## Services Used

| Service | Role |
|---------|------|
| Connectivity Service | Enables CF apps to use Cloud Connector tunnel |
| Destination Service | Stores SAP B1 Service Layer URL and credentials |
| Cloud SDK (JS or Java) | Abstracts Destination + Connectivity Service calls |
| Cloud Connector | On-premise agent; establishes tunnel to BTP |

---

## Setup Steps

### Step 1: Install Cloud Connector (On-Premise)

1. Download Cloud Connector from https://tools.hana.ondemand.com/ (SAP ID required).
2. Install on a Java 11+ server in the customer network.
3. Open admin UI: https://localhost:8443.
4. Set initial admin password.
5. Connect to BTP subaccount (provide subaccount region URL, user, password).

### Step 2: Configure System Mapping

In Cloud Connector admin UI → Cloud To On-Premise → Access Control:

| Field | Value |
|-------|-------|
| Back-end Type | Other |
| Protocol | HTTP (or HTTPS if Service Layer uses it) |
| Internal Host | `b1server.internal.company.com` |
| Internal Port | `50000` |
| Virtual Host | `b1-virtual` |
| Virtual Port | `50000` |
| Principal Type | None (technical user) |

**Accessible resources:** Add only `/b1s/v2/*` — restrict to Service Layer path.

### Step 3: Create Connectivity Service Instance (BTP)

```bash
cf create-service connectivity lite b1-connectivity
```

Or via MTA:
```yaml
resources:
  - name: b1-connectivity
    type: org.cloudfoundry.managed-service
    parameters:
      service: connectivity
      service-plan: lite
```

### Step 4: Create Destination

Via BTP Cockpit → Subaccount → Connectivity → Destinations → New:

```
Name:        SAP_B1_DEST
Type:        HTTP
URL:         http://b1-virtual:50000/b1s/v2
ProxyType:   OnPremise
Auth:        BasicAuthentication
User:        b1_service_user
Password:    [stored securely]
```

**Security note:** Use a dedicated B1 technical user with minimum permissions. Avoid using B1 admin user.

### Step 5: Bind Services to CAP App

```yaml
# mta.yaml
modules:
  - name: my-cap-app
    requires:
      - name: b1-connectivity
      - name: b1-destination
      - name: my-xsuaa

resources:
  - name: b1-connectivity
    type: org.cloudfoundry.managed-service
    parameters:
      service: connectivity
      service-plan: lite

  - name: b1-destination
    type: org.cloudfoundry.managed-service
    parameters:
      service: destination
      service-plan: lite
```

### Step 6: Call On-Premise System from CAP

```javascript
// Node.js — using Cloud SDK
const { executeHttpRequest, getDestination } = require('@sap-cloud-sdk/http-client');

async function loginToB1(companyDb) {
    const destination = await getDestination({ destinationName: 'SAP_B1_DEST' });
    
    const loginResponse = await executeHttpRequest(destination, {
        method: 'POST',
        url: '/Login',
        data: {
            CompanyDB: companyDb,
            UserName: process.env.B1_USER,
            Password: process.env.B1_PASS
        }
    });
    
    return loginResponse.headers['set-cookie'];
}

async function getBusinessPartner(bpCode, sessionCookie) {
    const destination = await getDestination({ destinationName: 'SAP_B1_DEST' });
    
    const response = await executeHttpRequest(destination, {
        method: 'GET',
        url: `/BusinessPartners('${bpCode}')`,
        headers: { Cookie: sessionCookie.join('; ') }
    });
    
    return response.data;
}
```

---

## Security Controls

| Control | Implementation |
|---------|---------------|
| No Internet exposure | Cloud Connector outbound-only — no inbound ports |
| Encrypted tunnel | TLS from Cloud Connector to BTP |
| Minimal path exposure | Cloud Connector system mapping: only `/b1s/v2/*` |
| Dedicated service user | B1 technical user (not admin) with minimum roles |
| No hardcoded credentials | Destination Service stores credentials |
| HTTPS preferred | Enable HTTPS on Service Layer if possible |

---

## High Availability

For production:
1. Install two Cloud Connector instances (master + shadow).
2. Configure shadow to connect to same BTP subaccount.
3. Automatic failover if master becomes unavailable.

`REQUIRES_VALIDATION:` Cloud Connector HA setup details — verify against current documentation.

---

## Troubleshooting

| Symptom | Likely Cause | Check |
|---------|-------------|-------|
| 503 from Connectivity Service | Cloud Connector not connected | CC Admin UI → Connection status |
| 404 from B1 Service Layer | Wrong virtual host or path | CC system mapping |
| Auth error from B1 | Wrong credentials or session expired | Destination credentials; session management |
| Timeout | Network issue or CC overloaded | CC logs; network firewall rules |

---

## Risks and Validations

| Risk | Mitigation |
|------|-----------|
| Cloud Connector host as single point of failure | HA setup (master-shadow) |
| Basic Auth for B1 (lower security) | Consider OAuth or client certs if supported by B1 version |
| B1 session management complexity | Implement session pool in CAP layer |
| High latency through tunnel | Profile and measure; consider caching read data |

`REQUIRES_VALIDATION:`
- [ ] Cloud Connector version compatibility with BTP region.
- [ ] B1 Service Layer HTTPS support in installed version.
- [ ] HA Cloud Connector setup for production.
