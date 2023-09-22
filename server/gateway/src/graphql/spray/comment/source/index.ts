import { AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest'
import { Comment } from '../../../../utils/types'
import { ValueOrPromise } from '@apollo/datasource-rest/dist/RESTDataSource'

export default class CommentSource extends RESTDataSource {
    override baseURL = 'http://127.0.0.1:8005/comments/'

    override willSendRequest(path: string, request: AugmentedRequest): ValueOrPromise<void> {
        request.headers['Content-Type'] = 'application/json'
        request.headers['Origin'] = 'http://localhost:8000'
    }

    async getComments(sprayId: string, page: number, count: number) {
        return this.get<Comment[]>(``, {
            params: {
                sprayId,
                page: page.toString(),
                count: count.toString()
            }
        })
    }

    async getComment(commentId: string) {
        return this.get<Comment>(`${commentId}`)
    }

    async addComment(sprayId: string, userId: string, notifierId: string, comment: string) {
        const body = {
            sprayId,
            userId,
            notifierId,
            comment
        }
        return this.post<Comment>(``, {body})
    }

    async editComment(commentId: string, newComment: string) {
        return this.put<Comment>(`${commentId}`, {body: newComment})
    }

    async deleteComment(commentId: string, sprayId: string) {
        return this.delete<Comment>(`${commentId}?sprayId=${sprayId}`)
    }
}