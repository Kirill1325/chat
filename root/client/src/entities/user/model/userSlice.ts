import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { UserDto, UserStatus } from "./types";

type userSliceState = {
    user: UserDto
    users: UserDto[]
}

const initialState: userSliceState = {
    user: {} as UserDto,
    users: [],
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserDto>) {
            state.user.username = action.payload.username
            state.user.email = action.payload.email
            state.user.id = action.payload.id
        },
        setUsers(state, action: PayloadAction<UserDto[]>) {
            state.users = action.payload
        },
        updateUserStatus(state, action: PayloadAction<{id: number, status: UserStatus}>) {
            const user = state.users.find(user => user.id === action.payload.id)
            user && (user.status = action.payload.status)
            console.log(current(state.users))
        }
    },
})

const { actions, reducer } = userSlice

export const { setUser, setUsers, updateUserStatus } = actions

export default reducer