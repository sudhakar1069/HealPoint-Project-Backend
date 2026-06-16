import express from "express";
import { createOrder, getPaymentByAppointment, verifyPayment, } from "./paymentController.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = express.Router();
router.post("/payments/create-order", authenticate, createOrder);
router.post("/payments/verify", verifyPayment);
router.get("/payments/appointment/:appointmentId", authenticate, getPaymentByAppointment);


export default router;