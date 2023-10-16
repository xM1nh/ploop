import { pool } from "..";

class NotificationRepository {
  async createNotificationObject(
    entityTypeId: number,
    entityId: number,
    status: number,
  ) {
    const queryString = `INSERT INTO notification_schema.notification_objects (
                                entity_type_id,
                                entity_id,
                                status
                            ) VALUES (
                                ${entityTypeId},
                                ${entityId},
                                ${status}
                            )
                            RETURNING id`;

    const notificationObjectId = (await pool.query(queryString)).rows[0];
    return notificationObjectId;
  }

  async createNotificationChange(
    notificationObjectId: number,
    actorId: number,
  ) {
    const queryString = `INSERT INTO notification_schema.notification_change (
                                notification_object_id,
                                actor_id,
                            ) VALUES (
                                ${notificationObjectId},
                                ${actorId}
                            ) 
                            RETURNING id`;

    const changeId = (await pool.query(queryString)).rows[0];
    return changeId;
  }

  async createNotification(notificationObjectId: number, notifierId: number) {
    const queryString = `INSERT INTO notification_schema.notification_change (
                                notification_object_id,
                                notifier_id,
                                notifier_name
                            ) VALUES (
                                ${notificationObjectId},
                                ${notifierId}
                            ) 
                            RETURNING id`;

    const notificationId = (await pool.query(queryString)).rows[0];
    return notificationId;
  }

  async getNotificationObjectById(id: number) {
    const queryString = `SELECT *
                            FROM notification_schema.notification_objects
                            WHERE id = ${id}`;

    const notificationObject = (await pool.query(queryString)).rows[0];
    return notificationObject;
  }

  async getNotificationsByUserId(userId: number, offset: number) {
    const queryString = `SELECT
                                no.id,
                                nc.actor_id,
                                actor.username as actor_username,
                                n.notifier_id,
                                notifier.username as notifier_username,
                                no.entity_type_id,
                                no.entity_id,
                                no.created_on,
                                no.status
                            FROM notification_schema.notification_objects no
                                INNER JOIN notification_schema.notifications AS n
                                    ON no.id = n.notification_object_id
                                INNER JOIN notification_schema.notification_changes AS nc
                                    ON no.id = nc.notification_object_id
                                INNER JOIN user_schema.users AS actor
                                    ON nc.actor_id = actor.id
                                INNER JOIN user_schema.users AS notifier
                                    ON n.notifier_id = notifier.id
                            WHERE n.notifier_id = ${userId}
                            ORDER BY no.created_on
                            LIMIT 10 OFFSET ${offset}`;

    const notificationList = (await pool.query(queryString)).rows;
    return notificationList;
  }

  async deleteNotificationsByUserId(userId: number) {
    const queryString = `DELETE FROM notification_schema.notifications
                            WHERE notifier_id = ${userId}`;

    try {
      await pool.query(queryString);
      return true;
    } catch (e) {
      return null;
    }
  }

  async updateNotificationStatus(id: number, status: number) {
    const queryString = `UPDATE TABLE notification_objects
                            SET status = ${status}
                            WHERE id = ${id}`;

    try {
      await pool.query(queryString);
      return true;
    } catch (e) {
      return null;
    }
  }
}

export default NotificationRepository;
