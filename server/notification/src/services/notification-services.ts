import { NotificationRepository } from "../database";
import { stringToDate } from "../utils";

interface NotificationMessage {
    [index: number]: string
}

class NotificationService {
    repository: NotificationRepository

    constructor() {
        this.repository = new NotificationRepository()
    }

    NOTIFICATION_MESSAGE: NotificationMessage = {
        //System notifications
        100: `Your spray has been successfully uploaded. You will be able to view your spray after we're done processing.`,
        101: `There's an error occurred during your upload. Please try again later.`,
    
        //Non-system notifications
        200: `started following you`,
        201: `posted a new spray`,
    
        300: `liked you spray`,
        301: `commented on your spray`,
        302: `drew on you spray`,
        303: `shared your spray`
    }

    async createNewNotification(
        entity_type_id: number,
        entity_id: number,
        actorId: number,
        notifierId: number,
    ) {
        const status = 0 //Create an unread notification by default

        const notificationObjectId = await this.repository.createNotificationObject(entity_type_id, entity_id, status)
        await this.repository.createNotificationChange(notificationObjectId, actorId)
        await this.repository.createNotification(notificationObjectId, notifierId)

        return notificationObjectId
    }

    async getNotificationsOfUser(
        id: number,
        pageNumber: number
    ) {
        const offset = pageNumber * 10
        const notifications = await this.repository.getNotificationsByUserId(id, offset)

        return notifications
    }

    async deleteNotificationsOfUser(
        userId: number
    ) {
        const response = await this.repository.deleteNotificationsByUserId(userId)
        return response
    }

    async markAsRead(
        id: number
    ) {
        const response = await this.repository.updateNotificationStatus(id, 1)
        return response
    }
    
    async generateNotificationPackage (
        entity_type_id: number,
        actor: string,
        created_on: string
    ) {
        if (entity_type_id < 200) {
            return {
                actor: 'System Notification',
                message: this.NOTIFICATION_MESSAGE[entity_type_id],
                created_on: stringToDate(created_on)
            }
        }
        else {
            return {
                actor,
                message: this.NOTIFICATION_MESSAGE[entity_type_id],
                created_on: stringToDate(created_on),
            }
        }
    }

    async subscribeEvents(payload: string) {
        const message = JSON.parse(payload)

        const {pubEvent, subEvent, data} = message

        const {
            id,
            entity_type_id,
            entity_id,
            actor_id,
            notifier_id,
            actorName,
            created_on
        } = data

        switch(pubEvent || subEvent) {
            case 'CREATE_NOTIFICATION':
                await this.createNewNotification(entity_type_id, entity_id, actor_id, notifier_id)
                break
            case 'DELETE_NOTIFICATIONS':
                await this.deleteNotificationsOfUser(notifier_id)
                break
            case 'MARK_AS_READ':
                await this.markAsRead(id)
            case 'NOTIFICATION_READY':
                await this.generateNotificationPackage(entity_type_id, actorName, created_on)
                break
            default: 
                break
        }
    }
}

export default NotificationService