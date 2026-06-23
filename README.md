# HealPoint API

A healthcare appointment management backend built with **Node.js**, **TypeScript**, **Express**, **Sequelize**, and **MySQL**.

HealPoint enables patients to book appointments with doctors, manage availability and special availability, process Razorpay payments, send notifications, and manage consultations.


Login Credentials:
---------------------
Admin:
-------

Email - sudhakar@gmail.com,
password - 123456

Doctor:
----------

Email: priya@gmail.com,
password: 123456

Patient:
-----------

Email: sudhakarinfoo@gmail.com,
password: 123456

Razorpay Card Details:
-------------------------

Card Number: 5267 3181 8797 5449,

Expiry : 12/26,

CVV: 123,

OTP: 1234 (or) 123456


HealPoint
---

## ✨ Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Refresh token support
- ✅ Role-based access control for `admin`, `doctor`, and `patient`
- ✅ Password reset via OTP email

### Doctor Management
- ✅ Create and manage doctor profiles
- ✅ Upload profile images via Cloudinary
- ✅ Assign departments and specializations
- ✅ Manage doctor availability and unavailability

### Patient Management
- ✅ Patient registration and profile updates
- ✅ Profile image uploads
- ✅ Appointment history access
- ✅ Patient ownership validation

### Appointment Scheduling
- ✅ Appointment booking and status tracking
- ✅ Consultation lifecycle management
- ✅ Appointment reminder emails
- ✅ Consultation expiry processing

### Availability Management
- ✅ Weekly availability schedules
- ✅ Special availability time slots
- ✅ Doctor unavailability handling
- ✅ Dynamic slot generation

### Payment Processing
- ✅ Razorpay order creation and verification
- ✅ Payment records and appointment payment lookup
- ✅ Payment expiry job support

### Notifications
- ✅ Doctor and department notifications
- ✅ Read/unread notification tracking

### Earnings & Dashboard
- ✅ Earnings summary endpoints for doctors
- ✅ Monthly payment reports
- ✅ Dashboard analytics for doctors/admins

### Reviews
- ✅ Write and fetch doctor reviews

### Dashboard
- ✅ Analytics endpoints for doctors and admin dashboards
---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| ORM | Sequelize |
| Database | MySQL |
| Authentication | JWT |
| Validation | Zod |
| File Uploads | Multer + Cloudinary |
| Payments | Razorpay |
| Environment | dotenv |
| Logging | Winston |
| Job Scheduler | node-cron |
| Email service | Resend|
| Video consultation | Jitsi|

---

## 🏗️ Project Architecture

The application follows a layered architecture:

```
Controller → Service → Repository → Database
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|-------------------------------|
| Controllers | HTTP request/response handling |
| Services | Business logic and orchestration |
| Repositories | Database access via Sequelize |
| Models | Sequelize entity definitions and associations |
| Middleware | Auth, validation, file upload, error handling |

---

## 📁 Project Structure

```
src/
├── config/                           # Config and third-party clients
│   ├── cloudinary.ts                 # Cloudinary config
│   ├── db.ts                        # Sequelize MySQL connection
│   ├── logger.ts                    # Winston logger setup
│   └── razorpay.ts                  # Razorpay client setup
│
├── middleware/                       # Express middleware
│   ├── authenticate.ts              # JWT authentication
│   ├── authorize.ts                 # Role-based authorization
│   ├── validator.ts                 # Request validation
│   ├── errorHandler.ts              # Global error handling
│   ├── rateLimiter.ts               # API rate limiting
│
├── models/                           # Sequelize models
│   ├── userModel.ts
│   ├── doctorModel.ts
│   ├── patientModel.ts
│   ├── appointmentModel.ts
│   ├── associationsModel.ts         # Model relationships
│
├── module/                           # Domain modules
│   ├── auth/                         # Auth endpoints and services
│   ├── doctors/                      # Doctor management
│   ├── patients/                     # Patient management
│   ├── specializations/              # Departments / specializations
│   ├── availability/                 # Availability schedules
│   ├── unavailability/               # Doctor unavailability
│   ├── specialAvailabilty/           # Special availability rules
│   ├── slots/                        # Slot lookup and generation
│   ├── appointments/                 # Appointment lifecycle
│   ├── payment/                      # Payment processing
│   ├── notifications/                # Notification management
│   ├── earnings/                     # Earnings and payment history
│   ├── reviews/                      # Doctor reviews
│   └── dashboard/                    # Analytics endpoints
│
├── migrations/                       # Sequelize migrations
├── seeders/                          # Seed data
├── types/                            # TypeScript definitions
├── utils/                            # Helper utilities and jobs
├── app.ts                            # Express app setup
└── server.ts                         # App startup and scheduled jobs
```

---

## 📦 Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd HealPoint
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following values:

```env
# Server
PORT=5000

