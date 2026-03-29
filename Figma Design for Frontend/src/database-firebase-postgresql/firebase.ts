/**
 * Smartfitao – Unified Firebase (smart-fitao-web-app).
 * Config, App init, Auth, Firestore (orders, messages, users). Same as dashboard for full integration.
 * © 2024 Smartfitao. All rights reserved.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';

// ============ CONFIG (smart-fitao-web-app – same as dashboard) ============
export const firebaseConfig = {
  apiKey: 'AIzaSyBjYPdRnwuRSAfTZDZ9fkS-f7hDQccOjOY',
  authDomain: 'smart-fitao-web-app.firebaseapp.com',
  projectId: 'smart-fitao-web-app',
  storageBucket: 'smart-fitao-web-app.firebasestorage.app',
  messagingSenderId: '297491352350',
  appId: '1:297491352350:web:e9ee8f4f49bf71afd0570f',
  measurementId: 'G-4NM9QS41KQ',
};

// ============ APP INIT ============
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;
let firestore: Firestore | null = null;
let isFirebaseConnected = false;

export function getFirebaseApp(): FirebaseApp | null {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0] as FirebaseApp;
    isFirebaseConnected = true;
    return app;
  }
  try {
    app = initializeApp(firebaseConfig);
    isFirebaseConnected = true;
    return app;
  } catch (e) {
    console.error('Firebase init error:', e);
    isFirebaseConnected = false;
    return null;
  }
}

export function getFirebaseAnalytics(): Analytics | null {
  if (analytics) return analytics;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  try {
    analytics = getAnalytics(firebaseApp);
    return analytics;
  } catch (e) {
    console.warn('Firebase Analytics init:', e);
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  if (auth) return auth;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  auth = getAuth(firebaseApp);
  return auth;
}

export function getFirestoreDb(): Firestore | null {
  if (firestore) return firestore;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  firestore = getFirestore(firebaseApp);
  return firestore;
}

export function checkFirebaseConnected(): boolean {
  getFirebaseApp();
  return isFirebaseConnected;
}

export { isFirebaseConnected };

// ============ AUTH ============
export interface FirebaseAuthUser {
  id: string;
  email: string | null;
  name: string | null;
}

function mapFirebaseUser(u: FirebaseUser | null): FirebaseAuthUser | null {
  if (!u) return null;
  return { id: u.uid, email: u.email ?? null, name: u.displayName ?? null };
}

export async function signIn(email: string, password: string): Promise<FirebaseAuthUser> {
  const a = getFirebaseAuth();
  if (!a) throw new Error('Firebase not connected');
  const cred: UserCredential = await signInWithEmailAndPassword(a, email, password);
  return mapFirebaseUser(cred.user)!;
}

export async function signUp(
  email: string,
  password: string,
  displayName?: string
): Promise<FirebaseAuthUser> {
  const a = getFirebaseAuth();
  if (!a) throw new Error('Firebase not connected');
  const cred = await createUserWithEmailAndPassword(a, email, password);
  if (displayName?.trim()) await updateProfile(cred.user, { displayName: displayName.trim() });
  return mapFirebaseUser(cred.user)!;
}

export async function signOut(): Promise<void> {
  const a = getFirebaseAuth();
  if (!a) return;
  await firebaseSignOut(a);
}

export async function sendPasswordReset(email: string): Promise<void> {
  const a = getFirebaseAuth();
  if (!a) throw new Error('Firebase not connected');
  await sendPasswordResetEmail(a, email);
}

export function subscribeAuthState(callback: (user: FirebaseAuthUser | null) => void): () => void {
  const a = getFirebaseAuth();
  if (!a) {
    callback(null);
    return () => {};
  }
  const unsubscribe = onAuthStateChanged(a, (u) => callback(mapFirebaseUser(u)));
  return unsubscribe;
}

// ============ FIRESTORE: USERS (for dashboard sync) ============
const COLLECTION_USERS = 'users';

export async function saveUserToFirestore(data: {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: string;
  phone?: string;
  address?: string;
}): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  const now = serverTimestamp();
  await setDoc(
    doc(db, COLLECTION_USERS, data.uid),
    {
      uid: data.uid,
      email: data.email ?? '',
      displayName: data.displayName ?? '',
      role: data.role ?? 'user',
      phone: data.phone ?? '',
      address: data.address ?? '',
      updatedAt: now,
    },
    { merge: true }
  );
}

// ============ FIRESTORE: ORDERS (dashboard Seller sees these) ============
const COLLECTION_ORDERS = 'orders';

export async function createOrderFirestore(orderData: {
  orderId?: string;
  productId?: string;
  productTitle?: string;
  price?: number | string;
  userId?: string;
  userEmail?: string;
  source?: string;
  cartItems?: { id: string; name: string; price: number; quantity: number; [key: string]: unknown }[];
  subtotal?: number;
  deliveryFee?: number;
  total?: number;
  [key: string]: unknown;
}): Promise<string | null> {
  const db = getFirestoreDb();
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, COLLECTION_ORDERS), {
      ...orderData,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.error('createOrderFirestore error:', e);
    return null;
  }
}

// ============ FIRESTORE: MESSAGES (dashboard Seller/Tailor sees these) ============
const COLLECTION_MESSAGES = 'Tailor_messages';

export async function sendMessageToFirestore(messageData: {
  sender?: string;
  receiver?: string;
  text: string;
  [key: string]: unknown;
}): Promise<string | null> {
  const db = getFirestoreDb();
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, COLLECTION_MESSAGES), {
      ...messageData,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.error('sendMessageToFirestore error:', e);
    return null;
  }
}

// ============ LEGACY: Realtime DB messages (kept for backward compat; prefer sendMessageToFirestore) ============
export const FIREBASE_OBJECT_NAME = 'nauman website';

export async function sendFirebaseMessage(text: string): Promise<void> {
  await sendMessageToFirestore({ text, source: 'figma' });
}

// ============ CHECKOUT: Firestore + optional Django ============
export interface CheckoutCartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  image: string;
  quantity: number;
  category: string;
  color?: string;
}

export interface CheckoutSnapshot {
  cartItems: CheckoutCartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
}

const DJANGO_API_BASE =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta as any).env?.VITE_DJANGO_API_URL ?? 'http://localhost:8000/api';

export async function saveCheckoutToFirebaseAndBackend(
  payload: Omit<CheckoutSnapshot, 'createdAt'>,
  userId?: string,
  userEmail?: string
): Promise<void> {
  const createdAt = new Date().toISOString();
  const snapshot: CheckoutSnapshot = { ...payload, createdAt };

  const db = getFirestoreDb();
  if (db) {
    await addDoc(collection(db, COLLECTION_ORDERS), {
      source: 'figma',
      cartItems: payload.cartItems,
      subtotal: payload.subtotal,
      deliveryFee: payload.deliveryFee,
      total: payload.total,
      createdAt,
      userId: userId ?? '',
      userEmail: userEmail ?? '',
      timestamp: serverTimestamp(),
    });
  }

  try {
    const res = await fetch(`${DJANGO_API_BASE}/checkout/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshot),
    });
    if (!res.ok) {
      console.warn('Django checkout save failed:', res.status, await res.text());
    }
  } catch (e) {
    console.warn('Django checkout request failed:', e);
  }
}

// ============ HELPERS ============
export function getFirebaseConnected(): boolean {
  return checkFirebaseConnected();
}
