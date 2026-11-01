import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { RoutineLevel } from '../../types/auth';
import { onboardingSchema } from '../../schemas/authSchemas';
import { 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Loader2, 
  HeartHandshake, 
  Activity, 
  Flame 
} from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { user, completeOnboarding, isLoading, error, clearError } = useAuthStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedLevel, setSelectedLevel] = useState<RoutineLevel>('beginner');
  const [reminderTime, setReminderTime] = useState('07:00');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFinish = async () => {
    setValidationError(null);
    clearError();

    const parseResult = onboardingSchema.safeParse({
      level: selectedLevel,
      reminderTime,
      reminderEnabled,
      disclaimerAccepted,
    });

    if (!parseResult.success) {
      setValidationError(parseResult.error.issues[0]?.message || 'Please accept the disclaimer to complete onboarding.');
      return;
    }

    await completeOnboarding({
      level: selectedLevel,
      reminderTime,
      reminderEnabled,
      disclaimerAccepted,
    });
  };

  const levelOptions: {
    level: RoutineLevel;
    title: string;
    description: string;
    icon: React.ReactNode;
    focus: string;
    tag: string;
  }[] = [
    {
      level: 'beginner',
      title: 'Beginner Flow',
      description: 'Gentle foundational routine: diaphragmatic breathing, neck drainage, and rhythmic ankle pumps.',
      icon: <HeartHandshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      focus: 'Gentle standing or seated movement',
      tag: '5 Minutes • Low Impact',
    },
    {
      level: 'intermediate',
      title: 'Intermediate Flow',
      description: 'Active flow: micro-rebounding, axillary sweeps, and standing lymph node pumps.',
      icon: <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      focus: 'Rhythmic bounce & whole-body activation',
      tag: '5 Minutes • Moderate Pace',
    },
    {
      level: 'advanced',
      title: 'Advanced Flow',
      description: 'Dynamic fascial flush: multi-plane rotation, deep thoracic pumps, and rapid rebound cycles.',
      icon: <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      focus: 'Continuous kinetic lymph propulsion',
      tag: '5 Minutes • Energetic Flow',
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-white dark:bg-slate-900 text-stone-900 dark:text-stone-100">
      <div className="space-y-6">
        {/* Progress Bar / Steps */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-stone-400 dark:text-slate-500 mb-2 font-medium">
            <span>Welcome, {user?.displayName || 'Practitioner'}</span>
            <span>Step {step} of 3</span>
          </div>
          <div className="h-1.5 w-full bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {(validationError || error) && (
          <div 
            role="alert" 
            className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{validationError || error?.message}</span>
          </div>
        )}

        {/* Step 1: Choose Routine Level */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-medium tracking-tight">Choose Your Starting Flow</h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                Select your morning intensity. You can switch your level at any time in Settings.
              </p>
            </div>

            {/* Note on Role vs Preference */}
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300">
              <span className="font-semibold">Note:</span> Routine Level is your personal wellness preference—it is completely separate from authorization roles (User/Admin).
            </div>

            <div className="space-y-3">
              {levelOptions.map((opt) => {
                const isSelected = selectedLevel === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setSelectedLevel(opt.level)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-600/30 shadow-sm'
                        : 'border-stone-200 dark:border-slate-800 hover:border-stone-300 dark:hover:border-slate-700 bg-stone-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm shrink-0">
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{opt.title}</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-slate-300">
                          {opt.tag}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-slate-400 mt-1">
                        {opt.description}
                      </p>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {opt.focus}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Reminder Time */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-serif font-medium tracking-tight">Set Morning Reminder</h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                Lymphatic fluid flows best upon waking. Gentle consistency builds lasting energy.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm text-emerald-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold block">Daily Wake-Up Prompt</span>
                    <span className="text-xs text-stone-500 dark:text-slate-400">Gentle push notification</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 cursor-pointer"
                  aria-label="Enable daily reminder"
                />
              </div>

              {reminderEnabled && (
                <div className="pt-2 border-t border-stone-200 dark:border-slate-800 flex items-center justify-between">
                  <label htmlFor="reminder-time" className="text-xs font-medium text-stone-600 dark:text-slate-300">
                    Routine Time
                  </label>
                  <input
                    id="reminder-time"
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Tip: Practicing right after drinking a glass of warm water accelerates lymphatic drainage and morning digestion.
              </span>
            </div>
          </div>
        )}

        {/* Step 3: Medical Disclaimer */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-serif font-medium tracking-tight">Wellness Disclaimer</h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                Please review our scope of practice before starting your routine.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-800 max-h-56 overflow-y-auto space-y-2.5 text-xs text-stone-600 dark:text-slate-300">
              <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-semibold">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <span>Not Medical Advice</span>
              </div>
              <p>
                Morning Flow provides gentle guided physical movements, breathwork cues, and wellness routines designed to support general lymphatic mobility and morning invigoration.
              </p>
              <p>
                <strong>This application is not a medical device and does not provide medical advice, diagnosis, treatment, or cure for any disease or clinical condition</strong> (such as clinical lymphedema, acute infection, deep vein thrombosis, or congestive heart failure).
              </p>
              <p>
                Always consult your licensed physician or physical therapist before beginning any new exercise routine, especially if you have existing health conditions or are recovering from surgery.
              </p>
            </div>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-stone-200 dark:border-slate-800 hover:bg-stone-50 dark:hover:bg-slate-800/50 cursor-pointer transition select-none">
              <input
                type="checkbox"
                checked={disclaimerAccepted}
                onChange={(e) => {
                  setDisclaimerAccepted(e.target.checked);
                  if (validationError) setValidationError(null);
                }}
                className="w-5 h-5 mt-0.5 accent-emerald-600 shrink-0 cursor-pointer"
              />
              <span className="text-xs text-stone-700 dark:text-slate-300 font-medium leading-relaxed">
                I acknowledge that Morning Flow is for general wellness purposes only and does not constitute medical advice or substitute for professional medical care.
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3 pt-6 border-t border-stone-100 dark:border-slate-800">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => (s - 1) as any)}
            className="py-3 px-5 rounded-2xl border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
          >
            Back
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) as any)}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 transition"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            disabled={isLoading || !disclaimerAccepted}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 disabled:opacity-50 transition"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Begin Morning Flow</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
