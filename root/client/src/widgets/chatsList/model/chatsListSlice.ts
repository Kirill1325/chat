import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDto } from "../../../entities/user";
import { Message, Status } from "../../../entities/message";

interface chatsListState {
    chats: {
        chatId: number,
        members: UserDto[]
    }[],
    chatsLastMessages: Record<number, Message>,
    chatsPictures: Record<number, string>
}

const initialState: chatsListState = {
    chats: [],
    chatsLastMessages: {},
    chatsPictures: {},
}

export const chatsListSlice = createSlice({
    name: 'chatsList',
    initialState,
    reducers: {
        setChats: (state, action: PayloadAction<{ chatId: number, members: UserDto[] }[]>) => {
            state.chats = action.payload
            // console.log(current(state))
        },
        setLastMessage: (state, action: PayloadAction<Message>) => {
            state.chatsLastMessages[action.payload.chatId] = action.payload
        },
        changeLastSentMessageStatus(state, action: PayloadAction<Message>) {
            state.chatsLastMessages[action.payload.chatId].status = Status.read
        },
        setMemberProfilePic(state, action: PayloadAction<{ userId: number, profilePic: string }>) {
            state.chatsPictures[action.payload.userId] = action.payload.profilePic
        },

    },
})

const { actions, reducer } = chatsListSlice

export const { setChats, setLastMessage, changeLastSentMessageStatus, setMemberProfilePic } = actions

export default reducer

// TODO: maybe delete it