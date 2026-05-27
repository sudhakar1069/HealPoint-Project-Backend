import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { RegisterDTO } from "../../utils/registerDto.js";

import { generateFileUrl } from "../../utils/generateFileUrl.js";
import { generateAccessToken, generateRefreshToken, } from "../../utils/tokens.js";

export class AuthService {
    constructor(private userRepository: any) { }
    //register
    async register(data: RegisterDTO) {
        const {
            name,
            phone_number,
            gender,
            email,
            password,
            confirm_password,
        } = data;
        const existing = await this.userRepository.findByEmail(email);
        if (existing) {
            throw {
                status: 400,
                message: "Email already exists",
            };
        }
        if (password !== confirm_password) {
            throw {
                status: 400,
                message: "Password and confirm password must be same",
            };
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create({
            name,
            phone_number,
            gender,
            email,
            password: hashed,
            role: "patient",
        });
        await this.userRepository.createPatient({
            user_id: user.id,
            dob: null,
            age: null,
            blood_group: null,
            address: null,
        });

        return user;
    }
    //login
    async login(email: string, password: string, req: any) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw {
                status: 404,
                message: "Invalid credentials",
            };
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw {
                status: 401,
                message: "Invalid password",
            };
        }
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
                profile_picture: generateFileUrl(
                    req,
                    user.profile_picture
                ),
            },
        };
    }

    // //refresh
    async refreshAccessToken(refreshToken: string) {
        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET!
            ) as JwtPayload;
            const user = await this.userRepository.findByRefreshToken(refreshToken);
            if (!user) {
                throw {
                    status: 401,
                    message: "Invalid refresh token",
                };
            }
            const accessToken = generateAccessToken({
                id: decoded.id,
                role: user.role,
            });

            return {
                success: true,
                accessToken,
            };

        } catch (error) {
            throw {
                status: 401,
                message: "Invalid or expired refresh token",
            };
        }
    }

    async logout(refreshToken: string) {
        if (!refreshToken) {
            throw {
                status: 401,
                message: "Refresh token missing"
            };
        }
        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET!
            ) as JwtPayload;
        } catch (error) {
            throw {
                status: 401,
                message: "Invalid or expired refresh token"
            };
        }
        const user = await this.userRepository.findById(decoded.id);
        if (!user) {
            throw {
                status: 404,
                message: "User not found"
            };
        }
        if (!user.refresh_token || user.refresh_token !== refreshToken) {
            return {
                success: true,
                message: "Logged out successfully",

            };

        }

        await this.userRepository.updatePatientStatus(
            user.id,
            false
        );
        await user.update({
            refresh_token: null
        });
        return {
            success: true,
            message: "Logged out successfully"
        };
    }
}