// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjYPdRnwuRSAfTZDZ9fkS-f7hDQccOjOY",
    authDomain: "smart-fitao-web-app.firebaseapp.com",
    projectId: "smart-fitao-web-app",
    storageBucket: "smart-fitao-web-app.firebasestorage.app",
    messagingSenderId: "297491352350",
    appId: "1:297491352350:web:e9ee8f4f49bf71afd0570f",
    measurementId: "G-4NM9QS41KQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
// Initialize Firestore
import { getFirestore, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
const db = getFirestore(app);

// Enable Offline Persistence (Local Save)
enableIndexedDbPersistence(db)
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            console.log('Persistence failed: Multiple tabs open');
        } else if (err.code == 'unimplemented') {
            console.log('Persistence failed: Browser not supported');
        }
    });

console.log("Firebase initialized successfully");

export { app, analytics, db };
