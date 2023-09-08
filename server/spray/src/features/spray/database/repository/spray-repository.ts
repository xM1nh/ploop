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
        deadline: Date | string
    ) {
        const queryString = `INSERT INTO spray_schema.sprays (
                                url,
                                cover_url,
                                user_id,
                                caption,
                                view_permission,
                                draw_permission,
                                limited,
                                deadline
                            ) VALUES (
                                '${url}',
                                '${coverUrl}',
                                ${userId},
                                '${caption}',
                                ${viewPermission},
                                ${drawPermission},
                                ${limited},
                                '${deadline}'::TIMESTAMP
                            ) RETURNING id`
        
        const spray = (await pool.query(queryString)).rows[0].id
        return spray
    }

    async findSprayById(
        id: number
    ) {
        const queryString = `SELECT *
                            FROM spray_schema.sprays
                            WHERE id = ${id}`

        const spray = (await pool.query(queryString)).rows[0]
        return spray
    }

    async findSpraysByUserId(
        id: number,
        limit: number,
        offset: number
    ) {
        const queryString =`SELECT *
                            FROM spray_schema.sprays
                            WHERE user_id = ${id}
                            ORDER BY created_on
                            LIMIT ${limit} OFFSET ${offset}`

        const sprays = (await pool.query(queryString)).rows
        return sprays
    }

    async getPublicSprays(
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT *
                            FROM spray_schema.sprays
                            WHERE view_permission = 1
                            ORDER BY created_on DESC
                            LIMIT ${limit} OFFSET ${offset}`

        const sprays = (await pool.query(queryString)).rows
        return sprays
    }

    async editUrl(
        id: number,
        newUrl: string,
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET url = '${newUrl}'
                            WHERE id = ${id}
                            RETURNING *`

        try {
            const spray = (await pool.query(queryString)).rows[0]
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
                            SET caption = '${newCaption}'
                            WHERE id = ${id}
                            RETURNING *`

        try {
            const spray = (await pool.query(queryString)).rows[0]
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
                            SET view_permission = ${viewPermission}
                            WHERE id = ${id}
                            RETURNING *`

        try {
            const spray = (await pool.query(queryString)).rows[0]
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
                            SET draw_permission = ${drawPermission}
                            WHERE id = ${id}
                            RETURNING *`

        try {
            const spray = (await pool.query(queryString)).rows[0]
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
                                SET limited = ${limitation}
                                    deadline = '${deadline}'::TIMESTAMP
                                WHERE id = ${id}
                                RETURNING *`

        try {
            const spray = (await pool.query(queryString)).rows[0]
            return spray
        } catch (e) {
            throw e
        }
    }

    async deleteSprayById(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.sprays
                            WHERE id = ${id}
                            RETURNING *`

        try {
            const spray = (await pool.query(queryString)).rows[0]
            return spray
        } catch (e) {
            throw e
        }
    }

    async deleteSpraysByUserId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.sprays
                            WHERE user_id = ${id}`

        try {
            await pool.query(queryString)
        } catch (e) {
            throw e
        }
    }
}

export default SprayRepository