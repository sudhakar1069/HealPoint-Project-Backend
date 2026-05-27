export interface CreateDoctorDTO {
    name: string;
    phone_number: string;
    email: string;
    gender: "male" | "female" | "others";
    password: string;
    specialization: string;
    education:string;
    experience_years: number;
    consultation_fee: number;
    bio: string;
    available_from: string;
    available_to: string;
}