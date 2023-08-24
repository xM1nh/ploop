import { EditRepository } from "../database";

class EditService {
    repository: EditRepository

    constructor() {
        this.repository = new EditRepository()
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

export default EditService