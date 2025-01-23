import path from 'path';
import { pool } from "../config/dbConfig"
import { UserStatus } from "./types"
import { UserDto } from "./userDto"
import { ApiError } from '../exceptions/apiError';

class UserService {

    async getUsers(searchQuery?: string) {
        const users: Omit<UserDto, 'email'>[] = (await pool.query('SELECT id, username, status FROM users')).rows
        if (searchQuery !== undefined) {
            return (searchQuery.length > 0
                ? users.filter(user => user.username.toLowerCase().match(searchQuery.toLowerCase()))
                : users
            )
        }
        return users
    }

    async changeStatusToOnline(id: number[]) {
        await pool.query('UPDATE users SET status = $1 WHERE id = $2', [UserStatus.online, id])
    }

    async changeStatusToOffline(id: number[]) {
        await pool.query('UPDATE users SET status = $1 WHERE id = $2', [UserStatus.offline, id])
    }

    async uploadProfilePic(userId: number, filename: string, filepath: string, mimetype: string, size: number) {
        const checkForPic = (await pool.query('SELECT id FROM profile_pics WHERE user_id=$1', [userId])).rows[0]

        if (checkForPic) {
            const picId = (await pool.query(
                'UPDATE profile_pics SET filename = $1, filepath = $2, mimetype = $3, size = $4 WHERE user_id = $5 RETURNING id',
                [filename, filepath, mimetype, size, userId]
            )).rows[0].id
            await pool.query('UPDATE users SET profile_pic_id = $1 WHERE id = $2', [picId, userId])
        } else {
            const picId = (await pool.query(
                'INSERT INTO profile_pics (filename, filepath, mimetype, size, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [filename, filepath, mimetype, size, userId])
            ).rows[0].id
            await pool.query('UPDATE users SET profile_pic_id = $1 WHERE id = $2', [picId, userId])
        }

    }

    async getProfilePic(userId: string): Promise<{ mimetype: string, fileName: string, filepath: string }> {
        const file: {
            id: number,
            filename: string,
            filepath: string,
            mimetype: string,
            size: number,
            user_id: number
        } = (await pool.query('SELECT * FROM profile_pics WHERE user_id = $1', [userId])).rows[0]

        if (file) {
            const dirname = path.resolve()
            const fullFilePath = path.join(dirname, file.filepath)
            return {
                mimetype: file.mimetype,
                fileName: file.filename,
                filepath: fullFilePath
            }
        }
        throw ApiError.NotFoundError('File not found')
    }

}

export const userService = new UserService()