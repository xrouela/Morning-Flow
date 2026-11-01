import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoutineExercise } from '../../types/auth';
import { 
  Wind, 
  Activity, 
  Play, 
  Pause, 
  Info, 
  Sparkles, 
  Video, 
  Eye, 
  Volume2, 
  VolumeX, 
  Maximize2 
} from 'lucide-react';
import { ExerciseVideoPreviewModal } from './ExerciseVideoPreviewModal';

interface ExerciseVisualizerProps {
  exercise: RoutineExercise;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  stepNumber?: number;
  totalSteps?: number;
  onOpenVideoModal?: () => void;
}

export const ExerciseVisualizer: React.FC<ExerciseVisualizerProps> = ({
  exercise,
  isPlaying = true,
  onTogglePlay,
  stepNumber = 1,
  totalSteps = 5,
  onOpenVideoModal,
}) => {
  const [showNodeLabels, setShowNodeLabels] = useState(false);
  const [viewMode, setViewMode] = useState<'flow_map' | 'video'>('flow_map');
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fallbackVideo = '/assets/aistudio/Deep_Diaphragmatic_Breathing_0a11709d.mp4';
  const videoSrc = exercise.videoUrl || fallbackVideo;
  const hasSpecificVideo = Boolean(exercise.videoUrl);

  // Sync video play/pause with parent isPlaying state when in video view
  useEffect(() => {
    if (viewMode === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, viewMode]);

  // Lymphatic node definitions with anatomical coordinates on 260x280 viewBox
  const lymphNodes = [
    { id: 'cervical-l', name: 'Left Cervical', x: 118, y: 64, area: 'Neck drainage' },
    { id: 'cervical-r', name: 'Right Cervical', x: 142, y: 64, area: 'Neck drainage' },
    { id: 'terminus-l', name: 'Left Terminus', x: 114, y: 78, area: 'Subclavian trunk' },
    { id: 'terminus-r', name: 'Right Terminus', x: 146, y: 78, area: 'Right lymphatic duct' },
    { id: 'axillary-l', name: 'Left Axillary', x: 96, y: 92, area: 'Underarm cluster' },
    { id: 'axillary-r', name: 'Right Axillary', x: 164, y: 92, area: 'Underarm cluster' },
    { id: 'cisterna', name: 'Cisterna Chyli', x: 130, y: 132, area: 'Central reservoir' },
    { id: 'inguinal-l', name: 'Left Inguinal', x: 116, y: 160, area: 'Groin crease' },
    { id: 'inguinal-r', name: 'Right Inguinal', x: 144, y: 160, area: 'Groin crease' },
    { id: 'popliteal-l', name: 'Left Popliteal', x: 114, y: 208, area: 'Knee crease' },
    { id: 'popliteal-r', name: 'Right Popliteal', x: 146, y: 208, area: 'Knee crease' },
  ];

  // Specific animation variants tailored to exercise categories
  const getTorsoMotion = () => {
    if (!isPlaying) return undefined;
    if (exercise.category === 'breathing') {
      return {
        scale: [1, 1.07, 1.07, 1],
        transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const },
      };
    }
    if (exercise.category === 'rebound') {
      return {
        y: [0, -3, 0],
        transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' as const },
      };
    }
    return undefined;
  };

  const getHeadMotion = () => {
    if (!isPlaying) return undefined;
    if (exercise.category === 'drainage') {
      return {
        rotate: [-7, 7, -7],
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
      };
    }
    return undefined;
  };

  const getLeftArmMotion = () => {
    if (!isPlaying) return undefined;
    if (exercise.category === 'lymphatic_activation') {
      return {
        rotate: [-20, 25, -20],
        originX: '106px',
        originY: '78px',
        transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
      };
    }
    return undefined;
  };

  const getRightArmMotion = () => {
    if (!isPlaying) return undefined;
    if (exercise.category === 'lymphatic_activation') {
      return {
        rotate: [20, -25, 20],
        originX: '154px',
        originY: '78px',
        transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
      };
    }
    return undefined;
  };

  const getLegMotion = () => {
    if (!isPlaying) return undefined;
    if (exercise.category === 'rebound') {
      return {
        y: [0, -4, 0],
        transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' as const },
      };
    }
    return undefined;
  };

  const handleOpenModal = () => {
    if (onOpenVideoModal) {
      onOpenVideoModal();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="w-full rounded-3xl bg-gradient-to-b from-stone-900 via-slate-950 to-slate-900 p-4 shadow-xl border border-stone-800 text-stone-100 relative overflow-hidden flex flex-col justify-between select-none">
        
        {/* Background Soft Mesh Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        {/* Top Controls: Mode Switcher & Quick Actions */}
        <div className="flex items-center justify-between text-xs z-10 gap-2 mb-2">
          {/* Segmented Mode Switcher: Lymph Map vs Form Video */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('flow_map')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition flex items-center gap-1 ${
                viewMode === 'flow_map'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Flow Map</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('video')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'video'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Video className="w-3 h-3 text-emerald-300" />
              <span>Video Form</span>
              {hasSpecificVideo && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
              )}
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5">
            {viewMode === 'flow_map' ? (
              <button
                type="button"
                onClick={() => setShowNodeLabels(!showNodeLabels)}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition ${
                  showNodeLabels 
                    ? 'bg-emerald-600/40 border-emerald-400 text-emerald-200' 
                    : 'bg-white/5 border-white/10 text-stone-400 hover:text-stone-200'
                }`}
              >
                {showNodeLabels ? 'Hide Nodes' : 'Nodes'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 border border-white/10 transition"
                aria-label={isVideoMuted ? 'Unmute video' : 'Mute video'}
                title={isVideoMuted ? 'Unmute' : 'Mute'}
              >
                {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenModal}
              className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 transition"
              title="Open full proper form execution guide"
            >
              <Eye className="w-3 h-3" />
              <span>Guide</span>
            </button>
          </div>
        </div>

        {/* Main Display Area (Framer Motion Canvas or Video Player) */}
        {viewMode === 'flow_map' ? (
          /* Framer Motion SVG Silhouette & Lymphatic Flow Canvas */
          <div className="relative w-full h-56 flex items-center justify-center my-1">
            <svg 
              viewBox="0 0 260 280" 
              className="w-full h-full max-h-56 drop-shadow-lg"
              aria-label={`Framer Motion Exercise Visualizer for ${exercise.title}`}
            >
              <defs>
                {/* Pulsing Gradient for Nodes */}
                <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#6ee7b7" stopOpacity="1" />
                  <stop offset="60%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                </radialGradient>

                {/* Glowing filter */}
                <filter id="framerGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* 1. ANIMATED BODY SILHOUETTE */}
              <motion.g
                animate={exercise.category === 'rebound' && isPlaying ? { y: [0, -3, 0] } : {}}
                transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Head (with rotation for neck tilt drainage) */}
                <motion.g
                  animate={getHeadMotion()}
                  style={{ originX: '130px', originY: '60px' }}
                >
                  <circle 
                    cx="130" 
                    cy="44" 
                    r="18" 
                    fill="#1e293b" 
                    stroke="#34d399" 
                    strokeWidth="1.5" 
                  />
                  {/* Subtle face profile line */}
                  <path d="M130 36 Q138 44 130 52" stroke="#475569" strokeWidth="1" fill="none" />
                </motion.g>

                {/* Neck */}
                <path d="M124 62 L136 62 L138 74 L122 74 Z" fill="#1e293b" stroke="#34d399" strokeWidth="1.2" />

                {/* Torso with Breathing expansion */}
                <motion.path 
                  d="M112 74 L148 74 L158 126 L148 156 L112 156 L102 126 Z" 
                  fill="#1e293b" 
                  stroke="#34d399" 
                  strokeWidth="1.5" 
                  animate={getTorsoMotion()}
                  style={{ originX: '130px', originY: '115px' }}
                />

                {/* Clavicle / Collarbone reference line */}
                <path d="M106 78 Q130 84 154 78" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />

                {/* Left Arm with Framer Motion swinging */}
                <motion.path 
                  d="M106 78 Q88 105 86 138" 
                  stroke="#34d399" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  fill="none" 
                  animate={getLeftArmMotion()}
                />

                {/* Right Arm with Framer Motion swinging */}
                <motion.path 
                  d="M154 78 Q172 105 174 138" 
                  stroke="#34d399" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  fill="none" 
                  animate={getRightArmMotion()}
                />

                {/* Pelvis and Legs with Ankle Bounce */}
                <motion.g animate={getLegMotion()}>
                  {/* Left Leg */}
                  <path d="M118 156 L115 208 L114 246" stroke="#34d399" strokeWidth="4" strokeLinecap="round" fill="none" />
                  {/* Right Leg */}
                  <path d="M142 156 L145 208 L146 246" stroke="#34d399" strokeWidth="4" strokeLinecap="round" fill="none" />
                  {/* Left Foot */}
                  <motion.path 
                    d="M114 246 L102 246" 
                    stroke="#6ee7b7" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    animate={exercise.category === 'rebound' && isPlaying ? { rotate: [-10, 10, -10], originX: '114px', originY: '246px' } : {}}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                  {/* Right Foot */}
                  <motion.path 
                    d="M146 246 L158 246" 
                    stroke="#6ee7b7" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    animate={exercise.category === 'rebound' && isPlaying ? { rotate: [10, -10, 10], originX: '146px', originY: '246px' } : {}}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                </motion.g>
              </motion.g>

              {/* 2. DYNAMIC LYMPHATIC MOTION PATHWAYS */}

              {/* A. Cervical / Neck Drainage Waves */}
              {exercise.category === 'drainage' && (
                <g>
                  <motion.path
                    d="M120 62 Q116 70 114 78"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    fill="none"
                    animate={isPlaying ? { strokeDashoffset: [0, -14] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.path
                    d="M140 62 Q144 70 146 78"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    fill="none"
                    animate={isPlaying ? { strokeDashoffset: [0, -14] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  />
                </g>
              )}

              {/* B. Diaphragmatic Thoracic Expansion Wave */}
              {exercise.category === 'breathing' && (
                <g>
                  {/* Thoracic Central Conduit */}
                  <motion.path
                    d="M130 145 L130 84 Q130 78 120 78"
                    stroke="#34d399"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    fill="none"
                    animate={isPlaying ? { strokeDashoffset: [0, -20] } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  {/* Pulsing abdominal pressure waves */}
                  <motion.circle
                    cx="130"
                    cy="132"
                    r="16"
                    fill="none"
                    stroke="#6ee7b7"
                    strokeWidth="1.5"
                    animate={isPlaying ? { r: [10, 22], opacity: [0.8, 0] } : {}}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
                  />
                </g>
              )}

              {/* C. Axillary (Arm) Pumping Waves */}
              {exercise.category === 'lymphatic_activation' && (
                <g>
                  <motion.path
                    d="M86 130 Q92 108 96 92 Q105 84 114 78"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                    fill="none"
                    animate={isPlaying ? { strokeDashoffset: [0, -16] } : {}}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.path
                    d="M174 130 Q168 108 164 92 Q155 84 146 78"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                    fill="none"
                    animate={isPlaying ? { strokeDashoffset: [0, -16] } : {}}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                  />
                </g>
              )}

              {/* D. Rebound & Calf Pump Upward Jets */}
              {exercise.category === 'rebound' && (
                <g>
                  <motion.path
                    d="M114 240 L115 208 L116 160 L130 132"
                    stroke="#a7f3d0"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    fill="none"
                    animate={isPlaying ? { strokeDashoffset: [0, -20] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.path
                    d="M146 240 L145 208 L144 160 L130 132"
                    stroke="#a7f3d0"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    fill="none"
                    animate={isPlaying ? { strokeDashoffset: [0, -20] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.ellipse
                    cx="130"
                    cy="252"
                    rx="24"
                    ry="4"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="1.5"
                    animate={isPlaying ? { rx: [14, 38], opacity: [0.8, 0] } : {}}
                    transition={{ duration: 0.6, repeat: Infinity, ease: 'easeOut' }}
                  />
                </g>
              )}

              {/* 3. LYMPH NODE CLUSTERS */}
              {lymphNodes.map((node) => (
                <g key={node.id}>
                  {/* Outer pulsing ring */}
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="4.5"
                    fill="url(#nodeGlow)"
                    filter="url(#framerGlow)"
                    animate={isPlaying ? { scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] } : {}}
                    transition={{ duration: 1.8, repeat: Infinity, delay: (node.x % 5) * 0.2 }}
                    style={{ originX: `${node.x}px`, originY: `${node.y}px` }}
                  />
                  {/* Core solid node */}
                  <circle cx={node.x} cy={node.y} r="2.5" fill="#34d399" />
                  
                  {/* Optional Anatomical Node Labels */}
                  {showNodeLabels && (
                    <text 
                      x={node.x > 130 ? node.x + 8 : node.x - 8} 
                      y={node.y + 3} 
                      textAnchor={node.x > 130 ? "start" : "end"} 
                      fill="#94a3b8" 
                      fontSize="7.5" 
                      fontFamily="monospace"
                    >
                      {node.name}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            {/* Dynamic Motion Status Ribbon */}
            <div className="absolute bottom-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/30 text-[11px] font-medium text-emerald-300 flex items-center gap-2 shadow-sm">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Flow Pathways Active</span>
            </div>
          </div>
        ) : (
          /* Proper Execution Video Player Mode */
          <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-black/90 flex items-center justify-center my-1 group border border-white/10 shadow-inner">
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              loop
              muted={isVideoMuted}
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Subtle Video Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Video Overlay Information */}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-white pointer-events-none">
              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-medium border border-white/10">
                {exercise.title}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-[9px] font-semibold text-white uppercase tracking-wider">
                HD Form Demo
              </span>
            </div>

            {/* Center Play Indicator when Paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>
            )}

            {/* Bottom Form Hint Bar */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-stone-200">
              <span className="bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                {hasSpecificVideo ? 'Looping Execution Guide' : 'Core Diaphragmatic Form Demo'}
              </span>

              <button
                type="button"
                onClick={handleOpenModal}
                className="px-2.5 py-1 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium flex items-center gap-1 backdrop-blur-md transition shadow-sm"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Full Tips</span>
              </button>
            </div>
          </div>
        )}

        {/* Interactive Controller Bar */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-between text-xs mt-1">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Cadence Rhythm</span>
              <span className="text-xs font-semibold text-white">
                {isPlaying ? 'Active Kinetic Flow' : 'Motion Paused'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenModal}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 text-[11px] font-medium border border-white/10 transition flex items-center gap-1"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Preview Video</span>
            </button>

            {onTogglePlay && (
              <button
                type="button"
                onClick={onTogglePlay}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition flex items-center gap-1.5 shadow-sm"
                aria-label={isPlaying ? "Pause exercise motion" : "Play exercise motion"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[11px]">Play</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Video Preview Modal */}
      {showModal && (
        <ExerciseVideoPreviewModal
          exercise={exercise}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
