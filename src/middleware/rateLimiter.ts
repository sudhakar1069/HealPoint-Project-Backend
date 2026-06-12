import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 250, 
  message: {
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export const loginLimiter = rateLimit({
  windowMs: 0.5* 60 * 1000, 
  max: 5, 
  message: {
    message: "too many login attempts please try again after 30 seconds",
  },
  standardHeaders: true,
  legacyHeaders: false,
});