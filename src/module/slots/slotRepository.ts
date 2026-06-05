import DoctorAvailability from "../../models/availabilityModel.js";
import DoctorUnavailability from "../../models/unavailabilityModel.js";
import SpecialAvailability from "../../models/specialAvailabilityModel.js";
import Appointment from "../../models/appointmentModel.js";
import { Op } from "sequelize";

export class SlotRepository {

    async getWeeklyAvailability(doctorId: number, dayOfWeek: string) {
        return await DoctorAvailability.findAll({
            where: {
                doctor_id: doctorId,
                day_of_week: dayOfWeek
            }
        });
    }

    async getSpecialAvailability(doctorId: number, date: string) {
        return await SpecialAvailability.findAll({
            where: {
                doctor_id: doctorId,
                date
            }
        });
    }

    async getUnavailability(doctorId: number, date: string) {
        return await DoctorUnavailability.findAll({
            where: {
                doctor_id: doctorId,
                unavailable_date: date
            }
        });
    }

    async getBookedAppointments(doctorId: number, date: string) {
        return await Appointment.findAll({
            where: {
                doctor_id: doctorId,
                appointment_date: date,
                status: {
                    [Op.in]: [
                        "pending_payment",
                        "confirmed",
                        "completed"
                    ]
                }
            }
        });
    }
}