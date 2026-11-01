import React, { useEffect, useState } from 'react';
import { RoutineExercise } from '../../types/auth';
import { Wind, Activity, Sparkles, Play, Pause } from 'lucide-react';

interface ExerciseMotionCanvasProps {
  exercise: RoutineExercise;
  isPlaying: boolean;
  onTogglePlay: () => void;
  stepNumber: number;
  totalSteps: number;
}

export const ExerciseMotionCanvas: React.FC<ExerciseMotionCanvasProps> = ({
  exercise,
  isPlaying,
  onTogglePlay,
  stepNumber,
  totalSteps,
}) => {
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathProgress, setBreathProgress] = useState(0);

  // Synchronized breathing loop (4s inhale, 2s hold, 6s exhale)
  useEffect(() => {
    if (!isPlaying) return;
    const cycleDuration = 12000; // 12s full breath cycle
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) % cycleDuration;
      const progress = elapsed / cycleDuration;
      setBreathProgress(progress);

      if (elapsed < 4000) {
        setBreathPhase('Inhale');
      } else if (elapsed < 6000) {
        setBreathPhase('Hold');
      } else {
        setBreathPhase('Exhale');
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-stone-900 to-slate-950 p-4 shadow-xl border border-stone-800 text-stone-100 relative overflow-hidden flex flex-col justify-between select-none">
      
      {/* Background Subtle Wave Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

      {/* Top Banner inside Canvas */}
      <div className="flex items-center justify-between text-xs z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            {exercise.category.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-[10px] font-medium backdrop-blur-xs">
          <span>Target:</span>
          <span className="text-emerald-300 font-semibold">{exercise.targetArea}</span>
        </div>
      </div>

      {/* Center Motion Silhouette Canvas */}
      <div className="relative w-full h-52 flex items-center justify-center my-2">
        <svg 
          viewBox="0 0 240 240" 
          className="w-full h-full max-h-52 drop-shadow-md"
          aria-label={`Animation of ${exercise.title}`}
        >
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="lymphFlowGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.9" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* === 1. Base Silhouette Figure === */}
          <g className="transition-transform duration-700">
            
            {/* Head */}
            <circle 
              cx="120" 
              cy={exercise.category === 'drainage' && isPlaying ? "44" : "42"} 
              r="16" 
              fill="#1e293b" 
              stroke="#6ee7b7" 
              strokeWidth="1.5"
              className={exercise.category === 'drainage' && isPlaying ? "animate-pulse" : ""}
            />

            {/* Neck */}
            <path d="M116 58 L124 58 L126 66 L114 66 Z" fill="#1e293b" stroke="#6ee7b7" strokeWidth="1" />

            {/* Torso */}
            <path 
              d={
                exercise.category === 'breathing' && isPlaying
                  ? (breathPhase === 'Inhale' 
                      ? "M104 66 L136 66 L144 116 L134 140 L106 140 L96 116 Z" 
                      : "M106 66 L134 66 L138 116 L132 140 L108 140 L102 116 Z")
                  : "M106 66 L134 66 L140 116 L132 140 L108 140 L100 116 Z"
              } 
              fill="#1e293b" 
              stroke="#6ee7b7" 
              strokeWidth="1.5" 
              className="transition-all duration-700 ease-in-out"
            />

            {/* Left Arm */}
            <path 
              d={
                exercise.category === 'lymphatic_activation' && isPlaying
                  ? "M106 68 Q80 85 82 118"
                  : "M106 68 Q92 90 92 120"
              } 
              stroke="#34d399" 
              strokeWidth="4" 
              strokeLinecap="round" 
              fill="none" 
              className="transition-all duration-500"
            />

            {/* Right Arm */}
            <path 
              d={
                exercise.category === 'lymphatic_activation' && isPlaying
                  ? "M134 68 Q160 85 158 118"
                  : "M134 68 Q148 90 148 120"
              } 
              stroke="#34d399" 
              strokeWidth="4" 
              strokeLinecap="round" 
              fill="none" 
              className="transition-all duration-500"
            />

            {/* Legs */}
            <path d="M112 140 L110 185 L108 214" stroke="#34d399" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M128 140 L130 185 L132 214" stroke="#34d399" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Feet */}
            <path 
              d={
                exercise.category === 'rebound' && isPlaying
                  ? "M108 214 L98 210"
                  : "M108 214 L98 214"
              } 
              stroke="#6ee7b7" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
            <path 
              d={
                exercise.category === 'rebound' && isPlaying
                  ? "M132 214 L142 210"
                  : "M132 214 L142 214"
              } 
              stroke="#6ee7b7" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
          </g>

          {/* === 2. Glowing Lymphatic Pathways & Node Clusters === */}
          
          {/* Central Thoracic Conduit (Cisterna Chyli up to Left Subclavian) */}
          <path 
            d="M120 135 L120 70 L115 67" 
            stroke="#10b981" 
            strokeWidth="2.5" 
            strokeDasharray="4 3" 
            className={isPlaying ? "animate-[dash_1.5s_linear_infinite]" : ""}
            fill="none"
          />

          {/* Cervical Node Clusters (Neck) */}
          <circle cx="114" cy="62" r="3.5" fill="#34d399" filter="url(#glow)" className="animate-pulse" />
          <circle cx="126" cy="62" r="3.5" fill="#34d399" filter="url(#glow)" className="animate-pulse" />

          {/* Collarbone Terminus (Supraclavicular) */}
          <circle cx="112" cy="70" r="4.5" fill="#10b981" filter="url(#glow)" />
          <circle cx="128" cy="70" r="4.5" fill="#10b981" filter="url(#glow)" />

          {/* Axillary Node Clusters (Underarms) */}
          <circle cx="98" cy="78" r="4" fill="#34d399" filter="url(#glow)" className={exercise.category === 'lymphatic_activation' ? 'animate-ping' : ''} />
          <circle cx="142" cy="78" r="4" fill="#34d399" filter="url(#glow)" className={exercise.category === 'lymphatic_activation' ? 'animate-ping' : ''} />

          {/* Inguinal Node Clusters (Groin crease) */}
          <circle cx="112" cy="142" r="4" fill="#10b981" filter="url(#glow)" />
          <circle cx="128" cy="142" r="4" fill="#10b981" filter="url(#glow)" />

          {/* Popliteal Nodes (Back of knees) */}
          <circle cx="110" cy="185" r="3" fill="#34d399" filter="url(#glow)" />
          <circle cx="130" cy="185" r="3" fill="#34d399" filter="url(#glow)" />

          {/* === 3. Exercise-Specific Kinetic Overlays === */}

          {/* BREATHING EXERCISE: Expanding Thoracic Wave */}
          {exercise.category === 'breathing' && isPlaying && (
            <g className="animate-pulse">
              <circle cx="120" cy="100" r={breathPhase === 'Inhale' ? "32" : "22"} fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
              <circle cx="120" cy="100" r={breathPhase === 'Inhale' ? "44" : "28"} fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />
            </g>
          )}

          {/* DRAINAGE EXERCISE: Downward Neck Sweep Arrows */}
          {exercise.category === 'drainage' && (
            <g className="text-emerald-300">
              <path d="M110 52 L110 65 M107 60 L110 65 L113 60" stroke="#6ee7b7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M130 52 L130 65 M127 60 L130 65 L133 60" stroke="#6ee7b7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* REBOUND / ANKLE PUMPS: Upward Fluid Propulsion Arrows */}
          {exercise.category === 'rebound' && (
            <g>
              <path d="M100 205 L100 185 M97 190 L100 185 L103 190" stroke="#6ee7b7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M140 205 L140 185 M137 190 L140 185 L143 190" stroke="#6ee7b7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Floor contact vibration rings */}
              <ellipse cx="108" cy="216" rx="8" ry="2" fill="none" stroke="#34d399" opacity="0.6" />
              <ellipse cx="132" cy="216" rx="8" ry="2" fill="none" stroke="#34d399" opacity="0.6" />
            </g>
          )}

          {/* LYMPHATIC ACTIVATION / ARM SWINGS: Arc motion sweeps */}
          {exercise.category === 'lymphatic_activation' && (
            <g>
              <path d="M80 100 Q86 125 96 130" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
              <path d="M160 100 Q154 125 144 130" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
            </g>
          )}
        </svg>

        {/* Floating Rhythm / Motion Status Chip */}
        <div className="absolute bottom-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30 text-[11px] font-medium text-emerald-300 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Kinetic Lymph Flow • 60s Interval</span>
        </div>
      </div>

      {/* Synchronized Diaphragmatic Breathwork Bar */}
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-between text-xs mt-1">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">Breath Cadence</span>
            <span className="text-xs font-semibold text-white">
              {isPlaying ? `${breathPhase} (${breathPhase === 'Inhale' ? '4s' : breathPhase === 'Hold' ? '2s' : '6s'})` : 'Paused'}
            </span>
          </div>
        </div>

        {/* Breathwork Circle Gauge */}
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-8 h-8 -rotate-90">
              <circle cx="16" cy="16" r="12" fill="none" stroke="#334155" strokeWidth="3" />
              <circle 
                cx="16" 
                cy="16" 
                r="12" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="3" 
                strokeDasharray="75.4"
                strokeDashoffset={75.4 - (75.4 * breathProgress)}
                strokeLinecap="round"
                className="transition-all duration-100"
              />
            </svg>
            <span className="absolute text-[9px] font-bold text-emerald-300">
              {breathPhase.charAt(0)}
            </span>
          </div>

          <button
            type="button"
            onClick={onTogglePlay}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
            aria-label={isPlaying ? "Pause motion animation" : "Play motion animation"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
        </div>
      </div>
    </div>
  );
};
