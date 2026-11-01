import React from 'react';
import { Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-emerald-50 via-stone-50 to-amber-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950/20 text-center select-none">
      {/* Radiant Lymphatic Ripple / Dawn Ring */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="w-28 h-28 rounded-full bg-emerald-200/40 dark:bg-emerald-500/10 animate-ping absolute" />
        <div className="w-24 h-24 rounded-full bg-emerald-300/30 dark:bg-emerald-500/20 animate-pulse absolute" />
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-xl flex items-center justify-center text-white relative">
          <Sparkles className="w-10 h-10 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
      </div>

      <h1 className="text-2xl font-serif font-medium tracking-tight text-stone-900 dark:text-stone-100 mb-2">
        Morning Flow
      </h1>
      <p className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold mb-6">
        30-Day Morning Movement
      </p>

      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Resolving secure session...</span>
      </div>
    </div>
  );
};
