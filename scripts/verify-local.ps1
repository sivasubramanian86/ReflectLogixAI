# ==============================================================================
# ReflectLogixAI - Local Verification Script (PowerShell)
# Runs Linting, Vitest Suite, Pytest Agent Suite, and Production Build
# ==============================================================================

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  ReflectLogixAI - Local Verification & Quality Gate" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"
$global:FailedSteps = 0

function Run-Step($StepName, $Command) {
    Write-Host "`n--> [$StepName] Running: $Command" -ForegroundColor Yellow
    $startTime = Get-Date
    try {
        Invoke-Expression $Command
        $elapsed = ((Get-Date) - $startTime).TotalSeconds
        Write-Host "[PASSED] $StepName (Completed in $($elapsed.ToString('F2'))s)" -ForegroundColor Green
    }
    catch {
        Write-Host "[FAILED] $StepName" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        $global:FailedSteps++
    }
}

# Step 1: Type Checking & Linting
Run-Step "TypeScript Type Check" "npm run lint"

# Step 2: Frontend & Backend Vitest Tests
Run-Step "Vitest Suite (Frontend & Backend)" "npm test"

# Step 3: Python ADK Multi-Agent Tests
Run-Step "Python ADK Agent Pytest Suite" "npm run test:agents"

# Step 4: Production Bundle Build
Run-Step "Vite SPA & Server Production Build" "npm run build"

Write-Host "`n=================================================================" -ForegroundColor Cyan
if ($global:FailedSteps -eq 0) {
    Write-Host "  ALL VERIFICATION CHECKS PASSED (100% READY FOR CLOUD RUN)" -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "  $($global:FailedSteps) CHECK(S) FAILED. Please review output above." -ForegroundColor Red
    Write-Host "=================================================================" -ForegroundColor Cyan
    exit 1
}
