import { NotificationRepository } from "../database";
import { stringToDate } from "../utils";

interface NotificationMessage {
  [index: number]: string;
}

class NotificationService {
  repository: NotificationRepository;

  constructor() {
    this.repository = new NotificationRepository();
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
    302: `drew on you spray`,
    303: `shared your spray`,
  };

  async createNewNotification(
    entityTypeId: number,
    entityId: number,
    actorId: number,
    notifierId: number,
  ) {
    const status = 0; //Create an unread notification by default

    const notificationObjectId = await this.repository.createNotificationObject(
      entityTypeId,
      entityId,
      status,
    );
    await this.repository.createNotificationChange(
      notificationObjectId,
      actorId,
    );
    await this.repository.createNotification(notificationObjectId, notifierId);

    return notificationObjectId;
  }

  async getNotificationsOfUser(id: number, pageNumber: number) {
    const offset = pageNumber * 10;
    const notifications = await this.repository.getNotificationsByUserId(
      id,
      offset,
    );

    return notifications;
  }

  async deleteNotificationsOfUser(userId: number) {
    const response = await this.repository.deleteNotificationsByUserId(userId);
    return response;
  }

  async markAsRead(id: number) {
    const response = await this.repository.updateNotificationStatus(id, 1);
    return response;
  }

  async generateNotificationPackage(
    entityTypeId: number,
    actor: string,
    created_on: string,
  ) {
    if (entityTypeId < 200) {
      return {
        actor: "System Notification",
        message: this.NOTIFICATION_MESSAGE[entityTypeId],
        created_on: stringToDate(created_on),
      };
    } else {
      return {
        actor,
        message: this.NOTIFICATION_MESSAGE[entityTypeId],
        created_on: stringToDate(created_on),
      };
    }
  }

  async subscribeEvents(payload: string) {
    const message = JSON.parse(payload);

    const { event, data } = message;

    const { id, entityTypeId, entityId, actorId, notifierId } = data;

    switch (event) {
      case "CREATE_NOTIFICATION":
        await this.createNewNotification(
          entityTypeId,
          entityId,
          actorId,
          notifierId,
        );
        break;
      case "DELETE_NOTIFICATIONS":
        await this.deleteNotificationsOfUser(notifierId);
        break;
      case "MARK_AS_READ":
        await this.markAsRead(id);
      default:
        break;
    }
  }
}

export default NotificationService;
