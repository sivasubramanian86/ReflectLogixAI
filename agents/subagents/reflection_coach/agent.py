"""
Reflection Coach Subagent
Responsible for Socratic inquiry, cognitive reframing, and resilience reinforcement.
"""
from typing import Dict, Any, List

class ReflectionCoachAgent:
    """
    Subagent that acts as an empathetic Socratic coach.
    Identifies hidden cognitive strengths, suggests positive perspective shifts,
    and asks 2 targeted exploratory questions without unsolicited judgment.
    """
    def __init__(self, model_name: str = "gemini-3.7-flash"):
        self.model_name = model_name

    def generate_socratic_coaching(self, entry_text: str, mood_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generates deep Socratic inquiries and strengths identification."""
        stress = mood_data.get("stressLevel", 3)
        primary_mood = mood_data.get("primaryMood", "Reflective")

        if stress >= 6:
            inquiry = [
                "What boundary or decompression habit protected your focus best today?",
                "If you looked back on this day a month from now, what single lesson would stand out?"
            ]
            strengths = ["Proactive emotional transparency", "Resilience during high context-switching"]
            reframes = ["Recognize that periods of intense problem-solving require deliberate recovery pauses."]
        else:
            inquiry = [
                "What inner signal told you this approach was aligned with your core values?",
                "How can you replicate this calm, deliberate mindset during tomorrow's key tasks?"
            ]
            strengths = ["High metacognitive awareness", "Deep alignment between action and intention"]
            reframes = ["Consistent micro-habits compound into lasting cognitive clarity."]

        return {
            "agent": "ReflectionCoachAgent",
            "coaching_style": "Socratic & Empathetic",
            "primaryMood": primary_mood,
            "cognitiveStrengths": strengths,
            "reframeSuggestions": reframes,
            "inquiry": inquiry
        }
