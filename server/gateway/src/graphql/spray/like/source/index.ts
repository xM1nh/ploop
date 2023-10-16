import { AugmentedRequest, RESTDataSource } from "@apollo/datasource-rest";
import { Like } from "../../../../utils/types";
import { ValueOrPromise } from "@apollo/datasource-rest/dist/RESTDataSource";

export default class LikeSource extends RESTDataSource {
  override baseURL = "http://127.0.0.1:8005/likes/";

  override willSendRequest(
    path: string,
    request: AugmentedRequest,
  ): ValueOrPromise<void> {
    request.headers["Content-Type"] = "application/json";
    request.headers["Origin"] = "http://localhost:8000";
  }

  async getLikes(sprayId: string, page: number, count: number) {
    return this.get<Like[]>(`?sprayId=${sprayId}&page=${page}&count=${count}`);
  }

  async getLike(sprayId: string, userId: string) {
    return this.get<Like>(`${sprayId}?userId=${userId}`);
  }

  async like(sprayId: string, userId: string, notifierId: string) {
    const body = {
      sprayId,
      userId,
      notifierId,
    };
    return this.post<Like>(``, { body });
  }

  async unlike(sprayId: string, userId: string) {
    return this.delete<Like>(`?sprayId=${sprayId}&userId=${userId}`);
  }
}
