import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getFirebaseApp, getFirebaseAnalytics, sendFirebaseMessage } from "./database-firebase-postgresql";

try {
  getFirebaseApp();
  getFirebaseAnalytics();
  sendFirebaseMessage("nauman ji done").catch((e: unknown) => console.warn("Firebase message:", e));
} catch (e) {
  console.warn("Firebase init skipped:", e);
}

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("No #root element");
createRoot(rootEl).render(<App />);
