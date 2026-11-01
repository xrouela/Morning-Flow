export interface RepCounterState {
  count: number;
  previousScore: number;
  candidatePeak: number;
  candidatePeakAt: number;
  lastCountAt: number;
}

export const createRepCounterState = (): RepCounterState => ({
  count: 0,
  previousScore: 0,
  candidatePeak: 0,
  candidatePeakAt: 0,
  lastCountAt: Number.NEGATIVE_INFINITY,
});

export function updateRepCounter(
  state: RepCounterState,
  motionScore: number,
  timestamp: number,
): RepCounterState {
  const next = { ...state };
  const motionThreshold = 5;

  if (state.previousScore >= motionThreshold && motionScore < state.previousScore) {
    if (
      state.candidatePeak >= motionThreshold &&
      timestamp - state.lastCountAt >= 900
    ) {
      next.count += 1;
      next.lastCountAt = timestamp;
    }
    next.candidatePeak = 0;
  } else if (motionScore >= motionThreshold && motionScore > state.candidatePeak) {
    next.candidatePeak = motionScore;
    next.candidatePeakAt = timestamp;
  } else if (
    state.candidatePeak > 0 &&
    timestamp - state.candidatePeakAt > 1200
  ) {
    next.candidatePeak = 0;
  }

  next.previousScore = motionScore;
  return next;
}

export function getFrameMotionScore(
  previousFrame: Uint8ClampedArray,
  currentFrame: Uint8ClampedArray,
): number {
  if (previousFrame.length !== currentFrame.length || previousFrame.length === 0) {
    return 0;
  }

  let totalDifference = 0;
  for (let index = 0; index < previousFrame.length; index += 4) {
    const previousLuma =
      previousFrame[index] * 0.299 +
      previousFrame[index + 1] * 0.587 +
      previousFrame[index + 2] * 0.114;
    const currentLuma =
      currentFrame[index] * 0.299 +
      currentFrame[index + 1] * 0.587 +
      currentFrame[index + 2] * 0.114;
    totalDifference += Math.abs(currentLuma - previousLuma);
  }

  return totalDifference / (previousFrame.length / 4);
}
