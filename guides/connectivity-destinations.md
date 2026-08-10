# Connectivity & Destinations — SAP BTP

Connecting BTP applications to remote systems (cloud or on-premise) requires understanding the connectivity layer. This guide covers the Destination Service, Connectivity Service, and Cloud Connector.

**Official sources:**
- Connectivity: https://help.sap.com/docs/connectivity
- Cloud Connector: https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/cloud-connector
- Destinations: https://help.sap.com/docs/connectivity/sap-btp-connectivity-cf/destinations

**Last verified:** 2026-08-10

---

## Connectivity Architecture

```
BTP Application
    ↓ uses
Destination Service (named connection config)
    ↓ routes to
    ├── Cloud System (direct HTTPS)
    └── Connectivity Service → Cloud Connector → On-Premise System
```

---

## Destination Service

The Destination Service stores named connection configurations. Applications retrieve destination details at runtime without hardcoding URLs or credentials.

### Destination Properties

Each destination has:
- **Name:** Unique identifier referenced in code.
- **Type:** HTTP, RFC, LDAP, MAIL.
- **URL:** Target endpoint.
- **Authentication:** NoAuthentication, BasicAuthentication, OAuth2ClientCredentials, OAuth2SAMLBearerAssertion, ClientCertificateAuthentication, and more.
- **ProxyType:** Internet (cloud) or OnPremise (via Cloud Connector).

### Creating a Destination

Via BTP Cockpit:
1. Go to Subaccount → Connectivity → Destinations.
2. Click "New Destination".
3. Fill in name, URL, authentication type, and credentials.

Via BTP CLI:
```bash
btp create services/instance --offering-name destination --plan-name lite
```

### Authentication Types

| Type | Use Case | Security Level |
|------|---------|----------------|
| `NoAuthentication` | Public APIs | Low |
| `BasicAuthentication` | Legacy systems only | Low (avoid if possible) |
| `OAuth2ClientCredentials` | Machine-to-machine APIs | High |
| `OAuth2SAMLBearerAssertion` | Principal propagation to SAP backends | High |
| `ClientCertificateAuthentication` | Certificate-based mTLS | High |
| `OAuth2JWTBearer` | Token exchange flows | High |
| `SAMLAssertion` | SAML-based flows | High |

**Rule:** Never use `BasicAuthentication` for new production integrations. Prefer OAuth2 or certificate-based authentication.

### Consuming Destinations in Code

**CAP (Node.js):**
```javascript
const { getDestination } = require('@sap-cloud-sdk/connectivity');

const destination = await getDestination({ destinationName: 'MY_DEST' });
```

**CAP (Java with Cloud SDK):**
```java
HttpDestination destination = DestinationAccessor.getDestination("MY_DEST").asHttp();
```

**Plain Node.js:**
```javascript
const xsenv = require('@sap/xsenv');
const services = xsenv.getServices({ destination: { label: 'destination' } });
// Then call Destination Service REST API
```

---

## SAP Cloud Connector

On-premise software that creates a secure outbound tunnel from the customer network to BTP.

### How it Works

```
BTP Application → Connectivity Service → Cloud Connector Agent (on-premise) → Internal System
```

- Cloud Connector establishes an **outbound** connection to BTP.
- **No inbound firewall rules** required on the customer network.
- BTP routes requests through the tunnel to the specified on-premise host.

### Installation

1. Download Cloud Connector from https://tools.hana.ondemand.com/ (requires SAP ID).
2. Install on a Java-capable server in the customer network.
3. Configure initial admin password.
4. Connect to BTP subaccount via Cockpit.

### System Mapping

In Cloud Connector admin UI, define which internal systems are accessible:

| Parameter | Description |
|-----------|-------------|
| Back-end Type | ABAP, SAP HANA, Other |
| Internal Host | The internal hostname |
| Internal Port | Port of the system |
| Virtual Host | Name exposed to BTP |
| Virtual Port | Port exposed to BTP |
| Protocol | HTTP, HTTPS, RFC |

