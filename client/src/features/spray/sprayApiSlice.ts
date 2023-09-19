import apiSlice from "../../app/api/apiSlice";
import { Spray } from "../../utils/types";

const sprayApiSlice = apiSlice.injectEndpoints({
    overrideExisting: false,
    endpoints: builder => ({
        getSprays: builder.query<Spray[], {page: number, count: number, userId: string}>({
            query: ({page, count, userId}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query GetSprays($pagination: PaginationInput!) {
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
                                isLike,
                                isSave,
                                user {
                                    avatar_url
                                    nickname
                                    username
                                    id
                                    isFollow: {
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
                            userId
                        }
                    }
                }
            }),
            transformResponse: (response: {data: {sprays: Spray[]}}) => response.data.sprays
        }),
        getSpray: builder.query<Spray, {id: string}>({
            query: id => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query GetSpray($id: ID!){
                            spray(id: $id) {
                                caption
                                comments
                                cover_url
                                created_on
                                deadline
                                edits
                                draw_permission
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
                    id
                }
            }),
            transformResponse: (response: {data: {spray: Spray}}) => response.data.spray
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
            transformResponse: (response: {data: {resprays: Spray[]}}) => response.data.resprays
        }),
        getSpraysForUser: builder.query<Spray[], {id: string, page: number, count: number}>({
            query: ({id, page, count}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query GetSpraysForUser($id: ID!, $pagination: PaginationInput!){
                            userSprays(id: $id, pagination: $pagination) {
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
            transformResponse: (response: {data: {userSprays: Spray[]}}) => response.data.userSprays
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
            transformResponse: (response: {data: {userResprays: Spray[]}}) => response.data.userResprays
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
            })
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
            transformResponse: (response: {data: {deleteSpray: Spray}}) => response.data.deleteSpray
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