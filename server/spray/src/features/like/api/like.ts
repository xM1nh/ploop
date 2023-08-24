import { Channel } from "amqplib";
import { Express, Request, Response, NextFunction } from "express";
import LikeService from "../services/like-services";
import asyncHandler from 'express-async-handler'
import { subscribeMessage, publishMessage } from "../../../utils";
import { SPRAY_QUEUE, SPRAY_ROUTING_KEY, NOTIFICATION_ROUTING_KEY } from "../../../config";

export default (app: Express, channel: Channel) => {
    const service = new LikeService()

    //subscribeMessage(channel, service, SPRAY_QUEUE, SPRAY_ROUTING_KEY)

    app.get('/likes/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const limit = parseInt(req.query.count as string)
        const offset = limit * parseInt(req.query.page as string)

        const likes = await service.getLikes(id, limit, offset)
        
        res.status(200).json(likes)
    }))

    app.get('/like', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const sprayId = parseInt(req.query.sprayId as string)
        const userId = parseInt(req.query.userId as string)

        const like = await service.getLike(sprayId, userId)

        res.status(200).json(like)
    }))

    app.post('/like/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const {actorId, notifierId} = req.body

        await service.like(id, actorId)

        const message = {
            event: 'CREATE_NOTIFICATION',
            data: {
                entityTypeId: 300,
                entityId: id,
                actorId,
                notifierId
            }
        }

        publishMessage(channel, NOTIFICATION_ROUTING_KEY, message)

        res.sendStatus(200)
    }))
    
    app.delete('/like/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const {actorId, notifierId} = req.body

        await service.unlike(id, actorId)

        res.sendStatus(200)
    }))
}