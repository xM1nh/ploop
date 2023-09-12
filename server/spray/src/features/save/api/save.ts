import { Channel } from "amqplib";
import { Express, Request, Response, NextFunction } from "express";
import SaveService from "../services/save-services";
import asyncHandler from 'express-async-handler'
import { subscribeMessage } from "../../../utils";
import { SPRAY_QUEUE, SPRAY_ROUTING_KEY } from "../../../config";

export default (app: Express, channel: Channel) => {
    const service = new SaveService()

    app.get('/saves', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = parseInt(req.query.userId as string)
        const limit = parseInt(req.query.count as string)
        const offset = limit * parseInt(req.query.page as string)

        const saves = await service.getSaves(userId, limit, offset)
        
        res.status(200).json(saves)
    }))

    app.get('/saves/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const sprayId = parseInt(req.params.sprayId)
        const userId = parseInt(req.query.userId as string)

        const save = await service.getSave(sprayId, userId)

        res.status(200).json(save)
    }))

    app.post('/saves', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const {userId, sprayId} = req.body

        const save = await service.save(sprayId, userId)

        res.status(200).json(save)
    }))
    
    app.delete('/saves/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const actorId = parseInt(req.query.userId as string)

        const save = await service.unsave(id, actorId)

        res.status(200).json(save)
    }))
}