
import { UserRepository } from "./authRepository.js";
import { AuthService } from "./authService.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import type { Request, Response } from "express";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export const register = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);
    const { password, refresh_token, ...safeUser } = user.toJSON();
    res.status(201).json({
        success: true,
        data: safeUser,
    });
});


export const login = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const result = await authService.login(
            email,
            password,
            req
        );

        // res.cookie("accessToken", result.accessToken, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none",
        //     maxAge: 15 * 60 * 1000
        // });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken: result.accessToken,
            user: result.user,
        });
    }
);

export const refreshToken = asyncHandler(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "User already logged out",
            });
        }
        const result = await authService.refreshAccessToken(refreshToken);
        return res.status(200).json({
            success: true,
            accessToken: result.accessToken,
        });
    }
);

export const logout = asyncHandler(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const result = await authService.logout(refreshToken);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });
        return res.status(200).json(result);
    }
);

export const forgotPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        return res.status(200).json(result);
    }
);

export const resetPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, password, confirm_password } = req.body;
        const result = await authService.resetPassword(
            email,
            password,
            confirm_password
        );
        return res.status(200).json(result);
    }
);

export const verifyResetOtp = asyncHandler(
    async (req: Request, res: Response) => {
        const { email, otp } = req.body;
        const result = await authService.verifyResetOtp(email, otp);
        return res.status(200).json(result);
    }
);
