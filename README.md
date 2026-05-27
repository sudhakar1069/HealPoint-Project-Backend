# HealPoint - Doctor Appointment Management System

A comprehensive backend API for managing doctor appointments, availability, and patient interactions. Built with TypeScript, Express.js, and MySQL.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Project Architecture](#project-architecture)

## 📌 Overview

HealPoint is a robust backend system designed to manage doctor appointments, availability schedules, patient records, and notifications. It provides a complete API for clinic/hospital management with user authentication, role-based access control, and comprehensive appointment management features.

## ✨ Features

- **User Management**
  - User registration and authentication (Admin, Doctor, Patient roles)
  - JWT-based authentication with refresh tokens
  - Profile management with picture upload
  - Role-based access control

- **Doctor Management**
  - Doctor profile creation and management
  - Department association
  - Availability scheduling
  - Leave/Unavailability management
  - Special availability slots

- **Patient Management**
  - Patient profile creation and management
  - Medical history tracking

- **Appointment Management**
  - Book/cancel appointments
  - Appointment tracking and status management
  - Appointment notifications

- **Availability Management**
  - Regular availability scheduling
  - Special availability management
  - Unavailability (leave) management
  - Automatic slot generation

- **Department Management**
  - Department creation and management
  - Department-specific doctor listing

- **Notifications**
  - Appointment notifications
  - Real-time notification system

- **File Management**
  - Profile picture uploads
  - File serving through static routes

## 🛠 Tech Stack

### Backend
- **Runtime:** Node.js (v26.0.0)
- **Language:** TypeScript (v6.0.3)
- **Framework:** Express.js (v5.2.1)
- **ORM:** Sequelize (v6.37.8)
- **Database:** MySQL (via mysql2)

### Authentication & Security
- **JWT:** jsonwebtoken (v9.0.3)
- **Password Hashing:** bcrypt (v6.0.0)
- **CORS:** cors (v2.8.6)
- **Cookie Parser:** cookie-parser (v1.4.7)

### Validation & Utilities
- **Validation:** Zod (v4.4.3)
- **File Upload:** multer (v2.1.1)
- **Environment:** dotenv (v17.4.2)
- **Development:** nodemon, tsx, ts-node-dev

## 📁 Project Structure

```
HealPoint/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   │
│   ├── config/
│   │   ├── config.json        # Database configuration
│   │   └── db.ts              # Database connection setup
│   │
│   ├── models/                # Sequelize models
│   │   ├── userModel.ts
│   │   ├── doctorModel.ts
│   │   ├── patientModel.ts
│   │   ├── appointmentModel.ts
│   │   ├── availabilityModel.ts
│   │   ├── unavailabilityModel.ts
│   │   ├── departmentModel.ts
│   │   ├── specialAvailabilityModel.ts
│   │   ├── notificationModel.ts
│   │   ├── leaveModel.ts
│   │   ├── associationsModel.ts
│   │   └── index.js
│   │
│   ├── module/                # Feature modules (MVC pattern)
│   │   ├── auth/
│   │   │   ├── authController.ts
│   │   │   ├── authService.ts
│   │   │   ├── authRepository.ts
│   │   │   └── authRoutes.ts
│   │   ├── doctors/
│   │   ├── patients/
│   │   ├── appointments/
│   │   ├── availability/
│   │   ├── unavailability/
│   │   ├── departments/
│   │   └── notifications/
│   │
│   ├── middleware/            # Express middleware
│   │   ├── asyncHandler.ts    # Async error handling
│   │   ├── authenticate.ts    # JWT authentication
│   │   ├── authorize.ts       # Role-based authorization
│   │   ├── errorHandler.ts    # Global error handler
│   │   ├── validator.ts       # Request validation
│   │   └── (ownership, profile middleware)
│   │
│   ├── migrations/            # Database migrations (Sequelize CLI)
│   ├── seeders/               # Database seeders
│   ├── schema/                # Zod validation schemas
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
│
├── uploads/                   # File upload directory
├── dist/                      # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Prerequisites

- **Node.js** (v26.0.0 or higher)
- **npm** or **yarn**
- **MySQL Server** (v5.7 or higher)
- **MySQL Client** (for command line access)

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd HealPoint
```

### Step 2: Install Dependencies

```bash
npm install
```

Or if using yarn:

```bash
yarn install
```

### Step 3: Create Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=heal_point

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# JWT Expiration
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## 🗄 Database Setup

### Step 1: Create Database

```bash
mysql -u root -p
```

Then in the MySQL prompt:

```sql
CREATE DATABASE heal_point;
EXIT;
```

### Step 2: Run Migrations

```bash
npx sequelize-cli db:migrate
```

This will create all necessary tables based on migration files in the `migrations/` directory.

### Step 3: (Optional) Seed Database

To populate initial data:

```bash
npx sequelize-cli db:seed:all
```

### Available Seeders

- Users (admin, doctor, patient accounts)
- Doctors with departments
- Patients
- Departments

## 🚀 Running the Application

### Development Mode (with hot reload)

```bash
npm run dev
```

This uses `nodemon` to watch for file changes and automatically restart the server. TypeScript files are compiled on-the-fly using `tsx`.

### Production Build

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Production Mode

```bash
npm start
```

Runs the compiled JavaScript from `dist/server.js`.

## 📡 API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

```
POST   /auth/register          # User registration
POST   /auth/login             # User login
POST   /auth/refresh-token     # Refresh access token
POST   /auth/logout            # User logout
```

### Doctor Endpoints

```
GET    /doctors                # List all doctors
GET    /doctors/:id            # Get doctor details
POST   /doctors                # Create doctor (admin)
PUT    /doctors/:id            # Update doctor
DELETE /doctors/:id            # Delete doctor
```

### Patient Endpoints

```
GET    /patients               # List all patients
GET    /patients/:id           # Get patient details
POST   /patients               # Create patient
PUT    /patients/:id           # Update patient
```

### Appointment Endpoints

```
GET    /appointments           # List appointments
GET    /appointments/:id       # Get appointment details
POST   /appointments           # Book appointment
PUT    /appointments/:id       # Update appointment
DELETE /appointments/:id       # Cancel appointment
```

### Availability Endpoints

```
GET    /availability           # Get availability
POST   /availability           # Create availability
PUT    /availability/:id       # Update availability
DELETE /availability/:id       # Delete availability
```

### Department Endpoints

```
GET    /departments            # List departments
POST   /departments            # Create department
PUT    /departments/:id        # Update department
DELETE /departments/:id        # Delete department
```

### Notification Endpoints

```
GET    /notifications          # Get notifications
GET    /notifications/:id      # Get specific notification
POST   /notifications          # Create notification
```

## 👨‍💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Run production server |
| `npm test` | Run tests (not configured yet) |

### Creating a New Module

Follow the existing pattern in `src/module/`:

```
module/moduleName/
├── moduleName Controller.ts    # Handle HTTP requests
├── moduleName Service.ts       # Business logic
├── moduleName Repository.ts    # Database queries
└── moduleName Routes.ts        # Route definitions
```

### Code Organization

- **Controllers:** Handle HTTP requests and responses
- **Services:** Contain business logic and validation
- **Repositories:** Handle database operations
- **Models:** Define data structure and relationships
- **Middleware:** Process requests/responses globally or for routes

## 🏗 Project Architecture

### MVC Pattern with Service Layer

```
Routes → Controller → Service → Repository → Model → Database
                        ↓
                    Validation/Business Logic
```

### Key Architectural Decisions

1. **Modular Structure:** Each feature is self-contained with its own controller, service, and repository
2. **Error Handling:** Centralized error handling middleware with async wrapper
3. **Authentication:** JWT-based with refresh token rotation
4. **Validation:** Zod schemas for request validation
5. **Database:** Sequelize ORM with migrations for version control
6. **Type Safety:** Full TypeScript implementation for better IDE support and fewer runtime errors

## 🔐 Authentication & Authorization

### JWT Implementation

- **Access Token:** Short-lived (15 minutes)
- **Refresh Token:** Long-lived (7 days), stored in httpOnly cookie
- **Role-based Access Control:** Admin, Doctor, Patient roles

### Protected Routes

Most API routes require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## 📝 Environment Variables Explanation

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `heal_point` |
| `JWT_SECRET` | JWT signing key | `your_secret_key` |
| `CORS_ORIGIN` | Frontend URL | `http://localhost:5173` |

## 🐛 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:** Ensure MySQL server is running and credentials are correct in `.env` file.

### Port Already in Use

```
Error: listen EADDRINUSE :::5000
```

**Solution:** Change `PORT` in `.env` file or kill process using the port.

### TypeScript Compilation Error

```
npm run build
```

Check `tsconfig.json` for compiler options.

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Guide](https://jwt.io/)

## 📄 License

ISC

---

**Last Updated:** May 2026  
**Developed by:** HealPoint Development Team
