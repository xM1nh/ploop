import axios from 'axios'

export const resolvers = {
    Query: {
        async user(_: any, args: {id: string}) {
            try {
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8002/users/${args.id}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async follow(_: any, args: {id: string, followeeId: string}) {
            try {
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8002/users/${args.id}/follow?followeeId=${args.followeeId}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async followers(_: any, args: {id: string, pagination: {page: string, count: string}}) {
            try {
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8002/users/${args.id}/followers?page=${args.pagination.page}&count=${args.pagination.count}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async followings(_: any, args: {id: string, pagination: {page: string, count: string}}) {
            try {
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8002/users/${args.id}/followings?page=${args.pagination.page}&count=${args.pagination.count}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        }
    },
    Mutation: {
        async editUser(_: any, args: {id: string, username: string, nickname: string, bio: string}) {
            try {
                const body = {
                    username: args.username,
                    nickname: args.nickname,
                    bio: args.bio
                }
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.put(`http://127.0.0.1:8002/users/${args.id}/`, body, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async deleteUser(_: any, args: {id: string}) {
            try {
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.delete(`http://127.0.0.1:8002/users/${args.id}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async follow(_: any, args: {id: string, followeeId: string}) {
            try {
                const body = {
                    followeeId: args.followeeId
                }
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.post(`http://127.0.0.1:8002/users/${args.id}/follow`, body, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async unfollow(_: any, args: {id: string, followeeId: string}) {
            try {
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.delete(`http://127.0.0.1:8002/users/${args.id}/follow?followeeId=${args.followeeId}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
    }
}