# Personal Gemini Journal: Security Specification & Threat Model

This document specifies the Zero-Trust security posture, data isolation guarantees, and defensive test matrix for **Personal Gemini Journal** deployed on Google Cloud Run with Firebase Auth, Cloud Firestore, and Gemini models.

---

## 1. Data Invariants & Security Architecture

1. **Strict Tenant Isolation**: Every journal entry, reflection summary, and knowledge graph node is inextricably bound to a verified `userId` extracted from the server-validated Firebase Authentication JWT.
2. **Server-Side Key Isolation**: Gemini API keys, Google Maps API keys, and notification webhooks reside exclusively in Google Cloud Secret Manager and environment variables. No client bundle ever receives raw secrets.
3. **Immutable Audit Trail**: All administrative and workflow dispatch actions produce append-only audit records with masked IP logging.
4. **Data Minimization & PII Scrubbing**: External notification webhooks (Slack/Discord) receive only high-level sanitized category labels and stress scores, never full journal bodies.

---

## 2. The "Dirty Dozen" Threat Payloads & Defense Matrix

| # | Attack Vector / Payload | Target Resource | Invariant Tested | Rule Defense & Enforcement | Result |
|---|-------------------------|-----------------|-------------------|----------------------------|--------|
| **01** | `POST /users/victim_123/journals` with `auth.uid = attacker_456` | `/users/{userId}/journals/{id}` | Tenant Isolation | `isOwner(userId)` fails (`attacker_456 != victim_123`) | **PERMISSION_DENIED** (403) |
| **02** | `POST /users/{id}` with `role: "admin"` during user registration | `/users/{userId}` | Privilege Escalation | `incoming().role == 'user' \|\| isAdmin()` blocks self-granted admin | **PERMISSION_DENIED** (403) |
| **03** | `PUT /users/{userId}/journals/{id}` with mutated `createdAt` | `/users/{userId}/journals/{id}` | Temporal Immutability | `incoming().createdAt == existing().createdAt` prevents tampering | **PERMISSION_DENIED** (403) |
| **04** | `POST /users/{userId}/journals/{id}` with 1MB oversized string in `title` | `/users/{userId}/journals/{id}` | Denial of Wallet (Storage Flood) | `data.title.size() <= 200` blocks payload | **PERMISSION_DENIED** (400) |
| **05** | `GET /users/{victimId}/journals` unauthenticated (`auth = null`) | `/users/{userId}/journals` | Authentication Mandatory | `isSignedIn()` evaluates false | **PERMISSION_DENIED** (401) |
| **06** | `PUT /audit_logs/{id}` to overwrite security log | `/audit_logs/{logId}` | Append-Only Audit Integrity | `allow update, delete: if false;` | **PERMISSION_DENIED** (403) |
| **07** | Document path injection: `journals/../../../admin_secrets` | Path Variable | Path Variable Hardening | `isValidId(journalId)` regex `^[a-zA-Z0-9_\-]+$` | **PERMISSION_DENIED** (400) |
| **08** | Client spoofing `x-user-id` header to read foreign journals | `/api/journals` | Server-Side Identity Derivation | Token verification overrides client header | **OVERRIDDEN / SECURED** |
| **09** | XSS Script tag in journal content: `<script>stealKeys()</script>` | Content Rendering | React JSX Auto-Sanitization | Escaped by default; no `dangerouslySetInnerHTML` | **SANITIZED** |
| **10** | External Webhook SSRF attack with `http://169.254.169.254/` | `/api/notifications/test` | SSRF & Metadata Protection | URL protocol check + HTTPS requirement | **REJECTED** |
| **11** | High-frequency API polling attack (>100 req/sec) | `/api/journals/:id/analyze` | Token & Rate Protection | Concurrency buffer + Context Optimizer | **THROTTLED** |
| **12** | Admin metric query by standard user role | `/api/admin/metrics` | RBAC Gating | `requireAdminRole` middleware returns 403 | **PERMISSION_DENIED** (403) |

---

## 3. Antigravity & CI/CD Security Verification Plan

- **Unit Testing**: Validate Firestore security rules with `@firebase/rules-unit-testing`.
- **Static Analysis**: ESLint security rules with `@firebase/eslint-plugin-security-rules`.
- **Runtime Monitoring**: Google Cloud Logging structured alerts for repeated 403 events.
