import {pool} from '..'

class LikeRepository {
    async addLike(
        sprayId: number,
        userId: number
    ) {
        const queryString = `INSERT INTO spray_schema.likes (
                                spray_id,
                                user_id
                            ) VALUES (
                                ${sprayId},
                                ${userId}
                            ) RETURNING id`

        const like = (await pool.query(queryString)).rows[0].id
        return like
    }

    async findLikesBySprayId(
        id: number,
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT 
                                u.username
                            FROM spray_schema.likes l
                                INNER JOIN user_schema.users AS u ON l.user_id = u.id
                            WHERE l.spray_id = ${id}
                            LIMIT ${limit} OFFSET ${offset}`

        const likes = (await pool.query(queryString)).rows
        return likes
    }

    async findLikeByUserIdAndSprayId(
        sprayId: number,
        userId: number
    ) {
        const queryString = `SELECT 1
                            FROM spray_schema.likes
                            WHERE spray_id = ${sprayId} AND user_id = ${userId}`

        const like = (await pool.query(queryString)).rows[0]
        return like
    }

    async deleteLikeByUserIdAndSprayId(
        sprayId: number,
        userId: number
    ) {
        const queryString = `DELETE FROM spray_schema.likes
                            WHERE spray_id = ${sprayId} AND user_id = ${userId}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async deleteLikesByUserId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.likes
                            WHERE user_id = ${id}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async deleteLikesBySprayId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.likes
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
                            SET likes = likes + 1
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
                            SET likes = likes - 1
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

export default LikeRepository