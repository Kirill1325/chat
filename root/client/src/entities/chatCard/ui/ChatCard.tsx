import logo from '../../../assets/logo.png'
import cl from './ChatCard.module.scss'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { socket } from '../../../app/main'
import { changeChatId } from '../../../widgets/chatWindow/model/chatWindowSlice'
import { useEffect } from 'react'
import { getTime, Status } from '../../message'

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
    }, [])

    return (
        chatsLastMessages[chatId] !== undefined && (
            <div
                className={`${cl.chatCard} ${currentChatId === chatId ? cl.active : ''}`}
                tabIndex={0}
                onClick={handleChatChange}
            >

                <img src={logo} alt='pic' />

                {chatsLastMessages[chatId] &&
                    <div className={cl.chatInfo}>
                        <div className={cl.chatInfoInner}>
                            <p>{username}</p>
                            <p>{chatsLastMessages[chatId].payload}</p>
                            {/* <p>{chatsLastMessages[chatId].sender.username}</p> ONLY FOR GROUP CHATS */}
                        </div>
                        {chatsLastMessages[chatId].senderId && chatsLastMessages[chatId].senderId === user.id &&
                            <div className={cl.messageStatus}>
                                {chatsLastMessages[chatId].status === Status.sent &&
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 12.6111L8.92308 17.5L20 6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                }
                                {chatsLastMessages[chatId].status === Status.read &&
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 12.9L7.14286 16.5L15 7.5" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20 7.5625L11.4283 16.5625L11 16" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                }
                            </div>
                        }
                    </div>
                }
                <div className={cl.chatTime}>
                    <p>{getTime(chatsLastMessages[chatId])}</p>
                </div>

            </div>
        )
    )
}
