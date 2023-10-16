import { pool } from "..";

class LikeRepository {
  async addLike(sprayId: number, userId: number) {
    const queryString = `INSERT INTO spray_schema.likes (
                                spray_id,
                                user_id
                            ) VALUES (
                                $1,
                                $2
                            ) RETURNING *`;
    const values = [sprayId, userId];

    try {
      const like = (await pool.query(queryString, values)).rows[0];
      return like;
    } catch (e) {
      throw e;
    }
  }

  async findLikesBySprayId(id: number, limit: number, offset: number) {
    const queryString = `SELECT 
                                u.username
                            FROM spray_schema.likes l
                                INNER JOIN user_schema.users AS u ON l.user_id = u.id
                            WHERE l.spray_id = $1
                            LIMIT $2 OFFSET $3`;
    const values = [id, limit, offset];

    try {
      const like = (await pool.query(queryString, values)).rows;
      return like;
    } catch (e) {
      throw e;
    }
  }

  async findLikeByUserIdAndSprayId(sprayId: number, userId: number) {
    const queryString = `SELECT *
                            FROM spray_schema.likes
                            WHERE spray_id = $1 AND user_id = $2`;
    const values = [sprayId, userId];

    try {
      const like = (await pool.query(queryString, values)).rows[0];
      return like;
    } catch (e) {
      throw e;
    }
  }

  async deleteLikeByUserIdAndSprayId(sprayId: number, userId: number) {
    const queryString = `DELETE FROM spray_schema.likes
                            WHERE spray_id = $1 AND user_id = $2
                            RETURNING *`;
    const values = [sprayId, userId];

    try {
      const response = (await pool.query(queryString, values)).rows[0];
      return response;
    } catch (e) {
      throw e;
    }
  }

  async deleteLikesByUserId(id: number) {
    const queryString = `DELETE FROM spray_schema.likes
                            WHERE user_id = $1
                            RETURNING spray_id`;

    try {
      const response = (await pool.query(queryString, [id])).rows;
      return response;
    } catch (e) {
      throw e;
    }
  }

  async deleteLikesBySprayId(id: number) {
    const queryString = `DELETE FROM spray_schema.likes
                            WHERE spray_id = $1`;

    try {
      await pool.query(queryString, [id]);
    } catch (e) {
      throw e;
    }
  }

  async increaseCount(id: number, amount: number) {
    const queryString = `UPDATE spray_schema.sprays
                            SET likes = likes + $1
                            WHERE id = $2`;
    const values = [amount, id];

    try {
      await pool.query(queryString, values);
    } catch (e) {
      throw e;
    }
  }

  async decreaseCount(id: number, amount: number) {
    const queryString = `UPDATE spray_schema.sprays
                            SET likes = likes - $1
                            WHERE id = $2`;
    const values = [amount, id];

    try {
      await pool.query(queryString, values);
    } catch (e) {
      throw e;
    }
  }
}

export default LikeRepository;
