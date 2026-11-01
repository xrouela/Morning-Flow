import { UserProfile, UserRole, RoutineLevel, MorningRoutine } from '../types/auth';
import { secureStorage } from './secureStorage';

export const INITIAL_ROUTINES: MorningRoutine[] = [
  {
    id: 'routine-beginner',
    level: 'beginner',
    title: 'Gentle Lymphatic Awakening',
    description: 'A soothing 5-minute foundational routine to gently open lymphatic nodes through light rhythmic stimulation.',
    totalDurationSeconds: 300,
    exercises: [
      {
        id: 'ex-1',
        title: 'Deep Diaphragmatic Breathing',
        durationSeconds: 60,
        breathingCue: 'Inhale 4s through nose expanding belly, exhale slowly 6s through pursed lips',
        instructions: 'Lie or sit comfortably. Place hands on lower abdomen. Deep diaphragmatic breathing creates intra-abdominal pressure that pumps the thoracic duct, the body’s largest lymphatic vessel.',
        category: 'breathing',
        targetArea: 'Cisterna Chyli & Thoracic Duct',
        videoUrl: '/assets/aistudio/Deep_Diaphragmatic_Breathing_0a11709d.mp4',
        formTips: [
          'Place one hand on your chest and one on your belly',
          'Inhale through your nose and feel your belly expand outward',
          'Keep your chest and shoulders steady and relaxed',
          'Exhale slowly through pursed lips, allowing belly to contract gently',
        ],
      },
      {
        id: 'ex-2',
        title: 'Gentle Neck Tilts & Collarbone Sweeps',
        durationSeconds: 60,
        breathingCue: 'Slow steady breathing with gentle cadence',
        instructions: 'Slowly tilt your head ear-to-shoulder, then tenderly sweep your fingertips down the sides of the neck toward the terminus above your collarbones.',
        category: 'drainage',
        targetArea: 'Cervical & Supraclavicular Nodes',
        videoUrl: '/assets/aistudio/Gentle_Neck_Tilts___Collarbone_Sweeps_7455cc40.mp4',
        formTips: [
          'Tilt ear toward shoulder slowly without straining or forcing range',
          'Use feather-light pressure with pads of your fingers (just stretching the skin)',
          'Gently sweep down both sides of the neck toward the clavicle hollow (terminus)',
          'Never push hard—lymphatic vessels are delicate and sit just under the skin',
        ],
      },
      {
        id: 'ex-3',
        title: 'Seated or Standing Arm Swings',
        durationSeconds: 60,
        breathingCue: 'Inhale swing up, exhale swing down',
        instructions: 'Swing arms forward and back loosely, letting shoulder sockets relax. Promotes flow through axillary (underarm) lymphatic clusters.',
        category: 'lymphatic_activation',
        targetArea: 'Axillary Nodes',
      },
      {
        id: 'ex-4',
        title: 'Rhythmic Ankle Pumps & Heel Drops',
        durationSeconds: 60,
        breathingCue: 'Continuous fluid rhythm',
        instructions: 'Pump ankles up and down firmly, or rise on toes and gently drop heels to the floor. The calf muscle pump propels fluid upward against gravity from lower extremities.',
        category: 'rebound',
        targetArea: 'Inguinal & Popliteal Lymphatic Pathways',
      },
      {
        id: 'ex-5',
        title: 'Soft Torso Twists & Full Body Shakeout',
        durationSeconds: 60,
        breathingCue: 'Exhale with soft sighs to release all residual tension',
        instructions: 'Gently rotate your torso letting arms hang loose like empty sleeves. Finish with a gentle micro-bounce shake of hands and legs.',
        category: 'rebound',
        targetArea: 'Full Body Superficial Lymph Network',
      },
    ],
  },
  {
    id: 'routine-intermediate',
    level: 'intermediate',
    title: 'Active Lymph Flow & Bounce',
    description: '5-minute invigorating sequence with micro-rebounding and directional lymphatic strokes.',
    totalDurationSeconds: 300,
    exercises: [
      {
        id: 'ex-int-1',
        title: 'Belly Pump & Collarbone Clear',
        durationSeconds: 60,
        breathingCue: 'Deep rhythmic 4-4 diaphragmatic breathing',
        instructions: 'Clear the central drainage pathways before moving peripheral fluids. Soft collarbone taps paired with deep rhythmic belly expansion.',
        category: 'breathing',
        targetArea: 'Thoracic Terminal Drainage',
        videoUrl: '/assets/aistudio/Deep_Diaphragmatic_Breathing_0a11709d.mp4',
        formTips: [
          'Maintain rhythmic 4-4 diaphragmatic cadence',
          'Keep chest still while allowing deep lower abdominal expansion',
          'Pairs well with light fingertip tapping above the collarbone',
        ],
      },
      {
        id: 'ex-int-2',
        title: 'Underarm & Ribcage Flutters',
        durationSeconds: 60,
        breathingCue: 'Inhale expansive chest, exhale complete rib contraction',
        instructions: 'Reach arm overhead, gently massage axillary area toward heart, then alternate. Dynamic arm pulses stimulate deep lymph collector ducts.',
        category: 'lymphatic_activation',
        targetArea: 'Axillary & Intercostal Channels',
      },
      {
        id: 'ex-int-3',
        title: 'Gentle Rebound Micro-Bounces',
        durationSeconds: 60,
        breathingCue: 'Breathe rhythmically with each bounce',
        instructions: 'Keep balls of feet on the ground and pulse heels up and down in a soft vibration. Rebounding opens one-way lymphatic valves throughout the entire vascular bed.',
        category: 'rebound',
        targetArea: 'Whole Body Valves & Capillaries',
      },
      {
        id: 'ex-int-4',
        title: 'Groin Fold Flexions (Knee Lifts)',
        durationSeconds: 60,
        breathingCue: 'Exhale as knee rises, inhale as foot lands lightly',
        instructions: 'March gently in place bringing knees to 90 degrees. Compresses and releases inguinal nodes located in the crease of the hip.',
        category: 'lymphatic_activation',
        targetArea: 'Inguinal Node Clusters',
      },
      {
        id: 'ex-int-5',
        title: 'Lateral Arm Sweeps & Spinal Wave',
        durationSeconds: 60,
        breathingCue: 'Deep wave inhalation and release',
        instructions: 'Sweep arms across midline, then roll spine gently from tailbone to crown. Settles the autonomic nervous system into parasympathetic recovery.',
        category: 'drainage',
        targetArea: 'Parasympathetic Reset',
      },
    ],
  },
  {
    id: 'routine-advanced',
    level: 'advanced',
    title: 'Fascial Flush & Cellular Pump',
    description: 'Dynamic 5-minute routine combining active resistance, fascia gliding, and full lymph node activation.',
    totalDurationSeconds: 300,
    exercises: [
      {
        id: 'ex-adv-1',
        title: 'Dynamic Thoracic Expansion Breathing',
        durationSeconds: 60,
        breathingCue: 'Box breathing: 4s inhale, 4s hold, 4s exhale, 4s hold',
        instructions: 'Full 3-dimensional rib cage expansion with overhead reaching. Generates maximum negative pressure in thoracic cavity to draw fluids from limbs.',
        category: 'breathing',
        targetArea: 'Thoracic & Subclavian Veins',
        videoUrl: '/assets/aistudio/Deep_Diaphragmatic_Breathing_0a11709d.mp4',
        formTips: [
          'Inhale deeply into lower ribcage, avoiding neck shoulder elevation',
          'Notice abdominal expansion preceding lateral rib flaring',
          'Exhale smoothly through pursed lips',
        ],
      },
      {
        id: 'ex-adv-2',
        title: 'Full Neck-to-Spine Floss',
        durationSeconds: 60,
        breathingCue: 'Slow controlled respiration',
        instructions: 'Gentle chin tucks transitioning into lateral cervical glides, mobilizing the neurovascular and lymphatic bundle in the anterior neck.',
        category: 'drainage',
        targetArea: 'Deep Cervical Lymph Nodes',
        videoUrl: '/assets/aistudio/Gentle_Neck_Tilts___Collarbone_Sweeps_7455cc40.mp4',
        formTips: [
          'Controlled gentle lateral neck motion',
          'Gentle downward drainage sweeps along sternocleidomastoid muscle',
          'Keep pressure whisper-soft to avoid compressing deeper jugular veins',
        ],
      },
      {
        id: 'ex-adv-3',
        title: 'Full Kinetic Rebound & Arm Rotations',
        durationSeconds: 60,
        breathingCue: 'Quick rhythmic diaphragmatic pulses',
        instructions: 'Full foot rhythmic bouncing with synchronized internal and external shoulder rotations. Multi-joint pumping stimulates deep systemic lymph vessels.',
        category: 'rebound',
        targetArea: 'Axillary, Thoracic, and Lower Systemic Valves',
      },
      {
        id: 'ex-adv-4',
        title: 'Diagonal Cross-Body Sweeps & Hip Openers',
        durationSeconds: 60,
        breathingCue: 'Dynamic inhale across, exhale release',
        instructions: 'Reach opposite arm to outer thigh, rotating through thoracic spine. Mobilizes visceral peritoneum and intestinal lymphatic conduits.',
        category: 'lymphatic_activation',
        targetArea: 'Visceral & Mesenteric Lymphatics',
      },
      {
        id: 'ex-adv-5',
        title: 'Superficial Fascial Brush & Grounding',
        durationSeconds: 60,
        breathingCue: 'Slow parasympathetic descent',
        instructions: 'Light skin brushing upwards from ankles to groin, wrists to armpits, finishing with stillness and deep belly breathing.',
        category: 'drainage',
        targetArea: 'Superficial Dermal Lymphatic Capillaries',
      },
    ],
  },
];

