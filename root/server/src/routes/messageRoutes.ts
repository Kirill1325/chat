import { Router } from "express";
import { MessageController } from "../controllers/messageController";

export const messageRouter = Router();

const messageController = new MessageController();

messageRouter.post('/send', messageController.sendMessage)
messageRouter.get('/get-message-by-id/:message_id', messageController.getMessageById)
messageRouter.get('/get-messages/:chat_id', messageController.getMessages)