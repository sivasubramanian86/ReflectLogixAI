#!/usr/bin/env bash
# ==============================================================================
# ReflectLogixAI - Local Verification Script (Bash / Linux / macOS)
# Runs Linting, Vitest Suite, Pytest Agent Suite, and Production Build
# ==============================================================================

set -eo pipefail

echo "================================================================="
echo "  ReflectLogixAI - Local Verification & Quality Gate"
echo "================================================================="

echo -e "\n--> [1/4] Running TypeScript Lint & Type Check..."
npm run lint

echo -e "\n--> [2/4] Running Vitest Suite (Frontend & Backend)..."
npm test

echo -e "\n--> [3/4] Running Python ADK Agent Pytest Suite..."
npm run test:agents

echo -e "\n--> [4/4] Running Vite & Server Production Build..."
npm run build

echo -e "\n================================================================="
echo "  ALL VERIFICATION CHECKS PASSED (100% READY FOR CLOUD RUN)"
echo "================================================================="
