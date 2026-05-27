import bcrypt from "bcrypt";
import { sequelize } from "../../config/db.js";
import { DoctorRepository } from "./doctorRepository.js";
import type { CreateDoctorDTO } from "../../utils/doctorDto.js";

export class DoctorService {
    baseURL = "http://localhost:5000";
    constructor(private doctorRepository: DoctorRepository) { }
    async createDoctor(
        data: CreateDoctorDTO,
        profile_picture?: string
    ) {
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
                    profile_picture: profile_picture || null
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
                    available_from: data.available_from,
                    available_to: data.available_to,
                    is_first_login: true,
                    password_changed_at: new Date()
                },
                transaction
            );
            await transaction.commit();
            const userData = user.toJSON();
            const { password, refresh_token, ...safeUser } = userData;
            return {
                user: safeUser,
                doctor
            };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getAllDoctors(
        page: number = 1,
        limit: number = 10,
        filters: any = {}
    ) {
        if (filters.consultation_fee) {
            filters.consultation_fee = Number(filters.consultation_fee);
        }
        const result = await this.doctorRepository.getAllDoctors(
            page,
            limit,
            filters
        );
        const doctors = result.rows.map((doctor) => {
            const doctorData = doctor.toJSON();
            return doctorData;
        });

        return {
            total: result.count,
            currentPage: page,
            totalPages: Math.ceil(result.count / limit),
            doctors,
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
            if (
                data.name ||
                data.phone_number ||
                data.email ||
                data.gender
            ) {
                await this.doctorRepository.updateUser(
                    existingDoctor.user_id,
                    {
                        name: data.name,
                        phone_number: data.phone_number,
                        email: data.email,
                        gender: data.gender,
                    },
                    transaction
                );
            }
            if (data.password) {
                const hashedPassword = await bcrypt.hash(data.password, 10);
                await this.doctorRepository.updateUser(
                    existingDoctor.user_id,
                    {
                        password: hashedPassword,
                    },
                    transaction
                );
                await this.doctorRepository.updateDoctor(id,
                    {
                        password_changed_at: new Date(),
                        is_first_login: false,
                    },
                    transaction
                );
            }
            await this.doctorRepository.updateDoctor(
                id,
                {
                    specialization: data.specialization,
                    education: data.education,
                    experience_years: data.experience_years,
                    consultation_fee: data.consultation_fee,
                    bio: data.bio,
                    available_from: data.available_from,
                    available_to: data.available_to,
                },
                transaction
            );
            await transaction.commit();
            const updateDoctor = await this.doctorRepository.getDoctorById(id)
            return { doctor: updateDoctor };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateDoctorPhoto(
        doctorId: number,
        loggedInUserId: number,
        loggedInUserRole: string,
        filename: string
    ) {
        const doctor = await this.doctorRepository.getDoctorById(doctorId);
        if (!doctor) {
            throw new Error("Doctor not found");
        }
        if (
            loggedInUserRole !== "admin" &&
            doctor.user_id !== loggedInUserId
        ) {
            throw new Error(
                "You can update only your own profile"
            );
        }
        await this.doctorRepository.updateUser(doctor.user_id, { profile_picture: filename, }, null);
        return {
            profile_picture: filename,
        };
    }

    async deleteDoctor(id: number) {
        const transaction = await sequelize.transaction();
        try {
            const doctor = await this.doctorRepository.getDoctorById(id);
            if (!doctor) {
                throw new Error("Doctor not found");
            }
            await this.doctorRepository.deleteDoctor(id, transaction);
            await this.doctorRepository.deleteUser(
                doctor.user_id,
                transaction
            );
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