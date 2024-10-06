import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDto } from "./types";

const initialState = {
    user: {} as UserDto,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserDto>) {
            state.user.username = action.payload.username
            state.user.email = action.payload.email
            state.user.id = action.payload.id
        }
    },
})

const { actions, reducer } = userSlice

export const { setUser } = actions

export default reducer