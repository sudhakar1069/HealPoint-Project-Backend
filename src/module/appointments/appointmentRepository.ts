import { Op } from "sequelize";
import Appointment from "../../models/appointmentModel.js";
import Doctor from "../../models/doctorModel.js";
import Patient from "../../models/patientModel.js";
import { User } from "../../models/userModel.js";
import type { AppointmentStatus } from "../../types/appointmentStatus.js";

export class AppointmentRepository {
    async createAppointment(data: any) {
        return await Appointment.create(data);
    }

    async getAppointmentById(id: number) {
        return await Appointment.findByPk(id);
    }

    async getAllAppointments(
        page: number = 1,
        limit: number = 10,
        patientName?: string,
        month?: number,
        year?: number
    ) {
        const offset = (page - 1) * limit;
        const patientUserWhere: any = {};

        if (patientName) {
            patientUserWhere.name = { [Op.like]: `%${patientName}%` };
        }

        const appointmentWhere: any = {};

        if (month && year) {
            appointmentWhere.appointment_date = {
                [Op.between]: [
                    new Date(year, month - 1, 1),
                    new Date(year, month, 0)
                ]
            };
        } else if (year) {
            appointmentWhere.appointment_date = {
                [Op.between]: [
                    new Date(year, 0, 1),
                    new Date(year, 11, 31)
                ]
            };
        } else if (month) {
            const currentYear = new Date().getFullYear();
            appointmentWhere.appointment_date = {
                [Op.between]: [
                    new Date(currentYear, month - 1, 1),
                    new Date(currentYear, month, 0)
                ]
            };
        }

        return await Appointment.findAndCountAll({
            where: appointmentWhere,
            include: [
                {
                    model: Doctor,
                    as: "doctor",
                    attributes: [
                        "id",
                        "specialization",
                        "consultation_fee",
                        "experience_years"
                    ],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "name",
                                "email",
                                "profile_picture"
                            ]
                        }
                    ]
                },
                {
                    model: Patient,
                    as: "patient",
                    attributes: ["id"],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "name",
                                "email",
                                "gender"
                            ],
                            where: patientName ? patientUserWhere : undefined
                        }
                    ]
                }
            ],
            order: [
                ["appointment_date", "DESC"],
                ["start_time", "DESC"]
            ],
            limit,
            offset,
            distinct: true
        });
    }

    async getDoctorAppointments(
        doctorId: number,
        page: number = 1,
        limit: number = 10,
        patientName?: string,
        month?: number,
        year?: number
    ) {
        const offset = (page - 1) * limit;
        const patientUserWhere: any = {};

        if (patientName) {
            patientUserWhere.name = { [Op.like]: `%${patientName}%` };
        }
        const appointmentWhere: any = { doctor_id: doctorId };
        if (month && year) {
            appointmentWhere.appointment_date = {
                [Op.between]: [
                    new Date(year, month - 1, 1),
                    new Date(year, month, 0)
                ]
            };
        } else if (year) {
            appointmentWhere.appointment_date = {
                [Op.between]: [
                    new Date(year, 0, 1),
                    new Date(year, 11, 31)
                ]
            };
        } else if (month) {
            const currentYear = new Date().getFullYear();
            appointmentWhere.appointment_date = {
                [Op.between]: [
                    new Date(currentYear, month - 1, 1),
                    new Date(currentYear, month, 0)
                ]
            };
        }

        return await Appointment.findAndCountAll({
            where: appointmentWhere,
            include: [
                {
                    model: Patient,
                    as: "patient",
                    attributes: ["id"],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "name",
                                "email",
                                "gender"
                            ],
                            where: patientName ? patientUserWhere : undefined
                        }
                    ]
                }
            ],
            order: [
                ["appointment_date", "DESC"],
                ["start_time", "DESC"]
            ],
            limit,
            offset,
            distinct: true
        });
    }

    async getPatientAppointments(
        patientId: number,
        page = 1,
        limit = 10,
        doctorName?: string,
        month?: number,
        year?: number
    ) {
        const offset = (page - 1) * limit;
        const doctorUserWhere: any = {};
        if (doctorName) {
            doctorUserWhere.name = { [Op.like]: `%${doctorName}%` };
        }
        const appointmentWhere: any = { patient_id: patientId };
        if (month && year) {
            appointmentWhere.appointment_date = {
                [Op.between]: [
                    new Date(year, month - 1, 1),
                    new Date(year, month, 0)
                ]
            };
        } else if (year) {
            appointmentWhere.appointment_date = {
                [Op.between]: [
                    new Date(year, 0, 1),
                    new Date(year, 11, 31)
                ]
            };
        } else if (month) {
            const currentYear = new Date().getFullYear();
            appointmentWhere.appointment_date = {
                [Op.between]: [
                    new Date(currentYear, month - 1, 1),
                    new Date(currentYear, month, 0)
                ]
            };
        }

        return await Appointment.findAndCountAll({
            where: appointmentWhere,
            include: [
                {
                    model: Doctor,
                    as: "doctor",
                    attributes: [
                        "id",
                        "specialization",
                        "consultation_fee",
                        "experience_years"
                    ],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "name",
                                "email",
                                "profile_picture"
                            ],
                            where: doctorName ? doctorUserWhere : undefined
                        }
                    ]
                }
            ],
            order: [
                ["appointment_date", "DESC"],
                ["start_time", "DESC"]
            ],
            limit,
            offset,
            distinct: true
        });
    }

    async getAppointmentDetails(id: number) {
        return await Appointment.findByPk(id, {
            include: [
                {
                    model: Doctor,
                    as: "doctor",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "email"]
                        }
                    ]
                },
                {
                    model: Patient,
                    as: "patient",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["id", "name", "email"]
                        }
                    ]
                }
            ]
        });
    }

    async updateAppointmentStatus(appointmentId: number, status: AppointmentStatus) {
        return await Appointment.update(
            { status },
            { where: { id: appointmentId } }
        );
    }

    async updateMeetingDetails(appointmentId: number, meetingRoom: string) {
        return await Appointment.update(
            {
                meeting_room: meetingRoom,
                consultation_status: "scheduled"
            },
            {
                where: { id: appointmentId }
            }
        );
    }

    async getActiveAppointmentBySlot(
        doctorId: number,
        appointmentDate: string,
        startTime: string
    ) {
        return await Appointment.findOne({
            where: {
                doctor_id: doctorId,
                appointment_date: appointmentDate,
                start_time: startTime,
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

    async getExpiredPendingAppointments() {
        return await Appointment.findAll({
            where: {
                status: "pending_payment",
                payment_expires_at: { [Op.lte]: new Date() }
            }
        });
    }

    async cancelAppointment(appointmentId: number) {
        return await Appointment.update(
            { status: "cancelled" },
            { where: { id: appointmentId } }
        );
    }

    async clearPaymentExpiry(appointmentId: number) {
        return await Appointment.update(
            { payment_expires_at: null },
            { where: { id: appointmentId } }
        );
    }

    async markConsultationStarted(appointmentId: number) {
        return Appointment.update(
            {
                consultation_status: "ongoing",
                consultation_started_at: new Date()
            },
            {
                where: { id: appointmentId }
            }
        );
    }

    async completeConsultation(appointmentId: number) {
        return Appointment.update(
            {
                consultation_status: "completed",
                consultation_ended_at: new Date(),
                status: "completed"
            },
            {
                where: { id: appointmentId }
            }
        );
    }
}