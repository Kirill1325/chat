import { Request, Response, NextFunction } from 'express';
import { userService } from './userService';

export class UserController {

    async uploadProfilePic(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body
            const { filename, mimetype, size } = req.file
            const filepath = req.file.path
            console.log('filepath', filepath)
            await userService.uploadProfilePic(userId, filename, filepath, mimetype, size)
            res.sendStatus(200)
        } catch (e) {
            next(e);
        }
    }

    async getProfilePic(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params
            console.log('userId', userId)
            const file = await userService.getProfilePic(userId)

            return res.type(file.mimetype).sendFile(file.filepath)
        } catch (e) {
            next(e)
        }
    }
}