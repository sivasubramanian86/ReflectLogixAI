/**
 * Comprehensive Localized Page Content for ReflectLogixAI
 * Supports 18 Languages: en, ta, hi, te, kn, ml, bn, mr, gu, pa, es, fr, de, ja, zh, ar, pt, ru
 */

export interface LocalizedFAQ {
  q: string;
  a: string;
}

export interface LocalizedAbout {
  welcomeTitle: string;
  welcomeDesc: string;
  principles: {
    socraticTitle: string;
    socraticDesc: string;
    mediaTitle: string;
    mediaDesc: string;
    healthTitle: string;
    healthDesc: string;
    privacyTitle: string;
    privacyDesc: string;
  };
  multilingualTitle: string;
  multilingualDesc: string;
}

export interface LocalizedDeepReflections {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchBtn: string;
  searchingBtn: string;
  examplePromptsTitle: string;
  examplePrompts: string[];
  resultsTitle: string;
  matchSuffix: string;
  sampleResults: Array<{
    title: string;
    snippet: string;
    tags: string[];
    date: string;
  }>;
}

export interface LocalizedSampleJournal {
  id: string;
  title: string;
  content: string;
  summary: string;
  socraticQuestions: string[];
  reframeSuggestions: string[];
  cognitiveStrengths: string[];
  keyThemes: string[];
  microActions: Array<{
    title: string;
    description: string;
  }>;
}

