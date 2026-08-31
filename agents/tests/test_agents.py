"""
Pytest unit tests for ADK Agents and MCP Tool integrations.
"""
import pytest
import asyncio
from agents.orchestrator.workflow_engine import ADKWorkflowEngine
from agents.subagents.mood_classifier.agent import MoodClassifierAgent
from agents.subagents.reflection_coach.agent import ReflectionCoachAgent
from agents.subagents.planner.agent import MicroActionPlannerAgent
from agents.subagents.localization.agent import LocalizationAgent
from agents.subagents.context_optimizer.agent import ContextOptimizerAgent
from agents.mcp_tools.bigquery_mcp import BigQueryMCPClient
from agents.mcp_tools.cloudsql_pgvector import CloudSQLPgVectorMCPClient
from agents.mcp_tools.graphrag_neo4j import GraphRAGNeo4jMCPClient

@pytest.mark.asyncio
async def test_adk_workflow_engine_execution():
    engine = ADKWorkflowEngine()
    sample_entry = {
        "id": "test_1",
        "title": "A day of clarity",
        "content": "Felt very grateful for the progress made today on the project and the evening walk with family."
    }
    user_profile = {
        "userId": "user_test_123",
        "preferredLanguage": "English"
    }

    result = await engine.execute_dag(sample_entry, user_profile)

    assert "moodAnalysis" in result
    assert "cognitiveStrengths" in result
    assert "microActions" in result
    assert "bilingualSummary" in result
    assert len(result["microActions"]) > 0
    assert result["moodAnalysis"]["primaryMood"] is not None
    assert result["dag_metadata"]["engine"] == "Google ADK Orchestrator v3.1"

def test_mood_classifier():
    classifier = MoodClassifierAgent()
    affect = classifier.classify_affect("I feel calm, grounded, and ready for the day ahead.")
    assert affect["valence"] >= 0.0
    assert 1 <= affect["stressLevel"] <= 10
    assert affect["primaryMood"] in ["Calm", "Reflective", "Grateful", "Inspired"]

def test_reflection_coach():
    coach = ReflectionCoachAgent()
    coaching = coach.generate_socratic_coaching("High pressure meeting sprint.", {"stressLevel": 7, "primaryMood": "Overwhelmed"})
    assert "inquiry" in coaching
    assert len(coaching["inquiry"]) >= 2
    assert len(coaching["cognitiveStrengths"]) > 0

def test_micro_action_planner():
    planner = MicroActionPlannerAgent()
    actions = planner.synthesize_micro_actions("I need better sleep and less late night screens.", ["Sleep Hygiene"])
    assert len(actions) > 0
    assert actions[0]["category"] in ["REST", "PRODUCTIVITY", "WELLNESS", "HABIT"]
    assert actions[0]["completed"] is False

def test_localization_agent():
    localizer = LocalizationAgent()
    res = localizer.localize_reflection("Calm and centered reflection.", "Tamil (தமிழ்)")
    assert "detectedLanguage" in res
    assert len(res["keyPhrases"]) > 0

def test_context_optimizer():
    optimizer = ContextOptimizerAgent()
    summary = optimizer.compress_history([
        {"tags": ["DeepWork", "Architecture"], "reflection": {"moodAnalysis": {"primaryMood": "Reflective"}}}
    ])
    assert "Context Summary" in summary
    budget = optimizer.estimate_token_budget("Sample journal content for budget calculation.")
    assert budget["estimatedTokens"] > 0

def test_bigquery_mcp_client():
    bq = BigQueryMCPClient()
    metrics = bq.query_affect_aggregates("user_123", 30)
    assert metrics["user_id"] == "user_123"
    assert "average_stress" in metrics
    assert len(metrics["top_themes"]) > 0

def test_pgvector_mcp_client():
    client = CloudSQLPgVectorMCPClient()
    results = client.similarity_search("user_123", "deep architecture focus", top_k=2)
    assert len(results) > 0
    assert results[0]["similarityScore"] > 0.5

def test_graphrag_mcp_client():
    client = GraphRAGNeo4jMCPClient()
    graph = client.fetch_user_subgraph("user_123")
    assert len(graph["nodes"]) > 0
    assert len(graph["relationships"]) > 0
