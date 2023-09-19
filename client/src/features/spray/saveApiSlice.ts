import apiSlice from "../../app/api/apiSlice"
import { Save } from "../../utils/types"

const saveApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getSaves: builder.query<Save[], {sprayId: string, page: number, count: number}>({
            query: ({sprayId, page, count}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query GetSaves($sprayId: ID!, $pagination: PaginationInput!) {
                            saves(sprayId: $sprayId, pagination: $pagination) {
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
            transformResponse: (response: {data: {saves: Save[]}}) => response.data.saves
        }),
        getSave: builder.query<Save | null, {sprayId: string, userId: string}>({
            query: ({sprayId, userId}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query GetSave($sprayId: ID!, $userId: ID!) {
                            save(sprayId: $sprayId, userId: $userId) {
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
            transformResponse: (response: {data: {save: Save}}) => response.data.save
        }),
        save: builder.mutation<Save, {sprayId: string, userId: string}>({
            query: ({sprayId, userId}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        mutation Save($sprayId: ID!, userId: ID!) {
                            save(sprayId: $sprayId, userId: $userId) {
                                spray {
                                    saves
                                }
                            }
                        }
                    `,
                    variables: {
                        sprayId,
                        userId,
                    }
                }
            }),
            transformResponse: (response: {data: {save: Save}}) => response.data.save
        }),
        unsave: builder.mutation<Save, {sprayId: string, userId: string}>({
            query: ({sprayId, userId}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        mutation Unsave($sprayId: ID!, $userId: ID!) {
                            unsave(sprayId: $sprayId, userId: $userId) {
                                spray {
                                    saves
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
            transformResponse: (response: {data: {unsave: Save}}) => response.data.unsave
        })
    })
})

export const {
    useGetSavesQuery,
    useGetSaveQuery,
    useLazyGetSaveQuery,
    useSaveMutation,
    useUnsaveMutation
} = saveApiSlice