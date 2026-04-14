import type {NextFunction, Request, Response} from "express";
import {services} from "../../../../packages/config/config";

export async function handleRegister(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await fetch(`${services.users}/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(req.body)
		});

		const data = await response.json();
		return res.status(response.status).json(data);
	} catch (error) {
		next(error);
	}
}

export async function handleLogin(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await fetch(`${services.users}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(req.body)
		});

		const data = await response.json();
		return res.status(response.status).json(data);
	} catch (error) {
		next(error);
	}
}

export async function handleMe(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await fetch(`${services.users}/auth/me`, {
			method: "GET",
			headers: {
				Authorization: req.headers.authorization ?? ""
			}
		});

		const data = await response.json();
		return res.status(response.status).json(data);
	} catch (error) {
		next(error);
	}
}
