# ==============================================================================
# ReflectLogixAI - Local Development Launcher (PowerShell)
# Boots Express backend with unified Vite HMR on http://localhost:3000
# ==============================================================================

Write-Host "Starting ReflectLogixAI Local Development Server..." -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
    }
}

Write-Host "Launching unified server on http://localhost:3000..." -ForegroundColor Green
npm run dev
