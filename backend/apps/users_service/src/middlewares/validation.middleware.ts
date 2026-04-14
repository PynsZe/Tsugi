// src/middleware/validationMiddleware.ts
import {Request, Response, NextFunction} from 'express';
import {z, ZodError, ZodObject} from 'zod';

import {StatusCodes} from 'http-status-codes';

export function validateData(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.message
                res.status(StatusCodes.BAD_REQUEST).json({error: 'Invalid data', details: errorMessages});
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Internal Server Error'});
            }
        }
    };
}

export function validateParams(schema: ZodObject) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            return res.status(400).json({
                error: "INVALID_PARAMS",
                details: result.error.issues.map((issue) => ({
                    path: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        req.params = result.data as typeof req.params;
        next();
    };
}
