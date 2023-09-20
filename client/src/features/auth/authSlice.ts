import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

const initialState: {
    isAuthenticated: boolean,
    token: null | string,
    user: number,
} = {
    isAuthenticated: false,
    token: null,
    user: 0,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const {accessToken, userId} = action.payload
            state.isAuthenticated = true
            state.token = accessToken
            state.user = userId
        },
        logOut: (state) => {
            state.isAuthenticated = false,
            state.token = null,
            state.user = 0
        }
    }
})

export const {setCredentials, logOut} = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state :RootState) => state.auth.token
export const selectAuthentication = (state :RootState) => state.auth.isAuthenticated
export const selectUser = (state: RootState) => state.auth.user.toString()