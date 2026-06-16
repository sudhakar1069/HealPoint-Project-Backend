
import DoctorUnavailability, { type DoctorUnavailabilityCreationAttributes }
    from "../../models/unavailabilityModel.js";

export class DoctorUnavailabilityRepository {

    async createUnavailability(data: DoctorUnavailabilityCreationAttributes) {
        return await DoctorUnavailability.create(data);
    }
    async getDoctorUnavailabilities(doctorId: number) {
        return await DoctorUnavailability.findAll({
            where: { doctor_id: doctorId },
            order: [
                ["unavailable_date", "ASC"]
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

    async updateUnavailability(id: number, data: Partial<DoctorUnavailabilityCreationAttributes>) {
        await DoctorUnavailability.update(data,
            { where: { id } }
        );
        return await DoctorUnavailability.findByPk(id);
    }

    async deleteUnavailability(id: number) {
        return await DoctorUnavailability.destroy({ where: { id } });
    }
}