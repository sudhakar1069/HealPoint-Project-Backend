import { DoctorRepository } from "../doctors/doctorRepository.js";
import { EarningsRepository } from "./earningRepository.js";
interface PaymentData {
    id: number;
    amount: number;
    status: string;
    appointment?: {
        id: number;
        status: string;
    };
}
export class EarningsService {


    constructor(
        private earningsRepository: EarningsRepository,
        private doctorRepository: DoctorRepository
    ) { }

    async getEarningsSummary(doctorId: number) {
        const doctor = await this.doctorRepository.getDoctorById(doctorId);

        if (!doctor)
            throw new Error("Doctor not found");

        const payments: PaymentData[] = await this.earningsRepository.getDoctorPaidPayments(doctorId);

        let totalEarnings = 0;
        let completedAppointments = 0;

        for (const payment of payments) {
            const amount = Number(payment.amount);
            totalEarnings += amount;

            const appointment = payment.appointment;

            if (appointment?.status === "completed") {
                completedAppointments++;
            }
        }

        return {
            total_earnings: totalEarnings,
            paid_appointments: payments.length,
            completed_appointments: completedAppointments,
        };
    }

    async getPaymentHistory(
        doctorId: number,
        page: number = 1,
        limit: number = 10,
        date?: string
    ) {
        const doctor = await this.doctorRepository.getDoctorById(doctorId);
        if (!doctor)
            throw new Error("Doctor not found");
        const payments = await this.earningsRepository.getDoctorPaymentHistory(
            doctorId,
            page,
            limit,
            date
        );

        return {
            totalItems: payments.count,
            totalPages: Math.ceil(payments.count / limit),
            currentPage: page,
            payments: payments.rows.map((payment: any) => ({
                id: payment.id,
                patient: payment.appointment.patient.user.name,
                date: payment.appointment.appointment_date,
                time: payment.appointment.start_time,
                amount: Number(payment.amount),
                status: "Paid",
                type: payment.appointment.consultation_type

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
        const monthly = [];

        for (const month in monthlyMap) {
            monthly.push({
                month,
                earnings: monthlyMap[month]
            });
        }
        return { monthly };
    }
}