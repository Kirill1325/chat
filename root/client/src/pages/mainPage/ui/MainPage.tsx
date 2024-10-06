import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/store"
import { setUser } from "../../../entities/user/model/userSlice"
import { ChatsList } from "../../../widgets/chatsList"
import { ChatsListHeader } from "../../../widgets/chatsListHeader"
import { ChatWindow } from "../../../widgets/chatWindow"
import { ChatWindowHeader } from "../../../widgets/chatWindowHeader"
import { Sidebar } from "../../../widgets/sidebar"
import cl from './MainPage.module.scss'
import { userApi } from "../../../entities/user"
import { useNavigate } from "react-router-dom"
import { SettingsModal } from "../../../widgets/ssettingsModal"

export const MainPage = () => {

    const dispatch = useAppDispatch()
    const { user } = useAppSelector(state => state.userSlice)
    const [refresh] = userApi.useRefreshMutation()

    useEffect(() => {
        console.log(user)
    }, [user])

    const isLogged = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {

        if (isLogged) {
            refresh().unwrap().then(userFetced => {
                dispatch(setUser(userFetced.user))
            })
        } else {
            navigate('/registration')
        }

    }, [])

    const chatList = [

        {
            id: 1,
            username: 'user1',
            lastMessage: 'Hi'
        },
        {
            id: 2,
            username: 'user2',
            lastMessage: 'Hi'
        },
        {
            id: 3,
            username: 'user1',
            lastMessage: 'Hi'
        },
        {
            id: 4,
            username: 'user2',
            lastMessage: 'Hi'
        },
        {
            id: 5,
            username: 'user1',
            lastMessage: 'Hi'
        },
        {
            id: 6,
            username: 'user2',
            lastMessage: 'Hi'
        },
        {
            id: 7,
            username: 'user1',
            lastMessage: 'Hi'
        },
        {
            id: 8,
            username: 'user2',
            lastMessage: 'Hi'
        },
        {
            id: 9,
            username: 'user1',
            lastMessage: 'Hi'
        },
        {
            id: 10,
            username: 'user2',
            lastMessage: 'Hi'
        },
    ]

    return (
        <div className={cl.mainPage}>
            <Sidebar />
            <SettingsModal/>
            <ChatsListHeader />
            <ChatsList chatsList={chatList} />
            <ChatWindowHeader />
            <ChatWindow />
        </div>
    )
}
