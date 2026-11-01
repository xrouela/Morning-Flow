import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { editProfileSchema, changePasswordSchema } from '../../schemas/authSchemas';
import { 
  User, 
  Lock, 
  Clock, 
  ShieldAlert, 
  LogOut, 
  Trash2, 
  Moon, 
  Sun, 
  Type, 
  Check, 
  X, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  WifiOff,
  Wifi,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const ProfileSettingsScreen: React.FC = () => {
  const { 
    user, 
    signOut, 
    updateProfile, 
    changePassword, 
    deleteAccount, 
    isLoading, 
    error, 
    clearError,
    successMessage,
    clearSuccessMessage,
    isDarkMode,
    toggleDarkMode,
    dynamicTextScale,
    setDynamicTextScale,
    networkSimulationOffline,
    setNetworkSimulationOffline,
    openTour,
  } = useAuthStore();

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  // Edit Profile Form State
  const [name, setName] = useState(user?.displayName || '');
  const [reminderTime, setReminderTime] = useState(user?.reminderTime || '07:00');
  const [reminderEnabled, setReminderEnabled] = useState(user?.reminderEnabled ?? true);
  const [profileValidationErr, setProfileValidationErr] = useState<string | null>(null);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordValidationErr, setPasswordValidationErr] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileValidationErr(null);
    clearError();
    clearSuccessMessage();

    const parseResult = editProfileSchema.safeParse({
      displayName: name,
      reminderTime,
      reminderEnabled,
      level: user?.level || 'beginner',
    });

    if (!parseResult.success) {
      setProfileValidationErr(parseResult.error.issues[0]?.message || 'Invalid profile information');
      return;
    }

    const ok = await updateProfile({
      displayName: name,
      reminderTime,
      reminderEnabled,
    });
    if (ok) {
      setIsEditProfileOpen(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordValidationErr(null);
    clearError();
    clearSuccessMessage();

    const parseResult = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    if (!parseResult.success) {
      setPasswordValidationErr(parseResult.error.issues[0]?.message || 'Invalid password details');
      return;
    }

    const ok = await changePassword(currentPassword, newPassword);
    if (ok) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsChangePasswordOpen(false);
    }
  };

  const handleDeleteAccount = async () => {
    clearError();
    clearSuccessMessage();
    await deleteAccount();
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-4 bg-stone-50/50 dark:bg-slate-900/50 text-stone-900 dark:text-stone-100 pb-24">
      {/* Header */}
      <div className="pt-1">
        <span className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold block">
          Settings & Account
        </span>
        <h1 className="text-xl font-serif font-medium">Profile & Preferences</h1>
      </div>

      {/* Global Alerts */}
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
            className="font-bold ml-2 hover:opacity-75"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div 
          role="alert" 
          className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error.message}</span>
          </div>
          <button 
            type="button" 
            onClick={clearError}
            aria-label="Dismiss error" 
            className="font-bold ml-2 hover:opacity-75"
          >
            ×
          </button>
        </div>
      )}

      {/* Profile Card with Custom Claims Role Badge */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-serif text-lg font-bold flex items-center justify-center shadow-md">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm">{user?.displayName}</h2>
              {/* Custom Claim Badge */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                user?.role === 'admin'
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}>
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-slate-400">{user?.email}</p>
            <p className="text-[10px] text-stone-400 mt-0.5 capitalize">
              Routine Level: <span className="font-medium text-emerald-600">{user?.level}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setName(user?.displayName || '');
            setReminderTime(user?.reminderTime || '07:00');
            setReminderEnabled(user?.reminderEnabled ?? true);
            setIsEditProfileOpen(true);
          }}
          className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-700 text-xs font-semibold transition"
        >
          Edit
        </button>
      </div>

      {/* Preferences Section */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500">
          Preferences & Display
        </h3>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            {isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <div>
              <span className="text-xs font-medium block">Appearance</span>
              <span className="text-[10px] text-stone-400">Light / Dark Mode</span>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-slate-700 text-xs font-medium transition hover:bg-stone-200"
          >
            {isDarkMode ? 'Dark' : 'Light'}
          </button>
        </div>

        {/* Dynamic Type Accessibility Scale */}
        <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <Type className="w-4 h-4 text-stone-500" />
            <div>
              <span className="text-xs font-medium block">Dynamic Type Scale</span>
              <span className="text-[10px] text-stone-400">Accessibility font scaling</span>
            </div>
          </div>
          <select
            value={dynamicTextScale}
            onChange={(e) => setDynamicTextScale(e.target.value as any)}
            className="px-2 py-1 rounded-xl bg-stone-100 dark:bg-slate-700 text-xs font-medium text-stone-800 dark:text-slate-200 outline-none"
          >
            <option value="normal">Normal</option>
            <option value="large">Large (+10%)</option>
            <option value="extra-large">Extra Large (+20%)</option>
          </select>
        </div>

        {/* Morning Reminder Details */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="text-xs font-medium block">Morning Prompt</span>
              <span className="text-[10px] text-stone-400">
                {user?.reminderEnabled ? `Daily at ${user?.reminderTime}` : 'Disabled'}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {user?.reminderEnabled ? user.reminderTime : 'Off'}
          </span>
        </div>
      </div>

      {/* Security & Policies Section */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 shadow-sm space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500">
          Security & Compliance
        </h3>

        {/* App Walkthrough Tour Replay */}
        <button
          type="button"
          onClick={openTour}
          className="w-full py-2.5 flex items-center justify-between text-xs hover:text-emerald-600 transition"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <div className="text-left">
              <span className="font-medium block">App Preview & Guided Tour</span>
              <span className="text-[10px] text-stone-400">Revisit features, routine levels & movement guides</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        {/* Change Password */}
        <button
          type="button"
          onClick={() => setIsChangePasswordOpen(true)}
          className="w-full py-2.5 flex items-center justify-between text-xs hover:text-emerald-600 transition border-t border-stone-100 dark:border-slate-700/60"
        >
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-stone-500" />
            <span className="font-medium">Change Password</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        {/* Review Medical Disclaimer */}
        <button
          type="button"
          onClick={() => setIsDisclaimerOpen(true)}
          className="w-full py-2.5 flex items-center justify-between text-xs hover:text-emerald-600 transition border-t border-stone-100 dark:border-slate-700/60"
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-stone-500" />
            <span className="font-medium">Wellness & Medical Disclaimer</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Accepted</span>
        </button>

        {/* Test Offline Mode Simulation */}
        <button
          type="button"
          onClick={() => setNetworkSimulationOffline(!networkSimulationOffline)}
          className="w-full py-2.5 flex items-center justify-between text-xs transition border-t border-stone-100 dark:border-slate-700/60"
        >
          <div className="flex items-center gap-2.5">
            {networkSimulationOffline ? (
              <WifiOff className="w-4 h-4 text-rose-500" />
            ) : (
              <Wifi className="w-4 h-4 text-stone-500" />
            )}
            <div>
              <span className="font-medium">Simulate Network Loss</span>
              <span className="text-[10px] text-stone-400 block">Test offline error handling</span>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            networkSimulationOffline ? 'bg-rose-500 text-white' : 'bg-stone-100 dark:bg-slate-700 text-stone-600'
          }`}>
            {networkSimulationOffline ? 'Offline' : 'Online'}
          </span>
        </button>
      </div>

      {/* Account Actions: Logout & Delete Account */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={() => signOut()}
          disabled={isLoading}
          className="w-full min-h-[48px] py-3 px-4 rounded-2xl border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
        >
          <LogOut className="w-4 h-4 text-stone-500" />
          <span>Sign Out of Morning Flow</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="w-full min-h-[44px] py-2 px-4 rounded-2xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Account & Purge Data</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 id="edit-profile-title" className="text-base font-serif font-semibold">Edit Profile</h2>
              <button 
                type="button"
                aria-label="Close edit profile dialog"
                onClick={() => setIsEditProfileOpen(false)} 
                className="p-1 text-stone-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {profileValidationErr && (
              <p className="text-xs text-rose-500 mb-3">{profileValidationErr}</p>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <div>
                <label htmlFor="edit-name" className="block text-xs font-medium text-stone-600 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-time" className="block text-xs font-medium text-stone-600 dark:text-slate-300 mb-1">
                  Reminder Time
                </label>
                <input
                  id="edit-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 text-xs">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="accent-emerald-600"
                />
                <span>Daily wake-up reminder enabled</span>
              </label>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center justify-center gap-1"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="change-password-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 id="change-password-title" className="text-base font-serif font-semibold">Change Password</h2>
              <button 
                type="button"
                aria-label="Close change password dialog"
                onClick={() => setIsChangePasswordOpen(false)} 
                className="p-1 text-stone-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordValidationErr && (
              <p className="text-xs text-rose-500 mb-3">{passwordValidationErr}</p>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label htmlFor="curr-pass" className="block text-xs font-medium text-stone-600 dark:text-slate-300 mb-1">
                  Current Password
                </label>
                <input
                  id="curr-pass"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="new-pass" className="block text-xs font-medium text-stone-600 dark:text-slate-300 mb-1">
                  New Password (min 8 chars, 1 uppercase, 1 number)
                </label>
                <input
                  id="new-pass"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm-pass" className="block text-xs font-medium text-stone-600 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirm-pass"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center justify-center gap-1"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="delete-account-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h2 id="delete-account-title" className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100">
                Delete Account Permanently?
              </h2>
              <p className="text-xs text-stone-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                This action triggers the <code className="font-mono bg-stone-100 dark:bg-slate-800 px-1 rounded">deleteUserAccount</code> Cloud Function, wiping all streak logs, profile data, and session keys. This cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 text-xs font-semibold"
              >
                Keep Account
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center gap-1"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer Modal */}
      {isDisclaimerOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="disclaimer-modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h2 id="disclaimer-modal-title" className="text-sm font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                Wellness & Medical Disclaimer
              </h2>
              <button 
                type="button"
                aria-label="Close disclaimer dialog"
                onClick={() => setIsDisclaimerOpen(false)} 
                className="p-1 text-stone-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-stone-600 dark:text-slate-300 leading-relaxed">
              Morning Flow is designed solely for healthy adults to support daily lymphatic mobility through gentle movements and diaphragmatic breathing.
            </p>
            <p className="text-stone-600 dark:text-slate-300 leading-relaxed">
              It is not intended to treat, diagnose, or cure lymphedema, deep vein thrombosis, cardiovascular disease, or any medical condition. Always seek medical guidance from a qualified physician.
            </p>
            <button
              type="button"
              onClick={() => setIsDisclaimerOpen(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-medium text-xs mt-2"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
