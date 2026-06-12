import express from "express";

import { addReview, getDoctorReviews } from "./reviewController.js";
import { authenticate } from "../../middleware/authenticate.js";
const router = express.Router();

router.post("/reviews/add", authenticate, addReview);
router.get("/reviews/:doctorId", getDoctorReviews);

export default router;