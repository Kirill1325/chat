import { useEffect } from "react"
import { useAppDispatch } from "../../../app/store"
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
    const [refresh] = userApi.useRefreshMutation()

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

    return (

        <div className={cl.mainPage}>
            <Sidebar />
            <SettingsModal />
            <ChatsListHeader />
            <ChatsList />
            <ChatWindowHeader />
            <ChatWindow />
        </div>

    )
}
