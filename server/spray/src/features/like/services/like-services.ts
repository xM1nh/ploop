import { LikeRepository } from "../database";

class LikeService {
    repository: LikeRepository

    constructor() {
        this.repository = new LikeRepository()
    }

    async getLikes(
        id: number,
        limit: number,
        offset: number
    ) {
        const likes = await this.repository.findLikesBySprayId(id, limit, offset)
        return likes
    }

    async getLike(
        sprayId: number,
        userId: number
    ) {
        const like = await this.repository.findLikeByUserIdAndSprayId(sprayId, userId)
        return like
    }

    async like(
        sprayId: number,
        userId: number
    ) {
        const isLike = await this.repository.findLikeByUserIdAndSprayId(sprayId, userId)
        if (isLike) return

        const response = await this.repository.addLike(sprayId, userId)
        await this.repository.increaseCount(sprayId, 1)
        return response
    }

    async unlike(
        sprayId: number,
        userId: number
    ) {
        const isLike = await this.repository.findLikeByUserIdAndSprayId(sprayId, userId)
        if (!isLike) return

        const response = await this.repository.deleteLikeByUserIdAndSprayId(sprayId, userId)
        await this.repository.decreaseCount(sprayId, 1)
        return response
    }

    async removeAllLikesByUserId(
        id: number
    ) {
        const deleteLikes = await this.repository.deleteLikesByUserId(id)
        const groupedBySprayId: {
            [key: string]: number
        } = {}

        deleteLikes.forEach((like: {spray_id: number}) => {
            if (groupedBySprayId[like.spray_id]) groupedBySprayId[like.spray_id]++
            else groupedBySprayId[like.spray_id] = 1
        })

        for (const key in Object.entries(groupedBySprayId)) {
            await this.repository.decreaseCount(parseInt(key), groupedBySprayId[key])
        }
    }

    async subscribeEvents(payload: string) {
        const message = JSON.parse(payload)

        const {event, data} = message

        const {
            userId
        } = data

        switch(event) {
            case 'DELETE_USER':
                await this.removeAllLikesByUserId(userId)
            default:
                break
        }
    }
}

export default LikeService