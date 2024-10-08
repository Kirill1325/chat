import { Router } from "express";
import { ChatsController } from "../controllers/chatsController";

export const chatsRouter = Router();

const chatsController = new ChatsController()

chatsRouter.post('/create', chatsController.createChat)
chatsRouter.post('/connect', chatsController.connectToChat)
chatsRouter.get('/get-chats/:user_id', chatsController.getChats)