import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";

import {
    getEarningsSummary,
    getPaymentHistory,
    getMonthlyEarnings
} from "./earningController.js";

const router = Router();

router.get("/doctor/earnings/summary", authenticate, getEarningsSummary);
router.get("/doctor/earnings/payments", authenticate, getPaymentHistory);
router.get("/doctor/earnings/monthly", authenticate, getMonthlyEarnings);

export default router;