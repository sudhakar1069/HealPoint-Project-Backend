import SpecialAvailability, { type SpecialAvailabilityCreationAttributes } from "../../models/specialAvailabilityModel.js";

export class SpecialAvailabilityRepository {

    async createSpecialAvailability(data: SpecialAvailabilityCreationAttributes) {
        return await SpecialAvailability.create(data);
    }

    async getDoctorSpecialAvailabilities(doctorId: number) {
        return await SpecialAvailability.findAll({
            where: { doctor_id: doctorId },
            order: [
                ["date", "ASC"]
            ]
        });
    }

    async getSpecialAvailabilityById(id: number) {
        return await SpecialAvailability.findByPk(id);
    }

    async getSpecialAvailabilityByDate(doctorId: number, date: string) {
        return await SpecialAvailability.findAll({
            where: { doctor_id: doctorId, date }
        });
    }

    async updateSpecialAvailability(id: number, data: Partial<SpecialAvailabilityCreationAttributes>) {
        await SpecialAvailability.update(data,
            { where: { id } }
        );
        return await SpecialAvailability.findByPk(id);
    }

    async deleteSpecialAvailability(id: number) {
        return await SpecialAvailability.destroy({ where: { id } });
    }
}