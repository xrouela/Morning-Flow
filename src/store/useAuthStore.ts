import { create } from 'zustand';
import { UserProfile, UserRole, RoutineLevel, AuthErrorState } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: UserProfile | null;
  isResolvingAuth: boolean;
  isLoading: boolean;
  error: AuthErrorState | null;
  successMessage: string | null;

  // Navigation & Shell UI State
  activeTab: 'flow' | 'history' | 'settings' | 'admin';
  deviceFrame: 'iphone' | 'android' | 'fullscreen';
  isDarkMode: boolean;
  dynamicTextScale: 'normal' | 'large' | 'extra-large';
  networkSimulationOffline: boolean;
  showAppTour: boolean;

  // Actions
  initializeAuth: () => Promise<void>;
  dismissTour: () => void;
  openTour: () => void;
  signInWithEmail: (email: string, pass: string) => Promise<boolean>;
  signUpWithEmail: (email: string, pass: string, displayName: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signInWithApple: () => Promise<boolean>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  markEmailVerified: () => Promise<void>;
  completeOnboarding: (data: {
    level: RoutineLevel;
    reminderTime: string;
    reminderEnabled: boolean;
    disclaimerAccepted: boolean;
  }) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  changePassword: (currentPass: string, newPass: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  promoteUserRole: (targetEmail: string, newRole: UserRole) => Promise<boolean>;
  clearError: () => void;
  clearSuccessMessage: () => void;
  setActiveTab: (tab: 'flow' | 'history' | 'settings' | 'admin') => void;
  setDeviceFrame: (frame: 'iphone' | 'android' | 'fullscreen') => void;
  toggleDarkMode: () => void;
  setDynamicTextScale: (scale: 'normal' | 'large' | 'extra-large') => void;
  setNetworkSimulationOffline: (offline: boolean) => void;
  setUserLevel: (level: RoutineLevel) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isResolvingAuth: true,
  isLoading: false,
  error: null,
  successMessage: null,

  activeTab: 'flow',
  deviceFrame: 'iphone',
  isDarkMode: false,
  dynamicTextScale: 'normal',
  networkSimulationOffline: false,
  showAppTour: true,

  dismissTour: () => set({ showAppTour: false }),
  openTour: () => set({ showAppTour: true }),

  initializeAuth: async () => {
    set({ isResolvingAuth: true });
    try {
      const persistedUser = await authService.resolveInitialSession();
      set({ user: persistedUser, isResolvingAuth: false });
    } catch (e: any) {
      console.warn('Initial session resolution error:', e);
      set({ user: null, isResolvingAuth: false });
    }
  },

  signInWithEmail: async (email: string, pass: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await authService.signInWithEmailAndPassword(email, pass);
      set({
        user: profile,
        isLoading: false,
        activeTab: 'flow',
        successMessage: `Welcome back, ${profile.displayName}!`,
      });
      return true;
    } catch (e: any) {
      const message = e.message || 'Unable to sign in. Please verify your credentials.';
      const code = e.code || 'auth/unknown';
      set({ isLoading: false, error: { code, message } });
      return false;
    }
  },

  signUpWithEmail: async (email: string, pass: string, displayName: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await authService.signUpWithEmailAndPassword(email, pass, displayName);
      set({
        user: profile,
        isLoading: false,
        activeTab: 'flow',
        successMessage: 'Account created! Please set up your morning routine.',
      });
      return true;
    } catch (e: any) {
      const message = e.message || 'Unable to create account. Please try again.';
      const code = e.code || 'auth/unknown';
      set({ isLoading: false, error: { code, message } });
      return false;
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await authService.signInWithGoogle();
      set({
        user: profile,
        isLoading: false,
        activeTab: 'flow',
        successMessage: `Signed in with Google as ${profile.displayName}`,
      });
      return true;
    } catch (e: any) {
      set({
        isLoading: false,
        error: { code: 'auth/google-error', message: e.message || 'Google sign-in failed' },
      });
      return false;
    }
  },

  signInWithApple: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await authService.signInWithApple();
      set({
        user: profile,
        isLoading: false,
        activeTab: 'flow',
        successMessage: `Signed in with Apple as ${profile.displayName}`,
      });
      return true;
    } catch (e: any) {
      set({
        isLoading: false,
        error: { code: 'auth/apple-error', message: e.message || 'Apple sign-in failed' },
      });
      return false;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
      set({
        user: null,
        isLoading: false,
        activeTab: 'flow',
        successMessage: 'You have been safely signed out.',
      });
    } catch (e: any) {
      set({ isLoading: false, user: null });
    }
  },

  sendPasswordReset: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await authService.sendPasswordResetEmail(email);
      set({
        isLoading: false,
        successMessage: `Password reset link sent to ${email}. Please check your inbox.`,
      });
      return true;
    } catch (e: any) {
      const message = e.message || 'Failed to send password reset email.';
      const code = e.code || 'auth/reset-failed';
      set({ isLoading: false, error: { code, message } });
      return false;
    }
  },

  markEmailVerified: async () => {
    const user = get().user;
    if (!user) return;
    try {
      const updated = await authService.markEmailAsVerified(user.email);
      set({ user: updated, successMessage: 'Email successfully verified!' });
    } catch (e: any) {
      set({ error: { code: 'auth/verify-failed', message: e.message } });
    }
  },

  completeOnboarding: async (data) => {
    const user = get().user;
    if (!user) return false;
    set({ isLoading: true, error: null });
    try {
      const updated = await authService.completeOnboarding(user.email, data);
      set({
        user: updated,
        isLoading: false,
        successMessage: 'Welcome to Morning Flow! Your morning routine is ready.',
      });
      return true;
    } catch (e: any) {
      set({
        isLoading: false,
        error: { code: 'onboarding-failed', message: e.message || 'Failed to save onboarding settings' },
      });
      return false;
    }
  },

  updateProfile: async (updates) => {
    const user = get().user;
    if (!user) return false;
    set({ isLoading: true, error: null });
    try {
      const updated = await authService.updateProfile(user.email, updates);
      set({ user: updated, isLoading: false, successMessage: 'Profile updated successfully!' });
      return true;
    } catch (e: any) {
      set({
        isLoading: false,
        error: { code: 'update-failed', message: e.message || 'Failed to update profile' },
      });
      return false;
    }
  },

  changePassword: async (currentPass: string, newPass: string) => {
    const user = get().user;
    if (!user) return false;
    set({ isLoading: true, error: null });
    try {
      await authService.changePassword(user.email, currentPass, newPass);
      set({ isLoading: false, successMessage: 'Password successfully changed!' });
      return true;
    } catch (e: any) {
      set({
        isLoading: false,
        error: { code: e.code || 'change-password-failed', message: e.message },
      });
      return false;
    }
  },

  deleteAccount: async () => {
    const user = get().user;
    if (!user) return false;
    set({ isLoading: true, error: null });
    try {
      await authService.deleteAccount(user.email);
      set({
        user: null,
        isLoading: false,
        successMessage: 'Your account and personal data have been completely deleted.',
      });
      return true;
    } catch (e: any) {
      set({
        isLoading: false,
        error: { code: 'delete-failed', message: e.message },
      });
      return false;
    }
  },

  promoteUserRole: async (targetEmail: string, newRole: UserRole) => {
    const admin = get().user;
    if (!admin || admin.role !== 'admin') {
      set({
        error: {
          code: 'permission-denied',
          message: 'Security violation: Only administrators can modify role custom claims.',
        },
      });
      return false;
    }
    set({ isLoading: true, error: null });
    try {
      const updated = await authService.setRoleAsAdmin(admin.email, targetEmail, newRole);
      // If admin changed their own role or another user
      if (admin.email.toLowerCase() === targetEmail.toLowerCase()) {
        set({ user: updated });
      }
      set({
        isLoading: false,
        successMessage: `Role for ${targetEmail} updated to "${newRole}". Custom claims applied.`,
      });
      return true;
    } catch (e: any) {
      set({
        isLoading: false,
        error: { code: e.code || 'role-change-failed', message: e.message },
      });
      return false;
    }
  },

  setUserLevel: async (level: RoutineLevel) => {
    const user = get().user;
    if (!user) return;
    try {
      const updated = await authService.updateProfile(user.email, { level });
      set({ user: updated, successMessage: `Level switched to ${level.charAt(0).toUpperCase() + level.slice(1)}` });
    } catch (e) {
      console.error(e);
    }
  },

  clearError: () => set({ error: null }),
  clearSuccessMessage: () => set({ successMessage: null }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setDeviceFrame: (frame) => set({ deviceFrame: frame }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setDynamicTextScale: (scale) => set({ dynamicTextScale: scale }),
  setNetworkSimulationOffline: (offline) => {
    authService.simulateNetworkOffline = offline;
    set({ networkSimulationOffline: offline });
  },
}));
