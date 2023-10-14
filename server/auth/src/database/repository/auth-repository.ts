import { pool } from '..'

class AuthRepository {
    async createUser(
        email: string,
        password: string,
        username: string,
        salt: string,
    ) {
        const queryString = `INSERT INTO auth_schema.users (
                                email,
                                password,
                                username,
                                salt
                            )
                            VALUES (
                                $1,
                                $2,
                                $3,
                                $4
                            )
                            RETURNING id`
        const values = [email, password, username, salt]

        try {
            const user = (await pool.query(queryString, values)).rows[0].id
            return user
        } catch (e) {
            throw e
        }
    }

    async createUserWithTokenTransaction(
        email: string,
        password: string,
        username: string,
        salt: string,
        refreshToken: string
    ) {
        const client = await pool.connect()
        
        try {
            await client.query('BEGIN')

            const createUserqueryString = `INSERT INTO auth_schema.users (
                                            email,
                                            password,
                                            username,
                                            salt
                                        )
                                        VALUES (
                                            $1,
                                            $2,
                                            $3,
                                            $4
                                        )
                                        RETURNING id`
            const createUserValues = [email, password, username, salt]
            const id = (await client.query(createUserqueryString, createUserValues)).rows[0].id

            const createTokenValues = [id, refreshToken]
            const createRefreshTokenQueryString = `INSERT INTO auth_schema.refresh_tokens (
                                                    user_id,
                                                    token
                                                )
                                                VALUES (
                                                    $1,
                                                    $2
                                                )
                                                RETURNING id`
            await client.query(createRefreshTokenQueryString, createTokenValues)

            await client.query('COMMIT')
            return id
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
    }

    async findUserByEmail(email: string) {
        const queryString = `SELECT * 
                            FROM auth_schema.users 
                            WHERE email = $1`
                  
        try {
            const existingUser = (await pool.query(queryString, [email])).rows[0]
            return existingUser        
        } catch (e) {
            throw e
        }
    }

    async findUserByUsername(username: string) {
        const queryString = `SELECT *
                            FROM auth_schema.users
                            WHERE username = $1`
        
        try {
            const existingUser = (await pool.query(queryString, [username])).rows[0]
            return existingUser        
        } catch (e) {
            throw e
        }
    }

    async findUserById(id: number) {
        const queryString = `SELECT * 
                            FROM auth_schema.users 
                            WHERE id = $1`

        try {
            const existingUser = (await pool.query(queryString, [id])).rows[0]
            return existingUser        
        } catch (e) {
            throw e
        }
    }

    async deleteUserById(id: number) {
        const queryString = `DELETE FROM auth_schema.users
                            WHERE id = $1
                            RETURNING *`

        try {
            const existingUser = (await pool.query(queryString, [id])).rows[0]
            return existingUser        
        } catch (e) {
            throw e
        }
    }

    async updateEmail(id: number, email: string) {
        const queryString = `UPDATE auth_schema.users
                            SET email = $1
                            WHERE id = $2
                            RETURNING id`
        const values = [email, id]

        try {
            const existingUser = (await pool.query(queryString, values)).rows[0]
            return existingUser
        } catch (e) {
            throw e
        }
    }

    async updateUsername(id: number, username: string) {
        const queryString = `UPDATE auth_schema.users
                            SET username = $1
                            WHERE id = $2
                            RETURNING username`
        const values = [username, id]

        try {
            const existingUser = (await pool.query(queryString, values)).rows[0]
            return existingUser
        } catch (e) {
            throw e
        }
    }

    async updatePassword(id: number, password: string) {
        const queryString = `UPDATE auth_schema.users
                            SET password = $1
                            WHERE id = $2
                            RETURNING password`
        const values = [password, id]

        try {
            const existingUser = (await pool.query(queryString, values)).rows[0]
            return existingUser
        } catch (e) {
            throw e
        }
    }

    async createRefreshToken(id: number, refreshToken: string) {
        const queryString = `INSERT INTO auth_schema.refresh_tokens (
                                user_id,
                                token
                            )
                            VALUES (
                                $1,
                                $2
                            )
                            RETURNING id`
        const values = [id, refreshToken]
        
        try {
            const existingUser = (await pool.query(queryString, values)).rows[0]
            return existingUser
        } catch (e) {
            throw e
        }
    }

    async deleteRefreshToken(refreshToken: string) {
        const queryString = `DELETE FROM auth_schema.refresh_tokens
                            WHERE token = $1
                            RETURNING user_id`

        try {
            const deletedUser = (await pool.query(queryString, [refreshToken])).rows
            return deletedUser
        } catch (e) {
            throw e
        }
    }

    async replaceRefreshToken(id: number, oldRefreshToken: string, newRefreshToken: string) {
        const client = await pool.connect()

        const createQueryString = `INSERT INTO auth_schema.refresh_tokens (
                                        user_id,
                                        token
                                    )
                                    VALUES (
                                        $1,
                                        $2
                                    )`
        const createValues = [id, newRefreshToken]
        
        const deleteQueryString = `DELETE FROM auth_schema.refresh_tokens
                                    WHERE token = $1`

        try {
            await client.query('BEGIN')

            await client.query(createQueryString, createValues)
            await client.query(deleteQueryString, [oldRefreshToken])

            await client.query('COMMIT')
            return id
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
    }

    async deleteAllUserRefreshToken(id: number) {
        const queryString = `DELETE FROM auth_schema.refresh_tokens
                            WHERE user_id = $1`

        try {
            await pool.query(queryString, [id])
            return id
        } catch (e) {
            throw e
        }
    }

    async getUserRefreshTokens(id: number) {
        const queryString = `SELECT token
                            FROM auth_schema.refresh_tokens
                            where user_id = $1`
        try {
            const tokens = (await pool.query(queryString, [id])).rows
            return tokens
        } catch (e) {
            throw e
        }
    }

    async findUserByRefreshToken(refreshToken: string) {
        const queryString = `SELECT 
                                users.id,
                                email,
                                password,
                                username,
                                salt
                            FROM auth_schema.refresh_tokens
                            INNER JOIN auth_schema.users ON user_id = users.id
                            WHERE token = $1`
        
        try {
            const existingUser = (await pool.query(queryString, [refreshToken])).rows[0]
            return existingUser
        } catch (e) {
            throw e
        }
    }
}

export default AuthRepository