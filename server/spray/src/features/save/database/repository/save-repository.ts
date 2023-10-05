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
                                $1,
                                $2
                            ) RETURNING *`
        const values = [sprayId, userId]

        try {
            const save = (await pool.query(queryString, values)).rows[0]
            return save
        } catch (e) {
            throw e
        }
    }

    async findSavesByUserId(
        id: number,
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT *
                            FROM spray_schema.saves
                            WHERE user_id = $1
                            ORDER BY created_on
                            LIMIT $2 OFFSET $3`
        const values = [id, limit, offset]
        
        try {
            const saves = (await pool.query(queryString, values)).rows
            return saves
        } catch (e) {
            throw e
        }
    }

    async findSaveByUserIdAndSprayId(
        sprayId: number,
        userId: number
    ) {
        const queryString = `SELECT *
                            FROM spray_schema.saves
                            WHERE spray_id = $1 AND user_id = $2`
        const values = [sprayId, userId]
                        
        try {
            const save = (await pool.query(queryString, values)).rows[0]
            return save
        } catch (e) {
            throw e
        }
    }

    async deleteSaveByUserIdAndSprayId(
        sprayId: number,
        userId: number
    ) {
        const queryString = `DELETE FROM spray_schema.saves
                            WHERE spray_id = $1 AND user_id = $2
                            RETURNING *`
        const values = [sprayId, userId]

        try {
            const response = (await pool.query(queryString, values)).rows[0]
            return response
        } catch (e) {
            throw e
        }
    }

    async deleteSavesByUserId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.saves
                            WHERE user_id = $1
                            RETURNING spray_id`

        try {
            const response = (await pool.query(queryString, [id])).rows
            return response
        } catch (e) {
            throw e
        }
    }

    async deleteSavesBySprayId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.saves
                            WHERE spray_id = $1`

        try {
            await pool.query(queryString, [id])
        } catch (e) {
            throw e
        }
    }

    async increaseCount(
        id: number,
        amount: number
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET saves = saves + $1
                            WHERE id = $2`
        const values = [amount, id]

        try {
            await pool.query(queryString, values)
        } catch (e) {
            throw e
        }
    }

    async decreaseCount(
        id: number,
        amount: number
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET saves = saves - $1
                            WHERE id = $2`
        const values = [amount, id]

        try {
            await pool.query(queryString, values)
        } catch (e) {
            throw e
        }
    }
}

export default SaveRepository