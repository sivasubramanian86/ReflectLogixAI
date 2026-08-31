# ReflectLogixAI Security Specification & Zero-Trust Threat Model

This document establishes the **Zero-Trust Security Architecture**, **Tenant Isolation Guarantees**, and **Dirty Dozen Attack Mitigation Matrix** for ReflectLogixAI deployed on **Google Cloud Run** with **Cloud Firestore** and **Google Cloud Secret Manager**.

---

## 1. Zero-Trust Core Invariants

1. **Strict Server-Side Identity Verification**:
   - The client-supplied `userId` is never trusted unconditionally.
   - In production, Firebase Authentication JWTs are verified cryptographically via Firebase Admin SDK.
   - All Firestore documents are stored in `/users/{userId}/journals/{journalId}` where `request.auth.uid == userId`.

2. **Least-Privilege Secret Management**:
   - Secret tokens (`GEMINI_API_KEY`, `GOOGLE_MAPS_API_KEY`, `SLACK_WEBHOOK_URL`, `DISCORD_WEBHOOK_URL`, Database credentials) reside in **Google Cloud Secret Manager**.
   - No API secrets or encryption credentials are baked into client bundles or public container images.

3. **Immutable Audit Logging**:
   - Administrative mutations, feature flag updates, role switches, and failed access attempts write append-only records.
   - Client IPs are anonymized/masked (`192.168.***.***`) to comply with privacy laws (GDPR/APPI/DPDP).

4. **Zero-Retention Detox Mode**:
   - Entries tagged with `detoxMode: true` are processed in ephemeral memory for immediate Socratic reflection and omitted from persistent vector indexes and external webhook notifications.

5. **Outbound Data Sanitization**:
   - External notifications (Slack/Discord) never transmit raw journal prose. Only high-level sanitized summaries, primary mood labels, and action item counts are dispatched after user opt-in validation.

---

## 2. Dirty Dozen Attack Mitigation Matrix

| # | Threat Vector | Risk Level | Architectural Mitigation | Verification Mechanism |
|---|---|---|---|---|
| 1 | **Broken Object Level Auth (BOLA / IDOR)** | Critical | Firestore Security Rules enforce `isOwner(userId)` on all document paths. Backend routes verify `req.user.userId === entry.userId`. | Unit tests in `api.test.ts` & Firestore rule test suite. |
| 2 | **Prompt Injection / Jailbreaks** | High | Strict system instructions, input size bounds (max 50KB), and JSON Schema output enforcement (`responseMimeType: application/json`). | Input validation middleware & schema parsing guards. |
| 3 | **Secret Exposure in Repo/Logs** | Critical | Google Cloud Secret Manager integration; `.gitignore` rules; automated Gitleaks secret scanning in CI. | CI Gitleaks pipeline step. |
| 4 | **Cross-Tenant Data Leakage in Vector DB** | Critical | Cloud SQL pgvector queries filter strictly on `WHERE user_id = :authenticatedUserId`. | MCP Toolbox tenant-scoping unit tests. |
| 5 | **Privilege Escalation** | High | `requireAdminRole` middleware guards `/api/admin/*`. Firestore rules block clients from mutating their own `role` field. | RBAC route tests and audit log alerts. |
| 6 | **PII Exfiltration via Webhooks** | High | `ExternalNotificationDispatcher` redacts raw text and requires explicit boolean trigger flags in `NotificationConfig`. | Notification unit tests. |
| 7 | **DDoS / Large Payload Denial of Service** | Medium | Express body-parser limit capped at 10MB; journal content string length capped at 50,000 chars. | Payload validation middleware tests. |
| 8 | **Cross-Site Scripting (XSS)** | High | React 19 JSX auto-escapes rendered text; dangerous raw HTML is prohibited. | Frontend static type checks. |
| 9 | **Server-Side Request Forgery (SSRF)** | High | Webhook URLs validated against strict `https://` protocol and private IPv4/IPv6 ranges (`127.0.0.1`, `169.254.169.254` blocked). | URL validator in `auth.ts` / `notifications.ts`. |
| 10 | **Insecure Direct Attachment Loading** | Medium | Attachments restricted to verified data URLs / Google Cloud Storage signed URLs with short TTLs. | Image renderer schema tests. |
| 11 | **Tampering with Audit Trails** | Medium | Firestore security rules specify `allow update, delete: if false` on `/audit_logs/{logId}`. | Firestore immutable collection rule check. |
| 12 | **Uncontrolled Model Token Exhaustion** | Medium | Context Optimizer subagent condenses rolling history; hard token limits configured on all Gemini generateContent requests. | `ADKOrchestrator` token budgeting telemetry. |

---

## 3. Google Cloud Run Deployment Security

- **Service Account**: `reflectlogixai-deployer@reflectlogixai.iam.gserviceaccount.com`
- **IAM Roles**:
  - `roles/run.invoker`
  - `roles/secretmanager.secretAccessor`
  - `roles/datastore.user`
  - `roles/aiplatform.user`
- **Workload Identity Provider**: Configured in GitHub Actions to enable keyless OIDC authentication without long-lived JSON service account keys.
