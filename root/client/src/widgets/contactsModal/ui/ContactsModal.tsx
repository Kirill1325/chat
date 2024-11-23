import { userApi } from '../../../entities/user'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { closeContactsModal } from '../model/contactsModalSlice'
import { useClickOutside } from '../../../shared/useOutsideClick'
import cl from './ContactsModal.module.scss'
import { socket } from '../../../app/main'
import { useEffect } from 'react'
import { changeChatId } from '../../chatWindow/model/chatWindowSlice'
import { setChats } from '../../chatsList/model/chatsListSlice'

export const ContactsModal = () => {

    const { data: users } = userApi.useGetUsersQuery()

    const dispatch = useAppDispatch()
    const { isContactsModalOpen } = useAppSelector(state => state.contactsModalSlice)
    const { chats } = useAppSelector(state => state.chatsListSlice)

    useEffect(() => {
        console.log('chats', chats)
    }, [chats])

    const { user } = useAppSelector(state => state.userSlice)

    const handleClose = () => {
        isContactsModalOpen && dispatch(closeContactsModal())
    }

    const ref = useClickOutside(handleClose)

    useEffect(() => {
        // console.log('trigger')
        socket.on('connect to dm', (chatId: number) => {
            // console.log(chatId)
            // console.log('connect to dm', chatId)
            dispatch(changeChatId(chatId))
            dispatch(setChats([...chats, {chatId: chatId}]))
        })
    })

    const connectToDm = (userId: number) => {
        socket.emit('connect to dm', user.id, userId)
        console.log('emit connect to dm')
        dispatch(closeContactsModal())
    }

    return (
        <div className={`${cl.contactsModal} ${isContactsModalOpen ? cl.open : ''}`}>
            <div className={cl.contactsModalContent} ref={ref}>
                <div className={cl.contactsModalHeader}>
                    <h3>Contacts</h3>
                    <button onClick={handleClose}>x</button>
                </div>
                <input type="text" placeholder='Search' />
                <div className={cl.contacts}>
                    {users && users.map(u =>
                        u.id !== user.id && <p key={u.id} onClick={() => connectToDm(u.id)}>{u.username}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
