import { MorningRoutine, RoutineExercise, RoutineLevel } from '../types/auth';

export interface DailyRoutinePlan {
  day: number;
  level: RoutineLevel;
  title: string;
  description: string;
  exerciseIds: readonly string[];
}

const exercise = (
  id: string,
  title: string,
  category: RoutineExercise['category'],
  targetArea: string,
  instructions: string,
  breathingCue = 'Breathe comfortably and keep the movement gentle.',
  formTips?: string[],
): RoutineExercise => ({
  id,
  title,
  durationSeconds: 60,
  category,
  targetArea,
  instructions,
  breathingCue,
  ...(formTips ? { formTips } : {}),
});

export const THIRTY_DAY_EXERCISE_LIBRARY: Record<string, RoutineExercise> = {
  'belly-breathing': exercise(
    'belly-breathing',
    'Belly breathing',
    'breathing',
    'Breath and abdomen',
    'Sit or lie comfortably. Inhale through your nose and let your belly expand; exhale slowly through your mouth.',
    'Inhale gently through the nose; make the exhale slow and easy.',
    ['Keep your shoulders relaxed.', 'Use a comfortable breath; do not force or hold it.'],
  ),
  'shoulder-rolls': exercise(
    'shoulder-rolls',
    'Shoulder rolls',
    'lymphatic_activation',
    'Shoulders',
    'Roll your shoulders slowly backward for half the minute, then forward for the other half.',
    'Breathe naturally as you roll.',
  ),
  'arm-circles': exercise(
    'arm-circles',
    'Arm circles',
    'lymphatic_activation',
    'Arms and shoulders',
    'Make small, relaxed circles with both arms. Gradually make the circles larger, then reverse direction.',
    'Keep an easy, steady breath.',
  ),
  'arm-pumps': exercise(
    'arm-pumps',
    'Arm pumps',
    'lymphatic_activation',
    'Arms and shoulders',
    'Bend your elbows and pump your arms gently forward and back, like a slow jog.',
    'Breathe at a comfortable pace.',
  ),
  'loose-arm-swings': exercise(
    'loose-arm-swings',
    'Loose arm swings',
    'lymphatic_activation',
    'Arms and torso',
    'Stand with feet hip-width apart. Let your relaxed arms swing side to side as your torso turns gently.',
    'Let your breath follow the easy rhythm.',
  ),
  'chest-opening-stretch': exercise(
    'chest-opening-stretch',
    'Chest-opening stretch',
    'drainage',
    'Chest and shoulders',
    'Open your arms wide, or clasp your hands behind you if comfortable. Gently draw your shoulder blades together.',
    'Take relaxed breaths; release if your shoulders feel strained.',
  ),
  'neck-side-tilts': exercise(
    'neck-side-tilts',
    'Neck side tilts',
    'drainage',
    'Neck',
    'Sit or stand tall. Gently bring one ear toward the same-side shoulder for 30 seconds, then switch. Keep the range light.',
    'Breathe easily and keep your jaw relaxed.',
    ['Do not pull on your head.', 'Stop if you feel pain, dizziness, or tingling.'],
  ),
  'upper-back-twists': exercise(
    'upper-back-twists',
    'Upper back twists',
    'lymphatic_activation',
    'Upper back',
    'Sit comfortably with your hands on your shoulders. Rotate your upper body slowly from side to side.',
    'Exhale gently as you turn.',
  ),
  'trunk-twists': exercise(
    'trunk-twists',
    'Trunk twists',
    'lymphatic_activation',
    'Torso',
    'Stand with feet hip-width apart and rotate your torso from side to side with relaxed arms.',
    'Keep the movement smooth and breathe normally.',
  ),
  'ankle-pumps': exercise(
    'ankle-pumps',
    'Ankle pumps',
    'lymphatic_activation',
    'Ankles and calves',
    'Sit or lie down and repeatedly point your feet away, then draw your toes back toward your shins.',
    'Breathe naturally while the ankles move.',
  ),
  'heel-raises': exercise(
    'heel-raises',
    'Heel raises',
    'lymphatic_activation',
    'Calves and ankles',
    'Rise onto your toes, then lower your heels slowly. Hold a sturdy chair or counter for balance if helpful.',
    'Breathe steadily; move within a comfortable range.',
  ),
  'marching-in-place': exercise(
    'marching-in-place',
    'Marching in place',
    'lymphatic_activation',
    'Legs and hips',
    'March in place, lifting each knee in a relaxed, steady rhythm. Use a chair for support if needed.',
    'Keep the pace easy enough to talk comfortably.',
  ),
  'armpit-slapping': exercise(
    'armpit-slapping',
    'Gentle armpit tapping',
    'lymphatic_activation',
    'Underarms',
    'Using relaxed, open hands, softly pat the underarm area on each side. Use only light pressure and skip any tender, swollen, or bruised area.',
    'Breathe normally; this is optional gentle self-care, not treatment.',
    ['Do not slap hard or press deeply.', 'Stop if the area is uncomfortable.'],
  ),
  'meridian-tapping': exercise(
    'meridian-tapping',
    'Gentle meridian tapping',
    'lymphatic_activation',
    'Face, torso, arms, and legs',
    'With fingertips, tap lightly under the jaw and face, collarbones, underarms, inner elbows, hip creases, low back, and behind the knees. Skip tender, swollen, or bruised areas.',
    'Keep the tapping light and breathe comfortably. Tapping is optional self-care; evidence for specific effects is limited.',
    ['Never press firmly into a swollen or painful area.', 'Skip any area that is tender, swollen, or bruised.'],
  ),
  'standing-hold': exercise(
    'standing-hold',
    'Standing hold',
    'breathing',
    'Whole body',
    'Stand comfortably with feet hip-width apart and arms by your sides or overhead. Hold a relaxed posture without locking your knees.',
    'Take slow, comfortable breaths.',
  ),
  'seated-hamstring-stretch': exercise(
    'seated-hamstring-stretch',
    'Seated hamstring stretch',
    'drainage',
    'Back of legs',
    'Sit with one leg extended and heel on the floor. Hinge forward gently from your hips with a long back, 30 seconds per side.',
    'Keep breathing; stop short of pain or strong pulling.',
  ),
  seiza: exercise(
    'seiza',
    'Supported seiza rest',
    'breathing',
    'Hips and legs',
    'Kneel and sit back toward your heels with a tall spine and hands on your thighs. Use a cushion under your knees or between your calves and thighs; skip this if kneeling hurts.',
    'Breathe slowly and comfortably.',
  ),
  'legs-up-the-wall': exercise(
    'legs-up-the-wall',
    'Legs up the wall',
    'breathing',
    'Legs',
    'Lie on your back with your legs resting against a wall, only if this position feels comfortable. Move away from the wall if you feel pressure or dizziness.',
    'Rest and breathe naturally. Come out slowly.',
  ),
  'cat-cow': exercise(
    'cat-cow',
    'Cat-cow',
    'lymphatic_activation',
    'Spine and torso',
    'On hands and knees, gently arch your back as you inhale, then round your spine as you exhale. Reduce the range or sit in a chair if needed.',
    'Inhale through the gentle arch; exhale through the gentle rounding.',
  ),
  'standing-side-bends': exercise(
    'standing-side-bends',
    'Standing side bends',
    'lymphatic_activation',
    'Sides of torso',
    'Reach one arm overhead and lean gently to the opposite side for 30 seconds, then switch. Keep both feet grounded.',
    'Breathe easily; do not force the stretch.',
  ),
  'thoracic-spine-rotation': exercise(
    'thoracic-spine-rotation',
    'Thoracic spine rotation (open book)',
    'lymphatic_activation',
    'Upper back and chest',
    'Lie on your side with knees comfortably bent. Slowly open your top arm behind you while keeping your hips still; switch sides halfway.',
    'Exhale gently as your arm opens.',
  ),
  'good-morning-hip-hinge': exercise(
    'good-morning-hip-hinge',
    'Good morning hip hinge',
    'lymphatic_activation',
    'Hips and back of legs',
    'Stand with soft knees and hands behind your head or on your hips. Push your hips back with a long, comfortable spine, then return to standing.',
    'Exhale as you stand; use a small range.',
  ),
  'bodyweight-squats': exercise(
    'bodyweight-squats',
    'Bodyweight squats',
    'lymphatic_activation',
    'Hips and legs',
    'Sit your hips back and bend your knees only as far as comfortable, then return to standing. Use a chair for support or reduce the depth.',
    'Exhale as you stand; keep knees comfortable.',
  ),
  'high-knee-march': exercise(
    'high-knee-march',
    'High-knee march',
    'lymphatic_activation',
    'Hips and legs',
    'March with a slightly quicker rhythm, lifting the knees only as high as comfortable and letting your arms swing naturally.',
    'Slow down if you cannot breathe comfortably.',
  ),
  'slow-calf-raises': exercise(
    'slow-calf-raises',
    'Slow calf raises',
    'lymphatic_activation',
    'Calves and ankles',
    'Rise onto your toes, pause briefly, and lower slowly. Hold a sturdy support for balance.',
    'Breathe steadily and avoid locking your knees.',
  ),
  'wall-angels': exercise(
    'wall-angels',
    'Wall angels',
    'lymphatic_activation',
    'Shoulders and upper back',
    'Stand with your back near a wall and slide your arms up and down like a snow angel, staying within a pain-free range.',
    'Keep your shoulders relaxed; do not force your arms to touch the wall.',
  ),
  'hip-circles': exercise(
    'hip-circles',
    'Hip circles',
    'lymphatic_activation',
    'Hips and pelvis',
    'Stand with hands on your hips and make slow circles with your pelvis. Change direction halfway and hold support if needed.',
    'Keep the circles small and comfortable.',
  ),
  'knee-touches': exercise(
    'knee-touches',
    'Alternating knee touches',
    'lymphatic_activation',
    'Hips and torso',
    'Lift one knee toward the opposite hand or elbow, then alternate sides. The hand does not need to touch the knee.',
    'Exhale gently with each knee lift.',
  ),
  'body-waves': exercise(
    'body-waves',
    'Body waves',
    'lymphatic_activation',
    'Whole body',
    'With soft knees, make a small, slow wave through your knees, hips, and spine. Keep the motion comfortable and reverse if it feels natural.',
    'Let your breathing stay easy and unforced.',
  ),
  'lymphatic-hops': exercise(
    'lymphatic-hops',
    'Low-impact lymphatic hops',
    'rebound',
    'Legs and whole body',
    'Make very small, gentle bounces with soft knees, or keep your feet on the floor and rise onto your toes instead.',
    'Choose the no-jump option for balance or joint concerns.',
    ['Use a stable support if needed.', 'Stop for pain, dizziness, or unsteadiness.'],
  ),
  'marching-knee-slaps': exercise(
    'marching-knee-slaps',
    'Marching knee taps',
    'lymphatic_activation',
    'Hips and arms',
    'March in place and bring each hand toward its same-side knee. A light touch is enough; no slapping is needed.',
    'Keep a steady, comfortable rhythm.',
  ),
  'windmill-push-side': exercise(
    'windmill-push-side',
    'Windmill / side reach',
    'lymphatic_activation',
    'Torso and sides',
    'Stand with feet wide. Hinge only as far as comfortable, reaching one hand toward the opposite foot while the other arm lifts. Alternate sides. If preferred, slide a hand down the same-side leg for a gentle side bend.',
    'Exhale as you reach; keep knees soft and back comfortable.',
  ),
  'plie-squats': exercise(
    'plie-squats',
    'Plié squats',
    'lymphatic_activation',
    'Hips and legs',
    'Stand with a comfortable wide stance and toes turned slightly outward. Bend your knees gently in line with your toes, then rise.',
    'Use a shallow range and hold support if needed.',
  ),
  'golf-swings': exercise(
    'golf-swings',
    'Gentle golf swings',
    'lymphatic_activation',
    'Torso and shoulders',
    'Stand with feet comfortably apart and swing your arms in a smooth arc from shoulder to shoulder as your torso turns. Switch direction halfway.',
    'Keep the swing easy; exhale gently through each turn.',
  ),
  'hurdler-stretch': exercise(
    'hurdler-stretch',
    'Supported hurdler stretch',
    'drainage',
    'Back of legs and hips',
    'Sit with one leg extended and the other bent comfortably. Hinge toward the extended leg for 30 seconds, then switch. Use support and do not force the bent knee.',
    'Breathe easily and stay within a comfortable range.',
  ),
  rebounding: exercise(
    'rebounding',
    'Gentle rebounding',
    'rebound',
    'Legs and whole body',
    'On a mini-trampoline or the floor, bounce very gently with soft knees. For a lower-impact option, keep your feet down and gently shift your weight.',
    'Keep the movement small; stop if you feel unsteady.',
    ['Skip jumping if you have balance, joint, blood-pressure, or pregnancy-related concerns.', 'Use a stable support if appropriate.'],
  ),
  'sun-salutation': exercise(
    'sun-salutation',
    'Modified sun salutation',
    'lymphatic_activation',
    'Whole body',
    'Link a comfortable standing pose, overhead reach, supported forward hinge, and gentle step-back. Skip plank or floor transitions that do not suit you.',
    'Move with your breath; never strain to match a pose.',
  ),
  'downward-dog': exercise(
    'downward-dog',
    'Supported downward dog',
    'drainage',
    'Shoulders and back of legs',
    'From hands and knees, lift your hips gently toward an inverted V, or keep your hands on a wall or chair for a standing version. Avoid this inversion if it is not suitable for you.',
    'Breathe slowly; come out if you feel pressure or dizziness.',
    ['Use the wall or chair variation as needed.', 'Skip inversions if they are unsuitable for you.'],
  ),
  'walking-lunge-twist': exercise(
    'walking-lunge-twist',
    'Walking lunge with gentle twist',
    'lymphatic_activation',
    'Hips and torso',
    'Step into a short, supported lunge and turn your torso gently toward the front leg. Return to center and switch sides; shorten the step as needed.',
    'Keep balance supported and avoid twisting through pain.',
  ),
  'glute-bridge-breath': exercise(
    'glute-bridge-breath',
    'Glute bridge with breath',
    'lymphatic_activation',
    'Hips and glutes',
    'Lie on your back with knees bent. Exhale as you gently lift your hips, pause briefly, and lower slowly. Use a small range.',
    'Exhale to lift; do not hold your breath.',
  ),
  'deep-squat-overhead-reach': exercise(
    'deep-squat-overhead-reach',
    'Comfortable squat to overhead reach',
    'lymphatic_activation',
    'Hips, legs, and shoulders',
    'Lower only into a comfortable shallow squat, then stand and reach your arms overhead. Use a chair for support and skip the squat if needed.',
    'Exhale as you stand; do not force depth or range.',
  ),
  'side-lunges': exercise(
    'side-lunges',
    'Side lunges',
    'lymphatic_activation',
    'Hips and legs',
    'Step gently to one side, bend that knee slightly while the other leg stays comfortable, then return to center. Switch sides halfway.',
    'Use a small step and hold support if needed.',
  ),
  'warrior-two-side-angle-flow': exercise(
    'warrior-two-side-angle-flow',
    'Warrior II to side-angle flow',
    'lymphatic_activation',
    'Hips, torso, and shoulders',
    'Move gently between a supported Warrior II stance and a shallow side-angle reach. Switch sides halfway; shorten the stance as needed.',
    'Move with a calm breath and avoid forcing the hips or shoulders.',
  ),
  'plank-shoulder-taps': exercise(
    'plank-shoulder-taps',
    'Supported plank shoulder taps',
    'lymphatic_activation',
    'Shoulders and core',
    'From a wall, counter, or knee-supported plank, slowly lift one hand toward the opposite shoulder and alternate. Choose a height that feels stable.',
    'Breathe continuously; stop if your wrists or shoulders hurt.',
  ),
  'jump-twists': exercise(
    'jump-twists',
    'Step twists or gentle jump twists',
    'rebound',
    'Legs and torso',
    'For a low-impact option, step and turn gently side to side. Only if comfortable and appropriate, add a tiny jump and land softly with bent knees.',
    'Choose the step option for balance, joint, blood-pressure, or pregnancy-related concerns.',
    ['Jumping is optional; stepping is a complete alternative.', 'Stop if you feel pain, dizziness, or unsteadiness.'],
  ),
  'ballet-squat': exercise(
    'ballet-squat',
    'Supported ballet squat',
    'lymphatic_activation',
    'Hips and legs',
    'Stand with heels close and toes turned out only as far as comfortable. Bend into a shallow plié, then rise; skip the heel raise if balance is uncertain.',
    'Hold a stable support and do not force turnout or depth.',
  ),
  'horse-stance': exercise(
    'horse-stance',
    'Supported horse stance',
    'lymphatic_activation',
    'Hips and legs',
    'Take a comfortable wide stance with toes slightly outward. Bend your knees a little and hold, using a chair or counter for support.',
    'Breathe steadily; keep knees comfortable and aligned.',
  ),
  'cossack-squat': exercise(
    'cossack-squat',
    'Supported Cossack shift',
    'lymphatic_activation',
    'Hips and legs',
    'Stand wide and shift gently toward one bent knee while keeping the other leg comfortable. Use a shallow side-to-side weight shift and hold support.',
    'Stay within your comfortable range; no deep squat is required.',
  ),
  split: exercise(
    'split',
    'Supported split stretch alternative',
    'drainage',
    'Hips and legs',
    'Choose a supported low lunge or wide seated stretch instead of sliding into a split. Use your hands or blocks and keep the stretch mild. Never force a split.',
    'Breathe easily and stop before pain.',
    ['A full split is not required.', 'Never force a stretch; use a supported alternative.'],
  ),
};

