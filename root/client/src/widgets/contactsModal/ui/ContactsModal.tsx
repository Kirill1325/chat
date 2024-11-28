import { userApi } from '../../../entities/user'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { closeContactsModal } from '../model/contactsModalSlice'
import { useClickOutside } from '../../../shared/useOutsideClick'
import cl from './ContactsModal.module.scss'
import { socket } from '../../../app/main'
import { useEffect, useRef, useState } from 'react'
import pic from '../../../assets/logo.png'

export const ContactsModal = () => {

    const [searchQuery, setSearchQuery] = useState('')

    const { data: users } = userApi.useGetUsersQuery(searchQuery)

    const dispatch = useAppDispatch()
    const { isContactsModalOpen } = useAppSelector(state => state.contactsModalSlice)

    const { user } = useAppSelector(state => state.userSlice)

    const inputRef = useRef<HTMLInputElement>(null)

    const handleClose = () => {
        isContactsModalOpen && dispatch(closeContactsModal())
        setSearchQuery('')
        if (inputRef.current) inputRef.current.value = ''
    }

    const ref = useClickOutside(handleClose)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timer = setTimeout(() => {
            setSearchQuery(e.target.value)
        }, 1000);
        return () => clearTimeout(timer);
    }

    const connectToDm = (userId: number) => {
        socket.emit('connect to dm', user.id, userId)
        user.id && socket.emit('get chats', user.id)
        handleClose()
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

    useEffect(() => {
        inputRef.current && inputRef.current.focus()
    }, [isContactsModalOpen])

    return (
        <div className={`${cl.contactsModal} ${isContactsModalOpen ? cl.open : ''}`} >
            <div className={cl.contactsModalContent} ref={ref} >
                <div className={cl.contactsModalHeader}>
                    <h4>Contacts</h4>
                    <button onClick={handleClose}>x</button>
                </div>
                <div className={cl.searchContainer} >
                    <input
                        type="text"
                        name='search'
                        id='search'
                        placeholder='Search'
                        autoComplete='off'
                        ref={inputRef}
                        // value={inputRef.current?.value ?? ''}
                        onChange={(e) => handleChange(e)}
                    />
                    <label htmlFor='search'>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#949494" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </label>
                </div>
                <div className={cl.contacts}>
                    {users && users.map(u =>
                        u.id !== user.id &&
                        <div className={cl.contact} key={u.id} onClick={() => connectToDm(u.id)}>
                            <img src={pic} alt='pic' />
                            <div className={cl.user}>
                                <p className={cl.username}>{u.username}</p>
                                <p className={cl.online}>online</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
