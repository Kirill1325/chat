import { useAppDispatch, useAppSelector } from '../../../app/store'
import { changeChatId } from '../../chatWindow/model/chatWindowSlice'
import cl from './ChatWindowHeader.module.scss'
import logo from '../../../assets/logo.png'

export const ChatWindowHeader = () => {

    const dispatch = useAppDispatch()

    const { currentChatId } = useAppSelector(state => state.chatWindowSlice)
    const { user } = useAppSelector(state => state.userSlice)
    const { chats } = useAppSelector(state => state.chatsListSlice)

    const chat = chats.find(c => c.chatId === currentChatId)
    const username = chat?.members.find(m => m.id !== user.id)?.username

    return (
        <div className={cl.chatWindowHeader}>
            <div className={cl.backButton}>
                <button onClick={() => { dispatch(changeChatId(null)) }} >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            <div className={cl.user}>
                <img src={logo} alt='pic' />
                <p>{username}</p>
            </div>
            <div className={cl.searchButton}>
                <button >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
