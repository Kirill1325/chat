import jwt from 'jsonwebtoken'
import { pool } from '../config/dbConfig'
import { QueryResult } from 'pg'

interface TokenData {
    email: string
    id: number
}

class TokenService {
    async generateTokens(payload: TokenData) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
        return { accessToken, refreshToken }
    }

    async saveToken(userId: number, refreshToken: string) {
        const tokenData = await pool.query('SELECT * FROM token WHERE user_id = $1', [userId])
        let token: QueryResult<any>
        if (tokenData.rows.length > 0) {
            token = await pool.query('UPDATE token SET refresh_token = $1 WHERE user_id = $2', [refreshToken, userId])
        } else {
            token = await pool.query('INSERT INTO token (user_id, refresh_token) VALUES ($1, $2)', [userId, refreshToken])
        }

        return token
    }

    async removeToken(refreshToken: string) {
        await pool.query('DELETE FROM token WHERE refresh_token = $1', [refreshToken])
    }

    async findToken(refreshToken: string): Promise<{token_id: number, user_id: number, refresh_token: string}> {
        const tokenData = await pool.query('SELECT * FROM token WHERE refresh_token = $1', [refreshToken])
        return tokenData as unknown as {token_id: number, user_id: number, refresh_token: string}
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