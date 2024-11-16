export type ChatMember = {
    user_id: number
    chat_id: number
}

enum ChatTypes {
    dm = 'dm',
    group = 'group'
}

export type Chat = {
    chat_id: number
    last_sent_message_id: number
    last_sent_user_id: number
    type: ChatTypes
}