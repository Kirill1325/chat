import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface chatWindowHeaderState {
    currentSearchedMessageId: number | null,
    searchedMessages: number[],
    searching: boolean
}

const initialState: chatWindowHeaderState = {
    currentSearchedMessageId: null,
    searchedMessages: [],
    searching: false
}

export const chatWindowHeaderSlice = createSlice({
    name: 'chatWindowHeader',
    initialState,
    reducers: {
        setSearchedMessages(state, action: PayloadAction<number[]>) {
            state.searchedMessages = action.payload
        },
        setCurrentSearchedMessageId(state, action: PayloadAction<number | null>) {
            state.currentSearchedMessageId = action.payload
        },
        setSearching(state, action: PayloadAction<boolean>) {
            state.searching = action.payload
        }
    },
})

const { actions, reducer } = chatWindowHeaderSlice

export const { setCurrentSearchedMessageId, setSearchedMessages, setSearching } = actions

export default reducer