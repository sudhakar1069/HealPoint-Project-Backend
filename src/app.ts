import express from "express";
import authRoutes from "./module/auth/authRoutes.js";
import doctorRoutes from "./module/doctors/doctorRoutes.js"
import patientRoutes from "./module/patients/patientRoutes.js"
import departmentRoutes from "./module/departments/departmentRoutes.js"
import availabilityRoutes from "./module/availability/availabilityRoutes.js"
import unavailabilityRoutes from "./module/unavailability/unavailabilityRoutes.js"
import notificationRoutes from "./module/notifications/notificationRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js";
import "./models/associationsModel.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api", doctorRoutes)
app.use("/api", patientRoutes)
app.use("/api", availabilityRoutes)
app.use("/api", unavailabilityRoutes)
app.use("/api", departmentRoutes)
app.use("/api/notifications", notificationRoutes)
app.use(errorHandler);

export default app;