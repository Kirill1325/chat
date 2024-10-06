import { useAppDispatch, useAppSelector } from '../../../app/store'
import cl from './Sidebar.module.scss'
import { closeSidebar } from '../model/sidebarSlice'
import { Button, ButtonVariants } from '../../../shared/button'
import { userApi } from '../../../entities/user'
import { useNavigate } from 'react-router-dom'
import { openSettingsModal } from '../../ssettingsModal/model/settingsModalSlice'
import { useClickOutside } from '../../../shared/useOutsideClick'

export const Sidebar = () => {

  const { isSidebarOpen } = useAppSelector(state => state.sidebarSlice)
  const dispatch = useAppDispatch()

  const { user } = useAppSelector(state => state.userSlice)
  const [logout] = userApi.useLogoutMutation()

  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    navigate('/registration')
  }

  const handleSidebarClose = () => {
    isSidebarOpen && dispatch(closeSidebar())
  }

  const handleSettingsModalOpen = () => {
    dispatch(openSettingsModal())
    handleSidebarClose()
  }

  const ref = useClickOutside(handleSidebarClose)

  return (
    <div className={`${cl.sidebar} ${isSidebarOpen ? cl.open : ''}`}>
      <div className={cl.sidebarContent} ref={ref}>
        <p>{user.username}</p>
        <Button variant={ButtonVariants.outlined}>new message</Button>
        <Button variant={ButtonVariants.contained}>new conversation</Button>
        <Button variant={ButtonVariants.contained} onClick={handleSettingsModalOpen}>settings</Button>
        <Button variant={ButtonVariants.contained} onClick={handleLogout}>logout</Button>
      </div>
    </div>
  )
}
