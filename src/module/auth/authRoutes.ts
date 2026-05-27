import { Router } from "express";
import { validate } from "../../middleware/validator.js";
import { registerSchema } from "../../schema/authSchema.js";
import { register, login, refreshToken, logout } from "./authController.js";
import { loginSchema } from "../../schema/loginSchema.js";
import { authenticate } from "../../middleware/authenticate.js";
const router = Router();

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/refresh", refreshToken)
router.post("/logout", authenticate, logout)
export default router;  