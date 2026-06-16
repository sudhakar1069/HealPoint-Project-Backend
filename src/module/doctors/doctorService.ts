import bcrypt from "bcrypt";
import { sequelize } from "../../config/db.js";
import { DoctorRepository } from "./doctorRepository.js";
import type { CreateDoctorDTO } from "../../types/doctorDto.js";
import type { userAttributes } from "../../models/userModel.js";
import type { DoctorAttributes } from "../../models/doctorModel.js";
import { NotificationService } from "../notifications/notificationService.js";

export class DoctorService {

    constructor(
        private doctorRepository: DoctorRepository,
        private notificationService: NotificationService,

    ) { }

    async createDoctor(data: CreateDoctorDTO, profile_picture?: string) {
        if (!data.password) {
            throw new Error("Password is required");
        }
        const transaction = await sequelize.transaction();

        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const user = await this.doctorRepository.createUser(
                {
                    name: data.name,
                    phone_number: data.phone_number,
                    email: data.email,
                    gender: data.gender,
                    password: hashedPassword,
                    role: "doctor",
                    profile_picture: profile_picture || null,
                },
                transaction
            );

            const doctor = await this.doctorRepository.createDoctor(
                {
                    user_id: user.id,
                    specialization: data.specialization,
                    experience_years: data.experience_years,
                    education: data.education,
                    consultation_fee: data.consultation_fee,
                    bio: data.bio,
                    is_first_login: true,
                    password_changed_at: new Date(),
                },
                transaction
            );

            await transaction.commit();
            await this.notificationService.addDoctorNotification(
                user.name,
                doctor.specialization
            );
            const userData = user.toJSON();
            const { password, refresh_token, ...safeUser } = userData;

            return { user: safeUser, doctor };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getAllDoctors(page = 1, limit = 10, filters: any = {}) {
        if (filters.consultation_fee) {
            filters.consultation_fee = Number(filters.consultation_fee);
        }

        const result = await this.doctorRepository.getAllDoctors(page, limit, filters);

        return {
            total: result.count,
            currentPage: page,
            totalPages: Math.ceil(result.count / limit),
            doctors: result.rows.map((doctor) => doctor.toJSON()),
        };
    }

    async getDoctorById(id: number) {
        const doctor = await this.doctorRepository.getDoctorById(id);
        if (!doctor) {
            throw new Error("Doctor not found");
        }

        return doctor;
    }

    async getMyDoctorProfile(userId: number) {
        const doctor = await this.doctorRepository.getDoctorByUserId(userId);

        if (!doctor) {
            throw new Error("Doctor profile not found");
        }

        return doctor;
    }

    async updateDoctor(id: number, data: Partial<CreateDoctorDTO>) {
        const transaction = await sequelize.transaction();

        try {
            const existingDoctor = await this.doctorRepository.getDoctorById(id);

            if (!existingDoctor) {
                throw new Error("Doctor not found");
            }

            const userUpdateData: Partial<userAttributes> = {};

            if (data.name !== undefined) userUpdateData.name = data.name;
            if (data.phone_number !== undefined) userUpdateData.phone_number = data.phone_number;
            if (data.email !== undefined) userUpdateData.email = data.email;
            if (data.gender !== undefined) userUpdateData.gender = data.gender;

            if (Object.keys(userUpdateData).length > 0) {
                await this.doctorRepository.updateUser(
                    existingDoctor.user_id,
                    userUpdateData,
                    transaction
                );
            }

            if (data.password) {
                const hashedPassword = await bcrypt.hash(data.password, 10);

                await this.doctorRepository.updateUser(
                    existingDoctor.user_id,
                    { password: hashedPassword },
                    transaction
                );

                await this.doctorRepository.updateDoctor(
                    id,
                    {
                        password_changed_at: new Date(),
                        is_first_login: false,
                    },
                    transaction
                );
            }

            const doctorUpdateData: Partial<DoctorAttributes> = {};

            if (data.specialization !== undefined) doctorUpdateData.specialization = data.specialization;
            if (data.education !== undefined) doctorUpdateData.education = data.education;
            if (data.experience_years !== undefined) doctorUpdateData.experience_years = data.experience_years;
            if (data.consultation_fee !== undefined) doctorUpdateData.consultation_fee = data.consultation_fee;
            if (data.bio !== undefined) doctorUpdateData.bio = data.bio;

            if (Object.keys(doctorUpdateData).length > 0) {
                await this.doctorRepository.updateDoctor(id,
                    doctorUpdateData, transaction);
            }

            await transaction.commit();

            const updatedDoctor = await this.doctorRepository.getDoctorById(id);

            return { doctor: updatedDoctor };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateDoctorPhoto(
        doctorId: number,
        loggedInUserId: number,
        loggedInUserRole: string,
        imageUrl: string
    ) {
        const doctor = await this.doctorRepository.getDoctorById(doctorId);

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        if (loggedInUserRole !== "admin" && doctor.user_id !== loggedInUserId) {
            throw new Error("You can update only your own profile");
        }

        await this.doctorRepository.updateUser(
            doctor.user_id,
            { profile_picture: imageUrl },
            null
        );

        return { profile_picture: imageUrl };
    }

    async deleteDoctor(id: number) {
        const transaction = await sequelize.transaction();

        try {
            const doctor = await this.doctorRepository.getDoctorById(id);

            if (!doctor) {
                throw new Error("Doctor not found");
            }

            await this.doctorRepository.deleteDoctor(id, transaction);
            await this.doctorRepository.deleteUser(doctor.user_id, transaction);

            await transaction.commit();
            return {
                message: "Doctor profile deleted successfully",
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}