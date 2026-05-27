import { Router } from "express";
const router = Router();
import {
    getAllPatients,
    getPatientById,
    updatePatient,
    updatePatientPhoto,
    deletePatient,
    getMyPatientProfile,
    updateMyPatientPhoto,
    updateMyPatientProfile
} from "./patientController.js";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { OwnerShip } from "../../middleware/owner.js";
import { upload } from "../../middleware/profile.js";

router.get("/patients", authenticate, authorize("admin"), getAllPatients);
router.get("/patients/me", authenticate, authorize("patient"), getMyPatientProfile);
router.put("/patients/me", authenticate, authorize("patient"), upload.none(), updateMyPatientProfile);
router.put("/patients/me/photo", authenticate, authorize("patient"), upload.single("profile_picture"), updateMyPatientPhoto);
router.get("/patients/:id", authenticate, authorize("patient"), getPatientById);
router.put("/patients/:id", authenticate, authorize("patient"), OwnerShip, updatePatient);
router.put("/patients/:id/photo", authenticate,
    authorize("patient"), OwnerShip, upload.single("profile_picture"), updatePatientPhoto);
router.delete("/patients/:id", authenticate, authorize("admin"), deletePatient);

export default router;