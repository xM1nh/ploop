import { configureStore } from "@reduxjs/toolkit";
import createSprayReducer from '../features/spray/createSpraySlice'
import authReducer from '../features/auth/authSlice'
import modalReducer from '../features/modal/modalSlice'
import apiSlice from "./api/apiSlice";

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        modal: modalReducer,
        createSpray: createSprayReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>

export default store