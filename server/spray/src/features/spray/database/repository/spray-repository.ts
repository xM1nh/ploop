import {pool} from '..'

class SprayRepository {
    async addSpray(
        url: string,
        coverUrl: string,
        userId: number,
        caption: string,
        viewPermission: number,
        drawPermission: number,
        limited: boolean,
        deadline: Date | string,
        originalId: number | null
    ) {
        const queryString = `INSERT INTO spray_schema.sprays (
                                url,
                                cover_url,
                                user_id,
                                caption,
                                view_permission,
                                draw_permission,
                                limited,
                                deadline,
                                original_id
                            ) VALUES (
                                $1,
                                $2,
                                $3,
                                $4,
                                $5,
                                $6,
                                $7,
                                $8::TIMESTAMP,
                                $9
                            ) RETURNING *`
        const values = [url, coverUrl, userId, caption, viewPermission, drawPermission, limited, deadline, originalId]

        try {
            const spray = (await pool.query(queryString, values)).rows[0]
            return spray
        } catch (e) {
            throw e
        }
    }

    async findSprayById(
        id: number
    ) {
        const queryString = `SELECT *
                            FROM spray_schema.sprays
                            WHERE id = $1`

        try {
            const spray = (await pool.query(queryString, [id])).rows[0]
            return spray
        } catch (e) {
            throw e
        }
    }

    async findSpraysByUserId(
        id: number,
        limit: number,
        offset: number
    ) {
        const queryString =`SELECT *
                            FROM spray_schema.sprays
                            WHERE user_id = $1
                            ORDER BY created_on DESC
                            LIMIT $2 OFFSET $3`
        const values = [id, limit, offset]
        
        try {
            const sprays = (await pool.query(queryString, values)).rows
            return sprays
        } catch (e) {
            throw e
        }
    }

    async findRespraysByOriginalId(
        id: number,
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT *
                            FROM spray_schema.edits
                            WHERE original_id = $1 AND view_permission = 1
                            ORDER BY created_on DESC
                            LIMIT $2 OFFSET $3`
        const values = [id, limit, offset]

        try {
            const edits = (await pool.query(queryString, values)).rows
            return edits
        } catch (e) {
            throw e
        }
    }

    async findRespraysByUserId(
        id: number,
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT *
                            FROM spray_schema.edits
                            WHERE user_id = $1 AND original_id IS NOT NULL
                            ORDER BY created_on
                            LIMIT $2 OFFSET $3`
        const values = [id, limit, offset]
        
        try {
            const edit = (await pool.query(queryString, values)).rows
            return edit
        } catch (e) {
            throw e
        }
    }

    async getPublicSprays(
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT *
                            FROM spray_schema.sprays
                            WHERE view_permission = 1
                            ORDER BY created_on DESC
                            LIMIT $1 OFFSET $2`
        const values = [limit, offset]

        try {
            const spray = (await pool.query(queryString, values)).rows
            return spray
        } catch (e) {
            throw e
        }
    }

    async editUrl(
        id: number,
        newUrl: string,
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET url = $1
                            WHERE id = $2
                            RETURNING *`
        const values = [newUrl, id]

        try {
            const spray = (await pool.query(queryString, values)).rows[0]
            return spray
        } catch (e) {
            throw e
        }
    }

    async editCaption(
        id: number,
        newCaption: string
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET caption = $1
                            WHERE id = $2
                            RETURNING *`
        const values = [newCaption, id]

        try {
            const spray = (await pool.query(queryString, values)).rows[0]
            return spray
        } catch (e) {
            throw e
        }
    }

    async editViewPermission(
        id: number,
        viewPermission: number
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET view_permission = $1
                            WHERE id = $2
                            RETURNING *`
        const values = [viewPermission, id]

        try {
            const spray = (await pool.query(queryString, values)).rows[0]
            return spray
        } catch (e) {
            throw e
        }
    }

    async editDrawPermission(
        id: number,
        drawPermission: number
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET draw_permission = $1
                            WHERE id = $2
                            RETURNING *`
        const values = [drawPermission, id]

        try {
            const spray = (await pool.query(queryString, values)).rows[0]
            return spray
        } catch (e) {
            throw e
        }
    }

    async editLimitation(
        id: number,
        limitation: boolean,
        deadline?: Date | string
    ) {
        const queryString = `UPDATE spray_schema.sprays
                                SET limited = $1
                                    deadline = $2::TIMESTAMP
                                WHERE id = $3
                                RETURNING *`
        const values = [limitation, deadline, id]

        try {
            const spray = (await pool.query(queryString, values)).rows[0]
            return spray
        } catch (e) {
            throw e
        }
    }

    async deleteSprayById(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.sprays
                            WHERE id = $1
                            RETURNING *`

        try {
            const spray = (await pool.query(queryString, [id])).rows[0]
            return spray
        } catch (e) {
            throw e
        }
    }

    async deleteSpraysByUserId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.sprays
                            WHERE user_id = $1`

        try {
            await pool.query(queryString, [id])
        } catch (e) {
            throw e
        }
    }
}

export default SprayRepository