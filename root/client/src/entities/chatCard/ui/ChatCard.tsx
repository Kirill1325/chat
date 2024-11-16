import logo from '../../../assets/logo.png'
import cl from './ChatCard.module.scss'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { socket } from '../../../app/main'
import { changeChatId, setIsOpen } from '../../../widgets/chatWindow/model/chatWindowSlice'
import { userApi } from '../../user'
import { useEffect, useState } from 'react'
import { Message } from '../../message'
import { ChatTypes } from '../model/types'

interface ChatCardProps {
    chatId: number,
    type: ChatTypes
}

export const ChatCard = ({ chatId, type }: ChatCardProps) => {

    const { user } = useAppSelector(state => state.userSlice)

    const { currentChatId } = useAppSelector(state => state.chatWindowSlice)

    const dispatch = useAppDispatch()

    // TODO: remove from userService
    // const { data: lastSentMessage } = userApi.useGetLastMessageQuery(chatId)
    // const { data: lastUser } = userApi.useGetLastUserQuery(chatId)

    const [lastMessage, setLastMessage] = useState('')
    const [lastUser, setLastUser] = useState('')

    const handleChatChange = () => {
        user && socket.emit('join room', chatId.toString(), user.id)
        dispatch(changeChatId(chatId))
        dispatch(setIsOpen(true))
    }

    const handleRecieveMessage = () => {
        socket.on('receive message', (message: Message) => {
            // console.log('message ', message)
            setLastMessage(message.payload)
            // setLastUser(message.sender_id)
        })
    }

    useEffect(() => {
        handleRecieveMessage()
        // const interval = setInterval(() => {
        //     handleRecieveMessage()
        // }, 100)

        // return () => {
        //     clearInterval(interval)
        // }
    }, [])

    return (
        lastMessage !== undefined && (
            <div className={`${cl.chatCard} ${currentChatId === chatId ? cl.active : ''}`} onClick={handleChatChange} >

                <img src={logo} alt='pic' />

                <div className={cl.chatInfo}>
                    {/* <p>type {type}</p> */}
                    <p>id {chatId}</p>
                    <p>{lastUser}</p>
                    <p>{lastMessage}</p>
                </div>

                <div className={cl.chatTime}>
                    <p>v</p>
                    <p>13:00</p>
                </div>

            </div>
        )
    )
}
