import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { SplashScreen } from '../auth/SplashScreen';
import { SignInScreen } from '../auth/SignInScreen';
import { SignUpScreen } from '../auth/SignUpScreen';
import { OnboardingScreen } from '../auth/OnboardingScreen';
import { FlowHomeScreen } from '../flow/FlowHomeScreen';
import { HistoryScreen } from '../history/HistoryScreen';
import { ProfileSettingsScreen } from '../profile/ProfileSettingsScreen';
import { AdminDashboardScreen } from '../admin/AdminDashboardScreen';
import { NativeTabBar } from './NativeTabBar';
import { EmailVerificationBanner } from '../auth/EmailVerificationBanner';
import { AppWalkthroughModal } from '../preview/AppWalkthroughModal';

export const RouteGuard: React.FC = () => {
  const { user, isResolvingAuth, activeTab, showAppTour, dismissTour } = useAuthStore();
  const [authScreen, setAuthScreen] = useState<'signin' | 'signup'>('signin');

  // 1. Initial Launch: resolving Firebase Auth persistence state
  if (isResolvingAuth) {
    return <SplashScreen />;
  }

  // 2. Unauthenticated: Auth Stack (Sign In / Sign Up)
  if (!user) {
    if (authScreen === 'signup') {
      return <SignUpScreen onNavigateToSignIn={() => setAuthScreen('signin')} />;
    }
    return <SignInScreen onNavigateToSignUp={() => setAuthScreen('signup')} />;
  }

  // 3. Authenticated but first-time user: Onboarding Flow (Level, Reminder, Medical Disclaimer)
  if (!user.onboardingCompleted) {
    return <OnboardingScreen />;
  }

  // 4. Authenticated: Main App Stack
  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-white dark:bg-slate-900 overflow-hidden relative">
      {/* Post-Login Walkthrough Preview Modal (with Get Started and Skip) */}
      {showAppTour && (
        <AppWalkthroughModal onDismiss={dismissTour} />
      )}

      {/* Email Verification Banner if not yet verified */}
      <EmailVerificationBanner />

      {/* Screen Render based on active Tab */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'flow' && <FlowHomeScreen />}
        {activeTab === 'history' && <HistoryScreen />}
        {activeTab === 'admin' && <AdminDashboardScreen />}
        {activeTab === 'settings' && <ProfileSettingsScreen />}
      </div>

      {/* Bottom Tab Bar (Route guard inside tab bar shows Admin tab ONLY if role == 'admin') */}
      <NativeTabBar />
    </div>
  );
};
