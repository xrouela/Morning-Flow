import test from 'node:test';
import assert from 'node:assert/strict';
import {
  signInSchema,
  signUpSchema,
  onboardingSchema,
  editProfileSchema,
  changePasswordSchema,
} from '../src/schemas/authSchemas';
import { secureStorage } from '../src/services/secureStorage';
import { useAuthStore } from '../src/store/useAuthStore';
import { INITIAL_ROUTINES } from '../src/services/authService';

test('Zod Schema: Sign In validation passes for valid credentials', () => {
  const result = signInSchema.safeParse({
    email: 'user@morningflow.app',
    password: 'Password123!',
  });
  assert.equal(result.success, true);
});

test('Zod Schema: Sign In rejects invalid email formats', () => {
  const result = signInSchema.safeParse({
    email: 'not-an-email',
    password: 'Password123!',
  });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.match(result.error.issues[0]?.message || '', /valid email/i);
  }
});

test('Zod Schema: Sign Up enforces 8+ chars, uppercase, and numbers', () => {
  const weakResult = signUpSchema.safeParse({
    displayName: 'Test User',
    email: 'test@example.com',
    password: 'weak',
    confirmPassword: 'weak',
  });
  assert.equal(weakResult.success, false);

  const mismatchResult = signUpSchema.safeParse({
    displayName: 'Test User',
    email: 'test@example.com',
    password: 'ValidPassword123',
    confirmPassword: 'DifferentPassword456',
  });
  assert.equal(mismatchResult.success, false);
  if (!mismatchResult.success) {
    assert.equal(mismatchResult.error.issues[0]?.message, 'Passwords do not match');
  }

  const validResult = signUpSchema.safeParse({
    displayName: 'Morning Glow',
    email: 'glow@morningflow.app',
    password: 'StrongPassword2025!',
    confirmPassword: 'StrongPassword2025!',
  });
  assert.equal(validResult.success, true);
});

test('Zod Schema: Onboarding strictly requires "Not Medical Advice" disclaimer acceptance', () => {
  const declinedResult = onboardingSchema.safeParse({
    level: 'beginner',
    reminderTime: '07:00',
    reminderEnabled: true,
    disclaimerAccepted: false,
  });
  assert.equal(declinedResult.success, false);

  const acceptedResult = onboardingSchema.safeParse({
    level: 'intermediate',
    reminderTime: '06:30',
    reminderEnabled: true,
    disclaimerAccepted: true,
  });
  assert.equal(acceptedResult.success, true);
});

test('Zod Schema: Level is a user preference (Beginner, Intermediate, Advanced) and independent of role', () => {
  const levels = ['beginner', 'intermediate', 'advanced'] as const;
  for (const lvl of levels) {
    const res = onboardingSchema.safeParse({
      level: lvl,
      reminderTime: '08:00',
      reminderEnabled: true,
      disclaimerAccepted: true,
    });
    assert.equal(res.success, true);
  }

  const invalidLevel = onboardingSchema.safeParse({
    level: 'master-guru' as any,
    reminderTime: '08:00',
    reminderEnabled: true,
    disclaimerAccepted: true,
  });
  assert.equal(invalidLevel.success, false);
});

test('Zod Schema: Change Password validates current and matching new password', () => {
  const fail = changePasswordSchema.safeParse({
    currentPassword: 'old',
    newPassword: 'NewPassWithoutNumber',
    confirmNewPassword: 'NewPassWithoutNumber',
  });
  assert.equal(fail.success, false);

  const pass = changePasswordSchema.safeParse({
    currentPassword: 'OldPassword123',
    newPassword: 'FreshPassword99',
    confirmNewPassword: 'FreshPassword99',
  });
  assert.equal(pass.success, true);
});

test('Secure Storage: writes, reads, deletes and clears tokens safely', async () => {
  await secureStorage.setItemAsync('test_token', 'jwt_payload_abc123');
  const readBack = await secureStorage.getItemAsync('test_token');
  assert.equal(readBack, 'jwt_payload_abc123');

  await secureStorage.deleteItemAsync('test_token');
  const deleted = await secureStorage.getItemAsync('test_token');
  assert.equal(deleted, null);

  await secureStorage.setItemAsync('session_a', 'data_a');
  await secureStorage.setItemAsync('session_b', 'data_b');
  await secureStorage.clearAllAsync();
  assert.equal(await secureStorage.getItemAsync('session_a'), null);
  assert.equal(await secureStorage.getItemAsync('session_b'), null);
});

test('App Walkthrough Tour: manages dismiss and open tour state correctly', () => {
  const store = useAuthStore.getState();

  // Test opening and dismissing tour
  store.openTour();
  assert.equal(useAuthStore.getState().showAppTour, true);

  store.dismissTour();
  assert.equal(useAuthStore.getState().showAppTour, false);

  store.openTour();
  assert.equal(useAuthStore.getState().showAppTour, true);
});

test('Exercise Video Preview: routines contain valid execution video URLs and form tips', () => {
  const beginner = INITIAL_ROUTINES.find((r) => r.level === 'beginner');
  assert.ok(beginner, 'Beginner routine exists');

  const breathingEx = beginner.exercises.find((e) => e.id === 'ex-1');
  assert.ok(breathingEx, 'Deep diaphragmatic breathing exercise exists');
  assert.equal(breathingEx.videoUrl, '/assets/aistudio/Deep_Diaphragmatic_Breathing_0a11709d.mp4');
  assert.ok(Array.isArray(breathingEx.formTips) && breathingEx.formTips.length > 0);

  const neckEx = beginner.exercises.find((e) => e.id === 'ex-2');
  assert.ok(neckEx, 'Gentle neck tilts exercise exists');
  assert.equal(neckEx.videoUrl, '/assets/aistudio/Gentle_Neck_Tilts___Collarbone_Sweeps_7455cc40.mp4');
  assert.ok(Array.isArray(neckEx.formTips) && neckEx.formTips.length > 0);
});

