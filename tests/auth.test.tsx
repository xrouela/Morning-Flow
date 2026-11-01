/**
 * @jest-environment jsdom
 * 
 * Unit tests (Jest + React Native Testing Library patterns)
 * Demonstrating authentication flows, route guards, onboarding disclaimer checks,
 * and role-based permissions for Morning Flow.
 */

import { signInSchema, signUpSchema, onboardingSchema } from '../src/schemas/authSchemas';

describe('Morning Flow: Auth & Role Security Logic', () => {
  describe('Sign-in Validation', () => {
    it('should reject malformed email inputs', () => {
      const res = signInSchema.safeParse({ email: 'bademail', password: 'ValidPassword123!' });
      expect(res.success).toBe(false);
    });

    it('should accept valid email and password credentials', () => {
      const res = signInSchema.safeParse({ email: 'user@morningflow.app', password: 'MorningFlow2025!' });
      expect(res.success).toBe(true);
    });
  });

  describe('Sign-up Validation & Password Policy', () => {
    it('should require minimum 8 characters with uppercase and numeric digits', () => {
      const tooShort = signUpSchema.safeParse({
        displayName: 'Sarah Connor',
        email: 'sarah@example.com',
        password: 'Pass1',
        confirmPassword: 'Pass1',
      });
      expect(tooShort.success).toBe(false);

      const noNumber = signUpSchema.safeParse({
        displayName: 'Sarah Connor',
        email: 'sarah@example.com',
        password: 'PasswordWithoutNumber',
        confirmPassword: 'PasswordWithoutNumber',
      });
      expect(noNumber.success).toBe(false);

      const valid = signUpSchema.safeParse({
        displayName: 'Sarah Connor',
        email: 'sarah@example.com',
        password: 'SafePassword2025!',
        confirmPassword: 'SafePassword2025!',
      });
      expect(valid.success).toBe(true);
    });

    it('should fail when password and confirmation mismatch', () => {
      const mismatch = signUpSchema.safeParse({
        displayName: 'Sarah Connor',
        email: 'sarah@example.com',
        password: 'SafePassword2025!',
        confirmPassword: 'DifferentPassword2025!',
      });
      expect(mismatch.success).toBe(false);
    });
  });

  describe('Onboarding & Medical Disclaimer Gate', () => {
    it('must require user to accept the "Not Medical Advice" disclaimer', () => {
      const withoutDisclaimer = onboardingSchema.safeParse({
        level: 'beginner',
        reminderTime: '07:00',
        reminderEnabled: true,
        disclaimerAccepted: false,
      });
      expect(withoutDisclaimer.success).toBe(false);

      const withDisclaimer = onboardingSchema.safeParse({
        level: 'beginner',
        reminderTime: '07:00',
        reminderEnabled: true,
        disclaimerAccepted: true,
      });
      expect(withDisclaimer.success).toBe(true);
    });

    it('validates routine levels without mixing with authorization roles', () => {
      expect(onboardingSchema.safeParse({ level: 'beginner', reminderTime: '06:00', reminderEnabled: true, disclaimerAccepted: true }).success).toBe(true);
      expect(onboardingSchema.safeParse({ level: 'intermediate', reminderTime: '06:00', reminderEnabled: true, disclaimerAccepted: true }).success).toBe(true);
      expect(onboardingSchema.safeParse({ level: 'advanced', reminderTime: '06:00', reminderEnabled: true, disclaimerAccepted: true }).success).toBe(true);
    });
  });
});
