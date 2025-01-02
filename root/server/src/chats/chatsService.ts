import { pool } from "../config/dbConfig"
import { UserDto } from "../user/userDto"
import { Message } from "../messages/types"
import { Chat, ChatMember } from "./types"

export enum ChatTypes {
    dm = 'dm',
    group = 'group'
}

// TODO: make back return everything in camelCase
class chatsService {

    async createChat(creatorId: number, type: ChatTypes): Promise<{ chatId: number }> {

        const chatId: number = (await pool.query('INSERT INTO chats (type) VALUES ($1) RETURNING chat_id;', [type])).rows[0].chat_id

        await pool.query('INSERT INTO chat_members (chat_id, user_id) VALUES ($1, $2);', [chatId, creatorId])

        return { chatId: chatId }
    }

    async connectToDm(senderId: number, recipientId: number): Promise<{ chatId: number, members: UserDto[] }> {

        const chatCandidate: { chat_id: number } = (await pool
            .query(`
            SELECT chat_id 
            FROM chat_members 
            WHERE user_id IN ($1, $2)
            GROUP BY chat_id 
            HAVING COUNT(DISTINCT user_id) = 2;
            `, [senderId, recipientId]))
            .rows[0]


        if (chatCandidate) {
            const usersIds: number[] = (await pool
                .query('SELECT * FROM chat_members WHERE chat_id = $1;', [chatCandidate.chat_id]))
                .rows.map((user: { user_id: number }) => user.user_id)

            const users = (await pool.query('SELECT * FROM users WHERE id = ANY($1::int[])', [usersIds]))
                .rows.map((user: any) => new UserDto(user))

            return { chatId: chatCandidate.chat_id, members: users }
        }

        const chatId: number = (await pool.query('INSERT INTO chats (type) VALUES ($1) RETURNING chat_id;', ['dm'])).rows[0].chat_id

        await pool.query('INSERT INTO chat_members (chat_id, user_id) VALUES ($1, $2);', [chatId, recipientId])
        await pool.query('INSERT INTO chat_members (chat_id, user_id) VALUES ($1, $2);', [chatId, senderId])

        const users = (await pool
            .query('SELECT * FROM users WHERE id = ANY($1::int[])', [[senderId, recipientId]]))
            .rows.map((user: any) => new UserDto(user))

        return { chatId: chatId, members: users }

    }

    async getChats(userId: number): Promise<{ chatId: number, members: UserDto[] }[]> {

        const query = `
            SELECT 
                cm.chat_id,
                json_agg(json_build_object('email', u.email, 'username', u.username, 'id', u.id)) AS members
            FROM 
                chat_members cm
            JOIN 
                users u ON cm.user_id = u.id
            WHERE 
                cm.chat_id IN (
                    SELECT DISTINCT chat_id 
                    FROM chat_members 
                    WHERE user_id = $1
                )
            GROUP BY 
                cm.chat_id
        `

        const result: { chat_id: number, members: any[] }[] = (await pool.query(query, [userId])).rows

        // console.log('result', result)

        const chats = result.map(row => ({
            chatId: row.chat_id,
            members: row.members.map((member: any) => new UserDto(member)),
        }))

        // console.log('chats', chats)

        return chats
    }

    async getLastMessage(chatId: number): Promise<string> {

        const lastMessageId: number = (await pool.query('SELECT last_sent_message_id FROM chats WHERE chat_id = $1', [chatId]))
            .rows[0].last_sent_message_id


        if (lastMessageId === null) {
            return ''
        }
        const result = (await pool.query('SELECT * FROM messages WHERE message_id = $1', [lastMessageId])).rows[0]

        const lastMessage = result as Message

        return lastMessage.payload
    }

    async getLastUser(chatId: number): Promise<string> {

        const lastUserId: number = (await pool.query('SELECT last_sent_user_id FROM chats WHERE chat_id = $1', [chatId]))
            .rows[0].last_sent_user_id

        if (lastUserId === null) {
            return ''
        }
        const result = (await pool.query('SELECT * FROM users WHERE id = $1', [lastUserId])).rows[0]

        const lastUser = new UserDto(result)
        return lastUser.username
    }

}

export default new chatsService()

