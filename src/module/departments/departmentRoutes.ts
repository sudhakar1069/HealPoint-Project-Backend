import Router from "express";
const router = Router();

import {
    createSpecialization,
    deleteSpecialization,
    getAllSpecializations,
    getSpecializationById,
    updateSpecialization,
} from "./departmentController.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";


router.post("/departments", authenticate, authorize("admin"), createSpecialization);
router.get("/departments", authenticate, authorize("admin", "doctor", "patient"), getAllSpecializations);
router.get("/departments/:id", authenticate, authorize("admin"), getSpecializationById);
router.put("/departments/:id", authenticate, authorize("admin"), updateSpecialization);
router.delete("/departments/:id", authenticate, authorize("admin"), deleteSpecialization);

export default router;