import { useFormik } from 'formik'
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { setUser } from '../../../entities/user/model/userSlice'
import { Button, ButtonVariants } from '../../../shared/button'
import { Input } from '../../../shared/input'
import { useClickOutside } from '../../../shared/useOutsideClick'
import { closeSettingsModal } from '../model/settingsModalSlice'
import cl from './SettingsModal.module.scss'
import { userApi } from '../../../entities/user';
import { useEffect, useState } from 'react';
import { setPreview } from '../../filePreview/model/filePreviewSlice';
import { socket } from '../../../app/main';

export const SettingsModal = () => {

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string()
                .required('required'),
            newPassword: Yup.string()
                .required('Required'),
        }),
        onSubmit: values => {
            console.log(values)
            changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword })
                .unwrap()
                .then(fulfilled => {
                    localStorage.setItem('token', JSON.stringify(fulfilled.accessToken))
                    dispatch(setUser(fulfilled.user))
                    dispatch(closeSettingsModal())
                })
                .catch(rejected => console.error(rejected))
        },
    })

    const [changePassword] = userApi.useChangePasswordMutation()

    const { user } = useAppSelector(state => state.userSlice)

    const { isSettingsModalOpen } = useAppSelector(state => state.settingsModalSlice)
    const { filePreview } = useAppSelector(state => state.filePreviewModalSlice)

    // const [uploadProfilePic] = userApi.useUploadProfilePicMutation()

    const dispatch = useAppDispatch()
    const [file, setFile] = useState<File | undefined>(undefined)

    const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            setFile(undefined)
            return
        }
        setFile(e.target.files[0])
    }

    // useEffect(() => {
    //     const createBuffer = async () => {
    //         const buffer = file && await file.arrayBuffer()
    //         file && socket.emit("set profile picture", user.id, buffer, (status: string) => {
    //             console.log(status);
    //         })
    //     }
    //     createBuffer()
    // }, [file])

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (!e.target.files || e.target.files.length === 0) {
    //         setFile(undefined)
    //         return
    //     }

    //     setFile(e.target.files[0])
    // }

    useEffect(() => {
        if (!file) {
            dispatch(setPreview(undefined))
            return
        }

        const objectUrl = URL.createObjectURL(file)
        dispatch(setPreview(objectUrl))
        // dispatch(openFilePreviewModal())

        return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const buffer = file && await file.arrayBuffer()
        const fileSize = file && file.size
        const mimeType = file && file.type
        user && buffer && socket.emit("update user profile picture", user.id, buffer, mimeType, fileSize, (status: string) => {
            console.log(status)
        })
        dispatch(closeSettingsModal())
    }

    const handleSettingsModalClose = () => {
        isSettingsModalOpen && dispatch(closeSettingsModal())
        setFile(undefined)
    }

    const ref = useClickOutside(handleSettingsModalClose)

    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleSettingsModalClose()
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    })

    return (
        <div className={`${cl.settingsModal} ${isSettingsModalOpen ? cl.open : ''}`} >
            <div className={cl.settingsModalContent} ref={ref} >
                <p>{user.username}</p>
                <p>{user.email}</p>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input type='file' name='file' id='file' onChange={upload} />
                    {/* <input type='file' name='file' id='file' onChange={handleFileChange} /> */}
                    <button type='submit'>send</button>
                </form>
                <img src={filePreview} alt='file' />
                <Button variant={ButtonVariants.outlined}>change password</Button>

                <form onSubmit={formik.handleSubmit}>

                    <label htmlFor='oldPassword'>Enter prev password</label>
                    <Input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        placeholder="oldPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.oldPassword}
                    />
                    {formik.touched.oldPassword && formik.errors.oldPassword ? (
                        <div style={{ color: 'red' }}>{formik.errors.oldPassword}</div>
                    ) : null}

                    <label htmlFor='newPassword'>Enter new password</label>
                    <Input
                        // type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder="newPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.newPassword}
                    />
                    {formik.touched.newPassword && formik.errors.newPassword ? (
                        <div style={{ color: 'red' }}>{formik.errors.newPassword}</div>
                    ) : null}

                    <Button type='submit' variant={ButtonVariants.contained}>submit</Button>
                </form>
            </div>
        </div>
    )
}
