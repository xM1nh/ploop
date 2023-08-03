import apiSlice from "../../app/api/apiSlice";
import { logOut } from "./authSlice";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        signup: builder.mutation({
            query: credentials => ({
                url: '/signup',
                method: 'POST',
                body: {...credentials}
            })
        }),
        login: builder.mutation({
            query: credentials => ({
                url: '/login',
                method: 'POST',
                body: {...credentials}
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST'
            }),
            async onQueryStarted(_arg, { dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled
                    dispatch(logOut())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState)
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/refresh',
                method: 'GET'
            })
        }),
    })
})

export default authApiSlice

export const {
    useSignupMutation,
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice