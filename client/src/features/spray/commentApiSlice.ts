import apiSlice from "../../app/api/apiSlice";
import { EntityState, createEntityAdapter } from "@reduxjs/toolkit";
import { Comment } from "../../utils/types";

const commentsAdapter = createEntityAdapter<Comment>({})


const commentApiSlice = apiSlice
    .enhanceEndpoints({addTagTypes: ['Comment']})
    .injectEndpoints({
        endpoints: builder => ({
            getComments: builder.query<EntityState<Comment>, {sprayId: string, page: number, count: number}>({
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
                                }
                            }
                        `,
                        variables: {
                            sprayId,
                            page,
                            count
                        }
                    }
                }),
                transformResponse: (response: {data: {comments: Comment[]}}) => {
                    return commentsAdapter.setAll(commentsAdapter.getInitialState(), response.data.comments)
                },
                providesTags: ['Comment']
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
                                }
                            }
                        `,
                        variables: {
                            commentId
                        }
                    }
                }),
                transformResponse: (response: {data: {comment: Comment}}) => response.data.comment,
                providesTags: (_result, _error, arg) => [
                    {type: 'Comment', id: arg.commentId}
                ]
            }),
            addComment: builder.mutation<Comment, {sprayId: string, userId: string, notifierId: string, comment: string}>({
                query: ({sprayId, userId, notifierId, comment}) => ({
                    url: '/graphql',
                    method: 'POST',
                    body: {
                        query: `
                            mutation AddComment($sprayId: ID!, $userId: ID!, notifierId: ID!, comment: String!) {
                                addcComment(sprayId: $sprayId, userId: $userId, notifierId: $notifierId, comment: $comment) {
                                    id
                                }
                            }
                        `,
                        variables: {
                            sprayId,
                            actorId: userId,
                            notifierId,
                            comment
                        }
                    }
                }),
                transformResponse: (response: {data: {addComment: Comment}}) => response.data.addComment,
                invalidatesTags: ['Comment']
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
                invalidatesTags: (_result, _error, arg) => [
                    'Comment',
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
                                }
                            }
                        `,
                        variables: {
                            commentId,
                            sprayId
                        }
                    }
                }),
                transformResponse: (response: {data: {deleteComment: Comment}}) => response.data.deleteComment
            })
        })
    })

export const {
    useGetCommentsQuery
} = commentApiSlice