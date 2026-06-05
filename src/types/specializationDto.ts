export interface CreateSpecializationDTO {
    name: string;
    description?: string;
}

export interface UpdateSpecializationDTO {
    name?: string;
    description?: string;
}

export interface SpecializationQueryDTO {
    page: number;
    limit: number;
    search?: string;
}