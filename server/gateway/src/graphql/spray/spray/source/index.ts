import { AugmentedRequest, RESTDataSource } from "@apollo/datasource-rest";
import { Spray } from "../../../../utils/types";
import { ValueOrPromise } from "@apollo/datasource-rest/dist/RESTDataSource";

export default class SpraySource extends RESTDataSource {
  override baseURL = "http://127.0.0.1:8005/sprays/";

  override willSendRequest(
    path: string,
    request: AugmentedRequest,
  ): ValueOrPromise<void> {
    request.headers["Content-Type"] = "application/json";
    request.headers["Origin"] = "http://localhost:8000";
  }

  async getSprays(page: number, count: number) {
    return this.get<Spray[]>(`?page=${page}&count=${count}`);
  }

  async getSpray(id: string) {
    return this.get<Spray>(`${id}`);
  }

  async getUserSprays(userId: string, page: number, count: number) {
    return this.get<Spray[]>(`users/${userId}?page=${page}&count=${count}`);
  }

  async getResprays(id: string, page: number, count: number) {
    return this.get<Spray[]>(`resprays/${id}?page=${page}&count=${count}`);
  }

  async getUserResprays(userId: string, page: number, count: number) {
    return this.get<Spray[]>(
      `resprays/users/${userId}?page=${page}&count=${count}`,
    );
  }

  async editSpray(
    id: string,
    caption: string | null | undefined,
    viewPermission: string | null | undefined,
    drawPermission: string | null | undefined,
    limited: string | null | undefined,
    deadline: string | null | undefined,
  ) {
    const body = {
      caption,
      viewPermission,
      drawPermission,
      limited,
      deadline,
    };
    return this.put<Spray>(`${id}`, { body });
  }

  async deleteSpray(id: string) {
    return this.delete<Spray>(`${id}`);
  }
}