// Pre-seeded accounts for demo & testing
const SEED_USERS: Record<string, { password: string; profile: UserProfile }> = {
  'admin@morningflow.app': {
    password: 'FlowAdmin2025!',
    profile: {
      uid: 'user-admin-001',
      email: 'admin@morningflow.app',
      displayName: 'Elena Vance (Lead Admin)',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'admin',
      isEmailVerified: true,
      level: 'intermediate',
      reminderTime: '06:45',
      reminderEnabled: true,
      disclaimerAccepted: true,
      disclaimerAcceptedAt: '2026-01-15T07:00:00Z',
      onboardingCompleted: true,
      createdAt: '2026-01-15T07:00:00Z',
      updatedAt: '2026-01-15T07:00:00Z',
      streakCount: 28,
      totalSessionsCompleted: 42,
    },
  },
  'user@morningflow.app': {
    password: 'MorningFlow2025!',
    profile: {
      uid: 'user-standard-002',
      email: 'user@morningflow.app',
      displayName: 'Marcus Sterling',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'user',
      isEmailVerified: true,
      level: 'beginner',
      reminderTime: '07:15',
      reminderEnabled: true,
      disclaimerAccepted: true,
      disclaimerAcceptedAt: '2026-02-10T07:15:00Z',
      onboardingCompleted: true,
      createdAt: '2026-02-10T07:15:00Z',
      updatedAt: '2026-02-10T07:15:00Z',
      streakCount: 14,
      totalSessionsCompleted: 19,
    },
  },
};

