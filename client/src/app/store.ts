import { configureStore } from "@reduxjs/toolkit";
import uploadSprayReducer from '../features/spray/uploadSpraySlice'
import apiSlice from "./api/apiSlice";

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        uploadSpray: uploadSprayReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat()
})

export type RootState = ReturnType<typeof store.getState>

export default store