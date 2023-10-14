import { Pagination, DataSource, Notification } from "../../../utils/types";
import {AMQPPubSub} from 'graphql-amqp-subscriptions'
import { withFilter } from 'graphql-subscriptions'

export const resolvers = {
    Query: {
        notifications: async (_: any, {userId, pagination}: {userId: string, pagination: Pagination}, {dataSources}: {dataSources: DataSource}) => {
            const {page, count} = pagination
            return dataSources.notificationApi.getNotifications(userId, page, count)
        },
        unreadNotificationsCount: async (_: any, {userId}: {userId: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.notificationApi.getUnreadNotifications(userId)
        },
    },
    Mutation: {
        read: async (_: any, {id}: {id: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.notificationApi.read(id)
        },
        unread: async (_: any, {id}: {id: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.notificationApi.unread(id)
        },
        readAll: async (_: any, {userId}: {userId: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.notificationApi.readAll(userId)
        },
        unreadAll: async (_: any, {userId}: {userId: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.notificationApi.unreadAll(userId)
        },
    },
    Subscription: {
        notificationAdded: {
            resolve: (payload: Notification) => {
                console.log(payload)
                return payload
            },
            subscribe: withFilter(
                (_: any, __: any, {pubsub}: {pubsub: AMQPPubSub}) => pubsub.asyncIterator(['NOTIFICATION_ADDED']),
                (payload: Notification, {userId}: {userId: string}) => {
                    //return payload.notifier_id === parseInt(userId)
                    return true
                }
            )
        }
    },
    Notification: {
        actor: async (parent: Notification, _: any, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.userApi.getUser(parent.actor_id.toString())
        },
        notifier: async (parent: Notification, _: any, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.userApi.getUser(parent.notifier_id.toString())
        },
        entity: async (parent: Notification, _: any, {dataSources}: {dataSources: DataSource}) => {
            if (parent.entity_type_id < 200) {
                return {
                    __typename: 'System',
                }
            }
            else if (parent.entity_type_id < 300) {
                const user = await dataSources.userApi.getUser(parent.entity_id.toString())
                return {
                    __typename: 'User',
                    ...user
                }
            }
            else if (parent.entity_type_id < 400) {
                const spray = await dataSources.sprayApi.getSpray(parent.entity_id.toString())
                return {
                    __typename: 'Spray',
                    ...spray
                }
            }
        }
    }
}