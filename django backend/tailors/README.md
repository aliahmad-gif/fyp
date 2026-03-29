# Tailors app – backend and table names

## Table name (Django / DB)

| Table name       | Model   | Description                                      |
|------------------|--------|--------------------------------------------------|
| **tailors_tailor** | Tailor | One row per tailor: name, location, specification, available_status, about, image |

## Model fields (Tailor)

- `id` (auto primary key)
- `name` (CharField 255)
- `location` (CharField 255)
- `specification` (CharField 255) – e.g. Wedding Gowns, Bespoke Suits
- `available_status` (BooleanField) – Yes=True, No=False
- `about` (TextField)
- `image` (URLField 500, optional)
- `created_at`, `updated_at` (auto)

## Django admin (dashboard)

- **URL:** `/admin/`
- **App:** Tailors → Tailors
- Add/edit/delete tailors; list by name, location, specification, available status.

## API endpoints

| Method | URL                      | Description                    |
|--------|--------------------------|--------------------------------|
| GET    | `/api/tailors/`          | List all tailors (optional `?location=&specification=`) |
| GET    | `/api/tailors/<id>/`     | One tailor by id              |
| POST   | `/api/tailors/create/`   | Create tailor (JSON body)      |
| PUT    | `/api/tailors/<id>/update/` | Update tailor              |
| DELETE | `/api/tailors/<id>/delete/` | Delete tailor              |

## Linking with Firebase

The frontend **Tailor Discovery** page reads tailors from **Firebase** (see `TAILOR_FIREBASE.ts`). To keep Firebase in sync with Django:

1. Manage tailors in Django admin (or via API).
2. Use a Django management command or a small script that reads from Django and writes to Firebase (e.g. using Firebase Admin SDK or the frontend’s `saveTailorToFirebase`).
3. Or call the frontend’s Firebase write when creating/updating tailors from your dashboard (e.g. from a custom admin action or a separate dashboard app that calls both Django API and Firebase).

Firebase path: `nauman website/tailors` (each child key = tailor id, fields: name, location, specification, availableStatus, about, image, createdAt).
