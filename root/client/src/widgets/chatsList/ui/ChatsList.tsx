import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/store"
import { ChatCard } from "../../../entities/chatCard"
import { ChatsListHeader } from "../../chatsListHeader"
import cl from './ChatsList.module.scss'
import { socket } from "../../../app/main"
import { setChats } from "../model/chatsListSlice"

export const ChatsList = () => {

  const { user } = useAppSelector(state => state.userSlice)

  const { isOpen } = useAppSelector(state => state.chatWindowSlice)

  const dispatch = useAppDispatch()

  const { chats } = useAppSelector(state => state.chatsListSlice)

  useEffect(() => {
    user.id && socket.emit('get chats', user.id)
    socket.on('get chats', (chats: { chatId: number }[]) => {
      dispatch(setChats(chats))
    })
  }, [user.id])

  return (
    <div className={`${cl.chatsList} ${isOpen ? cl.close : ''}`}>
      <ChatsListHeader />
      <div className={cl.chats}>
        {chats && chats.map(chat => <ChatCard key={chat.chatId} chatId={chat.chatId} />)}
      </div>
    </div>
  )
}
