export type UserRole = 'user' | 'admin' | 'coach';

export type RoutineLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  isEmailVerified: boolean;
  level: RoutineLevel;
  reminderTime: string; // e.g. "07:00"
  reminderEnabled: boolean;
  disclaimerAccepted: boolean;
  disclaimerAcceptedAt?: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  streakCount: number;
  totalSessionsCompleted: number;
}

export interface AuthErrorState {
  code: string;
  message: string;
}

export interface RoutineExercise {
  id: string;
  title: string;
  durationSeconds: number;
  breathingCue: string;
  instructions: string;
  category: 'lymphatic_activation' | 'rebound' | 'drainage' | 'breathing';
  targetArea: string;
  videoUrl?: string;
  formTips?: string[];
}

export interface MorningRoutine {
  id: string;
  level: RoutineLevel;
  title: string;
  description: string;
  totalDurationSeconds: number;
  exercises: RoutineExercise[];
}
