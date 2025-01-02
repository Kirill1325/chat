import { Router } from "express";
import { AuthController } from "../auth/authController";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' })

export const authRouter = Router();

const authController = new AuthController();

authRouter.post('/registration', authController.registration)
authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)
authRouter.post('/refresh', authController.refresh)
authRouter.post('/change-password', authController.changePassword)
// authRouter.post('/set-picture', upload.single('avatar'), authController.uploadPicture)
