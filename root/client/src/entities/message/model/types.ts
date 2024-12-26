export type Message = {
    messageId: number,
    senderId: number,
    chatId: number,
    payload: string,
    createdAt: string,
    status: Status
}

export enum Status {
    sending = 'sending',
    sent = 'sent',
    read = 'read'
}