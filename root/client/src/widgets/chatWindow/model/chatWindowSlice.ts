import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface chatWindowState {
    currentChatId: number | null,
    isOpen: boolean
}

const initialState: chatWindowState = {
    currentChatId: null,
    isOpen: false
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
    },
})

const { actions, reducer } = chatWindowSlice

export const { changeChatId, setIsOpen } = actions

export default reducer