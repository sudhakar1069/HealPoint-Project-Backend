# HealPoint API

A scalable healthcare appointment management backend built with **Node.js**, **TypeScript**, **Express**, **Sequelize**, and **MySQL**.

HealPoint enables patients to book appointments with doctors, manage availability schedules, process payments, receive notifications, and conduct online consultations.

---

## ✨ Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Token refresh and logout
- ✅ Role-based access control (admin, doctor, patient)
- ✅ Password reset flow with OTP verification

### Doctor Management
- ✅ Create and manage doctor profiles
- ✅ Upload doctor profile photos
- ✅ Assign departments / specializations
- ✅ Doctor profile and image updates

### Patient Management
- ✅ Patient profile management
- ✅ Profile image uploads
- ✅ Appointment history tracking
- ✅ Patient profile updates and ownership checks

### Appointment Scheduling
- ✅ Appointment booking system
- ✅ Appointment status tracking
- ✅ Consultation lifecycle management
- ✅ Consultation expiry job support

### Availability Management
- ✅ Weekly availability schedules
- ✅ Special availability slots
- ✅ Unavailability scheduling
- ✅ Dynamic slot generation

### Payment Processing
- ✅ Razorpay integration
- ✅ Order creation and verification
- ✅ Payment record retrieval
- ✅ Payment expiry job support

### Notifications
- ✅ Doctor and department notifications
- ✅ Read / unread tracking

### Earnings Management
- ✅ Earnings summary endpoints
- ✅ Monthly earnings reports
- ✅ Payment history retrieval

### Reviews
- ✅ Add reviews for doctors
- ✅ Retrieve doctor reviews

### Dashboard
- ✅ Analytics endpoints for doctors and admin dashboards
---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js |
| **Language** | TypeScript |
| **Framework** | Express.js |
| **ORM** | Sequelize |
| **Database** | MySQL |
| **Authentication** | JWT |
| **Validation** | Zod |
| **File Uploads** | Multer |
| **Payments** | Razorpay |
| **Environment** | dotenv |
| **Logging** | Winston |
| **Job Scheduler** | node-cron |
---

## 🏗️ Project Architecture

The application follows a **layered architecture** pattern:

```
Controller (HTTP Layer)
    ↓
Service (Business Logic)
    ↓
Repository (Data Access)
    ↓
Database (Persistence)
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|-----------------|
| **Controllers** | Handle HTTP requests and responses |
| **Services** | Contain business logic and validations |
| **Repositories** | Handle database operations |
| **Models** | Define Sequelize entities and associations |
| **Middleware** | Authentication, authorization, validation, uploads, error handling |

---

## 📁 Project Structure

```
src/
├── config/                           # Configuration files
│   ├── db.ts                        # Database connection via Sequelize
│   ├── logger.ts                    # Logger setup
│   └── razorpay.ts                  # Razorpay client setup
│
├── middleware/                       # Express middleware
│   ├── authenticate.ts              # JWT authentication
│   ├── authorize.ts                 # Role-based authorization
│   ├── validator.ts                 # Request validation
│   ├── errorHandler.ts              # Global error handling
│   ├── rateLimiter.ts               # API rate limiting
│   └── ...                          # Additional middleware
│
├── models/                           # Sequelize models
│   ├── userModel.ts
│   ├── doctorModel.ts
│   ├── patientModel.ts
│   ├── appointmentModel.ts
│   ├── associationsModel.ts         # Model relationships
│   └── ...                          # Other models
│
├── module/                           # Feature modules
│   ├── auth/                         # Auth routes, services, repository
│   ├── doctors/                      # Doctor management
│   ├── patients/                     # Patient management
│   ├── departments/                  # Department and specialization management
│   ├── availability/                 # Weekly availability
│   ├── unavailability/               # Doctor unavailability
│   ├── specialAvailabilty/           # Special availability schedules
│   ├── slots/                        # Slot lookup and generation
│   ├── appointments/                 # Appointment booking and management
│   ├── payment/                      # Payment orders and verification
│   ├── notifications/                # Notification creation and retrieval
│   ├── earnings/                     # Earnings and payment history
│   ├── reviews/                      # Doctor reviews
│   └── dashboard/                    # Dashboard analytics endpoints
│
├── migrations/                       # Sequelize database migrations
├── seeders/                          # Sequelize seeders
├── types/                            # TypeScript type definitions
├── utils/                            # Utility functions and scheduled jobs
├── app.ts                            # Express app setup
└── server.ts                         # Server bootstrap and job startup
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

Create a `.env` file in the root directory:

