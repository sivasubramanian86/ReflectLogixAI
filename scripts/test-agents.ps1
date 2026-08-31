# ==============================================================================
# ReflectLogixAI - ADK Multi-Agent Test Runner (PowerShell)
# ==============================================================================

Write-Host "Running ReflectLogixAI ADK Multi-Agent Pytest Suite..." -ForegroundColor Cyan

python -m pytest agents/tests/ -v

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[PASSED] All 9 ADK Multi-Agent & MCP tests passed successfully." -ForegroundColor Green
} else {
    Write-Host "`n[FAILED] Python agent tests failed." -ForegroundColor Red
    exit 1
}
