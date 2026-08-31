"""
Context Optimizer & Semantic Cache Subagent
Compresses historical journals into dense prompt context, eliminating redundant tokens.
"""
from typing import Dict, Any, List

class ContextOptimizerAgent:
    def __init__(self, max_context_tokens: int = 4000):
        self.max_context_tokens = max_context_tokens

    def compress_history(self, history_entries: List[Dict[str, Any]]) -> str:
        """Extracts key themes and mood anchors from past entries."""
        if not history_entries:
            return "No previous history."
        themes = set()
        for e in history_entries[:10]:
            for t in e.get("tags", []):
                themes.add(t)
        return f"Recent Recurring Themes: {', '.join(list(themes)[:5])}"
