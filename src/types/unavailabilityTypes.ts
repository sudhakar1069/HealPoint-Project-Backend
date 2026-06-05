
export interface CreateUnavailabilityDto {
    unavailable_date: string;
    is_full_day: boolean;
    start_time?: string;
    end_time?: string;
    reason?: string;
}

export interface UpdateUnavailabilityDto {
    unavailable_date?: string;
    is_full_day?: boolean;
    start_time?: string;
    end_time?: string;
    reason?: string;
}