const USERS_DB_STORAGE_KEY = 'morning_flow_users_db';
const CURRENT_SESSION_KEY = 'morning_flow_auth_session';

class AuthService {
  private activeListeners: Set<() => void> = new Set();
  public simulateNetworkDelay = 250;
  public simulateNetworkOffline = false;

  constructor() {
    this.ensureSeedData();
  }

  private ensureSeedData() {
    if (typeof window === 'undefined') return;
    try {
      const existing = window.localStorage.getItem(USERS_DB_STORAGE_KEY);
      if (!existing) {
        window.localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(SEED_USERS));
      }
    } catch {
      // Ignore
    }
  }

  private getUsersDatabase(): Record<string, { password: string; profile: UserProfile }> {
    if (typeof window === 'undefined') return { ...SEED_USERS };
    try {
      const raw = window.localStorage.getItem(USERS_DB_STORAGE_KEY);
      if (!raw) {
        window.localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(SEED_USERS));
        return { ...SEED_USERS };
      }
      return JSON.parse(raw);
    } catch {
      return { ...SEED_USERS };
    }
  }

  private saveUsersDatabase(db: Record<string, { password: string; profile: UserProfile }>) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(USERS_DB_STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save users database', e);
    }
  }

  private async delay(): Promise<void> {
    if (this.simulateNetworkOffline) {
      throw new Error('network-request-failed: A network error (such as timeout, interrupted connection or unreachable host) has occurred.');
    }
    if (this.simulateNetworkDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.simulateNetworkDelay));
    }
  }

  /**
   * Resolves persisted session on app launch
   */
  async resolveInitialSession(): Promise<UserProfile | null> {
    await this.delay();
    const token = await secureStorage.getItemAsync(CURRENT_SESSION_KEY);
    if (!token) return null;

    try {
      const parsed = JSON.parse(token);
      const db = this.getUsersDatabase();
      const entry = db[parsed.email.toLowerCase()];
      if (entry) {
        return entry.profile;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  /**
   * Sign In with Email & Password
   */
  async signInWithEmailAndPassword(email: string, pass: string): Promise<UserProfile> {
    await this.delay();
    const normalizedEmail = email.trim().toLowerCase();

    // Check rate limit simulation
    if (normalizedEmail.includes('ratelimit')) {
      const err = new Error('auth/too-many-requests: Access to this account has been temporarily disabled due to many failed login attempts.');
      (err as any).code = 'auth/too-many-requests';
      throw err;
    }

    const db = this.getUsersDatabase();
    const userEntry = db[normalizedEmail];

    if (!userEntry) {
      const err = new Error('auth/user-not-found: No user record found corresponding to this identifier.');
      (err as any).code = 'auth/user-not-found';
      throw err;
    }

    if (userEntry.password !== pass) {
      const err = new Error('auth/wrong-password: The password is invalid or the user does not have a password.');
      (err as any).code = 'auth/wrong-password';
      throw err;
    }

    const profile = userEntry.profile;
    await secureStorage.setItemAsync(CURRENT_SESSION_KEY, JSON.stringify(profile));
    return profile;
  }

  /**
   * Sign Up with Email & Password
   * Automatically invokes the default custom claim logic (role: 'user')
   */
  async signUpWithEmailAndPassword(email: string, pass: string, displayName: string): Promise<UserProfile> {
    await this.delay();
    const normalizedEmail = email.trim().toLowerCase();
    const db = this.getUsersDatabase();

    if (db[normalizedEmail]) {
      const err = new Error('auth/email-already-in-use: The email address is already in use by another account.');
      (err as any).code = 'auth/email-already-in-use';
      throw err;
    }

    const newUid = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    // In production, Firebase Cloud Function auth.user().onCreate triggers custom claims
    const newProfile: UserProfile = {
      uid: newUid,
      email: normalizedEmail,
      displayName: displayName.trim(),
      role: 'user', // Default role assigned by Cloud Function
      isEmailVerified: false,
      level: 'beginner',
      reminderTime: '07:00',
      reminderEnabled: true,
      disclaimerAccepted: false,
      onboardingCompleted: false,
      createdAt: nowIso,
      updatedAt: nowIso,
      streakCount: 0,
      totalSessionsCompleted: 0,
    };

    db[normalizedEmail] = {
      password: pass,
      profile: newProfile,
    };
    this.saveUsersDatabase(db);

    await secureStorage.setItemAsync(CURRENT_SESSION_KEY, JSON.stringify(newProfile));
    return newProfile;
  }

  /**
   * Google Sign-In emulation (OAuth web popup or native SDK)
   */
  async signInWithGoogle(): Promise<UserProfile> {
    await this.delay();
    const db = this.getUsersDatabase();
    const googleEmail = 'wellness.seeker@gmail.com';
    let userEntry = db[googleEmail];

    if (!userEntry) {
      const newUid = `google-${Date.now()}`;
      const nowIso = new Date().toISOString();
      const profile: UserProfile = {
        uid: newUid,
        email: googleEmail,
        displayName: 'Google Wellness Seeker',
        photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        role: 'user',
        isEmailVerified: true,
        level: 'beginner',
        reminderTime: '07:30',
        reminderEnabled: true,
        disclaimerAccepted: false,
        onboardingCompleted: false,
        createdAt: nowIso,
        updatedAt: nowIso,
        streakCount: 1,
        totalSessionsCompleted: 1,
      };
      db[googleEmail] = { password: 'google_oauth_token', profile };
      this.saveUsersDatabase(db);
      userEntry = db[googleEmail];
    }

    await secureStorage.setItemAsync(CURRENT_SESSION_KEY, JSON.stringify(userEntry.profile));
    return userEntry.profile;
  }

  /**
   * Apple Sign-In emulation (iOS)
   */
  async signInWithApple(): Promise<UserProfile> {
    await this.delay();
    const db = this.getUsersDatabase();
    const appleEmail = 'apple.flow@icloud.com';
    let userEntry = db[appleEmail];

    if (!userEntry) {
      const newUid = `apple-${Date.now()}`;
      const nowIso = new Date().toISOString();
      const profile: UserProfile = {
        uid: newUid,
        email: appleEmail,
        displayName: 'Apple Subscriber',
        role: 'user',
        isEmailVerified: true,
        level: 'beginner',
        reminderTime: '08:00',
        reminderEnabled: true,
        disclaimerAccepted: false,
        onboardingCompleted: false,
        createdAt: nowIso,
        updatedAt: nowIso,
        streakCount: 3,
        totalSessionsCompleted: 3,
      };
      db[appleEmail] = { password: 'apple_oauth_token', profile };
      this.saveUsersDatabase(db);
      userEntry = db[appleEmail];
    }

    await secureStorage.setItemAsync(CURRENT_SESSION_KEY, JSON.stringify(userEntry.profile));
    return userEntry.profile;
  }

  /**
   * Send Password Reset Email
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    await this.delay();
    const normalizedEmail = email.trim().toLowerCase();
    const db = this.getUsersDatabase();
    if (!db[normalizedEmail]) {
      const err = new Error('auth/user-not-found: There is no user record corresponding to this email.');
      (err as any).code = 'auth/user-not-found';
      throw err;
    }
  }

  /**
   * Send Email Verification
   */
  async sendEmailVerification(email: string): Promise<void> {
    await this.delay();
    const normalized = email.toLowerCase();
    const db = this.getUsersDatabase();
    if (db[normalized]) {
      // In production Firebase sends confirmation link
    }
  }

  /**
   * Simulated verification action (for demo & test purposes)
   */
  async markEmailAsVerified(email: string): Promise<UserProfile> {
    await this.delay();
    const normalized = email.toLowerCase();
    const db = this.getUsersDatabase();
    if (db[normalized]) {
      db[normalized].profile.isEmailVerified = true;
      db[normalized].profile.updatedAt = new Date().toISOString();
      this.saveUsersDatabase(db);
      await secureStorage.setItemAsync(CURRENT_SESSION_KEY, JSON.stringify(db[normalized].profile));
      return db[normalized].profile;
    }
    throw new Error('User not found');
  }

  /**
   * Complete Onboarding: level, reminderTime, and disclaimer acceptance
   */
  async completeOnboarding(
    email: string,
    data: { level: RoutineLevel; reminderTime: string; reminderEnabled: boolean; disclaimerAccepted: boolean }
  ): Promise<UserProfile> {
    await this.delay();
    const normalized = email.toLowerCase();
    const db = this.getUsersDatabase();
    if (!db[normalized]) throw new Error('User not found');

    const updated = {
      ...db[normalized].profile,
      level: data.level,
      reminderTime: data.reminderTime,
      reminderEnabled: data.reminderEnabled,
      disclaimerAccepted: data.disclaimerAccepted,
      disclaimerAcceptedAt: new Date().toISOString(),
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    };

    db[normalized].profile = updated;
    this.saveUsersDatabase(db);
    await secureStorage.setItemAsync(CURRENT_SESSION_KEY, JSON.stringify(updated));
    return updated;
  }

  /**
   * Update Profile Details
   */
  async updateProfile(
    email: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    await this.delay();
    const normalized = email.toLowerCase();
    const db = this.getUsersDatabase();
    if (!db[normalized]) throw new Error('User not found');

    const updated = {
      ...db[normalized].profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    db[normalized].profile = updated;
    this.saveUsersDatabase(db);
    await secureStorage.setItemAsync(CURRENT_SESSION_KEY, JSON.stringify(updated));
    return updated;
  }

  /**
   * Change Password
   */
  async changePassword(email: string, currentPass: string, newPass: string): Promise<void> {
    await this.delay();
    const normalized = email.toLowerCase();
    const db = this.getUsersDatabase();
    if (!db[normalized]) throw new Error('User not found');

    if (db[normalized].password !== currentPass) {
      const err = new Error('auth/wrong-password: The current password is incorrect.');
      (err as any).code = 'auth/wrong-password';
      throw err;
    }

    db[normalized].password = newPass;
    this.saveUsersDatabase(db);
  }

  /**
   * Delete Account: Cloud Function simulation wiping profile and Firestore collections
   */
  async deleteAccount(email: string): Promise<void> {
    await this.delay();
    const normalized = email.toLowerCase();
    const db = this.getUsersDatabase();
    delete db[normalized];
    this.saveUsersDatabase(db);
    await this.signOut();
  }

  /**
   * Logout: Clears session, cached data, secure storage, and unsubscribes all Firestore listeners
   */
  async signOut(): Promise<void> {
    await this.delay();
    // Unsubscribe all active listeners
    this.activeListeners.forEach((unsub) => {
      try {
        unsub();
      } catch (e) {
        console.error('Error unsubscribing listener:', e);
      }
    });
    this.activeListeners.clear();

    // Clear secure storage and cached session
    await secureStorage.deleteItemAsync(CURRENT_SESSION_KEY);
  }

  /**
   * Register a simulated Firestore listener for automated teardown on sign out
   */
  registerListener(unsub: () => void): () => void {
    this.activeListeners.add(unsub);
    return () => {
      this.activeListeners.delete(unsub);
      unsub();
    };
  }

  /**
   * Admin Role Management: Promotes / Demotes user role
   * Enforced on server via Cloud Function context.auth.token.role === 'admin'
   */
  async setRoleAsAdmin(adminEmail: string, targetEmail: string, newRole: UserRole): Promise<UserProfile> {
    await this.delay();
    const adminNorm = adminEmail.toLowerCase();
    const targetNorm = targetEmail.toLowerCase();
    const db = this.getUsersDatabase();

    const adminEntry = db[adminNorm];
    if (!adminEntry || adminEntry.profile.role !== 'admin') {
      const err = new Error('permission-denied: Only users with the admin role can assign custom claims.');
      (err as any).code = 'permission-denied';
      throw err;
    }

    const targetEntry = db[targetNorm];
    if (!targetEntry) {
      throw new Error('Target user does not exist.');
    }

    targetEntry.profile.role = newRole;
    targetEntry.profile.updatedAt = new Date().toISOString();
    this.saveUsersDatabase(db);

    return targetEntry.profile;
  }

  /**
   * Fetch all users for Admin directory
   */
  async getAllUsers(adminEmail: string): Promise<UserProfile[]> {
    await this.delay();
    const adminNorm = adminEmail.toLowerCase();
    const db = this.getUsersDatabase();
    const adminEntry = db[adminNorm];
    if (!adminEntry || adminEntry.profile.role !== 'admin') {
      const err = new Error('permission-denied: Unauthorized directory access.');
      (err as any).code = 'permission-denied';
      throw err;
    }

    return Object.values(db).map((entry) => entry.profile);
  }
}

export const authService = new AuthService();
