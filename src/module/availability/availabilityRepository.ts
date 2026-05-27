import DoctorAvailability from "../../models/availabilityModel.js";

export class DoctorAvailabilityRepository {
    async createAvailability(data: any) {
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

    async getAvailabilityByDoctorAndDay(
        doctorId: number,
        dayOfWeek: string
    ) {
        return await DoctorAvailability.findAll({
            where: {
                doctor_id: doctorId,
                day_of_week: dayOfWeek
            }
        });
    }

    async updateAvailability(id: number, data: any) {
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
}