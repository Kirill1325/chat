import { createSlice,  PayloadAction } from "@reduxjs/toolkit";

interface chatsListState {
    chats: { chatId: number }[],
}

const initialState: chatsListState = {
    chats: []
}

export const chatsListSlice = createSlice({
    name: 'chatsList',
    initialState,
    reducers: {
        setChats: (state, action: PayloadAction<{ chatId: number }[]>) => {
            state.chats = action.payload
            // console.log(current(state))
        }
        
    },
})

const { actions, reducer } = chatsListSlice

export const { setChats } = actions

export default reducer

// TODO: maybe delete it