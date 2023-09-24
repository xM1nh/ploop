import apiSlice from "../../app/api/apiSlice"
import { User, Follow } from "../../utils/types"

const userApiSlice = apiSlice
.enhanceEndpoints({addTagTypes: ['User']})
.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query<User, {userId: string, currentUserId: string}>({
            query: ({userId, currentUserId}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query GetUser($userId: ID!, $currentUserId: ID!) {
                            user(id: $userId) {
                                id
                                username
                                nickname
                                avatar_url
                                bio
                                followings
                                followers
                                isFollow(followerId: $currentUserId) {
                                    id
                                }
                            }
                        }
                    `,
                    variables: {
                        userId,
                        currentUserId
                    }
                }
            }),
            transformResponse: (response: {data: {user: User}}) => response.data.user,
            providesTags: (_, __, arg) => [{type: 'User' as const, id: arg.userId}]
        }),
        follow: builder.mutation<Follow, {userId: string, followeeId: string}>({
            query: ({userId, followeeId}) => ({
                url: `/graphql`,
                method: 'POST',
                body: {
                    query: `
                        mutation Follow($id: ID!, $followeeId: ID!) {
                            follow(id: $id, followeeId: $followeeId) {
                                followee {
                                    followers
                                }
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
                    query: `
                        mutation Unfollow($id: ID!, $followeeId: ID!) {
                            unfollow(id: $id, followeeId: $followeeId) {
                                followee {
                                    followers
                                }
                            }
                        }
                    `,
                    variables: {
                        id: userId,
                        followeeId
                    }
                }
            }),
            transformResponse: (response: {data: {unfollow: Follow}}) => response.data.unfollow
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
        }),
        editUserInfo: builder.mutation<User, {id: string, username: string, nickname: string, bio: string}>({
            query: ({id, username, nickname, bio}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        mutation EditUser($id: ID!, $username: String, $nickname: String, $bio: String) {
                            editUser(id: $id, username: $username, nickname: $nickname, bio: $bio) {
                                id
                            }
                        }
                    `,
                    variables: {
                        id,
                        username,
                        nickname,
                        bio
                    }
                }
            }),
            transformResponse: (response: {data: {editUser: User}}) => response.data.editUser,
            invalidatesTags: (_, __, arg) => [{type: 'User' as const, id: arg.id}]
        }),
        editUserAvatar: builder.mutation<void, {id: string, imageFile: File}>({
            query: ({id, imageFile}) => {
                const formData = new FormData()
                formData.append('avatar', imageFile, id)
                formData.append('id', id)
                return {
                    url: `http://127.0.0.1:8000/upload/avatar`,
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                }
            },
            invalidatesTags: (_, __, arg) => [{type: 'User' as const, id: arg.id}]
        })
    })
})

export default userApiSlice

export const {
    useGetUserQuery,
    useFollowMutation,
    useUnfollowMutation,
    useGetFollowQuery,
    useEditUserAvatarMutation,
    useEditUserInfoMutation
} = userApiSlice