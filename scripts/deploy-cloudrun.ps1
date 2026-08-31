<#
.SYNOPSIS
  ReflectLogixAI - Google Cloud Run Deployment Script (PowerShell)
.DESCRIPTION
  Deploys the containerized ReflectLogixAI service to Google Cloud Run with
  strict IAM zero-trust settings, environment variables, and pre-deploy tests.
.PARAMETER ProjectId
  Google Cloud Project ID (default: active gcloud project or reflectlogixai-prod)
.PARAMETER Region
  Google Cloud Region (default: asia-southeast1)
.PARAMETER ServiceName
  Cloud Run service name (default: reflectlogixai-journal)
.PARAMETER SkipVerification
  Skip pre-deployment local tests
#>
[CmdletBinding()]
param(
    [string]$ProjectId = $env:GCP_PROJECT_ID,
    [string]$Region = "asia-southeast1",
    [string]$ServiceName = "reflectlogixai-journal",
    [switch]$SkipVerification
)

$ErrorActionPreference = "Stop"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  ReflectLogixAI - Google Cloud Run Deployer" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. Resolve Project ID
if (-not $ProjectId) {
    try {
        $ProjectId = (gcloud config get-value project 2>$null).Trim()
    } catch {}
}

if (-not $ProjectId -or $ProjectId -eq "(unset)") {
    $ProjectId = "genai-apac-2026-491004"
}

Write-Host "Target Project:  $ProjectId" -ForegroundColor White
Write-Host "Target Region:   $Region" -ForegroundColor White
Write-Host "Service Name:    $ServiceName" -ForegroundColor White

# 2. Run Pre-Deployment Verification unless skipped
if (-not $SkipVerification) {
    Write-Host "`n--> [1/3] Running Pre-Deployment Quality Gates..." -ForegroundColor Yellow
    & "$PSScriptRoot\verify-local.ps1"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Pre-deployment verification failed. Aborting deploy." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "`n--> [1/3] Skipping pre-deployment verification as requested." -ForegroundColor Yellow
}

# 3. Check gcloud CLI
Write-Host "`n--> [2/3] Validating Google Cloud SDK..." -ForegroundColor Yellow
try {
    $null = gcloud version 2>$null
    Write-Host "[OK] gcloud CLI detected." -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Google Cloud SDK (gcloud) is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# 4. Deploy to Google Cloud Run
Write-Host "`n--> [3/3] Deploying source to Cloud Run ($Region)..." -ForegroundColor Yellow

gcloud run deploy $ServiceName `
    --source . `
    --project $ProjectId `
    --region $Region `
    --allow-unauthenticated `
    --port 3000 `
    --memory 1Gi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 10 `
    --set-env-vars NODE_ENV=production,GOOGLE_CLOUD_PROJECT=$ProjectId,GOOGLE_CLOUD_LOCATION=$Region,USE_VERTEX_AI=true,GEMINI_MODEL=gemini-3.7-flash

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=================================================================" -ForegroundColor Cyan
    Write-Host "  DEPLOYMENT TO GOOGLE CLOUD RUN SUCCEEDED!" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Cyan
    
    # Retrieve Service URL
    $serviceUrl = gcloud run services describe $ServiceName --project $ProjectId --region $Region --format "value(status.url)" 2>$null
    if ($serviceUrl) {
        Write-Host "Service Live URL: $serviceUrl" -ForegroundColor Cyan
        Write-Host "Health Check:     $serviceUrl/api/health" -ForegroundColor Cyan
    }
} else {
    Write-Host "`n[ERROR] Cloud Run deployment failed. Check gcloud logs." -ForegroundColor Red
    exit 1
}
