import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface filePreviewModalState {
    isFilePreviewModalOpen: boolean,
    filePreview: string | undefined 
}

const initialState: filePreviewModalState = {
    isFilePreviewModalOpen: false,
    filePreview: undefined
}

export const filePreviewModalSlice = createSlice({
    name: 'filePreviewModal',
    initialState,
    reducers: {
        openFilePreviewModal(state) {
            state.isFilePreviewModalOpen = true
        },

        closeFilePreviewModal(state) {
            state.isFilePreviewModalOpen = false
        },
        setPreview(state, action: PayloadAction<string | undefined>) {
            state.filePreview = action.payload
        }
    },
})

const { actions, reducer } = filePreviewModalSlice

export const { closeFilePreviewModal, openFilePreviewModal, setPreview } = actions

export default reducer