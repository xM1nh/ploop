import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'
import modalReducer from '../features/modal/modalSlice'
import apiSlice from "./api/apiSlice";

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        modal: modalReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>

export default store