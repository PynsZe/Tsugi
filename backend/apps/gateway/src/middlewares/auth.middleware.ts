import type {NextFunction, Request, Response} from "express"
import jwt, {JwtPayload} from "jsonwebtoken"
import config from "../config/config"
import type {AuthUser} from "../types/auth.type"
import {needAuth} from "../../../../packages/config/config";

function isAuthUser(payload: string | JwtPayload): payload is AuthUser {
	return (
		typeof payload !== "string" &&
		typeof payload.sub === "string" &&
		typeof payload.email === "string" &&
		typeof payload.username === "string"
	)
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	if (!needAuth) {
		return next()
	}
	const h = req.headers.authorization

	if (!h?.startsWith("Bearer ")) {
		return res.status(401).json({error: "UNAUTHORIZED"})
	}

	const token = h.slice("Bearer ".length)

	try {
		const decoded = jwt.verify(token, config.jwtSecret)

		if (!isAuthUser(decoded)) {
			return res.status(401).json({error: "INVALID_TOKEN_PAYLOAD"})
		}

		return next()
	} catch {
		return res.status(401).json({error: "INVALID_TOKEN"})
	}
}