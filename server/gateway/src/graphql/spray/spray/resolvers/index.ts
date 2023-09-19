import {Pagination, Spray, DataSource} from '../../../../utils/types'

export const resolvers = {
    Query: {
        sprays: async (_: any, {pagination}: { pagination: Pagination }, { dataSources }: { dataSources: DataSource}) => {
            const {page, count} = pagination
            return dataSources.sprayApi.getSprays(page, count)
        },
        userSprays: async (_: any, {userId, pagination}: { userId: string, pagination: Pagination }, { dataSources }: { dataSources: DataSource }) => {
            const {page, count} = pagination
            return dataSources.sprayApi.getUserSprays(userId, page, count)
        },
        spray: async (_: any, {id}: {id: string}, { dataSources }: { dataSources: DataSource }) => {
            return dataSources.sprayApi.getSpray(id)
        },
        resprays: (_: any, {id, pagination}: {id: string, pagination: Pagination}, { dataSources }: { dataSources: DataSource}) => {
            const { page, count } = pagination
            return dataSources.sprayApi.getResprays(id, page, count)
        },
        userResprays: async (_: any, {userId, pagination}: {userId: string, pagination: Pagination}, { dataSources }: { dataSources: DataSource }) => {
            const{ page, count } = pagination
            return dataSources.sprayApi.getUserResprays(userId, page, count)
        },
    },
    Mutation: {
        deleteSpray: async (_: any, {id}: {id: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.sprayApi.deleteSpray(id)
        },
        editSpray: async (_: any, args: {
            id: string,
            caption: string | null | undefined, 
            viewPermission: string | null | undefined, 
            drawPermission: string | null | undefined, 
            limited: string | null | undefined,
            deadline: string | null | undefined
        }, {dataSources}: {dataSources: DataSource}) => {
            const {
                id,
                caption,
                viewPermission,
                drawPermission,
                limited,
                deadline
            } = args
            return dataSources.sprayApi.editSpray(id, caption, viewPermission, drawPermission, limited, deadline)
        },
    },
    Spray: {
        user: async (parent: Spray, _: any, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.userApi.getUser(parent.user_id.toString())
        },
        isLike: async(parent: Spray, {userId}: {userId: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.likeApi.getLike(parent.id.toString(), userId)
        },
        isSave: async(parent: Spray, {userId}: {userId: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.saveApi.getSave(parent.id.toString(), userId)
        }
    }
}