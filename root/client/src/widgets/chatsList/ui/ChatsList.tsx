import { ChatCard } from "../../../entities/chatCard"
import { ChatType } from "../../../entities/chatCard"
import cl from './ChatsList.module.scss'

interface ChatsListProps {
    chatsList: ChatType[]
}

export const ChatsList = ({chatsList}: ChatsListProps) => {
  return (
    <div className={cl.chatsList}>
        {chatsList.map(chat => <ChatCard key={chat.id} {...chat} />)}
    </div>
  )
}
