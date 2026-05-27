import DoctorUnavailability from "../../models/unavailabilityModel.js";

export class DoctorUnavailabilityRepository {

    async createUnavailability(data: any) {
        return await DoctorUnavailability.create(data);
    }
    async getDoctorUnavailabilities(doctorId: number) {
        return await DoctorUnavailability.findAll({
            where: {
                doctor_id: doctorId
            },
            order: [
                ["unavailable_date", "ASC"],
                ["start_time", "ASC"]
            ]
        });
    }

    async getDoctorUnavailabilityById(id: number) {
        return await DoctorUnavailability.findByPk(id);
    }

    async getDoctorUnavailabilityByDate(doctorId: number, date: string) {
        return await DoctorUnavailability.findAll({
            where: {
                doctor_id: doctorId,
                unavailable_date: date
            }
        });
    }

    async updateUnavailability(id: number, data: any) {
        await DoctorUnavailability.update(data,
            { where: { id } }
        );
        return await DoctorUnavailability.findByPk(id);
    }

    async deleteUnavailability(id: number) {
        return await DoctorUnavailability.destroy({ where: { id } });
    }
}