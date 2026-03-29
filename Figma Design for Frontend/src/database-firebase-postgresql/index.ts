/**
 * All Firebase – single entry. Re-exports from firebase.ts (one file).
 * © 2024 Smartfitao. All rights reserved.
 */

export {
  firebaseConfig,
  getFirebaseApp,
  getFirebaseAuth,
  getFirestoreDb,
  getFirebaseAnalytics,
  checkFirebaseConnected,
  isFirebaseConnected,
  getFirebaseConnected,
  signIn,
  signUp,
  signOut,
  sendPasswordReset,
  subscribeAuthState,
  sendFirebaseMessage,
  FIREBASE_OBJECT_NAME,
  saveCheckoutToFirebaseAndBackend,
  saveUserToFirestore,
  createOrderFirestore,
  sendMessageToFirestore,
} from './firebase';

export type { FirebaseAuthUser, CheckoutCartItem, CheckoutSnapshot } from './firebase';

export {
  getTailorsFromFirebase,
  getTailorsByLocation,
  getTailorsBySpecification,
  getTailorsQuery,
  saveTailorToFirebase,
  tailorToDiscoveryShape,
} from './TAILOR_FIREBASE';
export type { TailorFirebase, TailorAvailableStatus } from './TAILOR_FIREBASE';
