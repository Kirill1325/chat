import { useAppDispatch, useAppSelector } from '../../../app/store'
import cl from './Sidebar.module.scss'
import { closeSidebar } from '../model/sidebarSlice'
import { userApi } from '../../../entities/user'
import { useNavigate } from 'react-router-dom'
import { openSettingsModal } from '../../ssettingsModal/model/settingsModalSlice'
import { useClickOutside } from '../../../shared/useOutsideClick'
import { socket } from '../../../app/main'
import { skipToken } from '@reduxjs/toolkit/query/react'
import { ChatTypes } from '../../../entities/chatCard'
import profilePic from '../../../assets/logo.png'

export const Sidebar = () => {

  const { isSidebarOpen } = useAppSelector(state => state.sidebarSlice)
  const dispatch = useAppDispatch()

  const { user } = useAppSelector(state => state.userSlice)
  const { refetch } = userApi.useGetChatsQuery(user.id ?? skipToken)

  const [createChat] = userApi.useCreateChatMutation()
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

  const handleChatCreate = (type: ChatTypes) => {
    user &&
      createChat({ creatorId: user.id, type: type })
        .unwrap()
        // .then((fullfilled) => console.log(fullfilled))
        .then((fullfilled) => socket.emit('join room', fullfilled.chat_id.toString(), user.id))
    refetch()
  }

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
          <button onClick={() => handleChatCreate(ChatTypes.dm)}>new message</button>
          <button onClick={() => handleChatCreate(ChatTypes.group)}>new chat</button>
          <button onClick={handleSettingsModalOpen}>settings</button>
          <button onClick={handleLogout}>logout</button>
          <button onClick={() => { }}>night mode</button>
        </div>
      </div>
    </div>
  )
}
