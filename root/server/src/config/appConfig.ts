import multer from 'multer';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from '../middleware/errorMiddleware';
import { authRouter } from '../auth/authRoutes';
import { DefaultEventsMap, Server } from 'socket.io';
import { userRouter } from '../user/userRoutes';

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
});

export const configureServer = (app: Application) => {

    app
        .use(cookieParser())
        .use(cors<Request>({ credentials: true, origin: process.env.CLIENT_URL }))
        .use(express.json())
        .use(express.static(__dirname))
        .use(multer({ storage: storageConfig }).single('file'))
        .use('/auth', authRouter)
        .use('/user', userRouter)
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