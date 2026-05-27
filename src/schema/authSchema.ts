import z from "zod/v3";
export const registerSchema = z.object({
    name: z.string().min(2),
    phone_number: z.string().length(10),
    gender: z.enum(["Male", "Female", "Others"]),
    email: z.string().email(),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
});