```env
# Server Configuration
port=5000

# Database Configuration
DB_NAME=heal_point
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost

# JWT Secrets
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Razorpay Configuration
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
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

## ⚙️ Server Configuration

| Setting | Value |
|---------|-------|
| **Base URL** | `/api` |
| **Auth URL** | `/api/auth` |
| **Notifications URL** | `/api/notifications` |
| **Static Uploads** | `/uploads` |
| **Frontend CORS Origin** | `http://localhost:5173` |
| **Database** | MySQL via Sequelize |
| **Background Jobs** | Payment expiry and consultation expiry |
---

## 📊 Database Modules

The system contains the following **core entities**:

- Users
- Doctors
- Patients
- Departments / Specializations
- Availability
- Unavailability
- Special Availability
- Slots
- Appointments
- Payments
- Notifications
- Reviews

### Appointment Workflow

```
Doctor creates availability
    ↓
Slots are generated
    ↓
Patient books appointment
    ↓
Payment order is created
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

| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | User logout |

### Doctor Management

| Method | Endpoint |
|--------|----------|
| POST | `/api/doctors` |
| GET | `/api/doctors` |
| GET | `/api/doctors/me` |
| GET | `/api/doctors/:id` |
| PUT | `/api/doctors/:id` |
| PUT | `/api/doctors/:id/photo` |
| DELETE | `/api/doctors/:id` |

### Patient Management

| Method | Endpoint |
|--------|----------|
| GET | `/api/patients` |
| GET | `/api/patients/me` |
| PUT | `/api/patients/me` |
| PUT | `/api/patients/me/photo` |
| GET | `/api/patients/:id` |
| PUT | `/api/patients/:id` |
| PUT | `/api/patients/:id/photo` |
| DELETE | `/api/patients/:id` |

### Department Management

| Method | Endpoint |
|--------|----------|
| POST | `/api/departments` |
| GET | `/api/departments` |
| GET | `/api/departments/:id` |
| PUT | `/api/departments/:id` |
| DELETE | `/api/departments/:id` |

### Availability Management

| Method | Endpoint |
|--------|----------|
| POST | `/api/availability` |
| GET | `/api/doctors/:doctorId/availability` |
| GET | `/api/availability/:id` |
| PUT | `/api/availability/:id` |
| DELETE | `/api/availability/:id` |

### Unavailability Management

| Method | Endpoint |
|--------|----------|
| POST | `/api/unavailability` |
| GET | `/api/doctors/:doctorId/unavailability` |
| GET | `/api/unavailability/:id` |
| PUT | `/api/unavailability/:id` |
| DELETE | `/api/unavailability/:id` |

### Special Availability

| Method | Endpoint |
|--------|----------|
| POST | `/api/special-availability` |
| GET | `/api/:doctorId/special-availability` |
| GET | `/api/special-availability/:id` |
| PUT | `/api/special-availability/:id` |
| DELETE | `/api/special-availability/:id` |

### Slots

| Method | Endpoint |
|--------|----------|
| GET | `/api/slots/:doctorId` |

### Appointment Management

| Method | Endpoint |
|--------|----------|
| POST | `/api/appointments/book` |
| GET | `/api/appointments` |
| GET | `/api/appointments/:id` |
| GET | `/api/:id/join` |
| PATCH | `/api/appointments/:id/start` |
| PATCH | `/api/appointments/:id/complete` |
| GET | `/api/doctor/my-appointments` |
| GET | `/api/patient/my-appointments` |

### Payment Processing

| Method | Endpoint |
|--------|----------|
| POST | `/api/payments/create-order` |
| POST | `/api/payments/verify` |
| GET | `/api/payments/appointment/:appointmentId` |

### Notifications

| Method | Endpoint |
|--------|----------|
| POST | `/api/notifications/doctor` |
| POST | `/api/notifications/department` |
| GET | `/api/notifications` |
| PATCH | `/api/notifications/read` |

### Earnings Management

| Method | Endpoint |
|--------|----------|
| GET | `/api/doctor/earnings/summary` |
| GET | `/api/doctor/earnings/payments` |
| GET | `/api/doctor/earnings/monthly` |
---

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

- 📋 **Swagger/OpenAPI Documentation** - Complete API documentation
- 🧪 **Unit Testing** - Comprehensive test coverage
- 🔄 **Integration Testing** - End-to-end testing
- 🐳 **Docker Support** - Containerization
- 🔀 **CI/CD Pipeline** - Automated deployments
- 📧 **Email Notifications** - Email alerts
- 📱 **SMS Notifications** - SMS alerts
- 🎥 **Video Consultation Integration** - Jitsi/WebRTC support
- 💾 **Redis Caching** - Performance optimization
- 📝 **Audit Logging** - Activity tracking
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

### In Progress
- 🚧 Video Consultation Integration
- 🚧 Automated Testing Suite
- 🚧 Swagger API Documentation

---

## 📝 License

This project is licensed under the MIT License.

## 💬 Support

For support, please open an issue in the repository or contact the development team.