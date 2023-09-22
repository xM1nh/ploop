import apiSlice from "../../app/api/apiSlice";
import { Comment } from "../../utils/types";

const commentApiSlice = apiSlice
.enhanceEndpoints({addTagTypes: ['Comment']})
.injectEndpoints({
    endpoints: builder => ({
        getComments: builder.query<Comment[], {sprayId: string, page: number, count: number}>({
            query: ({sprayId, page, count}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query GetComments($sprayId: ID!, $pagination: PaginationInput!) {
                            comments(sprayId: $sprayId, pagination: $pagination) {
                                id
                                created_on
                                likes
                                description
                                user {
                                    id  
                                    username
                                    nickname
                                    avatar_url
                                }
                                spray {
                                    comments
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
            transformResponse: (response: {data: {comments: Comment[]}}) => response.data.comments,
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
                        {type: 'Comment', id: 'LIST'},
                        ...result.map(spray => ({type: 'Comment' as const, id: spray.id}))
                    ]
                } else return [{type: 'Comment', id: 'LIST'}]
            }
        }),
        getComment: builder.query<Comment, {commentId: number}>({
            query: ({commentId}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query GetComment($commentId: ID!) {
                            comment(commentId: $commentId) {
                                id
                                created_on
                                likes
                                description
                                user {
                                    id
                                    username
                                    nickname
                                    avatar_url
                                }
                                spray {
                                    comments
                                }
                            }
                        }
                    `,
                    variables: {
                        commentId
                    }
                }
            }),
            transformResponse: (response: {data: {comment: Comment}}) => response.data.comment,
            providesTags: (_, __, args) => [{type: 'Comment', id: args.commentId}]
        }),
        addComment: builder.mutation<Comment, {sprayId: string, userId: string, notifierId: string, comment: string}>({
            query: ({sprayId, userId, notifierId, comment}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        mutation AddComment($sprayId: ID!, $userId: ID!, $notifierId: ID!, $comment: String!) {
                            addComment(sprayId: $sprayId, userId: $userId, notifierId: $notifierId, comment: $comment) {
                                id
                                created_on
                                likes
                                description
                                user {
                                    id
                                    username
                                    nickname
                                    avatar_url
                                }
                                spray {
                                    comments
                                }
                            }
                        }
                    `,
                    variables: {
                        sprayId,
                        userId,
                        notifierId,
                        comment
                    }
                }
            }),
            transformResponse: (response: {data: {addComment: Comment}}) => response.data.addComment,
            invalidatesTags: (_, __, arg) => [
                {type: 'Comment', id: arg.sprayId}
            ]
        }),
        editComment: builder.mutation<Comment, {commentId: string, newComment: string}>({
            query: ({commentId, newComment}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        mutation EditComment($commentId: ID!, $newComment: String!) {
                            editComment(commentId: $commentId, newComment: $newComment) {
                                id
                                created_on
                                likes
                                description
                                user {
                                    id
                                    username
                                    nickname
                                    avatar_url
                                }
                                spray {
                                    comments
                                }
                            }
                        }
                    `,
                    variables: {
                        commentId,
                        newComment
                    }
                }
            }),
            transformResponse: (response: {data: {editComment: Comment}}) => response.data.editComment,
            invalidatesTags: (_, __, arg) => [
                {type: 'Comment', id: arg.commentId}
            ]
        }),
        deleteComment: builder.mutation<Comment, {commentId: string, sprayId: string}>({
            query: ({commentId, sprayId}) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        mutation DeleteComment($commentId: ID!, $sprayId: ID!) {
                            deleteComment(commentId: $commentId, sprayId: $sprayId) {
                                id
                                created_on
                                likes
                                description
                                user {
                                    id
                                    username
                                    nickname
                                    avatar_url
                                }
                                spray {
                                    comments
                                }
                            }
                        }
                    `,
                    variables: {
                        commentId,
                        sprayId
                    }
                }
            }),
            transformResponse: (response: {data: {deleteComment: Comment}}) => response.data.deleteComment,
            invalidatesTags: (_, __, arg) => [
                {type: 'Comment', id: arg.sprayId}
            ]
        })
    })
})

export const {
    useGetCommentsQuery,
    useAddCommentMutation
} = commentApiSlice