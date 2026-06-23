import { DoctorRepository } from "../doctors/doctorRepository.js";
import { DoctorUnavailabilityRepository } from "./unavailabilityRepository.js";
import { AppointmentRepository } from "../appointments/appointmentRepository.js";
import type { CreateUnavailabilityDto } from "../../types/unavailabilityTypes.js";
export class DoctorUnavailabilityService {
    constructor(
        private doctorUnavailabilityRepository: DoctorUnavailabilityRepository,
        private doctorRepository: DoctorRepository,
        private appointmentRepository: AppointmentRepository
    ) { }

    private isTimeOverlapping(
        newStart: string,
        newEnd: string,
        existingStart: string,
        existingEnd: string
    ) {
        return newStart < existingEnd && newEnd > existingStart;
    }

    private validateTimeRange(
        isFullDay: boolean,
        startTime?: string | null,
        endTime?: string | null
    ) {
        if (isFullDay) return;

        if (!startTime || !endTime) {
            throw new Error("Start time and end time are required");
        }

        if (startTime >= endTime) {
            throw new Error("Start time must be less than end time");
        }
    }

    private async validateDoctor(doctorId: number) {
        const doctor = await this.doctorRepository.getDoctorById(doctorId);

        if (!doctor) {
            throw new Error("Doctor not found");
        }
        return doctor;
    }

    private async validateBookedAppointments(doctorId: number, data: CreateUnavailabilityDto) {
        const appointments = await this.appointmentRepository
            .getBookedAppointmentsByDate(doctorId, data.unavailable_date);

        if (appointments.length === 0) {
            return;
        }

        if (data.is_full_day) {
            throw new Error(
                "You have booked appointments. Please cancel them before marking unavailability"
            );
        }

        for (const appointment of appointments) {
            const isOverlapping = this.isTimeOverlapping(
                data.start_time!,
                data.end_time!,
                appointment.start_time,
                appointment.end_time
            );

            if (isOverlapping) {
                throw new Error(
                    "You have booked appointments during this time. Please cancel them before marking unavailability"
                );
            }
        }
    }

    async createUnavailability(doctorId: number, data: CreateUnavailabilityDto) {
        await this.validateDoctor(doctorId);

        if (!data.unavailable_date) {
            throw new Error("Unavailable date is required");
        }

        this.validateTimeRange(
            data.is_full_day,
            data.start_time,
            data.end_time
        );
        await this.validateBookedAppointments(doctorId, data);

        const existingUnavailabilities = await this.doctorUnavailabilityRepository
            .getDoctorUnavailabilityByDate(doctorId, data.unavailable_date);

        for (const existing of existingUnavailabilities) {
            if (existing.is_full_day) {
                throw new Error(
                    "Doctor already unavailable for full day"
                );
            }
        }

        if (data.is_full_day) {
            if (existingUnavailabilities.length > 0) {
                await this.doctorUnavailabilityRepository
                    .deleteByDoctorAndDate(
                        doctorId,
                        data.unavailable_date
                    );
            }

            return await this.doctorUnavailabilityRepository
                .createUnavailability({
                    doctor_id: doctorId,
                    ...data
                });
        }

        for (const existing of existingUnavailabilities) {
            const isOverlapping = this.isTimeOverlapping(
                data.start_time!,
                data.end_time!,
                existing.start_time!,
                existing.end_time!
            );

            if (isOverlapping) {
                throw new Error(
                    "Unavailability timing overlaps with existing unavailability"
                );
            }
        }

        return await this.doctorUnavailabilityRepository
            .createUnavailability({
                doctor_id: doctorId,
                ...data
            });
    }

    async getDoctorUnavailabilities(doctorId: number) {
        await this.validateDoctor(doctorId);

        return await this.doctorUnavailabilityRepository
            .getDoctorUnavailabilities(doctorId);
    }

    async getDoctorUnavailabilityById(id: number) {
        const unavailability = await this.doctorUnavailabilityRepository
            .getDoctorUnavailabilityById(id);

        if (!unavailability) {
            throw new Error("Unavailability not found");
        }
        return unavailability;
    }

    async deleteUnavailability(doctorId: number, unavailabilityId: number) {
        await this.validateDoctor(doctorId);

        const unavailability = await this.doctorUnavailabilityRepository
            .getDoctorUnavailabilityById(unavailabilityId);

        if (!unavailability) {
            throw new Error("Unavailability not found");
        }

        if (unavailability.doctor_id !== doctorId) {
            throw new Error("Unauthorized access");
        }

        await this.doctorUnavailabilityRepository
            .deleteUnavailability(unavailabilityId);
    }
}