import { pool } from "..";

class UserRepository {
  async createUser(
    id: number,
    username: string,
    nickname: string,
    avatarUrl: string,
    bio: string,
  ) {
    const queryString = `INSERT INTO user_schema.users (
                                id,
                                username,
                                nickname,
                                avatar_url,
                                bio
                            )
                            VALUES (
                                $1,
                                $2,
                                $3,
                                $4,
                                $5
                            )
                            RETURNING id`;
    const values = [id, username, nickname, avatarUrl, bio];
    try {
      const user = (await pool.query(queryString, values)).rows[0];
      return user;
    } catch (e) {
      throw e;
    }
  }

  async deleteUser(id: number) {
    const queryString = `DELETE FROM user_schema.users
                            WHERE id = $1
                            RETURNING *`;

    try {
      const user = (await pool.query(queryString, [id])).rows[0];
      return user;
    } catch (e) {
      throw e;
    }
  }

  async findUserById(id: number) {
    const queryString = `SELECT * 
                            FROM user_schema.users 
                            WHERE id = $1`;

    try {
      const user = (await pool.query(queryString, [id])).rows[0];
      return user;
    } catch (e) {
      throw e;
    }
  }

  async findUserByUsername(username: string) {
    const queryString = `SELECT *
                            FROM user_schema.users
                            WHERE username = $1`;
    try {
      const user = (await pool.query(queryString, [username])).rows[0];
      return user;
    } catch (e) {
      throw e;
    }
  }

  async updateUsername(id: number, username: string) {
    const queryString = `UPDATE user_schema.users
                            SET username = $1
                            WHERE id = $2
                            RETURNING *`;
    const values = [username, id];

    try {
      const user = (await pool.query(queryString, values)).rows[0];
      return user;
    } catch (e) {
      throw e;
    }
  }

  async updateAvatarUrl(id: number, avatarUrl: string) {
    const queryString = `UPDATE user_schema.users
                            SET avatar_url = $1
                            WHERE id = $2
                            RETURNING *`;
    const values = [avatarUrl, id];

    try {
      const user = (await pool.query(queryString, values)).rows[0];
      return user;
    } catch (e) {
      throw e;
    }
  }

  async updateNickname(id: number, nickname: string) {
    const queryString = `UPDATE user_schema.users
                            SET nickname = $1
                            WHERE id = $2
                            RETURNING *`;
    const values = [nickname, id];

    try {
      const user = (await pool.query(queryString, values)).rows[0];
      return user;
    } catch (e) {
      throw e;
    }
  }

  async updateBio(id: number, bio: string) {
    const queryString = `UPDATE user_schema.users
                            SET bio = $1
                            WHERE id = $2
                            RETURNING *`;
    const values = [bio, id];
    try {
      const user = (await pool.query(queryString, values)).rows[0];
      return user;
    } catch (e) {
      throw e;
    }
  }

  async addFollow(followerId: number, followeeId: number) {
    const queryString = `INSERT INTO user_schema.follows (
                               follower_id,
                               followee_id 
                            ) VALUES (
                                $1,
                                $2
                            ) 
                            RETURNING *`;
    const values = [followerId, followeeId];
    try {
      const follow = (await pool.query(queryString, values)).rows[0];
      return follow;
    } catch (e) {
      throw e;
    }
  }

  async deleteFollow(followerId: number, followeeId: number) {
    const queryString = `DELETE FROM user_schema.follows
                            WHERE follower_id = $1 AND followee_id = $2
                            RETURNING *`;
    const values = [followerId, followeeId];
    try {
      const follow = (await pool.query(queryString, values)).rows[0];
      return follow;
    } catch (e) {
      throw e;
    }
  }

  async getFollow(followerId: number, followeeId: number) {
    const queryString = `SELECT *
                            FROM user_schema.follows
                            WHERE follower_id = $1 AND followee_id = $2`;
    const values = [followerId, followeeId];
    try {
      const follow = (await pool.query(queryString, values)).rows[0];
      return follow;
    } catch (e) {
      throw e;
    }
  }

  async getFollowersByUserId(id: number, limit: number, offset: number) {
    const queryString = `SELECT
                                u.id, 
                                u.username,
                                u.nickname,
                                u.avatar_url,
                                u.bio,
                                u.followings,
                                u.followers
                            FROM user_schema.follows f
                            INNER JOIN user_schema.users AS u ON f.follower_id = u.id
                            WHERE followee_id = $1
                            ORDER BY f.created_on
                            LIMIT $2 OFFSET $3`;
    const values = [id, limit, offset];

    try {
      const followers = (await pool.query(queryString, values)).rows;
      return followers;
    } catch (e) {
      throw e;
    }
  }

  async getFollowingByUserId(id: number, limit: number, offset: number) {
    const queryString = `SELECT
                                u.id, 
                                u.username,
                                u.nickname,
                                u.avatar_url,
                                u.bio,
                                u.followings,
                                u.followers
                            FROM user_schema.follows f
                            INNER JOIN user_schema.users AS u ON f.followee_id = u.id
                            WHERE follower_id = $1
                            ORDER BY f.created_on
                            LIMIT $2 OFFSET $3`;
    const values = [id, limit, offset];
    try {
      const followings = (await pool.query(queryString, values)).rows;
      return followings;
    } catch (e) {
      throw e;
    }
  }

  async increaseFollowers(id: number) {
    const queryString = `UPDATE user_schema.users
                            SET followers = followers + 1
                            WHERE id = $1`;

    try {
      await pool.query(queryString, [id]);
    } catch (e) {
      throw e;
    }
  }

  async decreaseFollowers(id: number) {
    const queryString = `UPDATE user_schema.users
                            SET followers = followers - 1
                            WHERE id = $1`;

    try {
      await pool.query(queryString, [id]);
    } catch (e) {
      throw e;
    }
  }

  async increaseFollowings(id: number) {
    const queryString = `UPDATE user_schema.users
                            SET followings = followings + 1
                            WHERE id = $1`;

    try {
      await pool.query(queryString, [id]);
    } catch (e) {
      throw e;
    }
  }

  async decreaseFollowings(id: number) {
    const queryString = `UPDATE user_schema.users
                            SET followings = followings - 1
                            WHERE id = $1`;

    try {
      await pool.query(queryString, [id]);
    } catch (e) {
      throw e;
    }
  }
}

export default UserRepository;
