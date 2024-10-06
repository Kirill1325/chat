import logo from '../../../assets/logo.png'
import { ChatType } from '..'
import cl from './ChatCard.module.scss'

export const ChatCard = ({ username, lastMessage }: ChatType) => {
    return (
        <div className={cl.chatCard}>

            <img src={logo} alt='pic' />

            <div className={cl.chatInfo}>
                <p>{username}</p>
                <p>{lastMessage}</p>
            </div>

            <div className={cl.chatTime}>
                <p>v</p>
                <p>13:00</p>
            </div>

        </div>
    )
}
