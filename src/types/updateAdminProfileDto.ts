export interface UpdateAdminProfileDTO {
    name?: string;
    phone_number?: string;
    gender?: "Male" | "Female" | "Others";
    profile_picture?: string;
    old_password?: string;
    new_password?: string;
    confirm_password?: string;
}