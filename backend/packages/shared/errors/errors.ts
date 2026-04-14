export class AppError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly status: number
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ValidationError extends AppError {
    constructor(message = "Invalid input") {
        super(message, "VALIDATION_ERROR", 400);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(message, "CONFLICT", 409);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Not found") {
        super(message, "NOT_FOUND", 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, "UNAUTHORIZED", 401);
    }
}

export class InternalServerError extends AppError {
    constructor(message = "Internal server error") {
        super(message, "INTERNAL_ERROR", 403);
    }
}