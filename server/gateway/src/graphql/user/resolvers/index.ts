import { DataSource, Pagination } from '../../../utils/types'

export const resolvers = {
    Query: {
        user: async (_: any, {id}: {id: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.userApi.getUser(id)
        },
        follow: async (_: any, {id, followeeId}: {id: string, followeeId: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.userApi.getFollow(id, followeeId)
        },
        followers: async (_: any, {id, pagination}: {id: string, pagination: Pagination}, {dataSources}: {dataSources: DataSource}) => {
            const {page, count} = pagination
            return dataSources.userApi.getFollowers(id, page, count)
        },
        followings: async (_: any, {id, pagination}: {id: string, pagination: Pagination}, {dataSources}: {dataSources: DataSource}) => {
            const {page, count} = pagination
            return dataSources.userApi.getFollowings(id, page, count)
        }
    },
    Mutation: {
        editUser: async (_: any, args: {
            id: string,
            username: string | null | undefined,
            nickname: string | null | undefined,
            bio: string | null | undefined
        }, {dataSources}: {dataSources: DataSource}) => {
            const {
                id,
                username,
                nickname,
                bio
            } = args
            return dataSources.userApi.editUser(id, username, nickname, bio)
        },
        deleteUser: async (_: any, {id}: {id: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.userApi.deleteUser(id)
        },
        follow: async (_: any, {id, followeeId}: {id: string, followeeId: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.userApi.follow(id, followeeId)
        },
        unfollow: async (_: any, {id, followeeId}: {id: string, followeeId: string}, {dataSources}: {dataSources: DataSource}) => {
            return dataSources.userApi.unfollow(id, followeeId)
        },
    }
}