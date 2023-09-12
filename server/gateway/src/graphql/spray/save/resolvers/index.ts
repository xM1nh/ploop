import axios from 'axios'

import { Save } from '../../../../utils/types'

export const resolvers = {
    Query: {
        async saves(_: any, { pagination }: {pagination: {page: number, count: number}}) {
            try {
                const { page, count} = pagination
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8005/saves?page=${page}&count=${count}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async save(_: any, args: {sprayId: number, userId: number}) {
            try {
                const { sprayId, userId } = args
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8005/saves/${sprayId}?userId=${userId}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        }
    },
    Mutation: {
        async save(_: any, args: {sprayId: number, userId: number, notifierId: number}) {
            try {
                const { sprayId, userId, notifierId } = args
                const body = {
                    sprayId,
                    userId,
                    notifierId
                }
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.post(`http://127.0.0.1:8005/saves`, body, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async unsave(_: any, args: {sprayId: number, userId: number}) {
            try {
                const { sprayId, userId } = args
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.delete(`http://127.0.0.1:8005/saves?sprayId=${sprayId}&userId=${userId}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        }
    },
    Save: {
        async spray(parent: Save) {
            try {
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8005/sprays/${parent.spray_id}`, {headers})
                console.log(response.data)
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async user(parent: Save) {
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