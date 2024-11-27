import { useAppDispatch, useAppSelector } from '../../../app/store'
import cl from './ChatWindow.module.scss'
import { useEffect, useRef, useState } from 'react'
import { socket } from '../../../app/main'
import { MessageItem } from '../../../entities/message/ui/MessageItem'
import { setEditingMessage } from '../model/chatWindowSlice'
import { MessageField } from '../../messageField'

export const ChatWindow = () => {

    const { currentChatId, messages, editingMessageId } = useAppSelector(state => state.chatWindowSlice)

    const dispatch = useAppDispatch()

    const [message, setMessage] = useState('')

    const messagesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesRef.current && messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, left: 0, behavior: 'smooth' })
        // TODO: when delete and edit message at the top, it scrolls to bottom, fix
    }, [messages])

    useEffect(() => {
        editingMessageId && setMessage(messages.find(message => message.messageId === editingMessageId)?.payload ?? '')
    }, [editingMessageId])

    useEffect(() => {
        currentChatId && message === '' && socket.emit('get messages', currentChatId)
    }, [currentChatId])

    const handleCancelEditing = () => {
        setMessage('')
        dispatch(setEditingMessage(null))
    }

    return (
        <div className={`${cl.chatWindow} ${currentChatId === null ? '' : cl.open}`}>
            {currentChatId &&
                <div className={cl.messages} ref={messagesRef} >
                    {messages && messages.map(message =>
                        <MessageItem key={message.messageId} message={message} />
                    )}
                </div>
            }

            {editingMessageId &&
                <div className={cl.messageEditInfo}>
                    <label htmlFor="messageInput">edit</label>
                    <button onClick={handleCancelEditing}>x</button>
                </div>
            }

            <MessageField message={message} setMessage={setMessage} handleCancelEditing={handleCancelEditing} />
        </div>

    )
}