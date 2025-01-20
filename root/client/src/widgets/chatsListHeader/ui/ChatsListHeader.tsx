import { useAppDispatch } from '../../../app/store'
import { openSidebar } from '../../sidebar/model/sidebarSlice'
import cl from './ChatsListHeader.module.scss'

export const ChatsListHeader = () => {

    const dispatch = useAppDispatch()

    return (
        <header className={cl.chatsListHeader}>
            <button onClick={() => dispatch(openSidebar())}>
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 18L20 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                    <path d="M4 12L20 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                    <path d="M4 6L20 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
            <button>
                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </header>
    )
}
