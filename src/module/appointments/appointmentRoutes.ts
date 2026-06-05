import express from "express";

import {
    bookAppointment,
    getAppointmentById,
    getAllAppointments,
    getDoctorAppointments,
    getPatientAppointments,
    joinConsultation,
    startConsultation,
    completeConsultation
} from "./appointmentController.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
const router = express.Router();
router.post("/appointments/book", authenticate, bookAppointment);
router.get("/appointments", authenticate, getAllAppointments);
router.get("/:id/join", authenticate, joinConsultation);
router.patch("/appointments/:id/start", authenticate, authorize("doctor"), startConsultation);
router.patch("/appointments/:id/complete", authenticate, authorize("doctor"), completeConsultation);
router.get("/doctor/my-appointments", authenticate, authorize("doctor"), getDoctorAppointments);
router.get("/patient/my-appointments", authenticate, authorize("patient"), getPatientAppointments);
router.get("/appointments/:id", authenticate, getAppointmentById);

export default router;







