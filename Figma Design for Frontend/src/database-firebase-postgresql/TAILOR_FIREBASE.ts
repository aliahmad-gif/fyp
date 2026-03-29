/**
 * TAILOR_FIREBASE – Tailor data in Firestore (smart-fitao-web-app).
 * Used by Tailor Discovery. Same project as dashboard for full integration.
 * © 2024 Smartfitao. All rights reserved.
 */

import { collection, getDocs, addDoc, setDoc, doc, getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from './firebase';

const TAILORS_COLLECTION = 'tailors';

export type TailorAvailableStatus = 'yes' | 'no';

export interface TailorFirebase {
  id: string;
  name: string;
  location: string;
  specification: string;
  availableStatus: TailorAvailableStatus;
  about: string;
  image?: string;
  createdAt?: string;
}

function getDb() {
  const app = getFirebaseApp();
  if (!app) return null;
  return getFirestore(app);
}

export async function getTailorsFromFirebase(): Promise<TailorFirebase[]> {
  const db = getDb();
  if (!db) return [];
  const snapshot = await getDocs(collection(db, TAILORS_COLLECTION));
  const list: TailorFirebase[] = [];
  snapshot.forEach((docSnap) => {
    const row = docSnap.data();
    list.push({
      id: row?.id ?? docSnap.id,
      name: row?.name ?? '',
      location: row?.location ?? '',
      specification: row?.specification ?? '',
      availableStatus: row?.availableStatus === 'no' ? 'no' : 'yes',
      about: row?.about ?? '',
      image: row?.image ?? '',
      createdAt: row?.createdAt ?? '',
    });
  });
  return list;
}

export async function getTailorsByLocation(locationQuery: string): Promise<TailorFirebase[]> {
  const all = await getTailorsFromFirebase();
  if (!locationQuery.trim()) return all;
  const q = locationQuery.trim().toLowerCase();
  return all.filter((t) => t.location.toLowerCase().includes(q));
}

export async function getTailorsBySpecification(specQuery: string): Promise<TailorFirebase[]> {
  const all = await getTailorsFromFirebase();
  if (!specQuery.trim()) return all;
  const q = specQuery.trim().toLowerCase();
  return all.filter((t) => t.specification.toLowerCase().includes(q));
}

export async function getTailorsQuery(options: {
  location?: string;
  specification?: string;
}): Promise<TailorFirebase[]> {
  let list = await getTailorsFromFirebase();
  if (options.location?.trim()) {
    const q = options.location.trim().toLowerCase();
    list = list.filter((t) => t.location.toLowerCase().includes(q));
  }
  if (options.specification?.trim()) {
    const q = options.specification.trim().toLowerCase();
    list = list.filter((t) => t.specification.toLowerCase().includes(q));
  }
  return list;
}

export async function saveTailorToFirebase(
  tailor: Omit<TailorFirebase, 'id' | 'createdAt'> & { id?: string }
): Promise<string> {
  const db = getDb();
  if (!db) throw new Error('Firebase not connected');
  const createdAt = new Date().toISOString();
  const data = {
    name: tailor.name,
    location: tailor.location,
    specification: tailor.specification,
    availableStatus: tailor.availableStatus,
    about: tailor.about,
    image: tailor.image ?? '',
    createdAt,
  };
  if (tailor.id) {
    await setDoc(doc(db, TAILORS_COLLECTION, tailor.id), data);
    return tailor.id;
  }
  const docRef = await addDoc(collection(db, TAILORS_COLLECTION), { ...data, id: '' });
  await setDoc(docRef, { ...data, id: docRef.id }, { merge: true });
  return docRef.id;
}

export function tailorToDiscoveryShape(t: TailorFirebase): {
  id: string;
  name: string;
  location: string;
  specialty: string;
  image: string;
} {
  return {
    id: t.id,
    name: t.name,
    location: t.location,
    specialty: t.specification,
    image: t.image || '',
  };
}
