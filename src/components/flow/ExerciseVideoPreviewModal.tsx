import React, { useRef, useState, useEffect } from 'react';
import { RoutineExercise } from '../../types/auth';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Wind, 
  Info 
} from 'lucide-react';

interface ExerciseVideoPreviewModalProps {
  exercise: RoutineExercise;
  onClose: () => void;
}

export const ExerciseVideoPreviewModal: React.FC<ExerciseVideoPreviewModalProps> = ({
  exercise,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const fallbackVideo = '/assets/aistudio/Deep_Diaphragmatic_Breathing_0a11709d.mp4';
  const videoSrc = exercise.videoUrl || fallbackVideo;
  const hasSpecificVideo = Boolean(exercise.videoUrl);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in"
    >
      <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-stone-200 dark:border-slate-800 flex flex-col overflow-hidden text-stone-900 dark:text-stone-100 max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 flex items-center justify-between border-b border-stone-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 block">
                Proper Execution Guide
              </span>
              <h2 id="video-preview-title" className="text-sm font-semibold truncate max-w-[220px]">
                {exercise.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close video preview"
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Notice if demonstrating primary foundational technique */}
          {!hasSpecificVideo && (
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                Demonstrating core diaphragmatic pump mechanics applicable to all fluid-stimulating exercises.
              </span>
            </div>
          )}

          {/* Video Player Card */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/14] sm:aspect-[9/13] max-h-[340px] flex items-center justify-center shadow-lg group">
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full h-full object-cover"
            />

            {/* Video Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Badge: Exercise Name & Status */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white pointer-events-none">
              <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-semibold border border-white/10 uppercase tracking-wide">
                {exercise.targetArea}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-[10px] font-medium text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Live Form Demo
              </span>
            </div>

            {/* Bottom Floating Playback Controls Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1.5 rounded-xl hover:bg-white/20 transition"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="p-1.5 rounded-xl hover:bg-white/20 transition"
                  aria-label="Restart video"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 mx-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-150"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded-xl hover:bg-white/20 transition"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Form Execution Instructions */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/80 border border-stone-200/80 dark:border-slate-700/80 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Proper Execution Technique
            </h3>
            <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
              {exercise.instructions}
            </p>
          </div>

          {/* Key Form Tips (Checklist) */}
          {exercise.formTips && exercise.formTips.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 space-y-2">
              <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                Key Form Principles:
              </h4>
              <ul className="space-y-1.5">
                {exercise.formTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-stone-700 dark:text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Breathing Cadence Cue */}
          <div className="p-3 rounded-2xl bg-stone-100 dark:bg-slate-800 text-xs flex items-start gap-2 text-stone-600 dark:text-slate-300">
            <Wind className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-800 dark:text-stone-200 block text-[11px]">
                Breathing Cadence:
              </span>
              <span className="text-[11px] leading-relaxed">{exercise.breathingCue}</span>
            </div>
          </div>

          {/* Lymphatic Gentle Touch Reminder */}
          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200/50 dark:border-teal-800/50 text-[11px] text-teal-800 dark:text-teal-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Gentle Lymphatic Pressure:</strong>
              <span>
                Lymphatic vessels are superficial and delicate. Keep touch feather-light (about the weight of a nickel) to avoid flattening the vessel walls.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-100 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-900/50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2"
          >
            <span>Got It • Return to Routine</span>
          </button>
        </div>

      </div>
    </div>
  );
};
