import apiSlice from "../../app/api/apiSlice"

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query({
            query: username => `/${username}`
        })
    })
})

export default userApiSlice

export const {
    useGetUserQuery
} = userApiSlice