export const LOCALIZED_PAGE_DATA: Record<string, {
  faqs: LocalizedFAQ[];
  about: LocalizedAbout;
  rag: LocalizedDeepReflections;
  sampleJournals: Record<string, LocalizedSampleJournal>;
}> = {
  en: {
    faqs: [
      {
        q: "How does the Socratic Reflection Coach work?",
        a: "The Reflection Coach utilizes Google Gemini 3.7 / 2.5 Flash and Google ADK to perform cognitive reframing. Rather than giving unsolicited advice, it poses deep Socratic questions, validates your cognitive strengths, and synthesizes 15-minute actionable micro-steps."
      },
      {
        q: "How does the Media Studio process multi-modal inputs?",
        a: "You can upload sticky notes, handwritten notebook scans, 1-minute voice memos, or video logs. Everything is stored securely in Google Cloud Storage (gs://reflectlogix-media-genai-apac/) and analyzed by Gemini 2.5 Multi-Modal OCR and audio transcription to automatically produce reflective journal entries."
      },
      {
        q: "Is my reflection and health data private and secure?",
        a: "Yes, completely. ReflectLogixAI enforces zero-trust tenant isolation with Cloud Firestore security rules (request.auth.uid == userId). Your data is never shared with third parties or used to train foundation models. You can also enable Detox Mode for ephemeral sessions with zero data retention."
      },
      {
        q: "How does Smart Health & Wearables synchronization work?",
        a: "ReflectLogixAI integrates with Google Health Connect, Apple Health, Samsung Health, and Garmin. It correlates physiological metrics (Resting Heart Rate, HRV, REM/Deep sleep stages, daily steps) with subjective journal emotional valence to identify burnout triggers early."
      },
      {
        q: "How do I interact with Nova Live 3D Voice Assistant?",
        a: "Click the floating Nova assistant orb in the bottom-right corner or the Live Voice button. Nova features dynamic 18-language voice synthesis, real-time waveform visualization, and hands-free spoken journaling."
      },
      {
        q: "Can I journal in languages other than English?",
        a: "Yes! ReflectLogixAI supports 18 languages: English, Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Arabic, French, German, Spanish, Portuguese, Russian, Japanese, and Chinese."
      }
    ],
    about: {
      welcomeTitle: "Welcome to ReflectLogixAI",
      welcomeDesc: "Your Multi-Purpose Personal Gemini Journal & Socratic Life Companion — a calm, zero-trust sanctuary designed to help you pause, reflect with clarity, and navigate life with self-compassion and actionable momentum.",
      principles: {
        socraticTitle: "Socratic Reflection Coaching",
        socraticDesc: "Multi-agent cognitive reframing powered by Gemini 3.7 & 2.5 Flash, identifying cognitive distortions and synthesizing 15-minute high-impact micro-actions.",
        mediaTitle: "Multi-Modal Media Studio",
        mediaDesc: "Seamlessly capture Sticky Notes, Handwritten journal scans, 1-Minute voice memos, and video reflection logs stored securely in Google Cloud Storage.",
        healthTitle: "Smart Wearable Biometrics",
        healthDesc: "Correlate daily journal valence with resting heart rate, HRV, deep sleep stages, and step counts via Health Connect, Samsung Health, Apple HealthKit, and Garmin.",
        privacyTitle: "Zero-Trust Privacy & Cloud Run",
        privacyDesc: "User-isolated Firestore security rules, Google Cloud Secret Manager vaulting, and ephemeral Detox Mode ensure total personal data sovereignty."
      },
      multilingualTitle: "18-Language Internationalization",
      multilingualDesc: "ReflectLogixAI provides native conversational and reflective capabilities across Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Arabic, French, German, Spanish, Portuguese, Russian, Japanese, Chinese, and English."
    },
    rag: {
      title: "Deep Reflections • Semantic Memory RAG",
      subtitle: "Query your historical reflections via Cloud SQL pgvector cosine similarity to surface past breakthroughs and emotional insights.",
      searchPlaceholder: "Search thoughts, tags, themes or questions...",
      searchBtn: "Search History",
      searchingBtn: "Searching Memories...",
      examplePromptsTitle: "Example Inquiry Prompts",
      examplePrompts: [
        "What moments brought me the most calm and clarity recently?",
        "How did I handle stress or burnout during busy weeks?",
        "What goals or personal habits did I celebrate achieving?",
        "What are the recurring themes in my thoughts about growth?"
      ],
      resultsTitle: "Retrieved Memory Results",
      matchSuffix: "match",
      sampleResults: [
        {
          title: "Reflections on Sustainable Pacing",
          snippet: "Taking intentional morning pauses transformed how I handled high workload demands with calm focus.",
          tags: ["Mindfulness", "Work", "Calm"],
          date: "Yesterday"
        },
        {
          title: "Evening Walk & Cognitive Rest",
          snippet: "Disconnecting from screens after dinner brought immediate mental relief and restorative sleep.",
          tags: ["Health", "Rest", "Habits"],
          date: "3 days ago"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "Dawn Reflections on Systems Architecture and Deep Work",
        content: `Today began with crisp morning stillness. I spent the first hour sketching the ADK agent orchestration graph for the new Cloud Run deployment.
Taking thirty seconds to pause, breathe, and ground myself before jumping into complex distributed systems logic made a world of difference.
Goal for this evening: disconnect completely by 9 PM to preserve restorative sleep cycles.`,
        summary: "Balanced morning combining systems architecture design with mindful pacing and an explicit sleep hygiene boundary.",
        socraticQuestions: [
          "What physical cues tell you your bandwidth is fragmenting before it impacts your mood?",
          "How can you replicate this calm dawn environment on high-intensity sprint days?"
        ],
        reframeSuggestions: ["Acknowledge that strategic pauses accelerate system velocity rather than slowing you down."],
        cognitiveStrengths: ["High metacognitive awareness", "Proactive boundary setting for recovery"],
        keyThemes: ["Mindful Resilience", "Architecture Pacing", "Sleep Hygiene"],
        microActions: [
          { title: "9:00 PM Screen Shutdown", description: "Transition devices to charging station away from bedside." },
          { title: "Morning 5-Min Breathwork", description: "Perform 4-7-8 grounding breaths before checking email inbox." }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "10,480 Steps Morning Clarity Walk in Nature",
        content: `Completed a brisk 10,480 steps walk through the park at sunrise.
Breathing in fresh air, noticing the bird calls, and feeling gratitude for good health.
Key realization: Slowing down intentionally actually speeds up long-term architectural clarity.`,
        summary: "Energizing sunrise walk with 10k steps and a pivotal mindset reframe on sustainable velocity.",
        socraticQuestions: [
          "How does physical movement change the way you approach complex engineering roadblocks?",
          "What is one small way to protect this morning walking ritual every single day?"
        ],
        reframeSuggestions: ["Anchor this post-walk mental clarity as your creative springboard for architecture."],
        cognitiveStrengths: ["Physical-mental integration", "Appreciation for restorative habits"],
        keyThemes: ["Physical Vitality", "Morning Clarity", "10k Steps"],
        microActions: [
          { title: "Hydrate & Electrolytes", description: "Drink 500ml water with electrolytes after morning walk." }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "Important Meeting Reminder: APAC Cloud Architecture Review at 11:00 AM",
        content: `Voice Note Reflection: Remind me about the upcoming APAC Cloud Architecture Review meeting at 11:00 AM today with the engineering leads.
Key agenda points to highlight: zero-trust Cloud KMS envelope encryption, ADK multi-agent orchestration concurrency, and keeping our 94/100 team peace index score steady.`,
        summary: "Proactive preparation for 11:00 AM APAC Cloud Architecture Review with focus on zero-trust KMS and multi-agent concurrency.",
        socraticQuestions: [
          "What key outcome will make the 11 AM architecture review a resounding success?",
          "How can you ensure the team leaves the meeting feeling energized rather than drained?"
        ],
        reframeSuggestions: ["Lead the architecture review with calm confidence — your zero-trust design is rock-solid."],
        cognitiveStrengths: ["Proactive agenda setting", "Holistic view of engineering excellence and team well-being"],
        keyThemes: ["Cloud Architecture", "Zero-Trust Security", "Leadership Alignment"],
        microActions: [
          { title: "Review KMS Architecture Slides", description: "Double-check Cloud KMS key rotation policy before 11 AM." }
        ]
      }
    }
  },

  ta: {
    faqs: [
      {
        q: "சாக்ரடிக் சுய சிந்தனை பயிற்சியாளர் (Socratic Coach) எவ்வாறு செயல்படுகிறது?",
        a: "ஜெமினி 3.7 / 2.5 ஃப்ளாஷ் மற்றும் கூகுள் ஏஜென்ட் டெவலப்மென்ட் கிட் (ADK) ஆகியவற்றைப் பயன்படுத்தி மன அழுத்தங்களை ஆழமான சாக்ரடிக் கேள்விகளாக மாற்றி, 15 நிமிட நடைமுறை செயல்முறைகளை உருவாக்குகிறது."
      },
      {
        q: "மீடியா ஸ்டுடியோ பல்வேறு உள்ளீடுகளை எவ்வாறு கையாள்கிறது?",
        a: "ஸ்டிக்கி நோட்ஸ், கையால் எழுதப்பட்ட குறிப்புகள், குரல் பதிவுகள் மற்றும் வீடியோக்களை கூகுள் கிளவுட் ஸ்டோரேஜில் (GCS) சேமித்து, ஜெமினி மல்டி-மோடல் மூலம் தானாகவே நாட்குறிப்பாக மாற்றுகிறது."
      },
      {
        q: "எனது பதிவுகள் மற்றும் உடல்நலத் தகவல்கள் பாதுகாப்பானவையா?",
        a: "ஆம், முற்றிலும். ஜீரோ-டிரஸ்ட் கிளஸ்டர் பாதுகாப்பு விதிகள் மூலம் உங்கள் கணக்கிற்கு மட்டுமே தனிமைப்படுத்தப்படுகிறது. உங்கள் தகவல்கள் பொது மாடல்களுக்குப் பயன்படுத்தப்படாது."
      },
      {
        q: "ஸ்மார்ட் வாட்ச் மற்றும் ஹெல்த் டிராக்கர் எவ்வாறு இணைகிறது?",
        a: "கூகுள் ஹெல்த் கனெக்ட், சாம்சங் ஹெல்த், ஆப்பிள் ஹெல்த் மற்றும் கார்மின் சாதனங்களுடன் இணைந்து இதயத் துடிப்பு, HRV மற்றும் தூக்க நிலைகளை மன நலத்துடன் ஒப்பிடுகிறது."
      },
      {
        q: "நோவா (Nova) 3D லைவ் வாய்ஸ் உதவியாளருடன் எவ்வாறு பேசுவது?",
        a: "கீழ் வலது மூலையில் உள்ள நோவா உருண்டையை அழுத்துவதன் மூலம் தமிழில் நிகழ்நேர குரல் உரையாடலைத் தொடங்கி சிந்தனைகளைப் பதிவு செய்யலாம்."
      },
      {
        q: "பிற மொழிகளில் நான் எழுதலாமா?",
        a: "ஆம்! தமிழ், இந்தி, தெலுங்கு, கன்னடம், மலையாளம் மற்றும் உலகளாவிய 18+ மொழிகளை ரெஃப்ளெக்ட்லாஜிக்ஸ் ஆதரிக்கிறது."
      }
    ],
    about: {
      welcomeTitle: "ReflectLogixAI-க்கு நல்வரவு",
      welcomeDesc: "ஜெமினி மற்றும் சாக்ரடிக் பயிற்சியாளருடன் கூடிய உங்களின் பல்நோக்கு தனிப்பட்ட நாட்குறிப்பு — மன அமைதியுடன் சிந்திக்கவும், வாழ்க்கையை நல்வழியில் வழிநடத்தவும் அமைக்கப்பட்ட பாதுகாப்பான தளம்.",
      principles: {
        socraticTitle: "சாக்ரடிக் சிந்தனைப் பயிற்சி",
        socraticDesc: "ஜெமினி 3.7 மூலம் சிந்தனைத் தடைகளை நீக்கி, சுய இரக்கத்தையும் 15 நிமிட நுண்ணிய செயல்களையும் உருவாக்குகிறது.",
        mediaTitle: "பல்வகை ஊடக ஸ்டுடியோ",
        mediaDesc: "கையால் எழுதப்பட்ட தாள்கள், குரல் குறிப்புகள் மற்றும் வீடியோக்களை கூகுள் கிளவுட் ஸ்டோரேஜில் எளிதாகச் சேமிக்கிறது.",
        healthTitle: "ஸ்மார்ட் பயோமெட்ரிக் ஆரோக்கியம்",
        healthDesc: "இதயத் துடிப்பு, HRV, ஆழ்ந்த தூக்கம் மற்றும் நடைப் படிகளை மன அமைதியுடன் தொடர்புபடுத்துகிறது.",
        privacyTitle: "ஜீரோ-டிரஸ்ட் முழுத் தனிமைப் பாதுகாப்பு",
        privacyDesc: "ஃபயர்ஸ்டோர் பயனர் தனிமைப்படுத்தல், சீக்ரெட் மேனேஜர் மற்றும் டெடாக்ஸ் பயன்முறை மூலம் முழுப் பாதுகாப்பு."
      },
      multilingualTitle: "18 மொழிகள் சர்வதேச ஆதரவு",
      multilingualDesc: "தமிழ், இந்தி, தெலுங்கு, கன்னடம், மலையாளம், பெங்காலி, மராத்தி, குஜராத்தி, பஞ்சாபி, அரபு, பிரெஞ்சு, ஜெர்மன், ஸ்பானிஷ், போர்த்துகீசியம், ரஷியன், ஜப்பானிய, சீன மற்றும் ஆங்கில மொழிகளை ஆதரிக்கிறது."
    },
    rag: {
      title: "ஆழ்ந்த சிந்தனைகள் • நினைவகத் தேடல் (RAG)",
      subtitle: "Cloud SQL pgvector வெக்டர் தேடல் மூலம் உங்கள் முந்தைய நாட்குறிப்புகளிலிருந்து ஞானத்தையும் தீர்வுகளையும் கண்டறியுங்கள்.",
      searchPlaceholder: "சிந்தனைகள், தலைப்புகள் அல்லது கேள்விகளைத் தேடுங்கள்...",
      searchBtn: "நினைவகத்தில் தேடு",
      searchingBtn: "தேடுகிறது...",
      examplePromptsTitle: "உதாரண வினவல்கள்",
      examplePrompts: [
        "சமீபத்தில் எனக்கு அதிக மன அமைதியைத் தந்த தருணங்கள் எவை?",
        "அதிக பணிச்சுமையின் போது மன அழுத்தத்தை எவ்வாறு சமாளித்தேன்?",
        "நான் சாதித்த நல்ல பழக்கங்கள் மற்றும் இலக்குகள் என்ன?",
        "என் வளர்ச்சியில் மீண்டும் மீண்டும் வரும் முக்கிய சிந்தனைகள் எவை?"
      ],
      resultsTitle: "மீட்டெடுக்கப்பட்ட நினைவுகள்",
      matchSuffix: "பொருத்தம்",
      sampleResults: [
        {
          title: "நிலையான வேகம் பற்றிய சிந்தனை",
          snippet: "காலையில் அமைதியான இடைவெளிகளை எடுத்தது அதிக பணிச்சுமையை அமைதியுடன் கையாள உதவியது.",
          tags: ["மனஅமைதி", "வேலை", "கவனம்"],
          date: "நேற்று"
        },
        {
          title: "மாலை நடைபயிற்சி & மன ஓய்வு",
          snippet: "இரவு உணவுக்குப் பிறகு திரைகளிலிருந்து விலகியது சிறந்த தூக்கத்தையும் மன நிம்மதியையும் தந்தது.",
          tags: ["உடல்நலம்", "ஓய்வு", "பழக்கம்"],
          date: "3 நாட்களுக்கு முன்"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "அமைதியான விடியல் மற்றும் கணினி கட்டமைப்பு சிந்தனைகள்",
        content: `இன்று காலை புதிய கிளவுட் ரன் வரிசைப்படுத்தலுக்கான ADK ஏஜென்ட் வரைபடத்தை வடிவமைத்தேன்.
சிக்கலான விநியோகிக்கப்பட்ட கணினி தருக்கங்களில் மூழ்குவதற்கு முன், சிறிது நேரம் மூச்சை கவனித்து அமைதியாக இருந்தது பெரும் மாற்றத்தை ஏற்படுத்தியது.
இன்றைய இலக்கு: ஆழ்ந்த தூக்கத்தைப் பாதுகாக்க இரவு 9 மணிக்குள் திரைகளை அணைப்பது.`,
        summary: "கணினி வடிவமைப்புடன் கூடிய அமைதியான காலை நேரம் மற்றும் தூக்கத்தைப் பாதுகாக்கும் நல்ல பழக்கம்.",
        socraticQuestions: [
          "உங்கள் ஆற்றல் குறைவதை முன்கூட்டியே உணர்த்தும் உடல் அறிகுறிகள் எவை?",
          "அதிக வேலை உள்ள நாட்களிலும் இந்த அமைதியான விடியல் சூழலை எவ்வாறு உருவாக்குவது?"
        ],
        reframeSuggestions: ["திட்டமிட்ட இடைவெளிகள் உங்கள் வேகத்தைக் குறைக்காமல், நீண்டகால செயல்திறனை அதிகரிக்கும்."],
        cognitiveStrengths: ["உயர் சுய விழிப்புணர்வு", "ஆற்றல் மீட்பிற்கான தெளிவான எல்லைகள்"],
        keyThemes: ["மன அமைதி", "கணினி கட்டமைப்பு", "தூக்க ஒழுங்கு"],
        microActions: [
          { title: "இரவு 9:00 மணி திரை நிறுத்தம்", description: "மொபைல் சாதனங்களை படுக்கையறையிலிருந்து தள்ளி சார்ஜிங் பகுதிக்கு மாற்றவும்." },
          { title: "காலை 5 நிமிட மூச்சுப் பயிற்சி", description: "மின்னஞ்சல் பார்க்கும் முன் 4-7-8 ஆழமான மூச்சுப் பயிற்சி செய்யவும்." }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "இயற்கையில் 10,480 படிகள் காலை நடைப்பயிற்சி",
        content: `சூரிய உதயத்தின் போது பூங்காவில் 10,480 படிகள் விறுவிறுப்பான நடைப்பயிற்சியை முடித்தேன்.
புதிய காற்றை சுவாசித்து, பறவைகளின் ஒலியைக் கேட்டு, நல்ல ஆரோக்கியத்திற்காக நன்றி உணர்ந்தேன்.
முக்கிய உணர்தல்: வேண்டுமென்றே வேகத்தைக் குறைப்பது நீண்டகால தெளிவை விரைவுபடுத்துகிறது.`,
        summary: "10,480 படிகள் நடைபயிற்சியுடன் புத்துணர்ச்சியூட்டும் சூரிய உதயம் மற்றும் நிலையான வேகம் பற்றிய தெளிவு.",
        socraticQuestions: [
          "உடற்பயிற்சி உங்கள் சிக்கலான பொறியியல் சவால்களை அணுகும் முறையை எவ்வாறு மாற்றுகிறது?",
          "இந்த காலை நடைப்பயிற்சி பழக்கத்தை தினமும் பாதுகாக்க ஒரு எளிய வழி என்ன?"
        ],
        reframeSuggestions: ["நடைப்பயிற்சி தரும் மனத்தெளிவை உங்கள் படைப்பாற்றலின் அடித்தளமாகப் பயன்படுத்துங்கள்."],
        cognitiveStrengths: ["உடல்-மன ஒருங்கிணைப்பு", "ஓய்வு தரும் பழக்கங்களை மதித்தல்"],
        keyThemes: ["உடல் நலம்", "காலைத் தெளிவு", "10k படிகள்"],
        microActions: [
          { title: "நீர்ச்சத்து & எலக்ட்ரோலைட்ஸ்", description: "நடைப்பயிற்சிக்குப் பிறகு 500 மி.லி தண்ணீர் குடிக்கவும்." }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "முக்கிய கூட்ட நினைவூட்டல்: காலை 11:00 மணிக்கு கிளவுட் ஆர்க்கிடெக்சர் மீட்டிங்",
        content: `குரல் குறிப்பு: இன்று காலை 11:00 மணிக்கு பொறியியல் தலைவர்களுடன் நடைபெறவுள்ள APAC கிளவுட் ஆர்க்கிடெக்சர் மதிப்பாய்வுக் கூட்டத்தை நினைவூட்டவும்.
முக்கியக் குறிப்புகள்: ஜீரோ-டிரஸ்ட் Cloud KMS குறியாக்கம், ADK மல்டி-ஏஜென்ட் ஒருங்கிணைப்பு, மற்றும் அணியின் 94/100 அமைதி குறியீட்டைப் பராமரித்தல்.`,
        summary: "காலை 11:00 மணி கிளவுட் மதிப்பாய்வுக் கூட்டத்திற்கான முன் தயாரிப்பு மற்றும் ஜீரோ-டிரஸ்ட் பாதுகாப்பு திட்டமிடல்.",
        socraticQuestions: [
          "இந்த 11 மணி கூட்டத்தை வெற்றிகரமானதாக மாற்றும் முக்கிய முடிவு எது?",
          "கூட்டத்திற்குப் பின் அணியினர் சோர்வடையாமல் புத்துணர்ச்சி பெற நீங்கள் என்ன செய்யலாம்?"
        ],
        reframeSuggestions: ["முழு தன்னம்பிக்கையுடன் வழிநடத்துங்கள் — உங்கள் ஜீரோ-டிரஸ்ட் கட்டமைப்பு மிகவும் உறுதியானது."],
        cognitiveStrengths: ["முன்முயற்சி திட்டமிடல்", "பொறியியல் சிறப்பையும் அணியின் நல்வாழ்வையும் இணைத்தல்"],
        keyThemes: ["கிளவுட் கட்டமைப்பு", "ஜீரோ-டிரஸ்ட் பாதுகாப்பு", "தலைமைத்துவம்"],
        microActions: [
          { title: "KMS ஸ்லைடுகளை மதிப்பாய்வு செய்", description: "11 மணிக்கு முன் Cloud KMS சுழற்சி கொள்கையை உறுதிப்படுத்தவும்." }
        ]
      }
    }
  },

  hi: {
    faqs: [
      {
        q: "सुकराती रिफ्लेक्शन कोच (Socratic Coach) कैसे काम करता है?",
        a: "यह गूगल जेमिनी 3.7 और ADK का उपयोग करके विचारों का संज्ञानात्मक पुनर्गठन करता है और 15 मिनट के व्यावहारिक माइक्रो-एक्शन बनाता है।"
      },
      {
        q: "मीडिया स्टूडियो मल्टी-मॉडल इनपुट कैसे प्रोसेस करता है?",
        a: "स्टिक नोट्स, हस्तलिखित पन्ने, वॉयस नोट्स और वीडियो गूगल क्लाउड स्टोरेज में सुरक्षित रूप से सेव होकर जेमिनी द्वारा विश्लेषित होते हैं।"
      },
      {
        q: "क्या मेरी डायरी और स्वास्थ्य डेटा सुरक्षित है?",
        a: "हाँ, पूरी तरह। जीरो-ट्रस्ट फायरस्टोर सुरक्षा नियमों के साथ आपका डेटा केवल आपके लिए पृथक रहता है।"
      },
      {
        q: "स्मार्ट वॉच और हेल्थ कनेक्ट कैसे काम करता है?",
        a: "गूगल हेल्थ, सैमसंग हेल्थ और ऐप्पल हेल्थ के साथ सिंक करके हृदय गति, नींद और कदमों को मानसिक शांति से जोड़ता है।"
      },
      {
        q: "नोवा 3D लाइव वॉयस असिस्टेंट से कैसे बात करें?",
        a: "नीचे दाईं ओर नोवा बटन पर क्लिक करें और हिंदी में स्वाभाविक आवाज से संवाद करें।"
      },
      {
        q: "क्या मैं अन्य भाषाओं में जर्नल लिख सकता हूँ?",
        a: "हाँ! हिंदी, तमिल, तेलुगु, कन्नड़, मराठी, बंगाली और 18+ वैश्विक भाषाओं का पूर्ण समर्थन उपलब्ध है।"
      }
    ],
    about: {
      welcomeTitle: "ReflectLogixAI में आपका स्वागत है",
      welcomeDesc: "जेमिनी और सुकराती कोच के साथ आपकी बहुउद्देश्यीय व्यक्तिगत डायरी — मानसिक शांति और जीवन की स्पष्टता का सुरक्षित स्थान।",
      principles: {
        socraticTitle: "सुकराती चिंतन और कोचिंग",
        socraticDesc: "जेमिनी 3.7 द्वारा संचालित संज्ञानात्मक स्पष्टता और 15 मिनट के व्यावहारिक कदम।",
        mediaTitle: "मल्टी-मॉडल मीडिया स्टूडियो",
        mediaDesc: "हस्तलिखित नोट्स, आवाज और वीडियो को क्लाउड स्टोरेज में आसानी से रिकॉर्ड करें।",
        healthTitle: "स्मार्ट वियरेबल्स बायोमेट्रिक्स",
        healthDesc: "हृदय गति, HRV और नींद के चरणों को मानसिक स्वास्थ्य से जोड़ें।",
        privacyTitle: "जीरो-ट्रस्ट गोपनीयता और सुरक्षा",
        privacyDesc: "क्लाउड रन और फायरस्टोर आइसोलेशन द्वारा पूर्ण डेटा संप्रभुता।"
      },
      multilingualTitle: "18 भाषाओं में पूर्ण समर्थन",
      multilingualDesc: "हिंदी, तमिल, तेलुगु, कन्नड़, बंगाली, मराठी, गुजराती, पंजाबी, फ्रेंच, जर्मन, जापानी आदि।"
    },
    rag: {
      title: "गहन चिंतन • स्मृति खोज (Semantic RAG)",
      subtitle: "Cloud SQL pgvector द्वारा अपने पिछले जर्नल्स से अंतर्दृष्टि और समाधान खोजें।",
      searchPlaceholder: "विचार, विषय या प्रश्न खोजें...",
      searchBtn: "इतिहास में खोजें",
      searchingBtn: "खोज जारी है...",
      examplePromptsTitle: "उदाहरण प्रश्न",
      examplePrompts: [
        "हाल ही में किन पलों ने मुझे सबसे अधिक शांति और स्पष्टता दी?",
        "व्यस्त दिनों में मैंने तनाव को कैसे संभाला?",
        "मैंने किन अच्छी आदतों और लक्ष्यों को हासिल किया?",
        "मेरे विकास से जुड़े मुख्य विषय कौन से हैं?"
      ],
      resultsTitle: "प्राप्त स्मृतियाँ",
      matchSuffix: "समानता",
      sampleResults: [
        {
          title: "स्थिर गति पर चिंतन",
          snippet: "सुबह के शांत पलों ने दिनभर के तनाव को सहजता से संभालने में मदद की।",
          tags: ["शांति", "काम", "एकाग्रता"],
          date: "कल"
        },
        {
          title: "शाम की सैर और मानसिक विश्राम",
          snippet: "स्क्रीन से दूरी बनाने से अच्छी नींद और मानसिक सुकून मिला।",
          tags: ["स्वास्थ्य", "विश्राम", "आदतें"],
          date: "3 दिन पहले"
        }
      ]
    },
    sampleJournals: {
      entry_001: {
        id: "entry_001",
        title: "शांत सुबह और सिस्टम आर्किटेक्चर चिंतन",
        content: `आज सुबह क्लाउड रन डिप्लॉयमेंट के लिए ADK एजेंट ग्राफ तैयार किया।
जटिल सिस्टम लॉजिक शुरू करने से पहले गहरी सांस लेकर शांत होना बहुत मददगार साबित हुआ।
शाम का लक्ष्य: रात 9 बजे तक स्क्रीन बंद करना ताकि गहरी नींद मिल सके।`,
        summary: "सिस्टम डिजाइन और माइंडफुलनेस का संतुलित संगम तथा नींद का अनुशासन।",
        socraticQuestions: [
          "तनाव बढ़ने से पहले आपके शरीर के कौन से संकेत आपको सतर्क करते हैं?",
          "व्यस्त दिनों में भी आप इस शांत सुबह के वातावरण को कैसे बनाए रख सकते हैं?"
        ],
        reframeSuggestions: ["रणनीतिक विराम आपकी गति को कम नहीं करते, बल्कि दीर्घकालिक स्पष्टता बढ़ाते हैं।"],
        cognitiveStrengths: ["उत्कृष्ट आत्म-जागरूकता", "रिकवरी के लिए सक्रिय सीमाएं"],
        keyThemes: ["मानसिक शांति", "आर्किटेक्चर", "नींद का अनुशासन"],
        microActions: [
          { title: "रात 9:00 बजे स्क्रीन बंद", description: "फोन को बिस्तर से दूर चार्जिंग पर रखें।" },
          { title: "सुबह 5 मिनट प्राणायाम", description: "ईमेल देखने से पहले 4-7-8 गहरी सांस लें।" }
        ]
      },
      entry_002: {
        id: "entry_002",
        title: "प्रकृति में 10,480 कदम सुबह की सैर",
        content: `सूर्योदय के समय पार्क में 10,480 कदमों की ताज़ा सैर पूरी की।
ताज़ी हवा, पक्षियों की चहचहाहट और अच्छे स्वास्थ्य के लिए आभार महसूस हुआ।
मुख्य सीख: जानबूझकर गति धीमी करना दीर्घकालिक स्पष्टता को तेज़ करता है।`,
        summary: "10k कदमों की सैर के साथ ऊर्जावान सूर्योदय और सतत गति की स्पष्टता।",
        socraticQuestions: [
          "शारीरिक गतिशीलता आपकी जटिल समस्याओं को हल करने के तरीके को कैसे बदलती है?",
          "इस सुबह की सैर की आदत को हर दिन सुरक्षित रखने का एक आसान तरीका क्या है?"
        ],
        reframeSuggestions: ["सैर से मिली मानसिक स्पष्टता को अपने रचनात्मक कार्य का आधार बनाएं।"],
        cognitiveStrengths: ["शारीरिक-मानसिक संतुलन", "विश्रामकारी आदतों का सम्मान"],
        keyThemes: ["शारीरिक स्वास्थ्य", "सुबह की स्पष्टता", "10k कदम"],
        microActions: [
          { title: "हाइड्रेशन और इलेक्ट्रोलाइट्स", description: "सैर के बाद 500 मिली पानी पिएं।" }
        ]
      },
      entry_003: {
        id: "entry_003",
        title: "महत्वपूर्ण बैठक: सुबह 11:00 बजे क्लाउड आर्किटेक्चर समीक्षा",
        content: `वॉयस नोट: आज सुबह 11:00 बजे इंजीनियरिंग लीड्स के साथ APAC क्लाउड आर्किटेक्चर समीक्षा बैठक याद दिलाएं।
मुख्य बिंदु: जीरो-ट्रस्ट KMS एन्क्रिप्शन, ADK मल्टी-एजेंट समवर्ती निष्पादन, और टीम के 94/100 शांति स्कोर को बनाए रखना।`,
        summary: "11 बजे की बैठक की सक्रिय तैयारी और जीरो-ट्रस्ट सुरक्षा योजना।",
        socraticQuestions: [
          "इस 11 बजे की बैठक को सफल बनाने वाला सबसे महत्वपूर्ण परिणाम क्या होगा?",
          "आप कैसे सुनिश्चित करेंगे कि टीम बैठक के बाद ऊर्जावान महसूस करे?"
        ],
        reframeSuggestions: ["पूरे आत्मविश्वास से नेतृत्व करें — आपकी जीरो-ट्रस्ट डिजाइन अत्यंत मजबूत है।"],
        cognitiveStrengths: ["सक्रिय योजना", "उत्कृष्ट इंजीनियरिंग और टीम कल्याण का समन्वय"],
        keyThemes: ["क्लाउड आर्किटेक्चर", "जीरो-ट्रस्ट सुरक्षा", "नेतृत्व"],
        microActions: [
          { title: "KMS स्लाइड्स की समीक्षा", description: "11 बजे से पहले Cloud KMS नीतियों की जांच करें।" }
        ]
      }
    }
  }
};

/**
 * Fallback generator for languages not explicitly defined above
 */
export function getLocalizedPageContent(langCode: string) {
  const code = (langCode || 'en').toLowerCase().split('-')[0];
  if (LOCALIZED_PAGE_DATA[code]) {
    return LOCALIZED_PAGE_DATA[code];
  }
  return LOCALIZED_PAGE_DATA.en;
}
