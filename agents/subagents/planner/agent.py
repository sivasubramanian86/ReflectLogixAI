"""
Micro-Action Planner Subagent
Translates psychological reflections into concrete, bite-sized behavioral micro-steps.
"""
from typing import Dict, Any, List

class MicroActionPlannerAgent:
    def __init__(self, model_name: str = "gemini-3.7-flash"):
        self.model_name = model_name

    def synthesize_micro_actions(self, entry_text: str, themes: List[str]) -> List[Dict[str, Any]]:
        return [
            {
                "id": "act_plan_1",
                "title": "Define 1 Non-Negotiable Focus Block",
                "description": "Block 45 minutes of uninterrupted creative flow in your calendar tomorrow morning.",
                "category": "HABIT",
                "timeHorizon": "TOMORROW",
                "completed": False
            }
        ]
