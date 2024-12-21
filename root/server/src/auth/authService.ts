import { pool } from "../config/dbConfig";
import bcrypt from 'bcrypt'
import { ApiError } from "../exceptions/apiError";
import { UserDto } from "./userDto";
import { tokenService } from "../token/tokenService";

interface User {
    id: number
    username: string
}

class AuthService {

    async registration(username: string, email: string, password: string) {

        if (!username || !email || !password) {
            throw ApiError.BadRequest('Username, email and password are required')
        }

        const mailCandidate = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        const usernameCandidate = await pool.query('SELECT * FROM users WHERE username = $1', [username])

        if (mailCandidate.rows.length > 0) {
            throw ApiError.BadRequest('User with this email already exists')
        }
        if (usernameCandidate.rows.length > 0) {
            throw ApiError.BadRequest('This username already exists')
        }

        const hashPassword = await bcrypt.hash(password, 12)
        // TODO: add mail activation link

        const user = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashPassword])

        const userDto = new UserDto(user.rows[0])
        const tokens = await tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(user.rows[0].id, tokens.refreshToken)

        return {
            ...tokens,
            user: { ...userDto }
        }
    }

    async login(email: string, password: string) {

        if (!email || !password) {
            throw ApiError.BadRequest('Email and password are required')
        }

        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])

        if (user.rows.length === 0) {
            throw ApiError.BadRequest('User not found')
        }

        const userDto = new UserDto(user.rows[0])

        const isPasswordEquals = await bcrypt.compare(password, user.rows[0].password)

        if (!isPasswordEquals) {
            throw ApiError.BadRequest('Password is wrong')
        }

        const tokens = await tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(user.rows[0].id, tokens.refreshToken)

        return {
            ...tokens,
            user: { ...userDto }
        }
    }

    async logout(refreshToken: string) {
        await tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken: string) {

        if (!refreshToken) {
            throw ApiError.BadRequest('No refresh token')
        }

        const userData = tokenService.validateRefreshToken(refreshToken)

        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.BadRequest('Invalid token')
        }

        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userData.id])
        const userDto = new UserDto(user.rows[0])
        const tokens = await tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(user.rows[0].id, tokens.refreshToken)

        return {
            ...tokens,
            user: { ...userDto }
        }
    }

    async getUsers(searchQuery: string): Promise<User[]> {

        const users = (await pool.query('SELECT * FROM users')).rows

        users.forEach((user) => {
            delete user.password
            delete user.email
            delete user.status
            delete user.role
        })

        if (searchQuery !== undefined) {
            return (searchQuery.length > 0
                ? users.filter(user => user.username.toLowerCase().match(searchQuery.toLowerCase())) as User[]
                : users as User[]
            )
        }
    }

    async changePassword(oldPassword: string, newPassword: string, refreshToken: string) {

        const userData = tokenService.validateRefreshToken(refreshToken)

        const user = await pool.query('SELECT * FROM users WHERE email = $1', [userData.email])

        const isPasswordEquals = await bcrypt.compare(oldPassword, user[0][0].password)

        if (!isPasswordEquals) {
            throw ApiError.BadRequest('Password is wrong')
        }

        const hashPassword = await bcrypt.hash(newPassword, 12)

        const tokenFromDb = await tokenService.findToken(refreshToken)


        if (!userData || !tokenFromDb) {
            throw ApiError.BadRequest("Something went wrong... Maybe you're not authorized")
        }

        await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashPassword, userData.email])

        const userDto = new UserDto(user[0][0])

        const tokens = await tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(user[0][0].id, tokens.refreshToken)

        return {
            ...tokens,
            user: { ...userDto }
        }
    }

    async uploadPicture() {

    }

}

export const authService = new AuthService()