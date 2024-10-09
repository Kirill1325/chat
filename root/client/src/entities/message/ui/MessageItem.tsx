import { useAppSelector } from '../../../app/store'
import { userApi } from '../../user'
import { Message } from '../model/types'
import cl from './MessageItem.module.scss'

interface MessageItemProps {
    message: Message
}

export const MessageItem = ({ message }: MessageItemProps) => {

    const covertDate = () => {
        const date = new Date(parseInt(message.created_at))
        return date.toLocaleString().slice((10)).slice(1, -3)
    }

    const { user } = useAppSelector(state => state.userSlice)

    const { data: users } = userApi.useGetUsersQuery()

    const username = users && users.find(user => user.id === message.sender_id)?.username

    return (
        <div className={`${cl.message} ${message.sender_id === user.id ? cl.myMessage : ''}`} >
            <p>{username}</p>
            <div className={cl.messageContent}>
                <p>{message.payload}</p>
                <b>{covertDate()}</b>
            </div>
        </div>
    )
}   
