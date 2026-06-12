import { Op, fn, col } from "sequelize";
import Appointment from "../../models/appointmentModel.js";
import Doctor from "../../models/doctorModel.js";
import Patient from "../../models/patientModel.js";
import { User } from "../../models/userModel.js";
import DoctorUnavailability from "../../models/unavailabilityModel.js";

export class DashboardRepository {
    async getTodayAppointments(doctorId: number) {
        const today = new Date().toISOString().split("T")[0];
        const currentTime = new Date().toTimeString().slice(0, 8);

        return await Appointment.findAll({
            where: {
                doctor_id: doctorId,
                appointment_date: today,
                status: "confirmed",
                end_time: { [Op.gt]: currentTime }
            },
            include: [
                {
                    model: Patient,
                    as: "patient",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["name"]
                        }
                    ]
                }
            ],
            order: [["start_time", "ASC"]]
        });
    }

    async getTotalAppointmentCount(doctorId: number) {
        return await Appointment.count({
            where: {
                doctor_id: doctorId,
                status: {
                    [Op.ne]: "cancelled"
                }
            }
        });
    }

    async getTotalPatientsCount(doctorId: number) {
        return await Appointment.count({
            distinct: true,
            col: "patient_id",
            where: {
                doctor_id: doctorId
            }
        });
    }

    async getWeeklyLoad(doctorId: number) {
        const today = new Date();

        const startOfWeek = new Date(today);
        startOfWeek.setDate(
            today.getDate() - today.getDay()
        );
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(
            startOfWeek.getDate() + 6
        );
        endOfWeek.setHours(
            23,
            59,
            59,
            999
        );

        return await Appointment.findAll({
            attributes: [
                [
                    fn(
                        "DAYNAME",
                        col("appointment_date")
                    ),
                    "day"
                ],
                [
                    fn(
                        "COUNT",
                        col("id")
                    ),
                    "appointments"
                ]
            ],
            where: {
                doctor_id: doctorId,
                status: {
                    [Op.in]: [
                        "completed",
                        "confirmed"
                    ]
                },
                appointment_date: {
                    [Op.between]: [
                        startOfWeek,
                        endOfWeek
                    ]
                }
            },
            group: [
                fn("DAYNAME", col("appointment_date"))
            ],
            raw: true
        });
    }

    async getMonthlyOverview(doctorId: number, year: number) {
        return await Appointment.findAll({
            attributes: [
                [fn("MONTH", col("appointment_date")), "month"],
                [fn("COUNT", col("id")), "appointments"],
                [fn("COUNT", fn("DISTINCT", col("patient_id"))), "patients"]
            ],
            where: {
                doctor_id: doctorId,
                appointment_date: {
                    [Op.between]: [
                        new Date(year, 0, 1),
                        new Date(year, 11, 31)
                    ]
                }
            },
            group: [fn("MONTH", col("appointment_date"))],
            order: [[fn("MONTH", col("appointment_date")), "ASC"]],
            raw: true
        });
    }

    async getDashboardOverview() {
        const today = new Date().toISOString().split("T")[0];
        const totalAppointments = await Appointment.count();
        const todayAppointments = await Appointment.count({
            where: {
                appointment_date: today
            }
        });

        const upcomingAppointments = await Appointment.count({
            where: {
                status: "confirmed",
                consultation_status: "scheduled"
            }
        });

        const completedAppointments = await Appointment.count({
            where: {
                consultation_status: "completed"
            }
        });

        return {
            totalAppointments,
            todayAppointments,
            upcomingAppointments,
            completedAppointments
        };
    }

    async getDoctorAppointmentSummary(page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;
        const { count, rows: doctors } = await Doctor.findAndCountAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "name",
                        "profile_picture"
                    ]
                }
            ],
            limit,
            offset
        });

        const result = [];

        for (const doctor of doctors as any[]) {
            const total = await Appointment.count({
                where: { doctor_id: doctor.id }
            });

            const missed = await Appointment.count({
                where: {
                    doctor_id: doctor.id,
                    consultation_status: "missed"
                }
            });

            const completed = await Appointment.count({
                where: {
                    doctor_id: doctor.id,
                    consultation_status: "completed"
                }
            });

            const cancelled = await Appointment.count({
                where: {
                    doctor_id: doctor.id,
                    consultation_status: "cancelled"
                }
            });

            result.push({
                doctor_id: doctor.id,
                doctor_name: doctor.user?.name,
                profile_picture: doctor.user?.profile_picture,
                specialization: doctor.specialization,
                total,
                completed,
                cancelled,
                missed
            });
        }

        return {
            count,
            rows: result
        };
    }

    async getDashboardInsights() {
        const doctors = await Doctor.findAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["name"]
                }
            ]
        });

        const doctorStats = [];
        for (const doctor of doctors as any[]) {
            const total = await Appointment.count({
                where: { doctor_id: doctor.id }
            });

            doctorStats.push({
                doctor_id: doctor.id,
                doctor_name: doctor.user?.name,
                specialization: doctor.specialization,
                total
            });
        }

        const totalAppointments = await Appointment.count();
        const completedAppointments = await Appointment.count({
            where: {
                consultation_status: "completed"
            }
        });

        const completionRate = totalAppointments > 0 ? Number(
            (completedAppointments / totalAppointments) * 100
        ).toFixed(1) : "0";

        return {
            doctorStats,
            completionRate
        };
    }

    async getDoctorAvailabilityDashboard(date: string, page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;
        const unavailableIds = (
            await DoctorUnavailability.findAll({
                attributes: ["doctor_id"],
                where: { unavailable_date: date },
                raw: true
            })
        ).map((x: any) => x.doctor_id);

        const [totalDoctors, availableDoctors, unavailableDoctors] =
            await Promise.all([Doctor.count(),

            Doctor.findAndCountAll({
                where: unavailableIds.length
                    ? { id: { [Op.notIn]: unavailableIds } }
                    : {},
                include: [{
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "profile_picture"]
                }],
                limit,
                offset,
                distinct: true
            }),

            Doctor.findAndCountAll({
                where: unavailableIds.length
                    ? { id: unavailableIds }
                    : { id: -1 },
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "profile_picture"]
                    },
                    {
                        model: DoctorUnavailability,
                        as: "unavailabilities",
                        where: { unavailable_date: date },
                        required: true
                    }
                ],
                limit,
                offset,
                distinct: true
            })
            ]);

        return {
            totalDoctors,
            availableDoctors,
            unavailableDoctors
        };
    }
}
