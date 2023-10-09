import apiSlice from "../../app/api/apiSlice";
import { Spray } from "../../utils/types";

const sprayApiSlice = apiSlice
    .enhanceEndpoints({addTagTypes: ['Spray']})
    .injectEndpoints({
        overrideExisting: false,
        endpoints: builder => ({
            getSprays: builder.query<Spray[], {page: number, count: number, userId: string}>({
                query: ({page, count, userId}) => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            query GetSprays($userId: ID!, $pagination: PaginationInput!) {
                                sprays(pagination: $pagination) {
                                    caption
                                    comments
                                    cover_url
                                    created_on
                                    deadline
                                    draw_permission
                                    edits
                                    id
                                    likes
                                    limited
                                    original_id
                                    saves
                                    shares
                                    url
                                    view_permission
                                    isLike(userId: $userId) {
                                        id
                                    }
                                    isSave(userId: $userId) {
                                        id
                                    }
                                    user {
                                        avatar_url
                                        nickname
                                        username
                                        id
                                        isFollow(followerId: $userId) {
                                            id
                                        }
                                    }
                                }
                            }
                        `,
                        variables: {
                            pagination: {
                                page,
                                count,
                            },
                            userId
                        }
                    }
                }),
                transformResponse: (response: {data: {sprays: Spray[]}}) => response.data.sprays,
                serializeQueryArgs: ({ endpointName }) => {
                    return endpointName
                },
                merge: (currentCache, newItems, {arg}) => {
                    if (arg.page > 1) {
                        currentCache.push(...newItems)
                        return currentCache
                    }
                    return newItems
                },
                forceRefetch({currentArg, previousArg}) {
                    return currentArg?.page === 1 || currentArg?.page !== previousArg?.page
                },
                providesTags: (result) => {
                    if (result) {
                        return [
                            {type: 'Spray', id: 'LIST'},
                            ...result.map(spray => ({type: 'Spray' as const, id: spray.id}))
                        ]
                    } else return [{type: 'Spray', id: 'LIST'}]
                }
            }),
            getSpray: builder.query<Spray, {id: string, userId: string}>({
                query: ({id, userId}) => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            query GetSpray($id: ID!, $userId: ID!){
                                spray(id: $id) {
                                    caption
                                    comments
                                    cover_url
                                    created_on
                                    deadline
                                    draw_permission
                                    edits
                                    id
                                    likes
                                    limited
                                    original_id
                                    saves
                                    shares
                                    url
                                    view_permission
                                    isLike(userId: $userId) {
                                        id
                                    }
                                    isSave(userId: $userId) {
                                        id
                                    }
                                    user {
                                        avatar_url
                                        nickname
                                        username
                                        id
                                        isFollow(followerId: $userId) {
                                            id
                                        }
                                    }
                                }
                            }
                        `,
                        variables: {
                            id,
                            userId
                        }
                    }
                }),
                transformResponse: (response: {data: {spray: Spray}}) => response.data.spray,
                providesTags: (_, __, arg) => [{type: 'Spray', id: arg.id}]
            }),
            getResprays: builder.query<Spray[], {id: string, page: number, count: number}>({
                query: ({id, page, count}) => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            query GetResprays($id: ID!, $pagination: PaginationInput!) {
                                resprays(id: $id, pagination: $pagination) {
                                    caption
                                    comments
                                    cover_url
                                    created_on
                                    deadline
                                    draw_permission
                                    edits
                                    id
                                    likes
                                    limited
                                    original_id
                                    saves
                                    shares
                                    url
                                    view_permission
                                    user {
                                        avatar_url
                                        nickname
                                        username
                                        id
                                    }
                                }
                            }
                        `
                    },
                    variables: {
                        id,
                        pagination: {
                            page,
                            count
                        }
                    }
                }),
                transformResponse: (response: {data: {resprays: Spray[]}}) => response.data.resprays,
                providesTags: ['Spray']
            }),
            getSpraysForUser: builder.query<Spray[], {id: string, page: number, count: number}>({
                query: ({id, page, count}) => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            query GetSpraysForUser($id: ID!, $pagination: PaginationInput!){
                                userSprays(userId: $id, pagination: $pagination) {
                                    caption
                                    comments
                                    cover_url
                                    created_on
                                    deadline
                                    draw_permission
                                    edits
                                    id
                                    likes
                                    limited
                                    original_id
                                    saves
                                    shares
                                    url
                                    view_permission
                                }
                            }
                        `,
                        variables: {
                            id,
                            pagination: {
                                page,
                                count
                            }
                        }
                    }
                }),
                transformResponse: (response: {data: {userSprays: Spray[]}}) => response.data.userSprays,
                providesTags: ['Spray']
            }),
            getRespraysForUser: builder.query<Spray[], {id: string, page: number, count: number}>({
                query: ({id, page, count}) => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            query GetRespraysForUser($id: ID!, $pagination: PaginationInput!){
                                userResprays(id: $id, pagination: $pagination) {
                                    caption
                                    comments
                                    cover_url
                                    created_on
                                    deadline
                                    draw_permission
                                    edits
                                    id
                                    likes
                                    limited
                                    original_id
                                    saves
                                    shares
                                    url
                                    view_permission
                                }
                            }
                        `
                    },
                    variables: {
                        id,
                        pagination: {
                            page,
                            count
                        }
                    }
                }),
                transformResponse: (response: {data: {userResprays: Spray[]}}) => response.data.userResprays,
                providesTags: ['Spray']
            }),
            updateSpray: builder.mutation<Spray, {id: string, caption?: string, viewPermisson?: number, drawPermission?: number, limited?: number, deadline?: string}> ({
                query: ({id, caption, viewPermisson, drawPermission, limited, deadline}) => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            mutation UpdateSpray($id: ID!, $caption: String, $viewPermission: Int, $drawPermission: Int, $limtied: Boolean, deadline: String) {
                                updateSpray(id: $id, caption: $caption, viewPermission: $viewPermission, drawPermission: $drawPermission, limited: $limited, deadline: $deadline) {
                                    id
                                }
                            }
                        `,
                        variables: {
                            id,
                            caption,
                            viewPermisson,
                            drawPermission,
                            limited,
                            deadline
                        }
                    }
                }),
                transformResponse: (response: {data: {updateSpray: Spray}}) => response.data.updateSpray,
                invalidatesTags: (_, __, arg) => [
                    {type: 'Spray', id: arg.id}
                ]
            }),
            deleteSpray: builder.mutation<Spray, {id: string}>({
                query: id => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            mutation DeleteSpray($id: ID!) {
                                deleteSpray(id: $id) {
                                    id
                                }
                            }
                        `
                    },
                    variables: {
                        id
                    }
                }),
                transformResponse: (response: {data: {deleteSpray: Spray}}) => response.data.deleteSpray,
                invalidatesTags: (_, __, arg) => [
                    {type: 'Spray', id: arg.id}
                ]
            })
        })
    })

export const {
    useGetSpraysQuery,
    useGetSprayQuery,
    useDeleteSprayMutation,
    useGetRespraysForUserQuery,
    useGetRespraysQuery,
    useGetSpraysForUserQuery,
    useLazyGetSpraysQuery
} = sprayApiSlice