export interface CreateAvailabilityDTO {
    day_of_week: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    start_time: string;
    end_time: string;
    slot_duration: number;
    break_start?: number | null;
    break_end?: number | null;
    is_active?: boolean;
}

export interface UpdateAvailabilityDTO {
    day_of_week?: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    start_time?: string;
    end_time?: string;
    slot_duration?: number;
    break_start?: number | null;
    break_end?: number | null;
    is_active?: boolean;
}