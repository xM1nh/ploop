import {pool} from '..'

class NotificationRepository {
    async createNotification(
        actorId: number,
        notifierId: number,
        entityTypeId: number,
        entityId: number,
        status: number,
    ) {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')

            const NOQueryString = `INSERT INTO notification_schema.notification_objects (
                entity_type_id,
                entity_id,
                status
            ) VALUES (
                $1,
                $2,
                $3
            )
            RETURNING *`

            const NCQueryString = `INSERT INTO notification_schema.notification_changes (
                notification_object_id,
                actor_id
            ) VALUES (
                $1,
                $2
            ) 
            RETURNING *`

            const NQueryString = `INSERT INTO notification_schema.notifications (
                notification_object_id,
                notifier_id
            ) VALUES (
                $1,
                $2
            ) 
            RETURNING *`

            const NOValues = [entityTypeId, entityId, status]
            const notificationObject = (await pool.query(NOQueryString, NOValues)).rows[0]

            const NCValues = [notificationObject.id, actorId]
            const change = (await pool.query(NCQueryString, NCValues)).rows[0]

            const NValues = [notificationObject.id, notifierId]
            const notification = (await pool.query(NQueryString, NValues)).rows[0]

            await client.query('COMMIT')

            return {
                ...notificationObject,
                actor_id: change.actor_id,
                notifier_id: notification.notifier_id
            }
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
    }

    async getNotificationsByUserId(
        userId: number,
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT
                                nc.actor_id,
                                n.notifier_id,
                                no.id,
                                no.entity_type_id,
                                no.entity_id,
                                no.created_on,
                                no.status
                            FROM notification_schema.notification_objects no
                            INNER JOIN notification_schema.notifications AS n
                                ON no.id = n.notification_object_id
                            INNER JOIN notification_schema.notification_changes AS nc
                                ON no.id = nc.notification_object_id
                            WHERE n.notifier_id = $1
                            ORDER BY no.created_on DESC
                            LIMIT $2 OFFSET $3`
        const values = [userId, limit, offset]
        try {
            const notifications = (await pool.query(queryString, values)).rows
            return notifications
        } catch (e) {
            throw e
        }
    }

    async getUnreadNotificationCountByUserId(
        userId: number
    ) {
        const queryString = `SELECT COUNT(no.id)
                            FROM notification_schema.notification_objects no
                            INNER JOIN notification_schema.notifications AS n
                                ON no.id = n.notification_object_id
                            WHERE n.notifier_id = $1 AND no.status = 0`
        try {
            const count = (await pool.query(queryString, [userId])).rows[0].count
            return count
        } catch (e) {
            throw e
        }
    }

    async updateNotificationStatus(
        id: number,
        status: number
    ) {
        const queryString = `WITH update_status AS (
                                UPDATE TABLE notification_schema.notification_objects
                                SET status = $1
                                WHERE id = $2
                                RETURNING *
                            )
                            SELECT
                                us.*,
                                nc.actor_id,
                                n.notifier_id
                            FROM update_status us
                            INNER JOIN notification_schema.notifications AS n
                                ON us.id = n.notification_object_id
                            INNER JOIN notification_schema.notification_changes AS nc
                                ON us.id = nc.notification_object_id`
        const values = [status, id]
        
        try {
            const notification = (await pool.query(queryString, values)).rows[0]
            return notification
        } catch (e) {
            throw e
        }
    }

    async updateAllNotificationStatusByUserId(
        userId: number,
        status: number
    ) {
        const queryString = `UPDATE notification_schema.notification_objects AS no
                            SET status = $1
                            FROM notification_schema.notifications AS n
                            WHERE n.notifier_id = $2 AND no.id = n.notification_object_id AND no.status != $1`
        const values = [status, userId]

        try {
            const notification = await pool.query(queryString, values)
        } catch (e) {
            throw e
        }
    }
}

export default NotificationRepository