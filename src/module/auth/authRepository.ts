import Patient, { type PatientCreationAttributes } from "../../models/patientModel.js";
import Doctor from "../../models/doctorModel.js";
import { User, type userCreationAttributes } from "../../models/userModel.js";
import { Op, Transaction } from "sequelize";

export class UserRepository {
    async create(user: userCreationAttributes, transaction?: Transaction) {
        return await User.create(
            user, transaction ? { transaction } : {}
        );
    }

    async createPatient(data: PatientCreationAttributes, transaction?: Transaction) {
        return await Patient.create(
            data, transaction ? { transaction } : {}
        );
    }

    async findByEmail(email: string) {
        return await User.findOne({
            where: { email },
        });
    }

    async findById(id: number) {
        return await User.findByPk(id);
    }

    async findByRefreshToken(refreshToken: string) {
        return await User.findOne({
            where: {
                refresh_token: refreshToken,
            },
        });
    }

    async updateAdminProfile(
        userId: number,
        data: Partial<{
            name: string;
            phone_number: string;
            gender: "Male" | "Female" | "Others";
            profile_picture: string;
            password: string;
            refresh_token: string | null;
        }>
    ) {
        return await User.update(data, {
            where: { id: userId }
        });
    }

    async updatePatientStatus(userId: number, status: boolean) {
        return await Patient.update(
            { is_active: status },
            {
                where: { user_id: userId }
            }
        );
    }
    async findDoctorByUserId(userId: number) {
        return await Doctor.findOne({
            where: { user_id: userId }
        });
    }

    async findPatientByUserId(userId: number) {
        return await Patient.findOne({
            where: { user_id: userId }
        });
    }

    async saveResetOtp(userId: number, otp: string, expires: Date) {
        return await User.update(
            {
                reset_password_otp: otp,
                reset_password_expires: expires,
                otp_verified: false
            },
            { where: { id: userId } }
        );
    }

    async findByEmailAndOtp(email: string, otp: string) {
        return await User.findOne({
            where: {
                email,
                reset_password_otp: otp,
                reset_password_expires: {
                    [Op.gt]: new Date()
                }
            }
        });
    }
}