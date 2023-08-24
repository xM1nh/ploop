import {pool} from '..'

class ShareRepository {
    async addShare(
        sprayId: number,
        userId: number
    ) {
        const queryString = `INSERT INTO spray_schema.shares (
                                spray_id,
                                user_id
                            ) VALUES (
                                ${sprayId},
                                ${userId}
                            ) RETURNING id`

        const share = (await pool.query(queryString)).rows[0].id
        return share
    }

    async findShareByUserIdAndSprayId(
        sprayId: number,
        userId: number
    ) {
        const queryString = `SELECT 1
                            FROM spray_schema.shares
                            WHERE spray_id = ${sprayId} AND user_id = ${userId}`

        const share = (await pool.query(queryString)).rows[0]
        return share
    }

    async deleteShareByUserIdAndSprayId(
        sprayId: number,
        userId: number
    ) {
        const queryString = `DELETE FROM spray_schema.shares
                            WHERE spray_id = ${sprayId} AND user_id = ${userId}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async deleteSharesByUserId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.shares
                            WHERE user_id = ${id}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async deleteSharesBySprayId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.shares
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
        id: number
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET shares = shares + 1
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
        id: number
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET shares = shares - 1
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

export default ShareRepository