import { CommentRepository } from "../database";

class CommentService {
    repository: CommentRepository

    constructor() {
        this.repository = new CommentRepository()
    }

    async getComments(
        id: number,
        limit: number,
        offset: number
    ) {
        const comments = await this.repository.findCommentsBySprayId(id, limit, offset)

        return comments
    }

    async comment(
        sprayId: number,
        userId: number,
        comment: string
    ) {
        const commentId = await this.repository.addComment(sprayId, userId, comment)
        await this.repository.increaseCount(sprayId)

        return commentId
    }

    async editComment(
        id: number,
        newComment: string
    ) {
        await this.repository.editComment(id, newComment)
    }

    async deleteComment(
        sprayId: number,
        commentId: number
    ) {
        await this.repository.deleteCommentById(commentId)
        await this.repository.decreaseCount(sprayId)
    }

    async deleteAllCommentsBySprayId(
        id: number
    ) {
        await this.repository.deleteCommentsBySprayId(id)
    }

    async deleteAllCommentsByUserId(
        id: number
    ) {
        await this.repository.deleteCommentsByUserId(id)
    }

    async subscribeEvents(payload: string) {
        const message = JSON.parse(payload)

        const {event, data} = message

        const {
            userId
        } = data

        switch(event) {
            case 'DELETE_USER':
                await this.deleteAllCommentsByUserId(userId)
            default:
                break
        }
    }
}

export default CommentService