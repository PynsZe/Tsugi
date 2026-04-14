import {z} from "zod";
import ObjectId from "mongoose";
import type {JwtPayload} from "jsonwebtoken"

export interface AuthUser extends JwtPayload {
	sub: string
	email: string
	username: string
}

const tokenSchema = z.object({
	sub: ObjectId,
	accessToken: z.string(),
	tokenType: z.string(),
	expiresIn: undefined,
})

export type tokenType = z.infer<typeof tokenSchema>