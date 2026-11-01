import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getDailyRoutine,
  getTiredDayRoutine,
  ROUTINE_SAFETY_NOTES,
  THIRTY_DAY_EXERCISE_LIBRARY,
  THIRTY_DAY_ROUTINE_PLANS,
} from '../src/services/thirtyDayRoutine';
import {
  getNextRoutineDay,
  getRoutineProgress,
  getRoutineStreak,
  recordRoutineDayCompletion,
  RoutineProgress,
} from '../src/services/routineProgressService';
import {
  createRepCounterState,
  getFrameMotionScore,
  updateRepCounter,
} from '../src/services/movementRepCounter';

test('30-day plan has 30 unique ten-move routines with one-minute exercises', () => {
  assert.equal(THIRTY_DAY_ROUTINE_PLANS.length, 30);
  const sequences = new Set<string>();

  for (const [index, plan] of THIRTY_DAY_ROUTINE_PLANS.entries()) {
    assert.equal(plan.day, index + 1);
    assert.equal(plan.exerciseIds.length, 10, `Day ${plan.day} should have 10 exercises`);
    assert.equal(
      new Set(plan.exerciseIds).size,
      10,
      `Day ${plan.day} should not repeat an exercise`,
    );
    assert.equal(
      plan.level,
      plan.day <= 10 ? 'beginner' : plan.day <= 20 ? 'intermediate' : 'advanced',
    );
    sequences.add(plan.exerciseIds.join(','));

    const routine = getDailyRoutine(plan.day);
    assert.equal(routine.exercises.length, 10);
    assert.equal(routine.totalDurationSeconds, 600);
    assert.ok(routine.exercises.every((exercise) => exercise.durationSeconds === 60));
    for (const id of plan.exerciseIds) {
      assert.ok(THIRTY_DAY_EXERCISE_LIBRARY[id], `Missing exercise "${id}" for Day ${plan.day}`);
    }
  }

  assert.equal(sequences.size, 30, 'Every day should have a different exercise sequence');
  for (const id of Object.keys(THIRTY_DAY_EXERCISE_LIBRARY)) {
    assert.ok(
      THIRTY_DAY_ROUTINE_PLANS.some((plan) => plan.exerciseIds.includes(id)),
      `Exercise "${id}" is not scheduled in the 30-day program`,
    );
  }
});

test('daily sequences match the plan order at the start and end of the program', () => {
  assert.deepEqual(THIRTY_DAY_ROUTINE_PLANS[0].exerciseIds, [
    'belly-breathing',
    'shoulder-rolls',
    'arm-circles',
    'arm-pumps',
    'loose-arm-swings',
    'chest-opening-stretch',
    'ankle-pumps',
    'heel-raises',
    'marching-in-place',
    'legs-up-the-wall',
  ]);
  assert.deepEqual(THIRTY_DAY_ROUTINE_PLANS[29].exerciseIds, [
    'standing-hold',
    'body-waves',
    'sun-salutation',
    'warrior-two-side-angle-flow',
    'ballet-squat',
    'horse-stance',
    'cossack-squat',
    'split',
    'hurdler-stretch',
    'legs-up-the-wall',
  ]);
});

test('tired-day option includes the first three exercises and the final rest', () => {
  const routine = getDailyRoutine(17);
  const shortRoutine = getTiredDayRoutine(routine);

  assert.deepEqual(
    shortRoutine.exercises.map((exercise) => exercise.id),
    [routine.exercises[0].id, routine.exercises[1].id, routine.exercises[2].id, routine.exercises[9].id],
  );
  assert.equal(shortRoutine.exercises.length, 4);
  assert.equal(shortRoutine.totalDurationSeconds, 240);
  assert.equal(ROUTINE_SAFETY_NOTES.length, 4);
  assert.throws(() => getDailyRoutine(31), RangeError);
});

