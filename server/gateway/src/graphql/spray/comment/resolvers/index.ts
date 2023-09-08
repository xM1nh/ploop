import axios from 'axios'
import { Comment } from '../../../../utils/types'

export const resolvers = {
    Query: {
        async comments(_: any, args: {sprayId: string, pagination: {page: String, count: String}}) {
            try {
                const {sprayId, pagination: {page, count}} = args
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8005/comments?sprayId=${sprayId}&page=${page}&count=${count}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            } 
        },
        async comment(_: any, args: {commentId: string}) {
            try {
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8005/comments/${args.commentId}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        }
    },
    Mutation: {
        async addComment(_: any, args: {
            sprayId: string, 
            actorId: string, 
            notifierId: string,
            comment: string
        }) {
            try {
                const {sprayId, actorId, notifierId, comment} = args
                const body = {
                    sprayId,
                    actorId,
                    notifierId,
                    comment
                }
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.post(`http://127.0.0.1:8005/comments`, body, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            } 
        },
        async editComment(_: any, args: {
            commentId: string,
            newComment: string
        }) {
            try {
                const {commentId, newComment} = args
                const body = {
                    newComment
                }
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.put(`http://127.0.0.1:8005/comments/${commentId}`, body, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            } 
        },
        async deleteComment(_: any, args: {commentId: string, sprayId: string}) {
            try {
                const {commentId, sprayId} = args
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.delete(`http://127.0.0.1:8005/comments/${commentId}?sprayId=${sprayId}`, {headers})
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        }
    },
    Comment: {
        async spray(parent: Comment) {
            try {
                const headers = { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8000' }
                const response = await axios.get(`http://127.0.0.1:8005/sprays/${parent.spray_id}`, {headers})
                console.log(response.data)
                return response.data
            } catch (e) {
                throw new Error(`Failed to fetch data from the REST API ${e}`)
            }
        },
        async user(parent: Comment) {
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