# Security Policy

ReflectLogixAI adheres to strict zero-trust security principles, least-privilege access, and confidential data handling standards on **Google Cloud Platform**.

---

## 1. Supported Versions

| Version | Supported | Maintenance Status |
| :--- | :---: | :--- |
| **3.1.x** (Current) | :white_check_mark: | Active Security Patches & Cloud Run Deployments |
| 3.0.x | :white_check_mark: | Critical Fixes Only |
| < 3.0 | :x: | Deprecated |

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability or potential threat in ReflectLogixAI:

1. **Do NOT disclose publicly** via public GitHub Issues, discussions, or social channels.
2. Email the maintainer directly at **`kailasamsiva@gmail.com`** with the subject `[SECURITY ISSUE] ReflectLogixAI`.
3. Provide a detailed reproduction report containing:
   - Affected endpoint, component, or file path.
   - Proof of concept (PoC) or reproduction steps.
   - Impact assessment (e.g. tenant isolation bypass, privilege escalation, secret leak).
4. Our team will acknowledge receipt within **24 hours** and provide a remediation timeline within **72 hours**.

---

## 3. Threat Model & Security Specification

For our complete **Zero-Trust Architecture** and **Dirty Dozen Attack Vector Mitigation Matrix**, refer to:
👉 [`infra/security_spec.md`](infra/security_spec.md)

### Key Architectural Safeguards:
- **Tenant Isolation**: Direct Firestore collection security rules enforcing `request.auth.uid == userId`.
- **Google Cloud Secret Manager**: Credentials (`GEMINI_API_KEY`, Webhooks) never touch client bundles.
- **SSRF Protection**: Strict URL and IP validation blocking access to `169.254.169.254` and private internal networks.
- **Detox Mode**: Zero-retention ephemeral processing for confidential entries.
- **Automated Gitleaks & SAST**: Continuous security auditing on every commit and pull request.
