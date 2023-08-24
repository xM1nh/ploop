import {pool} from '..'

class SaveRepository {
    async addSave(
        sprayId: number,
        userId: number
    ) {
        const queryString = `INSERT INTO spray_schema.saves (
                                spray_id,
                                user_id
                            ) VALUES (
                                ${sprayId},
                                ${userId}
                            ) RETURNING id`

        const save = (await pool.query(queryString)).rows[0].id
        return save
    }

    async findSavesByUserId(
        id: number,
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT 
                                sp.id,
                                sp.url,
                                sp.created_on,
                                sp.creator_id,
                                sp.caption,
                                sp.likes,
                                sp.edits,
                                sp.comments,
                                sp.saves,
                                sp.shares
                            FROM spray_schema.saves sa
                                INNER JOIN spray_schema.sprays AS sp WHERE sa.spray_id = sp.id
                            WHERE sa.user_id = ${id}
                            ORDER BY sa.created_on
                            LIMIT ${limit} OFFSET ${offset}`

        const saves = (await pool.query(queryString)).rows
        return saves
    }

    async findSaveByUserIdAndSprayId(
        sprayId: number,
        userId: number
    ) {
        const queryString = `SELECT 1
                            FROM spray_schema.saves
                            WHERE spray_id = ${sprayId} AND user_id = ${userId}`

        const save = (await pool.query(queryString)).rows[0]
        return save
    }

    async deleteSaveByUserIdAndSprayId(
        sprayId: number,
        userId: number
    ) {
        const queryString = `DELETE FROM spray_schema.saves
                            WHERE spray_id = ${sprayId} AND user_id = ${userId}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async deleteSavesByUserId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.saves
                            WHERE user_id = ${id}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async deleteSavesBySprayId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.saves
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
                            SET saves = saves + 1
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
                            SET saves = saves - 1
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

export default SaveRepository