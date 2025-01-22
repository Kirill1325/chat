import { Router } from "express";
import { AuthController } from "../auth/authController";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post('/registration', authController.registration)
authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)
authRouter.post('/refresh', authController.refresh)
authRouter.post('/change-password', authController.changePassword)