const days: Array<[number, string[]]> = [
  [1, ['belly-breathing', 'shoulder-rolls', 'arm-circles', 'arm-pumps', 'loose-arm-swings', 'chest-opening-stretch', 'ankle-pumps', 'heel-raises', 'marching-in-place', 'legs-up-the-wall']],
  [2, ['belly-breathing', 'neck-side-tilts', 'shoulder-rolls', 'upper-back-twists', 'trunk-twists', 'armpit-slapping', 'heel-raises', 'marching-in-place', 'seated-hamstring-stretch', 'seiza']],
  [3, ['standing-hold', 'belly-breathing', 'arm-circles', 'arm-pumps', 'chest-opening-stretch', 'trunk-twists', 'ankle-pumps', 'marching-in-place', 'seated-hamstring-stretch', 'legs-up-the-wall']],
  [4, ['belly-breathing', 'meridian-tapping', 'neck-side-tilts', 'armpit-slapping', 'loose-arm-swings', 'upper-back-twists', 'heel-raises', 'standing-hold', 'seiza', 'legs-up-the-wall']],
  [5, ['standing-hold', 'shoulder-rolls', 'arm-pumps', 'trunk-twists', 'loose-arm-swings', 'armpit-slapping', 'marching-in-place', 'heel-raises', 'seated-hamstring-stretch', 'belly-breathing']],
  [6, ['belly-breathing', 'neck-side-tilts', 'arm-circles', 'chest-opening-stretch', 'upper-back-twists', 'meridian-tapping', 'ankle-pumps', 'marching-in-place', 'seiza', 'legs-up-the-wall']],
  [7, ['standing-hold', 'shoulder-rolls', 'arm-circles', 'loose-arm-swings', 'trunk-twists', 'armpit-slapping', 'heel-raises', 'marching-in-place', 'seated-hamstring-stretch', 'belly-breathing']],
  [8, ['belly-breathing', 'meridian-tapping', 'arm-pumps', 'chest-opening-stretch', 'upper-back-twists', 'trunk-twists', 'ankle-pumps', 'heel-raises', 'seiza', 'legs-up-the-wall']],
  [9, ['standing-hold', 'neck-side-tilts', 'shoulder-rolls', 'arm-circles', 'armpit-slapping', 'loose-arm-swings', 'marching-in-place', 'heel-raises', 'seated-hamstring-stretch', 'legs-up-the-wall']],
  [10, ['belly-breathing', 'shoulder-rolls', 'arm-pumps', 'trunk-twists', 'chest-opening-stretch', 'armpit-slapping', 'marching-in-place', 'heel-raises', 'seiza', 'legs-up-the-wall']],
  [11, ['belly-breathing', 'shoulder-rolls', 'cat-cow', 'thoracic-spine-rotation', 'standing-side-bends', 'trunk-twists', 'knee-touches', 'bodyweight-squats', 'seated-hamstring-stretch', 'legs-up-the-wall']],
  [12, ['standing-hold', 'arm-circles', 'body-waves', 'marching-knee-slaps', 'armpit-slapping', 'good-morning-hip-hinge', 'plie-squats', 'slow-calf-raises', 'seiza', 'belly-breathing']],
  [13, ['belly-breathing', 'wall-angels', 'cat-cow', 'windmill-push-side', 'golf-swings', 'hip-circles', 'bodyweight-squats', 'high-knee-march', 'hurdler-stretch', 'legs-up-the-wall']],
  [14, ['standing-hold', 'shoulder-rolls', 'thoracic-spine-rotation', 'knee-touches', 'marching-knee-slaps', 'lymphatic-hops', 'plie-squats', 'slow-calf-raises', 'seated-hamstring-stretch', 'seiza']],
  [15, ['belly-breathing', 'meridian-tapping', 'cat-cow', 'standing-side-bends', 'body-waves', 'golf-swings', 'good-morning-hip-hinge', 'bodyweight-squats', 'hurdler-stretch', 'legs-up-the-wall']],
  [16, ['standing-hold', 'wall-angels', 'windmill-push-side', 'trunk-twists', 'armpit-slapping', 'high-knee-march', 'lymphatic-hops', 'plie-squats', 'seated-hamstring-stretch', 'belly-breathing']],
  [17, ['belly-breathing', 'hip-circles', 'thoracic-spine-rotation', 'knee-touches', 'marching-knee-slaps', 'golf-swings', 'bodyweight-squats', 'slow-calf-raises', 'hurdler-stretch', 'seiza']],
  [18, ['standing-hold', 'cat-cow', 'body-waves', 'windmill-push-side', 'standing-side-bends', 'high-knee-march', 'lymphatic-hops', 'good-morning-hip-hinge', 'seated-hamstring-stretch', 'legs-up-the-wall']],
  [19, ['belly-breathing', 'arm-circles', 'wall-angels', 'armpit-slapping', 'golf-swings', 'plie-squats', 'marching-knee-slaps', 'knee-touches', 'hurdler-stretch', 'seiza']],
  [20, ['belly-breathing', 'cat-cow', 'thoracic-spine-rotation', 'body-waves', 'windmill-push-side', 'golf-swings', 'plie-squats', 'lymphatic-hops', 'hurdler-stretch', 'legs-up-the-wall']],
  [21, ['belly-breathing', 'shoulder-rolls', 'body-waves', 'rebounding', 'jump-twists', 'ballet-squat', 'deep-squat-overhead-reach', 'armpit-slapping', 'seated-hamstring-stretch', 'legs-up-the-wall']],
  [22, ['standing-hold', 'cat-cow', 'sun-salutation', 'downward-dog', 'walking-lunge-twist', 'glute-bridge-breath', 'horse-stance', 'hurdler-stretch', 'seiza', 'legs-up-the-wall']],
  [23, ['belly-breathing', 'arm-circles', 'golf-swings', 'windmill-push-side', 'cossack-squat', 'side-lunges', 'ballet-squat', 'marching-knee-slaps', 'seated-hamstring-stretch', 'seiza']],
  [24, ['standing-hold', 'body-waves', 'rebounding', 'jump-twists', 'plank-shoulder-taps', 'downward-dog', 'deep-squat-overhead-reach', 'horse-stance', 'hurdler-stretch', 'legs-up-the-wall']],
  [25, ['belly-breathing', 'thoracic-spine-rotation', 'sun-salutation', 'warrior-two-side-angle-flow', 'cossack-squat', 'walking-lunge-twist', 'glute-bridge-breath', 'armpit-slapping', 'split', 'legs-up-the-wall']],
  [26, ['standing-hold', 'shoulder-rolls', 'rebounding', 'jump-twists', 'ballet-squat', 'horse-stance', 'side-lunges', 'plank-shoulder-taps', 'seated-hamstring-stretch', 'seiza']],
  [27, ['belly-breathing', 'cat-cow', 'body-waves', 'golf-swings', 'windmill-push-side', 'cossack-squat', 'deep-squat-overhead-reach', 'warrior-two-side-angle-flow', 'split', 'legs-up-the-wall']],
  [28, ['standing-hold', 'meridian-tapping', 'sun-salutation', 'downward-dog', 'walking-lunge-twist', 'ballet-squat', 'horse-stance', 'hurdler-stretch', 'split', 'seiza']],
  [29, ['belly-breathing', 'arm-circles', 'rebounding', 'jump-twists', 'cossack-squat', 'side-lunges', 'plank-shoulder-taps', 'glute-bridge-breath', 'seated-hamstring-stretch', 'legs-up-the-wall']],
  [30, ['standing-hold', 'body-waves', 'sun-salutation', 'warrior-two-side-angle-flow', 'ballet-squat', 'horse-stance', 'cossack-squat', 'split', 'hurdler-stretch', 'legs-up-the-wall']],
];

