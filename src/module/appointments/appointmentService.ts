import { AppointmentRepository } from "./appointmentRepository.js";
import { DoctorRepository } from "../doctors/doctorRepository.js";
import { PatientRepository } from "../patients/patientRepository.js";
import { SlotService } from "../slots/slotService.js";
import { PaymentRepository } from "../payment/paymentRepository.js";
import { ReviewRepository } from "../reviews/reviewRepository.js";

export class AppointmentService {
    constructor(
        private appointmentRepository: AppointmentRepository,
        private doctorRepository: DoctorRepository,
        private patientRepository: PatientRepository,
        private slotService: SlotService,
        private paymentRepository: PaymentRepository,
        private reviewRepository: ReviewRepository
    ) { }

    private buildPaginationResponse(result: any, page: number, limit: number, appointments: any[]) {
        return {
            totalRecords: result.count,
            currentPage: page,
            totalPages: Math.ceil(result.count / limit),
            appointments
        };
    }

    async bookAppointment(patientId: number, data: any) {
        const {
            doctor_id,
            appointment_date,
            start_time,
            end_time,
            consultation_type,
            reason
        } = data;

        const appointmentDateTime = new Date(
            `${appointment_date}T${start_time}:00`
        );

        if (appointmentDateTime <= new Date()) {
            throw new Error("Cannot book past slots");
        }

        const patient = await this.patientRepository.getPatientById(patientId);

        if (!patient) {
            throw new Error("Patient not found");
        }

        const doctor = await this.doctorRepository.getDoctorById(doctor_id);

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        const existingAppointment = await this.appointmentRepository
            .getActiveAppointmentBySlot(doctor_id, appointment_date, start_time);

        if (existingAppointment) {
            throw new Error("Slot already booked");
        }

        const availableSlots = await this.slotService.getDoctorSlots(
            doctor_id,
            appointment_date
        );

        const matchedSlot = availableSlots.find(slot =>
            slot.start_time === start_time &&
            slot.end_time === end_time
        );

        if (!matchedSlot || matchedSlot.status !== "available") {
            throw new Error("Selected slot is not available");
        }

        const paymentExpiry = new Date(Date.now() + 5 * 60 * 1000);

        return await this.appointmentRepository.createAppointment({
            patient_id: patient.id,
            doctor_id,
            appointment_date,
            start_time,
            end_time,
            consultation_type,
            reason,
            status: "pending_payment",
            payment_expires_at: paymentExpiry
        });
    }

    async joinConsultation(appointmentId: number, profileId: number, role: string) {
        const appointment = await this.appointmentRepository.getAppointmentById(appointmentId);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (appointment.status !== "confirmed") {
            throw new Error("Appointment is not confirmed");
        }

        if (role === "doctor") {
            if (appointment.doctor_id !== profileId) {
                throw new Error("Unauthorized doctor");
            }
        }

        if (role === "patient") {
            if (appointment.patient_id !== profileId) {
                throw new Error("Unauthorized patient");
            }
        }
        if (!appointment.meeting_room) {
            throw new Error("Meeting room not found");
        }

        if (appointment.consultation_status === "completed") {
            throw new Error("Consultation already completed");
        }

        if (appointment.consultation_status === "missed") {
            throw new Error("Consultation has expired");
        }

        const appointmentDateTime = new Date(
            `${appointment.appointment_date}T${appointment.start_time}`
        );

        const joinAllowedTime = new Date(
            appointmentDateTime.getTime() - 10 * 60 * 1000
        );

        const now = new Date();

        if (now < joinAllowedTime) {
            throw new Error(
                "Meeting can only be joined 10 minutes before the appointment"
            );
        }
        const appointmentEndDateTime = new Date(
            `${appointment.appointment_date}T${appointment.end_time}`
        );

        if (now > appointmentEndDateTime) {
            throw new Error("Consultation has already ended");
        }

        return {
            appointment_id: appointment.id,
            meeting_room: appointment.meeting_room,
            consultation_status: appointment.consultation_status
        };
    }

    async getAllAppointments(
        page: number,
        limit: number,
        patientName?: string,
        doctorName?: string,
        consultationStatus?: string,
        month?: number,
        year?: number
    ) {
        const result = await this.appointmentRepository.getAllAppointments(
            page,
            limit,
            patientName,
            doctorName,
            consultationStatus,
            month,
            year
        );

        const appointments = result.rows.map((appointment: any) => ({
            id: appointment.id,
            appointment_date: appointment.appointment_date,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            status: appointment.status,
            reason: appointment.reason,
            payment_status: appointment.payment?.status ?? null,
            consultation_Status: appointment.consultation_status,

            patient: {
                id: appointment.patient?.id,
                name: appointment.patient?.user?.name,
                email: appointment.patient?.user?.email,
                gender: appointment.patient?.user?.gender
            },

            doctor: {
                id: appointment.doctor?.id,
                name: appointment.doctor?.user?.name,
                email: appointment.doctor?.user?.email,
                profile_picture: appointment.doctor?.user?.profile_picture,
                specialization: appointment.doctor?.specialization,
                consultation_fee: appointment.doctor?.consultation_fee,
                experience_years: appointment.doctor?.experience_years
            }
        }));

        return this.buildPaginationResponse(
            result,
            page,
            limit,
            appointments
        );
    }

