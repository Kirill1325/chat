import { Request, Response, NextFunction } from 'express';
import { authService } from './authService';

export class AuthController {

    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password } = req.body

            const userData = await authService.registration(username, email, password)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: 'none' })

            res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body
            const userData = await authService.login(email, password)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: 'none' })

            res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {

            const { refreshToken } = req.cookies
            await authService.logout(refreshToken)
            res.clearCookie('refreshToken')

            res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            return res.sendStatus(200)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {

            const { refreshToken } = req.cookies
            const userData = await authService.refresh(refreshToken)

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: 'none' })

            res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req: Request, res: Response) {
        try {
            const query = req.query.query as string
            const users = await authService.getUsers(query)
            return res.json(users)
        } catch (e) {
            res.json(e)
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction) {

        // TODO: add mail letter that updates password
        try {

            const { oldPassword, newPassword } = req.body
            const { refreshToken } = req.cookies

            const user = await authService.changePassword(oldPassword, newPassword, refreshToken)

            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async uploadPicture(req: Request, res: Response, next: NextFunction) {
        try {
            const avatar = req.file

            console.log(avatar)

            res.sendStatus(200);
        } catch (e) {
            next(e)
        }
    }

}
