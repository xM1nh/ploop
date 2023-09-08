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

    async getComment(
        id: number
    ) {
        const comment = await this.repository.findCommentById(id)
        return comment
    }

    async comment(
        sprayId: number,
        userId: number,
        comment: string
    ) {
        const commentId = await this.repository.addComment(sprayId, userId, comment)
        await this.repository.increaseCount(sprayId, 1)
        return commentId
    }

    async editComment(
        id: number,
        newComment: string
    ) {
        const comment = await this.repository.editComment(id, newComment)
        return comment
    }

    async deleteComment(
        sprayId: number,
        commentId: number
    ) {
        const comment = await this.repository.deleteCommentById(commentId)
        await this.repository.decreaseCount(sprayId, 1)
        return comment
    }

    async deleteAllCommentsBySprayId(
        id: number
    ) {
        const count = await this.repository.deleteCommentsBySprayId(id)
    }

    async deleteAllCommentsByUserId(
        id: number
    ) {
        const deletedComments = await this.repository.deleteCommentsByUserId(id)
        const groupedBySprayId: {
            [key: string]: number
        } = {}

        deletedComments.forEach((comment: {spray_id: number}) => {
            if (groupedBySprayId[comment.spray_id]) groupedBySprayId[comment.spray_id]++
            else groupedBySprayId[comment.spray_id] = 1
        })

        for (const key in Object.entries(groupedBySprayId)) {
            await this.repository.decreaseCount(parseInt(key), groupedBySprayId[key])
        }
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