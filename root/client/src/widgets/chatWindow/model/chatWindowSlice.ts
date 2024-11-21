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
    name: 'chatWindow',
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
        editMessage: (state, action: PayloadAction<{ messageId: number, payload: string }>) => {
            state.messages = state.messages.map(message => message.messageId === action.payload.messageId ? { ...message, payload: action.payload.payload } : message)
        },
        setEditingMessage: (state, action: PayloadAction<number | null>) => {
            state.editingMessageId = action.payload
            console.log(current(state))
        }
    },
})

const { actions, reducer } = chatWindowSlice

export const { changeChatId, setIsOpen, setMessages, deleteMessage, editMessage, setEditingMessage } = actions

export default reducer