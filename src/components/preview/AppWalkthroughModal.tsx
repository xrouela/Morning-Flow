import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Sunrise, 
  Activity, 
  Flame, 
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface AppWalkthroughModalProps {
  onDismiss: () => void;
}

export const AppWalkthroughModal: React.FC<AppWalkthroughModalProps> = ({ onDismiss }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      badge: 'Welcome to Morning Flow',
      title: 'Your 30-Day Morning Movement Plan',
      description: 'Follow a different guided sequence each day. Each full session has 10 one-minute exercises and takes about 10 minutes.',
      icon: <Sunrise className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
      features: [
        '30 distinct daily exercise sequences',
        'Beginner (Days 1–10), Intermediate (11–20), Advanced (21–30)',
        'Choose a shorter option when you need one; it counts toward completion and unlocks the next day when there is one',
      ],
      previewGraphic: 'levels',
    },
    {
      badge: 'Progressive Daily Plan',
      title: 'Build Up at Your Own Pace',
      description: 'The program progresses through three phases. Complete each day to unlock the next, and repeat completed days whenever you like.',
      icon: <Activity className="w-8 h-8 text-teal-600 dark:text-teal-400" />,
      features: [
        'Days 1–10: Beginner',
        'Days 11–20: Intermediate',
        'Days 21–30: Advanced',
        'Locked days can be previewed; complete the current day to unlock the next',
      ],
      previewGraphic: 'levels',
    },
    {
      badge: 'Guided Movement',
      title: 'Follow Each Exercise',
      description: 'Work through each daily sequence with a one-minute timer, clear instructions, breathing cues, and form tips where available.',
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      features: [
        'One-minute timer for each exercise',
        'Pause and resume your session',
        'Stop or take a break whenever you need',
      ],
      previewGraphic: 'motion',
    },
    {
      badge: 'Daily Habit Momentum',
      title: 'Track Your Program Progress',
      description: 'Save a day after you finish its routine, then review completed days and your current streak in History.',
      icon: <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />,
      features: [
        'Unlock the next day after completing your current day',
        'Review completed days and weekly progress',
        'Progress is saved on this device',
      ],
      previewGraphic: 'streaks',
    },
  ];

  const slide = slides[currentSlide];

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="walkthrough-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in"
    >
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[36px] shadow-2xl border border-stone-200 dark:border-slate-800 flex flex-col overflow-hidden text-stone-900 dark:text-stone-100 max-h-[740px]">
        
        {/* Top Header with Skip */}
        <div className="p-4 pb-2 flex items-center justify-between border-b border-stone-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              App Preview & Tour
            </span>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            aria-label="Skip walkthrough"
            className="text-xs font-semibold text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 px-2.5 py-1 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 transition"
          >
            Skip
          </button>
        </div>

        {/* Slide Content */}
        <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto space-y-4">
          
          {/* Visual Showcase Box */}
          <div className="w-full h-44 rounded-3xl bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-950 p-4 relative overflow-hidden flex flex-col items-center justify-center shadow-inner text-white text-center">
            
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 bg-radial from-emerald-500/20 via-transparent to-transparent opacity-60 pointer-events-none" />

            {slide.previewGraphic === 'lymph_nodes' && (
              <div className="relative flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-2 animate-pulse">
                  <Sunrise className="w-8 h-8 text-emerald-300" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-emerald-200/90 font-medium">
                  <span className="px-2 py-0.5 rounded-full bg-white/10">Cervical</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10">Thoracic Duct</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10">Venous Terminus</span>
                </div>
              </div>
            )}

            {slide.previewGraphic === 'levels' && (
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-xs px-2 text-stone-300">
                  <span><strong className="text-emerald-400">30-Day Program</strong></span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">10 min each</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-medium">
                  <div className="p-2 rounded-xl bg-emerald-600/40 border border-emerald-400/30">Days 1–10<br />Beginner</div>
                  <div className="p-2 rounded-xl bg-teal-600/40 border border-teal-400/30">Days 11–20<br />Intermediate</div>
                  <div className="p-2 rounded-xl bg-amber-600/40 border border-amber-400/30">Days 21–30<br />Advanced</div>
                </div>
                <p className="text-[10px] text-stone-300 pt-1">A different sequence for each day</p>
              </div>
            )}

            {slide.previewGraphic === 'motion' && (
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping" />
                  <div className="w-14 h-14 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center">
                    <Activity className="w-7 h-7 text-emerald-300 animate-bounce" />
                  </div>
                </div>
                <div className="text-[11px] text-emerald-300 font-medium mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Guided Exercise Timer</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] text-stone-200">60 Seconds</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] text-stone-200">Clear Instructions</span>
                </div>
              </div>
            )}

            {slide.previewGraphic === 'streaks' && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 mb-1.5 text-amber-400 font-bold text-xl">
                  <Flame className="w-6 h-6 fill-amber-400" />
                  <span>Program Progress</span>
                </div>
                <p className="text-[11px] text-stone-300">
                  Completed days and streaks
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} className="w-5 h-5 rounded-full bg-emerald-500/80 text-[9px] flex items-center justify-center font-bold">
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Slide Text Content */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {slide.badge}
            </span>
            <h2 id="walkthrough-title" className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 leading-tight">
              {slide.title}
            </h2>
            <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
              {slide.description}
            </p>

            {/* Feature Bullet Points */}
            <ul className="space-y-1.5 pt-1">
              {slide.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-stone-700 dark:text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Carousel Pagination & CTA Buttons */}
        <div className="p-4 bg-stone-50/80 dark:bg-slate-800/80 border-t border-stone-100 dark:border-slate-800 space-y-3">
          
          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSlide 
                    ? 'w-6 bg-emerald-600' 
                    : 'w-1.5 bg-stone-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2.5">
            {currentSlide > 0 ? (
              <button
                type="button"
                onClick={() => setCurrentSlide((c) => c - 1)}
                className="py-2.5 px-3 rounded-2xl border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700 text-xs font-semibold text-stone-600 dark:text-slate-300 flex items-center gap-1 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
            ) : null}

            {currentSlide < slides.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentSlide((c) => c + 1)}
                className="flex-1 py-3 px-4 rounded-2xl border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <span>Next Feature</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}

            {/* Primary "Get Started" CTA */}
            <button
              type="button"
              onClick={onDismiss}
              className="flex-1 min-h-[44px] py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
