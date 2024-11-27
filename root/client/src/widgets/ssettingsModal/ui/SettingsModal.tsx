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
import { useEffect } from 'react';

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

    const dispatch = useAppDispatch()

    const handleSettingsModalClose = () => {
        isSettingsModalOpen && dispatch(closeSettingsModal())
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
        <div className={`${cl.settingsModal} ${isSettingsModalOpen ? cl.open : ''}`} onClick={e => e.stopPropagation()}>
            <div className={cl.settingsModalContent} ref={ref}>
                <p>{user.username}</p>
                <p>{user.email}</p>
                <Button variant={ButtonVariants.outlined}>change photo</Button>
                <Button variant={ButtonVariants.outlined}>change password</Button>

                <form onSubmit={formik.handleSubmit}>

                    <label htmlFor='oldPassword'>Enter prev password</label>
                    <Input
                        // type="password"
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
