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
    const dummyRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        dummyRef.current && dummyRef.current.scrollIntoView({ behavior: 'smooth' })
        // TODO: when delete message at the top, it scrolls to bottom, fix
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
                    <div className={cl.dummyDiv} ref={dummyRef}></div>
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