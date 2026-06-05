import { DoctorRepository } from "../doctors/doctorRepository.js";
import { EarningsRepository } from "./earningRepository.js";

export class EarningsService {

    constructor(
        private earningsRepository: EarningsRepository,
        private doctorRepository: DoctorRepository
    ) { }

    async getEarningsSummary(doctorId: number) {
        const doctor = await this.doctorRepository.getDoctorById(doctorId);

        if (!doctor)
            throw new Error("Doctor not found");

        const payments = await this.earningsRepository.getDoctorPaidPayments(doctorId);

        let totalEarnings = 0;
        let videoEarnings = 0;
        let clinicEarnings = 0;
        let completedAppointments = 0;

        for (const payment of payments as any[]) {
            const amount = Number(payment.amount);
            totalEarnings += amount;

            const appointment = payment.appointment;

            if (appointment?.status === "completed") {
                completedAppointments++;
            }

            if (
                appointment?.consultation_type?.toLowerCase() === "video"
            ) {
                videoEarnings += amount;
            }

            if (
                appointment?.consultation_type?.toLowerCase() === "clinic"
            ) {
                clinicEarnings += amount;
            }
        }

        return {
            total_earnings: totalEarnings,
            paid_appointments: payments.length,
            completed_appointments: completedAppointments,
            video_earnings: videoEarnings,
            clinic_earnings: clinicEarnings
        };
    }

    async getPaymentHistory(doctorId: number) {

        const doctor = await this.doctorRepository.getDoctorById(doctorId);

        if (!doctor)
            throw new Error("Doctor not found");

        const payments = await this.earningsRepository.getDoctorPaymentHistory(doctorId);

        return {
            payments: payments.map((payment: any) => ({
                id: payment.id,
                patient: payment.appointment.patient.user.name,
                date: payment.appointment.appointment_date,
                time: payment.appointment.start_time,
                amount: Number(payment.amount),
                status: "Paid",
                type: payment.appointment.consultation_type === "Video Call" ? "Video Call" : "Clinic Visit"
            }))
        };
    }

    async getMonthlyEarnings(doctorId: number) {

        const payments = await this.earningsRepository.getDoctorPaidPayments(doctorId);
        const monthlyMap: Record<string, number> = {};
        for (const payment of payments as any[]) {

            const date = new Date(payment.created_at);

            const month = date.toLocaleString("en-US", { month: "short" });

            monthlyMap[month] = (monthlyMap[month] || 0) + Number(payment.amount);
        }

        return {
            monthly: Object.entries(monthlyMap).map(
                ([month, earnings]) => ({
                    month,
                    earnings
                })
            )
        };
    }
}