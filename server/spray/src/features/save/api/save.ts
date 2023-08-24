import { Channel } from "amqplib";
import { Express, Request, Response, NextFunction } from "express";
import SaveService from "../services/save-services";
import asyncHandler from 'express-async-handler'
import { subscribeMessage } from "../../../utils";
import { SPRAY_QUEUE, SPRAY_ROUTING_KEY } from "../../../config";

export default (app: Express, channel: Channel) => {
    const service = new SaveService()

    //subscribeMessage(channel, service, SPRAY_QUEUE, SPRAY_ROUTING_KEY)

    app.get('/saves/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const limit = parseInt(req.query.count as string)
        const offset = limit * parseInt(req.query.page as string)

        const saves = await service.getSaves(id, limit, offset)
        
        res.status(200).json(saves)
    }))

    app.get('/save', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const sprayId = parseInt(req.query.sprayId as string)
        const userId = parseInt(req.query.userId as string)

        const save = await service.getSave(sprayId, userId)

        res.status(200).json(save)
    }))

    app.post('/save/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const {actorId, notifierId} = req.body

        await service.save(id, actorId)

        const message = {
            event: 'CREATE_NOTIFICATION',
            data: {
                entityTypeId: 300,
                entityId: id,
                actorId,
                notifierId
            }
        }

        res.sendStatus(200)
    }))
    
    app.delete('/save/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const {actorId, notifierId} = req.body

        await service.unsave(id, actorId)

        res.sendStatus(200)
    }))
}