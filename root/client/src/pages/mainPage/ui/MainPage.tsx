import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/store"
import { setUser, setUsers, updateUserStatus } from "../../../entities/user/model/userSlice"
import { ChatsList } from "../../../widgets/chatsList"
import { ChatWindow } from "../../../widgets/chatWindow"
import { Sidebar } from "../../../widgets/sidebar"
import cl from './MainPage.module.scss'
import { userApi, UserDto } from "../../../entities/user"
import { useNavigate } from "react-router-dom"
import { SettingsModal } from "../../../widgets/ssettingsModal"
import { ContextMenu } from "../../../widgets/contextMenu"
import { ContactsModal } from "../../../widgets/contactsModal"
import { ChatsListHeader } from "../../../widgets/chatsListHeader"
import { ChatWindowHeader } from "../../../widgets/chatWindowHeader"
import { socket } from "../../../app/main"
import { setChats } from "../../../widgets/chatsList/model/chatsListSlice"
import { changeChatId, setMessages, editMessage, deleteMessage, changeMessageStatus } from "../../../widgets/chatWindow/model/chatWindowSlice"
import { Message } from "../../../entities/message"
import { changeStatus, setLastMessage } from "../../../entities/chatCard/model/chatCardSlice"
import { UserStatus } from "../../../entities/user/model/types"

export const MainPage = () => {

    const [refresh] = userApi.useRefreshMutation()

    const isLogged = localStorage.getItem('token')
    const navigate = useNavigate()

    const { user } = useAppSelector(state => state.userSlice)
    const { chats } = useAppSelector(state => state.chatsListSlice)
    const { currentChatId, messages } = useAppSelector(state => state.chatWindowSlice)
    const { isSidebarOpen } = useAppSelector(state => state.sidebarSlice)
    const { isContactsModalOpen } = useAppSelector(state => state.contactsModalSlice)
    const { isSettingsModalOpen } = useAppSelector(state => state.settingsModalSlice)
    const { searching } = useAppSelector(state => state.chatWindowHeaderSlice)

    const dispatch = useAppDispatch()

    useEffect(() => {

        if (isLogged) {
            refresh().unwrap().then(userFetced => {
                dispatch(setUser(userFetced.user))
                socket.auth = { id: userFetced.user.id }
                socket.connect()
            })
        } else {
            navigate('/login')
        }

    }, [])

    useEffect(() => {
        socket.on('user disconnected', (userId: number) => {
            console.log('user disconnected', userId)
            dispatch(updateUserStatus({ id: userId, status: UserStatus.offline }))
        })

        return () => {
            socket.off('user disconnected')
        }
    })

    useEffect(() => {
        socket.on('user connected', (userId: number) => {
            console.log('user connected', userId)
            dispatch(updateUserStatus({ id: userId, status: UserStatus.online }))
        })

        return () => {
            socket.off('user connected')
        }
    })

    useEffect(() => {
        socket.emit('get users')
    }, [])

    useEffect(() => {
        socket.on('get users', (users: UserDto[]) => {
            console.log(users)
            dispatch(setUsers(users))
        })

        return () => {
            socket.off('get users')
        }
    })

    useEffect(() => {
        socket.on('connect', () => {
            console.log('WebSocket connected')
            // socket.emit('go online', user.id)
        });

        return () => {
            socket.off('connect')
        }
    })

    useEffect(() => {
        socket.on('connect to dm', (chat: { chatId: number, members: UserDto[] }) => {
            dispatch(changeChatId(chat.chatId))
            const chatExists = chats.some(c => c.chatId === chat.chatId)
            !chatExists && dispatch(setChats([...chats, chat]))
        })

        return () => {
            socket.off('connect to dm')
        }
    })

    useEffect(() => {
        socket.on('get chats', (chats: { chatId: number, members: UserDto[] }[]) => {
            dispatch(setChats(chats))
        })

        return () => {
            socket.off('get chats')
        }
    }, [user.id])

    useEffect(() => {
        socket.on('get messages', (recievedMessages) => {
            dispatch(setMessages(recievedMessages))
        })

        return () => {
            socket.off('get messages')
        }

    }, [currentChatId])

    useEffect(() => {
        socket.on('send message', (message) => {
            dispatch(setMessages([...messages, message]))
        })
        // TODO: fix when chat is created, messages won't show to sender

        return () => {
            socket.off('send message')
        }
    })

    useEffect(() => {
        socket.on('edit message', (messageId: number, payload: string) => {
            dispatch(editMessage({ messageId, payload }))
        })
        return () => {
            socket.off('edit message')
        }
    })

    useEffect(() => {
        socket.on('delete message', (messageId: number) => {
            dispatch(deleteMessage(messageId))
        })
        return () => {
            socket.off('delete message')
        }
    })

    useEffect(() => {
        socket.on('get last message', (message: Message) => {
            dispatch(setLastMessage(message))
        })

        return () => {
            socket.off('get last message')
        }
    })

    useEffect(() => {
        socket.on('read message', (message: Message) => {
            dispatch(changeMessageStatus({ messageId: message.messageId }))
            dispatch(changeStatus(message))
        })

        return () => {
            socket.off('read message')
        }
    })

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isSidebarOpen && !isContactsModalOpen && !isSettingsModalOpen && !searching && currentChatId) {
            dispatch(changeChatId(null))
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    })

    return (

        <div className={cl.mainPage}>
            <Sidebar />
            <SettingsModal />
            <ContactsModal />
            <ContextMenu />
            <div className={`${cl.chatsList} ${currentChatId ? '' : cl.open}`}>
                <ChatsListHeader />
                <ChatsList />
            </div>
            {currentChatId
                ? <div className={`${cl.chatWindow} ${currentChatId ? cl.open : ''}`}>
                    <ChatWindowHeader />
                    <ChatWindow />
                </div>
                : <div className={cl.selectChatTab}>
                    <div>Select a chat</div>
                </div>
            }
        </div>

    )
}