export const THIRTY_DAY_ROUTINE_PLANS: DailyRoutinePlan[] = days.map(([day, exerciseIds]) => {
  const level: RoutineLevel = day <= 10 ? 'beginner' : day <= 20 ? 'intermediate' : 'advanced';
  return {
    day,
    level,
    title: `Day ${day} · ${level.charAt(0).toUpperCase()}${level.slice(1)} Flow`,
    description:
      day <= 10
        ? 'A low-effort seated or standing sequence to build the habit and learn breath-led movement.'
        : day <= 20
          ? 'A progressive sequence with gentle rotation, larger muscle groups, and coordination.'
          : 'A more challenging sequence. Warm up with the first two movements and use the low-impact options.',
    exerciseIds,
  };
});

export const ROUTINE_SAFETY_NOTES = [
  'Rebounding, inversions, and jumping may not be suitable for everyone, including people with blood-pressure, balance, joint, or pregnancy-related concerns. Use the low-impact options or skip a move.',
  'If you have lymphedema, swelling after cancer treatment, or persistent or one-sided swelling, check with a doctor or certified lymphedema therapist before starting.',
  'This routine is general wellness guidance, not medical treatment or a detox. Stop if you feel pain, dizziness, or unusual discomfort.',
  'The levels and timings are suggestions. Adjust to your comfort, repeat a phase if helpful, and never force a stretch or movement.',
];

