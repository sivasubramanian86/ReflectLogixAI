# Security Policy

ReflectLogixAI adheres to strict zero-trust security principles and confidential data handling standards.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 3.1.x   | :white_check_mark: |
| 3.0.x   | :white_check_mark: |
| < 3.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in ReflectLogixAI:

1. **Do NOT disclose publicly** via GitHub Issues or discussions.
2. Email the core security team at `security@reflectlogixai.internal` or reach out to the project administrator directly.
3. Include detailed steps to reproduce, affected endpoints/components, and potential impact assessment.

### Security Guarantees & Dirty Dozen Mitigations
- **Zero-Trust Firestore Rules**: Direct tenancy enforcement via `request.auth.uid`.
- **Google Cloud Secret Manager**: Production secrets are never stored in plain text or client bundles.
- **Detox Mode**: Ephemeral in-memory execution with zero data retention for highly private reflection entries.
