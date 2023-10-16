import { Channel } from "amqplib";
import { Express, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { publishMessage } from "../utils";
import {
  PROCESSING_ROUTING_KEY,
  NOTIFICATION_ROUTING_KEY,
  USER_ROUTING_KEY,
  BASE_URL,
} from "../config";
import { uploadToDisk, uploadToR2 } from "../config";

export default (app: Express, channel: Channel) => {
  app.post(
    "/sprays",
    uploadToDisk.array("sprays[]"),

    asyncHandler(async (req: Request, res: Response) => {
      const id = req.headers["x-upload-id"];
      const {
        userId,
        caption,
        viewPermission,
        drawPermission,
        isLimited,
        deadline,
      } = req.body;
      const processingMessage = {
        event: "PROCESS",
        data: {
          userId,
          id,
          caption,
          viewPermission,
          drawPermission,
          isLimited,
          deadline,
        },
      };

      const notificationMessage = {
        event: "CREATE_NOTIFICATION",
        data: {
          entityTypeId: 100,
          entityId: -1,
          actorId: -1,
          notifierId: userId,
        },
      };
      publishMessage(channel, PROCESSING_ROUTING_KEY, processingMessage);
      publishMessage(channel, NOTIFICATION_ROUTING_KEY, notificationMessage);
      res.sendStatus(200);
    }),
  );

  app.post(
    "/avatar",
    uploadToR2.single("avatar"),

    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.body;
      const url = `${BASE_URL}/user-avatar/${id}`;

      const message = {
        event: "CHANGE_AVATAR",
        data: {
          id,
          url,
        },
      };

      publishMessage(channel, USER_ROUTING_KEY, message);
      res.sendStatus(200);
    }),
  );
};
