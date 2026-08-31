# Support & Troubleshooting Guide

Welcome to the **ReflectLogixAI** support portal. Here you can find resources, troubleshooting guidance, and communication channels.

---

## 📚 Documentation Resources

- **System Architecture**: [`docs/architecture/system-architecture.md`](docs/architecture/system-architecture.md)
- **API Contracts**: [`docs/api-contracts/openapi.yaml`](docs/api-contracts/openapi.yaml)
- **UX & User Journeys**: [`docs/ux/user-journeys.md`](docs/ux/user-journeys.md)
- **Security Specification**: [`infra/security_spec.md`](infra/security_spec.md)

---

## ❓ Frequently Asked Questions (FAQ)

### 1. Where do I obtain a Gemini API key?
You can generate an API key via [Google AI Studio](https://aistudio.google.com/). Set it in `.env` as `GEMINI_API_KEY=your_key_here`.

### 2. Can I use ReflectLogixAI offline or in local demo mode?
Yes. When `GEMINI_API_KEY` is not provided or set to mock mode, ReflectLogixAI executes deterministic heuristic coaching and affect classification, enabling seamless local testing and UI exploration.

### 3. How do I deploy to Google Cloud Run?
Execute:
```bash
gcloud run deploy reflectlogixai-journal --source . --region asia-southeast1 --allow-unauthenticated --port 3000
```
Detailed deployment specs are located in [`infra/cloudrun/api-service.yaml`](infra/cloudrun/api-service.yaml).

---

## 🐛 Issue Reporting & Bugs

If you discover a bug or want to propose a new feature:
1. Check existing [GitHub Issues](https://github.com/sivasubramanian86/ReflectLogixAI/issues) to avoid duplicates.
2. Open a new issue using our structured [Bug Report](.github/ISSUE_TEMPLATE/bug_report.yml) or [Feature Request](.github/ISSUE_TEMPLATE/feature_request.yml) template.
3. For security-related concerns, please follow our [Security Policy](SECURITY.md).
