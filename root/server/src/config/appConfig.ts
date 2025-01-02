import path from 'path';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from '../middleware/errorMiddleware';
import { authRouter } from '../auth/authRoutes';
import { DefaultEventsMap, Server } from 'socket.io';
import { UserDto } from '../user/userDto';

export const configureServer = (app: Application) => {

    app
        .use(cookieParser())
        .use(cors<Request>({ credentials: true, origin: process.env.CLIENT_URL }))
        .use(express.json())
        .use('/auth', authRouter)
        .use(errorMiddleware)
        .get('/', (req, res: Response, next) => {
            res.send('working');
        })

}

export const configureSocketServer = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {

    io
        .use((socket, next) => {
            const id: number = socket.handshake.auth.id
            if (id) {
                socket.data.id = id
                next();
            } else {
                next(new Error('Authentication error'));
            }
        })
}