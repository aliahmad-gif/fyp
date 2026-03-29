/**
 * Auth + user profile – Firebase Firestore.
 * Tailor / Seller register → save in Firebase; login → load user and set currentUser.
 */
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const USERS_COLLECTION = 'users';

/**
 * Register: save new user (tailor/seller) to Firebase.
 * @param {{ email, password, role, fullName, phone, shopName, shopAddress }} data
 * @returns {Promise<string>} document id
 */
export async function registerUser(data) {
    const docRef = await addDoc(collection(db, USERS_COLLECTION), {
        email: data.email || '',
        password: data.password || '',
        role: data.role || 'tailor',
        fullName: data.fullName || '',
        phone: data.phone || '',
        shopName: data.shopName || '',
        shopNumber: data.shopNumber || '',
        shopAddress: data.shopAddress || '',
        createdAt: new Date(),
    });
    return docRef.id;
}

/**
 * Login: find user by email + role. Returns user doc or null.
 * @param {string} email
 * @param {string} role 'tailor' | 'seller'
 * @returns {Promise<{ id: string, ... } | null>}
 */
export async function getUserByEmailAndRole(email, role) {
    const q = query(
        collection(db, USERS_COLLECTION),
        where('email', '==', (email || '').trim()),
        where('role', '==', role || 'tailor')
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
}

/**
 * Get current user from localStorage (set after login).
 * @returns {{ fullName, email, phone, shopName, shopNumber, shopAddress, role } | null}
 */
export function getCurrentUser() {
    try {
        const raw = localStorage.getItem('currentUser');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

/**
 * Set current user in localStorage (after login).
 * @param {object} user
 */
export function setCurrentUser(user) {
    const toStore = {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName || '',
        phone: user.phone || '',
        shopName: user.shopName || '',
        shopNumber: user.shopNumber || '',
        shopAddress: user.shopAddress || '',
    };
    localStorage.setItem('currentUser', JSON.stringify(toStore));
}
