
import { DoctorRepository } from "../doctors/doctorRepository.js";
import { SpecialAvailabilityRepository } from "./specialAvailabilityRepository.js";
import type { CreateSpecialAvailabilityDto, UpdateSpecialAvailabilityDto } from "../../types/specialAvailabilityTypes.js";

export class SpecialAvailabilityService {
    constructor(
        private specialAvailabilityRepository: SpecialAvailabilityRepository,
        private doctorRepository: DoctorRepository
    ) { }

    private isTimeOverlapping(
        newStart: string,
        newEnd: string,
        existingStart: string,
        existingEnd: string
    ) {

        return newStart < existingEnd && newEnd > existingStart;
    }

    private async validateDoctor(doctorId: number) {
        const doctor = await this.doctorRepository.getDoctorById(doctorId);

        if (!doctor) {
            throw new Error("Doctor not found");
        }
        return doctor;
    }

    async createSpecialAvailability(doctorId: number, data: CreateSpecialAvailabilityDto) {

        await this.validateDoctor(doctorId);

        if (data.start_time >= data.end_time) {
            throw new Error(
                "Start time must be less than end time"
            );
        }

        const existingSpecialAvailabilities = await this.specialAvailabilityRepository
            .getSpecialAvailabilityByDate(doctorId, data.date);

        for (const availability of existingSpecialAvailabilities) {
            const isOverlapping = this.isTimeOverlapping(
                data.start_time,
                data.end_time,
                availability.start_time,
                availability.end_time
            );

            if (isOverlapping) {
                throw new Error(
                    "Special availability timing overlaps with existing special availability"
                );
            }
        }

        return await this.specialAvailabilityRepository.createSpecialAvailability({
            doctor_id: doctorId,
            ...data
        });
    }

    async getDoctorSpecialAvailabilities(doctorId: number) {

        await this.validateDoctor(doctorId);

        return await this.specialAvailabilityRepository
            .getDoctorSpecialAvailabilities(doctorId);
    }

    async getSpecialAvailabilityById(id: number) {
        const specialAvailability = await this.specialAvailabilityRepository
            .getSpecialAvailabilityById(id);

        if (!specialAvailability) {
            throw new Error(
                "Special availability not found"
            );
        }
        return specialAvailability;
    }

    async updateSpecialAvailability(
        doctorId: number,
        specialAvailabilityId: number,
        data: UpdateSpecialAvailabilityDto
    ) {
        await this.validateDoctor(doctorId);

        const specialAvailability = await this.specialAvailabilityRepository
            .getSpecialAvailabilityById(specialAvailabilityId);

        if (!specialAvailability) {
            throw new Error(
                "Special availability not found"
            );
        }

        const startTime = data.start_time || specialAvailability.start_time;
        const endTime = data.end_time || specialAvailability.end_time;
        const date = data.date || specialAvailability.date;

        if (startTime >= endTime) {
            throw new Error(
                "Start time must be less than end time"
            );
        }

        const existingSpecialAvailabilities = await this.specialAvailabilityRepository
            .getSpecialAvailabilityByDate(doctorId, date);

        for (const existing of existingSpecialAvailabilities) {

            if (existing.id === specialAvailabilityId) {
                continue;
            }
            const isOverlapping = this.isTimeOverlapping(
                startTime,
                endTime,
                existing.start_time,
                existing.end_time
            );

            if (isOverlapping) {
                throw new Error(
                    "Special availability timing overlaps with existing special availability"
                );
            }
        }
        return await this.specialAvailabilityRepository.updateSpecialAvailability(
            specialAvailabilityId,
            data
        );
    }

    async deleteSpecialAvailability(doctorId: number, specialAvailabilityId: number) {

        await this.validateDoctor(doctorId);

        const specialAvailability = await this.specialAvailabilityRepository
            .getSpecialAvailabilityById(specialAvailabilityId);

        if (!specialAvailability) {
            throw new Error(
                "Special availability not found"
            );
        }

        await this.specialAvailabilityRepository.deleteSpecialAvailability(specialAvailabilityId);
        return;
    }
}