import { Router } from "express";
import {
    createSpecialAvailability,
    getDoctorSpecialAvailabilities,
    getSpecialAvailabilityById,
    updateSpecialAvailability,
    deleteSpecialAvailability
} from "./specialAvailabilityController.js";
import { authenticate } from "../../middleware/authenticate.js";
const router = Router();

router.post("/special-availability", authenticate, createSpecialAvailability);
router.get("/:doctorId/special-availability", authenticate, getDoctorSpecialAvailabilities);
router.get("/special-availability/:id", authenticate, getSpecialAvailabilityById);
router.put("/special-availability/:id", authenticate, updateSpecialAvailability);
router.delete("/special-availability/:id", authenticate, deleteSpecialAvailability);

export default router;