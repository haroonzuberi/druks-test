import { z } from "zod";
import { USER_ROLE_OWNER, USER_ROLE_REVIEWER } from "../lib/constants";


export const registerSchema = z.object({
    name: z.string()
        .trim()
        .toLowerCase(),
    email: z.string()
        .trim()
        .toLowerCase()
        .email("Enter a valid email address"),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(72, "passord is too long"),
    role: z.enum([USER_ROLE_OWNER, USER_ROLE_REVIEWER], {
        errorMap: () => ({ message: "Choose whether you are a reviewer or an owner" })
    })
});

export const loginSchema = z.object({
    email: z.string()
        .trim()
        .toLowerCase()
        .email("Enter a valid email address"),
    password: z.string().min(1, "Password is Required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>