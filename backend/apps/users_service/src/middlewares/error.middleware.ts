import type {NextFunction, Request, Response} from "express"
import {AppError} from "../../../../packages/shared/errors/errors";

export function errorHandler(
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (error instanceof AppError) {
		return res.status(error.status).json({
			error: error.code,
			message: error.message
		});
	}

	console.error(error);
	return res.status(500).json({
		error: "INTERNAL_SERVER_ERROR"
	});
}