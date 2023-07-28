import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    spray: [],
    title: '',
    description: '',
    tags: []
}

const uploadSpraySlice = createSlice({
    name: 'spray',
    initialState,
    reducers: {
        addSpray: (state, action) => {state.spray = action.payload},
        addTitle: (state, action) => {state.title = action.payload},
        addDescription: (state, action) => {state.description = action.payload},
        addTags: (state, action) => {state.tags = action.payload}
    }
})

export default uploadSpraySlice.reducer

export const {
    addSpray, 
    addTitle, 
    addDescription, 
    addTags
} = uploadSpraySlice.actions