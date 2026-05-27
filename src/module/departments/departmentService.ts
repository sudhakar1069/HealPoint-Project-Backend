import { SpecializationRepository } from "./departmentRepository.js";

export class SpecializationService {
    constructor(private specializationRepository: SpecializationRepository) { }
    
    async createSpecialization(data:any) {
        const existing = await this.specializationRepository.findByName(data.name);
        if (existing) {
            throw new Error("Specialization already exists");
        }
        return await this.specializationRepository.create(data);
    }

    async getAllSpecializations(
        page: number,
        limit: number,
        search: string
    ) {
        return await this.specializationRepository.findAll(
            page,
            limit,
            search
        );
    }

    async getSpecializationById(id: number) {
        const specialization = await this.specializationRepository.findById(id);
        if (!specialization) {
            throw new Error("Specialization not found");
        }
        return specialization;
    }

    async updateSpecialization(id: number, data: any) {
        const specialization = await this.specializationRepository.findById(id);
        if (!specialization) {
            throw new Error("Specialization not found");
        }
        if (data.name) {
            const existing = await this.specializationRepository.findByName(data.name);
            if (existing && existing.id !== id) {
                throw new Error("Specialization name already exists");
            }
        }
        return await this.specializationRepository.update(id, data);
    }

    async deleteSpecialization(id: number) {
     const specialization = await this.specializationRepository.findById(id);
        if (!specialization) {
            throw new Error("Specialization not found");
        }
        await this.specializationRepository.delete(id);
        return {
            message: "Specialization deleted successfully",
        };
    }
}