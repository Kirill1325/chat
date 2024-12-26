import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Message, Status } from "../../message"

interface chatCardState {
    chatsLastMessages: Record<number, Message>
}

const initialState: chatCardState = {
    chatsLastMessages: {}
}

export const chatCardSlice = createSlice({
    name: 'chatCard',
    initialState,
    reducers: {
        setLastMessage: (state, action: PayloadAction<Message>) => {
            state.chatsLastMessages[action.payload.chatId] = action.payload
        },
        changeStatus(state, action: PayloadAction<Message>) {
            state.chatsLastMessages[action.payload.chatId].status = Status.read
        }
    }
})

const { actions, reducer } = chatCardSlice
export const { setLastMessage, changeStatus } = actions
export default reducer

