import { useAppDispatch, useAppSelector } from '../../../app/store'
import cl from './ChatWindow.module.scss'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { socket } from '../../../app/main'
import { Message } from '../../../entities/message'
import { userApi } from '../../../entities/user'
import { MessageItem } from '../../../entities/message/ui/MessageItem'
import { ChatWindowHeader } from '../../chatWindowHeader'
import { useClickOutside } from '../../../shared/useOutsideClick'
import { setEditingMessage, setMessages } from '../model/chatWindowSlice'

export const ChatWindow = () => {

    const { currentChatId, isOpen, messages, editingMessageId } = useAppSelector(state => state.chatWindowSlice)

    const dispatch = useAppDispatch()

    const { user } = useAppSelector(state => state.userSlice)
    const { data: users } = userApi.useGetUsersQuery()

    const [message, setMessage] = useState('') //TODO: add debounce to message input

    const ref = useRef<HTMLDivElement>(null)
    const dummyRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const [isDropdpwnOpen, setIsDropdownOpen] = useState(false)

    useEffect(() => {
        editingMessageId && setMessage(messages.find(message => message.messageId === editingMessageId)?.payload ?? '')
    }, [editingMessageId])

    useEffect(() => {
        currentChatId && message === '' && socket.emit('get messages', currentChatId)
        socket.on('receive messages', (recievedMessages) => {
            dispatch(setMessages(recievedMessages))
        })

    }, [currentChatId, message])

    useEffect(() => {
        inputRef.current && inputRef.current.focus()
    }, [editingMessageId, currentChatId])

    const callback = () => {
        setIsDropdownOpen(!isDropdpwnOpen)
    }

    const handleRecieveMessage = () => {
        socket.on('receive message', (message) => {
            dispatch(setMessages([...messages, message]))
        })
        dummyRef.current && dummyRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    const handleRecieveEditedMessage = () => {
        socket.on('edit message', (messageId: number, payload: string) => {
            dispatch(setMessages(messages.map(message => message.messageId === messageId ? { ...message, payload } : message)))
        })
        dummyRef.current && dummyRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    // TODO: add scroll to bottom when swithing chats

    const dropdownRef = useClickOutside(() => setIsDropdownOpen(false))

    const handleSendMessage = () => {
        if (message) {
            socket.emit('send message', user.id, currentChatId, message, Date.now().toString())
            handleRecieveMessage()
            setMessage('')
        }
    }

    const handleEditMessage = () => {
        if (message) {
            socket.emit('edit message', editingMessageId, message)
            handleRecieveEditedMessage()
            setMessage('')
        }
        handleCancelEditing()
    }

    const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            editingMessageId ? handleEditMessage() : handleSendMessage()
        }
    }

    const handleCancelEditing = () => {
        setMessage('')
        dispatch(setEditingMessage(null))
        // inputRef.current && inputRef.current.blur()
    }

    return (

        currentChatId === null
            ?
            <div className={cl.chatWindow}>
                <div className={cl.chatWindowContent}>
                    <div>Select a chat</div>
                </div>
            </div>
            :
            <div className={`${cl.chatWindow} ${isOpen ? cl.open : ''}`}>
                <ChatWindowHeader callback={callback} />
                {currentChatId &&
                    <div className={cl.messages} ref={ref}  >
                        {messages && messages.map(message =>
                            <MessageItem key={message.messageId} message={message} />
                        )}
                        {/* <div className={cl.dummyDiv} ref={dummyRef}>baba</div> */}
                    </div>
                }


                {editingMessageId &&
                    <div className={cl.messageEditInfo}>
                        <label htmlFor="messageInput">edit</label>
                        <button onClick={handleCancelEditing}>x</button>
                    </div>
                }
                <div className={cl.inputContainer}>
                    <textarea
                        name='messageInput'
                        id='messageInput'
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => handleEnter(e)}
                    />

                    {editingMessageId
                        ?
                        <button onClick={handleEditMessage}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        : <button onClick={handleSendMessage}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    }
                </div>

                <div className={`${cl.dropdown} ${isDropdpwnOpen ? cl.open : ''}`} ref={dropdownRef}>
                    {users?.map(user => <p key={user.id}>{user.username}</p>)}
                </div>

            </div>

    )
}