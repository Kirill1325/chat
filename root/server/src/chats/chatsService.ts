import { pool } from "../config/dbConfig"
import { UserDto } from "../auth/userDto"
import { Message } from "../messages/types"
import { Chat, ChatMember } from "./types"

enum ChatTypes {
    dm = 'dm',
    group = 'group'
}

// TODO: make back return everything in camelCase
class chatsService {

    async createChat(creatorId: number, type: ChatTypes): Promise<{ chat_id: number }> {

        const chatId: number = (await pool.query('INSERT INTO chats (type) VALUES ($1) RETURNING chat_id;', [type])).rows[0].chat_id

        await pool.query('INSERT INTO chat_members (chat_id, user_id) VALUES ($1, $2);', [chatId, creatorId])

        return { chat_id: chatId }
    }

    async connectToChat(chatId: number, userId: number) {
        await pool.query('INSERT INTO chat_members (chat_id, user_id) VALUES ($1, $2);', [chatId, userId])
        // TODO: throw error when user is already in chat
    }

    async getChats(userId: number): Promise<{ chat_id: number }[]> {

        const chatMembers: ChatMember[] = (await pool.query('SELECT * FROM chat_members WHERE user_id = $1;', [userId])).rows
        // console.log('chatMembers ', chatMembers)
        const result: number[] = chatMembers.map((chat: ChatMember) => chat.chat_id)

        const chatsIds = result.map(id => { return { chat_id: id } })
        // console.log('chatsIds ', chatsIds)

        if (chatsIds.length === 0) {
            return []
        }

        return chatsIds
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