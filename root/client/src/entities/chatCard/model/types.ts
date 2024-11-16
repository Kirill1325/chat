export enum ChatTypes {
    dm = 'dm',
    group = 'group',
}

export type ChatType = {
    chat_id: number
    type: ChatTypes
    last_sent_message_id: number
    last_sent_user_id: number
}

export type ChatDto = {
    id: number
    username: string
    lastMessage: string
}