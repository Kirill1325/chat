import { Router } from "express";
import { AuthController } from "../controllers/authController";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post('/registration', authController.registration)
authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)
authRouter.post('/refresh', authController.refresh)
authRouter.get('/users', authController.getUsers)
authRouter.post('/change-password', authController.changePassword)
