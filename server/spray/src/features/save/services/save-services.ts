import { SaveRepository } from "../database";

class SaveService {
  repository: SaveRepository;

  constructor() {
    this.repository = new SaveRepository();
  }

  async getSaves(id: number, limit: number, offset: number) {
    const saves = await this.repository.findSavesByUserId(id, limit, offset);
    return saves;
  }

  async getSave(sprayId: number, userId: number) {
    const save = await this.repository.findSaveByUserIdAndSprayId(
      sprayId,
      userId,
    );
    return save;
  }

  async save(sprayId: number, userId: number) {
    const response = await this.repository.addSave(sprayId, userId);
    await this.repository.increaseCount(sprayId, 1);
    return response;
  }

  async unsave(sprayId: number, userId: number) {
    const response = await this.repository.deleteSaveByUserIdAndSprayId(
      sprayId,
      userId,
    );
    await this.repository.decreaseCount(sprayId, 1);
    return response;
  }

  async removeAllSavesByUser(id: number) {
    const deleteSaves = await this.repository.deleteSavesByUserId(id);
    const groupedBySprayId: {
      [key: string]: number;
    } = {};

    deleteSaves.forEach((save: { spray_id: number }) => {
      if (groupedBySprayId[save.spray_id]) groupedBySprayId[save.spray_id]++;
      else groupedBySprayId[save.spray_id] = 1;
    });

    for (const key in Object.entries(groupedBySprayId)) {
      await this.repository.decreaseCount(parseInt(key), groupedBySprayId[key]);
    }
  }

  async subscribeEvents(payload: string) {
    const message = JSON.parse(payload);

    const { event, data } = message;

    switch (event) {
      case "CREATE_SPRAY":
        break;
      default:
        break;
    }
  }
}

export default SaveService;
