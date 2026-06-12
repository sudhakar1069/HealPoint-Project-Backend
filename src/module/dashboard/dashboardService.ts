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
}