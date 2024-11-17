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
        const result: Message[] = (await pool.query('SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at;', [chatId])).rows
        const messages = result.map((message: Message) => new MessageDto(message))
        return messages

    }

    async deleteMessage(messageId: number) {
        const chatId = (await pool.query('SELECT chat_id FROM messages WHERE message_id=$1;', [messageId])).rows[0].chat_id

        const lastMessage: { message_id: number, sender_id: number } = (await pool.query(
            'SELECT message_id, sender_id FROM (SELECT * FROM messages WHERE chat_id=$1 ORDER BY message_id DESC LIMIT 2) ORDER BY message_id DESC limit 1;',
            [chatId])).rows[0]

        const penultimateMessage: { message_id: number, sender_id: number } = (await pool.query(
            'SELECT message_id, sender_id FROM (SELECT * FROM messages WHERE chat_id=$1 ORDER BY message_id DESC LIMIT 2) ORDER BY message_id limit 1;',
            [chatId])).rows[0]

        if (lastMessage.message_id === penultimateMessage.message_id) {
            await pool.query('UPDATE chats SET last_sent_message_id=null WHERE chat_id=$1;', [chatId])
            await pool.query('UPDATE chats SET last_sent_user_id=null WHERE chat_id=$1;', [chatId])
        }

        if (lastMessage.message_id === messageId && lastMessage.message_id !== penultimateMessage.message_id) {
            await pool.query('UPDATE chats SET last_sent_message_id=$1 WHERE chat_id=$2;', [penultimateMessage.message_id, chatId])
            await pool.query('UPDATE chats SET last_sent_user_id=$1 WHERE chat_id=$2;', [penultimateMessage.sender_id, chatId])
        }

        await pool.query('DELETE FROM messages WHERE message_id = $1', [messageId])
    }

    async editMessage(messageId: number, payload: string) {
        (await pool.query('UPDATE messages SET payload = $1 WHERE message_id = $2 RETURNING payload', [payload, messageId])).rows[0]

    }

}

export const messageService = new MessageService()