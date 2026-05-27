import Patient, { type PatientCreationAttributes } from "../../models/patientModel.js";
import Doctor from "../../models/doctorModel.js";
import { User, type userCreationAttributes } from "../../models/userModel.js";

export class UserRepository {
    async create(user: userCreationAttributes) {
        return await User.create(user);
    }

    async createPatient(data: PatientCreationAttributes) {
        return await Patient.create(data);
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
}