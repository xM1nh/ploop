import {pool} from '..'

class EditRepository {
    async addEdit(
        sprayId: number,
        userId: number,
        editUrl: string
    ) {
        const queryString = `INSERT INTO spray_schema.edits (
                                spray_id,
                                user_id,
                                edit_url
                            ) VALUES (
                                ${sprayId},
                                ${userId},
                                '${editUrl}'
                            ) RETURNING id`

        const edit = (await pool.query(queryString)).rows[0].id
        return edit
    }

    async findEditsByUserId(
        id: number,
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT *
                            FROM spray_schema.edits
                            WHERE user_id = ${id}
                            ORDER BY created_on
                            LIMIT ${limit} OFFSET ${offset}`

        const edits = (await pool.query(queryString)).rows
        return edits
    }

    async findEditsBySprayId(
        id: number,
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT *
                            FROM spray_schema.edits
                            WHERE spray_id = ${id}
                            ORDER BY created_on
                            LIMIT ${limit} OFFSET ${offset}`

        const edits = (await pool.query(queryString)).rows
        return edits
    }

    async deleteEditsBySprayId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.edits
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
                            SET edits = edits + 1
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
        column: string
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET edits = edits - 1
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

export default EditRepository