import cron from "node-cron";

import { PaymentService } from "../module/payment/paymentService.js";
import { PaymentRepository } from "../module/payment/paymentRepository.js";
import { AppointmentRepository } from "../module/appointments/appointmentRepository.js";
import { DoctorRepository } from "../module/doctors/doctorRepository.js";

const paymentService = new PaymentService(
    new PaymentRepository(),
    new AppointmentRepository(),
    new DoctorRepository()
);

export const startPaymentExpiryJob = () => {
    cron.schedule("* * * * *", async () => {
        try {
            await paymentService.expirePendingPayments();
            // console.log("[PAYMENT EXPIRY JOB] checked");
        } catch (error) {
            console.error("[PAYMENT EXPIRY JOB ERROR]", error);
        }
    });
};