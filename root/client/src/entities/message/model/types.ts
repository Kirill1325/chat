export type Message = {
    message_id: number,
    sender_id: number,
    chat_id: number,
    payload: string,
    created_at: number,
    status: Status
}

enum Status {
    sending = 'sending',
    sent = 'sent',
    read = 'read'
}