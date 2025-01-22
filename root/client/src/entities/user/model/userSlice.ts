import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { UserDto, UserStatus } from "./types";

type userSliceState = {
    user: UserDto
    // users: UserDto[]
}

const initialState: userSliceState = {
    user: {} as UserDto,
    // users: [],
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
        setUserProfilePic(state, action: PayloadAction<{ profilePic: string }>) {
            state.user.profilePic = action.payload.profilePic
        }
        // setUsers(state, action: PayloadAction<UserDto[]>) {
        //     state.users = action.payload
        // },
        // updateUserStatus(state, action: PayloadAction<{id: number, status: UserStatus}>) {
        //     const user = state.users.find(user => user.id === action.payload.id)
        //     user && (user.status = action.payload.status)
        //     console.log(current(state.users))
        // },
        // setProfilePic(state, action: PayloadAction<{userId: number, profilePic: string}>) {
        //     const user = state.users.find(user => user.id === action.payload.userId)
        //     user && (user.profilePic = action.payload.profilePic)
        //     console.log(current(state))
        // }
    },
})

const { actions, reducer } = userSlice

export const { setUser, setUserProfilePic } = actions

export default reducer