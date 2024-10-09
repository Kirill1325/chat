import { pool } from "../config/dbConfig"

// TODO: move to anothe file
enum Status {
    sending = 'sending',
    sent = 'sent',
    read = 'read'
}

export interface Message {
    message_id: number
    sender_id: number
    chat_id: number
    payload: string
    created_at: number
    status: Status
}

class MessageService {

    async sendMessage(senderId: number, chatId: number, payload: string, createdAt: string): Promise<{ message_id: number; }> {
        // TODO: add status
        
        await pool.query(
            'INSERT INTO messages (sender_id, chat_id, payload, created_at, status) VALUES (?, ?, ?, ?, ?)',
            [senderId, chatId, payload, createdAt, 'sent']
        )

        await pool.query('UPDATE chats SET last_sent_message_id=LAST_INSERT_ID(), last_sent_user_id = ? WHERE chat_id = ?', [senderId, chatId ])

        const lastSentMessageId = await pool.query('SELECT LAST_INSERT_ID() as message_id')
        // console.log('lastSentMessageId ', lastSentMessageId[0][0])
        return lastSentMessageId[0][0]
    }

    async getMessageById(messageId: number): Promise<{ message: Message }> {
        const message = await pool.query('SELECT * FROM messages WHERE message_id = ?', [messageId])

        return message[0][0]
    }

    async getMessages(chatId: number): Promise<Message[] > {
        const messages = await pool.query('SELECT * FROM messages WHERE chat_id = ?', [chatId])

        return messages[0] as Message[]

    }

}

export const messageService = new MessageService()