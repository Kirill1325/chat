import { useAppDispatch, useAppSelector } from '../../../app/store'
import { useClickOutside } from '../../../shared/useOutsideClick'
import { closeContextMenu } from '../model/contextMenuSlice'
import cl from './ContextMenu.module.scss'

export const ContextMenu = () => {

    const dispatch = useAppDispatch()
    const { isContextMenuOpen } = useAppSelector(state => state.contextMenuSlice)
    const { position } = useAppSelector(state => state.contextMenuSlice)

    const handleClose = () => {
        isContextMenuOpen && dispatch(closeContextMenu())
    }

    const ref = useClickOutside(handleClose)

    return (
        position &&
        <div
            className={`${cl.contextMenu} ${isContextMenuOpen ? cl.open : ''}`}
            style={{ top: position.y, left: `calc(${position.x}px - 10vw)` }}
        >
            <div className={cl.contextMenuContent} ref={ref}>
                <button>Edit</button>
                <button>Delete</button>
            </div>
        </div>
    )
}
