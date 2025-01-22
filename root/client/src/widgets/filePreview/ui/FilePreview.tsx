import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/store"
import { closeFilePreviewModal, setPreview } from "../model/filePreviewSlice"
import { useClickOutside } from "../../../shared/useOutsideClick"
import cl from './FilePreview.module.scss'

export const FilePreview = () => {

    const { user } = useAppSelector(state => state.userSlice)

    const { isFilePreviewModalOpen } = useAppSelector(state => state.filePreviewModalSlice)
    const dispatch = useAppDispatch()

    // const [img, setImg] = useState<string>()

    // useEffect(() => {
    //     const fetchImage = async () => {
    //         if (user.id) {
    //             const res = await fetch(`http://localhost:8080/user/profile-pic/${user.id.toString()}`)
    //             const imageBlob = await res.blob()
    //             const imageObjectURL = URL.createObjectURL(imageBlob)
    //             setImg(imageObjectURL)
    //         }
    //     }

    //     fetchImage()
    // }, [user.id])

    const handleClose = () => {
        isFilePreviewModalOpen && dispatch(closeFilePreviewModal())
    }

    const ref = useClickOutside(handleClose)

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClose()
            dispatch(setPreview(undefined))
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    })

    return (
        <div className={`${cl.filePreviewModal} ${isFilePreviewModalOpen ? cl.open : ''}`} >
            <div className={cl.filePreviewModalContent} ref={ref} >
                {/* <img src={img} alt='preview' /> */}
            </div>
        </div>
    )
}
