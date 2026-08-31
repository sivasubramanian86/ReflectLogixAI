@echo off
REM ==============================================================================
REM ReflectLogixAI - Local Verification Script (Windows CMD / Batch)
REM ==============================================================================

echo =================================================================
echo   ReflectLogixAI - Local Verification & Quality Gate
echo =================================================================

echo.
echo [1/4] Running TypeScript Lint ^& Type Check...
call npm run lint
if %errorlevel% neq 0 (
    echo [FAILED] TypeScript Lint Check Failed.
    exit /b %errorlevel%
)

echo.
echo [2/4] Running Vitest Suite (Frontend ^& Backend)...
call npm test
if %errorlevel% neq 0 (
    echo [FAILED] Vitest Suite Failed.
    exit /b %errorlevel%
)

echo.
echo [3/4] Running Python ADK Agent Pytest Suite...
call npm run test:agents
if %errorlevel% neq 0 (
    echo [FAILED] Python Agent Tests Failed.
    exit /b %errorlevel%
)

echo.
echo [4/4] Running Vite ^& Server Production Build...
call npm run build
if %errorlevel% neq 0 (
    echo [FAILED] Build Failed.
    exit /b %errorlevel%
)

echo.
echo =================================================================
echo   ALL VERIFICATION CHECKS PASSED (100% READY FOR CLOUD RUN)
echo =================================================================
exit /b 0
