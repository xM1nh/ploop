import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    spray: [],
    caption: '',
    tags: []
}

const createSpraySlice = createSlice({
    name: 'spray',
    initialState,
    reducers: {
        addSpray: (state, action) => {state.spray = action.payload},
        addCaption: (state, action) => {state.caption = action.payload},
        addTags: (state, action) => {state.tags = action.payload},
        discard: (state) => {
            state.spray = [],
            state.caption = '',
            state.tags = []
        }
    }
})

export default createSpraySlice.reducer

export const {
    addSpray, 
    addCaption, 
    addTags,
    discard
} = createSpraySlice.actions