import apiSlice from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        signup: builder.mutation({
            query: credentials => ({
                url: 'http://127.0.0.1:8001/signup',
                method: 'POST',
                body: {...credentials}
            })
        }),
        login: builder.mutation({
            query: credentials => ({
                url: 'http://127.0.0.1:8001/login',
                method: 'POST',
                body: {...credentials}
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: 'http://127.0.0.1:8001/logout',
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
        refresh: builder.mutation<{accessToken: string, userId: object}, void>({
            query: () => ({
                url: 'http://127.0.0.1:8001/refresh',
                method: 'GET'
            }),
            async onQueryStarted(_arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled
                    const {accessToken, userId} = data

                    dispatch(setCredentials({accessToken, userId}))
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