import { createSlice } from "@reduxjs/toolkit";

interface SidebarState {
    isSidebarOpen: boolean
}

const initialState: SidebarState = {
    isSidebarOpen: false
}

export const sidebarSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        openSidebar(state ) {
           state.isSidebarOpen = true
        },

        closeSidebar(state ) {
           state.isSidebarOpen = false
        },
    },
})

const { actions, reducer } = sidebarSlice

export const { openSidebar, closeSidebar } = actions

export default reducer