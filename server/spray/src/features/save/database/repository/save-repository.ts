import { pool } from "..";

class SaveRepository {
  async addSave(sprayId: number, userId: number) {
    const queryString = `INSERT INTO spray_schema.saves (
                                spray_id,
                                user_id
                            ) VALUES (
                                ${sprayId},
                                ${userId}
                            ) RETURNING *`;
    try {
      const save = (await pool.query(queryString)).rows[0];
      return save;
    } catch (e) {
      throw e;
    }
  }

  async findSavesByUserId(id: number, limit: number, offset: number) {
    const queryString = `SELECT *
                            FROM spray_schema.saves
                            WHERE user_id = ${id}
                            ORDER BY created_on
                            LIMIT ${limit} OFFSET ${offset}`;

    try {
      const saves = (await pool.query(queryString)).rows;
      return saves;
    } catch (e) {
      throw e;
    }
  }

  async findSaveByUserIdAndSprayId(sprayId: number, userId: number) {
    const queryString = `SELECT *
                            FROM spray_schema.saves
                            WHERE spray_id = ${sprayId} AND user_id = ${userId}`;

    try {
      const save = (await pool.query(queryString)).rows[0];
      return save;
    } catch (e) {
      throw e;
    }
  }

  async deleteSaveByUserIdAndSprayId(sprayId: number, userId: number) {
    const queryString = `DELETE FROM spray_schema.saves
                            WHERE spray_id = ${sprayId} AND user_id = ${userId}
                            RETURNING *`;

    try {
      const response = (await pool.query(queryString)).rows[0];
      return response;
    } catch (e) {
      throw e;
    }
  }

  async deleteSavesByUserId(id: number) {
    const queryString = `DELETE FROM spray_schema.saves
                            WHERE user_id = ${id}
                            RETURNING spray_id`;

    try {
      const response = (await pool.query(queryString)).rows;
      return response;
    } catch (e) {
      throw e;
    }
  }

  async deleteSavesBySprayId(id: number) {
    const queryString = `DELETE FROM spray_schema.saves
                            WHERE spray_id = ${id}`;

    try {
      await pool.query(queryString);
    } catch (e) {
      throw e;
    }
  }

  async increaseCount(id: number, amount: number) {
    const queryString = `UPDATE spray_schema.sprays
                            SET saves = saves + ${amount}
                            WHERE id = ${id}`;

    try {
      await pool.query(queryString);
    } catch (e) {
      throw e;
    }
  }

  async decreaseCount(id: number, amount: number) {
    const queryString = `UPDATE spray_schema.sprays
                            SET saves = saves - ${amount}
                            WHERE id = ${id}`;

    try {
      await pool.query(queryString);
    } catch (e) {
      throw e;
    }
  }
}

export default SaveRepository;
