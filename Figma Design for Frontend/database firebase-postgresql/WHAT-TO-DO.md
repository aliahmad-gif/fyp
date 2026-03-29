# What you need to do – Smartfitao + Firebase

Follow these steps in order.

---

## 1. Install dependencies

In a terminal, go to the frontend folder and install:

```bash
cd "D:\web all work fyp\smart fitao ai website complete\front-end fyp 0figma\Figma Design for Frontend"
npm install
```

---

## 2. Set Firebase Realtime Database rules

The app saves messages under **"nauman website"**. You must allow read/write in Firebase.

1. Open **Firebase Console**: https://console.firebase.google.com  
2. Select project **websmart-702de**  
3. Go to **Build → Realtime Database**  
4. Open the **Rules** tab  
5. Replace the rules with:

```json
{
  "rules": {
    "nauman website": {
      ".read": true,
      ".write": true
    }
  }
}
```

6. Click **Publish**

---

## 3. (Optional) Set Firestore rules

If you use Firestore later, set rules in **Build → Firestore Database → Rules**. See `RULES.md` in this folder for the exact text.

---

## 4. Run the app

```bash
cd "D:\web all work fyp\smart fitao ai website complete\front-end fyp 0figma\Figma Design for Frontend"
npm run dev
```

Open the URL shown (e.g. http://localhost:3000).

---

## 5. Check that Firebase is connected

- Scroll to the **footer** of the site.  
- It should say: **Firebase connected: yes**

If it says **no**, check the browser console (F12) for errors.

---

## 6. Test login / sign up

- Click **Login** or **Sign up**  
- Enter email and password (and name on sign up)  
- Submit. If Firebase Auth is set up in the console, you will be logged in.

---

## 7. See the message in Firebase

After the app has loaded once:

1. In Firebase Console go to **Realtime Database**  
2. You should see a key **nauman website**  
3. Under it, **messages** → each item has `text` (e.g. "nauman ji done") and `createdAt`

---

## Quick checklist

- [ ] Run `npm install` in the Figma Design for Frontend folder  
- [ ] Set Realtime Database rules (step 2) and Publish  
- [ ] Run `npm run dev` and open the app  
- [ ] Confirm footer shows **Firebase connected: yes**  
- [ ] (Optional) Test login/sign up and check **nauman website** in Realtime Database  

That’s it. If something doesn’t work, check the browser console (F12 → Console) for errors.
