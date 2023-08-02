import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

const initialState = {
    isOpen: false
}

const modalSlice = createSlice({
    name: 'loginModal',
    initialState,
    reducers: {
        toggle(state) {
            state.isOpen = !state.isOpen
        }
    }
})

export default modalSlice.reducer

export const { toggle } = modalSlice.actions

export const selectIsOpen = (state :RootState) => state.loginModal.isOpen