import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from '../routes/authRoutes';

export const configure = (app: Application) => {

    app
        .use(cookieParser())
        .use(cors<Request>({ credentials: true, origin: process.env.CLIENT_URL }))
        .use(express.json())
        .use('/auth', authRouter)
        // .use(errorMiddleware)
        .get('/', (req, res: Response, next) => {
            res.send('working');
        })

}