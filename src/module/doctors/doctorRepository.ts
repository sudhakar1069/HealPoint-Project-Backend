import { Op } from "sequelize";
import Doctor from "../../models/doctorModel.js";
import { User } from "../../models/userModel.js";
import type { DoctorCreationAttributes } from "../../models/doctorModel.js"
import type { userCreationAttributes } from "../../models/userModel.js";

export class DoctorRepository {
    async createUser(data: userCreationAttributes, transaction: any) {
        return await User.create(data, { transaction });
    }

    async createDoctor(data: DoctorCreationAttributes, transaction: any) {
        return await Doctor.create(data, { transaction });
    }

    async findUserByEmail(email: string) {
        return await User.findOne({ where: { email } });
    }

    async getAllDoctors(page: number, limit: number, filters: any) {
        const offset = (page - 1) * limit;

        const whereCondition: any = {};
        const userWhere: any = {};
        if (filters.experience_years) {
            switch (filters.experience_years) {
                case "0-5":
                    whereCondition.experience_years = {
                        [Op.between]: [0, 4]
                    };
                    break;
                case "5-10":
                    whereCondition.experience_years = {
                        [Op.between]: [5, 9]
                    };
                    break;
                case "10+":
                    whereCondition.experience_years = {
                        [Op.gte]: 10
                    };
                    break;
            }
        }

        if (filters.consultation_fee) {
            whereCondition.consultation_fee = {
                [Op.lte]: Number(filters.consultation_fee)
            };
        }

        if (filters.specialization) {
            whereCondition.specialization = {
                [Op.like]: `%${filters.specialization}%`
            };
        }

        if (filters.gender) {
            userWhere.gender = filters.gender;
        }

        if (filters.search?.trim()) {
            const searchTerm = `%${filters.search.trim()}%`;
            userWhere.name = { [Op.like]: searchTerm };

        }
        return await Doctor.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: User,
                    as: "user",
                    where: userWhere,
                    attributes: [
                        "id",
                        "name",
                        "email",
                        "gender",
                        "profile_picture"
                    ]
                }
            ],
            limit,
            offset,
            order: [["created_at", "DESC"]]
        });
    }

    async getDoctorById(id: number) {
        return await Doctor.findByPk(id, {
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

    async getDoctorByUserId(userId: number) {
        return await Doctor.findOne({
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

    async updateUser(userId: number, data: Partial<userCreationAttributes>, transaction: any = null) {
        return await User.update(data,
            {
                where: { id: userId }, transaction
            }
        );
    }

    async updateDoctor(doctorId: number, data: Partial<DoctorCreationAttributes>, transaction: any) {
        return await Doctor.update(data,
            { where: { id: doctorId }, transaction }
        );
    }

    async deleteDoctor(doctorId: number, transaction: any) {
        return await Doctor.destroy({
            where: { id: doctorId }, transaction
        });
    }
    async deleteUser(userId: number, transaction: any) {
        return await User.destroy({
            where: { id: userId }, transaction
        });
    }
}