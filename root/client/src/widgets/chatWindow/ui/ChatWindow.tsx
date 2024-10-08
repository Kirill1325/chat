import { useAppSelector } from '../../../app/store'
import cl from './ChatWindow.module.scss'
import { useEffect, useState } from 'react'
import { Input } from '../../../shared/input'
import { socket } from '../../../app/main'
import { Message } from '../../../entities/message'
import { Button, ButtonVariants } from '../../../shared/button'
import { userApi } from '../../../entities/user'

export const ChatWindow = () => {

  const { currentChatId } = useAppSelector(state => state.chatWindowSlice)

  const { user } = useAppSelector(state => state.userSlice)
  const { data: users } = userApi.useGetUsersQuery()

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const [isDropdpwnOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {

    currentChatId && message === '' && socket.emit('get messages', currentChatId)

    socket.on('receive messages', (messages) => {
      setMessages(messages)
    })

  }, [currentChatId, message])


  const handleRecieveMessage = () => {
    socket.on('receive message', (message) => {
      setMessages([...messages, message])
      console.log('handleRecieveMessage ', message)
    })
  }

  const handleSendMessage = () => {

    if (message) {
      socket.emit('send message', user.id, currentChatId, message, parseInt(Date.now().toString().slice(0, 9)))
      handleRecieveMessage()
      setMessage('')
    }
  }

  return (
    <div className={cl.chatWindow}>

      {currentChatId === null
        ? <div>Select a chat</div>
        : <div className={cl.chatWindowContent}>
          <p>{currentChatId}</p>
          <Button
            variant={ButtonVariants.outlined}
            onClick={() => setIsDropdownOpen(!isDropdpwnOpen)}
          >
            Add user
          </Button>
          <div className={`${cl.dropdown} ${isDropdpwnOpen ? cl.open : ''}`}>
            {users &&
              users.map(user =>
                <Button
                  variant={ButtonVariants.contained}
                  key={user.id}
                >
                  {user.username}
                </Button>
              )}
          </div>
          {messages && messages.map(message =>
            <div
              style={{ textAlign: message.sender_id === user.id ? 'right' : 'left' }}
              key={message.message_id}
            >
              {message.payload}
            </div>)}
          <Input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button variant={ButtonVariants.contained} onClick={handleSendMessage}>send</Button>
        </div>
      }
    </div>
  )
}
