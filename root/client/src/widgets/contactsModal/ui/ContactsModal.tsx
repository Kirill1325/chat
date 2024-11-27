import { userApi } from '../../../entities/user'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { closeContactsModal } from '../model/contactsModalSlice'
import { useClickOutside } from '../../../shared/useOutsideClick'
import cl from './ContactsModal.module.scss'
import { socket } from '../../../app/main'
import { useEffect } from 'react'

export const ContactsModal = () => {

    const { data: users } = userApi.useGetUsersQuery()

    const dispatch = useAppDispatch()
    const { isContactsModalOpen } = useAppSelector(state => state.contactsModalSlice)

    const { user } = useAppSelector(state => state.userSlice)

    const handleClose = () => {
        isContactsModalOpen && dispatch(closeContactsModal())
    }

    const ref = useClickOutside(handleClose)

    const connectToDm = (userId: number) => {
        socket.emit('connect to dm', user.id, userId)
        user.id && socket.emit('get chats', user.id)
        dispatch(closeContactsModal())
    }

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClose()
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    })


    return (
        <div className={`${cl.contactsModal} ${isContactsModalOpen ? cl.open : ''}`} onClick={e => e.stopPropagation()}>
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
