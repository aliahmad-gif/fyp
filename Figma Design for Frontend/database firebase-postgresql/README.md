# Firebase + PostgreSQL (Database)

Firebase is connected to this project.

**Configuration:** Uses project `websmart-702de` (from FlutterFire CLI / DefaultFirebaseOptions).

**Implementation:** All Firebase code lives in:
- `src/database-firebase-postgresql/` (config, app init, auth, Realtime Database)

**How to check Firebase connected yes/no:**

1. **In code:** Import and call:
   ```ts
   import { getFirebaseConnected } from '@/database-firebase-postgresql';
   const connected = getFirebaseConnected(); // true = yes, false = no
   ```

2. **In UI:** The app footer shows: **"Firebase connected: yes"** or **"Firebase connected: no"**.

3. **From auth context:** `useAuth().isFirebaseConnected` (boolean).

**Auth:** Login and Sign up use Firebase Authentication (email/password). User state is synced via `onAuthStateChanged`.
