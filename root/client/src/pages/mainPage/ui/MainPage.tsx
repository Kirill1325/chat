import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/store"
import { setUser } from "../../../entities/user/model/userSlice"
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
import { changeChatId, setMessages, editMessage, deleteMessage } from "../../../widgets/chatWindow/model/chatWindowSlice"

export const MainPage = () => {

    const [refresh] = userApi.useRefreshMutation()

    const isLogged = localStorage.getItem('token')
    const navigate = useNavigate()

    const { user } = useAppSelector(state => state.userSlice)
    const { chats } = useAppSelector(state => state.chatsListSlice)
    const { currentChatId, messages } = useAppSelector(state => state.chatWindowSlice)
    const { isSidebarOpen } = useAppSelector(state => state.sidebarSlice)

    const dispatch = useAppDispatch()

    useEffect(() => {

        if (isLogged) {
            refresh().unwrap().then(userFetced => {
                dispatch(setUser(userFetced.user))
            })
        } else {
            navigate('/registration')
        }

    }, [])

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
            console.log(chats)
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

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isSidebarOpen) {
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
