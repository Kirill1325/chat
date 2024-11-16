import { pool } from "../config/dbConfig"
import { MessageDto } from "./messageDto";
import { Message } from "./types";

class MessageService {

    async sendMessage(senderId: number, chatId: number, payload: string, createdAt: string): Promise<{ messageId: number; }> {
        // TODO: add status

        const lastSentMessageId: number = (await pool.query(
            'INSERT INTO messages (sender_id, chat_id, payload, created_at, status) VALUES ($1, $2, $3, $4, $5) RETURNING message_id;',
            [senderId, chatId, payload, createdAt, 'sent']
        )).rows[0].message_id

        console.log('lastSentMessageId ', lastSentMessageId)

        await pool.query('UPDATE chats SET last_sent_message_id=$1, last_sent_user_id = $2 WHERE chat_id = $3;',
            [lastSentMessageId, senderId, chatId])

        return { messageId: lastSentMessageId }
    }

    async getMessageById(messageId: number): Promise<MessageDto> {
        const result: Message = (await pool.query('SELECT * FROM messages WHERE message_id = $1', [messageId])).rows[0]
        const message = new MessageDto(result)
        return message
    }

    async getMessages(chatId: number): Promise<MessageDto[]> {
        const result: Message[] = (await pool.query('SELECT * FROM messages WHERE chat_id = $1', [chatId])).rows
        const messages = result.map((message: Message) => new MessageDto(message))
        return messages

    }

}

export const messageService = new MessageService()