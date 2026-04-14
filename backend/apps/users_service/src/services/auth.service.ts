import jwt from "jsonwebtoken"
import config from "../config/config"
import {UserModel} from "../schema/user.schema"
import {tokenType} from "../types/auth.type";
import bcrypt from "bcryptjs";
import {LoginDto, RegisterDto, RegisterSchema, LoginSchema} from "../schema/auth.schema";
import {
	ConflictError,
	InternalServerError,
	NotFoundError,
	UnauthorizedError,
	ValidationError
} from "../../../../packages/shared/errors/errors"


export async function registerUser(userInfo: RegisterDto): Promise<void> {
	const parsed = RegisterSchema.safeParse(userInfo)
	if (!parsed.success) throw new ValidationError("INVALID_INPUT")

	const existEmail = await UserModel.countDocuments({email: userInfo.email.toLowerCase()}) !== 0
	const existUsername = await UserModel.countDocuments({username: userInfo.username.toLowerCase()}) !== 0

	if (existEmail) throw new ConflictError("EMAIL_ALREADY_EXISTS")
	if (existUsername) throw new ConflictError("USERNAME_ALREADY_EXISTS")

	const passwordHash = await bcrypt.hash(userInfo.password, 10)
	try {
		await UserModel.create({
			email: userInfo.email,
			username: userInfo.username,
			passwordHash: passwordHash
		})
	} catch {
		throw new InternalServerError("SERVER_ERROR")
	}
}

export async function loginUser(userInfo: LoginDto): Promise<tokenType> {
	const parsed = LoginSchema.safeParse(userInfo)
	if (!parsed.success) throw new ValidationError("INVALID_INPUT")

	const user = await UserModel.findOne({email: userInfo.email.toLowerCase()})
	if (user === null) {
		throw new NotFoundError("USER_NOT_FOUND")
	}
	const passwordMatch = await bcrypt.compare(userInfo.password, user.passwordHash)
	if (!passwordMatch) {
		throw new UnauthorizedError("PASSWORD_DOES_NOT_MATCH")
	}

	const token = jwt.sign(
		{sub: user._id, email: user.email, username: user.username},
		config.jwtSecret,
		{expiresIn: config.jwtExpiresIn}
	)
	return {
		sub: user._id,
		accessToken: token,
		tokenType: "Bearer",
		expiresIn: config.jwtExpiresIn
	}
}
