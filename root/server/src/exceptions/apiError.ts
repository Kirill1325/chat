export class ApiError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.status = status
    }

    static BadRequest(message: string) {
        return new ApiError(400, message)
    }

    static UnauthorizedError() {
        return new ApiError(401, 'User is not authorized')
    }

    static NotFoundError(message: string) {
        return new ApiError(404, message)
    }

    static InternalServerError() {
        return new ApiError(500, 'Internal server error')
    }
}

