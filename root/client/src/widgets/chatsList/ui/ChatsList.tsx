import { useEffect } from "react"
import { useAppSelector } from "../../../app/store"
import { ChatCard } from "../../../entities/chatCard"
import { userApi } from "../../../entities/user"
import cl from './ChatsList.module.scss'
import { skipToken } from '@reduxjs/toolkit/query/react'

export const ChatsList = () => {

  const { user } = useAppSelector(state => state.userSlice)

  const { data: chats } = userApi.useGetChatsQuery(user.id ?? skipToken)

  useEffect(() => {
    console.log(chats)
  }, [chats])

  return (
    <div className={cl.chatsList}>
      {chats && chats.map(chat => <ChatCard key={chat.chat_id} chatId={chat.chat_id} />)}
    </div>
  )
}
