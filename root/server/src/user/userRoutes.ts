import { Router } from "express";
import { UserController } from "./userController";

export const userRouter = Router();

const userController = new UserController();

userRouter.post('/upload-profile-pic', userController.uploadProfilePic)
userRouter.get('/profile-pic/:userId', userController.getProfilePic)
