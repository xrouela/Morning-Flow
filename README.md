# Morning Flow — 30-Day Guided Movement Program
### 10-minute daily flows, onboarding, and role-based access UI

Morning Flow is a wellness-oriented application packaged for Android with Capacitor. Its 30-day program follows the provided routine document: 10 exercises per day, one minute per exercise, progressing through Beginner (Days 1–10), Intermediate (Days 11–20), and Advanced (Days 21–30). A short-flow option uses the first three exercises and the final rest/stretch.

---

## 🛠 Tech Stack Architecture
- **Application**: React, TypeScript, Vite, and Capacitor Android
- **Navigation and app state**: React components with route guards, Zustand
- **Form validation**: Zod
- **Current authentication**: Local demo service with pre-seeded accounts and simulated social sign-in
- **Firebase**: Example security rules and Cloud Functions are included; production Firebase authentication and persistence are not connected in the client yet

---

## 🏃 30-Day Program
- All 30 day-by-day exercise sequences from the routine plan are available in order; each full flow contains 10 one-minute moves.
- The guided timer advances through the selected day's sequence and stops at the end instead of looping.
- Completion is saved per signed-in demo user on the device. Completed days, next recommended day, completion history, and streak are shown in the app.
- The tired-day option runs that day's first three exercises and final rest/stretch (four minutes).
- Each exercise has a manual rep counter and an optional camera-based movement estimate. Camera frames are processed locally, never recorded or uploaded, and holds or subtle movements may need manual counting.
- Day 21–30 movements provide low-impact alternatives and safety notes. This is general wellness guidance, not medical treatment.

---

## 🚀 Environment Variables (`.env`)
The following variables document the planned Firebase client configuration. The current local demo authentication does not connect to Firebase. Do not put private service-account credentials in a client `.env` file.

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY="your-api-key"
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
EXPO_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Emulator Flag (true for local development)
EXPO_PUBLIC_USE_FIREBASE_EMULATOR="true"
EXPO_PUBLIC_EMULATOR_HOST="127.0.0.1"

# OAuth Client IDs
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS="your-ios-google-client-id"
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID="your-android-google-client-id"
EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB="your-web-google-client-id"
```

---

## 🧪 Firebase Emulator Suite Local Setup
To run and test the complete Firebase backend locally:

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Start the Firebase Emulator Suite:
   ```bash
   firebase emulators:start
   ```
   This boots:
   - **Authentication Emulator**: `http://localhost:9099`
   - **Firestore Emulator**: `http://localhost:8080`
   - **Cloud Functions**: `http://localhost:5001`
   - **Cloud Storage**: `http://localhost:9199`
   - **Emulator UI**: `http://localhost:4000`

---

## 🏃 Running the App
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## 🤖 Running in an Android Emulator
This web app can be packaged as a native Android app using Capacitor. Install JDK 21 and the Android SDK (including Android API 36), and install Android Studio so you can create and start an emulator:

1. In Android Studio, open **Tools → Device Manager**.
2. Create a virtual device if needed, then start it. Wait until Android finishes booting.
3. From the project root, confirm that Android Debug Bridge can see the emulator:
   ```powershell
   adb devices
   ```
   The emulator should appear in the device list. If `adb` is not recognized, add the Android SDK `platform-tools` directory to your Windows `PATH`.

Build the debug APK from the project root:

```bash
npm run android:build
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. Install it on the running emulator:

```powershell
adb install -r .\android\app\build\outputs\apk\debug\app-debug.apk
```

Open **Morning Flow** from the emulator's app launcher. After rebuilding the app, run the install command again to update the emulator installation.

---

## 📋 Running Unit Tests
Run the unit tests for Zod schemas, secure storage, and the 30-day program and progress rules:
```bash
npx --yes tsx --test tests/authLogic.test.ts tests/thirtyDayRoutine.test.ts
```

---

## 👥 Demo Pre-Seeded Accounts
For quick testing and verification:
- **Admin Account**:
  - Email: `admin@morningflow.app`
  - Password: `FlowAdmin2025!`
  - Role: `admin` (Unlocks the Admin tab and role assignment permissions)
- **Standard User Account**:
  - Email: `user@morningflow.app`
  - Password: `MorningFlow2025!`
  - Role: `user` (Standard member with customized Beginner morning flow)
