import apiSlice from "../../app/api/apiSlice"
import { Like } from "../../utils/types"

const likeApiSlice = apiSlice
.enhanceEndpoints({addTagTypes: ['Spray']})
.injectEndpoints({
    endpoints: builder => ({
        getLikes: builder.query<Like[], {sprayId: string, page: number, count: number}>({
            query: ({sprayId, page, count}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query GetLikes($sprayId: ID!, $pagination: PaginationInput!) {
                            likes(sprayId: $sprayId, pagination: $pagination) {
                                user: {
                                    avatar_url
                                    nickname
                                    username
                                    id
                                }
                            }
                        }
                    `,
                    variables: {
                        sprayId,
                        pagination: {
                            page,
                            count
                        }
                    }
                }
            }),
            transformResponse: (response: {data: {likes: Like[]}}) => response.data.likes
        }),
        getLike: builder.query<Like | null, {sprayId: string, userId: string}>({
            query: ({sprayId, userId}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query GetLike($sprayId: ID!, $userId: ID!) {
                            like(sprayId: $sprayId, userId: $userId) {
                                id
                            }
                        }
                    `,
                    variables: {
                        sprayId,
                        userId
                    }
                }
            }),
            transformResponse: (response: {data: {like: Like}}) => response.data.like
        }),
        like: builder.mutation<Like, {sprayId: string, userId: string, notifierId: string}>({
            query: ({sprayId, userId, notifierId}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        mutation Like($sprayId: ID!, $userId: ID!, $notifierId: ID!) {
                            like(sprayId: $sprayId, userId: $userId, notifierId: $notifierId) {
                                spray {
                                    likes
                                }
                            }
                        }
                    `,
                    variables: {
                        sprayId,
                        userId,
                        notifierId
                    }
                }
            }),
            transformResponse: (response: {data: {like: Like}}) => response.data.like,
        }),
        unlike: builder.mutation<Like, {sprayId: string, userId: string}>({
            query: ({sprayId, userId}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        mutation Unlike($sprayId: ID!, $userId: ID!) {
                            unlike(sprayId: $sprayId, userId: $userId) {
                                spray {
                                    likes
                                }
                            }
                        }
                    `,
                    variables: {
                        sprayId,
                        userId
                    }
                }
            }),
            transformResponse: (response: {data: {unlike: Like}}) => response.data.unlike
        })
    })
})

export const {
    useGetLikesQuery,
    useGetLikeQuery,
    useLazyGetLikeQuery,
    useLikeMutation,
    useUnlikeMutation
} = likeApiSlice