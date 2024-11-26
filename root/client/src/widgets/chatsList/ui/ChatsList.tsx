import { useEffect } from "react"
import {  useAppSelector } from "../../../app/store"
import { ChatCard } from "../../../entities/chatCard"
import cl from './ChatsList.module.scss'
import { socket } from "../../../app/main"

export const ChatsList = () => {

  const { user } = useAppSelector(state => state.userSlice)

  const { chats } = useAppSelector(state => state.chatsListSlice)

  useEffect(() => {
    user.id && socket.emit('get chats', user.id)
  }, [user.id])

  return (
    <div className={cl.chatsList}>
      <div className={cl.chats}>
        {chats && chats.map(chat => <ChatCard key={chat.chatId} chatId={chat.chatId} />)}
      </div>
    </div>
  )
}
