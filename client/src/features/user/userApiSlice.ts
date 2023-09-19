import apiSlice from "../../app/api/apiSlice"
import { User, Follow } from "../../utils/types"

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query<User, {userId: string}>({
            query: ({userId}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query GetUser($userId: ID!) {
                            user(id: $userId) {
                                id
                                username
                                nickname
                                avatar_url
                                bio
                                followings
                                followers
                                isFollow: {
                                    id
                                }
                            }
                        }
                    `,
                    variables: {
                        userId
                    }
                }
            }),
            transformResponse: (response: {data: {user: User}}) => response.data.user
        }),
        follow: builder.mutation<Follow, {userId: string, followeeId: string}>({
            query: ({userId, followeeId}) => ({
                url: `/graphql`,
                method: 'POST',
                body: {
                    mutation: `
                        mutation Follow($id: ID!, $followeeId: ID!) {
                            follow(id: $id, followeeId: $followeeId) {
                                id
                            }
                        }
                    `,
                    variables: {
                        id: userId,
                        followeeId
                    }
                }
            }),
            transformResponse: (response: {data: {follow: Follow}}) => response.data.follow
        }),
        unfollow: builder.mutation<Follow, {userId: string, followeeId: string}>({
            query: ({userId, followeeId}) => ({
                url: `/graphql`,
                method: 'POST',
                body: {
                    mutation: `
                        mutation Unfollow($id: ID!, $followeeId: ID!) {
                            unfollow(id: $id, followeeId: $followeeId) {
                                id
                            }
                        }
                    `,
                    variables: {
                        id: userId,
                        followeeId
                    }
                }
            }),
            transformResponse: (response: {data: {follow: Follow}}) => response.data.follow
        }),
        getFollow: builder.query<Follow, {userId: string, followeeId: string}>({
            query: ({userId, followeeId}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query GetFollow($userId: ID!, $followeeId: ID!) {
                            follow(id: $userId, followeeId: $followeeId) {
                                id
                            }
                        }
                    `,
                    variables: {
                        id: userId,
                        followeeId
                    }
                }
            }),
            transformResponse: (response: {data: {follow: Follow}}) => response.data.follow
        })
    })
})

export default userApiSlice

export const {
    useGetUserQuery,
    useFollowMutation,
    useUnfollowMutation,
    useGetFollowQuery,
    useLazyGetFollowQuery,
} = userApiSlice