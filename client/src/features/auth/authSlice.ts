import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '../../app/store'

const initialState = {
    isAuthenticated: true,
    token: null,
    userId: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const {accessToken, userId} = action.payload
            state.isAuthenticated = true
            state.token = accessToken
            state.userId = userId
        },
        logOut: (state) => {
            state.isAuthenticated = false,
            state.token = null,
            state.userId = null
        }
    }
})

export const {setCredentials, logOut} = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state :RootState) => state.auth.token
export const selectAuthentication = (state :RootState) => state.auth.isAuthenticated