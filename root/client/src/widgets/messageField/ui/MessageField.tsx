import React, { useEffect, useRef, useState } from 'react'
import cl from './MessageField.module.scss'
import { socket } from '../../../app/main'
import { useAppDispatch, useAppSelector } from '../../../app/store'
import { openFilePreviewModal, setPreview } from '../../filePreview/model/filePreviewSlice'

interface MessageFieldProps {
  message: string,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  handleCancelEditing: () => void
}

export const MessageField = ({ message, setMessage, handleCancelEditing }: MessageFieldProps) => {

  const [file, setFile] = useState<File | undefined>(undefined)

  const dispatch = useAppDispatch()

  const { user } = useAppSelector(state => state.userSlice)
  const { currentChatId, editingMessageId } = useAppSelector(state => state.chatWindowSlice)
  // const { isFilePreviewModalOpen, filePreview } = useAppSelector(state => state.filePreviewModalSlice)

  // useEffect(() => {
  //   console.log(isFilePreviewModalOpen)
  // }, [isFilePreviewModalOpen])

  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    inputRef.current && inputRef.current.focus()
  }, [editingMessageId, currentChatId])


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(undefined)
      return
    }

    setFile(e.target.files[0])
  }

  useEffect(() => {

    if (!file) {
      dispatch(setPreview(undefined))
      return
    }

    const objectUrl = URL.createObjectURL(file)
    dispatch(setPreview(objectUrl))
    dispatch(openFilePreviewModal())

    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  useEffect(() => {
    console.log(file)
  }, [file])

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      editingMessageId ? handleEditMessage() : handleSendMessage()
    }
  }

  const handleEditMessage = () => {
    if (message) {
      socket.emit('edit message', editingMessageId, message, currentChatId)
      setMessage('')
    }
    handleCancelEditing()
  }

  const handleSendMessage = () => {
    if (message) {
      socket.emit('send message', user.id, currentChatId, message, Date.now().toString())
      setMessage('')
    }
    const timer = setTimeout(() => {
      socket.emit('get last message', currentChatId)
    }, 10);
    return () => clearTimeout(timer);
  }

  return (
    <div className={cl.inputContainer}>

      <input type="file" name="file" id="file" onChange={handleFileChange} />
      <label htmlFor="file" className={cl.attachment}>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 96 120">
          <g>
            <path d="M44.907,2.443 C45.778,2.597 45.466,2.401 45.936,2.848 L84.984,58.616 C88.755,63.997 89.786,70.516 88.086,76.86 C86.776,81.748 83.423,86.442 79.03,89.518 C68.997,96.542 55.316,94.24 48.339,84.276 L10.104,29.671 C7.583,26.07 6.613,21.698 7.376,17.371 C8.139,13.045 10.547,9.265 14.145,6.747 C21.58,1.541 31.863,3.354 37.068,10.788 C37.246,11.041 43.243,19.605 53.134,33.731 C53.134,33.731 53.134,33.731 53.134,33.731 C56.649,38.752 60.416,44.13 64.182,49.509 C66.316,52.557 66.316,52.557 67.822,54.708 C68.952,56.322 68.952,56.322 69.203,56.68 C72.974,62.063 72.391,68.484 67.347,72.014 C64.913,73.718 62.285,74.202 59.143,73.648 C56.121,73.115 53.482,71.433 51.723,68.919 L26.287,32.452 C25.971,31.999 26.082,31.375 26.535,31.059 L30.956,27.977 C31.409,27.661 32.032,27.772 32.348,28.225 L57.779,64.687 C58.407,65.584 59.345,66.181 60.426,66.371 C61.695,66.595 62.329,66.507 63.108,65.962 C64.696,64.849 64.674,63.094 63.151,60.919 C62.9,60.561 62.9,60.561 61.77,58.947 C60.263,56.796 60.263,56.796 58.129,53.748 C54.363,48.369 50.597,42.991 47.082,37.971 C47.082,37.971 47.082,37.971 47.082,37.97 C37.19,23.843 31.194,15.28 31.018,15.027 C29.627,13.04 27.551,11.718 25.162,11.297 C22.775,10.876 20.371,11.409 18.385,12.8 C16.401,14.189 15.078,16.268 14.655,18.655 C14.234,21.043 14.767,23.446 16.157,25.432 L54.391,80.038 C59.026,86.655 68.09,88.156 74.79,83.465 C81.573,78.716 83.513,69.394 78.932,62.855 L39.883,7.087 C39.567,6.634 39.676,6.011 40.129,5.694 L44.543,2.602 L44.907,2.443 z" fill="#ffffff" />
          </g>
        </svg>
      </label>
      <textarea
        name='messageInput'
        id='messageInput'
        placeholder='Type a message...'
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => handleEnter(e)}
      />

      {editingMessageId
        ?
        <button onClick={handleEditMessage}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        : <button onClick={handleSendMessage}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      }
    </div>
  )
}
