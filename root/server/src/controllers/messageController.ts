import { Request, Response, NextFunction } from 'express';
import { messageService } from '../service/messageService';

export class MessageController {

    async sendMessage(req: Request, res: Response, next: NextFunction) {

        try {
            const { senderId, chatId, payload, createdAt } = req.body
            const lastSentMessageId = await messageService.sendMessage(senderId, chatId, payload, createdAt)
            return res.json(lastSentMessageId)
        } catch (e) {
            next(e)
        }
        
    }

    async getMessageById(req: Request, res: Response, next: NextFunction) {
        try {
            const messageId  = req.params['message_id']
            const message = await messageService.getMessageById(parseInt(messageId))
            return res.json(message)
        } catch (e) {
            next(e)
        }
    }

    async getMessages(req: Request, res: Response, next: NextFunction) {
        try {
            const chatId  = req.params['chat_id']
            console.log('chatId ', chatId)
            const messages = await messageService.getMessages(parseInt(chatId))
            return res.json(messages)
        } catch (e) {
            next(e)
        }
    }

}   