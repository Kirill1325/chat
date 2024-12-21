import path from 'path';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from '../middleware/errorMiddleware';
import { authRouter } from '../auth/authRoutes';
import { chatsRouter } from '../chats/chatsRoutes';

export const configure = (app: Application) => {

    app
        .use(cookieParser())
        .use(cors<Request>({ credentials: true, origin: process.env.CLIENT_URL }))
        .use(express.json())
        .use('/auth', authRouter)
        .use('/chats', chatsRouter)
        .use(errorMiddleware)
        .get('/', (req, res: Response, next) => {
            res.send('working');
        })

}