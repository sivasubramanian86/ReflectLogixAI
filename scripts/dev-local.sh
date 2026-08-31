#!/usr/bin/env bash
# ==============================================================================
# ReflectLogixAI - Local Development Launcher (Bash)
# Boots Express backend with unified Vite HMR on http://localhost:3000
# ==============================================================================

set -eo pipefail

echo "Starting ReflectLogixAI Local Development Server..."

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "Launching unified server on http://localhost:3000..."
npm run dev
