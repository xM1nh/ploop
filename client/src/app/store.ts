import { configureStore } from "@reduxjs/toolkit";
import createSprayReducer from '../features/spray/createSpraySlice'
import apiSlice from "./api/apiSlice";

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        createSpray: createSprayReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat()
})

export type RootState = ReturnType<typeof store.getState>

export default store