
import { Router } from "express";
import {
    createDoctorNotification,
    createDepartmentNotification,
    getNotifications,
    markNotificationsRead,
} from "./notificationController.js";
const router = Router();

router.post("/doctor", createDoctorNotification);
router.post("/department", createDepartmentNotification);
router.get("/", getNotifications);
router.patch("/read", markNotificationsRead);

export default router;