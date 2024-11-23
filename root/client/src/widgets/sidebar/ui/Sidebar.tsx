import { useAppDispatch, useAppSelector } from '../../../app/store'
import cl from './Sidebar.module.scss'
import { closeSidebar } from '../model/sidebarSlice'
import { userApi } from '../../../entities/user'
import { useNavigate } from 'react-router-dom'
import { openSettingsModal } from '../../ssettingsModal/model/settingsModalSlice'
import { useClickOutside } from '../../../shared/useOutsideClick'
import { socket } from '../../../app/main'
import { ChatTypes } from '../../../entities/chatCard'
import profilePic from '../../../assets/logo.png'
import { openContactsModal } from '../../contactsModal/model/contactsModalSlice'
import { changeChatId } from '../../chatWindow/model/chatWindowSlice'
import { useEffect } from 'react'

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

  const handleContactsModalOpen = () => {
    dispatch(openContactsModal())
    handleSidebarClose()
  }

  const handleChatCreate = (type: ChatTypes) => {
    user && socket.emit('create chat', user.id, type)
  }

  useEffect(() => {
    socket.on('create chat', (chat_id: number) => {
      socket.emit('join room', chat_id.toString(), user.id)
      dispatch(changeChatId(chat_id))
      dispatch(closeSidebar())
    })
  })

  const ref = useClickOutside(handleSidebarClose)

  return (
    <div className={`${cl.sidebar} ${isSidebarOpen ? cl.open : ''}`}>
      <div className={cl.sidebarContent} ref={ref}>
        <div className={cl.sidebarUserInfo}>
          <img src={profilePic} alt="profile pic" />
          <p>{user.username}</p>
        </div>
        <div className={cl.sidebarButtons}>
          <button onClick={() => { }}>my profile</button>
          <button onClick={handleContactsModalOpen}>contacts</button>
          <button onClick={() => handleChatCreate(ChatTypes.group)}>new chat</button>
          <button onClick={handleSettingsModalOpen}>settings</button>
          <button onClick={handleLogout}>logout</button>
          <button onClick={() => { }}>night mode</button>
        </div>
      </div>
    </div>
  )
}
