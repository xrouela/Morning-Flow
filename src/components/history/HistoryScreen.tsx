import React, { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import {
  getLocalDateKey,
  getNextRoutineDay,
  getRoutineProgress,
  getRoutineStreak,
  RoutineProgress,
} from '../../services/routineProgressService';
import { THIRTY_DAY_ROUTINE_PLANS } from '../../services/thirtyDayRoutine';
import { Award, CalendarDays, CheckCircle2, Flame, LockKeyhole, TrendingUp } from 'lucide-react';

export const HistoryScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [progress, setProgress] = useState<RoutineProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setProgress(null);
      return;
    }

    try {
      setProgress(getRoutineProgress(user.uid));
      setError(null);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Unable to load your routine history.',
      );
    }
  }, [user?.uid]);

  const completions = progress?.completions ?? [];
  const completedDays = useMemo(
    () => new Set(completions.map((completion) => completion.day)),
    [completions],
  );
  const completedDates = useMemo(
    () => new Set(completions.map((completion) => completion.date)),
    [completions],
  );
  const totalMinutes = Math.round(
    completions.reduce((total, completion) => total + completion.durationSeconds, 0) / 60,
  );
  const streak = progress ? getRoutineStreak(progress) : 0;
  const nextDay = progress ? getNextRoutineDay(progress) : 1;
  const programPosition = nextDay ?? THIRTY_DAY_ROUTINE_PLANS.length;
  const today = new Date();
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const daysSinceMonday = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - daysSinceMonday);
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      dateKey: getLocalDateKey(date),
      isCompleted: completedDates.has(getLocalDateKey(date)),
    };
  });
  const recentCompletions = [...completions]
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))
    .slice(0, 10);

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-4 bg-stone-50/50 dark:bg-slate-900/50 text-stone-900 dark:text-stone-100 pb-6">
      <div>
        <span className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold block">
          30-Day Program
        </span>
        <h1 className="text-xl font-serif font-medium">History & Streaks</h1>
      </div>

      {error && (
        <p role="alert" className="p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200 text-xs">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-amber-500">
            <Flame className="w-5 h-5 fill-amber-500" />
            <span className="text-xs font-semibold text-stone-500 dark:text-slate-400">Current Streak</span>
          </div>
          <p className="text-2xl font-serif font-semibold">{streak}-day streak</p>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Based on calendar dates completed
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-emerald-600">
            <Award className="w-5 h-5" />
            <span className="text-xs font-semibold text-stone-500 dark:text-slate-400">Program Days</span>
          </div>
          <p className="text-2xl font-serif font-semibold">{completions.length} / 30</p>
          <span className="text-[10px] text-stone-500 dark:text-slate-400 font-medium">
            {totalMinutes} minutes completed · Day {programPosition} of 30
          </span>
        </div>
      </div>

      <section className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-emerald-600" />
            This Week
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-medium text-[11px]">
            {week.filter((day) => day.isCompleted).length} of 7 days
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 pt-1 text-center">
          {week.map((day) => (
            <div key={day.dateKey} className="flex flex-col items-center gap-1">
              <span className="text-[10px] text-stone-400 font-medium">{day.label}</span>
              <div
                aria-label={`${day.label}${day.isCompleted ? ', completed' : ', not completed'}`}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  day.isCompleted
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-slate-700 text-stone-400'
                }`}
              >
                {day.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">·</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
            30-Day Journey
          </h2>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            {nextDay ? `Day ${nextDay} of 30` : 'Day 30 of 30 · Complete'}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {THIRTY_DAY_ROUTINE_PLANS.map((plan) => (
            <div
              key={plan.day}
              role="img"
              aria-label={`Day ${plan.day}, ${
                completedDays.has(plan.day)
                  ? 'completed'
                  : plan.day === nextDay
                    ? 'Today'
                    : `locked. Finish Day ${plan.day - 1} to unlock.`
              }`}
              className={`min-h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold border ${
                completedDays.has(plan.day)
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : plan.day === nextDay
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-stone-100 text-stone-600 border-stone-300 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-0.5">
                {completedDays.has(plan.day)
                  ? <CheckCircle2 className="w-3.5 h-3.5" />
                  : plan.day === nextDay
                    ? <CalendarDays className="w-3.5 h-3.5" />
                    : <LockKeyhole className="w-3 h-3" />}
                <span>{plan.day}</span>
              </span>
              <span className={completedDays.has(plan.day) ? 'text-[8px]' : undefined}>
                {completedDays.has(plan.day) ? 'Completed' : plan.day === nextDay ? 'Today' : 'Locked'}
              </span>
            </div>
          ))}
        </div>
        {nextDay !== null && nextDay > 1 && streak === 0 && (
          <p className="text-xs text-stone-600 dark:text-slate-300">Pick up where you left off.</p>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500">
          Recent Completed Days
        </h2>
        {recentCompletions.length === 0 ? (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200/70 dark:border-slate-800 text-xs text-stone-500 dark:text-slate-400">
            Your completed 30-day flows will appear here.
          </div>
        ) : (
          <div className="space-y-2">
            {recentCompletions.map((completion) => {
              const plan = THIRTY_DAY_ROUTINE_PLANS[completion.day - 1];
              const formattedDate = new Date(`${completion.date}T12:00:00`).toLocaleDateString(
                undefined,
                { month: 'short', day: 'numeric', year: 'numeric' },
              );
              return (
                <div
                  key={completion.day}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200/70 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-medium block truncate">
                        Day {completion.day} · {plan.level}
                        {completion.tiredDay ? ' · Short flow' : ''}
                      </span>
                      <span className="text-[10px] text-stone-400 dark:text-slate-400">
                        {formattedDate} · {plan.exerciseIds.length} exercises
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-stone-600 dark:text-slate-300 px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-700 shrink-0">
                    {Math.round(completion.durationSeconds / 60)} min
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
