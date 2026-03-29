# Firebase rules reference

## Cloud Firestore rules

Use these in **Firebase Console → Firestore Database → Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

*(Note: `if true` allows all read/write. Tighten for production, e.g. with `request.auth != null`.)*

---

## Realtime Database rules

The app stores messages under **"nauman website"**. Use these in **Firebase Console → Realtime Database → Rules**:

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

For development you can also use:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

*(Tighten for production; e.g. allow write only when `auth != null`.)*
