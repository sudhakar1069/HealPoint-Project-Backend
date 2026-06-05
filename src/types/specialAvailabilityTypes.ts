export interface CreateSpecialAvailabilityDto {
    date: string;
    start_time: string;
    end_time: string;
    slot_duration: number;
    is_available?: boolean;
    notes?: string;
}

export interface UpdateSpecialAvailabilityDto {
    date?: string;
    start_time?: string;
    end_time?: string;
    is_available?: boolean;
    reason?: string;
}