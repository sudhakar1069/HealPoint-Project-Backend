import { Router } from "express";
import { validate } from "../../middleware/validator.js";
import { registerSchema } from "../../schema/authSchema.js";
import {
    register, login, refreshToken, logout,
    forgotPassword, resetPassword, verifyResetOtp
} from "./authController.js";
import { loginSchema } from "../../schema/loginSchema.js";
import { authenticate } from "../../middleware/authenticate.js";
import { loginLimiter } from "../../middleware/rateLimiter.js";
const router = Router();

router.post("/register", validate(registerSchema), register)
router.post("/login", loginLimiter, validate(loginSchema), login)
router.post("/refresh", refreshToken)
router.post("/logout", authenticate, logout)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-otp", verifyResetOtp);
export default router;