import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface chatCardState {
    chatsLastMessages: Record<number, { message: string, sender: { id: number, username: string }, createdAt: string }>
}

const initialState: chatCardState = {
    chatsLastMessages: {}
}

export const chatCardSlice = createSlice({
    name: 'chatCard',
    initialState,
    reducers: {
        setLastMessage: (state, action: PayloadAction<{ chatId: number, message: string, sender: { id: number, username: string }, createdAt: string }>) => {
            state.chatsLastMessages[action.payload.chatId] = {
                message: action.payload.message,
                sender: {
                    id: action.payload.sender.id,
                    username: action.payload.sender.username
                },
                createdAt: action.payload.createdAt
            }
        }
    }
})

const { actions, reducer } = chatCardSlice
export const { setLastMessage } = actions
export default reducer

