import express from "express";
import { getDoctorSlots } from "./slotController.js";
const router = express.Router();

router.get("/slots/:doctorId", getDoctorSlots);

export default router;