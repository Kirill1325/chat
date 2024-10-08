import logo from '../../../assets/logo.png'
import cl from './ChatCard.module.scss'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { socket } from '../../../app/main'
import { changeChatId } from '../../../widgets/chatWindow/model/chatWindowSlice'
import { userApi } from '../../user'

interface ChatCardProps {
    chatId: number
}

export const ChatCard = ({ chatId }: ChatCardProps) => {

    const { user } = useAppSelector(state => state.userSlice)

    const dispatch = useAppDispatch()
    
    const {data: lastSentMessage} = userApi.useGetMessageByIdQuery(chatId)

    const handleChatChange = () => {
        user && socket.emit('join room', chatId.toString(), user.id)
        dispatch(changeChatId(chatId))
    }

    return (
        <div className={cl.chatCard} onClick={handleChatChange} >

            <img src={logo} alt='pic' />

            <div className={cl.chatInfo}>
                <p>{chatId}</p>
                <p>biba</p>
                <p>{lastSentMessage?.payload}</p>
            </div>

            <div className={cl.chatTime}>
                <p>v</p>
                <p>13:00</p>
            </div>

        </div>
    )
}
