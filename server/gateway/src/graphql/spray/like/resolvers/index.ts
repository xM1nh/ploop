import axios from 'axios'

import { Like } from '../../../../utils/types'

export const resolvers = {
    Query: {
        async likes(_: any, { pagination }: {pagination: {page: number, count: number}}) {
            try {
                const { page, count} = pagination
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8005/likes?page=${page}&count=${count}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async like(_: any, args: {sprayId: number, userId: number}) {
            try {
                const { sprayId, userId } = args
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8005/likes/${sprayId}?userId=${userId}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        }
    },
    Mutation: {
        async like(_: any, args: {sprayId: number, userId: number, notifierId: number}) {
            try {
                const { sprayId, userId, notifierId } = args
                const body = {
                    sprayId,
                    userId,
                    notifierId
                }
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.post(`http://127.0.0.1:8005/likes`, body, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async unlike(_: any, args: {sprayId: number, userId: number}) {
            try {
                const { sprayId, userId } = args
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.delete(`http://127.0.0.1:8005/likes?sprayId=${sprayId}&userId=${userId}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        }
    },
    Like: {
        async spray(parent: Like) {
            try {
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8005/sprays/${parent.spray_id}`, {headers})
                console.log(response.data)
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async user(parent: Like) {
            try {
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8002/users/${parent.user_id}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        }
    }
}