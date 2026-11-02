import { THIRTY_DAY_ROUTINE_PLANS } from './thirtyDayRoutine';

export interface RoutineDayCompletion {
  day: number;
  completedAt: string;
  date: string;
  durationSeconds: number;
  tiredDay: boolean;
}

export interface RoutineProgress {
  version: 1;
  completions: RoutineDayCompletion[];
}

const STORAGE_PREFIX = 'morning_flow_30_day_progress_';
const DAY_SECONDS = 60;

function getStorageKey(uid: string): string {
  if (!uid.trim()) {
    throw new Error('A signed-in user is required to access routine progress.');
  }
  return `${STORAGE_PREFIX}${encodeURIComponent(uid)}`;
}

export function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseProgress(raw: string): RoutineProgress {
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Saved 30-day routine progress has an invalid format.');
  }

  const candidate = parsed as Partial<RoutineProgress>;
  if (candidate.version !== 1 || !Array.isArray(candidate.completions)) {
    throw new Error('Saved 30-day routine progress uses an unsupported format.');
  }

  const seenDays = new Set<number>();
  const parsedCompletions = candidate.completions.map((item): RoutineDayCompletion => {
    if (
      !item ||
      typeof item !== 'object' ||
      !Number.isInteger(item.day) ||
      item.day < 1 ||
      item.day > THIRTY_DAY_ROUTINE_PLANS.length ||
      seenDays.has(item.day) ||
      typeof item.completedAt !== 'string' ||
      Number.isNaN(Date.parse(item.completedAt)) ||
      typeof item.date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(item.date) ||
      !Number.isInteger(item.durationSeconds) ||
      (item.durationSeconds !== DAY_SECONDS * 4 && item.durationSeconds !== DAY_SECONDS * 10) ||
      typeof item.tiredDay !== 'boolean'
    ) {
      throw new Error('Saved 30-day routine progress contains an invalid completion record.');
    }

    seenDays.add(item.day);
    return {
      day: item.day,
      completedAt: item.completedAt,
      date: item.date,
      durationSeconds: item.durationSeconds,
      tiredDay: item.tiredDay,
    };
  });

  const sortedCompletions = parsedCompletions.sort((a, b) => a.day - b.day);
  const sequentialCompletions: RoutineDayCompletion[] = [];
  for (const completion of sortedCompletions) {
    if (completion.day !== sequentialCompletions.length + 1) break;
    sequentialCompletions.push(completion);
  }

  return { version: 1, completions: sequentialCompletions };
}

export function getRoutineProgress(uid: string): RoutineProgress {
  const key = getStorageKey(uid);
  if (typeof window === 'undefined') {
    return { version: 1, completions: [] };
  }

  const stored = window.localStorage.getItem(key);
  return stored ? parseProgress(stored) : { version: 1, completions: [] };
}

export function recordRoutineDayCompletion(
  uid: string,
  day: number,
  tiredDay: boolean,
  completedAt = new Date(),
): RoutineProgress {
  if (!THIRTY_DAY_ROUTINE_PLANS.some((plan) => plan.day === day)) {
    throw new RangeError(`Routine day must be between 1 and ${THIRTY_DAY_ROUTINE_PLANS.length}.`);
  }

  const key = getStorageKey(uid);
  const progress = getRoutineProgress(uid);
  if (progress.completions.some((completion) => completion.day === day)) {
    return progress;
  }

  const nextDay = getNextRoutineDay(progress);
  if (day !== nextDay) {
    throw new Error(
      nextDay
        ? `Complete Day ${nextDay} before recording Day ${day}.`
        : 'All 30 routine days are already complete.',
    );
  }

  const completion: RoutineDayCompletion = {
    day,
    completedAt: completedAt.toISOString(),
    date: getLocalDateKey(completedAt),
    durationSeconds: DAY_SECONDS * (tiredDay ? 4 : 10),
    tiredDay,
  };
  const updated = {
    version: 1 as const,
    completions: [...progress.completions, completion].sort((a, b) => a.day - b.day),
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(updated));
  }
  return updated;
}

export function getNextRoutineDay(progress: RoutineProgress): number | null {
  const completedDays = new Set(progress.completions.map((completion) => completion.day));
  return THIRTY_DAY_ROUTINE_PLANS.find((plan) => !completedDays.has(plan.day))?.day ?? null;
}

export function isRoutineDayUnlocked(progress: RoutineProgress, day: number): boolean {
  if (!THIRTY_DAY_ROUTINE_PLANS.some((plan) => plan.day === day)) return false;
  const nextDay = getNextRoutineDay(progress);
  return nextDay === null || day <= nextDay;
}

export function getRoutineStreak(progress: RoutineProgress, today = new Date()): number {
  const completedDates = new Set(progress.completions.map((completion) => completion.date));
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!completedDates.has(getLocalDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!completedDates.has(getLocalDateKey(cursor))) {
      return 0;
    }
  }

  let streak = 0;
  while (completedDates.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
