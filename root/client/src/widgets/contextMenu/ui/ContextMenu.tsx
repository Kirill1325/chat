import { socket } from '../../../app/main'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { useClickOutside } from '../../../shared/useOutsideClick'
import { deleteMessage, setEditingMessage, setMessages } from '../../chatWindow/model/chatWindowSlice'
import { closeContextMenu } from '../model/contextMenuSlice'
import cl from './ContextMenu.module.scss'

export const ContextMenu = () => {

    const dispatch = useAppDispatch()
    const { isContextMenuOpen, messageId, position } = useAppSelector(state => state.contextMenuSlice)

    const handleClose = () => {
        isContextMenuOpen && dispatch(closeContextMenu())
    }

    const ref = useClickOutside(handleClose)

    const handleDelteMessage = () => {
        socket.emit('delete message', messageId)
        socket.on('delete message', (messageId: number) => {
            dispatch(deleteMessage(messageId))
        })
        dispatch(closeContextMenu())
    }

    const handleEditMessage = () => {
        dispatch(setEditingMessage(messageId))
        dispatch(closeContextMenu())
    }

    return (
        position &&
        <div
            className={`${cl.contextMenu} ${isContextMenuOpen ? cl.open : ''}`}
            style={{ top: position.y, left: `calc(${position.x}px - 10vw)` }}
        >
            <div className={cl.contextMenuContent} ref={ref}>
                <button onClick={handleEditMessage}>Edit</button>
                <button onClick={handleDelteMessage}>Delete</button>
            </div>
        </div>
    )
}
