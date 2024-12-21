import { Request, Response, NextFunction } from 'express';
import chatsService from './chatsService';

export class ChatsController {

    async createChat(req: Request, res: Response, next: NextFunction) {
        try {
            const { creatorId, type } = req.body
            const chat = await chatsService.createChat(creatorId, type)
            return res.json(chat)
        } catch (e) {
            next(e)
        }
    }

}
