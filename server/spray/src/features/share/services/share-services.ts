import { ShareRepository } from "../database";

class ShareService {
  repository: ShareRepository;

  constructor() {
    this.repository = new ShareRepository();
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

export default ShareService;
