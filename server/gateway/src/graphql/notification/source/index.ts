import { AugmentedRequest, RESTDataSource } from "@apollo/datasource-rest";
import { Notification } from "../../../utils/types";
import { ValueOrPromise } from "@apollo/datasource-rest/dist/RESTDataSource";

export default class NotificationSource extends RESTDataSource {
  override baseURL = "http://127.0.0.1:8004/notifications/";

  override willSendRequest(
    path: string,
    request: AugmentedRequest,
  ): ValueOrPromise<void> {
    request.headers["Content-Type"] = "application/json";
    request.headers["Origin"] = "http://localhost:8000";
  }

  async getNotifications(userId: string, page: number, count: number) {
    return this.get<Notification[]>("", {
      params: {
        userId,
        page: page.toString(),
        count: count.toString(),
        status: "all",
      },
    });
  }

  async getUnreadNotifications(userId: string) {
    return this.get<Notification[]>("", {
      params: {
        userId,
        status: "unread",
      },
    });
  }

  async read(id: string) {
    return this.put<Notification>(`${id}`, {
      params: {
        action: "read",
      },
    });
  }

  async unread(id: string) {
    return this.put<Notification>(`${id}`, {
      params: {
        action: "unread",
      },
    });
  }

  async readAll(id: string) {
    return this.put<void>(`${id}`, {
      params: {
        action: "read",
        all: "true",
      },
    });
  }

  async unreadAll(id: string) {
    return this.put<void>(`${id}`, {
      params: {
        action: "unread",
        all: "true",
      },
    });
  }
}
