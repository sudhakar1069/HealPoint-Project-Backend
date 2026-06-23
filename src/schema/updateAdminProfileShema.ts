import z from "zod/v3";

export const updateAdminProfileSchema = z.object({
    name: z.string().min(2).optional(),
    phone_number: z.string().length(10).optional(),
    gender: z.enum(["Male", "Female", "Others"]).optional(),
    profile_picture: z.string().optional(),

    old_password: z.string().min(6).optional(),
    new_password: z.string().min(6).optional(),
    confirm_password: z.string().min(6).optional(),
});