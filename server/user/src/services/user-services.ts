import { UserRepository } from "../database";
import { DEFAULT_AVATAR_URL } from "../config";

class UserService {
  repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async createUser(id: number, username: string, nickname: string) {
    const bio = "";
    const avatarUrl = DEFAULT_AVATAR_URL;
    const user = await this.repository.createUser(
      id,
      username,
      nickname,
      avatarUrl,
      bio,
    );
    return user;
  }

  async deleteAccount(id: number) {
    const user = await this.repository.deleteUser(id);
    return user;
  }

  async getUserById(id: number) {
    const user = await this.repository.findUserById(id);
    return user;
  }

  async changeUsername(id: number, newUsername: string) {
    const user = await this.repository.findUserById(id);
    if (newUsername === user.username) return;
    const response = await this.repository.updateUsername(id, newUsername);
    return response;
  }

  async changeBio(id: number, bio: string) {
    const user = await this.repository.findUserById(id);
    if (bio === user.bio) return;
    const response = await this.repository.updateBio(id, bio);
    return response;
  }

  async changeNickname(id: number, newName: string) {
    const user = await this.repository.findUserById(id);
    if (newName === user.nickname) return;
    const response = await this.repository.updateNickname(id, newName);
    return response;
  }

  async changeAvatar(id: number, newUrl: string) {
    const user = await this.repository.updateAvatarUrl(id, newUrl);
    return user;
  }

  async getFollow(followerId: number, followeeId: number) {
    const follow = await this.repository.getFollow(followerId, followeeId);

    return follow;
  }

  async follow(followerId: number, followeeId: number) {
    try {
      if (!(await this.getFollow(followerId, followeeId))) {
        const response = await this.repository.addFollow(
          followerId,
          followeeId,
        );
        await this.repository.increaseFollowers(followeeId);
        await this.repository.increaseFollowings(followerId);
        return response;
      }
      return;
    } catch (e) {
      return null;
    }
  }

  async unfollow(followerId: number, followeeId: number) {
    try {
      if (await this.getFollow(followerId, followeeId)) {
        const response = await this.repository.deleteFollow(
          followerId,
          followeeId,
        );
        await this.repository.decreaseFollowers(followeeId);
        await this.repository.decreaseFollowings(followerId);
        return response;
      }
      return;
    } catch (e) {
      return null;
    }
  }

  async getFollowers(id: number, itemPerPage: number, page: number) {
    const offset = page * itemPerPage;
    const followers = await this.repository.getFollowersByUserId(
      id,
      itemPerPage,
      offset,
    );

    return followers;
  }

  async getFollowings(id: number, itemPerPage: number, page: number) {
    const offset = page * itemPerPage;
    const followings = await this.repository.getFollowingByUserId(
      id,
      itemPerPage,
      offset,
    );

    return followings;
  }

  async subscribeEvents(payload: string) {
    const message = JSON.parse(payload);

    const { event, data } = message;

    const { id, username, nickname, url } = data;

    switch (event) {
      case "SIGN_UP":
        await this.createUser(id, username, nickname);
        break;
      case "CHANGE_AVATAR":
        await this.changeAvatar(id, url);
        break;
      default:
        break;
    }
  }
}

export default UserService;
