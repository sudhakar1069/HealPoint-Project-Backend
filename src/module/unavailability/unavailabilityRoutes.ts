import { Router } from "express";
import {
    createUnavailability,
    getDoctorUnavailabilities,
    getDoctorUnavailabilityById,
    updateUnavailability,
    deleteUnavailability
} from "./unavailabilityController.js";
import { authenticate } from "../../middleware/authenticate.js";
import { unavailabilityOwnership } from "../../middleware/unavailabilityOwnership.js";
const router = Router();
router.post("/unavailability", authenticate, createUnavailability);
router.get("/doctors/:doctorId/unavailability", getDoctorUnavailabilities);
router.get("/unavailability/:id", authenticate, getDoctorUnavailabilityById);
router.put("/unavailability/:id", authenticate, unavailabilityOwnership, updateUnavailability);
router.delete("/unavailability/:id", authenticate, unavailabilityOwnership, deleteUnavailability);

export default router;