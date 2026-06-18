import Patient, { type PatientCreationAttributes } from "../../models/patientModel.js";
import User, { type userCreationAttributes } from "../../models/userModel.js";
import { Op, Transaction } from "sequelize";

export class PatientRepository {
    async getAllPatients(page: number, limit: number, filters: any) {
        const offset = (page - 1) * limit;
        const whereCondition: any = {};

        if (filters.blood_group) {
            whereCondition.blood_group = filters.blood_group;
        }

        if (filters.is_active !== undefined) {
            whereCondition.is_active = filters.is_active;
        }

        if (filters.gender) {
            whereCondition["$user.gender$"] = filters.gender;
        }

        if (filters.search) {
            whereCondition[Op.or] = [
                {
                    "$user.name$": {
                        [Op.like]: `%${filters.search}%`
                    }
                },
                {
                    "$user.email$": {
                        [Op.like]: `%${filters.search}%`
                    }
                }
            ];
        }

        return await Patient.findAndCountAll({
            distinct: true,
            where: whereCondition,
            include: [
                {
                    model: User,
                    as: "user",
                    required: true,
                    attributes: [
                        "id",
                        "name",
                        "email",
                        "gender",
                        "phone_number",
                        "profile_picture"
                    ]
                }
            ],
            limit,
            offset
        });
    }

    async getPatientById(id: number) {
        return await Patient.findByPk(id, {
            include: {
                model: User,
                as: "user",
                attributes: {
                    exclude: [
                        "password",
                        "refresh_token",
                        "createdAt",
                        "updatedAt"
                    ]
                }
            }
        });
    }
    async getPatientByUserId(userId: number) {
        return await Patient.findOne({
            where: { user_id: userId },
            include: {
                model: User,
                as: "user",
                attributes: {
                    exclude: [
                        "password",
                        "created_at",
                        "updated_at",
                        "refresh_token"
                    ]
                }
            }
        });
    }

    async updateUser(userId: number, data: Partial<userCreationAttributes>, transaction: Transaction | null = null) {
        return await User.update(data, {
            where: { id: userId },
            transaction
        });
    }

    async updatePatient(patientId: number, data: Partial<PatientCreationAttributes>, transaction: Transaction) {
        return await Patient.update(data, {
            where: { id: patientId },
            transaction
        });
    }

    async deletePatient(id: number, transaction: Transaction) {
        return await Patient.destroy({
            where: { id },
            transaction
        });
    }

    async deleteUser(userId: number, transaction: Transaction) {
        return await User.destroy({
            where: { id: userId },
            transaction
        });
    }

}