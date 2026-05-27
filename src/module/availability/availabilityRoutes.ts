import { Router } from "express";
import {
    createAvailability,
    getDoctorAvailability,
    getAvailabilityById,
    updateAvailability,
    deleteAvailability
} from "./availabilityController.js";
import { authenticate } from "../../middleware/authenticate.js";
import { availabilityOwnership } from "../../middleware/availabilityOwnership.js";
const router = Router();

router.post("/availability", authenticate, createAvailability);
router.get("/doctors/:doctorId/availability", getDoctorAvailability);
router.get("/availability/:id", authenticate, getAvailabilityById);
router.put("/availability/:id", authenticate, availabilityOwnership, updateAvailability);
router.delete("/availability/:id", authenticate, availabilityOwnership, deleteAvailability);


export default router;