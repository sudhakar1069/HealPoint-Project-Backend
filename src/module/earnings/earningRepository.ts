import Payment from "../../models/paymentModel.js";
import Appointment from "../../models/appointmentModel.js";
import Patient from "../../models/patientModel.js";
import { User } from "../../models/userModel.js";
import { fn, col } from "sequelize";

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

    async getDoctorPaymentHistory(doctorId: number) {
        return await Payment.findAll({
            where: { status: "paid" },
            include: [
                {
                    model: Appointment,
                    as: "appointment",
                    required: true,
                    where: { doctor_id: doctorId },
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
            order: [["created_at", "DESC"]]
        });
    }

    async getMonthlyEarnings(doctorId: number) {
        return await Payment.findAll({
            attributes: [
                [
                    fn(
                        "DATE_FORMAT",
                        col("Payment.created_at"),
                        "%b"
                    ),
                    "month"
                ],
                [
                    fn("SUM", col("amount")),
                    "earnings"
                ]
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