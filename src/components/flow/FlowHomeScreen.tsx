import React, { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ExerciseVisualizer } from './ExerciseVisualizer';
import { ExerciseVideoPreviewModal } from './ExerciseVideoPreviewModal';
import { CameraRepCounter } from './CameraRepCounter';
import { RoutineExercise } from '../../types/auth';
import {
  getDailyRoutine,
  getTiredDayRoutine,
  ROUTINE_SAFETY_NOTES,
  THIRTY_DAY_ROUTINE_PLANS,
} from '../../services/thirtyDayRoutine';
import {
  getNextRoutineDay,
  getRoutineProgress,
  getRoutineStreak,
  isRoutineDayUnlocked,
  recordRoutineDayCompletion,
  RoutineProgress,
} from '../../services/routineProgressService';
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Flame,
  Info,
  LockKeyhole,
  LockKeyholeOpen,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Video,
  Wind,
} from 'lucide-react';

export const FlowHomeScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [progress, setProgress] = useState<RoutineProgress | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [tiredDay, setTiredDay] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const [stepsCompleted, setStepsCompleted] = useState(0);
  const [repCounts, setRepCounts] = useState<Record<number, number>>({});
  const [routineFinished, setRoutineFinished] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [lockedDayMessage, setLockedDayMessage] = useState<string | null>(null);
  const [justUnlockedDay, setJustUnlockedDay] = useState<number | null>(null);
  const [previewExerciseModal, setPreviewExerciseModal] = useState<RoutineExercise | null>(null);

  const plan = THIRTY_DAY_ROUTINE_PLANS[selectedDay - 1];
  const fullRoutine = useMemo(() => getDailyRoutine(selectedDay), [selectedDay]);
  const routine = useMemo(
    () => (tiredDay ? getTiredDayRoutine(fullRoutine) : fullRoutine),
    [fullRoutine, tiredDay],
  );
  const activeExercise = routine.exercises[activeStepIndex] ?? routine.exercises[0];
  const completedDays = useMemo(
    () => new Set(progress?.completions.map((completion) => completion.day) ?? []),
    [progress],
  );
  const nextDay = progress ? getNextRoutineDay(progress) : null;
  const completedCount = progress?.completions.length ?? 0;
  const isSelectedDayComplete = completedDays.has(selectedDay);
  const isSelectedDayLocked = !progress || !isRoutineDayUnlocked(progress, selectedDay);
  const canStartSelectedDay =
    Boolean(user?.uid) &&
    !isLoadingProgress &&
    !isSelectedDayLocked;
  const streakCount = progress ? getRoutineStreak(progress) : 0;

  useEffect(() => {
    if (!user?.uid) {
      setProgress(null);
      setIsLoadingProgress(false);
      return;
    }

    let active = true;
    setIsLoadingProgress(true);
    setProgressError(null);
    try {
      const savedProgress = getRoutineProgress(user.uid);
      if (active) {
        setProgress(savedProgress);
        setSelectedDay(getNextRoutineDay(savedProgress) ?? THIRTY_DAY_ROUTINE_PLANS.length);
      }
    } catch (error) {
      if (active) {
        setProgressError(
          error instanceof Error ? error.message : 'Unable to load your 30-day program progress.',
        );
      }
    } finally {
      if (active) setIsLoadingProgress(false);
    }

    return () => {
      active = false;
    };
  }, [user?.uid]);

  useEffect(() => {
    setIsPlaying(false);
    setRoutineFinished(false);
    setCompletionMessage(null);
    setActiveStepIndex(0);
    setSecondsRemaining(routine.exercises[0].durationSeconds);
    setStepsCompleted(0);
    setRepCounts({});
  }, [routine.exercises, selectedDay, tiredDay]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setTimeout(() => {
      if (secondsRemaining > 1) {
        setSecondsRemaining(secondsRemaining - 1);
        return;
      }

      const nextStepIndex = activeStepIndex + 1;
      if (nextStepIndex >= routine.exercises.length) {
        setSecondsRemaining(0);
        setStepsCompleted(routine.exercises.length);
        setIsPlaying(false);
        setRoutineFinished(true);
        return;
      }

      setStepsCompleted(nextStepIndex);
      setActiveStepIndex(nextStepIndex);
      setSecondsRemaining(routine.exercises[nextStepIndex].durationSeconds);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [activeStepIndex, isPlaying, routine, secondsRemaining]);

  const selectDay = (day: number) => {
    setSelectedDay(day);
    setJustUnlockedDay(null);
    setLockedDayMessage(null);
    if (progress && isRoutineDayUnlocked(progress, day)) {
      setTiredDay(false);
    } else {
      setLockedDayMessage(
        day > 1
          ? `Finish Day ${day - 1} to unlock Day ${day}.`
          : `Finish Day ${day} to unlock it.`,
      );
    }
    setPreviewExerciseModal(null);
  };

  const toggleTiredDay = () => {
    setTiredDay((current) => !current);
    setPreviewExerciseModal(null);
    setLockedDayMessage(null);
  };

  const startOrResume = () => {
    if (!user?.uid || isLoadingProgress) return;

    try {
      const currentProgress = getRoutineProgress(user.uid);
      setProgress(currentProgress);
      if (!isRoutineDayUnlocked(currentProgress, selectedDay)) {
        const availableDay = getNextRoutineDay(currentProgress);
        setProgressError(
          availableDay
            ? `Complete Day ${availableDay} before starting Day ${selectedDay}.`
            : 'The 30-day program is already complete.',
        );
        return;
      }
      setProgressError(null);
    } catch (error) {
      setProgressError(
        error instanceof Error ? error.message : 'Unable to verify your 30-day program progress.',
      );
      return;
    }

    if (routineFinished || secondsRemaining === 0) {
      setActiveStepIndex(0);
      setSecondsRemaining(routine.exercises[0].durationSeconds);
      setStepsCompleted(0);
      setRoutineFinished(false);
      setCompletionMessage(null);
    }
    setIsPlaying(true);
  };

  const saveCompletion = () => {
    if (!user?.uid || !routineFinished) return;

    try {
      const alreadyCompleted = completedDays.has(selectedDay);
      const updatedProgress = recordRoutineDayCompletion(user.uid, selectedDay, tiredDay);
      const unlockedDay = getNextRoutineDay(updatedProgress);
      setProgress(updatedProgress);
      setProgressError(null);
      setJustUnlockedDay(
        !alreadyCompleted && nextDay === selectedDay && unlockedDay !== null
          ? unlockedDay
          : null,
      );
      setCompletionMessage(
        alreadyCompleted
          ? `Day ${selectedDay} was already recorded. Your progress has not been counted twice.`
          : unlockedDay
            ? `Day ${selectedDay} done. Day ${unlockedDay} unlocked.`
            : `Day ${selectedDay} done. Your 30-day journey is complete.`,
      );
    } catch (error) {
      setProgressError(
        error instanceof Error ? error.message : 'Unable to save this completed routine.',
      );
    }
  };

  const startNextDay = () => {
    if (!nextDay) return;
    selectDay(nextDay);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-4 bg-stone-50/50 dark:bg-slate-900/50 text-stone-900 dark:text-stone-100 pb-24">
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold block">
            Good Morning, {user?.displayName?.split(' ')[0] || 'Practitioner'}
          </span>
          <h1 className="text-xl font-serif font-medium">Your 30-Day Lymphatic Flow</h1>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span className="text-xs font-bold">{streakCount}-day streak</span>
        </div>
      </div>

      <section
        className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-3"
        aria-label="30-day program progress"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-emerald-600" />
            {nextDay ? `Day ${nextDay} of 30` : 'Day 30 of 30 · Complete'}
          </span>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {completedCount} / 30 days
          </span>
        </div>
        <div
          className="h-2 w-full rounded-full bg-stone-100 dark:bg-slate-700 overflow-hidden"
          role="progressbar"
          aria-label="Days completed"
          aria-valuemin={0}
          aria-valuemax={30}
          aria-valuenow={completedCount}
        >
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${(completedCount / THIRTY_DAY_ROUTINE_PLANS.length) * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-5 gap-1.5" aria-label="Choose a day">
          {THIRTY_DAY_ROUTINE_PLANS.map((dayPlan) => {
            const isComplete = completedDays.has(dayPlan.day);
            const isSelected = selectedDay === dayPlan.day;
            const isNext = nextDay === dayPlan.day;
            const isLocked = !progress || !isRoutineDayUnlocked(progress, dayPlan.day);
            const unlockInstruction = dayPlan.day > 1
              ? `Finish Day ${dayPlan.day - 1} to unlock.`
              : 'Finish this day to unlock the next.';
            return (
              <button
                key={dayPlan.day}
                type="button"
                aria-label={
                  isComplete
                    ? `Day ${dayPlan.day}, completed`
                    : isNext
                      ? `Day ${dayPlan.day}, Today`
                      : isLocked
                        ? `Day ${dayPlan.day}, locked. ${unlockInstruction}`
                        : `Day ${dayPlan.day}, unlocked`
                }
                aria-pressed={isSelected}
                aria-disabled={isLocked}
                disabled={isLoadingProgress}
                onClick={() => selectDay(dayPlan.day)}
                className={`min-h-12 rounded-xl text-[10px] font-semibold transition border ${
                  isSelected && !isLocked
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : isSelected
                      ? 'bg-stone-200 text-stone-700 border-stone-500 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-500'
                    : isComplete
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                      : isNext
                        ? `bg-emerald-600 text-white border-emerald-600 ${justUnlockedDay === dayPlan.day ? 'motion-safe:animate-pulse' : ''}`
                        : isLocked
                          ? 'bg-stone-100 text-stone-600 border-stone-300 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-700'
                          : 'bg-stone-50 text-stone-600 border-stone-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'
                }`}
              >
                <span className="flex flex-col items-center justify-center leading-tight gap-0.5">
                  <span className="flex items-center gap-0.5">
                    {isComplete
                      ? <CheckCircle2 className="w-3.5 h-3.5" />
                      : isLocked
                        ? <LockKeyhole className="w-3 h-3" />
                        : justUnlockedDay === dayPlan.day
                          ? <LockKeyholeOpen className="w-3.5 h-3.5 motion-safe:animate-bounce" />
                          : null}
                    <span>{dayPlan.day}</span>
                  </span>
                  <span className={isComplete ? 'text-[8px]' : undefined}>
                    {isComplete ? 'Completed' : isNext ? 'Today' : 'Locked'}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {lockedDayMessage && (
          <p role="status" aria-live="polite" className="text-xs text-stone-700 dark:text-slate-200">
            {lockedDayMessage}
          </p>
        )}
        <p className="text-[11px] text-stone-500 dark:text-slate-400">
          Complete each day to unlock the next. Completed days can be repeated. Days 1–10 Beginner · Days 11–20 Intermediate · Days 21–30 Advanced.
        </p>
        {isLoadingProgress && (
          <p role="status" className="text-xs text-stone-500">Loading your saved progress…</p>
        )}
        {progressError && (
          <p role="alert" className="text-xs text-rose-700 dark:text-rose-300">
            {progressError}
          </p>
        )}
      </section>

      <section className="p-4 rounded-3xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-white shadow-md space-y-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="relative flex items-center justify-between text-xs text-emerald-200 font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {isSelectedDayLocked
              ? `${fullRoutine.totalDurationSeconds / 60} Minutes · ${fullRoutine.exercises.length} Exercises`
              : `${routine.totalDurationSeconds / 60} Minutes · ${routine.exercises.length} Exercises`}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-medium capitalize text-[10px]">
            {plan.level} Phase
          </span>
        </div>
        <div className="relative">
          <h2 className="text-lg font-serif font-medium">{fullRoutine.title}</h2>
          <p className="text-xs text-emerald-100/90 mt-1">{fullRoutine.description}</p>
        </div>

        {isSelectedDayLocked ? (
          <p className="relative p-3 rounded-2xl bg-black/20 border border-white/20 text-sm font-medium">
            <LockKeyhole className="w-4 h-4 inline-block mr-2" />
            Locked · finish Day {selectedDay > 1 ? selectedDay - 1 : selectedDay} first
          </p>
        ) : (
          <button
          type="button"
          role="checkbox"
          aria-checked={tiredDay}
          onClick={toggleTiredDay}
          className={`relative w-full p-2.5 rounded-2xl border text-left text-xs transition ${
            tiredDay
              ? 'bg-white text-emerald-900 border-white'
              : 'bg-black/20 text-emerald-50 border-white/20 hover:bg-black/30'
          }`}
        >
          <span className="font-semibold block">
            {tiredDay ? 'Short flow selected · 4 minutes' : 'On a tired day? Use the short flow'}
          </span>
          <span className="block mt-0.5 opacity-90">
            {isSelectedDayComplete
              ? 'Repeat this day; saved progress will not be counted twice.'
              : selectedDay === THIRTY_DAY_ROUTINE_PLANS.length
                ? 'Short flow counts as a completed day.'
                : 'First 3 exercises plus the final stretch/rest. Short flow counts and unlocks the next day.'}
          </span>
          </button>
        )}

        {!isSelectedDayLocked && <div className="relative p-2.5 rounded-2xl bg-black/20 border border-white/10 flex items-start gap-2 text-xs">
          <Wind className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-emerald-200 block text-[11px]">Breathing cue</span>
            <span className="text-[11px] text-emerald-50 leading-relaxed">{activeExercise.breathingCue}</span>
          </div>
        </div>}
      </section>

      {!isSelectedDayLocked && <section className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-stone-500 dark:text-slate-400">
            Exercise {activeStepIndex + 1} of {routine.exercises.length}
            {stepsCompleted > 0 && ` · ${stepsCompleted} complete`}
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
            {routineFinished ? 'Flow finished' : `${secondsRemaining}s remaining`}
          </span>
        </div>

        <ExerciseVisualizer
          exercise={activeExercise}
          isPlaying={isPlaying}
          onTogglePlay={() => (isPlaying ? setIsPlaying(false) : startOrResume())}
          stepNumber={activeStepIndex + 1}
          totalSteps={routine.exercises.length}
          onOpenVideoModal={() => setPreviewExerciseModal(activeExercise)}
        />

        <CameraRepCounter
          exerciseKey={`${selectedDay}-${tiredDay}-${activeStepIndex}`}
          isTracking={isPlaying}
          count={repCounts[activeStepIndex] ?? 0}
          onCountChange={(update) => {
            setRepCounts((current) => ({
              ...current,
              [activeStepIndex]: update(current[activeStepIndex] ?? 0),
            }));
          }}
        />

        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-900/60 border border-stone-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
              {activeExercise.title}
            </h3>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {activeExercise.targetArea}
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
            {activeExercise.instructions}
          </p>
          {activeExercise.formTips && (
            <ul className="list-disc pl-4 text-[11px] text-stone-500 dark:text-slate-400 space-y-0.5">
              {activeExercise.formTips.map((tip) => <li key={tip}>{tip}</li>)}
            </ul>
          )}
          <button
            type="button"
            onClick={() => setPreviewExerciseModal(activeExercise)}
            className="w-full mt-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-semibold flex items-center justify-center gap-2 transition shadow-xs"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Exercise guide and form tips</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            disabled={isPlaying || routineFinished}
            onClick={() => {
              const previous = activeStepIndex > 0 ? activeStepIndex - 1 : routine.exercises.length - 1;
              setActiveStepIndex(previous);
              setSecondsRemaining(routine.exercises[previous].durationSeconds);
            }}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 disabled:opacity-40 text-stone-600 dark:text-slate-300 text-xs font-medium transition"
            aria-label="Previous exercise"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={!canStartSelectedDay && !isPlaying}
            onClick={() => (isPlaying ? setIsPlaying(false) : startOrResume())}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying
              ? <><Pause className="w-4 h-4" /><span>Pause flow</span></>
              : isSelectedDayComplete
                ? <><RotateCcw className="w-4 h-4" /><span>Repeat this day</span></>
                : <><Play className="w-4 h-4 fill-current" /><span>{routineFinished ? 'Restart flow' : secondsRemaining < 60 ? 'Resume flow' : `Start ${routine.totalDurationSeconds / 60}-minute flow`}</span></>}
          </button>

          <button
            type="button"
            disabled={isPlaying || routineFinished}
            onClick={() => {
              const next = (activeStepIndex + 1) % routine.exercises.length;
              setActiveStepIndex(next);
              setSecondsRemaining(routine.exercises[next].durationSeconds);
            }}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 disabled:opacity-40 text-stone-600 dark:text-slate-300 text-xs font-medium transition"
            aria-label="Next exercise"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {nextDay === selectedDay && nextDay < THIRTY_DAY_ROUTINE_PLANS.length && (
          <p className="text-center text-[11px] text-stone-600 dark:text-slate-300">
            Finish today to unlock Day {nextDay + 1}.
          </p>
        )}

        {routineFinished && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
              Nice work finishing Day {selectedDay}.
            </p>
            <button
              type="button"
              onClick={saveCompletion}
              disabled={isLoadingProgress || Boolean(completionMessage)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold disabled:opacity-60"
            >
              {completionMessage ? 'Day progress saved' : `Save Day ${selectedDay} completion`}
            </button>
            {completionMessage && (
              <p role="status" className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                {completionMessage}
              </p>
            )}
            {justUnlockedDay !== null && completionMessage && (
              <button
                type="button"
                onClick={startNextDay}
                className="w-full py-2 rounded-xl border border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-semibold"
              >
                Continue to Day {justUnlockedDay}
              </button>
            )}
          </div>
        )}

        {progressError && (
          <p role="alert" className="text-xs text-rose-700 dark:text-rose-300">
            {progressError}
          </p>
        )}
      </section>}

      {nextDay !== null && nextDay > 1 && streakCount === 0 && (
        <p className="text-xs text-stone-600 dark:text-slate-300">Pick up where you left off.</p>
      )}

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500">
            Day {selectedDay} sequence
          </h2>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            {isSelectedDayLocked
              ? 'Read-only preview · 10 moves'
              : isSelectedDayComplete
                ? 'Completed · repeat this day'
                : `${routine.exercises.length} moves · 1 minute each`}
          </span>
        </div>
        {isSelectedDayLocked && (
          <p className="rounded-xl bg-stone-100 dark:bg-slate-800 px-3 py-2 text-xs text-stone-700 dark:text-slate-200">
            {lockedDayMessage ?? `Finish Day ${selectedDay > 1 ? selectedDay - 1 : selectedDay} to unlock Day ${selectedDay}.`}
          </p>
        )}
        <div className="space-y-1.5">
          {(isSelectedDayLocked ? fullRoutine.exercises : routine.exercises).map((item, index) => {
            const isCurrent = index === activeStepIndex;
            return (
              <div
                key={item.id}
                onClick={isSelectedDayLocked ? undefined : () => {
                  if (isPlaying || routineFinished) return;
                  setActiveStepIndex(index);
                  setSecondsRemaining(item.durationSeconds);
                }}
                className={`w-full text-left p-2.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  !isSelectedDayLocked && isCurrent
                    ? 'border-emerald-600/60 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-xs'
                    : 'border-stone-200/70 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-stone-50 dark:hover:bg-slate-800/70'
                } ${isSelectedDayLocked || isPlaying || routineFinished ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    !isSelectedDayLocked && isCurrent ? 'bg-emerald-600 text-white' : 'bg-stone-100 dark:bg-slate-700 text-stone-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="truncate">
                    <span className="text-xs font-medium block truncate">{item.title}</span>
                    <span className="text-[10px] text-stone-400 dark:text-slate-400 block truncate">{item.targetArea}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!isSelectedDayLocked && <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setPreviewExerciseModal(item);
                    }}
                    className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-500 hover:text-emerald-700 transition"
                    aria-label={`View ${item.title} instructions`}
                  >
                    {item.videoUrl ? <Video className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>}
                  <span className="text-xs text-stone-400 font-mono font-medium">{item.durationSeconds}s</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/70 space-y-2">
        <h2 className="text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          Safety notes
        </h2>
        <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-900/90 dark:text-amber-100/90">
          {ROUTINE_SAFETY_NOTES.map((note) => <li key={note}>{note}</li>)}
        </ul>
      </section>

      <div className="p-3 rounded-2xl bg-stone-100 dark:bg-slate-800/60 text-[11px] text-stone-500 dark:text-slate-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>General wellness guidance only. Not medical advice. Always listen to your body.</span>
      </div>

      {previewExerciseModal && (
        <ExerciseVideoPreviewModal
          exercise={previewExerciseModal}
          onClose={() => setPreviewExerciseModal(null)}
        />
      )}
    </div>
  );
};
