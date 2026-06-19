import { Op } from "sequelize";
import Specialization from "../../models/specializationModel.js";
import Doctor from "../../models/doctorModel.js";
import type { CreateSpecializationDTO, UpdateSpecializationDTO } from "../../types/specializationDto.js";
export class SpecializationRepository {
    async create(data: CreateSpecializationDTO) {
        return await Specialization.create(data);
    }

    async findAll(page: number, limit: number, search: string) {
        const offset = (page - 1) * limit;
        const whereCondition: any = {};
        if (search) {
            whereCondition.name = { [Op.like]: `%${search}%`};
        }
        const result = await Specialization.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [["id", "DESC"]],
        });

        const updatedRows: any[] = [];
        for (const specialization of result.rows) {
            const doctorCount = await Doctor.count({
                where: {
                    specialization: specialization.name,
                },
            });

            updatedRows.push({
                ...specialization.toJSON(),
                doctor_count: doctorCount,
            });
        }

        return {
            total: result.count,
            currentPage: page,
            totalPages: Math.ceil(result.count / limit),
            specializations: updatedRows,
        };
    }

    async findById(id: number) {
        const specialization = await Specialization.findByPk(id);
        if (!specialization) {
            return null;
        }
        const doctorCount = await Doctor.count({
            where: {
                specialization: specialization.name,
            },
        });

        return {
            ...specialization.toJSON(),
            doctor_count: doctorCount,
        };
    }

    async findByName(name: string) {
        return await Specialization.findOne({
            where: { name },
        });
    }

    async update(id: number, data: UpdateSpecializationDTO) {
        await Specialization.update(data, {
            where: { id },
        });
        return await this.findById(id);
    }

    async delete(id: number) {
        return await Specialization.destroy({
            where: { id },
        });
    }
}