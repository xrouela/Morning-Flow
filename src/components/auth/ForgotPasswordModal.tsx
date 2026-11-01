import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { forgotPasswordSchema } from '../../schemas/authSchemas';
import { X, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
}) => {
  const { sendPasswordReset, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState(defaultEmail);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    const parseResult = forgotPasswordSchema.safeParse({ email });
    if (!parseResult.success) {
      setValidationError(parseResult.error.issues[0]?.message || 'Invalid email');
      return;
    }

    const success = await sendPasswordReset(email);
    if (success) {
      setSentSuccess(true);
    }
  };

  const handleClose = () => {
    setSentSuccess(false);
    setValidationError(null);
    clearError();
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-slate-800 text-stone-900 dark:text-stone-100">
        <div className="flex items-center justify-between mb-4">
          <h2 id="forgot-password-title" className="text-lg font-serif font-medium">Reset Password</h2>
          <button
            type="button"
            aria-label="Close modal"
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-sm">Recovery Link Sent</p>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
                We sent a secure password reset link to <span className="font-semibold">{email}</span>. Please check your inbox and spam folder.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-stone-500 dark:text-slate-400">
              Enter your registered email address to receive instructions on resetting your Morning Flow password.
            </p>

            {(validationError || error) && (
              <div 
                role="alert" 
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{validationError || error?.message}</span>
              </div>
            )}

            <div>
              <label htmlFor="reset-email" className="block text-xs font-medium text-stone-600 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