# Database
DATABASE_URL=mysql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>

# JWT
JWT_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
npm start
```

---

## ⚙️ Configuration

| Setting | Value |
|---------|-------|
| Base URL | `/api` |
| Auth URL | `/api/auth` |
| Notifications URL | `/api/notifications` |
| Database | MySQL via Sequelize |
| Background Jobs | Payment expiry, consultation expiry, appointment reminders |
| CORS origins | `http://localhost:5173`, `http://localhost:3000`, Vercel domains |

---

## 🧩 Environment Variables

The runtime uses environment variables directly. The project also includes Sequelize CLI config in `src/config/config.cjs`.

Required variables:

```env
PORT=5000
DATABASE_URL=mysql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>
JWT_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

> Note: `src/config/db.ts` reads `process.env.DATABASE_URL` at runtime. `src/config/config.cjs` also supports Sequelize CLI environments.

---

## 📡 Key Functionality

- JWT authentication and role-based authorization
- Doctor, patient, availability, unavailability, and special availability management
- Appointment booking, consultation lifecycle, and join links
- Razorpay payment order creation and verification
- Cloudinary image uploads for doctor/patient profile photos
- Email OTP and appointment notification emails
- Scheduled jobs for payment expiry, consultation expiry, and reminders
- Doctor earnings and admin dashboard reports
- Notifications and review management

---

## 📘 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive access token |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/forgot-password` | Request password reset OTP |
| POST | `/api/auth/reset-password` | Reset password using OTP |
| POST | `/api/auth/verify-reset-otp` | Verify password reset OTP |
| Put  | `/api/auth/update-admin-profile` |Update Admin profile |

### File Upload

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload image via Cloudinary |

### Doctor Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/doctors` | Create doctor (admin only) |
| GET | `/api/doctors` | Get all doctors |
| GET | `/api/doctors/me` | Get current doctor profile |
| GET | `/api/doctors/:id` | Get doctor by ID |
| PUT | `/api/doctors/:id/photo` | Upload doctor profile photo |
| PUT | `/api/doctors/:id` | Update doctor profile |
| DELETE | `/api/doctors/:id` | Delete doctor (admin only) |

### Patient Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | Get all patients (admin only) |
| GET | `/api/patients/me` | Get current patient profile |
| PUT | `/api/patients/me` | Update current patient profile |
| PUT | `/api/patients/me/photo` | Upload patient profile photo |
| GET | `/api/patients/:id` | Get patient by ID |
| PUT | `/api/patients/:id` | Update patient profile |
| PUT | `/api/patients/:id/photo` | Upload patient profile photo |
| DELETE | `/api/patients/:id` | Delete patient (admin only) |

### Departments / Specializations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/departments` | Create specialization/department (admin only) |
| GET | `/api/departments` | List all specializations |
| GET | `/api/departments/:id` | Get specialization by ID (admin only) |
| PUT | `/api/departments/:id` | Update specialization (admin only) |
| DELETE | `/api/departments/:id` | Delete specialization (admin only) |

### Availability

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/availability` | Create doctor availability |
| GET | `/api/doctors/:doctorId/availability` | List availability for a doctor |
| GET | `/api/availability/:id` | Get availability details |
| PUT | `/api/availability/:id` | Update availability |
| DELETE | `/api/availability/:id` | Delete availability |

### Unavailability

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/unavailability` | Create unavailability |
| GET | `/api/doctors/:doctorId/unavailability` | List unavailability for a doctor |
| GET | `/api/unavailability/:id` | Get unavailability details |
| DELETE | `/api/unavailability/:id` | Delete unavailability |

### Special Availability

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/special-availability` | Create special availability |
| GET | `/api/:doctorId/special-availability` | List special availability for a doctor |
| GET | `/api/special-availability/:id` | Get special availability by ID |
| PUT | `/api/special-availability/:id` | Update special availability |
| DELETE | `/api/special-availability/:id` | Delete special availability |

### Slots

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/slots/:doctorId` | Retrieve available slots for a doctor |

### Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments/book` | Book an appointment |
| GET | `/api/appointments` | Get all appointments (admin only) |
| GET | `/api/appointments/:id` | Get appointment by ID |
| GET | `/api/appointments/:id/join` | Join consultation |
| GET | `/api/patient/my-appointments` | Get current patient appointments |
| GET | `/api/doctor/my-appointments` | Get current doctor appointments |
| PATCH | `/api/appointments/:id/start` | Start consultation |
| PATCH | `/api/appointments/:id/complete` | Complete consultation |
| PATCH | `/api/appointments/:id/cancel` | Cancel appointment |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment signature |
| GET | `/api/payments/appointment/:appointmentId` | Get payment details for appointment |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notifications/doctor` | Create doctor notification |
| POST | `/api/notifications/department` | Create department notification |
| GET | `/api/notifications` | Get notifications |
| PATCH | `/api/notifications/read` | Mark notifications read |

### Earnings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctor/earnings/summary` | Get doctor earnings summary |
| GET | `/api/doctor/earnings/payments` | Get doctor payment history |
| GET | `/api/doctor/earnings/monthly` | Get monthly earnings |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctor/dashboard/summary` | Doctor dashboard summary |
| GET | `/api/doctor/dashboard/today-appointments` | Doctor today appointment summary |
| GET | `/api/doctor/dashboard/weekly-load` | Doctor weekly load chart |
| GET | `/api/doctor/dashboard/monthly-overview` | Doctor monthly overview |
| GET | `/api/admin/dashboard/appointmentsOverview` | Admin appointment overview |
| GET | `/api/admin/doctor-availability-dashboard` | Admin doctor availability dashboard |
| GET | `/api/admin/dashboard/earnings-report` | Admin earnings report |
| GET | `/api/admin/dashboard-overview` | Admin dashboard overview |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews/add` | Add doctor review |
| GET | `/api/reviews/:doctorId` | Get reviews for a doctor |

---

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Refresh token support
- ✅ Role-based authorization
- ✅ Zod validation for request payloads
- ✅ Centralized error handling
- ✅ Protected route middleware
- ✅ BCrypt password hashing

---

## 🚀 Notes

- `npm run dev` uses `nodemon` and `tsx` to run `src/server.ts` directly.
- The app initializes Sequelize associations in `src/models/associationsModel.ts` before routing.
- Image uploads use Cloudinary; `POST /api/upload` returns the hosted image URL.
- The app starts by authenticating the database and launching scheduled jobs for payment expiry, consultation expiry, and reminders.
- `src/config/config.cjs` contains Sequelize CLI environment settings.

---

## 📄 Important Files

| File | Purpose |
|------|---------|
| `src/server.ts` | Server bootstrap, DB auth, and scheduled job startup |
| `src/app.ts` | Express application setup and route mounting |
| `src/config/db.ts` | Sequelize database connection using `DATABASE_URL` |
| `src/config/razorpay.ts` | Razorpay client initialization |
| `src/config/cloudinary.ts` | Cloudinary file upload configuration |
| `src/models/associationsModel.ts` | Defines model relationships |
| `src/config/config.cjs` | Sequelize CLI environment config |
| `postman/` | Postman collections and environments |

    ↓
Payment is verified
    ↓
Appointment / consultation lifecycle continues
```

---

## 🚀 Notes

- Development uses `nodemon` and `tsx` to run `src/server.ts` directly.
- Uploaded files are served from the `uploads` directory.
- The API starts by authenticating the database, then launches scheduled jobs for payment expiry and consultation expiry.
- Route modules are mounted under `/api`, with notifications mounted under `/api/notifications`.


## 🔒 Security Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Refresh Token Rotation** - Enhanced token security
- ✅ **Role-Based Authorization** - Fine-grained access control
- ✅ **Request Validation** - Zod schema validation
- ✅ **Centralized Error Handling** - Consistent error responses
- ✅ **Protected Routes** - Middleware-based route protection
- ✅ **Secure Password Hashing** - BCrypt hashing
---

## 🚀 Future Enhancements

- 🧪 **Unit Testing** - Comprehensive test coverage
- 🔄 **Integration Testing** - End-to-end testing
- 🐳 **Docker Support** - Containerization
- 🔀 **CI/CD Pipeline** - Automated deployments
- 📱 **SMS Notifications** - SMS alerts
- 💾 **Redis Caching** - Performance optimization
---

## 📄 Important Files

| File | Purpose |
|------|---------|
| `src/server.ts` | Server bootstrap and initialization |
| `src/app.ts` | Express configuration and middleware setup |
| `src/config/db.ts` | Database connection management |
| `src/models/` | Sequelize ORM models |
| `src/models/associationsModel.ts` | Model relationships and associations |
| `src/module/` | Feature modules (organized by domain) |
| `src/middleware/` | Shared middleware for authentication, validation, error handling |
---

## ✅ Current Status

### Completed Features
- ✅ Authentication & JWT Management
- ✅ Doctor Profile Management
- ✅ Patient Profile Management
- ✅ Availability Scheduling
- ✅ Appointment Booking System
- ✅ Payment Integration (Razorpay)
- ✅ Real-time Notifications
- ✅ Earnings Dashboard



---

## 📝 License

This project is licensed under the MIT License.

## 💬 Support

For support, please open an issue in the repository or contact the development team.