export function getDailyRoutine(day: number): MorningRoutine {
  const plan = THIRTY_DAY_ROUTINE_PLANS.find((item) => item.day === day);
  if (!plan) {
    throw new RangeError(`Routine day must be between 1 and ${THIRTY_DAY_ROUTINE_PLANS.length}.`);
  }

  const exercises = plan.exerciseIds.map((id) => {
    const item = THIRTY_DAY_EXERCISE_LIBRARY[id];
    if (!item) {
      throw new Error(`Exercise "${id}" for day ${day} is not defined in the routine library.`);
    }
    return item;
  });

  return {
    id: `routine-day-${day}`,
    level: plan.level,
    title: plan.title,
    description: plan.description,
    totalDurationSeconds: exercises.reduce((total, item) => total + item.durationSeconds, 0),
    exercises,
  };
}

export function getTiredDayRoutine(routine: MorningRoutine): MorningRoutine {
  const exercises = [routine.exercises[0], routine.exercises[1], routine.exercises[2], routine.exercises[9]];
  if (exercises.some((item) => !item)) {
    throw new Error(`Routine "${routine.id}" does not contain all 10 required exercises.`);
  }

  return {
    ...routine,
    id: `${routine.id}-tired-day`,
    title: `${routine.title} · Short Flow`,
    description: 'A shorter option from the 30-day plan: the first three exercises and the final rest/stretch.',
    totalDurationSeconds: exercises.reduce((total, item) => total + item.durationSeconds, 0),
    exercises,
  };
}
