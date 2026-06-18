import Payment from "../../models/paymentModel.js";
import Appointment from "../../models/appointmentModel.js";
import Patient from "../../models/patientModel.js";
import { User } from "../../models/userModel.js";
import { Op, fn, col } from "sequelize";

export class EarningsRepository {

    async getDoctorPaidPayments(doctorId: number) {
        return await Payment.findAll({
            where: { status: "paid" },
            include: [
                {
                    model: Appointment,
                    as: "appointment",
                    required: true,
                    where: { doctor_id: doctorId }
                }
            ]
        });
    }

    async getDoctorPaymentHistory(
        doctorId: number,
        page: number = 1,
        limit: number = 10,
        date?: string
    ) {
        const offset = (page - 1) * limit;
        const appointmentWhere: any = { doctor_id: doctorId };

        if (date) {
            appointmentWhere.appointment_date = {
                [Op.between]: [
                    new Date(`${date}T00:00:00`),
                    new Date(`${date}T23:59:59`)
                ]
            };
        }

        return await Payment.findAndCountAll({
            where: { status: "paid" },
            include: [
                {
                    model: Appointment,
                    as: "appointment",
                    required: true,
                    where: appointmentWhere,
                    include: [
                        {
                            model: Patient,
                            as: "patient",
                            include: [
                                {
                                    model: User,
                                    as: "user"
                                }
                            ]
                        }
                    ]
                }
            ],
            order: [["created_at", "DESC"]],
            limit,
            offset
        });
    }

    async getMonthlyEarnings(doctorId: number) {
        return await Payment.findAll({
            attributes: [
                [fn("DATE_FORMAT", col("Payment.created_at"), "%b"), "month"],
                [fn("SUM", col("amount")), "earnings"]
            ],
            where: { status: "paid" },
            include: [
                {
                    model: Appointment,
                    as: "appointment",
                    required: true,
                    attributes: [],
                    where: { doctor_id: doctorId }
                }
            ],
            group: ["month"],
            raw: true
        });
    }
}