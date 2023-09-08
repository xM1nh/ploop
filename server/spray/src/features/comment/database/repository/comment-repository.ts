import {pool} from '..'

class CommentRepository {
    async addComment(
        sprayId: number,
        userId: number,
        description: string
    ) {
        const queryString = `INSERT INTO spray_schema.comments (
                                spray_id,
                                user_id,
                                description
                            ) VALUES (
                                ${sprayId},
                                ${userId},
                                '${description}'
                            ) RETURNING *`

        const comment = (await pool.query(queryString)).rows[0]
        return comment
    }

    async findCommentById(
        id: number
    ) {
        const queryString = `SELECT *   
                            FROM spray_schema.comments
                            WHERE id = ${id}`

        const comment = (await pool.query(queryString)).rows[0]
        return comment
    }

    async findCommentsBySprayId(
        id: number,
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT *   
                            FROM spray_schema.comments
                            WHERE spray_id = ${id}
                            ORDER BY created_on
                            LIMIT ${limit} OFFSET ${offset}`

        const comments = (await pool.query(queryString)).rows
        return comments
    }

    async editComment(
        id: number,
        newComment: string
    ) {
        const queryString = `UPDATE spray_schema.comments
                            SET description = '${newComment}'
                            WHERE id = ${id}
                            RETURNING *`

        try {
            const response = (await pool.query(queryString)).rows[0]
            return response
        } catch (e) {
            throw e
        }
    }

    async deleteCommentById(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.comments
                            WHERE id = ${id}
                            RETURNING *`

        try {
            const response = (await pool.query(queryString)).rows[0]
            return response
        } catch (e) {
            throw e
        }
    }

    async deleteCommentsByUserId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.comments
                            WHERE user_id = ${id}
                            RETURNING spray_id`

        try {
            const deletedComments = (await pool.query(queryString)).rows
            return deletedComments
        } catch (e) {
            throw e
        }
    }

    async deleteCommentsBySprayId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.comments
                            WHERE spray_id = ${id}`

        try {
            await pool.query(queryString)
        } catch (e) {
            throw e
        }
    }

    async increaseCount(
        id: number,
        amount: number
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET comments = comments + ${amount}
                            WHERE id = ${id}`

        try {
            await pool.query(queryString)
        } catch (e) {
            throw e
        }
    }

    async decreaseCount(
        id: number,
        amount: number
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET comments = comments - ${amount}
                            WHERE id = ${id}`

        try {
            await pool.query(queryString)
        } catch (e) {
            throw e
        }
    }
}

export default CommentRepository