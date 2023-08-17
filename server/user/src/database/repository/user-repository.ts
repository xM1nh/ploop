import { pool } from "..";

class UserRepository {
    async createUser(
        id: number,
        username: string,
        nickname: string,
        avatar_url: string,
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
                                ${id},
                                '${username}',
                                '${nickname}',
                                '${avatar_url}',
                                '${bio}'
                            )
                            RETURNING id`

        const user = (await pool.query(queryString)).rows[0]
        return user
    }

    async deleteUser(id: number) {
        const queryString = `DELETE FROM user_schema.users
                            WHERE id = ${id}`
        
        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            return null
        }
    }

    async findUserById(id: number) {
        const queryString = `SELECT * 
                            FROM user_schema.users 
                            WHERE id = ${id}`

        const user = (await pool.query(queryString)).rows[0]
        return user
    }

    async findUserByUsername(username: string) {
        const queryString = `SELECT *
                            FROM user_schema.users
                            WHERE username = ${username}`
        
        const user = (await pool.query(queryString)).rows[0]
        return user
    }

    async updateUsername(id: number, username: string) {
        const queryString = `UPDATE user_schema.users
                            SET username = '${username}'
                            WHERE id = ${id}
                            RETURNING id`

        const user = (await pool.query(queryString)).rows[0]
        return user
    }

    async updateAvatarUrl(id: number, avatar_url: string) {
        const queryString = `UPDATE user_schema.users
                            SET avatar_url = '${avatar_url}'
                            WHERE id = ${id}
                            RETURNING id`

        const user = (await pool.query(queryString)).rows[0]
        return user
    }

    async updateNickname(id: number, nickname: string) {
        const queryString = `UPDATE user_schema.users
                            SET nickname = '${nickname}'
                            WHERE id = ${id}
                            RETURNING id`

        const user = (await pool.query(queryString)).rows[0]
        return user
    }

    async updateBio(id: number, bio: string) {
        const queryString = `UPDATE user_schema.users
                            SET bio = '${bio}'
                            WHERE id = ${id}
                            RETURNING id`

        const user = (await pool.query(queryString)).rows[0]
        return user
    }

    async follow(followerId: number, followeeId: number) {
        const queryString = `INSERT INTO user_schema.follows (
                               follower_id,
                               followee_id 
                            ) VALUES (
                                ${followerId},
                                ${followeeId}
                            ) 
                            RETURNING id`
        
        const follow = (await pool.query(queryString)).rows[0]
        return follow
    }

    async unfollow(followerId: number, followeeId: number) {
        const queryString = `DELETE FROM follows
                            WHERE follower_id = ${followerId} AND followee_id = ${followeeId}`

        try {
            await pool.query(queryString)
            return true
        } catch (e) {
            return null
        }
    }

    async getFollow(followerId: number, followeeId: number) {
        const queryString = `SELECT 1
                            FROM user_schema.follows
                            WHERE follower_id = ${followerId} AND followee_id = ${followeeId}`

        const follow = (await pool.query(queryString)).rows[0]
        return follow
    }

    async getFollowersByUserId(
        id: number,
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT 
                                u.username
                            FROM user_schema.follows f
                            INNER JOIN user_schema.users AS u ON f.follower_id = u.id
                            WHERE followee_id = ${id}
                            ORDER BY f.created_on
                            LIMIT ${limit} OFFSET ${offset}`

        const followers = (await pool.query(queryString)).rows
        return followers
    }

    async getFollowingByUserId(
        id: number,
        limit: number,
        offset: number
    ) {
        const queryString = `SELECT 
                                u.username
                            FROM user_schema.follows f
                            INNER JOIN user_schema.users AS u ON f.followee_id = u.id
                            WHERE follower_id = ${id}
                            ORDER BY f.created_on
                            LIMIT ${limit} OFFSET ${offset}`

        const followings = (await pool.query(queryString)).rows
        return followings
    }

    async increaseFollowers(id: number) {
        const queryString = `UPDATE user_schema.users
                            SET followers = followers + 1
                            WHERE id = ${id}
                            RETURNING id`

        const user = (await pool.query(queryString)).rows[0]
        return user
    }

    async decreaseFollowers(id: number) {
        const queryString = `UPDATE user_schema.users
                            SET followers = followers - 1
                            WHERE id = ${id}
                            RETURNING id`

        const user = (await pool.query(queryString)).rows[0]
        return user
    }

    async increaseFollowings(id: number) {
        const queryString = `UPDATE user_schema.users
                            SET followings = followings + 1
                            WHERE id = ${id}`

        const user = (await pool.query(queryString)).rows[0]
        return user
    }

    async decreaseFollowings(id: number) {
        const queryString = `UPDATE user_schema.users
                            SET followings = followings - 1
                            WHERE id = ${id}`

        const user = (await pool.query(queryString)).rows[0]
        return user
    }
}

export default UserRepository