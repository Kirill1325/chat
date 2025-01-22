import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/store"
import { setUser, setUserProfilePic } from "../../../entities/user/model/userSlice"
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
import { changeLastSentMessageStatus, setChats, setLastMessage } from "../../../widgets/chatsList/model/chatsListSlice"
import { changeChatId, setMessages, editMessage, deleteMessage, changeMessageStatus } from "../../../widgets/chatWindow/model/chatWindowSlice"
import { Message } from "../../../entities/message"
import { UserStatus } from "../../../entities/user/model/types"
import { FilePreview } from "../../../widgets/filePreview"

export const MainPage = () => {

    // TODO: make one container for all modals

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
    const { isFilePreviewModalOpen } = useAppSelector(state => state.filePreviewModalSlice)

    const dispatch = useAppDispatch()

    useEffect(() => {
        const fetchImage = async () => {
            if (user.id) {
                const res = await fetch(`http://localhost:8080/user/profile-pic/${user.id.toString()}`)
                const imageBlob = await res.blob()
                const imageObjectURL = URL.createObjectURL(imageBlob)
                dispatch(setUserProfilePic({ profilePic: imageObjectURL }))
            }
        }

        fetchImage()
    }, [user.id])

    // useEffect(() => {
    //     // console.log(users)
    //     const setProfilePics = async (res: Response) => {
    //         if (res) {
    //             const userId = Number(res.url.split('/').pop())
    //             const imageBlob = await res.blob()
    //             const imageObjectURL = URL.createObjectURL(imageBlob)
    //             dispatch(setProfilePic({ userId, profilePic: imageObjectURL }))
    //             // setPic({ userId, profilePic: imageObjectURL })
    //         }
    //     }
    //     if (!fetched && users.length > 0) {
    //         Promise
    //             .all(users.map(u => u && fetch(`http://localhost:8080/user/profile-pic/${u.id.toString()}`)))
    //             .then(values => values.map(res => setProfilePics(res)))
    //             .then(() => setFetched(true))
    //     }

    // }, [users])

    // useEffect(() => {
    //     pic && dispatch(setProfilePic({ userId: pic.userId, profilePic: pic.profilePic }))
    // }, [pic])

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
            // dispatch(updateUserStatus({ id: userId, status: UserStatus.offline }))
        })

        return () => {
            socket.off('user disconnected')
        }
    })

    useEffect(() => {
        socket.on('user connected', (userId: number) => {
            // dispatch(updateUserStatus({ id: userId, status: UserStatus.online }))
        })

        return () => {
            socket.off('user connected')
        }
    })

    // useEffect(() => {
    //     socket.emit('get users')
    // }, [])

    // useEffect(() => {
    //     socket.on('get users', (users: UserDto[]) => {
    //         dispatch(setUsers(users))
    //     })

    //     return () => {
    //         socket.off('get users')
    //     }
    // })

    useEffect(() => {
        socket.on('connect', () => {
            console.log('WebSocket connected')
        });

        return () => {
            socket.off('connect')
        }
    })

    // useEffect(() => {
    //     socket.on('connect to dm', (chat: Record<number, UserDto[]>) => {

    //         dispatch(setChatsMembers(chat))
    //         // dispatch(changeChatId(chat.chatId))
    //         // const chatExists = chats.some(c => c.chatId === chat.chatId)
    //         // !chatExists && dispatch(setChats([...chats, chat]))
    //     })

    //     return () => {
    //         socket.off('connect to dm')
    //     }
    // })

    // useEffect(() => {
    //     socket.on('get chats', (chats: Record<number, UserDto[]>) => {
    //         console.log(chats)
    //         dispatch(setChatsMembers(chats))
    //         // dispatch(setChats(chats))
    //     })

    //     return () => {
    //         socket.off('get chats')
    //     }
    // }, [user.id])

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
            dispatch(changeLastSentMessageStatus(message))
        })

        return () => {
            socket.off('read message')
        }
    })

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' &&
            !isSidebarOpen &&
            !isContactsModalOpen &&
            !isSettingsModalOpen &&
            !searching &&
            !isFilePreviewModalOpen &&
            currentChatId
        ) {
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
            {/* {pic && <img src={pic.profilePic} alt='pic' />} */}
            <Sidebar />
            <SettingsModal />
            <ContactsModal />
            <ContextMenu />
            <FilePreview />
            <aside className={`${cl.chatsList} ${currentChatId ? '' : cl.open}`}>
                <ChatsListHeader />
                <ChatsList />
            </aside>
            {currentChatId
                ? <main className={`${cl.chatWindow} ${currentChatId ? cl.open : ''}`}>
                    <ChatWindowHeader />
                    <ChatWindow />
                </main>
                : <main className={cl.selectChatTab}>
                    <div>Select a chat</div>
                </main>
            }
        </div>

    )
}
