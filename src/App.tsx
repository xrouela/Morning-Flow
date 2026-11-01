import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { useAuthStore } from './store/useAuthStore';
import { MobileFrame } from './components/navigation/MobileFrame';
import { RouteGuard } from './components/navigation/RouteGuard';

export default function App() {
  const { initializeAuth, isDarkMode, signInWithEmail, user } = useAuthStore();

  useEffect(() => {
    initializeAuth().then(() => {
      // Support Ultra-Mode testability requirement: ?autostart=1 skips auth straight to main view
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('autostart') === '1' && !useAuthStore.getState().user) {
          const roleParam = params.get('role');
          if (roleParam === 'admin') {
            signInWithEmail('admin@morningflow.app', 'FlowAdmin2025!');
          } else {
            signInWithEmail('user@morningflow.app', 'MorningFlow2025!');
          }
        }
      }
    });
  }, [initializeAuth, signInWithEmail]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return Capacitor.isNativePlatform() ? (
    <RouteGuard />
  ) : (
    <MobileFrame>
      <RouteGuard />
    </MobileFrame>
  );
}
