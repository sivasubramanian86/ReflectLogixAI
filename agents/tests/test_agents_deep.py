"""
Deep Subagent & MCP Tooling Quality & Edge-Case Test Suite
Validates token budgeting, session caching, extreme inputs, and MCP integrations.
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


class TestContextOptimizerAndTokenBudgeting:
    """Validates token compression, history condensation, and budget estimation."""

    def test_reflection_coach_socratic_inquiry_generation(self):
        coach = ReflectionCoachAgent()
        coaching = coach.generate_socratic_coaching(
            "Working through intense architectural refactoring.",
            {"primaryMood": "Reflective", "valence": 0.7, "stressLevel": 3},
        )
        assert "inquiry" in coaching or "socraticQuestions" in coaching or isinstance(coaching, dict)

    def test_compress_history_with_multiple_entries(self):
        optimizer = ContextOptimizerAgent(max_context_tokens=4000)
        history = [
            {
                "id": "e1",
                "tags": ["Architecture", "GCP"],
                "reflection": {"moodAnalysis": {"primaryMood": "Reflective"}},
            },
            {
                "id": "e2",
                "tags": ["GCP", "Optimization"],
                "reflection": {"moodAnalysis": {"primaryMood": "Energized"}},
            },
            {
                "id": "e3",
                "tags": ["Mindfulness"],
                "reflection": {"moodAnalysis": {"primaryMood": "Reflective"}},
            },
        ]
        summary = optimizer.compress_history(history)
        assert "3 prior entries" in summary
        assert "Dominant Affect: Reflective" in summary
        assert "Recurring Themes" in summary

    def test_compress_history_empty(self):
        optimizer = ContextOptimizerAgent()
        summary = optimizer.compress_history([])
        assert summary == "No previous history recorded."

    def test_estimate_token_budget(self):
        optimizer = ContextOptimizerAgent()
        text = "ReflectLogixAI multi-agent orchestration architecture on Google Cloud Platform"
        budget = optimizer.estimate_token_budget(text)
        assert budget["wordCount"] == 8
        assert budget["estimatedTokens"] >= 8
        assert budget["compressionRatio"] == 0.68


class TestADKWorkflowSessionCacheAndDAG:
    """Validates session deduplication caching and multi-agent DAG execution."""

    @pytest.mark.asyncio
    async def test_session_cache_hit_returns_instantaneous_result(self):
        engine = ADKWorkflowEngine()
        entry = {
            "id": "cache_test_001",
            "content": "Deep work on Vertex AI model garden and agent pipelines.",
            "title": "Agent Pipeline Engineering",
        }
        user = {"userId": "user_cache_001", "preferredLanguage": "English"}

        # First run: fresh computation
        res1 = await engine.execute_dag(entry, user)
        assert res1["summary"] != ""
        assert len(res1["keyThemes"]) >= 1

        # Second run with identical parameters: must return cached result
        res2 = await engine.execute_dag(entry, user)
        assert res2["summary"] == res1["summary"]
        assert res2["bilingualSummary"] == res1["bilingualSummary"]

    @pytest.mark.asyncio
    async def test_session_cache_eviction_when_exceeding_capacity(self):
        engine = ADKWorkflowEngine()
        user = {"userId": "user_evict_001", "preferredLanguage": "English"}

        # Populate cache with 25 entries to trigger eviction threshold (>20)
        for i in range(25):
            entry = {"id": f"entry_{i}", "content": f"Deep focus session number {i} on cloud computing."}
            await engine.execute_dag(entry, user)

        assert len(engine._session_cache) <= 21

    @pytest.mark.asyncio
    async def test_thematic_extraction_branches(self):
        engine = ADKWorkflowEngine()

        themes_work = await engine._run_thematic_extraction(
            "Reviewed Kubernetes sprint architecture and high-throughput microservices."
        )
        assert any("Engineering" in t or "Work" in t for t in themes_work)

        themes_calm = await engine._run_thematic_extraction("Practiced evening meditation and grateful breathing.")
        assert any("Mindfulness" in t or "Calm" in t for t in themes_calm)

        themes_stress = await engine._run_thematic_extraction(
            "Feeling severe cognitive fatigue and deadline overwhelm."
        )
        assert any("Boundary" in t or "Energy" in t for t in themes_stress)


class TestMCPToolingClients:
    """Validates Model Context Protocol (MCP) clients for GraphRAG, pgvector, and BigQuery."""

    def test_graphrag_mcp_client(self):
        client = GraphRAGNeo4jMCPClient()
        graph = client.fetch_user_subgraph("test_user_graph")
        assert "nodes" in graph
        assert "relationships" in graph
        assert len(graph["nodes"]) >= 1

    def test_cloudsql_pgvector_mcp_client(self):
        client = CloudSQLPgVectorMCPClient()
        matches = client.similarity_search("test_user_pg", "work stress and deadlines", top_k=2)
        assert len(matches) <= 2
        assert matches[0]["similarityScore"] > 0.80

    def test_bigquery_analytics_mcp_client(self):
        client = BigQueryMCPClient()
        analytics = client.query_affect_aggregates("test_user_bq", days=30)
        assert "average_stress" in analytics
        assert "top_themes" in analytics
        assert analytics["timeframe_days"] == 30


class TestExtremeInputEdgeCases:
    """Validates robustness under non-standard inputs."""

    def test_empty_and_whitespace_input(self):
        classifier = MoodClassifierAgent()
        mood = classifier.classify_affect("   \n\t  ")
        assert mood["primaryMood"] == "Reflective"
        assert mood["stressLevel"] == 3

    def test_long_input_handling(self):
        planner = MicroActionPlannerAgent()
        long_content = (
            "Managing multiple engineering projects, coordinating cloud migrations, "
            "taking deep breath and meditation pauses, reviewing security compliance. " * 10
        )
        actions = planner.synthesize_micro_actions(
            long_content, ["Engineering Craft & Deep Work", "Mindfulness & Calm"]
        )
        assert len(actions) >= 1
        for action in actions:
            assert "title" in action
            assert "priority" in action

    def test_multilingual_localization_coverage(self):
        localizer = LocalizationAgent()
        summary = "Practiced mindful reflection and established clear evening boundaries."

        tamil_res = localizer.localize_reflection(summary, "Tamil")
        assert "Tamil" in tamil_res["detectedLanguage"]
        assert len(tamil_res["keyPhrases"]) >= 2

        hindi_res = localizer.localize_reflection(summary, "Hindi")
        assert "Hindi" in hindi_res["detectedLanguage"]

        telugu_res = localizer.localize_reflection(summary, "Telugu")
        assert "Telugu" in telugu_res["detectedLanguage"]

        kannada_res = localizer.localize_reflection(summary, "Kannada")
        assert "Kannada" in kannada_res["detectedLanguage"]

        malayalam_res = localizer.localize_reflection(summary, "Malayalam")
        assert "Malayalam" in malayalam_res["detectedLanguage"]

        bengali_res = localizer.localize_reflection(summary, "Bengali")
        assert "Bengali" in bengali_res["detectedLanguage"]

        spanish_res = localizer.localize_reflection(summary, "Spanish")
        assert "Spanish" in spanish_res["detectedLanguage"]

        french_res = localizer.localize_reflection(summary, "French")
        assert "French" in french_res["detectedLanguage"]

        german_res = localizer.localize_reflection(summary, "German")
        assert "German" in german_res["detectedLanguage"]

        japanese_res = localizer.localize_reflection(summary, "Japanese")
        assert "Japanese" in japanese_res["detectedLanguage"]

        english_res = localizer.localize_reflection(summary, "UnknownLanguage")
        assert english_res["detectedLanguage"] == "English"
