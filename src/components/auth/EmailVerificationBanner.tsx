import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { MailCheck, Check, Send, AlertTriangle } from 'lucide-react';

export const EmailVerificationBanner: React.FC = () => {
  const { user, markEmailVerified } = useAuthStore();
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  if (!user || user.isEmailVerified) return null;

  const handleResend = () => {
    setResendStatus('Verification link dispatched to ' + user.email);
    setTimeout(() => setResendStatus(null), 4000);
  };

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 p-3 text-amber-900 dark:text-amber-200 text-xs">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium">Please verify your email address</p>
          <p className="text-[11px] text-amber-700 dark:text-amber-300/80 mt-0.5">
            We sent a verification link to <span className="font-semibold">{user.email}</span>. Confirming your email keeps your morning routine progress secure.
          </p>

          {resendStatus && (
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" />
              {resendStatus}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={handleResend}
              className="px-2.5 py-1 rounded-lg bg-amber-200/80 dark:bg-amber-900/60 hover:bg-amber-300 dark:hover:bg-amber-800 text-[11px] font-medium flex items-center gap-1 transition"
            >
              <Send className="w-3 h-3" />
              Resend Link
            </button>
            <button
              type="button"
              onClick={() => markEmailVerified()}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium flex items-center gap-1 transition"
              title="Demo action to simulate email link click verification"
            >
              <MailCheck className="w-3 h-3" />
              Simulate Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
