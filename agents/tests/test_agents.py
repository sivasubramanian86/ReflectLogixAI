"""
Pytest unit tests for ADK Agents and MCP Tool integrations.
"""
import pytest
import asyncio
from agents.orchestrator.workflow_engine import ADKWorkflowEngine
from agents.subagents.mood_classifier.agent import MoodClassifierAgent
from agents.subagents.reflection_coach.agent import ReflectionCoachAgent
from agents.mcp_tools.bigquery_mcp import BigQueryMCPClient

@pytest.mark.asyncio
async def test_adk_workflow_engine_execution():
    engine = ADKWorkflowEngine()
    sample_entry = {
        "id": "test_1",
        "title": "A day of clarity",
        "content": "Felt very grateful for the progress made today on the project."
    }
    user_profile = {
        "userId": "user_test_123",
        "preferredLanguage": "English"
    }

    result = await engine.execute_dag(sample_entry, user_profile)

    assert "moodAnalysis" in result
    assert "cognitiveStrengths" in result
    assert "microActions" in result
    assert len(result["microActions"]) > 0
    assert result["moodAnalysis"]["primaryMood"] is not None

def test_mood_classifier():
    classifier = MoodClassifierAgent()
    affect = classifier.classify_affect("I feel calm and ready for the day ahead.")
    assert affect["valence"] >= 0.0
    assert affect["stressLevel"] <= 10

def test_bigquery_mcp_client():
    bq = BigQueryMCPClient()
    metrics = bq.query_affect_aggregates("user_123", 30)
    assert metrics["user_id"] == "user_123"
    assert "average_stress" in metrics
