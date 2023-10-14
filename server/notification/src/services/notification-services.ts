import { Channel } from "amqplib";
import { NotificationRepository } from "../database";
import { publishMessage } from "../utils";
import { SUBSCRIPTION_EXCHANGE_NAME } from "../config";

interface NotificationMessage {
    [index: number]: string
}

class NotificationService {
    repository: NotificationRepository
    channel: Channel

    constructor(channel: Channel) {
        this.repository = new NotificationRepository()
        this.channel = channel
    }

    NOTIFICATION_MESSAGE: NotificationMessage = {
        //System notifications
        100: `Your spray has been successfully uploaded. You will be able to view your spray after we're done processing.`,
        101: `Your spray has been successfully processed. You can now view your spray.`,
        102: `There's an error occurred during your upload. Please try again later.`,
    
        //Non-system notifications
        200: `started following you`,
        201: `posted a new spray`,
    
        300: `liked you spray`,
        301: `commented on your spray`,
        302: `resprayed your spray`,
        303: `shared your spray`
    }

    async createNewNotification(
        entityTypeId: number,
        entityId: number,
        actorId: number,
        notifierId: number,
    ) {
        const notification = await this.repository.createNotification(actorId, notifierId, entityTypeId, entityId, 0)

        return notification
    }

    async getNotificationsOfUser(
        userId: number,
        limit: number,
        offset: number
    ) {
        const notifications = await this.repository.getNotificationsByUserId(userId, limit, offset)

        return notifications
    }

    async getUnreadNotificationCountOfUser(
        id: number
    ) {
        const count = await this.repository.getUnreadNotificationCountByUserId(id)

        return count
    }

    async markAsRead(
        id: number
    ) {
        const response = await this.repository.updateNotificationStatus(id, 1)
        return response
    }

    async markAsUnread(
        id: number
    ) {
        const response = await this.repository.updateNotificationStatus(id, 0)
        return response
    }

    async markAllAsRead(
        userId: number
    ) {
        await this.repository.updateAllNotificationStatusByUserId(userId, 1)
    }

    async markAllAsUnread(
        userId: number
    ) {
        await this.repository.updateAllNotificationStatusByUserId(userId, 0)
    }

    async subscribeEvents(payload: string) {
        const message = JSON.parse(payload)

        const {event, data} = message

        const {
            id,
            entityTypeId,
            entityId,
            actorId,
            notifierId,
        } = data

        switch(event) {
            case 'CREATE_NOTIFICATION':
                const notification = await this.createNewNotification(entityTypeId, entityId, actorId, notifierId)
                publishMessage(this.channel, 'NOTIFICATION_ADDED', {...notification}, SUBSCRIPTION_EXCHANGE_NAME)
                break
            default: 
                break
        }
    }
}

export default NotificationService