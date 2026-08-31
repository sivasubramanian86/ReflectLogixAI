#!/usr/bin/env bash
# ==============================================================================
# ReflectLogixAI - Google Cloud Run Deployment Script (Bash)
# ==============================================================================

set -eo pipefail

PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || echo 'reflectlogixai-prod')}"
REGION="${GCP_REGION:-asia-southeast1}"
SERVICE_NAME="${GCP_SERVICE_NAME:-reflectlogixai-journal}"
SKIP_TESTS="${1:-}"

echo "================================================================="
echo "  ReflectLogixAI - Google Cloud Run Deployer"
echo "================================================================="
echo "Target Project:  $PROJECT_ID"
echo "Target Region:   $REGION"
echo "Service Name:    $SERVICE_NAME"

if [ "$SKIP_TESTS" != "--skip-tests" ]; then
    echo -e "\n--> [1/3] Running Pre-Deployment Verification..."
    bash "$(dirname "$0")/verify-local.sh"
else
    echo -e "\n--> [1/3] Skipping pre-deployment verification as requested."
fi

echo -e "\n--> [2/3] Validating Google Cloud SDK..."
gcloud version >/dev/null

echo -e "\n--> [3/3] Deploying source to Google Cloud Run ($REGION)..."
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production,GEMINI_MODEL=gemini-3.7-flash

echo -e "\n================================================================="
echo "  DEPLOYMENT TO GOOGLE CLOUD RUN SUCCEEDED!"
echo "================================================================="

SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" --format "value(status.url)" 2>/dev/null || true)
if [ -n "$SERVICE_URL" ]; then
  echo "Service Live URL: $SERVICE_URL"
  echo "Health Check:     $SERVICE_URL/api/health"
fi
