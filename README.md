# HealPoint API

Overview
- HealPoint is an Express + Sequelize backend for managing doctors, patients, availability/unavailability, departments and notifications.
- Project follows a repository → service → controller structure under `src/module`.
- Static uploads are served from `/uploads` and mounted at `/uploads`.

Tech
- Node.js, Express, TypeScript
- Sequelize (Postgres/MySQL configurable via `config/config.json`)

Quick start
1. Install dependencies:
```
npm install
```
2. Configure DB in `src/config/config.json` (or set `NODE_ENV` + env vars)
3. Build / run in development (ts-node or transpile to JS depending on your setup):
```
npm run dev
```

Server
- Entry: `src/server.ts` — connects Sequelize and starts the Express app from `src/app.ts`.
- App middleware and routing are configured in `src/app.ts`.

Auth
- Routes mounted under `/api/auth`.
- Endpoints:
  - `POST /api/auth/register` — register a new user (validates `registerSchema`).
  - `POST /api/auth/login` — login, returns `accessToken` and sets `refreshToken` cookie.
  - `POST /api/auth/refresh` — exchange refresh cookie for a new access token.
  - `POST /api/auth/logout` — clears refresh cookie (requires authentication).

API routes (summary)
- Base: `/api`

- Doctors (`/api` + doctor routes):
  - `POST /api/doctors` — create doctor (auth: `admin`, file upload `profile_picture`).
  - `GET  /api/doctors` — paginated list (auth: `admin|doctor|patient`).
  - `GET  /api/doctors/me` — current doctor profile (auth: `doctor`).
  - `GET  /api/doctors/:id` — doctor by id (auth: `admin|doctor|patient`).
  - `PUT  /api/doctors/:id/photo` — update photo (auth: `doctor|admin`).
  - `PUT  /api/doctors/:id` — update doctor (auth: `admin|doctor`, ownership enforced).
  - `DELETE /api/doctors/:id` — delete doctor (auth: `admin`).

- Patients (`/api` + patient routes):
  - `GET  /api/patients` — list patients (auth: `admin`).
  - `GET  /api/patients/me` — current patient profile (auth: `patient`).
  - `PUT  /api/patients/me` — update own profile (auth: `patient`).
  - `PUT  /api/patients/me/photo` — update own photo (auth: `patient`).
  - `GET  /api/patients/:id` — get patient by id (auth: `patient`).
  - `PUT  /api/patients/:id` — update patient (auth: `patient`, ownership enforced).
  - `PUT  /api/patients/:id/photo` — update patient photo (auth: `patient`, ownership enforced).
  - `DELETE /api/patients/:id` — delete patient (auth: `admin`).

- Departments (`/api` + department routes):
  - `POST /api/departments` — create specialization (auth: `admin`).
  - `GET  /api/departments` — list specializations (auth: `admin|doctor|patient`).
  - `GET  /api/departments/:id` — get specialization (auth: `admin`).
  - `PUT  /api/departments/:id` — update specialization (auth: `admin`).
  - `DELETE /api/departments/:id` — delete specialization (auth: `admin`).

- Availability (`/api` + availability routes):
  - `POST /api/availability` — create availability (auth required).
  - `GET  /api/doctors/:doctorId/availability` — list a doctor's availability (public).
  - `GET  /api/availability/:id` — get availability (auth required).
  - `PUT  /api/availability/:id` — update availability (auth + ownership).
  - `DELETE /api/availability/:id` — delete availability (auth + ownership).

- Unavailability (`/api` + unavailability routes):
  - `POST /api/unavailability` — create unavailability (auth required).
  - `GET  /api/doctors/:doctorId/unavailability` — list a doctor's unavailabilities (public).
  - `GET  /api/unavailability/:id` — get unavailability (auth required).
  - `PUT  /api/unavailability/:id` — update unavailability (auth + ownership).
  - `DELETE /api/unavailability/:id` — delete unavailability (auth + ownership).

- Notifications (`/api/notifications`):
  - `POST /api/notifications/doctor` — create doctor notification.
  - `POST /api/notifications/department` — create department notification.
  - `GET  /api/notifications` — list notifications (paginated).
  - `PATCH /api/notifications/read` — mark all notifications read.

Notes and caveats
- `appointment` routes/controllers are present but currently empty — appointments are not implemented yet.
- Authentication middleware: `src/middleware/authenticate.ts` and `authorize.ts` enforce access and roles.
- File uploads use `src/middleware/profile.ts` and saved files are served from `/uploads`.
- Errors are handled by `src/middleware/errorHandler.ts`.

Models (major files under `src/models`)
- `userModel.ts`, `doctorModel.ts`, `patientModel.ts`, `availabilityModel.ts`, `unavailabilityModel.ts`, `departmentModel.ts`, `notificationModel.ts`, `appointmentModel.ts`, `leaveModel.ts`, `specialAvailabilityModel.ts`.
- Associations are set up in `src/models/associationsModel.ts` (User↔Doctor, Doctor↔Availability, User↔Patient, Doctor↔Unavailability).

Directory notes
- Controllers, services and repositories live under `src/module/<feature>/`.
- Middleware lives under `src/middleware/`.

Next steps / suggestions
- Implement appointment endpoints and controllers (currently empty).
- Add tests for core flows (auth, create availability, doctor listing).
- Consider documenting request/response schemas or adding OpenAPI spec.

If you want, I can:
- generate a full OpenAPI spec from these routes,
- implement the missing appointment endpoints,
- or add quick `curl` examples for each protected endpoint.
