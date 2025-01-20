import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, Status } from "../../../entities/message";

interface chatWindowState {
    currentChatId: number | null,
    messages: Message[],
    editingMessageId: number | null
}

const initialState: chatWindowState = {
    currentChatId: null,
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
        },
        changeMessageStatus: (state, action: PayloadAction<{ messageId: number }>) => {
            state.messages = state.messages.map(message => message.messageId === action.payload.messageId
                ? { ...message, status: Status.read }
                : message
            )
        }
    },
})

const { actions, reducer } = chatWindowSlice

export const { changeChatId, setMessages, deleteMessage, editMessage, setEditingMessage, changeMessageStatus } = actions

export default reducer