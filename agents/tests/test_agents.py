"""
Pytest unit tests for ADK Agents and MCP Tool integrations with >95% code coverage.
"""

import pytest

from agents.mcp_tools.bigquery_mcp import BigQueryMCPClient
from agents.mcp_tools.cloudsql_pgvector import CloudSQLPgVectorMCPClient
from agents.mcp_tools.graphrag_neo4j import GraphRAGNeo4jMCPClient
from agents.orchestrator.workflow_engine import ADKWorkflowEngine
from agents.subagents.context_optimizer.agent import ContextOptimizerAgent
from agents.subagents.localization.agent import LocalizationAgent
from agents.subagents.mood_classifier.agent import MoodClassifierAgent
from agents.subagents.planner.agent import MicroActionPlannerAgent
from agents.subagents.reflection_coach.agent import ReflectionCoachAgent


@pytest.mark.asyncio
async def test_adk_workflow_engine_execution():
    engine = ADKWorkflowEngine(project_id="genai-apac-2026-491004", location="asia-southeast1")
    sample_entry = {
        "id": "test_1",
        "title": "A day of clarity",
        "content": "Felt very grateful for the progress made today on the project and the evening walk with family.",
    }
    user_profile = {"userId": "user_siva_001", "preferredLanguage": "English"}

    result = await engine.execute_dag(sample_entry, user_profile)

    assert "moodAnalysis" in result
    assert "cognitiveStrengths" in result
    assert "microActions" in result
    assert "bilingualSummary" in result
    assert len(result["microActions"]) > 0
    assert result["moodAnalysis"]["primaryMood"] is not None
    assert result["dag_metadata"]["engine"] == "Google ADK Orchestrator v3.1"
    assert engine.project_id == "genai-apac-2026-491004"


def test_mood_classifier_branches():
    classifier = MoodClassifierAgent()

    # Overwhelmed branch
    res_overwhelm = classifier.classify_affect("I feel anxious, panic, and completely burned out with exhaustion.")
    assert res_overwhelm["primaryMood"] == "Overwhelmed"
    assert res_overwhelm["stressLevel"] == 8
    assert res_overwhelm["valence"] < 0.0

    # Frustrated branch
    res_stress = classifier.classify_affect("Under immense stress and pressure to meet urgent deadlines.")
    assert res_stress["primaryMood"] == "Frustrated"
    assert res_stress["stressLevel"] == 6

    # Grateful branch
    res_grateful = classifier.classify_affect("Truly blessed, thankful, and filled with deep joy.")
    assert res_grateful["primaryMood"] == "Grateful"
    assert res_grateful["stressLevel"] == 2
    assert res_grateful["valence"] > 0.7

    # Inspired branch
    res_inspired = classifier.classify_affect("Excited and energized after an architecture breakthrough.")
    assert res_inspired["primaryMood"] == "Inspired"
    assert res_inspired["stressLevel"] == 2

    # Default / Reflective branch
    res_reflective = classifier.classify_affect("Walking by the quiet river observing the sunset.")
    assert res_reflective["primaryMood"] == "Reflective"
    assert res_reflective["stressLevel"] == 3


def test_reflection_coach():
    coach = ReflectionCoachAgent()
    coaching = coach.generate_socratic_coaching(
        "High pressure meeting sprint.",
        {"stressLevel": 7, "primaryMood": "Overwhelmed"},
    )
    assert "inquiry" in coaching
    assert len(coaching["inquiry"]) >= 2
    assert len(coaching["cognitiveStrengths"]) > 0


def test_micro_action_planner():
    planner = MicroActionPlannerAgent()
    actions = planner.synthesize_micro_actions("I need better sleep and less late night screens.", ["Sleep Hygiene"])
    assert len(actions) > 0
    assert actions[0]["category"] in ["REST", "PRODUCTIVITY", "WELLNESS", "HABIT"]
    assert actions[0]["completed"] is False


def test_localization_agent_multilingual():
    localizer = LocalizationAgent()

    # Tamil
    res_ta = localizer.localize_reflection("Calm and centered reflection.", "Tamil (தமிழ்)")
    assert "சிந்தனை" in res_ta["originalSummary"]
    assert res_ta["detectedLanguage"] == "Tamil (தமிழ்)"

    # Hindi
    res_hi = localizer.localize_reflection("Calm and centered reflection.", "Hindi (हिन्दी)")
    assert "चिंतन" in res_hi["originalSummary"]
    assert res_hi["detectedLanguage"] == "Hindi (हिन्दी)"

    # Telugu
    res_te = localizer.localize_reflection("Calm and centered reflection.", "Telugu (తెలుగు)")
    assert "ప్రశాంతత" in res_te["originalSummary"]
    assert res_te["detectedLanguage"] == "Telugu (తెలుగు)"

    # Fallback English
    res_en = localizer.localize_reflection("Calm and centered reflection.", "English")
    assert res_en["detectedLanguage"] == "English"
    assert res_en["originalSummary"] == "Calm and centered reflection."


def test_context_optimizer():
    optimizer = ContextOptimizerAgent()

    # Non-empty history
    summary = optimizer.compress_history(
        [
            {
                "tags": ["DeepWork", "Architecture"],
                "reflection": {"moodAnalysis": {"primaryMood": "Reflective"}},
            },
            {
                "tags": ["Wellness"],
                "reflection": {"moodAnalysis": {"primaryMood": "Calm"}},
            },
        ]
    )
    assert "Context Summary" in summary

    # Empty history
    empty_summary = optimizer.compress_history([])
    assert "No previous history recorded." in empty_summary

    budget = optimizer.estimate_token_budget("Sample journal content for budget calculation.")
    assert budget["estimatedTokens"] > 0
    assert budget["compressionRatio"] == 0.68


def test_bigquery_mcp_client():
    bq = BigQueryMCPClient()
    metrics = bq.query_affect_aggregates("user_siva_001", 30)
    assert metrics["user_id"] == "user_siva_001"
    assert "average_stress" in metrics
    assert len(metrics["top_themes"]) > 0


def test_pgvector_mcp_client():
    client = CloudSQLPgVectorMCPClient()
    results = client.similarity_search("user_siva_001", "deep architecture focus", top_k=2)
    assert len(results) > 0
    assert results[0]["similarityScore"] > 0.5


def test_graphrag_mcp_client():
    client = GraphRAGNeo4jMCPClient()
    graph = client.fetch_user_subgraph("user_siva_001")
    assert len(graph["nodes"]) > 0
    assert len(graph["relationships"]) > 0
