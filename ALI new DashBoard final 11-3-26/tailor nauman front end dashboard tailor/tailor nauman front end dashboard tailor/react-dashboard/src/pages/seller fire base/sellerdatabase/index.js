/**
 * Seller dashboard – single file: Firebase, constants, database (SellerHome, SellerMessages, UserChat, SellerProducts, etc.).
 */
import { app, analytics, db } from '../../../firebase';
import { collection, addDoc, getDocs, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { saveHeadings } from '../../../services/saveHeadings';

// --- Constants ---
export const SELLER_COLLECTIONS = {
    MESSAGES: 'Tailor_messages',
    ORDERS: 'orders',
    INCOME: 'income',
    USERS: 'users',
    REVIEWS: 'reviews',
    TOOLS: 'tools',
    SELLER_HEADINGS: 'seller_headings',
};

export const SELLER_PAGES = {
    home: { key: 'SellerHome', headings: ['Dashboard', 'Business Advisor', 'Revenue Overview', 'Traffic Sources', 'Top Selling Products', 'Quick Actions'] },
    income: { key: 'SellerIncome', headings: ['My Income', 'Overview', 'Order History', 'Recent Orders'] },
    products: { key: 'SellerProducts', headings: ['Products', 'Active', 'Inactive', 'Pending'] },
    messages: { key: 'SellerMessages', headings: ['Messages', 'Tailors', 'Users'] },
    profile: { key: 'SellerProfile', headings: ['Ali Ahmad Store', 'Seller Account', 'Bank Account', 'Business Account'] },
    sellerAccount: { key: 'SellerAccount', headings: ['Seller Account', 'Short Code', 'Full Name', 'Email', 'Phone', 'Shop Name'] },
    bankAccount: { key: 'BankAccount', headings: ['Bank Account', 'Account Title', 'Account Number', 'IBAN'] },
    businessAccount: { key: 'BusinessAccount', headings: ['Business Information', 'Seller Type', 'Address', 'Country Region', 'CNIC'] },
    userChat: { key: 'UserChat', headings: ['Chat'] },
};

// --- Helpers ---
function sortByTime(msgs) {
    return [...msgs].sort((a, b) => {
        const t = (m) => m?.timestamp?.toMillis?.() ?? m?.timestamp ?? 0;
        return t(a) - t(b);
    });
}

// --- Database ---
export async function createOrder(orderData) {
    try {
        const docRef = await addDoc(collection(db, SELLER_COLLECTIONS.ORDERS), orderData);
        return docRef.id;
    } catch (e) {
        console.error('Error creating order:', e);
    }
}

export async function logIncome(incomeData) {
    try {
        const docRef = await addDoc(collection(db, SELLER_COLLECTIONS.INCOME), incomeData);
        return docRef.id;
    } catch (e) {
        console.error('Error logging income:', e);
    }
}

export async function sendMessage(messageData) {
    try {
        const dataWithTime = { ...messageData, timestamp: serverTimestamp() };
        const docRef = await addDoc(collection(db, SELLER_COLLECTIONS.MESSAGES), dataWithTime);
        console.log('MESSAGE SAVED TO FIREBASE. Document ID:', docRef.id);
        return docRef.id;
    } catch (e) {
        console.error('FIREBASE ERROR sending message:', e);
        throw e;
    }
}

export async function loadMessagesOnce() {
    const snap = await getDocs(collection(db, SELLER_COLLECTIONS.MESSAGES));
    const messages = [];
    snap.forEach((doc) => messages.push({ id: doc.id, ...doc.data() }));
    return sortByTime(messages);
}

export function listenForAllMessages(callback) {
    const colRef = collection(db, SELLER_COLLECTIONS.MESSAGES);
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
    const colRef = collection(db, SELLER_COLLECTIONS.MESSAGES);
    return onSnapshot(colRef, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({ id: doc.id, ...data });
        });
        const receiver = (msg) => msg.receiver || msg.recipient;
        const filtered = messages.filter((msg) => {
            const toMe = receiver(msg) === myRole || receiver(msg) === 'Seller';
            const toContact = receiver(msg) === activeContact;
            const fromContact = msg.sender === activeContact;
            const fromMe = msg.sender === myRole || msg.sender === 'Seller';
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
        const docRef = await addDoc(collection(db, SELLER_COLLECTIONS.REVIEWS), reviewData);
        return docRef.id;
    } catch (e) {
        console.error('Error adding review:', e);
    }
}

export async function addTool(toolData) {
    try {
        const docRef = await addDoc(collection(db, SELLER_COLLECTIONS.TOOLS), toolData);
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

/** Listen to orders in real time – for seller dashboard (frontseller). */
export function listenForOrders(callback) {
    const colRef = collection(db, SELLER_COLLECTIONS.ORDERS);
    return onSnapshot(colRef, (snapshot) => {
        const orders = [];
        snapshot.forEach((doc) => orders.push({ id: doc.id, ...doc.data() }));
        callback(orders, null);
    }, (err) => {
        console.error('Firebase listenForOrders error:', err);
        callback([], err);
    });
}

export async function saveSellerPageHeadings(pageId, extraHeadings) {
    const page = SELLER_PAGES[pageId];
    if (!page) return;
    const allHeadings = extraHeadings && Array.isArray(extraHeadings) ? [...page.headings, ...extraHeadings] : page.headings;
    return saveHeadings(page.key, allHeadings);
}

export async function saveSellerHomeSnapshot(extraData = {}) {
    const payload = { headings: SELLER_PAGES.home.headings, createdAt: new Date(), ...extraData };
    return addToCollection(SELLER_COLLECTIONS.SELLER_HEADINGS, payload);
}

export { app, analytics, db };
