import { useAppDispatch } from '../../../app/store'
import { setIsOpen } from '../../chatWindow/model/chatWindowSlice'
import cl from './ChatWindowHeader.module.scss'

interface Props {
    callback: () => void
}

export const ChatWindowHeader = ({ callback }: Props) => {

    const dispatch = useAppDispatch()

    return (
        <div className={cl.chatWindowHeader}>
            <div>
                <button>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button onClick={() => callback()}>
                    <svg viewBox="0 -0.5 21 21" version="1.1" >
                        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="Dribbble-Light-Preview" transform="translate(-379.000000, -240.000000)" fill="#ffffff">
                                <g id="icons" transform="translate(56.000000, 160.000000)">
                                    <polygon id="plus-[#1512]" points="344 89 344 91 334.55 91 334.55 100 332.45 100 332.45 91 323 91 323 89 332.45 89 332.45 80 334.55 80 334.55 89">

                                    </polygon>
                                </g>
                            </g>
                        </g>
                    </svg>
                </button>
            </div>
            <button onClick={() => dispatch(setIsOpen(false))}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    )
}
