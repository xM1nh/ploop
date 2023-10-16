import { AugmentedRequest, RESTDataSource } from "@apollo/datasource-rest";
import { User, Follow } from "../../../utils/types";
import { ValueOrPromise } from "@apollo/datasource-rest/dist/RESTDataSource";

export default class UserSource extends RESTDataSource {
  override baseURL = "http://127.0.0.1:8002/users/";

  override willSendRequest(
    path: string,
    request: AugmentedRequest,
  ): ValueOrPromise<void> {
    request.headers["Content-Type"] = "application/json";
    request.headers["Origin"] = "http://localhost:8000";
  }

  async getUser(id: string) {
    return this.get<User>(`${id}`);
  }

  async getFollow(id: string, followeeId: string) {
    return this.get<Follow>(`${id}/follow?followeeId=${followeeId}`);
  }

  async getFollowers(id: string, page: number, count: number) {
    return this.get<User[]>(`${id}/followers?page=${page}&count=${count}`);
  }

  async getFollowings(id: string, page: number, count: number) {
    return this.get<User[]>(`${id}/followings?page=${page}&count=${count}`);
  }

  async editUser(
    id: string,
    username: string | null | undefined,
    nickname: string | null | undefined,
    bio: string | null | undefined,
  ) {
    const body = {
      username,
      nickname,
      bio,
    };
    return this.put<User>(`${id}`, { body });
  }

  async deleteUser(id: string) {
    return this.delete<User>(`${id}`);
  }

  async follow(id: string, followeeId: string) {
    const body = { followeeId };
    return this.post<Follow>(`${id}/follow`, { body });
  }

  async unfollow(id: string, foloweeId: string) {
    return this.delete<Follow>(`${id}/follow?followeeId=${foloweeId}`);
  }
}
