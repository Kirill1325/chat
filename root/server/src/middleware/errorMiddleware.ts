import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../exceptions/apiError';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    if(err instanceof ApiError) {
        return res.status(err.status).send(err.message)
    }
    res.status(err.status || 500).send(err.message)
}