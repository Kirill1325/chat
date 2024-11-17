import { useAppSelector } from "../../../app/store"
import { ChatCard } from "../../../entities/chatCard"
import { userApi } from "../../../entities/user"
import { ChatsListHeader } from "../../chatsListHeader"
import cl from './ChatsList.module.scss'
import { skipToken } from '@reduxjs/toolkit/query/react'

export const ChatsList = () => {

  const { user } = useAppSelector(state => state.userSlice)

  const { isOpen } = useAppSelector(state => state.chatWindowSlice)

  const { data: chats } = userApi.useGetChatsQuery(user.id ?? skipToken)

  // useEffect(() => {
  //   console.log('chats',chats)
  // }, [chats])

  // useEffect(() => {
  //   console.log('id',user.id)
  // }, [user])

  return (
    <div className={`${cl.chatsList} ${isOpen ? cl.close : ''}`}>
      <ChatsListHeader />
      <div className={cl.chats}>
        {chats && chats.map(chat => <ChatCard key={chat.chat_id} chatId={chat.chat_id} type={chat.type} />)}
      </div>
    </div>
  )
}
