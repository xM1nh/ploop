import apiSlice from "../../app/api/apiSlice";
import { Notification } from "../../utils/types";

const notificationApiSlice = apiSlice
    .enhanceEndpoints({addTagTypes: ['Notification']})
    .injectEndpoints({
        endpoints: builder => ({
            getNotifications: builder.query<Notification[], {userId: string, page: number, count: number}>({
                query: ({userId, page, count}) => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            query GetNotifications($userId: ID!, $pagination: PaginationInput!) {
                                notifications(userId: $userId, pagination: $pagination) {
                                    id
                                    created_on
                                    status
                                    actor {
                                        avatar_url
                                        id
                                        nickname
                                        username
                                    }
                                    entity_type_id
                                    entity {
                                    ... on User {
                                        id
                                    }
                                    ... on Spray {
                                        id
                                    }
                                    }
                                }
                            }
                        `,
                        variables: {
                            userId,
                            pagination: {
                                page,
                                count
                            }
                        }
                    }
                }),
                transformResponse: (response: {data: {notifications: Notification[]}}) => response.data.notifications,
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
                    return currentArg?.page !== previousArg?.page
                },
                providesTags: (result) => {
                    if (result) {
                        return [
                            {type: 'Notification', id: 'LIST'},
                            ...result.map(notification => ({type: 'Notification' as const, id: notification.id}))
                        ]
                    } else return [{type: 'Notification', id: 'LIST'}]
                }
            }),
            getUnreadNotificationsCount: builder.query<number, {userId: string}>({
                query: ({userId}) => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            query getUnreadNotificationsCount($userId: ID!) {
                                unreadNotificationsCount(userId: $userId) 
                            }
                        `,
                        variables: {
                            userId
                        }
                    }
                }),
                transformResponse: (response: {data: {unreadNotificationsCount: number}}) => response.data.unreadNotificationsCount
            }),
            markAsRead: builder.mutation<Notification, {id: string}>({
                query: ({id}) => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            mutation MarkAsRead($id: ID!) {
                                read(id: $id) {
                                    id
                                }
                            }
                        `,
                        variables: {
                            id
                        }
                    }
                }),
                transformResponse: (response: {data: {read: Notification}}) => response.data.read
            }),
            markAsUnread: builder.mutation<Notification, {id: string}>({
                query: ({id}) => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            mutation MarkAsUnread($id: ID!) {
                                unread(id: $id) {
                                    id
                                }
                            }
                        `,
                        variables: {
                            id
                        }
                    }
                }),
                transformResponse: (response: {data: {unread: Notification}}) => response.data.unread
            }),
            markAllAsRead: builder.mutation<void, {userId: string}>({
                query: ({userId}) => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            mutation MarkAllAsRead($userId: ID!) {
                                readAll(userId: $userId)
                            }
                        `,
                        variables: {
                            userId
                        }
                    }
                })
            }),
            markAllAsUnread: builder.mutation<void, {userId: string}>({
                query: ({userId}) => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            mutation MarkAllAsUnread($userId: ID!) {
                                unreadAll(userId: $userId)
                            }
                        `,
                        variables: {
                            userId
                        }
                    }
                })
            })
        })
    })

export const {
    useGetNotificationsQuery,
    useLazyGetNotificationsQuery,
    useMarkAllAsReadMutation,
    useGetUnreadNotificationsCountQuery
} = notificationApiSlice