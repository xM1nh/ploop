import { SprayRepository } from "../database";

class SprayService {
    repository: SprayRepository

    constructor() {
        this.repository = new SprayRepository()
    }

    async createNewSpray(
        url: string,
        creatorId: number,
        caption: string,
        viewPermission: number,
        drawPermission: number,
        limited: boolean,
        deadline: Date | null
    ) {
        console.log(deadline)
        const spray = await this.repository.addSpray(url, creatorId, caption, viewPermission, drawPermission, limited, deadline)
        return spray
    }

    async getSprays(
        limit: number,
        offset: number
    ) {
        const sprays = await this.repository.getPublicSprays(limit, offset)
        return sprays
    }

    async getSpray(
        id: number
    ) {
        const spray = await this.repository.findSprayById(id)
        return spray
    }

    async getSpraysForUser(
        id: number,
        limit: number,
        offset: number
    ) {
        const sprays = await this.repository.findSpraysByUserId(id, limit, offset)
        return sprays
    }

    async subscribeEvents(payload: string) {
        const message = JSON.parse(payload)

        const {event, data} = message

        const {
            url,
            userId: creatorId,
            caption,
            viewPermission,
            drawPermission,
            isLimited: limited,
            deadline
        } = data

        console.log(event, data)

        switch(event) {
            case 'CREATE_SPRAY':
                await this.createNewSpray(url, creatorId, caption, viewPermission, drawPermission, limited, JSON.parse(deadline))
                console.log('done')
                break
            default:
                break
        }
    }
}

export default SprayService