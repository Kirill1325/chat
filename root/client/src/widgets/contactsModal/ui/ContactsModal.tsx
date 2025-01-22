import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { closeContactsModal } from '../model/contactsModalSlice'
import { useClickOutside } from '../../../shared/useOutsideClick'
import cl from './ContactsModal.module.scss'
import { socket } from '../../../app/main'
import { UserDto, UserStatus } from '../../../entities/user/model/types'

export const ContactsModal = () => {

    const [searchQuery, setSearchQuery] = useState('')
    const [contacts, setContacts] = useState<UserDto[]>([])

    const dispatch = useAppDispatch()
    const { isContactsModalOpen } = useAppSelector(state => state.contactsModalSlice)
    const { chatsPictures } = useAppSelector(state => state.chatsListSlice)
    const { user } = useAppSelector(state => state.userSlice)

    const handleClose = () => {
        isContactsModalOpen && dispatch(closeContactsModal())
        setSearchQuery('')
        if (inputRef.current) inputRef.current.value = ''
    }
    
    const inputRef = useRef<HTMLInputElement>(null)
    const ref = useClickOutside(handleClose)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timer = setTimeout(() => {
            setSearchQuery(e.target.value)
        }, 500);
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

    useEffect(() => {
        socket.emit('search contacts', searchQuery)
    }, [searchQuery])

    useEffect(() => {
        socket.on('search contacts', (contacts: UserDto[]) => {
            setContacts(contacts)
        })

        return () => {
            socket.off('search contacts')
        }
    })

    return (
        <div className={`${cl.contactsModal} ${isContactsModalOpen ? cl.open : ''}`} >
            <div className={cl.contactsModalContent} ref={ref} >
                <div className={cl.contactsModalHeader}>
                    <h4>Contacts</h4>
                    <button onClick={handleClose}>
                        <svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 21.32L21 3.32001" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 3.32001L21 21.32" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
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
                    {contacts && contacts.map(contact =>
                        contact.id !== user.id &&
                        <div className={cl.contact} key={contact.id} onClick={() => connectToDm(contact.id)}>
                            <img src={chatsPictures[contact.id]} alt='pic' />
                            <div className={cl.user}>
                                <p className={cl.username}>{contact.username}</p>
                                <p className={`${contact.status === UserStatus.online ? cl.online : ''}`}>{contact.status}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
