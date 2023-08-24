import { SaveRepository } from "../database";

class SaveService {
    repository: SaveRepository

    constructor() {
        this.repository = new SaveRepository()
    }

    async getSaves(
        id: number,
        limit: number,
        offset: number
    ) {
        const saves = await this.repository.findSavesByUserId(id, limit, offset)

        return saves
    }

    async getSave(
        sprayId: number,
        userId: number
    ) {
        const save = await this.repository.findSaveByUserIdAndSprayId(sprayId, userId)

        return save
    }

    async save(
        sprayId: number,
        userId: number
    ) {
        await this.repository.addSave(sprayId, userId)
        await this.repository.increaseCount(sprayId)
    }

    async unsave(
        sprayId: number,
        userId: number
    ) {
        await this.repository.deleteSaveByUserIdAndSprayId(sprayId, userId)
        await this.repository.decreaseCount(sprayId)
    }

    async subscribeEvents(payload: string) {
        const message = JSON.parse(payload)

        const {event, data} = message

        switch(event) {
            case 'CREATE_SPRAY':
                break
            default:
                break
        }
    }
}

export default SaveService