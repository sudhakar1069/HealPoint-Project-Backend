import Payment from "../../models/paymentModel.js";
import type { PaymentCreationAttributes } from "../../models/paymentModel.js";
import { fn, col } from "sequelize";
import Appointment from "../../models/appointmentModel.js";
import { Transaction } from "sequelize";

export class PaymentRepository {

    async createPayment(data: PaymentCreationAttributes) {
        return await Payment.create(data);
    }

    async getByOrderId(orderId: string) {
        return await Payment.findOne({
            where: { razorpay_order_id: orderId },
        });
    }

    async getByAppointmentId(appointmentId: number) {
        return await Payment.findOne({
            where: { appointment_id: appointmentId },
        });
    }

    async updatePaymentSuccess(
        orderId: string,
        paymentId: string,
        signature: string,
        transaction?: Transaction
    ) {
        await Payment.update(
            {
                status: "paid",
                razorpay_payment_id: paymentId,
                razorpay_signature: signature,
            },
            {
                where: { razorpay_order_id: orderId },
                ...(transaction ? { transaction } : {})
            }
        );
    }

    async updatePaymentFailed(orderId: string) {
        await Payment.update(
            { status: "failed", },
            { where: { razorpay_order_id: orderId } }
        );
    }

    async markRefunded(appointmentId: number) {
        return await Payment.update(
            { status: "refunded" },
            { where: { appointment_id: appointmentId } }
        );
    }

    async getTotalEarnings(doctorId: number) {
        const result: any = await Payment.findOne({
            attributes: [[fn("SUM", col("amount")), "totalEarnings"]],
            where: {
                status: "paid"
            },
            include: [
                {
                    model: Appointment,
                    as: "appointment",
                    attributes: [],
                    where: { doctor_id: doctorId }
                }
            ],
            raw: true
        });

        return Number(result?.totalEarnings || 0);
    }
}