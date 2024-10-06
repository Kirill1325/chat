import { createSlice } from "@reduxjs/toolkit";

interface settingsModalState {
    isSettingsModalOpen: boolean
}

const initialState: settingsModalState = {
    isSettingsModalOpen: false
}

export const settingsModalSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        openSettingsModal(state ) {
           state.isSettingsModalOpen = true
        },

        closeSettingsModal(state ) {
           state.isSettingsModalOpen = false
        },
    },
})

const { actions, reducer } = settingsModalSlice

export const { closeSettingsModal, openSettingsModal } = actions

export default reducer