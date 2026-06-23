import { Op, Transaction } from "sequelize";
import Appointment, { type AppointmentCreationAttributes } from "../../models/appointmentModel.js";
import Doctor from "../../models/doctorModel.js";
import Patient from "../../models/patientModel.js";
import { User } from "../../models/userModel.js";
import Payment from "../../models/paymentModel.js";
import type { AppointmentStatus } from "../../types/appointmentStatus.js";
import { getDateRangeFilter } from "../../utils/dateFilter.js";


export class AppointmentRepository {
    async createAppointment(
        data: AppointmentCreationAttributes,
        transaction?: Transaction
    ) {
        return await Appointment.create(
            data,
            transaction ? { transaction } : {}
        );
    }

    async getAppointmentById(id: number) {
        return await Appointment.findByPk(id);
    }

    async getAllAppointments(
        page: number = 1,
        limit: number = 10,
        patientName?: string,
        doctorName?: string,
        consultationStatus?: string,
        month?: number,
        year?: number
    ) {
        const offset = (page - 1) * limit;
        const patientUserWhere: any = {};

        if (patientName) {
            patientUserWhere.name = {
                [Op.like]: `%${patientName}%`
            };
        }

        const doctorUserWhere: any = {};

        if (doctorName) {
            doctorUserWhere.name = {
                [Op.like]: `%${doctorName}%`
            };
        }

        const appointmentWhere: any = {};

        if (consultationStatus) {
            appointmentWhere.status = consultationStatus;
        }

        const dateFilter = getDateRangeFilter(month, year);

        if (dateFilter) {
            appointmentWhere.appointment_date = dateFilter;
        }

        return await Appointment.findAndCountAll({
            where: appointmentWhere,
            include: [
                {
                    model: Payment,
                    as: "payment",
                    required: false
                },
                {
                    model: Doctor,
                    as: "doctor",
                    attributes: [
                        "id",
                        "specialization",
                        "consultation_fee",
                        "experience_years"
                    ],
                    required: !!doctorName,
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
                            required: !!doctorName,
                            where: doctorName
                                ? doctorUserWhere
                                : undefined
                        }
                    ]
                },
                {
                    model: Patient,
                    as: "patient",
                    attributes: ["id"],
                    required: !!patientName,
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
                            required: !!patientName,
                            where: patientName
                                ? patientUserWhere
                                : undefined
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
            distinct: true,
        });
    }

    async getBookedAppointmentsByDate(doctorId: number, appointmentDate: string) {
        return await Appointment.findAll({
            where: {
                doctor_id: doctorId,
                appointment_date: appointmentDate,
                status: {
                    [Op.in]: [
                        "pending_payment",
                        "confirmed"
                    ]
                }
            }
        });
    }

    async getDoctorAppointments(
        doctorId: number,
        page: number = 1,
        limit: number = 10,
        patientName?: string,
        month?: number,
        year?: number,
        consultationFilter?: string
    ) {
        const offset = (page - 1) * limit;
        const patientUserWhere: any = {};

        if (patientName) {
            patientUserWhere.name = { [Op.like]: `%${patientName}%` };
        }

        const appointmentWhere: any = { doctor_id: doctorId };

        if (consultationFilter) {
            switch (consultationFilter) {
                case "upcoming":
                    appointmentWhere.status = "confirmed";
                    appointmentWhere.consultation_status = "scheduled";
                    break;

                case "completed":
                    appointmentWhere.consultation_status = "completed";
                    break;

                case "missed":
                    appointmentWhere.consultation_status = "missed";
                    break;

                case "cancelled":
                    appointmentWhere.status = "cancelled";
                    break;
            }
        }

        const dateFilter = getDateRangeFilter(month, year);

        if (dateFilter) {
            appointmentWhere.appointment_date = dateFilter;
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
                            where: patientName
                                ? patientUserWhere
                                : undefined
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
        year?: number,
        consultationFilter?: string
    ) {
        const offset = (page - 1) * limit;
        const doctorUserWhere: any = {};

        if (doctorName) {
            doctorUserWhere.name = { [Op.like]: `%${doctorName}%` };
        }
        const appointmentWhere: any = { patient_id: patientId };

        if (consultationFilter) {
            switch (consultationFilter) {
                case "upcoming":
                    appointmentWhere.status = "confirmed";
                    appointmentWhere.consultation_status = "scheduled";
                    break;

                case "completed":
                    appointmentWhere.consultation_status = "completed";
                    break;

                case "missed":
                    appointmentWhere.consultation_status = "missed";
                    break;

                case "cancelled":
                    appointmentWhere.status = "cancelled";
                    break;
            }
        }

        const dateFilter = getDateRangeFilter(month, year);

        if (dateFilter) {
            appointmentWhere.appointment_date = dateFilter;
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
                            where: doctorName
                                ? doctorUserWhere
                                : undefined
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
                            attributes: [
                                "id",
                                "name",
                                "email"
                            ]
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
                            attributes: [
                                "id",
                                "name",
                                "email"
                            ]
                        }
                    ]
                }
            ]
        });
    }

    async updateAppointmentStatus(appointmentId: number, status: AppointmentStatus, transaction?: Transaction) {
        return await Appointment.update(
            { status },
            {
                where: { id: appointmentId },
                ...(transaction ? { transaction } : {})
            }
        );
    }

    async updateMeetingDetails(appointmentId: number, meetingRoom: string, transaction?: Transaction) {
        return await Appointment.update(
            {
                meeting_room: meetingRoom,
                consultation_status: "scheduled"
            },
            {
                where: { id: appointmentId },
                ...(transaction ? { transaction } : {})
            }
        );
    }

    async getActiveAppointmentBySlot(
        doctorId: number,
        appointmentDate: string,
        startTime: string,
        transaction?: Transaction
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
            },
            ...(transaction ? { transaction } : {})
        });
    }

    async getExpiredPendingAppointments() {
        return await Appointment.findAll({
            where: {
                status: "pending_payment",
                payment_expires_at: {
                    [Op.lte]: new Date()
                }
            }
        });
    }

    async cancelAppointment(appointmentId: number) {
        return await Appointment.update(
            {
                status: "cancelled",
                consultation_status: null
            },
            { where: { id: appointmentId } }
        );
    }

    async clearPaymentExpiry(appointmentId: number, transaction?: Transaction) {
        return await Appointment.update(
            { payment_expires_at: null },
            {
                where: { id: appointmentId },
                ...(transaction ? { transaction } : {})
            }
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

    async markMissedConsultations() {
        const now = new Date();
        const appointments = await Appointment.findAll({
            where: {
                status: "confirmed",
                consultation_status: "scheduled"
            }
        });

        for (const appointment of appointments) {
            const appointmentEnd = new Date(
                `${appointment.appointment_date}T${appointment.end_time}`
            );

            if (appointmentEnd < now) {
                await appointment.update({
                    consultation_status: "missed"
                });
            }
        }
    }

    async getAppointmentsForReminder() {
        return await Appointment.findAll({
            where: {
                status: "confirmed",
                consultation_status: "scheduled",
                reminder_sent: false
            },
            include: [
                {
                    model: Patient,
                    as: "patient",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "name",
                                "email"
                            ]
                        }
                    ]
                },
                {
                    model: Doctor,
                    as: "doctor",
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "name"
                            ]
                        }
                    ]
                }
            ]
        });
    }

    async markReminderSent(appointmentId: number) {
        return await Appointment.update(
            { reminder_sent: true },
            {
                where: { id: appointmentId }
            }
        );
    }
}