import Payment from "../../models/paymentModel.js";
import type { PaymentCreationAttributes } from "../../models/paymentModel.js";

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
        signature: string
    ) {
        await Payment.update(
            {
                status: "paid",
                razorpay_payment_id: paymentId,
                razorpay_signature: signature,
            },
            { where: { razorpay_order_id: orderId } }
        );
    }

    async updatePaymentFailed(orderId: string) {
        await Payment.update(
            { status: "failed", },
            { where: { razorpay_order_id: orderId } }
        );
    }

    // async getPendingCreatedPayments() {
    //     return await Payment.findAll({
    //         where: { status: "created" },
    //     });
    // }
}