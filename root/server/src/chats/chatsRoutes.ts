import { Router } from "express";
import { ChatsController } from "../chats/chatsController";

export const chatsRouter = Router();

const chatsController = new ChatsController()

chatsRouter.post('/create', chatsController.createChat)
// chatsRouter.post('/connect', chatsController.connectToChat)
chatsRouter.get('/:user_id', chatsController.getChats)
// chatsRouter.get('/last-message/:chat_id', chatsController.getLastMessage)
// chatsRouter.get('/last-user/:chat_id', chatsController.gelLastUser)