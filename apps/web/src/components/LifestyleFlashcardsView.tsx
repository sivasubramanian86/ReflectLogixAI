import React, { useState } from 'react';
import {
  Sparkles,
  Sun,
  Brain,
  Heart,
  Moon,
  Droplet,
  Wind,
  CheckCircle,
  RotateCw,
  Clock,
  Award,
  BookOpen,
  Volume2,
  ChevronRight,
  Filter,
  Flame
} from 'lucide-react';

interface LifestyleCard {
  id: string;
  category: 'morning' | 'deep_work' | 'recovery' | 'stress_reset' | 'vitality';
  title: string;
  tagline: string;
  icon: any;
  durationMinutes: number;
  scientificBenefit: string;
  actionProtocol: string;
  streakCount: number;
  completedToday: boolean;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
}

export const LifestyleFlashcardsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [flashcards, setFlashcards] = useState<LifestyleCard[]>([
    {
      id: 'card_sunlight',
      category: 'morning',
      title: 'Morning Sunlight Viewing',
      tagline: 'Circadian anchor for peak alertness & nocturnal melatonin',
      icon: Sun,
      durationMinutes: 10,
      scientificBenefit: 'Viewing natural sunlight within 30-60 minutes of waking triggers a healthy cortisol pulse and sets an internal clock to release melatonin 14-16 hours later.',
      actionProtocol: 'Step outside (without sunglasses) for 10-15 minutes facing the morning sky. If overcast, extend to 20 minutes.',
      streakCount: 6,
      completedToday: true,
      difficulty: 'Easy'
    },
    {
      id: 'card_ultradian',
      category: 'deep_work',
      title: '90-Min Ultradian Focus Wave',
      tagline: 'Neuro-biological focus pacing for zero cognitive fatigue',
      icon: Brain,
      durationMinutes: 90,
      scientificBenefit: 'Human attention operates in 90-minute ultradian cycles. Pushing past 90 mins without visual defocus produces diminishing returns and mental exhaustion.',
      actionProtocol: 'Set a single high-leverage objective. Turn off all notifications. After 90 minutes, take a 10-minute break looking at distant horizons.',
      streakCount: 4,
      completedToday: false,
      difficulty: 'Moderate'
    },
    {
      id: 'card_physio_sigh',
      category: 'stress_reset',
      title: '2-Minute Physiological Sigh',
      tagline: 'Instant autonomic nervous system calming mechanism',
      icon: Wind,
      durationMinutes: 2,
      scientificBenefit: 'Two rapid inhales through the nose followed by a slow, extended mouth exhale reinflates collapsed lung alveoli and drops heart rate within 30 seconds.',
      actionProtocol: 'Inhale deeply through nose -> top off with another quick sharp inhale -> release a slow, gentle exhale through mouth. Repeat 3-5 cycles.',
      streakCount: 9,
      completedToday: true,
      difficulty: 'Easy'
    },
    {
      id: 'card_digital_sunset',
      category: 'recovery',
      title: '60-Min Digital Sunset',
      tagline: 'Preserve deep sleep stages and memory consolidation',
      icon: Moon,
      durationMinutes: 60,
      scientificBenefit: 'Blue light in the 450-480nm spectrum halts melatonin synthesis. Disconnecting 60 minutes before bedtime increases restorative Stage 4 Deep Sleep by up to 25%.',
      actionProtocol: 'Switch mobile devices to charge outside the bedroom at 9:00 PM. Transition to warm amber lighting, reading physical books, or audio journaling.',
      streakCount: 5,
      completedToday: false,
      difficulty: 'Moderate'
    },
    {
      id: 'card_zone2',
      category: 'vitality',
      title: 'Zone 2 Cardio Pacing',
      tagline: 'Mitochondrial biogenesis & baseline anxiety reduction',
      icon: Flame,
      durationMinutes: 30,
      scientificBenefit: 'Exercising at conversational heart rate (Zone 2) trains cells to oxidize fat efficiently and enhances neuroplasticity through BDNF release.',
      actionProtocol: 'Brisk walk, light jog, or cycle at a pace where you can comfortably speak full sentences without gasping for breath for 30-45 minutes.',
      streakCount: 3,
      completedToday: false,
      difficulty: 'Moderate'
    },
    {
      id: 'card_vagus_reset',
      category: 'stress_reset',
      title: 'Cold-Water Face Immersion',
      tagline: 'Activate the mammalian dive reflex for instant tranquility',
      icon: Droplet,
      durationMinutes: 1,
      scientificBenefit: 'Cold water on ophthalmic/trigeminal facial nerves immediately activates parasympathetic tone, reducing acute panic and slowing pulse by 10-15 bpm.',
      actionProtocol: 'Fill a bowl with cold water (or splash cold tap water generously over face and eyes) for 20-30 seconds while holding breath gently.',
      streakCount: 2,
      completedToday: false,
      difficulty: 'Easy'
    }
  ]);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlashcards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              completedToday: !c.completedToday,
              streakCount: !c.completedToday ? c.streakCount + 1 : Math.max(0, c.streakCount - 1)
            }
          : c
      )
    );
  };

  const filteredCards =
    activeCategory === 'all'
      ? flashcards
      : flashcards.filter((c) => c.category === activeCategory);

  const completedCount = flashcards.filter((c) => c.completedToday).length;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-orange-950/40 backdrop-blur-xl shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Runtime Health & Longevity Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Healthy Lifestyle & Neuroscience Flashcards
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl">
            Actionable, scientifically grounded longevity and mental wellness protocols loaded at runtime. Flip cards to discover the exact neuroscience protocol and track your daily execution streak.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-[var(--bg-secondary)] px-4 py-3 rounded-2xl border border-[var(--border-subtle)]">
          <Award className="h-6 w-6 text-amber-400" />
          <div>
            <div className="text-xs text-[var(--text-muted)]">Habits Completed Today</div>
            <div className="text-lg font-bold text-[var(--text-primary)]">
              {completedCount} of {flashcards.length} Protocols
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Protocols' },
          { id: 'morning', label: '☀️ Morning Anchors' },
          { id: 'deep_work', label: '🧠 Deep Work Pacing' },
          { id: 'stress_reset', label: '🌬️ Rapid Stress Resets' },
          { id: 'recovery', label: '🌙 Recovery & Sleep' },
          { id: 'vitality', label: '🔥 Cellular Vitality' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === tab.id
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Flashcards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => {
          const isFlipped = !!flippedCards[card.id];
          const IconComp = card.icon;

          return (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="glass-card rounded-3xl p-6 border border-white/30 dark:border-white/10 hover:border-amber-500/40 transition-all cursor-pointer min-h-[300px] flex flex-col justify-between group relative overflow-hidden shadow-sm"
            >
              {!isFlipped ? (
                /* Front of Card */
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)] flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{card.durationMinutes} min</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-amber-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-amber-500/90 font-medium">
                      {card.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-2 border-t border-[var(--border-subtle)]">
                    {card.scientificBenefit}
                  </p>
                </div>
              ) : (
                /* Back of Card (Protocol & Execution) */
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span className="flex items-center space-x-1">
                      <Sparkles className="h-4 w-4" />
                      <span>Actionable Protocol</span>
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)] font-normal">Click to flip back</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] leading-relaxed">
                    {card.actionProtocol}
                  </div>

                  <div className="text-[11px] text-[var(--text-muted)] space-y-1">
                    <div className="flex justify-between">
                      <span>Scientific Rigor:</span>
                      <strong className="text-[var(--text-primary)]">Peer Reviewed Neurobiology</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Intensity:</span>
                      <strong className="text-emerald-400">{card.difficulty}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Footer Actions */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-bold">
                  <Flame className="h-4 w-4 fill-amber-400" />
                  <span>{card.streakCount} day streak</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => toggleComplete(card.id, e)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    card.completedToday
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>{card.completedToday ? 'Completed' : 'Mark Done'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
