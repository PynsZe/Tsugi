import type {Request, Response} from "express"
import {NextFunction} from "express";
import {loginUser, registerUser} from "../services/auth.service";
import {LoginSchema, RegisterSchema} from "../schema/auth.schema";


export async function register(req: Request, res: Response, next: NextFunction) {
	const userInfo = req.body
	console.log(userInfo)
	try {
		await registerUser(userInfo)
		res.status(201).json({ok: true})
	} catch (error) {
		next(error);
	}
}

export async function login(req: Request, res: Response, next: NextFunction) {
	const userInfo = req.body
	try {
		const token = await loginUser(userInfo)
		return res.status(201).json(token)
	} catch (error) {
		next(error);
	}
}

export function me(req: Request, res: Response) {
	if (!req.user) {
		return res.status(401).json({error: "UNAUTHORIZED"})
	}
	return res.json({sub: req.user.sub, email: req.user.email, username: req.user.username})
}

/** ----------------- FOR TESTS --------------------- */

export function test(req: Request, res: Response) {
	res.json({server: "auth", status: "ok"})
}
