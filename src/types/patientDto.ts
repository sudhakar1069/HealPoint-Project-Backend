export interface CreatePatientDTO {
    name: string;
    phone_number: string;
    email: string;
    gender: "Male" | "Female" | "Others";
    password: string;
    dob?: string;
    age?: number;
    blood_group?: string;
    address?: string;
}