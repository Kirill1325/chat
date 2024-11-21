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

  // const { data: chats } = userApi.useGetChatsQuery(user.id ?? skipToken)

  // useEffect(() => {
  //   console.log('chats', chats)
  // }, [chats])

  // useEffect(() => {
  //   console.log('id', user.id)
  // }, [user])

  useEffect(() => {
    socket.emit('get chats', user.id)
  }, [user.id])

  useEffect(() => {
    socket.on('get chats', (chats: { chat_id: number }[]) => {
      // console.log(chats)
      dispatch(setChats(chats))
    })
  })

  useEffect(() => {
    socket.on('connect to chat', (chats: { chat_id: number }[]) => {
      dispatch(setChats(chats))
    })
  })

  return (
    <div className={`${cl.chatsList} ${isOpen ? cl.close : ''}`}>
      <ChatsListHeader />
      <div className={cl.chats}>
        {chats && chats.map(chat => <ChatCard key={chat.chat_id} chatId={chat.chat_id} />)}
      </div>
    </div>
  )
}
