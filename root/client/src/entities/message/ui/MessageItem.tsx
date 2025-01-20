import { forwardRef, useEffect, useMemo, useRef } from 'react'
import { getTime } from '..'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { openContextMenu, setPosition, setSelectedMessage } from '../../../widgets/contextMenu/model/contextMenuSlice'
import { Message, Status } from '../model/types'
import cl from './MessageItem.module.scss'
import { socket } from '../../../app/main'

interface MessageItemProps {
    message: Message,
    currentSearchedMessageId: number | null
}

export const MessageItem = forwardRef<HTMLDivElement, MessageItemProps>(({ message, currentSearchedMessageId }, messageRef) => {

    const dispatch = useAppDispatch()

    const { user } = useAppSelector(state => state.userSlice)
    const { currentChatId } = useAppSelector(state => state.chatWindowSlice)
    const { users } = useAppSelector(state => state.userSlice)

    const intersectionRef = useRef<HTMLDivElement>(null)

    const observer = useMemo(() => new IntersectionObserver(([entry]) => {
        message.senderId !== user.id && message.status === Status.sent && entry.isIntersecting &&
            socket.emit('read message', message.messageId, currentChatId)
    }), [intersectionRef])

    useEffect(() => {
        intersectionRef.current && observer.observe(intersectionRef.current)
        return () => observer.disconnect()
    }, [])

    const username = users && users.find(user => user.id === message.senderId)?.username

    const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        dispatch(setPosition({ x: e.clientX, y: e.clientY }))
        dispatch(setSelectedMessage(message.messageId))
        dispatch(openContextMenu())
    }

    return (
        <div
            className={`${cl.messageWrapper} ${currentSearchedMessageId === message.messageId ? cl.searchedMessage : ''}`}
            ref={intersectionRef}
        >
            <div className={`${cl.messageContainer} ${message.senderId === user.id ? cl.myMessage : ''}`}>
                {message.senderId === user.id && message.status === Status.sent && <div className={cl.statusSent}></div>}
                <div
                    className={` ${cl.message} ${message.senderId === user.id ? cl.myMessage : ''}`}
                    id={message.messageId.toString()}
                    onContextMenu={(e) => handleRightClick(e)}
                    ref={message.messageId === currentSearchedMessageId ? messageRef : null}
                >
                    {message.senderId !== user.id && <p>{username}</p>}
                    <div className={cl.messageContent}>
                        <p>{message.payload}</p>
                        <b>{getTime(message)}</b>
                    </div>
                </div>
            </div>
        </div>
    )
})   
