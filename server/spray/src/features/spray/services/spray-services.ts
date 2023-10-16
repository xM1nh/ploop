import { SprayRepository } from "../database";

class SprayService {
  repository: SprayRepository;

  constructor() {
    this.repository = new SprayRepository();
  }

  async createNewSpray(
    url: string,
    coverUrl: string,
    creatorId: number,
    caption: string,
    viewPermission: number,
    drawPermission: number,
    limited: boolean,
    deadline: Date | string,
    originalId: number | null,
  ) {
    const spray = await this.repository.addSpray(
      url,
      coverUrl,
      creatorId,
      caption,
      viewPermission,
      drawPermission,
      limited,
      deadline,
      originalId,
    );
    return spray;
  }

  async getSprays(limit: number, offset: number) {
    const sprays = await this.repository.getPublicSprays(limit, offset);
    const response = sprays.map((spray: any) => ({
      ...spray,
      deadline: spray.deadline === Infinity ? "Infinity" : spray.deadline,
    }));
    return response;
  }

  async getSpray(id: number) {
    const spray = await this.repository.findSprayById(id);
    return {
      ...spray,
      deadline: spray.deadline === Infinity ? "Infinity" : spray.deadline,
    };
  }

  async getOriginalSpraysForUser(id: number, limit: number, offset: number) {
    const sprays = await this.repository.findSpraysByUserId(id, limit, offset);
    const response = sprays.map((spray) => ({
      ...spray,
      deadline: spray.deadline === Infinity ? "Infinity" : spray.deadline,
    }));
    return response;
  }

  async getRespraysForUser(id: number, limit: number, offset: number) {
    const sprays = await this.repository.findRespraysByUserId(
      id,
      limit,
      offset,
    );
    const response = sprays.map((spray) => ({
      ...spray,
      deadline: spray.deadline === Infinity ? "Infinity" : spray.deadline,
    }));
    return response;
  }

  async getRespraysForSpray(id: number, limit: number, offset: number) {
    const sprays = await this.repository.findRespraysByOriginalId(
      id,
      limit,
      offset,
    );
    const response = sprays.map((spray) => ({
      ...spray,
      deadline: spray.deadline === Infinity ? "Infinity" : spray.deadline,
    }));
    return response;
  }

  async deleteSpray(id: number) {
    const spray = await this.repository.deleteSprayById(id);
    return {
      ...spray,
      deadline: spray.deadline === Infinity ? "Infinity" : spray.deadline,
    };
  }

  async deleteUserSprays(id: number) {
    await this.repository.deleteSpraysByUserId(id);
  }

  async updateCaption(id: number, newCaption: string) {
    const spray = await this.repository.editCaption(id, newCaption);
    return {
      ...spray,
      deadline: spray.deadline === Infinity ? "Infinity" : spray.deadline,
    };
  }

  async updateUrl(id: number, newUrl: string) {
    const spray = await this.repository.editUrl(id, newUrl);
    return {
      ...spray,
      deadline: spray.deadline === Infinity ? "Infinity" : spray.deadline,
    };
  }

  async updateViewPermission(id: number, viewPermission: number) {
    const spray = await this.repository.editViewPermission(id, viewPermission);
    return {
      ...spray,
      deadline: spray.deadline === Infinity ? "Infinity" : spray.deadline,
    };
  }

  async updateDrawPermission(id: number, drawPermission: number) {
    const spray = await this.repository.editDrawPermission(id, drawPermission);
    return {
      ...spray,
      deadline: spray.deadline === Infinity ? "Infinity" : spray.deadline,
    };
  }

  async updateLimitation(id: number, limited: boolean, deadline?: Date) {
    if (!limited) {
      const spray = await this.repository.editLimitation(id, false, "infinity");
      return {
        ...spray,
        deadline: spray.deadline === Infinity ? "Infinity" : spray.deadline,
      };
    } else {
      const spray = await this.repository.editLimitation(id, true, deadline);
      return {
        ...spray,
        deadline: spray.deadline === Infinity ? "Infinity" : spray.deadline,
      };
    }
  }

  async subscribeEvents(payload: string) {
    const message = JSON.parse(payload);

    const { event, data } = message;

    const {
      sprayUrl,
      coverUrl,
      userId: creatorId,
      caption,
      viewPermission,
      drawPermission,
      isLimited: limited,
      deadline,
      originalId,
    } = data;

    console.log(event, data);

    switch (event) {
      case "CREATE_SPRAY":
        await this.createNewSpray(
          sprayUrl,
          coverUrl,
          creatorId,
          caption,
          viewPermission,
          drawPermission,
          limited,
          JSON.parse(deadline),
          originalId,
        );
        break;
      default:
        break;
    }
  }
}

export default SprayService;
