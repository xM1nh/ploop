import { pool } from '..'

class AuthRepository {
    async createUser(
        email: string,
        password: string,
        username: string,
        salt: string,
    ) {
        const queryString = `INSERT INTO users (
                                email,
                                password,
                                username,
                                salt,
                                status
                            )
                            VALUES (
                                '${email}',
                                '${password}',
                                '${username}',
                                '${salt}',
                                0
                            )
                            RETURNING id`

        const user = (await pool.query(queryString)).rows[0].id
        return user
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

            const id = await this.createUser(email, password, username, salt)
            await this.createRefreshToken(id, refreshToken)

            await client.query('COMMIT')
            return id
        } catch (e) {
            await client.query('ROLLBACK')
            return null
        } finally {
            client.release()
        }
    }

    async findUserByEmail(email: string) {
        const queryString = `SELECT * 
                            FROM users 
                            WHERE email = '${email}'`

        const existingUser = (await pool.query(queryString)).rows[0]
        return existingUser
    }

    async findUserByUsername(username: string) {
        const queryString = `SELECT *
                            FROM users
                            WHERE username = '${username}'`
        
        const existingUser = (await pool.query(queryString)).rows[0]
        return existingUser
    }

    async findUserById(id: number) {
        const queryString = `SELECT * 
                            FROM users 
                            WHERE id = ${id}`

        const existingUser = (await pool.query(queryString)).rows[0]
        return existingUser
    }

    async updateEmail(id: number, email: string) {
        const queryString = `UPDATE users
                            SET email = '${email}'
                            WHERE id = ${id}
                            RETURNING id`

        const existingUser = (await pool.query(queryString)).rows[0]
        return existingUser
    }

    async updateUsername(id: number, username: string) {
        const queryString = `UPDATE users
                            SET username = '${username}'
                            WHERE id = ${id}
                            RETURNING username`

        const existingUser = (await pool.query(queryString)).rows[0]
        return existingUser
    }

    async updatePassword(id: number, password: string) {
        const queryString = `UPDATE users
                            SET password = '${password}'
                            WHERE id = ${id}
                            RETURNING password`

        const existingUser = (await pool.query(queryString)).rows[0]
        return existingUser
    }

    async createRefreshToken(id: number, refreshToken: string) {
        const queryString = `INSERT INTO refresh_tokens (
                                user_id,
                                token
                            )
                            VALUES (
                                ${id},
                                '${refreshToken}'
                            )
                            RETURNING id`
        
        const existingUser = (await pool.query(queryString)).rows[0]
        return existingUser
    }

    async deleteRefreshToken(refreshToken: string) {
        const queryString = `DELETE FROM refresh_tokens
                            WHERE token = '${refreshToken}'
                            RETURNING user_id`

        const deletedUser = (await pool.query(queryString)).rows
        return deletedUser
    }

    async replaceRefreshToken(id:number, oldRefreshToken: string, newRefreshToken: string) {
        const client = await pool.connect()

        const createQueryString = `INSERT INTO refresh_tokens (
                                        user_id,
                                        token
                                    )
                                    VALUES (
                                        ${id},
                                        '${newRefreshToken}'
                                    )
                                    RETURNING id`
        
        const deleteQueryString = `DELETE FROM refresh_tokens
                                    WHERE token = '${oldRefreshToken}'
                                    RETURNING user_id`

        try {
            await client.query('BEGIN')

            await client.query(createQueryString)
            await client.query(deleteQueryString)

            await client.query('COMMIT')
            return 1
        } catch (e) {
            await client.query('ROLLBACK')
            return 0
        } finally {
            client.release()
        }
    }

    async deleteAllUserRefreshToken(id: number) {
        const queryString = `DELETE FROM refresh_tokens
                            WHERE user_id = ${id}`

        await pool.query(queryString)
    }

    async getUserRefreshTokens(id: number) {
        const queryString = `SELECT token
                            FROM refresh_tokens
                            where user_id = ${id}`
        
        const tokens = (await pool.query(queryString)).rows
        return tokens
    }

    async findUserByRefreshToken(refreshToken: string) {
        const queryString = `SELECT 
                                users.id,
                                email,
                                password,
                                username,
                                salt,
                                status
                            FROM refresh_tokens
                            INNER JOIN users ON user_id = users.id
                            WHERE token = '${refreshToken}'`
        
        const existingUser = (await pool.query(queryString)).rows[0]
        return existingUser
    }
}

export default AuthRepository