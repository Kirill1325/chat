import { createSlice,  PayloadAction } from "@reduxjs/toolkit";

interface contextMenuState {
    isContextMenuOpen: boolean,
    messageId: number | null,
    position: { x: number, y: number } | null
}

const initialState: contextMenuState = {
    isContextMenuOpen: false,
    messageId: null,
    position: null
}

export const contextMenuSlice = createSlice({
    name: 'contextMenu',
    initialState,
    reducers: {
        openContextMenu(state) {
            state.isContextMenuOpen = true
        },

        closeContextMenu(state) {
            state.isContextMenuOpen = false
        },
        setPosition(state, action: PayloadAction<{ x: number, y: number }>) {
            state.position = action.payload
        },
        setSelectedMessage(state, action: PayloadAction<number>) {
            state.messageId = action.payload
            // console.log(current(state))
        }
    },
})

const { actions, reducer } = contextMenuSlice

export const { closeContextMenu, openContextMenu, setPosition, setSelectedMessage } = actions

export default reducer