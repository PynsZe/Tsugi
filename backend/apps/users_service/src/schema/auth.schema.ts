import {z} from "zod"

export const RegisterSchema = z.object({
    email: z.email(),
    username: z.string(),
    password: z.string().min(6)
})

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export type RegisterDto = z.infer<typeof RegisterSchema>
export type LoginDto = z.infer<typeof LoginSchema>
