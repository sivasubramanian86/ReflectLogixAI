<#
.SYNOPSIS
  ReflectLogixAI - Firebase Deployment Script (PowerShell)
.DESCRIPTION
  Deploys Firestore Security Rules, Indexes, and Frontend Hosting to project genai-apac-2026-491004
  using official npx -y firebase-tools@latest.
.PARAMETER ProjectId
  Target Firebase / Google Cloud Project ID (default: genai-apac-2026-491004)
.PARAMETER Only
  Target specific components: 'firestore', 'firestore:rules', 'hosting' (default: all)
#>
[CmdletBinding()]
param(
    [string]$ProjectId = "genai-apac-2026-491004",
    [string]$Only = ""
)

$ErrorActionPreference = "Stop"

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  ReflectLogixAI - Firebase Deployer" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Target Project: $ProjectId" -ForegroundColor White

# 1. Build frontend before deploying hosting if needed
if (-not $Only -or $Only -like "*hosting*") {
    Write-Host "`n--> [1/2] Building frontend bundle (dist/)..." -ForegroundColor Yellow
    npm run build
}

# 2. Deploy to Firebase
Write-Host "`n--> [2/2] Deploying to Firebase ($ProjectId)..." -ForegroundColor Yellow

$deployArgs = @("deploy", "--project", $ProjectId)
if ($Only) {
    $deployArgs += @("--only", $Only)
}

npx -y firebase-tools@latest @deployArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=================================================================" -ForegroundColor Cyan
    Write-Host "  FIREBASE DEPLOYMENT SUCCEEDED!" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Cyan
} else {
    Write-Host "`n[ERROR] Firebase deployment failed." -ForegroundColor Red
    exit 1
}
