import { useAppDispatch, useAppSelector } from '../../../app/store'
import { openContextMenu, setPosition, setSelectedMessage } from '../../../widgets/contextMenu/model/contextMenuSlice'
import { userApi } from '../../user'
import { Message } from '../model/types'
import cl from './MessageItem.module.scss'

interface MessageItemProps {
    message: Message
}

export const MessageItem = ({ message }: MessageItemProps) => {

    const dispatch = useAppDispatch()

    const covertDate = () => {
        const date = new Date(parseInt(message.createdAt))
        return date.toLocaleString().slice((10)).slice(1, -3)
    }

    const { user } = useAppSelector(state => state.userSlice)

    const { data: users } = userApi.useGetUsersQuery() //TOOO: fetch only users that are in chat

    const username = users && users.find(user => user.id === message.senderId)?.username

    const handleRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // console.log(e.clientX, e.clientY)
        e.preventDefault()
        dispatch(setPosition({ x: e.clientX, y: e.clientY }))
        dispatch(setSelectedMessage(message.messageId))
        dispatch(openContextMenu())
    }

    return (
        <div className={`${cl.message} ${message.senderId === user.id ? cl.myMessage : ''}`} onContextMenu={(e) => handleRightClick(e)} >
            {message.senderId !== user.id && <p>{username}</p>}
            <div className={cl.messageContent}>
                <p>{message.payload}</p>
                <b>{covertDate()}</b>
            </div>
        </div>
    )
}   
