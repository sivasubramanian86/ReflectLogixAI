# ReflectLogixAI: Security Specification & Threat Model

This document outlines the Zero-Trust security architecture and Dirty Dozen mitigation matrix for ReflectLogixAI on Google Cloud Run with Firestore.

## Data Invariants
1. **Tenant Isolation**: Every Firestore query verifies `request.auth.uid == userId`.
2. **Server-Side Secrets**: All Gemini API keys, Slack tokens, and Cloud SQL credentials reside in Google Cloud Secret Manager.
3. **Immutable Auditing**: Administrative mutations log append-only records with SHA-256 integrity.
4. **Detox Mode**: Zero retention processing for sensitive psychological reflections.
