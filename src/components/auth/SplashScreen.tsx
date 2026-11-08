import React from 'react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-emerald-50 via-stone-50 to-amber-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950/20 text-center select-none">
      <div className="relative mb-8 flex items-center justify-center">
        <div className="w-32 h-32 rounded-[32px] bg-white/80 shadow-[0_18px_40px_rgba(16,185,129,0.18)] ring-1 ring-emerald-100 dark:ring-emerald-900/40 flex items-center justify-center p-3">
          <img
            src="/morning-flow-icon.png"
            alt="Morning Flow logo"
            className="h-full w-full object-contain"
          />
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
