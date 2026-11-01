import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/authService';
import { THIRTY_DAY_EXERCISE_LIBRARY, THIRTY_DAY_ROUTINE_PLANS } from '../../services/thirtyDayRoutine';
import { UserProfile, UserRole } from '../../types/auth';
import { 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  Users, 
  FileText, 
  Check, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Sparkles,
  Lock
} from 'lucide-react';

export const AdminDashboardScreen: React.FC = () => {
  const { user, promoteUserRole, isLoading, error, clearError, successMessage, clearSuccessMessage } = useAuthStore();
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [adminSection, setAdminSection] = useState<'users' | 'routines' | 'rules'>('users');

  const isAdmin = user?.role === 'admin';

  const loadUsers = async () => {
    if (!user || user.role !== 'admin') return;
    setLoadingUsers(true);
    try {
      const list = await authService.getAllUsers(user.email);
      setUsersList(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [user]);

  if (!isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-slate-900 text-stone-900 dark:text-stone-100">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-semibold">Access Restricted</h2>
        <p className="text-xs text-stone-500 dark:text-slate-400 mt-2 max-w-xs">
          This view is guarded by Firebase Custom Claims. Only authenticated users with the <code className="bg-stone-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-rose-600 font-mono">role: &ldquo;admin&rdquo;</code> claim can access this screen.
        </p>
      </div>
    );
  }

  const handleRoleChange = async (targetEmail: string, newRole: UserRole) => {
    clearError();
    clearSuccessMessage();
    const success = await promoteUserRole(targetEmail, newRole);
    if (success) {
      await loadUsers();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 space-y-4 bg-stone-50/50 dark:bg-slate-900/50 text-stone-900 dark:text-stone-100 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold block">
            Administrative Console
          </span>
          <h1 className="text-xl font-serif font-medium">Role & Content Manager</h1>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Admin Verified</span>
        </div>
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

      {/* Section Switcher */}
      <div className="grid grid-cols-3 gap-1 bg-stone-200/70 dark:bg-slate-800 p-1 rounded-2xl text-xs font-medium">
        <button
          type="button"
          onClick={() => setAdminSection('users')}
          className={`py-2 rounded-xl transition ${
            adminSection === 'users'
              ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-semibold'
              : 'text-stone-600 dark:text-slate-400 hover:text-stone-900'
          }`}
        >
          Users ({usersList.length})
        </button>
        <button
          type="button"
          onClick={() => setAdminSection('routines')}
          className={`py-2 rounded-xl transition ${
            adminSection === 'routines'
              ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-semibold'
              : 'text-stone-600 dark:text-slate-400 hover:text-stone-900'
          }`}
        >
          Routines ({THIRTY_DAY_ROUTINE_PLANS.length})
        </button>
        <button
          type="button"
          onClick={() => setAdminSection('rules')}
          className={`py-2 rounded-xl transition ${
            adminSection === 'rules'
              ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-semibold'
              : 'text-stone-600 dark:text-slate-400 hover:text-stone-900'
          }`}
        >
          Security Rules
        </button>
      </div>

      {/* Section 1: User Directory & Role Promotion */}
      {adminSection === 'users' && (
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700/80 shadow-xs text-xs space-y-1">
            <span className="font-semibold text-stone-800 dark:text-slate-200 block">
              Cloud Function Role Assignment
            </span>
            <p className="text-stone-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Only administrators can invoke the callable Cloud Function <code className="font-mono bg-stone-100 dark:bg-slate-900 px-1 rounded">setRole</code>. Custom claims are verified server-side before updating tokens.
            </p>
          </div>

          {loadingUsers ? (
            <div className="p-8 text-center text-xs text-stone-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading user directory...</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {usersList.map((usr) => {
                const isTargetAdmin = usr.role === 'admin';
                return (
                  <div
                    key={usr.uid}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700/80 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{usr.displayName}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            usr.role === 'admin'
                              ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                              : usr.role === 'coach'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                              : 'bg-stone-100 dark:bg-slate-700 text-stone-600 dark:text-slate-300'
                          }`}>
                            {usr.role}
                          </span>
                        </div>
                        <span className="text-xs text-stone-500 dark:text-slate-400">{usr.email}</span>
                      </div>

                      <span className="text-[10px] text-stone-400 capitalize">
                        Level: {usr.level}
                      </span>
                    </div>

                    {/* Role Promotion / Demotion Controls */}
                    <div className="pt-2 border-t border-stone-100 dark:border-slate-700/50 flex items-center justify-between text-xs">
                      <span className="text-stone-400 text-[11px]">Assign Claim:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleRoleChange(usr.email, 'user')}
                          disabled={usr.role === 'user' || isLoading}
                          className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                            usr.role === 'user'
                              ? 'bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-slate-300 cursor-default'
                              : 'border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-600'
                          }`}
                        >
                          User
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoleChange(usr.email, 'coach')}
                          disabled={usr.role === 'coach' || isLoading}
                          className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                            usr.role === 'coach'
                              ? 'bg-blue-600 text-white cursor-default'
                              : 'border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700 text-stone-600'
                          }`}
                        >
                          Coach
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoleChange(usr.email, 'admin')}
                          disabled={usr.role === 'admin' || isLoading}
                          className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                            usr.role === 'admin'
                              ? 'bg-purple-600 text-white cursor-default'
                              : 'border border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Section 2: Routine Catalog Management */}
      {adminSection === 'routines' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              30-Day Program Plan
            </span>
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Read Only Plan
            </span>
          </div>

          <div className="space-y-3">
            {THIRTY_DAY_ROUTINE_PLANS.map((plan) => (
              <div
                key={plan.day}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{plan.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 capitalize">
                    {plan.level}
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-slate-400">{plan.description}</p>
                <p className="text-[11px] text-stone-400 dark:text-slate-500">
                  {plan.exerciseIds.map((id) => THIRTY_DAY_EXERCISE_LIBRARY[id].title).join(' · ')}
                </p>
                <div className="text-[11px] text-stone-400 flex items-center justify-between pt-1">
                  <span>{plan.exerciseIds.length} Exercises • 10 min</span>
                  <span className="text-emerald-600 font-medium">Program schedule</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Firestore Security Rules Preview */}
      {adminSection === 'rules' && (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 shadow-xs space-y-3 text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Active Security Rules Ruleset</span>
          </div>
          <pre className="p-3 rounded-2xl bg-stone-900 text-stone-100 font-mono text-[10px] overflow-x-auto leading-relaxed">
{`// Rule 1: Users read/write only their own document
match /users/{userId} {
  allow read: if isOwner(userId) || isAdmin();
  allow write: if isOwner(userId) 
    && request.resource.data.role == resource.data.role;
}

// Rule 2: Only admins write to exercises & routines
match /exercises/{exerciseId} {
  allow read: if isAuthenticated();
  allow write: if isAdmin();
}
match /routines/{routineId} {
  allow read: if isAuthenticated();
  allow write: if isAdmin();
}`}
          </pre>
          <p className="text-stone-500 text-[11px]">
            Security rules block unauthorized client escalation. Custom claims are sealed inside signed Firebase Auth JWTs.
          </p>
        </div>
      )}
    </div>
  );
};
