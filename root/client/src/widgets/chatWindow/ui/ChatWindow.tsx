import { useAppDispatch, useAppSelector } from '../../../app/store'
import cl from './ChatWindow.module.scss'
import React, { useEffect, useRef, useState } from 'react'
import { socket } from '../../../app/main'
import { MessageItem } from '../../../entities/message/ui/MessageItem'
import { setEditingMessage } from '../model/chatWindowSlice'
import { MessageField } from '../../messageField'
import { getDate } from '../../../entities/message/helpers/convertDate'

const currentYear = (new Date().getFullYear()).toString()

export const ChatWindow = () => {

    const { currentChatId, messages, editingMessageId } = useAppSelector(state => state.chatWindowSlice)

    const dispatch = useAppDispatch()

    const [message, setMessage] = useState('')

    const messagesRef = useRef<HTMLDivElement>(null)
    const currentSearchedMessageRef = useRef<HTMLDivElement>(null)

    const { currentSearchedMessageId } = useAppSelector(state => state.chatWindowHeaderSlice)

    useEffect(() => {
        messagesRef.current && messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, left: 0 })
        // TODO: when delete and edit message at the top, it scrolls to bottom, fix
    }, [messages])

    useEffect(() => {
        editingMessageId && setMessage(messages.find(message => message.messageId === editingMessageId)?.payload ?? '')
    }, [editingMessageId])

    useEffect(() => {
        currentChatId && message === '' && socket.emit('get messages', currentChatId)
    }, [currentChatId])

    useEffect(() => {
        currentSearchedMessageRef.current && currentSearchedMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, [currentSearchedMessageId])

    const handleCancelEditing = () => {
        setMessage('')
        dispatch(setEditingMessage(null))
    }

    return (
        <div className={`${cl.chatWindow} ${currentChatId === null ? '' : cl.open}`}>
            {currentChatId &&
                <>
                    <div className={cl.messages} ref={messagesRef} >
                        {messages && messages.map((msg, idx) =>
                            messages[idx - 1] && messages[idx] && getDate(messages[idx]) === getDate(messages[idx - 1]) ?
                                <MessageItem
                                    key={msg.messageId}
                                    message={msg}
                                    currentSearchedMessageId={currentSearchedMessageId}
                                    ref={currentSearchedMessageRef}
                                />
                                :
                                <React.Fragment key={msg.messageId} >
                                    <div className={cl.date}>
                                        {getDate(msg).slice(8) === currentYear
                                            ? <p >{getDate(msg).slice(0, 7)}</p>
                                            : <p >{getDate(msg)}</p>
                                        }
                                    </div>
                                    <MessageItem
                                        message={msg}
                                        currentSearchedMessageId={currentSearchedMessageId}
                                        ref={currentSearchedMessageRef}
                                    />
                                </React.Fragment>
                        )}
                    </div>
                </>
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