test('routine progress is saved per user and duplicate day completions are not counted twice', () => {
  const values = new Map<string, string>();
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
    },
  });

  try {
    const completedAt = new Date(2026, 5, 15, 7, 0);
    const first = recordRoutineDayCompletion('user-a', 1, true, completedAt);
    const duplicate = recordRoutineDayCompletion('user-a', 1, false, new Date(2026, 5, 16, 7, 0));
    const secondUser = getRoutineProgress('user-b');

    assert.equal(first.completions.length, 1);
    assert.equal(first.completions[0].durationSeconds, 240);
    assert.equal(first.completions[0].tiredDay, true);
    assert.equal(duplicate.completions.length, 1);
    assert.equal(getRoutineProgress('user-a').completions[0].date, '2026-06-15');
    assert.equal(secondUser.completions.length, 0);

    const saved = getRoutineProgress('user-a');
    assert.equal(getNextRoutineDay(saved), 2);
  } finally {
    if (previousWindow) {
      Object.defineProperty(globalThis, 'window', previousWindow);
    } else {
      Reflect.deleteProperty(globalThis, 'window');
    }
  }
});

test('program progression skips completed days and calculates current local-date streaks', () => {
  const progress: RoutineProgress = {
    version: 1,
    completions: [
      { day: 1, completedAt: '2026-06-13T07:00:00.000Z', date: '2026-06-13', durationSeconds: 600, tiredDay: false },
      { day: 2, completedAt: '2026-06-14T07:00:00.000Z', date: '2026-06-14', durationSeconds: 600, tiredDay: false },
      { day: 3, completedAt: '2026-06-15T07:00:00.000Z', date: '2026-06-15', durationSeconds: 240, tiredDay: true },
      { day: 5, completedAt: '2026-06-15T08:00:00.000Z', date: '2026-06-15', durationSeconds: 600, tiredDay: false },
    ],
  };
  const allDaysComplete: RoutineProgress = {
    version: 1,
    completions: THIRTY_DAY_ROUTINE_PLANS.map((plan) => ({
      day: plan.day,
      completedAt: '2026-06-15T07:00:00.000Z',
      date: '2026-06-15',
      durationSeconds: 600,
      tiredDay: false,
    })),
  };

  assert.equal(getNextRoutineDay(progress), 4);
  assert.equal(getRoutineStreak(progress, new Date(2026, 5, 15, 12)), 3);
  assert.equal(getRoutineStreak({ version: 1, completions: [] }, new Date(2026, 5, 15, 12)), 0);
  assert.equal(getNextRoutineDay(allDaysComplete), null);
});

test('malformed stored program progress raises a visible validation error', () => {
  const values = new Map<string, string>([['morning_flow_30_day_progress_user-c', '{not-json']]);
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { localStorage: { getItem: (key: string) => values.get(key) ?? null } },
  });

  test('camera motion estimates count peaks with a cooldown and ignore low-level noise', () => {
    let state = createRepCounterState();
    state = updateRepCounter(state, 1, 0);
    state = updateRepCounter(state, 7, 250);
    state = updateRepCounter(state, 9, 500);
    state = updateRepCounter(state, 4, 750);
    assert.equal(state.count, 1);

    state = updateRepCounter(state, 8, 1000);
    state = updateRepCounter(state, 9, 1250);
    state = updateRepCounter(state, 3, 1500);
    assert.equal(state.count, 1, 'peaks inside the cooldown should not double count');

    state = updateRepCounter(state, 7, 1600);
    state = updateRepCounter(state, 9, 1850);
    state = updateRepCounter(state, 4, 2100);
    assert.equal(state.count, 2);
  });

  test('camera frame motion score measures average pixel change', () => {
    const stillFrame = new Uint8ClampedArray([10, 20, 30, 255, 40, 50, 60, 255]);
    const movedFrame = new Uint8ClampedArray([20, 30, 40, 255, 50, 60, 70, 255]);
    const score = getFrameMotionScore(stillFrame, movedFrame);

    assert.ok(score > 9 && score < 11);
    assert.equal(getFrameMotionScore(stillFrame, new Uint8ClampedArray([1, 2, 3, 4])), 0);
    assert.equal(getFrameMotionScore(new Uint8ClampedArray(), new Uint8ClampedArray()), 0);
  });

  try {
    assert.throws(() => getRoutineProgress('user-c'), SyntaxError);
  } finally {
    if (previousWindow) {
      Object.defineProperty(globalThis, 'window', previousWindow);
    } else {
      Reflect.deleteProperty(globalThis, 'window');
    }
  }
});
