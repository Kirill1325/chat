import { pool } from "../config/dbConfig"

interface q {
   'MAX(chat_id)': number
}

class chatsService {

    async createChat(creatorId: number): Promise<{ chat_id: number }> {

        await pool.query('INSERT INTO chats (chat_id) VALUES (NULL);')
        const [results, fields] = await pool.query('SELECT MAX(chat_id) FROM chats;')
        const chatId = results[0] as q
        console.log('chatId ', chatId["MAX(chat_id)"])
        console.log('fields ', fields)
        await pool.query('INSERT INTO chat_members (chat_id, user_id) VALUES (LAST_INSERT_ID(), ?);', [creatorId])

        return {chat_id: chatId["MAX(chat_id)"]}
    }

    async connectToChat() {

    }

    async getChats(userId: number) {

        const chat_members = await pool.query('SELECT * FROM chat_members WHERE user_id = ?;', [userId])

        const chats_ids = chat_members[0].constructor === Array && chat_members[0].map((chat: any) => chat.chat_id)
        // console.log('chats_ids ', chats_ids)

        if (chats_ids.length === 0) {
            return []
        }

        const chats = await pool.query('SELECT * FROM chats WHERE chat_id IN (?);', [chats_ids])

        return chats[0]
    }

}

export default new chatsService()