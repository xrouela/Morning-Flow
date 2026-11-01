import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Sunrise, Calendar, User, ShieldCheck } from 'lucide-react';

export const NativeTabBar: React.FC = () => {
  const { activeTab, setActiveTab, user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <nav 
      aria-label="Bottom Navigation Bar"
      className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-stone-200/80 dark:border-slate-800 px-3 py-1.5 flex items-center justify-around z-40 select-none shadow-[0_-4px_16px_rgba(0,0,0,0.03)]"
    >
      {/* Flow Routine Tab */}
      <button
        type="button"
        onClick={() => setActiveTab('flow')}
        className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl transition ${
          activeTab === 'flow'
            ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
            : 'text-stone-400 dark:text-slate-500 hover:text-stone-700 dark:hover:text-slate-300'
        }`}
        aria-label="Morning Flow Routine Tab"
        aria-current={activeTab === 'flow' ? 'page' : undefined}
      >
        <Sunrise className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Morning Flow</span>
      </button>

      {/* History & Streaks Tab */}
      <button
        type="button"
        onClick={() => setActiveTab('history')}
        className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl transition ${
          activeTab === 'history'
            ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
            : 'text-stone-400 dark:text-slate-500 hover:text-stone-700 dark:hover:text-slate-300'
        }`}
        aria-label="History and Streaks Tab"
        aria-current={activeTab === 'history' ? 'page' : undefined}
      >
        <Calendar className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">History</span>
      </button>

      {/* Admin Tab: STRICTLY rendered ONLY if custom claim role is 'admin' */}
      {isAdmin && (
        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl transition ${
            activeTab === 'admin'
              ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
              : 'text-stone-400 dark:text-slate-500 hover:text-stone-700 dark:hover:text-slate-300'
          }`}
          aria-label="Admin Dashboard Tab"
          aria-current={activeTab === 'admin' ? 'page' : undefined}
        >
          <div className="relative">
            <ShieldCheck className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <span className="text-[10px] tracking-tight">Admin</span>
        </button>
      )}

      {/* Profile & Settings Tab */}
      <button
        type="button"
        onClick={() => setActiveTab('settings')}
        className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl transition ${
          activeTab === 'settings'
            ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
            : 'text-stone-400 dark:text-slate-500 hover:text-stone-700 dark:hover:text-slate-300'
        }`}
        aria-label="Account Settings and Profile Tab"
        aria-current={activeTab === 'settings' ? 'page' : undefined}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Profile</span>
      </button>
    </nav>
  );
};
