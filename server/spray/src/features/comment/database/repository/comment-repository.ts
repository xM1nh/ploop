import { pool } from "..";

class CommentRepository {
  async addComment(sprayId: number, userId: number, description: string) {
    const queryString = `INSERT INTO spray_schema.comments (
                                spray_id,
                                user_id,
                                description
                            ) VALUES (
                                $1,
                                $2,
                                $3
                            ) RETURNING *`;
    const values = [sprayId, userId, description];
    try {
      const comment = (await pool.query(queryString, values)).rows[0];
      return comment;
    } catch (e) {
      throw e;
    }
  }

  async findCommentById(id: number) {
    const queryString = `SELECT *   
                            FROM spray_schema.comments
                            WHERE id = $1`;

    try {
      const comment = (await pool.query(queryString, [id])).rows[0];
      return comment;
    } catch (e) {
      throw e;
    }
  }

  async findCommentsBySprayId(id: number, limit: number, offset: number) {
    const queryString = `SELECT *   
                            FROM spray_schema.comments
                            WHERE spray_id = $1
                            ORDER BY created_on DESC
                            LIMIT $2 OFFSET $3`;
    const values = [id, limit, offset];

    try {
      const comment = (await pool.query(queryString, values)).rows;
      return comment;
    } catch (e) {
      throw e;
    }
  }

  async editComment(id: number, newComment: string) {
    const queryString = `UPDATE spray_schema.comments
                            SET description = $1
                            WHERE id = $2
                            RETURNING *`;
    const values = [newComment, id];

    try {
      const response = (await pool.query(queryString, values)).rows[0];
      return response;
    } catch (e) {
      throw e;
    }
  }

  async deleteCommentById(id: number) {
    const queryString = `DELETE FROM spray_schema.comments
                            WHERE id = $1
                            RETURNING *`;

    try {
      const response = (await pool.query(queryString, [id])).rows[0];
      return response;
    } catch (e) {
      throw e;
    }
  }

  async deleteCommentsByUserId(id: number) {
    const queryString = `DELETE FROM spray_schema.comments
                            WHERE user_id = $1
                            RETURNING spray_id`;

    try {
      const deletedComments = (await pool.query(queryString, [id])).rows;
      return deletedComments;
    } catch (e) {
      throw e;
    }
  }

  async deleteCommentsBySprayId(id: number) {
    const queryString = `DELETE FROM spray_schema.comments
                            WHERE spray_id = $1`;

    try {
      await pool.query(queryString, [id]);
    } catch (e) {
      throw e;
    }
  }

  async increaseCount(id: number, amount: number) {
    const queryString = `UPDATE spray_schema.sprays
                            SET comments = comments + $1
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
                            SET comments = comments - $1
                            WHERE id = $2`;
    const values = [amount, id];

    try {
      await pool.query(queryString, values);
    } catch (e) {
      throw e;
    }
  }
}

export default CommentRepository;
