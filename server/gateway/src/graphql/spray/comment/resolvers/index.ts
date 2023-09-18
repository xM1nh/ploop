import { Comment, DataSource, Pagination } from '../../../../utils/types'
import {AMQPPubSub} from 'graphql-amqp-subscriptions'
import { withFilter } from 'graphql-subscriptions'

export const resolvers = {
    Query: {
        comments: async (_: any, {sprayId, pagination}: {sprayId: string, pagination: Pagination}, {dataSources}: {dataSources: DataSource}) => {
            const {page, count} = pagination
            return dataSources.commentApi.getComments(sprayId, page, count)
        },
        comment: async (_: any, {commentId}: {commentId: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.commentApi.getComment(commentId)
        }
    },
    Mutation: {
        addComment: async (_: any, args: {
            sprayId: string, 
            userId: string, 
            notifierId: string,
            comment: string
        }, {pubsub, dataSources}: {pubsub: AMQPPubSub,dataSources: DataSource}) => {
            const {sprayId, userId, notifierId, comment} = args
            const newComment = await dataSources.commentApi.addComment(sprayId, userId, notifierId, comment)

            pubsub.publish('COMMENT_ADDED', {...newComment})

            return newComment
        },
        editComment: async (_: any, {commentId, newComment}: {commentId: string, newComment: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.commentApi.editComment(commentId, newComment)
        },
        deleteComment: async (_: any, {commentId, sprayId}: {commentId: string, sprayId: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.commentApi.deleteComment(commentId, sprayId)
        }
    },
    Subscription: {
        commentAdded: {
            resolve: (payload: Comment) => payload,
            subscribe: withFilter(
                (_: any, __: any, {pubsub}: {pubsub: AMQPPubSub}) => pubsub.asyncIterator(['COMMENT_ADDED']),
                (payload: Comment, variables: {sprayId: string}) => {
                    return payload.spray_id === parseInt(variables.sprayId)
                }
            )
        }
    },
    Comment: {
        spray: async (parent: Comment, _: any, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.sprayApi.getSpray(parent.spray_id.toString())
        },
        user: async (parent: Comment, _: any, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.userApi.getUser(parent.user_id.toString())
        }
    }
}