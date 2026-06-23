import { Router } from "express";
import { validate } from "../../middleware/validator.js";
import { registerSchema } from "../../schema/authSchema.js";
import { updateAdminProfileSchema } from "../../schema/updateAdminProfileShema.js";
import {
    register, login, refreshToken, logout,
    forgotPassword, resetPassword, verifyResetOtp, updateAdminProfile
} from "./authController.js";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { loginSchema } from "../../schema/loginSchema.js";
import { loginLimiter } from "../../middleware/rateLimiter.js";
const router = Router();

router.post("/register", validate(registerSchema), register)
router.post("/login", loginLimiter, validate(loginSchema), login)
router.post("/refresh", refreshToken)
router.post("/logout", logout)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.put("/update-admin-profile", authenticate, authorize("admin"), validate(updateAdminProfileSchema), updateAdminProfile);
export default router;