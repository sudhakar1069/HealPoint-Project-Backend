export interface BookAppointmentDto {
    doctor_id: number;
    appointment_date: string;
    start_time: string;
    end_time: string;
    consultation_type: "online" | "offline";
    reason: string;
}