import DoctorAvailability,
{ type DoctorAvailabilityAttributes, type DoctorAvailabilityCreationAttributes } from "../../models/availabilityModel.js";

export class DoctorAvailabilityRepository {
    async createAvailability(data: DoctorAvailabilityCreationAttributes) {
        return await DoctorAvailability.create(data);
    }

    async getDoctorAvailability(doctorId: number) {
        return await DoctorAvailability.findAll({
            where: { doctor_id: doctorId },
            order: [["created_at", "ASC"]]
        });
    }

    async getAvailabilityById(id: number) {
        return await DoctorAvailability.findByPk(id);
    }

    async getAvailabilityByDoctorAndDay(doctorId: number, dayOfWeek: string) {
        return await DoctorAvailability.findAll({
            where: {
                doctor_id: doctorId,
                day_of_week: dayOfWeek
            }
        });
    }

    async updateAvailability(id: number, data: Partial<DoctorAvailabilityAttributes>) {
        await DoctorAvailability.update(data,
            { where: { id } }
        );
        return await DoctorAvailability.findByPk(id);
    }

    async deleteAvailability(id: number) {
        return await DoctorAvailability.destroy({
            where: { id }
        });
    }
    
    async deleteAvailabilityByDoctorAndDay(doctorId: number, dayOfWeek: string) {
        return await DoctorAvailability.destroy({
            where: {
                doctor_id: doctorId,
                day_of_week: dayOfWeek
            }
        });
    }
}