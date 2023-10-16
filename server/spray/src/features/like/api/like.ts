import { Channel } from "amqplib";
import { Express, Request, Response, NextFunction } from "express";
import LikeService from "../services/like-services";
import asyncHandler from "express-async-handler";
import { publishMessage } from "../../../utils";
import { NOTIFICATION_ROUTING_KEY } from "../../../config";

export default (app: Express, channel: Channel) => {
  const service = new LikeService();

  app.get(
    "/likes",
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const id = parseInt(req.query.sprayId as string);
      const limit = parseInt(req.query.count as string);
      const offset = limit * parseInt(req.query.page as string);

      const likes = await service.getLikes(id, limit, offset);

      res.status(200).json(likes);
    }),
  );

  app.get(
    "/likes/:id",
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const sprayId = parseInt(req.params.id);
      const userId = parseInt(req.query.userId as string);

      const like = await service.getLike(sprayId, userId);

      res.status(200).json(like);
    }),
  );

  app.post(
    "/likes",
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const { sprayId, userId, notifierId } = req.body;

      const like = await service.like(sprayId, userId);

      const message = {
        event: "CREATE_NOTIFICATION",
        data: {
          entityTypeId: 300,
          entityId: sprayId,
          userId,
          notifierId,
        },
      };

      publishMessage(channel, NOTIFICATION_ROUTING_KEY, message);

      res.status(200).json(like);
    }),
  );

  app.delete(
    "/likes",
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const sprayId = parseInt(req.query.sprayId as string);
      const actorId = parseInt(req.query.userId as string);

      const like = await service.unlike(sprayId, actorId);

      res.status(200).json(like);
    }),
  );
};
