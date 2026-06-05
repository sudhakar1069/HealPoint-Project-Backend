HealPoint API

A scalable healthcare appointment management backend built with Node.js, TypeScript, Express, Sequelize, and MySQL.

HealPoint enables patients to book appointments with doctors, manage availability schedules, process payments, receive notifications, and conduct online consultations.

Features
Authentication & Authorization
JWT-based authentication
Access token & refresh token flow
Role-based access control
Admin
Doctor
Patient
Doctor Management
Create and manage doctor profiles
Upload doctor profile photos
Assign departments/specializations
Manage doctor availability
Patient Management
Patient profile management
Profile image uploads
Appointment history
Appointment Scheduling
Slot generation
Appointment booking
Appointment status tracking
Consultation lifecycle management
Availability Management
Weekly availability
Special availability
Unavailability scheduling
Dynamic slot calculation
Payment Processing
Razorpay integration
Order creation
Payment verification
Payment tracking
Notifications
Doctor notifications
Department notifications
Read/unread tracking
Earnings Management
Earnings summary
Monthly earnings reports
Payment history
Online Consultation
Consultation join endpoint
Appointment start/completion tracking
Tech Stack
Category	Technology
Runtime	Node.js
Language	TypeScript
Framework	Express.js
ORM	Sequelize
Database	MySQL
Authentication	JWT
Validation	Zod
File Uploads	Multer
Payments	Razorpay
Environment	dotenv
Project Architecture

The application follows a layered architecture:

Controller
    ↓
Service
    ↓
Repository
    ↓
Database
Responsibilities
Controllers

Handle HTTP requests and responses.

Services

Contain business logic and validations.

Repositories

Handle database operations.

Models

Define Sequelize entities and associations.

Middleware

Authentication, authorization, validation, uploads, and error handling.

Project Structure
src/
│
├── config/
│   ├── db.ts
│   └── config.json
│
├── middleware/
│
├── models/
│   ├── associationsModel.ts
│   └── *.ts
│
├── module/
│   ├── auth/
│   ├── doctors/
│   ├── patients/
│   ├── departments/
│   ├── availability/
│   ├── unavailability/
│   ├── specialAvailability/
│   ├── slots/
│   ├── appointments/
│   ├── payments/
│   ├── notifications/
│   └── earnings/
│
├── app.ts
└── server.ts
Installation
Clone Repository
git clone <repository-url>
cd healpoint
Install Dependencies
npm install
Configure Environment Variables

Create a .env file:

PORT=5000

DB_NAME=heal_point
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
Run Development Server
npm run dev
Build Production
npm run build
npm start
Server Configuration
Setting	Value
Base URL	/api
Static Uploads	/uploads
Default Frontend Origin	http://localhost:5173
Database Modules

The system contains the following core entities:

Users
Doctors
Patients
Departments
Availability
Unavailability
Special Availability
Slots
Appointments
Payments
Notifications
Appointment Workflow
Doctor Creates Availability
            ↓
      Slots Generated
            ↓
Patient Books Appointment
            ↓
Payment Order Created
            ↓
Payment Verified
            ↓
Appointment Confirmed
            ↓
Patient Joins Consultation
            ↓
Doctor Starts Consultation
            ↓
Doctor Completes Consultation
            ↓
Earnings Recorded
Authentication Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login
POST	/api/auth/refresh	Refresh access token
POST	/api/auth/logout	Logout
Doctor Endpoints
Method	Endpoint
POST	/api/doctors
GET	/api/doctors
GET	/api/doctors/me
GET	/api/doctors/:id
PUT	/api/doctors/:id
PUT	/api/doctors/:id/photo
DELETE	/api/doctors/:id
Patient Endpoints
Method	Endpoint
GET	/api/patients
GET	/api/patients/me
PUT	/api/patients/me
PUT	/api/patients/me/photo
GET	/api/patients/:id
PUT	/api/patients/:id
PUT	/api/patients/:id/photo
DELETE	/api/patients/:id
Department Endpoints
Method	Endpoint
POST	/api/departments
GET	/api/departments
GET	/api/departments/:id
PUT	/api/departments/:id
DELETE	/api/departments/:id
Availability Endpoints
Method	Endpoint
POST	/api/availability
GET	/api/doctors/:doctorId/availability
GET	/api/availability/:id
PUT	/api/availability/:id
DELETE	/api/availability/:id
Unavailability Endpoints
Method	Endpoint
POST	/api/unavailability
GET	/api/doctors/:doctorId/unavailability
GET	/api/unavailability/:id
PUT	/api/unavailability/:id
DELETE	/api/unavailability/:id
Special Availability Endpoints
Method	Endpoint
POST	/api/special-availability
GET	/api/:doctorId/special-availability
GET	/api/special-availability/:id
PUT	/api/special-availability/:id
DELETE	/api/special-availability/:id
Slot Endpoints
Method	Endpoint
GET	/api/slots/:doctorId
Appointment Endpoints
Method	Endpoint
POST	/api/appointments/book
GET	/api/appointments
GET	/api/appointments/:id
GET	/api/:id/join
PATCH	/api/appointments/:id/start
PATCH	/api/appointments/:id/complete
GET	/api/doctor/my-appointments
GET	/api/patient/my-appointments
Payment Endpoints
Method	Endpoint
POST	/api/payments/create-order
POST	/api/payments/verify
GET	/api/payments/appointment/:appointmentId
Notification Endpoints
Method	Endpoint
POST	/api/notifications/doctor
POST	/api/notifications/department
GET	/api/notifications
PATCH	/api/notifications/read
Earnings Endpoints
Method	Endpoint
GET	/api/doctor/earnings/summary
GET	/api/doctor/earnings/payments
GET	/api/doctor/earnings/monthly
Security Features
JWT Authentication
Refresh Token Rotation
Role-Based Authorization
Request Validation using Zod
Centralized Error Handling
Protected Routes
Secure Password Hashing
Future Enhancements
Swagger/OpenAPI Documentation
Unit Testing
Integration Testing
Docker Support
CI/CD Pipeline
Email Notifications
SMS Notifications
Video Consultation Integration (Jitsi/WebRTC)
Redis Caching
Audit Logging
Important Files
File	Purpose
src/server.ts	Server bootstrap
src/app.ts	Express configuration
src/config/db.ts	Database connection
src/models	Sequelize models
src/models/associationsModel.ts	Model relationships
src/module	Feature modules
src/middleware	Shared middleware
Current Status

✅ Authentication

✅ Doctor Management

✅ Patient Management

✅ Availability Management

✅ Appointment Booking

✅ Payment Integration

✅ Notifications

✅ Earnings Dashboard

🚧 Video Consultation Integration

🚧 Automated Testing

🚧 Swagger Documentation