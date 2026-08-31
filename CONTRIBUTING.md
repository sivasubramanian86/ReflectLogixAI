# Contributing to ReflectLogixAI

Thank you for your interest in contributing to **ReflectLogixAI – Your Multi Purpose Personal Gemini Journal**! We welcome contributions across frontend engineering, ADK multi-agent architecture, accessibility, security, and cloud deployment.

---

## 🛠️ Development Setup

### 1. Fork and Clone
```bash
git clone https://github.com/sivasubramanian86/ReflectLogixAI.git
cd ReflectLogixAI
git checkout -b feature/your-feature-name
```

### 2. Install Dependencies
```bash
# Install Node dependencies
npm install

# Install Python agent dependencies
pip install -r agents/requirements.txt
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```
Provide your `GEMINI_API_KEY` for live AI agent testing.

### 4. Run Development Server
```bash
npm run dev
```

---

## 🧪 Testing & Quality Gates

All contributions must pass automated tests, type checks, and security scans prior to merging:

```bash
# 1. TypeScript compilation & lint check
npm run lint

# 2. Frontend and backend Vitest test suite
npm test

# 3. Python ADK multi-agent Pytest suite
npm run test:agents

# 4. Production bundle build check
npm run build
```

---

## 📐 Engineering & Architecture Standards

1. **Accessibility (WCAG 2.2 AA)**:
   - Ensure all interactive elements include accessible names (`aria-label`, visible text).
   - Use semantic landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`).
   - Validate full keyboard navigability ($Tab$, $Enter$, $Escape$).
2. **Zero-Trust Security**:
   - Never embed secret keys in client bundles.
   - Guard protected routes with `requireAuth` and verify `request.auth.uid == userId`.
   - Prevent SSRF on external URLs and sanitize all outbound webhook payloads.
3. **ADK Agent Modularity**:
   - Subagents must implement discrete input/output interfaces.
   - Enforce bounded token budgets and log telemetry traces.

---

## 🔀 Pull Request Process

1. Ensure your branch is rebased on the latest `main`.
2. Verify all CI checks pass locally (`npm run test:all` and `npm run build`).
3. Fill out the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
4. Maintainers will review your PR and provide actionable feedback.
