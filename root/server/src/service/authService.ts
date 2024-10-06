import { pool } from "../config/dbConfig";
import bcrypt from 'bcrypt'
import { tokenService } from "./tokenService";
import { ApiError } from "../exceptions/apiError";
import { UserDto } from "../dtos/userDto";

class AuthService {

    async registration(username: string, email: string, password: string) {

        if (!username || !email || !password) {
            throw ApiError.BadRequest('Username, email and password are required')
        }

        const mailCandidate = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        const usernameCandidate = await pool.query('SELECT * FROM users WHERE username = ?', [username])

        if (mailCandidate[0].constructor === Array && mailCandidate[0].length > 0) {
            throw ApiError.BadRequest('User with this email already exists')
        }
        if (usernameCandidate[0].constructor === Array && usernameCandidate[0].length > 0) {
            throw ApiError.BadRequest('This username already exists')
        }

        const hashPassword = await bcrypt.hash(password, 12)

        await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashPassword])

        const user = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        const userDto = new UserDto(user[0][0])
        const tokens = await tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(user[0][0].id, tokens.refreshToken)

        return {
            ...tokens,
            user: { ...userDto }
        }
    }

    async login(email: string, password: string) {

        if (!email || !password) {
            throw ApiError.BadRequest('Email and password are required')
        }

        const user = await pool.query('SELECT * FROM users WHERE email = ?', [email])

        if (user[0].constructor === Array && user[0].length === 0) {
            throw ApiError.BadRequest('User not found')
        }

        const userDto = new UserDto(user[0][0])

        const isPasswordEquals = await bcrypt.compare(password, user[0][0].password)

        if (!isPasswordEquals) {
            throw ApiError.BadRequest('Password is wrong')
        }

        const tokens = await tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(user[0][0].id, tokens.refreshToken)

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

        const user = await pool.query('SELECT * FROM users WHERE id = ?', [userData.id])
        const userDto = new UserDto(user[0][0])
        const tokens = await tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(user[0][0].id, tokens.refreshToken)

        return {
            ...tokens,
            user: { ...userDto }
        }
    }

    async getUsers() {

        const users = await pool.query('SELECT * FROM users')

        return users[0][0]
    }

    async changePassword(oldPassword: string, newPassword: string, refreshToken: string) {

        console.log('refreshToken ', refreshToken)
        console.log('newPassword ', newPassword)
        console.log('oldPassword ', oldPassword)

        const userData = tokenService.validateRefreshToken(refreshToken)
        console.log('userData ', userData)

        const user = await pool.query('SELECT * FROM users WHERE email = ?', [userData.email])
        console.log('user ', user[0][0])

        const isPasswordEquals = await bcrypt.compare(oldPassword, user[0][0].password)

        if (!isPasswordEquals) {
            throw ApiError.BadRequest('Password is wrong')
        }

        const hashPassword = await bcrypt.hash(newPassword, 12)

        const tokenFromDb = await tokenService.findToken(refreshToken)


        if (!userData || !tokenFromDb) {
            throw ApiError.BadRequest("Something went wrong... Maybe you're not authorized")
        }

        await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashPassword, userData.email])

        const userDto = new UserDto(user[0][0])

        const tokens = await tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(user[0][0].id, tokens.refreshToken)

        return {
            ...tokens,
            user: { ...userDto }
        }
    }

}

export const authService = new AuthService()