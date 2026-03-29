import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBjYPdRnwuRSAfTZDZ9fkS-f7hDQccOjOY",
    authDomain: "smart-fitao-web-app.firebaseapp.com",
    projectId: "smart-fitao-web-app",
    storageBucket: "smart-fitao-web-app.firebasestorage.app",
    messagingSenderId: "297491352350",
    appId: "1:297491352350:web:e9ee8f4f49bf71afd0570f",
    measurementId: "G-4NM9QS41KQ"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db)
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.log('Persistence failed: Multiple tabs open');
            } else if (err.code === 'unimplemented') {
                console.log('Persistence failed: Browser not supported');
            }
        });
}

export { app, analytics, db };
