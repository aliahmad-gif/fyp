## SmartFitao Django Backend

This backend provides APIs for:

- **User registration** with OTP verification
- **Login** (email + password)
- **Password reset** via OTP
- **Profile** endpoint for the logged-in user
- Optional hook to **sync verified users to Firebase** (for your existing Firebase setup)

### Project structure

- `smartfitao_backend/` – Django project settings and root URLs
- `accounts/` – app that contains models and APIs for auth and profile
- `requirements.txt` – Python dependencies for this backend

### Running locally

From the `django backend` folder:

```bash
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

The API will be available at `http://127.0.0.1:8000/` (or `http://localhost:8000/`).

### Main endpoints

All JSON requests and responses.

- `POST /api/auth/register/`  
  Request:
  ```json
  { "name": "User Name", "email": "user@example.com", "password": "secret123", "phone": "0300..." }
  ```
  Response: user info + OTP code (for development).

- `POST /api/auth/verify-signup-otp/`  
  Request:
  ```json
  { "email": "user@example.com", "code": "123456" }
  ```
  Response: success + JWT tokens.

- `POST /api/auth/login/`  
  Request:
  ```json
  { "email": "user@example.com", "password": "secret123" }
  ```
  Response: success + JWT tokens + user info.

- `POST /api/auth/request-password-reset/`  
  Request:
  ```json
  { "email": "user@example.com" }
  ```
  Response: message + OTP code (for development).

- `POST /api/auth/reset-password/`  
  Request:
  ```json
  { "email": "user@example.com", "code": "123456", "new_password": "newpass123" }
  ```

- `GET /api/auth/profile/`  
  Requires `Authorization: Bearer <access_token>` header. Returns profile info for the logged-in user.

### Firebase integration (optional)

The helper `_sync_user_to_firebase` in `accounts/views.py` is where you can mirror verified users to Firebase (e.g. create them in Firebase Auth or Firestore). To enable this, you need to provide your Firebase **service account** credentials and configure `firebase_admin` according to your project.

