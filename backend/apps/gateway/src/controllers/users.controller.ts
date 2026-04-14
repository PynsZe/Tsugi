import type {NextFunction, Request, Response} from "express";
import {services} from "../../../../packages/config/config";

export async function handleGetMe(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await fetch(`${services.users}/users/me`, {
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

export async function handlePatchVisibility(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await fetch(`${services.users}/users/me/visibility`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: req.headers.authorization ?? ""
			},
			body: JSON.stringify(req.body)
		});

		const rawBody = await response.text();
		if (!rawBody) {
			return res.sendStatus(response.status);
		}

		const data = JSON.parse(rawBody);
		return res.status(response.status).json(data);
	} catch (error) {
		next(error);
	}
}

export async function handleGetList(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await fetch(`${services.users}/users/me/list`, {
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

export async function handlePatchList(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await fetch(`${services.users}/users/me/list`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: req.headers.authorization ?? ""
			},
			body: JSON.stringify(req.body)
		});

		const data = await response.json();
		return res.status(response.status).json(data);
	} catch (error) {
		next(error);
	}
}

export async function handleDeleteFromList(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await fetch(`${services.users}/users/me/list/${req.params.id}`, {
			method: "DELETE",
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

export async function handleGetFavorites(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await fetch(`${services.users}/users/me/favorites`, {
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

export async function handleAddFavorite(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await fetch(`${services.users}/users/me/favorites/${req.params.id}`, {
			method: "PUT",
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

export async function handleRemoveFavorite(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await fetch(`${services.users}/users/me/favorites/${req.params.id}`, {
			method: "DELETE",
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

export async function handleGetProfileByUsername(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await fetch(`${services.users}/users/profile/${req.params.username}`, {
			method: "GET"
		});

		const data = await response.json();
		return res.status(response.status).json(data);
	} catch (error) {
		next(error);
	}
}

export async function handleGetFavoritesByUsername(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await fetch(`${services.users}/users/profile/${req.params.username}/favorites`, {
			method: "GET"
		});

		const data = await response.json();
		return res.status(response.status).json(data);
	} catch (error) {
		next(error);
	}
}
