import express from "express";
import authRoutes from "./module/auth/authRoutes.js";
import uploadRoutes from "./module/upload/uploadRoutes.js"
import doctorRoutes from "./module/doctors/doctorRoutes.js"
import patientRoutes from "./module/patients/patientRoutes.js"
import departmentRoutes from "./module/Specializations/specializationRoutes.js"
import availabilityRoutes from "./module/availability/availabilityRoutes.js"
import unavailabilityRoutes from "./module/unavailability/unavailabilityRoutes.js"
import specialAvailabilityRoutes from "./module/specialAvailabilty/specialAvailabilityRouter.js"
import slotRoutes from "./module/slots/slotRoutes.js"
import appointmentRoutes from "./module/appointments/appointmentRoutes.js"
import paymentRoutes from "./module/payment/paymentRoutes.js"
import notificationRoutes from "./module/notifications/notificationRoutes.js"
import earningRoutes from "./module/earnings/earningRoutes.js"
import reviewRoutes from "./module/reviews/reviewRoutes.js"
import dashboardRoutes from "./module/dashboard/dashboardRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js";
// import { globalLimiter } from "./middleware/rateLimiter.js";
import "./models/associationsModel.js"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://heal-point-project-frontend-xy3b.vercel.app",
    "https://healpoint-frontend.vercel.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin (mobile apps, postman)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            if (origin.endsWith(".vercel.app")) {
                return callback(null, true);
            }

            return callback(null, false); // IMPORTANT: DO NOT throw error
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("trust proxy", 1);
// app.use(globalLimiter)
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use("/api", doctorRoutes)
app.use("/api", patientRoutes)
app.use("/api", availabilityRoutes)
app.use("/api", unavailabilityRoutes)
app.use("/api", specialAvailabilityRoutes)
app.use("/api", departmentRoutes)
app.use("/api", slotRoutes)
app.use("/api", appointmentRoutes)
app.use("/api", paymentRoutes)
app.use("/api", earningRoutes)
app.use("/api", reviewRoutes)
app.use("/api", dashboardRoutes)
app.use("/api/notifications", notificationRoutes)
app.use(errorHandler);

export default app;