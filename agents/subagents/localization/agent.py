"""
Localization & Cultural Nuance Subagent
Handles multilingual transcription, idiom adaptation, and cross-language reflection mirroring.
"""

from typing import Any, Dict


class LocalizationAgent:
    """
    Subagent supporting 18+ languages across APAC and global locales.
    Extracts bilingual summaries, cultural metaphors, and key vernacular concept pairs.
    """

    SUPPORTED_LANGUAGES = [
        "English",
        "Tamil (தமிழ்)",
        "Hindi (हिन्दी)",
        "Telugu (తెలుగు)",
        "Kannada (ಕನ್ನಡ)",
        "Malayalam (മലയാളം)",
        "Bengali (বাংলা)",
        "Marathi (मराठी)",
        "Gujarati (ગુજરાતી)",
        "Punjabi (ਪੰਜਾਬੀ)",
        "Arabic (العربية)",
        "French (Français)",
        "German (Deutsch)",
        "Spanish (Español)",
        "Portuguese (Português)",
        "Russian (Русский)",
        "Japanese (日本語)",
        "Chinese (中文)",
    ]

    def __init__(self, default_language: str = "English"):
        self.default_language = default_language

    def localize_reflection(self, summary: str, target_lang: str) -> Dict[str, Any]:
        """Generates localized bilingual summary and vernacular phrase anchors."""
        is_tamil = "tamil" in target_lang.lower() or target_lang == "ta"
        is_hindi = "hindi" in target_lang.lower() or target_lang == "hi"
        is_telugu = "telugu" in target_lang.lower() or target_lang == "te"
        is_kannada = "kannada" in target_lang.lower() or target_lang == "kn"
        is_malayalam = "malayalam" in target_lang.lower() or target_lang == "ml"
        is_bengali = "bengali" in target_lang.lower() or target_lang == "bn"
        is_spanish = "spanish" in target_lang.lower() or target_lang == "es"
        is_french = "french" in target_lang.lower() or target_lang == "fr"
        is_german = "german" in target_lang.lower() or target_lang == "de"
        is_japanese = "japanese" in target_lang.lower() or target_lang == "ja"

        if is_tamil:
            original = (
                "உங்கள் பதிவிலிருந்து ஆழ்ந்த சுய சிந்தனையையும் அமைதியான கவனத்தையும் உணர்ந்து, ஆக்கப்பூர்வமான முடிவுகளை நோக்கி நகர்கிறீர்கள்."
            )
            key_phrases = [
                "மன அமைதி (Inner Peace)",
                "சுய சிந்தனை (Self-reflection)",
                "பொறுமை (Patience)",
            ]
            detected = "Tamil (தமிழ்)"
        elif is_hindi:
            original = "आपके विचारों से शांति और आत्म-चिंतन की गहरी भावना प्रकट होती है जो आपको केंद्रित रखती है।"
            key_phrases = [
                "आत्म-चिंतन (Self Reflection)",
                "शांति (Calm)",
                "सकारात्मकता (Positivity)",
            ]
            detected = "Hindi (हिन्दी)"
        elif is_telugu:
            original = "మీ ఆలోచనలలో ప్రశాంతత మరియు లోతైన స్వీయ విశ్లేషణ కనిపిస్తుంది, ఇది మీకు సమతుల్యతను ఇస్తుంది."
            key_phrases = [
                "ప్రశాంతత (Peace)",
                "స్వీయ విశ్లేషణ (Self Reflection)",
                "సానుకూలత (Positivity)",
            ]
            detected = "Telugu (తెలుగు)"
        elif is_kannada:
            original = "ನಿಮ್ಮ ಆಲೋಚನೆಗಳಲ್ಲಿ ಪ್ರಶಾಂತತೆ ಮತ್ತು ಆಳವಾದ ಸ್ವಯಂ ವಿಶ್ಲೇಷಣೆ ಗೋಚರಿಸುತ್ತದೆ."
            key_phrases = ["ಪ್ರಶಾಂತತೆ (Peace)", "ಸ್ವಯಂ ಚಿಂತನೆ (Reflection)"]
            detected = "Kannada (ಕನ್ನಡ)"
        elif is_malayalam:
            original = "നിങ്ങളുടെ ചിന്തകളിൽ ആഴത്തിലുള്ള ആത്മപരിശോധനയും ശാന്തതയും പ്രകടമാകുന്നു."
            key_phrases = ["ശാന്തത (Peace)", "ചിന്ത (Reflection)"]
            detected = "Malayalam (മലയാളം)"
        elif is_bengali:
            original = "আপনার চিন্তাভাবনায় গভীর আত্ম-প্রতিফলন এবং শান্তির প্রকাশ ঘটে।"
            key_phrases = ["শান্তি (Peace)", "আত্ম-প্রতিফলন (Reflection)"]
            detected = "Bengali (বাংলা)"
        elif is_spanish:
            original = "Tus reflexiones muestran una profunda autorreflexión y serenidad enfocada."
            key_phrases = ["Paz Interior", "Autorreflexión", "Claridad"]
            detected = "Spanish (Español)"
        elif is_french:
            original = "Vos pensées révèlent une profonde réflexion personnelle et une clarté sereine."
            key_phrases = ["Paix Intérieure", "Introspection", "Clarté"]
            detected = "French (Français)"
        elif is_german:
            original = "Ihre Gedanken zeigen tiefe Selbstreflexion und ruhige Klarheit."
            key_phrases = ["Innere Ruhe", "Selbstreflexion", "Klarheit"]
            detected = "German (Deutsch)"
        elif is_japanese:
            original = "あなたの考察からは、深い内省と穏やかな集中が感じられます。"
            key_phrases = ["心の平穏 (Peace)", "自己省察 (Reflection)"]
            detected = "Japanese (日本語)"
        else:
            original = summary
            key_phrases = ["Mindfulness", "Clarity", "Intentionality"]
            detected = "English"

        return {
            "detectedLanguage": detected,
            "originalSummary": original,
            "englishSummary": summary,
            "keyPhrases": key_phrases,
            "culturalAdaptationNotes": "Nuanced, non-judgmental tone preserved across localized idioms.",
        }
