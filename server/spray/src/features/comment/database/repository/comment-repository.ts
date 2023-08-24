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
                            ) RETURNING id`

        const comment = (await pool.query(queryString)).rows[0].id
        return comment
    }

    async findCommentsBySprayId(
        id: number,
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT 
                                c.id,
                                u.username,
                                c.description,
                                c.created_on
                            FROM spray_schema.comments c
                                INNER JOIN user_scheme.users AS u ON c.user_id = u.id
                            WHERE c.spray_id = ${id}
                            ORDER BY c.created_on
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
                            WHERE id = ${id}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async deleteCommentById(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.comments
                            WHERE id = ${id}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async deleteCommentsByUserId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.comments
                            WHERE user_id = ${id}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async deleteCommentsBySprayId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.comments
                            WHERE spray_id = ${id}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async increaseCount(
        id: number,
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET comments = comments + 1
                            WHERE id = ${id}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async decreaseCount(
        id: number,
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET comments = comments + 1
                            WHERE id = ${id}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }
}

export default CommentRepository