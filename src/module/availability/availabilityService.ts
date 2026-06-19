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

    async createAvailability(doctorId: number, data: CreateAvailabilityDTO) {

        await this.validateDoctor(doctorId);

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

        await this.validateDoctor(doctorId);
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
        await this.validateDoctor(doctorId);

        const availability =
            await this.doctoravailabilityRepository.getAvailabilityById(availabilityId);

        if (!availability) throw new Error("Availability not found");

        const startTime = data.start_time || availability.start_time;
        const endTime = data.end_time || availability.end_time;

        if (startTime >= endTime)
            throw new Error("Start time must be less than end time")

        return await this.doctoravailabilityRepository.updateAvailability(
            availabilityId,
            data
        );
    }

    async deleteAvailability(doctorId: number, availabilityId: number) {
        
        await this.validateDoctor(doctorId);

        const availability =
            await this.doctoravailabilityRepository.getAvailabilityById(availabilityId);

        if (!availability) throw new Error("Availability not found");

        await this.doctoravailabilityRepository.deleteAvailability(availabilityId);
    }
}