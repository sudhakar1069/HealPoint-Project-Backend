import bcrypt from "bcrypt";
import type { Request } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { RegisterDTO } from "../../types/registerDto.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokens.js";
import { EmailService } from "../../utils/emailService.js";

export class AuthService {
    constructor(private userRepository: any) { }
    private emailService = new EmailService();

    async register(data: RegisterDTO) {
        const { name, phone_number, gender, email, password, confirm_password } = data;

        const existing = await this.userRepository.findByEmail(email);
        if (existing) throw { status: 400, message: "Email already exists" };

        if (password !== confirm_password)
            throw { status: 400, message: "Password and confirm password must be same" };

        const hashed = await bcrypt.hash(password, 10);

        const user = await this.userRepository.create({
            name,
            phone_number,
            gender,
            email,
            password: hashed,
            role: "patient"
        });

        await this.userRepository.createPatient({
            user_id: user.id,
            dob: null,
            age: null,
            blood_group: null,
            address: null
        });

        // try {
        //     await this.emailService.sendWelcomeEmail(user.email, user.name);
        // } catch (error) {
        //     console.error("Welcome email failed:", error);
        // }
        return user;
    }

    async login(email: string, password: string, req: Request) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw { status: 404, message: "Invalid credentials" };

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw { status: 401, message: "Invalid password" };

        let profileId = null;

        if (user.role === "doctor") {
            const doctor = await this.userRepository.findDoctorByUserId(user.id);
            profileId = doctor?.id;
        }

        if (user.role === "patient") {
            const patient = await this.userRepository.findPatientByUserId(user.id);
            profileId = patient?.id;
        }

        await this.userRepository.updatePatientStatus(user.id, true);

        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            profile_id: profileId
        });

        const refreshToken = generateRefreshToken({
            id: user.id,
            role: user.role,
            profile_id: profileId
        });

        await user.update({ refresh_token: refreshToken });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                email: user.email,
                profile_picture: user.profile_picture
            }
        };
    }

    async refreshAccessToken(refreshToken: string) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;

            const user = await this.userRepository.findByRefreshToken(refreshToken);
            if (!user) throw { status: 401, message: "Invalid refresh token" };

            const accessToken = generateAccessToken({
                id: decoded.id,
                role: user.role,
                profile_id: user.profile_id
            });

            return { success: true, accessToken };
        } catch {
            throw { status: 401, message: "Invalid or expired refresh token" };
        }
    }

    async logout(refreshToken: string) {
        if (!refreshToken) throw { status: 401, message: "Refresh token missing" };

        let decoded: JwtPayload;

        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;
        } catch {
            throw { status: 401, message: "Invalid or expired refresh token" };
        }

        const user = await this.userRepository.findById(decoded.id);
        if (!user) throw { status: 404, message: "User not found" };

        if (!user.refresh_token || user.refresh_token !== refreshToken)
            return { success: true, message: "Logged out successfully" };

        await this.userRepository.updatePatientStatus(user.id, false);
        await user.update({ refresh_token: null });

        return { success: true, message: "Logged out successfully" };
    }

    async forgotPassword(email: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return {
                success: true,
                message: "If an account exists, an OTP has been sent"
            };
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const expires = new Date(Date.now() + 15 * 60 * 1000);
        await this.userRepository.saveResetOtp(user.id, otp, expires);

        try {
            await this.emailService.sendPasswordResetOtp(user.email, otp);
        } catch (error) {
            console.error("Email failed:", error);
        }

        return {
            success: true,
            message: "If an account exists, an OTP has been sent"
        };
    }

    async verifyResetOtp(email: string, otp: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw {
                status: 400,
                message: "Invalid or expired OTP"
            };
        }
        if (
            user.reset_password_otp !== otp ||
            !user.reset_password_expires ||
            user.reset_password_expires < new Date()
        ) {
            throw {
                status: 400,
                message: "Invalid or expired OTP"
            };
        }
        await user.update({ otp_verified: true });
        return {
            success: true,
            message: "OTP verified"
        };
    }

    async resetPassword(email: string, password: string, confirmPassword: string) {
        if (password !== confirmPassword) {
            throw {
                status: 400,
                message: "Password and confirm password must be same"
            };
        }
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw {
                status: 404,
                message: "User not found"
            };
        }
        if (!user.otp_verified) {
            throw {
                status: 400,
                message: "OTP verification required"
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({
            password: hashedPassword,
            reset_password_otp: null,
            reset_password_expires: null,
            otp_verified: false,
            refresh_token: null
        });
        return {
            success: true,
            message: "Password reset successfully"
        };
    }
}