import { configureStore } from "@reduxjs/toolkit";
import createSprayReducer from '../features/spray/createSpraySlice'
import authReducer from '../features/auth/authSlice'
import loginModalReducer from '../features/signup/modalSlice'
import apiSlice from "./api/apiSlice";

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        loginModal: loginModalReducer,
        createSpray: createSprayReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat()
})

export type RootState = ReturnType<typeof store.getState>

export default store