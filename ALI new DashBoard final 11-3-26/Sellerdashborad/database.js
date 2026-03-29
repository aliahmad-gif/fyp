import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, onSnapshot, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- Users Collection (for profile.html) ---
export async function saveUserProfile(userData) {
    try {
        const docRef = await addDoc(collection(db, "users"), userData);
        console.log("User Profile saved with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding user profile: ", e);
    }
}

// --- Orders Collection (for order.html) ---
export async function createOrder(orderData) {
    try {
        const docRef = await addDoc(collection(db, "orders"), orderData);
        console.log("Order created with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error creating order: ", e);
    }
}

// --- Income/Analytics Collection (for income.html & Analytics.html) ---
export async function logIncome(incomeData) {
    try {
        const docRef = await addDoc(collection(db, "income"), incomeData);
        console.log("Income logged with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error logging income: ", e);
    }
}

// --- Messages Collection (for messages.html) ---
// --- Messages Collection (for messages.html) ---
export async function sendMessage(messageData) {
    try {
        // Add server timestamp for consistent ordering
        const dataWithTime = {
            ...messageData,
            timestamp: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, "Tailor_messages"), dataWithTime);
        console.log("Message sent with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error sending message: ", e);
        throw e; // Re-throw to inform the caller
    }
}

export function listenForMessages(callback) {
    const q = query(collection(db, "Tailor_messages"), orderBy("timestamp", "asc"));
    return onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
        });
        callback(messages);
    });
}

// --- Reviews Collection (for reviews.html) ---
export async function addReview(reviewData) {
    try {
        const docRef = await addDoc(collection(db, "reviews"), reviewData);
        console.log("Review added with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding review: ", e);
    }
}

// --- Tools Collection (for tools.html) ---
export async function addTool(toolData) {
    try {
        const docRef = await addDoc(collection(db, "tools"), toolData);
        console.log("Tool added with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding tool: ", e);
    }
}

// --- Generic Function to add data to any collection ---
export async function addToCollection(collectionName, data) {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log(`Data added to ${collectionName} with ID: `, docRef.id);
        return docRef.id;
    } catch (e) {
        console.error(`Error adding to ${collectionName}: `, e);
    }
}