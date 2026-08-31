#!/usr/bin/env bash
# ==============================================================================
# ReflectLogixAI - ADK Multi-Agent Test Runner (Bash)
# ==============================================================================

set -eo pipefail

echo "Running ReflectLogixAI ADK Multi-Agent Pytest Suite..."

pytest agents/tests/ -v

echo -e "\n[PASSED] All ADK Multi-Agent & MCP tests passed successfully."
