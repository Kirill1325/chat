import { Message, Status } from "./types"

export class MessageDto {

    messageId: number
    senderId: number
    chatId: number
    payload: string
    createdAt: number
    status: Status

    constructor(model: Message) {
        this.messageId = model.message_id
        this.senderId = model.sender_id
        this.chatId = model.chat_id
        this.payload = model.payload
        this.createdAt = model.created_at
        this.status = model.status
    }

}