    async getDoctorAppointments(
        doctorUserId: number,
        page: number,
        limit: number,
        patientName?: string,
        month?: number,
        year?: number,
        consultationFilter?: string
    ) {
        const doctor = await this.doctorRepository.getDoctorByUserId(doctorUserId);

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        const result = await this.appointmentRepository.getDoctorAppointments(
            doctor.id,
            page,
            limit,
            patientName,
            month,
            year,
            consultationFilter
        );

        const appointments = result.rows.map((appointment: any) => ({
            id: appointment.id,
            appointment_date: appointment.appointment_date,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            status: appointment.status,
            reason: appointment.reason,
            meeting_room: appointment.meeting_room,
            consultation_status: appointment.consultation_status,

            patient: {
                id: appointment.patient?.id,
                name: appointment.patient?.user?.name,
                email: appointment.patient?.user?.email,
                gender: appointment.patient?.user?.gender
            }
        }));

        return this.buildPaginationResponse(result, page, limit, appointments);
    }

    async getPatientAppointments(
        patientUserId: number,
        page: number,
        limit: number,
        doctorName?: string,
        month?: number,
        year?: number,
        consultationFilter?: string
    ) {
        const patient = await this.patientRepository.getPatientByUserId(patientUserId);

        if (!patient) {
            throw new Error("Patient not found");
        }

        const result = await this.appointmentRepository.getPatientAppointments(
            patient.id,
            page,
            limit,
            doctorName,
            month,
            year,
            consultationFilter
        );

        const appointments = result.rows.map((appointment: any) => ({
            id: appointment.id,
            appointment_date: appointment.appointment_date,
            start_time: appointment.start_time,
            end_time: appointment.end_time,
            status: appointment.status,
            reason: appointment.reason,
            meeting_room: appointment.meeting_room,
            consultation_status: appointment.consultation_status,

            doctor: {
                id: appointment.doctor?.id,
                name: appointment.doctor?.user?.name,
                email: appointment.doctor?.user?.email,
                profile_picture: appointment.doctor?.user?.profile_picture,
                specialization: appointment.doctor?.specialization,
                consultation_fee: appointment.doctor?.consultation_fee,
                experience_years: appointment.doctor?.experience_years
            }
        }));

        return this.buildPaginationResponse(result, page, limit, appointments);
    }

    async getAppointmentDetails(id: number) {
        const appointment = await this.appointmentRepository.getAppointmentDetails(id);

        if (!appointment) {
            throw new Error("Appointment not found");
        }
        return appointment;
    }

    async cancelAppointment(appointmentId: number, profileId: number, role: string) {
        const appointment = await this.appointmentRepository
            .getAppointmentById(appointmentId);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (appointment.status === "cancelled") {
            throw new Error("Appointment already cancelled");
        }

        if (appointment.status === "completed") {
            throw new Error("Completed appointment cannot be cancelled");
        }

        if (role === "doctor" && appointment.doctor_id !== profileId) {
            throw new Error("Unauthorized doctor");
        }

        if (role === "patient" && appointment.patient_id !== profileId) {
            throw new Error("Unauthorized patient");
        }

        const payment = await this.paymentRepository.getByAppointmentId(appointment.id);

        await this.appointmentRepository.cancelAppointment(appointment.id);

        if (payment && payment.status === "paid") {
            await this.paymentRepository.markRefunded(appointment.id);

            return {
                appointment_id: appointment.id,
                appointment_status: "cancelled",
                payment_status: "refunded",
                refund_message: "Refund successful. Amount will be returned to patient account."
            };
        }

        return {
            appointment_id: appointment.id,
            appointment_status: "cancelled",
            payment_status: payment?.status ?? null
        };
    }

    async startConsultation(appointmentId: number, doctorId: number) {
        const appointment = await this.appointmentRepository.getAppointmentById(appointmentId);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (appointment.doctor_id !== doctorId) {
            throw new Error("Unauthorized");
        }

        if (appointment.status !== "confirmed") {
            throw new Error("Appointment is not confirmed");
        }

        if (appointment.consultation_status === "ongoing") {
            throw new Error("Consultation already started");
        }

        if (appointment.consultation_status === "completed") {
            throw new Error("Consultation already completed");
        }

        if (appointment.consultation_status === "missed") {
            throw new Error("Consultation has expired");
        }
        const appointmentStartTime = new Date(
            `${appointment.appointment_date}T${appointment.start_time}`
        );

        const appointmentEndTime = new Date(
            `${appointment.appointment_date}T${appointment.end_time}`
        );

        const startAllowedTime = new Date(
            appointmentStartTime.getTime() - 10 * 60 * 1000
        );
        const now = new Date();

        if (now < startAllowedTime) {
            throw new Error(
                "Consultation can only be started 10 minutes before appointment"
            );
        }

        if (now > appointmentEndTime) {
            throw new Error("Consultation time has already expired");
        }

        await this.appointmentRepository.markConsultationStarted(appointmentId);

        return {
            message: "Consultation started"
        };
    }

    async completeConsultation(appointmentId: number, doctorId: number) {
        const appointment = await this.appointmentRepository.getAppointmentById(appointmentId);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (appointment.doctor_id !== doctorId) {
            throw new Error("Unauthorized");
        }
        // const appointmentEndTime = new Date(
        //     `${appointment.appointment_date}T${appointment.end_time}`
        // );

        // const now = new Date();
        // if (now < appointmentEndTime) {
        //     throw new Error(
        //         "Consultation can only be completed after slot end time"
        //     );
        // }
        if (appointment.consultation_status !== "ongoing") {
            throw new Error(
                "Video consultation has not started yet"
            );
        }
        await this.appointmentRepository.completeConsultation(appointmentId);

        return {
            message: "Consultation completed"
        };
    }

    async expireMissedConsultations() {
        await this.appointmentRepository.markMissedConsultations();
        return {
            success: true
        };
    }

}