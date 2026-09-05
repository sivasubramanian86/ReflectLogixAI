"""
Micro-Action Planner Subagent
Translates psychological reflections into concrete, bite-sized behavioral micro-steps.
"""
from typing import Dict, Any, List
import time

class MicroActionPlannerAgent:
    """
    Subagent that decomposes introspective insights into 2-3 SMART behavioral micro-actions.
    Tags actions with timeframe, priority, and category (wellness, productivity, rest, habit).
    """
    def __init__(self, model_name: str = "gemini-2.5-flash"):
        self.model_name = model_name

    def synthesize_micro_actions(self, entry_text: str, themes: List[str]) -> List[Dict[str, Any]]:
        """Formulates actionable micro-habits based on discovered themes and entry text."""
        actions = []
        lower = entry_text.lower()
        now_ts = int(time.time() * 1000)

        if any(w in lower for w in ["sleep", "tired", "rest", "fatigue", "night"]):
            actions.append({
                "id": f"act_{now_ts}_1",
                "title": "Evening Digital Sunset",
                "description": "Place devices on charger away from bed 30 minutes before sleep.",
                "category": "REST",
                "timeHorizon": "TODAY",
                "priority": "HIGH",
                "estimatedMinutes": 30,
                "completed": False
            })

        if any(w in lower for w in ["meeting", "focus", "work", "sprint", "distraction"]):
            actions.append({
                "id": f"act_{now_ts}_2",
                "title": "Set 25-Minute Focus Sprint",
                "description": "Block one Pomodoro sprint tomorrow morning with zero notifications.",
                "category": "PRODUCTIVITY",
                "timeHorizon": "TOMORROW",
                "priority": "HIGH",
                "estimatedMinutes": 25,
                "completed": False
            })

        # Default foundational wellness habit
        actions.append({
            "id": f"act_{now_ts}_3",
            "title": "2-Minute Mindful Breathing Pause",
            "description": "Take 4 cycles of box breathing (4s in, 4s hold, 4s out, 4s hold) before lunch.",
            "category": "WELLNESS",
            "timeHorizon": "TODAY",
            "priority": "MEDIUM",
            "estimatedMinutes": 2,
            "completed": False
        })

        return actions[:3]
