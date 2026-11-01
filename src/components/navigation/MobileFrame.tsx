import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  Smartphone, 
  Moon, 
  Sun, 
  Type, 
  Wifi, 
  BatteryMedium, 
  Maximize2, 
  Minimize2,
  ShieldCheck,
  UserCheck,
  WifiOff
} from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { 
    isDarkMode, 
    toggleDarkMode, 
    deviceFrame, 
    setDeviceFrame, 
    dynamicTextScale, 
    setDynamicTextScale,
    networkSimulationOffline,
    setNetworkSimulationOffline,
    user,
    signInWithEmail,
  } = useAuthStore();

  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours % 12 || 12}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const getScaleClass = () => {
    switch (dynamicTextScale) {
      case 'large':
        return 'text-[110%] leading-relaxed';
      case 'extra-large':
        return 'text-[120%] leading-loose';
      default:
        return 'text-base';
    }
  };

  const fillAdmin = async () => {
    await signInWithEmail('admin@morningflow.app', 'FlowAdmin2025!');
  };

  const fillUser = async () => {
    await signInWithEmail('user@morningflow.app', 'MorningFlow2025!');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-stone-100 text-stone-900'
    }`}>
      {/* Top Testing & Accessibility Utility Bar */}
      <header className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-4 px-3 py-2.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-stone-200/80 dark:border-slate-800 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wide flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Morning Flow Mobile Shell
          </span>
          <span className="hidden sm:inline text-stone-400 dark:text-slate-600">|</span>
          <span className="hidden sm:inline text-stone-500 dark:text-slate-400">
            Expo Managed Workflow • Feature 1: Auth & RBAC
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Quick Demo Logins for fast tester switching */}
          {!user && (
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={fillAdmin}
                className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition flex items-center gap-1"
                title="Log in with pre-seeded Admin account (Elena Vance)"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Demo
              </button>
              <button
                type="button"
                onClick={fillUser}
                className="px-2 py-1 rounded-lg bg-stone-200 dark:bg-slate-700 text-stone-800 dark:text-slate-200 font-medium hover:bg-stone-300 dark:hover:bg-slate-600 transition flex items-center gap-1"
                title="Log in with pre-seeded User account (Marcus Sterling)"
              >
                <UserCheck className="w-3.5 h-3.5" />
                User Demo
              </button>
            </div>
          )}

          {/* Network Offline Simulation Toggle */}
          <button
            type="button"
            onClick={() => setNetworkSimulationOffline(!networkSimulationOffline)}
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
              networkSimulationOffline 
                ? 'bg-rose-500 text-white border-rose-600 font-medium animate-bounce' 
                : 'border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-600 dark:text-slate-300'
            }`}
            title="Simulate network offline failure for error handling verification"
          >
            {networkSimulationOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            {networkSimulationOffline ? 'Offline Mode Active' : 'Simulate Offline'}
          </button>

          {/* Dynamic Type Accessibility Scale */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-slate-800 px-2 py-1 rounded-xl">
            <Type className="w-3.5 h-3.5 text-stone-500 dark:text-slate-400" />
            <select
              aria-label="Dynamic Type Size"
              value={dynamicTextScale}
              onChange={(e) => setDynamicTextScale(e.target.value as any)}
              className="bg-transparent text-xs font-medium outline-none cursor-pointer text-stone-700 dark:text-slate-300"
            >
              <option value="normal" className="bg-white dark:bg-slate-900">Type: Normal</option>
              <option value="large" className="bg-white dark:bg-slate-900">Type: Large (+10%)</option>
              <option value="extra-large" className="bg-white dark:bg-slate-900">Type: XL (+20%)</option>
            </select>
          </div>

          {/* Frame Style Toggle */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              aria-label="iPhone Device Frame"
              onClick={() => setDeviceFrame('iphone')}
              className={`p-1.5 rounded-lg transition ${
                deviceFrame === 'iphone' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-stone-500'
              }`}
              title="iPhone Viewport Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              aria-label="Responsive View"
              onClick={() => setDeviceFrame(deviceFrame === 'fullscreen' ? 'iphone' : 'fullscreen')}
              className={`p-1.5 rounded-lg transition ${
                deviceFrame === 'fullscreen' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-stone-500'
              }`}
              title="Fullscreen / Responsive Viewport"
            >
              {deviceFrame === 'fullscreen' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            aria-label="Toggle Dark and Light Mode"
            onClick={toggleDarkMode}
            className="p-1.5 rounded-xl border border-stone-300 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-600 dark:text-slate-300 transition"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* Main Device Container */}
      <div className={`w-full flex justify-center transition-all duration-300 ${getScaleClass()}`}>
        {deviceFrame === 'fullscreen' ? (
          <main className="w-full max-w-xl min-h-[780px] bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-stone-200 dark:border-slate-800 flex flex-col relative">
            {children}
          </main>
        ) : (
          <div className="relative w-full max-w-[400px] h-[820px] bg-slate-900 rounded-[52px] p-3 shadow-2xl ring-1 ring-slate-800 shadow-emerald-950/20 flex flex-col">
            {/* Phone Outer Edge & Dynamic Island */}
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[42px] overflow-hidden flex flex-col relative border border-slate-700/30">
              
              {/* Native iOS Status Bar */}
              <div className="w-full pt-3 px-6 pb-2 flex items-center justify-between text-xs font-semibold text-stone-800 dark:text-stone-200 z-50 select-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <span>{currentTime}</span>
                {/* Dynamic Island pill */}
                <div className="w-24 h-5 bg-black rounded-full mx-auto flex items-center justify-end px-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5" />
                  <BatteryMedium className="w-4 h-4" />
                </div>
              </div>

              {/* Offline Banner indicator if simulated */}
              {networkSimulationOffline && (
                <div className="w-full bg-rose-600 text-white text-[11px] font-medium py-1 px-3 text-center flex items-center justify-center gap-1.5 z-40">
                  <WifiOff className="w-3 h-3" />
                  Offline Mode Active — Testing Network Error Handling
                </div>
              )}

              {/* Viewport Content */}
              <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative">
                {children}
              </div>

              {/* Native Home Indicator Bar */}
              <div className="w-full pb-2 pt-1 flex justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm z-40 pointer-events-none">
                <div className="w-32 h-1 bg-stone-300 dark:bg-slate-700 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
