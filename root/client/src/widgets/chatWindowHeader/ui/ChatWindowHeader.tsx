import { useAppDispatch, useAppSelector } from '../../../app/store'
import { changeChatId } from '../../chatWindow/model/chatWindowSlice'
import cl from './ChatWindowHeader.module.scss'
import logo from '../../../assets/logo.png'
import { useEffect, useRef, useState } from 'react'
import { socket } from '../../../app/main'
import { setCurrentSearchedMessageId, setSearchedMessages, setSearching } from '../model/chatWindowHeaderSlice'

export const ChatWindowHeader = () => {

    const [searchValue, setSearchValue] = useState('')

    const dispatch = useAppDispatch()

    const { currentChatId } = useAppSelector(state => state.chatWindowSlice)
    const { user } = useAppSelector(state => state.userSlice)
    const { chats } = useAppSelector(state => state.chatsListSlice)

    const { searchedMessages, searching, currentSearchedMessageId } = useAppSelector(state => state.chatWindowHeaderSlice)

    const chat = chats.find(c => c.chatId === currentChatId)
    const username = chat?.members.find(m => m.id !== user.id)?.username

    // const headerRef = useClickOutside(() => closeSearch())
    const inputRef = useRef<HTMLInputElement>(null)

    const handleNextMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        currentSearchedMessageId &&
            dispatch(setCurrentSearchedMessageId(searchedMessages[searchedMessages.indexOf(currentSearchedMessageId) - 1]))
    }

    const handlePrevMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        currentSearchedMessageId &&
            dispatch(setCurrentSearchedMessageId(searchedMessages[searchedMessages.indexOf(currentSearchedMessageId) + 1]))
    }

    const closeSearch = () => {
        dispatch(setSearching(false))
        setSearchValue('')
        dispatch(setSearchedMessages([]))
    }

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && searching) {
            closeSearch()
        }
    }

    const handleSearch = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            searching && socket.emit('search messages', searchValue, currentChatId)
        }
        // TODO: add alert if no messages found
    }

    useEffect(() => {
        document.addEventListener('keydown', handleSearch)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('keydown', handleSearch)
            document.removeEventListener('keydown', handleEscape)
        }
    })

    useEffect(() => {
        socket.on('search messages', (messagesIds: number[]) => {
            dispatch(setSearchedMessages(messagesIds))
        })
    })

    useEffect(() => {
        dispatch(setCurrentSearchedMessageId(searchedMessages[0]))
    }, [searchedMessages])

    useEffect(() => {
        inputRef.current && inputRef.current.focus()
    }, [searching])

    return (
        <div className={cl.chatWindowHeader} >
            {currentSearchedMessageId && searching &&
                <div className={cl.navButtons}>
                    <button
                        className={cl.prevBtn}
                        onClick={(e) => handlePrevMessage(e)}
                        disabled={currentSearchedMessageId === searchedMessages[searchedMessages.length - 1]}
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                            <g id="SVGRepo_iconCarrier"> <path d="M7 10L12 15L17 10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </g>
                        </svg>
                    </button>
                    <button
                        className={cl.nextBtn}
                        onClick={(e) => handleNextMessage(e)}
                        disabled={currentSearchedMessageId === searchedMessages[0]}
                    >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 10L12 15L17 10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            }
            <div className={cl.backButton}>
                <button onClick={() => { dispatch(changeChatId(null)) }} >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            {searching
                ?
                <div className={cl.messageSearchContainer} >
                    <input
                        className={cl.messageSearch}
                        type='text'
                        placeholder=' Search'
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        ref={inputRef}
                    />
                    <button className={cl.closeSearch} onClick={closeSearch}>
                        <svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 21.32L21 3.32001" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 3.32001L21 21.32" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                :
                <>
                    <div className={cl.user}>
                        <img src={logo} alt='pic' />
                        <p>{username}</p>
                    </div>
                    <div className={cl.searchButton}>
                        <button onClick={() => dispatch(setSearching(true))}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </>
            }
        </div>
    )
}
