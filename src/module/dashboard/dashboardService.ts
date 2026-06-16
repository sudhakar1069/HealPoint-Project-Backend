import { DashboardRepository } from "./dashboardRepository.js";
import { DoctorRepository } from "../doctors/doctorRepository.js";
import { PaymentRepository } from "../payment/paymentRepository.js";
import { ReviewRepository } from "../reviews/reviewRepository.js";

export class DashboardService {
    constructor(
        private dashboardRepository: DashboardRepository,
        private doctorRepository: DoctorRepository,
        private paymentRepository: PaymentRepository,
        private reviewRepository: ReviewRepository
    ) { }

    async getDashboardSummary(doctorUserId: number) {
        const doctor = await this.doctorRepository.getDoctorByUserId(doctorUserId);

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        const totalAppointments = await this.dashboardRepository.getTotalAppointmentCount(doctor.id);
        const totalPatients = await this.dashboardRepository.getTotalPatientsCount(doctor.id);
        const averageRating = await this.reviewRepository.getAverageRating(doctor.id);
        const totalEarnings = await this.paymentRepository.getTotalEarnings(doctor.id);

        return {
            totalAppointments,
            totalPatients,
            averageRating,
            totalEarnings
        };
    }

    async getTodayAppointmentsForDashboard(doctorUserId: number) {
        const doctor = await this.doctorRepository.getDoctorByUserId(doctorUserId);

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        const appointments = await this.dashboardRepository.getTodayAppointments(doctor.id);
        return appointments.map((appointment: any) => ({
            id: appointment.id,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            consultation_type: appointment.consultation_type,
            patient_name: appointment.patient?.user?.name
        })
        );
    }

    async getWeeklyLoadForDashboard(doctorUserId: number) {
        const doctor = await this.doctorRepository.getDoctorByUserId(doctorUserId);

        if (!doctor) {
            throw new Error("Doctor not found");
        }
        return await this.dashboardRepository.getWeeklyLoad(doctor.id);
    }

    async getMonthlyOverviewForDashboard(doctorUserId: number, year: number) {
        const doctor = await this.doctorRepository.getDoctorByUserId(doctorUserId);
        if (!doctor) {
            throw new Error("Doctor not found");
        }

        return await this.dashboardRepository.getMonthlyOverview(doctor.id, year);
    }

    async getAdminDashboard(page: number = 1, limit: number = 10) {
        const overview = await this.dashboardRepository.getDashboardOverview();
        const doctorSummary = await this.dashboardRepository.getDoctorAppointmentSummary(page, limit);
        const insights = await this.dashboardRepository.getDashboardInsights();

        return {
            overview,
            doctorSummary: {
                totalRecords: doctorSummary.count,
                currentPage: page,
                totalPages: Math.ceil(doctorSummary.count / limit),
                rows: doctorSummary.rows
            },
            insights
        };
    }

    async getDoctorAvailabilityDashboard(date: string, page: number, limit: number) {
        const result = await this.dashboardRepository
            .getDoctorAvailabilityDashboard(date, page, limit);

        return {
            summary: {
                totalDoctors: result.totalDoctors,
                availableDoctors: result.availableDoctors.count,
                unavailableDoctors: result.unavailableDoctors.count
            },

            availableDoctors: {
                totalRecords: result.availableDoctors.count,
                currentPage: page,
                totalPages: Math.ceil(result.availableDoctors.count / limit),
                rows: result.availableDoctors.rows.map((doctor: any) => ({
                    doctor_id: doctor.id,
                    doctor_name: doctor.user?.name,
                    profile_picture: doctor.user?.profile_picture,
                    specialization: doctor.specialization,
                    date,
                    status: "available"
                }))
            },

            unavailableDoctors: {
                totalRecords: result.unavailableDoctors.count,
                currentPage: page,
                totalPages: Math.ceil(result.unavailableDoctors.count / limit),
                rows: result.unavailableDoctors.rows.map((doctor: any) => ({
                    doctor_id: doctor.id,
                    doctor_name: doctor.user?.name,
                    profile_picture: doctor.user?.profile_picture,
                    specialization: doctor.specialization,
                    unavailable_date: doctor.unavailabilities?.[0]?.unavailable_date,
                    reason: doctor.unavailabilities?.[0]?.reason,
                    is_full_day: doctor.unavailabilities?.[0]?.is_full_day,
                    start_time: doctor.unavailabilities?.[0]?.start_time,
                    end_time: doctor.unavailabilities?.[0]?.end_time,
                    status: "unavailable"
                }))
            },

            chartData: {
                available: result.availableDoctors.count,
                unavailable: result.unavailableDoctors.count
            },

            quickSummary: {
                availableToday: result.availableDoctors.count,
                unavailableToday: result.unavailableDoctors.count
            }
        };
    }

    async getAdminEarningsReport(period: string) {
        const now = new Date();
        let startDate: Date;

        if (period === "week") {
            startDate = new Date();
            startDate.setDate(now.getDate() - 7);
        } else if (period === "month") {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else {
            startDate = new Date(now.getFullYear(), 0, 1);
        }

        const totalRevenue = await this.dashboardRepository.getTotalRevenue(startDate, now);
        const totalConsultations = await this.dashboardRepository.getTotalConsultations(startDate, now);
        const revenueTrend = await this.dashboardRepository.getRevenueTrend(startDate, now);

        const consultations = await this.dashboardRepository.getRecentConsultations(startDate, now);

        const recentConsultations = consultations.map((item: any) => ({
            patientName: item.appointment?.patient?.user?.name || null,
            doctorName: item.appointment?.doctor?.user?.name || null,
            specialization: item.appointment?.doctor?.specialization || null,
            consultationType: item.appointment?.consultation_type || null,
            appointmentDate: item.appointment?.appointment_date || null,
            amount: Number(item.amount),
            paymentStatus: item.status
        }));

        return {
            summary: {
                totalRevenue,
                totalConsultations,
                avgPerVisit: totalConsultations ? Math.round(totalRevenue / totalConsultations) : 0
            },
            revenueTrend,
            recentConsultations
        };
    }

    async getAdminDashboardOverview(year: number) {
    const totalDoctors = await this.dashboardRepository.getTotalDoctors();
    const totalPatients = await this.dashboardRepository.getTotalPatients();
    const totalAppointments = await this.dashboardRepository.getTotalAppointments();
    const totalRevenue = await this.dashboardRepository.getAdminRevenue();

    const appointmentTrend = await this.dashboardRepository.getAppointmentTrend(year);

    const appointments = await this.dashboardRepository.getRecentAppointments();

    const recentAppointments = appointments.map((item: any) => ({
        patientName: item.patient?.user?.name || null,
        doctorName: item.doctor?.user?.name || null,
        appointmentDate: item.appointment_date || null,
        consultationType: item.consultation_type || null,
        amount: Number(item.payment?.amount || 0),
        paymentStatus: item.payment?.status || null,
        status: item.status
    }));

    return {
        summary: {
            totalDoctors,
            totalPatients,
            totalAppointments,
            totalRevenue
        },
        appointmentTrend,
        recentAppointments
    };
}
}