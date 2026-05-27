import { DoctorRepository } from "../doctors/doctorRepository.js";
import { DoctorUnavailabilityRepository } from "./unavailabilityRepository.js";

export class DoctorUnavailabilityService {

    constructor(
        private doctorUnavailabilityRepository: DoctorUnavailabilityRepository,
        private doctorRepository: DoctorRepository
    ) { }

    private isTimeOverlapping(
        newStart: string,
        newEnd: string,
        existingStart: string,
        existingEnd: string
    ) {

        return newStart < existingEnd &&
            newEnd > existingStart;
    }

    async createUnavailability(
        doctorId: number,
        data: any
    ) {

        const doctor = await this.doctorRepository.getDoctorById(doctorId);
        if (!doctor) {
            throw new Error("Doctor not found");
        }

        if (!data.unavailable_date) {
            throw new Error("Unavailable date is required");
        }
        if (!data.is_full_day) {
            if (!data.start_time || !data.end_time) {
                throw new Error(
                    "Start time and end time are required"
                );
            }

            if (data.start_time >= data.end_time) {
                throw new Error(
                    "Start time must be less than end time"
                );
            }
        }

        const existingUnavailabilities = await this.doctorUnavailabilityRepository
            .getDoctorUnavailabilityByDate(doctorId, data.unavailable_date);

        for (const unavailability of existingUnavailabilities) {
            if (unavailability.is_full_day) {
                throw new Error(
                    "Doctor already unavailable for full day"
                );
            }

            if (data.is_full_day) {
                throw new Error(
                    "Partial unavailability already exists on this day"
                );
            }

            const isOverlapping = this.isTimeOverlapping(
                data.start_time,
                data.end_time,
                unavailability.start_time!,
                unavailability.end_time!
            );

            if (isOverlapping) {
                throw new Error(
                    "Unavailability timing overlaps with existing unavailability"
                );
            }
        }

        return await this.doctorUnavailabilityRepository
            .createUnavailability({ doctor_id: doctorId, ...data });
    }

    async getDoctorUnavailabilities(doctorId: number) {
        const doctor = await this.doctorRepository.getDoctorById(doctorId);
        if (!doctor) {
            throw new Error("Doctor not found");
        }
        return await this.doctorUnavailabilityRepository
            .getDoctorUnavailabilities(doctorId);
    }

    async getDoctorUnavailabilityById(id: number) {

        const unavailability = await this.doctorUnavailabilityRepository
            .getDoctorUnavailabilityById(id);

        if (!unavailability) {
            throw new Error(
                "Unavailability not found"
            );
        }
        return unavailability;
    }

    async updateUnavailability(
        doctorId: number,
        unavailabilityId: number,
        data: any
    ) {

        const doctor = await this.doctorRepository.getDoctorById(doctorId);

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        const unavailability = await this.doctorUnavailabilityRepository
            .getDoctorUnavailabilityById(unavailabilityId);

        if (!unavailability) {
            throw new Error(
                "Unavailability not found"
            );
        }

        const isFullDay = data.is_full_day ?? unavailability.is_full_day;
        const startTime = data.start_time || unavailability.start_time;
        const endTime = data.end_time || unavailability.end_time;

        const unavailableDate = data.unavailable_date || unavailability.unavailable_date;

        if (!isFullDay) {
            if (
                !startTime ||
                !endTime
            ) {
                throw new Error(
                    "Start time and end time are required"
                );
            }

            if (startTime >= endTime) {
                throw new Error(
                    "Start time must be less than end time"
                );
            }
        }

        const existingUnavailabilities = await this.doctorUnavailabilityRepository
            .getDoctorUnavailabilityByDate(doctorId, unavailableDate);

        for (const existing of existingUnavailabilities) {

            if (existing.id === unavailabilityId) {
                continue;
            }
            if (existing.is_full_day || isFullDay) {
                throw new Error(
                    "Full-day unavailability conflict exists"
                );
            }

            const isOverlapping = this.isTimeOverlapping(
                startTime,
                endTime,
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
            .updateUnavailability(unavailabilityId, data);
    }

    async deleteUnavailability(doctorId: number, unavailabilityId: number) {

        const doctor = await this.doctorRepository.getDoctorById(doctorId);

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        const unavailability = await this.doctorUnavailabilityRepository
            .getDoctorUnavailabilityById(unavailabilityId);

        if (!unavailability) {
            throw new Error(
                "Unavailability not found"
            );
        }
        await this.doctorUnavailabilityRepository
            .deleteUnavailability(unavailabilityId);
        return;
    }
}