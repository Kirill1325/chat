import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../../entities/message";

interface chatWindowState {
    currentChatId: number | null,
    isOpen: boolean,
    messages: Message[],
    editingMessageId: number | null
}

const initialState: chatWindowState = {
    currentChatId: null,
    isOpen: false,
    messages: [],
    editingMessageId: null
}

export const chatWindowSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setIsOpen: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload
        },
        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload
        },
        deleteMessage: (state, action: PayloadAction<number>) => {
            state.messages = state.messages.filter(message => message.messageId !== action.payload)
        },
        setEditingMessage: (state, action: PayloadAction<number | null>) => {
            state.editingMessageId = action.payload
            console.log(current(state))
        }
    },
})

const { actions, reducer } = chatWindowSlice

export const { changeChatId, setIsOpen, setMessages, deleteMessage, setEditingMessage } = actions

export default reducer