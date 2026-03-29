/**
 * Tailor dashboard – single file: Firebase, constants, database (MessagesPage, OrdersPage).
 */
import { app, analytics, db } from '../../firebase';
import { collection, addDoc, getDocs, onSnapshot, serverTimestamp } from 'firebase/firestore';

// --- Constants ---
export const TAILOR_COLLECTIONS = {
    MESSAGES: 'Tailor_messages',
    ORDERS: 'orders',
    TAILOR_ORDERS: 'tailor_orders', // tailor dashboard "order aya he" – user orders from tailor front
    INCOME: 'income',
    USERS: 'users',
    REVIEWS: 'reviews',
    TOOLS: 'tools',
};
export const ROLES = { TAILOR: 'tailor', SELLER: 'Seller' };

// --- Helpers ---
function sortByTime(msgs) {
    return [...msgs].sort((a, b) => {
        const t = (m) => m?.timestamp?.toMillis?.() ?? m?.timestamp ?? 0;
        return t(a) - t(b);
    });
}

// --- Database ---
export async function saveUserProfile(userData) {
    try {
        const docRef = await addDoc(collection(db, TAILOR_COLLECTIONS.USERS), userData);
        return docRef.id;
    } catch (e) {
        console.error('Error adding user profile:', e);
    }
}

export async function createOrder(orderData) {
    try {
        const docRef = await addDoc(collection(db, TAILOR_COLLECTIONS.ORDERS), orderData);
        return docRef.id;
    } catch (e) {
        console.error('Error creating order:', e);
    }
}

/** Create order for tailor dashboard (tailor_orders collection). */
export async function createTailorOrder(orderData) {
    try {
        const docRef = await addDoc(collection(db, TAILOR_COLLECTIONS.TAILOR_ORDERS), orderData);
        return docRef.id;
    } catch (e) {
        console.error('Error creating tailor order:', e);
    }
}

/** Listen to tailor orders – for Tailor Dashboard "order aya he". */
export function listenForOrders(callback) {
    const colRef = collection(db, TAILOR_COLLECTIONS.TAILOR_ORDERS);
    return onSnapshot(colRef, (snapshot) => {
        const orders = [];
        snapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));
        callback(orders, null);
    }, (err) => {
        console.error('Firebase listenForOrders (tailor) error:', err);
        callback([], err);
    });
}

export async function logIncome(incomeData) {
    try {
        const docRef = await addDoc(collection(db, TAILOR_COLLECTIONS.INCOME), incomeData);
        return docRef.id;
    } catch (e) {
        console.error('Error logging income:', e);
    }
}

export async function sendMessage(messageData) {
    try {
        const dataWithTime = { ...messageData, timestamp: serverTimestamp() };
        const docRef = await addDoc(collection(db, TAILOR_COLLECTIONS.MESSAGES), dataWithTime);
        console.log('MESSAGE SAVED TO FIREBASE. Document ID:', docRef.id);
        return docRef.id;
    } catch (e) {
        console.error('FIREBASE ERROR sending message:', e);
        throw e;
    }
}

export async function loadMessagesOnce() {
    const snap = await getDocs(collection(db, TAILOR_COLLECTIONS.MESSAGES));
    const messages = [];
    snap.forEach((doc) => messages.push({ id: doc.id, ...doc.data() }));
    return sortByTime(messages);
}

export function listenForAllMessages(callback) {
    const colRef = collection(db, TAILOR_COLLECTIONS.MESSAGES);
    return onSnapshot(colRef, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => messages.push({ id: doc.id, ...doc.data() }));
        callback(sortByTime(messages), null);
    }, (err) => {
        console.error('Firebase listenForAllMessages error:', err);
        callback([], err);
    });
}

export function listenForChatMessages(activeContact, myRole, callback) {
    const colRef = collection(db, TAILOR_COLLECTIONS.MESSAGES);
    return onSnapshot(colRef, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({ id: doc.id, ...data });
        });
        const receiver = (msg) => msg.receiver || msg.recipient;
        const filtered = messages.filter((msg) => {
            const toMe = receiver(msg) === myRole || receiver(msg) === ROLES.SELLER;
            const toContact = receiver(msg) === activeContact;
            const fromContact = msg.sender === activeContact;
            const fromMe = msg.sender === myRole || msg.sender === ROLES.SELLER;
            return (fromContact && toMe) || (fromMe && toContact);
        });
        callback(sortByTime(filtered), null);
    }, (err) => {
        console.error('Firebase listenForChatMessages error:', err);
        callback([], err);
    });
}

export async function addReview(reviewData) {
    try {
        const docRef = await addDoc(collection(db, TAILOR_COLLECTIONS.REVIEWS), reviewData);
        return docRef.id;
    } catch (e) {
        console.error('Error adding review:', e);
    }
}

export async function addTool(toolData) {
    try {
        const docRef = await addDoc(collection(db, TAILOR_COLLECTIONS.TOOLS), toolData);
        return docRef.id;
    } catch (e) {
        console.error('Error adding tool:', e);
    }
}

export async function addToCollection(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        return docRef.id;
    } catch (e) {
        console.error(`Error adding to ${collectionName}:`, e);
    }
}

export { app, analytics, db };
