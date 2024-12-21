import logo from '../../../assets/logo.png'
import cl from './ChatCard.module.scss'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { socket } from '../../../app/main'
import { changeChatId } from '../../../widgets/chatWindow/model/chatWindowSlice'
import { useEffect } from 'react'
import { setLastMessage } from '../model/chatCardSlice'
import { convertDate } from '../../message'

interface ChatCardProps {
    chatId: number
}

export const ChatCard = ({ chatId }: ChatCardProps) => {

    const { user } = useAppSelector(state => state.userSlice)
    const { currentChatId } = useAppSelector(state => state.chatWindowSlice)
    const { chatsLastMessages } = useAppSelector(state => state.chatCardSlice)
    const { chats } = useAppSelector(state => state.chatsListSlice)

    const username = chats.find(c => c.chatId === chatId)?.members.find(m => m.id !== user.id)?.username

    const dispatch = useAppDispatch()

    const handleChatChange = () => {
        user && currentChatId !== chatId && socket.emit('join room', chatId.toString(), user.id)
        dispatch(changeChatId(chatId))
    }

    useEffect(() => {
        socket.emit('get last message', chatId)
        socket.on('get last message', (message: { message: string, sender: string, chatId: number, createdAt: string }) => {
            dispatch(setLastMessage(message))
        })
    }, [])

    return (
        chatsLastMessages[chatId] !== undefined && (
            <div className={`${cl.chatCard} ${currentChatId === chatId ? cl.active : ''}`} onClick={handleChatChange} >

                <img src={logo} alt='pic' />

                {chatsLastMessages[chatId] &&
                    <div className={cl.chatInfo}>
                        <p>{username}</p>
                        <p>{chatsLastMessages[chatId].message}</p>
                        {/* <p>{chatsLastMessages[chatId].sender}</p> ONLY FOR GROUP CHATS */}
                    </div>
                }

                <div className={cl.chatTime}>
                    {/* <p>v</p> TODO: add read/sent logic */}
                    <p>{convertDate(chatsLastMessages[chatId])}</p>
                </div>

            </div>
        )
    )
}
