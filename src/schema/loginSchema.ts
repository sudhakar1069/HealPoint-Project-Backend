import z from "zod/v3";

export const loginSchema = z.object({
    email: z.string().email("invalid email format"),
    password: z.string().min(6)
})