import { Save, Pagination, DataSource } from '../../../../utils/types'

export const resolvers = {
    Query: {
        saves: async (_: any, { userId, pagination }: {userId: string, pagination: Pagination}, {dataSources}: {dataSources: DataSource}) => {
            const {page, count} = pagination
            return dataSources.saveApi.getSaves(userId, page, count)
        },
        save: async (_: any, {sprayId, userId}: {sprayId: string, userId: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.saveApi.getSave(sprayId, userId)
        }
    },
    Mutation: {
        save: async (_: any, args: {sprayId: string, userId: string, notifierId: string}, {dataSources}: {dataSources: DataSource}) => {
            const { sprayId, userId, notifierId } = args
            return dataSources.saveApi.save(sprayId, userId, notifierId)
        },
        unsave: async (_: any, {sprayId, userId}: {sprayId: string, userId: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.saveApi.unsave(sprayId, userId)
        }
    },
    Save: {
        spray: async (parent: Save, _: any, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.sprayApi.getSpray(parent.spray_id.toString())
        },
        user: async (parent: Save, _: any, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.userApi.getUser(parent.user_id.toString())
        }
    }
}