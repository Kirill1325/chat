import logo from '../../../assets/logo.png'
import cl from './ChatCard.module.scss'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { socket } from '../../../app/main'
import { changeChatId, setIsOpen } from '../../../widgets/chatWindow/model/chatWindowSlice'
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

    const dispatch = useAppDispatch()



    const handleChatChange = () => {
        user && socket.emit('join room', chatId.toString(), user.id)
        dispatch(changeChatId(chatId))
        dispatch(setIsOpen(true))
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
                        <p>id {chatId}</p>
                        <p>{chatsLastMessages[chatId].sender}</p>
                        <p>{chatsLastMessages[chatId].message}</p>
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
