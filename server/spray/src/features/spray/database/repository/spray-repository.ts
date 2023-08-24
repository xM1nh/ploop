import {pool} from '..'

class SprayRepository {
    async addSpray(
        url: string,
        creatorId: number,
        caption: string,
        viewPermission: number,
        drawPermission: number,
        limited: boolean,
        deadline: Date | null 
    ) {
        const queryString = `INSERT INTO spray_schema.sprays (
                                url,
                                creator_id,
                                caption,
                                view_permission,
                                draw_permission,
                                limited,
                                deadline
                            ) VALUES (
                                '${url}',
                                ${creatorId},
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
                            WHERE creator_id = ${id}
                            ORDER BY created_on
                            LIMIT ${limit} OFFSET ${offset}`

        const sprays = (await pool.query(queryString)).rows
        const publicSprays = sprays.map(spray => spray.view_permission === 1)
        const privateSprays = sprays.map(spray => spray.view_permission === 2)

        return {public: publicSprays, private: privateSprays}
    }

    async getPublicSprays(
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT *
                            FROM spray_schema.sprays
                            WHERE view_permission = 1
                            LIMIT ${limit} OFFSET ${offset}
                            ORDER BY created_on`

        const sprays = (await pool.query(queryString)).rows
        return sprays
    }

    async editUrl(
        id: number,
        newUrl: string,
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET url = '${newUrl}'
                            WHERE id = ${id}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async editCaption(
        id: number,
        newCaption: string
    ) {
        const queryString = `UPDATE spray_schema.sprays
                            SET caption = '${newCaption}'
                            WHERE id = ${id}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async deleteSprayById(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.sprays
                            WHERE id = ${id}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }

    async deleteSpraysByUserId(
        id: number
    ) {
        const queryString = `DELETE FROM spray_schema.sprays
                            WHERE creator_id = ${id}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            console.error(e)
            return e
        }
    }
}

export default SprayRepository