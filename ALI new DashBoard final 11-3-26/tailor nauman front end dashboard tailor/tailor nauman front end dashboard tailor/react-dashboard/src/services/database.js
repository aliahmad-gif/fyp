import { db } from '../firebase';
import { collection, addDoc, getDocs, onSnapshot, serverTimestamp } from "firebase/firestore";

const MESSAGES_COLLECTION = "Tailor_messages";

function sortByTime(msgs) {
    return [...msgs].sort((a, b) => {
        const t = (m) => m?.timestamp?.toMillis?.() ?? m?.timestamp ?? 0;
        return t(a) - t(b);
    });
}

// --- Users Collection ---
export async function saveUserProfile(userData) {
    try {
        const docRef = await addDoc(collection(db, "users"), userData);
        return docRef.id;
    } catch (e) {
        console.error("Error adding user profile: ", e);
    }
}

// --- Orders Collection ---
export async function createOrder(orderData) {
    try {
        const docRef = await addDoc(collection(db, "orders"), orderData);
        return docRef.id;
    } catch (e) {
        console.error("Error creating order: ", e);
    }
}

// --- Income/Analytics Collection ---
export async function logIncome(incomeData) {
    try {
        const docRef = await addDoc(collection(db, "income"), incomeData);
        return docRef.id;
    } catch (e) {
        console.error("Error logging income: ", e);
    }
}

// --- Messages Collection ---
export async function sendMessage(messageData) {
    try {
        console.log("Attempting to send message data to Firebase:", messageData);
        const dataWithTime = {
            ...messageData,
            timestamp: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), dataWithTime);
        console.log("MESSAGE SAVED SUCCESSFULLY TO FIREBASE. Document ID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("FIREBASE ERROR: Error sending message:", e);
        throw e; // Rethrow to let the UI know it failed.
    }
}

/** One-time load to test connection and get initial messages */
export async function loadMessagesOnce() {
    const snap = await getDocs(collection(db, MESSAGES_COLLECTION));
    const messages = [];
    snap.forEach((doc) => messages.push({ id: doc.id, ...doc.data() }));
    return sortByTime(messages);
}

export function listenForAllMessages(callback) {
    const colRef = collection(db, MESSAGES_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
        });
        callback(sortByTime(messages), null);
    }, (err) => {
        console.error("Firebase listenForAllMessages error:", err);
        callback([], err);
    });
}

export function listenForChatMessages(activeContact, myRole, callback) {
    const colRef = collection(db, MESSAGES_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            messages.push({ id: doc.id, ...data });
        });

        const receiver = (msg) => msg.receiver || msg.recipient;
        const filtered = messages.filter(msg => {
            const toMe = receiver(msg) === myRole || receiver(msg) === "Seller";
            const toContact = receiver(msg) === activeContact;
            const fromContact = msg.sender === activeContact;
            const fromMe = msg.sender === myRole || msg.sender === "Seller";
            return (fromContact && toMe) || (fromMe && toContact);
        });

        callback(sortByTime(filtered), null);
    }, (err) => {
        console.error("Firebase listenForChatMessages error:", err);
        callback([], err);
    });
}

// --- Reviews Collection ---
export async function addReview(reviewData) {
    try {
        const docRef = await addDoc(collection(db, "reviews"), reviewData);
        return docRef.id;
    } catch (e) {
        console.error("Error adding review: ", e);
    }
}

// --- Tools Collection ---
export async function addTool(toolData) {
    try {
        const docRef = await addDoc(collection(db, "tools"), toolData);
        return docRef.id;
    } catch (e) {
        console.error("Error adding tool: ", e);
    }
}

export async function addToCollection(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        return docRef.id;
    } catch (e) {
        console.error(`Error adding to ${collectionName}: `, e);
    }
}
