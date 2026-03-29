// Firebase helpers for WebSeller - DashboardLogout

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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
const auth = getAuth(app);
const db = getFirestore(app);

// Store heading
const heading = 'Logout';
await addDoc(collection(db, 'sellerDashboardweb'), {
    page: 'DashboardLogout',
    heading,
    timestamp: new Date()
}).catch(e => console.error('Failed to save DashboardLogout heading:', e));

export { app, auth, db };
