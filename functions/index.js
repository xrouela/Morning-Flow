const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Cloud Function Trigger: onUserCreated
 * Runs whenever a new Firebase Auth user is created.
 * Sets the default custom claim { role: 'user' } and initializes their Firestore document.
 */
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  const customClaims = {
    role: 'user',
  };

  try {
    // Set custom user claims via Firebase Admin SDK
    await admin.auth().setCustomUserClaims(user.uid, customClaims);

    // Bootstrap user document in Firestore
    const userDocRef = admin.firestore().collection('users').doc(user.uid);
    await userDocRef.set({
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Morning Practitioner',
      photoURL: user.photoURL || null,
      role: 'user',
      isEmailVerified: user.emailVerified || false,
      level: 'beginner',
      reminderTime: '07:00',
      reminderEnabled: true,
      disclaimerAccepted: false,
      onboardingCompleted: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      streakCount: 0,
      totalSessionsCompleted: 0,
    });

    console.log(`Default 'user' role custom claim and Firestore doc set for UID: ${user.uid}`);
  } catch (error) {
    console.error('Error in onUserCreated Cloud Function:', error);
  }
});

/**
 * Callable Cloud Function: setRole
 * Allows existing admins to promote or demote user roles.
 * Verified strictly on server via context.auth.token.role === 'admin'.
 */
exports.setRole = functions.https.onCall(async (data, context) => {
  // 1. Verify caller authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  // 2. Verify caller has the 'admin' custom claim
  if (context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only administrators can assign custom roles and claims.'
    );
  }

  const { targetUid, newRole } = data;
  const allowedRoles = ['user', 'admin', 'coach'];

  if (!targetUid || !allowedRoles.includes(newRole)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `Target UID and a valid role (${allowedRoles.join(', ')}) are required.`
    );
  }

  try {
    // Set custom user claim on target user
    await admin.auth().setCustomUserClaims(targetUid, { role: newRole });

    // Update Firestore document mirror
    await admin.firestore().collection('users').doc(targetUid).update({
      role: newRole,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      message: `User ${targetUid} successfully assigned role '${newRole}'.`,
    };
  } catch (error) {
    console.error('Error setting custom claim role:', error);
    throw new functions.https.HttpsError('internal', 'Unable to set user role claim.');
  }
});

/**
 * Callable Cloud Function: deleteUserAccount
 * Wipes user authentication record and cascades deletion through user documents and routines.
 */
exports.deleteUserAccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required.');
  }

  const uid = context.auth.uid;

  try {
    // 1. Delete user document from Firestore
    await admin.firestore().collection('users').doc(uid).delete();

    // 2. Query and delete user completion logs
    const completions = await admin.firestore()
      .collection('completions')
      .where('userId', '==', uid)
      .get();

    const batch = admin.firestore().batch();
    completions.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    // 3. Delete Firebase Auth account
    await admin.auth().deleteUser(uid);

    return { success: true, message: 'Account and associated records purged successfully.' };
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete user account data.');
  }
});
