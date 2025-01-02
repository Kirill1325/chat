import { pool } from "../config/dbConfig"
import { UserStatus } from "./types"
import { UserDto } from "./userDto"

class UserService {

    async getUsers(searchQuery?: string) {
        const users: Omit<UserDto, 'email'>[] = (await pool.query('SELECT id, username, status FROM users')).rows
        if (searchQuery !== undefined) {
            return (searchQuery.length > 0
                ? users.filter(user => user.username.toLowerCase().match(searchQuery.toLowerCase()))
                : users
            )
        }
    } //TODO: remove from auth

    async changeStatusToOnline(id: number[]) {
        await pool.query('UPDATE users SET status = $1 WHERE id = $2', [UserStatus.online, id])
    }

    async changeStatusToOffline(id: number[]) {
        await pool.query('UPDATE users SET status = $1 WHERE id = $2', [UserStatus.offline, id])
    }

}

export const userService = new UserService()