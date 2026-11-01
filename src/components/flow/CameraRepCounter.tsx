import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Minus, Plus, ShieldCheck } from 'lucide-react';
import {
  createRepCounterState,
  getFrameMotionScore,
  updateRepCounter,
} from '../../services/movementRepCounter';

interface CameraRepCounterProps {
  exerciseKey: string;
  isTracking: boolean;
  count: number;
  onCountChange: (update: (current: number) => number) => void;
}

export const CameraRepCounter: React.FC<CameraRepCounterProps> = ({
  exerciseKey,
  isTracking,
  count,
  onCountChange,
}) => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const counterRef = useRef(createRepCounterState());
  const previousFrameRef = useRef<Uint8ClampedArray | null>(null);
  const onCountChangeRef = useRef(onCountChange);
  const isTrackingRef = useRef(isTracking);

  useEffect(() => {
    onCountChangeRef.current = onCountChange;
  }, [onCountChange]);

  useEffect(() => {
    isTrackingRef.current = isTracking;
  }, [isTracking]);

  useEffect(() => {
    counterRef.current = createRepCounterState();
    previousFrameRef.current = null;
  }, [exerciseKey]);

  useEffect(() => {
    if (!cameraEnabled) return;

    let isActive = true;
    let animationFrame = 0;
    let lastSampleAt = 0;
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 36;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    const stopCamera = () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera access is not available in this browser.');
        setCameraEnabled(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: 'user' },
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });

        if (!isActive) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (!videoRef.current) {
          stopCamera();
          setCameraError('Unable to open the camera preview.');
          setCameraEnabled(false);
          return;
        }

        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraError(null);
      } catch (error) {
        if (!isActive) return;
        setCameraError(
          error instanceof DOMException && error.name === 'NotAllowedError'
            ? 'Camera permission was denied. Allow camera access in device settings to use automatic estimates.'
            : 'Could not start the camera. Check that it is available and try again.',
        );
        setCameraEnabled(false);
        stopCamera();
        return;
      }

      const sampleFrame = (timestamp: number) => {
        if (!isActive) return;
        const video = videoRef.current;
        if (video && context && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && timestamp - lastSampleAt >= 250) {
          lastSampleAt = timestamp;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const currentFrame = context.getImageData(0, 0, canvas.width, canvas.height).data;
          const previousFrame = previousFrameRef.current;

          if (previousFrame && isTrackingRef.current) {
            const state = updateRepCounter(
              counterRef.current,
              getFrameMotionScore(previousFrame, currentFrame),
              timestamp,
            );
            if (state.count !== counterRef.current.count) {
              onCountChangeRef.current((current) => current + state.count - counterRef.current.count);
            }
            counterRef.current = state;
          }

          previousFrameRef.current = new Uint8ClampedArray(currentFrame);
        }
        animationFrame = window.requestAnimationFrame(sampleFrame);
      };

      animationFrame = window.requestAnimationFrame(sampleFrame);
    };

    void startCamera();

    return () => {
      isActive = false;
      window.cancelAnimationFrame(animationFrame);
      previousFrameRef.current = null;
      stopCamera();
    };
  }, [cameraEnabled]);

  const toggleCamera = () => {
    setCameraError(null);
    setCameraEnabled((enabled) => !enabled);
  };

  return (
    <section
      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 space-y-3"
      aria-label="Exercise repetition counter"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Reps this exercise</h3>
          <p className="text-[11px] text-stone-500 dark:text-slate-400">
            {isTracking
              ? 'Camera estimates movement cycles; use the buttons to correct the count.'
              : 'Start the flow to enable camera estimates, or count manually.'}
          </p>
        </div>
        <output className="min-w-12 text-center text-2xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400" aria-live="polite">
          {count}
        </output>
      </div>

      {cameraEnabled && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          aria-label="Live camera preview for local rep estimates"
          className="w-full max-h-48 rounded-xl bg-black object-cover"
        />
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onCountChange((current) => Math.max(0, current - 1))}
          aria-label="Decrease rep count"
          disabled={count === 0}
          className="p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 disabled:opacity-40"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onCountChange((current) => current + 1)}
          className="flex-1 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Count rep
        </button>
        <button
          type="button"
          onClick={toggleCamera}
          aria-pressed={cameraEnabled}
          className="flex-1 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2"
        >
          {cameraEnabled ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
          {cameraEnabled ? 'Stop camera' : 'Enable camera'}
        </button>
      </div>

      {cameraError && (
        <p role="alert" className="text-xs text-rose-700 dark:text-rose-300">
          {cameraError}
        </p>
      )}

      <p className="flex items-start gap-1.5 text-[10px] text-stone-500 dark:text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
        Camera frames are analyzed on this device and are not recorded or uploaded. Holds and subtle movements may need manual counting.
      </p>
    </section>
  );
};
