import { Pagination, DataSource, Notification } from "../../../utils/types";

export const resolvers = {
    Query: {
        notifications: async (_: any, {userId, pagination}: {userId: string, pagination: Pagination}, {dataSources}: {dataSources: DataSource}) => {
            const {page, count} = pagination
            return dataSources.notificationApi.getNotifications(userId, page, count)
        }
    },
    Mutation: {
        read: async (_: any, {id}: {id: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.notificationApi.read(id)
        },
        unread: async (_: any, {id}: {id: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.notificationApi.unread(id)
        },
    },
    Notification: {
        actor: async (parent: Notification, _: any, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.userApi.getUser(parent.actor_id.toString())
        },
        notifier: async (parent: Notification, _: any, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.userApi.getUser(parent.notifier_id.toString())
        },
        entity: async (parent: Notification, _: any, {dataSources}: {dataSources: DataSource}) => {
            if (parent.entity_type_id < 200) return
            else if (parent.entity_type_id < 300) return dataSources.userApi.getUser(parent.entity_id.toString())
            else if (parent.entity_type_id < 400) return dataSources.sprayApi.getSpray(parent.entity_id.toString())
        }
    }
}