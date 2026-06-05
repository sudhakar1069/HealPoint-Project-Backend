import { DoctorRepository } from "../doctors/doctorRepository.js";
import { DoctorAvailabilityRepository } from "./availabilityRepository.js";
import type {
    CreateAvailabilityDTO,
    UpdateAvailabilityDTO
} from "../../types/availabilityDto.js";

export class DoctorAvailabilityService {
    constructor(
        private doctoravailabilityRepository: DoctorAvailabilityRepository,
        private doctorRepository: DoctorRepository
    ) {}

    private isTimeOverlapping(
        newStart: string,
        newEnd: string,
        existingStart: string,
        existingEnd: string
    ) {
        return newStart < existingEnd && newEnd > existingStart;
    }

    async createAvailability(doctorId: number, data: CreateAvailabilityDTO) {
        const doctor = await this.doctorRepository.getDoctorById(doctorId);
        if (!doctor) throw new Error("Doctor not found");

        if (data.start_time >= data.end_time)
            throw new Error("Start time must be less than end time");

        await this.doctoravailabilityRepository.deleteAvailabilityByDoctorAndDay(
            doctorId,
            data.day_of_week
        );

        return await this.doctoravailabilityRepository.createAvailability({
            doctor_id: doctorId,
            ...data
        });
    }

    async getDoctorAvailability(doctorId: number) {
        const doctor = await this.doctorRepository.getDoctorById(doctorId);
        if (!doctor) throw new Error("Doctor not found");

        return await this.doctoravailabilityRepository.getDoctorAvailability(doctorId);
    }

    async getAvailabilityById(id: number) {
        const availability = await this.doctoravailabilityRepository.getAvailabilityById(id);
        if (!availability) throw new Error("Availability not found");

        return availability;
    }

    async updateAvailability(
        doctorId: number,
        availabilityId: number,
        data: UpdateAvailabilityDTO
    ) {
        const doctor = await this.doctorRepository.getDoctorById(doctorId);
        if (!doctor) throw new Error("Doctor not found");

        const availability =
            await this.doctoravailabilityRepository.getAvailabilityById(availabilityId);

        if (!availability) throw new Error("Availability not found");

        const startTime = data.start_time || availability.start_time;
        const endTime = data.end_time || availability.end_time;

        if (startTime >= endTime)
            throw new Error("Start time must be less than end time");

        const existingAvailabilities =
            await this.doctoravailabilityRepository.getAvailabilityByDoctorAndDay(
                doctorId,
                data.day_of_week || availability.day_of_week
            );

        for (const existing of existingAvailabilities) {
            if (existing.id === availabilityId) continue;

            const isOverlapping = this.isTimeOverlapping(
                startTime,
                endTime,
                existing.start_time,
                existing.end_time
            );

            if (isOverlapping)
                throw new Error("Availability timing overlaps with existing availability");
        }

        return await this.doctoravailabilityRepository.updateAvailability(
            availabilityId,
            data as any 
        );
    }

    async deleteAvailability(doctorId: number, availabilityId: number) {
        const doctor = await this.doctorRepository.getDoctorById(doctorId);
        if (!doctor) throw new Error("Doctor not found");

        const availability =
            await this.doctoravailabilityRepository.getAvailabilityById(availabilityId);

        if (!availability) throw new Error("Availability not found");

        await this.doctoravailabilityRepository.deleteAvailability(availabilityId);
    }
}