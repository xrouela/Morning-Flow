import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { signInSchema } from '../../schemas/authSchemas';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

interface SignInScreenProps {
  onNavigateToSignUp: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ onNavigateToSignUp }) => {
  const { 
    signInWithEmail, 
    signInWithGoogle, 
    signInWithApple, 
    isLoading, 
    error, 
    clearError,
    successMessage,
    clearSuccessMessage
  } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();
    clearSuccessMessage();

    const parseResult = signInSchema.safeParse({ email, password });
    if (!parseResult.success) {
      setValidationError(parseResult.error.issues[0]?.message || 'Please check your inputs.');
      return;
    }

    await signInWithEmail(email, password);
  };

  const fillAdmin = () => {
    setEmail('admin@morningflow.app');
    setPassword('FlowAdmin2025!');
    setValidationError(null);
    clearError();
  };

  const fillUser = () => {
    setEmail('user@morningflow.app');
    setPassword('MorningFlow2025!');
    setValidationError(null);
    clearError();
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-white dark:bg-slate-900 text-stone-900 dark:text-stone-100">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="pt-2 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white shadow-lg shadow-emerald-700/20 mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif font-medium tracking-tight">Morning Flow</h1>
          <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
            Sign in to continue your 30-day movement program
          </p>
        </div>

        {/* Global Feedback Banner */}
        {successMessage && (
          <div 
            role="status" 
            className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between"
          >
            <span>{successMessage}</span>
            <button 
              type="button"
              onClick={clearSuccessMessage} 
              aria-label="Dismiss message"
              className="ml-2 font-bold hover:opacity-75"
            >
              ×
            </button>
          </div>
        )}

        {(validationError || error) && (
          <div 
            role="alert" 
            className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Authentication Error</span>
              <span>{validationError || error?.message}</span>
            </div>
            <button 
              type="button"
              onClick={() => { setValidationError(null); clearError(); }} 
              aria-label="Dismiss error"
              className="font-bold text-rose-600 hover:opacity-75 ml-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="signin-email" className="block text-xs font-medium text-stone-600 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@morningflow.app"
                autoComplete="email"
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-800/70 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="signin-password" className="block text-xs font-medium text-stone-600 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                className="w-full pl-10 pr-11 py-3 rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-800/70 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-slate-200 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[48px] py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 disabled:opacity-60 transition"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill Buttons for Quick Testing */}
        <div className="pt-1">
          <p className="text-[11px] uppercase tracking-wider text-stone-400 dark:text-slate-500 text-center font-medium mb-2">
            Quick Fill Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillAdmin}
              className="py-2 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/60 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Admin Demo
            </button>
            <button
              type="button"
              onClick={fillUser}
              className="py-2 px-3 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-800/60 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-stone-500" />
              User Demo
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200 dark:border-slate-800" />
          </div>
          <span className="relative px-3 bg-white dark:bg-slate-900 text-[11px] text-stone-400 tracking-wider uppercase">
            Or continue with
          </span>
        </div>

        {/* Social Authentication */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            disabled={isLoading}
            className="min-h-[44px] py-2.5 px-3 rounded-2xl border border-stone-200 dark:border-slate-800 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => signInWithApple()}
            disabled={isLoading}
            className="min-h-[44px] py-2.5 px-3 rounded-2xl bg-black dark:bg-stone-800 text-white hover:bg-stone-900 dark:hover:bg-stone-700 text-xs font-medium flex items-center justify-center gap-2 transition"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.3-9.5-11.22-20.2-14.75-32.08-3.53-11.89-5.3-23.2-5.3-33.95 0-14.52 3.66-26.68 10.98-36.48 7.32-9.8 16.63-14.82 27.93-15.06 4.35 0 9.28 1.13 14.78 3.38 5.51 2.26 9.3 3.44 11.39 3.53 1.62 0 5.66-1.28 12.12-3.83 6.47-2.55 11.75-3.68 15.86-3.38 12.23.63 21.99 5.34 29.27 14.12-10.66 6.47-15.87 15.42-15.63 26.85.24 8.98 3.59 16.5 10.05 22.56 6.46 6.06 14.28 9.53 23.46 10.42-2.15 6.47-4.8 12.8-7.95 19zM119.22 33.09c0-6.84 2.45-13.27 7.35-19.28 4.9-6.01 11.08-10.15 18.54-12.42.35 1.3.52 2.62.52 3.96 0 6.77-2.56 13.29-7.69 19.57-5.13 6.28-11.28 10.36-18.45 12.24-.13-1.35-.27-2.7-.27-4.07z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>
      </div>

      {/* Footer Switcher */}
      <div className="pt-6 pb-2 text-center text-xs text-stone-500 dark:text-slate-400">
        Don&apos;t have an account yet?{' '}
        <button
          type="button"
          onClick={onNavigateToSignUp}
          className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline ml-1"
        >
          Sign Up
        </button>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        defaultEmail={email}
      />
    </div>
  );
};
