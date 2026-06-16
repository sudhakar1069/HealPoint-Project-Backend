import express from "express";
import * as appointmentController from "./appointmentController.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

router.post(
    "/appointments/book",
    authenticate,
    appointmentController.bookAppointment
);

router.get(
    "/appointments",
    authenticate,
    authorize("admin"),
    appointmentController.getAllAppointments
);

router.get(
    "/appointments/:id",
    authenticate,
    appointmentController.getAppointmentById
);

router.get(
    "/appointments/:id/join",
    authenticate,
    appointmentController.joinConsultation
);

router.get(
    "/patient/my-appointments",
    authenticate,
    authorize("patient"),
    appointmentController.getPatientAppointments
);

router.get(
    "/doctor/my-appointments",
    authenticate,
    authorize("doctor"),
    appointmentController.getDoctorAppointments
);

router.patch(
    "/appointments/:id/start",
    authenticate,
    authorize("doctor"),
    appointmentController.startConsultation
);

router.patch(
    "/appointments/:id/complete",
    authenticate,
    authorize("doctor"),
    appointmentController.completeConsultation
);

router.patch(
    "/appointments/:id/cancel",
    authenticate,
    authorize("doctor", "patient"),
    appointmentController.cancelAppointment
);

export default router;