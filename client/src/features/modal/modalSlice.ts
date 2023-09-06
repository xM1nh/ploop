import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

const initialState = {
    isAuthOpen: false,
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        toggleAuth(state) {
            state.isAuthOpen = !state.isAuthOpen
        },
    }
})

export default modalSlice.reducer

export const { toggleAuth } = modalSlice.actions

export const selectIsAuthOpen = (state :RootState) => state.modal.isAuthOpen