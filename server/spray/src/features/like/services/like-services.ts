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
        await this.repository.addLike(sprayId, userId)
        await this.repository.increaseCount(sprayId)
    }

    async unlike(
        sprayId: number,
        userId: number
    ) {
        const isLike = await this.repository.findLikeByUserIdAndSprayId(sprayId, userId)
        if (!isLike) return
        await this.repository.deleteLikeByUserIdAndSprayId(sprayId, userId)
        await this.repository.decreaseCount(sprayId)
    }

    async removeAllLikesByUserId(
        id: number
    ) {
        await this.repository.deleteLikesByUserId(id)
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