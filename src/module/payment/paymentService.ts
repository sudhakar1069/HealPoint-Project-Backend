import crypto from "crypto";
import { razorpay } from "../../config/razorpay.js";
import { PaymentRepository } from "./paymentRepository.js";
import { AppointmentRepository } from "../appointments/appointmentRepository.js";
import { DoctorRepository } from "../doctors/doctorRepository.js";
import { generateMeetingRoom } from "../../utils/jitsiMeeting.js";
import { EmailService } from "../../utils/emailService.js";
interface VerifyPaymentDto {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export class PaymentService {
    constructor(
        private paymentRepository: PaymentRepository,
        private appointmentRepository: AppointmentRepository,
        private doctorRepository: DoctorRepository
    ) { }
    private emailService = new EmailService()

    async createOrder(patientId: number, appointmentId: number) {
        const appointment = await this.appointmentRepository.getAppointmentById(
            appointmentId
        );

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (appointment.patient_id !== patientId) {
            throw new Error("Unauthorized");
        }

        if (appointment.status !== "pending_payment") {
            throw new Error("Appointment not eligible for payment");
        }

        if (
            appointment.payment_expires_at &&
            new Date() > new Date(appointment.payment_expires_at)
        ) {
            throw new Error("Payment session expired");
        }

        const existingPayment = await this.paymentRepository.getByAppointmentId(
            appointment.id
        );

        if (existingPayment?.status === "created") {
            throw new Error("Payment already initiated");
        }

        const doctor = await this.doctorRepository.getDoctorById(appointment.doctor_id);

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        const amount = Number(doctor.consultation_fee);

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `appointment_${appointment.id}`
        });

        await this.paymentRepository.createPayment({
            appointment_id: appointment.id,
            amount,
            razorpay_order_id: order.id,
            status: "created"
        });

        return order;
    }

    async verifyPayment(data: VerifyPaymentDto) {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = data;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            throw new Error("Invalid payment signature");
        }

        const payment = await this.paymentRepository.getByOrderId(razorpay_order_id);

        if (!payment) {
            throw new Error("Payment not found");
        }

        const appointment = await this.appointmentRepository.getAppointmentById(
            payment.appointment_id
        );

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (appointment.status === "cancelled") {
            throw new Error("Appointment already expired");
        }

        await this.paymentRepository.updatePaymentSuccess(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        await this.appointmentRepository.updateAppointmentStatus(
            payment.appointment_id,
            "confirmed"
        );

        const meetingRoom = generateMeetingRoom(
            appointment.doctor_id,
            appointment.patient_id
        );

        await this.appointmentRepository.updateMeetingDetails(
            appointment.id,
            meetingRoom
        );

        await this.appointmentRepository.clearPaymentExpiry(payment.appointment_id);

        const updatedAppointment: any =
            await this.appointmentRepository.getAppointmentDetails(payment.appointment_id);

        if (updatedAppointment) {
            try {
                await this.emailService.sendAppointmentConfirmationEmail(
                    updatedAppointment.patient.user.email,
                    updatedAppointment.patient.user.name,
                    updatedAppointment.doctor.user.name,
                    updatedAppointment.appointment_date,
                    updatedAppointment.start_time,
                    updatedAppointment.consultation_type
                );
            } catch (error) {
                console.error("Email sending failed:", error);
            }
        }

        return {
            success: true,
            appointment_id: payment.appointment_id
        };
    }

    async expirePendingPayments() {
        const expiredAppointments =
            await this.appointmentRepository.getExpiredPendingAppointments();

        for (const appointment of expiredAppointments) {
            const payment = await this.paymentRepository.getByAppointmentId(appointment.id);

            if (payment) {
                await this.paymentRepository.updatePaymentFailed(payment.razorpay_order_id);
            }

            await this.appointmentRepository.cancelAppointment(appointment.id);

            await this.appointmentRepository.clearPaymentExpiry(appointment.id);
        }
        return { success: true };
    }

    async getPaymentByAppointment(appointmentId: number) {
        const payment = await this.paymentRepository.getByAppointmentId(appointmentId);

        if (!payment) {
            throw new Error("Payment not found");
        }

        return payment;
    }
}