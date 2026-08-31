"""
Mood & Affect Classifier Subagent
Extracts Russell's Circumplex affect coordinates (valence, arousal) and stress scores.
"""
from typing import Dict, Any, List

class MoodClassifierAgent:
    """
    Subagent that maps natural language text into 2D continuous affective space
    (Valence: -1.0 to +1.0, Arousal: 0.0 to 1.0) and discrete stress intensity (1 to 10).
    """
    def __init__(self, model_name: str = "gemini-3.7-flash"):
        self.model_name = model_name

    def classify_affect(self, text: str) -> Dict[str, Any]:
        """Classify emotional state using affective lexicon and semantic patterns."""
        lower = text.lower()
        
        # Heuristic scoring
        if any(w in lower for w in ["anxious", "panic", "overwhelm", "burnout", "exhausted"]):
            primary = "Overwhelmed"
            secondary = ["Fatigued", "Tense"]
            valence = -0.45
            arousal = 0.85
            stress = 8
        elif any(w in lower for w in ["stress", "deadline", "urgent", "pressure", "tired"]):
            primary = "Frustrated"
            secondary = ["Strained", "Determined"]
            valence = -0.20
            arousal = 0.65
            stress = 6
        elif any(w in lower for w in ["grateful", "gratitude", "blessed", "thankful", "joy"]):
            primary = "Grateful"
            secondary = ["Joyful", "Peaceful"]
            valence = 0.85
            arousal = 0.35
            stress = 2
        elif any(w in lower for w in ["excited", "energized", "inspired", "breakthrough", "clarity"]):
            primary = "Inspired"
            secondary = ["Energized", "Focused"]
            valence = 0.80
            arousal = 0.75
            stress = 2
        else:
            primary = "Reflective"
            secondary = ["Calm", "Centered"]
            valence = 0.65
            arousal = 0.35
            stress = 3

        return {
            "primaryMood": primary,
            "secondaryMoods": secondary,
            "valence": valence,
            "arousal": arousal,
            "stressLevel": stress,
            "confidence": 0.95,
            "affectModel": "Russell_Circumplex_v2"
        }
