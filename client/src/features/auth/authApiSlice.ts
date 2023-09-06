import apiSlice from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        signup: builder.mutation({
            query: credentials => ({
                url: '/auth/signup',
                method: 'POST',
                body: {...credentials}
            })
        }),
        login: builder.mutation({
            query: credentials => ({
                url: '/auth/login',
                method: 'POST',
                body: {...credentials}
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
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
        refresh: builder.mutation<{accessToken: string, user: object}, void>({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET'
            }),
            async onQueryStarted(_arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled
                    const {accessToken, user} = data
                    dispatch(setCredentials({accessToken, user}))
                } catch (e) {
                    console.error(e)
                }
            }
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