import axios from 'axios'
import {Spray} from '../../../../utils/types'

export const resolvers = {
    Query: {
        async sprays(_: any, args: {pagination: {page: String, count: String}}) {
            try {
                const { page, count} = args.pagination
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8005/sprays?page=${page}&count=${count}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async userSprays(_: any, args: {id: string, pagination: {page: string, count: string}}) {
            try {
                const {id, pagination: {page, count}} = args 
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8005/sprays/users/${id}?page=${page}&count=${count}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async spray(_: any, {id}: {id: string}) {
            try {
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8005/sprays/${id}`, {headers})
                console.log(response.data)
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        }
    },
    Mutation: {
        async deleteSpray(_: any, id: string) {
            try {
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.delete(`http://127.0.0.1:8005/sprays/${id}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async updateSpray(_: any, args: {
            id: string, 
            caption: string, 
            viewPermission: number, 
            drawPermission: number, 
            limited: boolean, 
            deadline: string
        }) {
            try {
                const body = {
                    caption: args.caption,
                    viewPermission: args.viewPermission,
                    drawPermission: args.drawPermission,
                    limited: args.limited,
                    deadline: args.deadline
                }
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.put(`http://127.0.0.1:8005/sprays/${args.id}`, body, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        }
    },
    Spray: {
        async user(parent: Spray) {
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