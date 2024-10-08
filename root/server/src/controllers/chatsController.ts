import { Request, Response, NextFunction } from 'express';
import chatsService from '../service/chatsService';

export class ChatsController {

    async createChat(req: Request, res: Response, next: NextFunction) {
        try {
            const { creatorId } = req.body
            const chat = await chatsService.createChat(creatorId)
            return res.json(chat)
        } catch (e) {
            next(e)
        }
    }

    async connectToChat(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (e) {
            next(e)
        }
    }

    async getChats(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('user id ', req.params['user_id'])
            const userId = req.params['user_id']
            const chats = await chatsService.getChats(parseInt(userId))
            return res.json(chats)
        } catch (e) {
            next(e)
        }
    }
}
