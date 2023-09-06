import apiSlice from "../../app/api/apiSlice"

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query({
            query: userId => `/user/${userId}`,
        }),
        follow: builder.mutation({
            query: (body) => ({
                url: `/user/follow`,
                method: 'POST',
                body: {...body}
            }),
        }),
        unfollow: builder.mutation({
            query: (body) => ({
                url: `/user/follow`,
                method: 'DELETE',
                body: {...body}
            })
        }),
        getFollow: builder.query({
            query: ({followerId, followeeId}) => `/user/follow?followerId=${followerId}&followeeId=${followeeId}`
        })
    })
})

export default userApiSlice

export const {
    useGetUserQuery,
    useFollowMutation,
    useUnfollowMutation,
    useGetFollowQuery
} = userApiSlice