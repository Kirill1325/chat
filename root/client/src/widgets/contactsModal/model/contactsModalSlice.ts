import { createSlice } from "@reduxjs/toolkit";

interface contactsModalState {
    isContactsModalOpen: boolean
}

const initialState: contactsModalState = {
    isContactsModalOpen: false
}

export const contactsModalSlice = createSlice({
    name: 'contactsModal',
    initialState,
    reducers: {
        openContactsModal(state) {
            state.isContactsModalOpen = true
        },

        closeContactsModal(state) {
            state.isContactsModalOpen = false
        },
    },
})

const { actions, reducer } = contactsModalSlice

export const { closeContactsModal, openContactsModal } = actions

export default reducer