import jwt from 'jsonwebtoken'
import { pool } from '../config/dbConfig'
import { FieldPacket, QueryResult } from 'mysql2'

interface TokenData {
    email: string
    id: string
    isActivated: boolean
}

// TODO: add injection defence

class TokenService {
    async generateTokens(payload: TokenData) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
        return { accessToken, refreshToken }
    }

    async saveToken(userId: number, refreshToken: string) {
        const tokenData = await pool.query('SELECT * FROM token WHERE user_id = ?', [userId])
        let token: [QueryResult, FieldPacket[]]
        if (tokenData[0].constructor === Array && tokenData[0].length > 0) {
            token = await pool.query('UPDATE token SET refresh_token = ? WHERE user_id = ?', [refreshToken, userId])
        } else {
            token = await pool.query('INSERT INTO token (user_id, refresh_token) VALUES (?, ?)', [userId, refreshToken])
        }

        return token
    }

    async removeToken(refreshToken: string) {
        await pool.query('DELETE FROM token WHERE refresh_token = ?', [refreshToken])
    }

    async findToken(refreshToken: string) {
        const tokenData = await pool.query('SELECT * FROM token WHERE refresh_token = ?', [refreshToken])
        return tokenData
    }

    validateRefreshToken(refreshToken: string) {
        try {
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
            return userData as TokenData
        } catch (e) {
            return null
        }
    }

    validateAccessToken(accessToken: string) {
        try {
            const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

}


export const tokenService = new TokenService()