**Security principle:** Expose only the minimum paths required. Do not map entire file systems or all RFC function modules.

### High Availability

For production:
- Install two Cloud Connector instances.
- Configure master-shadow setup.
- Automatic failover when master becomes unavailable.

`REQUIRES_VALIDATION:` HA setup details — verify against current Cloud Connector documentation.

### Cloud Connector vs. Private Link

SAP also offers a **Private Link Service** for connecting to cloud-based systems via a private network link (cloud provider-specific). Cloud Connector is for on-premise; Private Link is for cloud-hosted systems.

`REQUIRES_VALIDATION:` Private Link Service availability varies by region and cloud provider.

---

## Connectivity Service

BTP service that enables CF/Kyma applications to use the Cloud Connector tunnel.

- **Service plan:** `lite`
- **Binding:** Inject into CF app via service binding; provides connection proxy details.
- Works in conjunction with Destination Service (ProxyType = OnPremise).

Applications do not call the Connectivity Service directly — the Cloud SDK and Destination Service abstract this.

---

## On-Premise Connectivity Pattern

Complete flow for a BTP CAP app calling on-premise S/4HANA:

```
1. CAP app requests resource from Destination "S4HANA_ONPREM"
2. Destination Service returns: URL=http://virtual-host:443, ProxyType=OnPremise, Auth=...
3. Cloud SDK routes request via Connectivity Service
4. Connectivity Service routes via Cloud Connector tunnel
5. Cloud Connector forwards to internal S/4HANA host
6. Response travels back through the same tunnel
```

**MTA resource for Connectivity:**
```yaml
resources:
  - name: connectivity
    type: org.cloudfoundry.managed-service
    parameters:
      service: connectivity
      service-plan: lite
```

---

## Destination Service in Kyma

In Kyma, destinations are accessed via:
1. ServiceBinding to Destination Service in Kyma namespace.
2. Credentials injected as Kubernetes secret.
3. Application calls Destination Service REST API to fetch destination details.

There is no automatic SDK integration in Kyma like in CF — additional code required.

`REQUIRES_VALIDATION:` Kyma-native Destination Service tooling availability.

---

## Security Rules for Connectivity

1. **No credentials in code.** Use Destination Service for all outbound connection configs.
2. **Prefer OAuth2 over Basic Auth.** For all API connections.
3. **Restrict Cloud Connector system mappings.** Only expose required paths.
4. **Harden the Cloud Connector host.** Apply OS patching, firewall rules, and monitoring.
5. **Use HTTPS for all tunneled connections.** Never use HTTP ProxyType connections in production.
6. **Rotate credentials in destinations.** Set reminders for certificate and secret expiry.
7. **Principal propagation for user context.** When user identity must flow to the backend (e.g., S/4HANA), use OAuth2SAMLBearerAssertion.

---

## Principal Propagation

Principal propagation passes the logged-in user's identity from BTP to a backend system.

**Flow:**
1. User logs into BTP application (XSUAA/IAS issues JWT).
2. Application calls Destination configured with `OAuth2SAMLBearerAssertion`.
3. Cloud SDK exchanges JWT for SAML assertion.
4. Backend receives request authenticated as the original user.

**When to use:** When the on-premise system requires user-specific authorization (not just a technical service account).

**Prerequisite:** Trust configuration between BTP and the on-premise system's identity provider.

---

## Common Pitfalls

| Pitfall | Risk | Fix |
|---------|------|-----|
| Hardcoded URLs | Breaks in multi-environment setups | Use Destination Service |
| BasicAuth in production | Credential exposure | Switch to OAuth2 |
| HTTP in Cloud Connector | Unencrypted tunnel | Enforce HTTPS |
| Too broad system mapping | Attack surface expansion | Restrict to minimum paths |
| No HA for Cloud Connector | Single point of failure | Master-shadow setup |
| Missing Connectivity Service binding | Runtime errors | Include in MTA resources |
