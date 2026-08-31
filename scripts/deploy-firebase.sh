#!/usr/bin/env bash
# ==============================================================================
# ReflectLogixAI - Firebase Deployment Script (Bash)
# ==============================================================================

set -eo pipefail

PROJECT_ID="${1:-genai-apac-2026-491004}"
ONLY_TARGET="${2:-}"

echo "================================================================="
echo "  ReflectLogixAI - Firebase Deployer"
echo "================================================================="
echo "Target Project: $PROJECT_ID"

if [ -z "$ONLY_TARGET" ] || [[ "$ONLY_TARGET" == *"hosting"* ]]; then
    echo -e "\n--> [1/2] Building frontend bundle (dist/)..."
    npm run build
fi

echo -e "\n--> [2/2] Deploying to Firebase ($PROJECT_ID)..."

if [ -n "$ONLY_TARGET" ]; then
    npx -y firebase-tools@latest deploy --project "$PROJECT_ID" --only "$ONLY_TARGET"
else
    npx -y firebase-tools@latest deploy --project "$PROJECT_ID"
fi

echo -e "\n================================================================="
echo "  FIREBASE DEPLOYMENT SUCCEEDED!"
echo "================================================================="
