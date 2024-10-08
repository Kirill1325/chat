import { createSlice } from "@reduxjs/toolkit";

interface chatWindowState {
    currentChatId: number | null
}

const initialState: chatWindowState = {
    currentChatId: null
}

export const chatWindowSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeChatId: (state, action) => {
            state.currentChatId = action.payload
        }
    },
})

const { actions, reducer } = chatWindowSlice

export const { changeChatId } = actions

export default reducer