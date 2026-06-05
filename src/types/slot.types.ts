export interface DoctorSlot {
    start_time: string;
    end_time: string;
    status: "available" | "booked" | "unavailable";
}