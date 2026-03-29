// Firebase helpers for WebSeller - DashboardMessages

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBgLrPpx9TowdhgGVVbjCIk4irliybdKb8",
    authDomain: "websmart-702de.firebaseapp.com",
    projectId: "websmart-702de",
    storageBucket: "websmart-702de.firebasestorage.app",
    messagingSenderId: "15597410237",
    appId: "1:15597410237:web:cbd96cee1c20888b5aa4d4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Store heading
const heading = 'Messages';
await addDoc(collection(db, 'sellerDashboardweb'), {
    page: 'DashboardMessages',
    heading,
    timestamp: new Date()
}).catch(e => console.error('Failed to save DashboardMessages heading:', e));

export { app, db };
