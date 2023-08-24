import { Channel } from "amqplib";
import { Express, Request, Response, NextFunction } from "express";
import SprayService from "../services/spray-services";
import asyncHandler from 'express-async-handler'
import { subscribeMessage } from "../../../utils";
import { SPRAY_QUEUE, SPRAY_ROUTING_KEY } from "../../../config";

export default (app: Express, channel: Channel) => {
    const service = new SprayService()

    subscribeMessage(channel, service, SPRAY_QUEUE, SPRAY_ROUTING_KEY)

    app.get('/spray', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const limit = parseInt(req.query.count as string)
        const offset = limit * parseInt(req.query.page as string)
        const sprays = await service.getSprays(limit, offset)

        res.status(200).json(sprays)
    }))

    app.get('/spray/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const spray = await service.getSpray(id)

        res.status(200).json(spray)
    }))

    app.get('/spray/user/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const limit = parseInt(req.query.count as string)
        const offset = limit * parseInt(req.query.page as string)

        const sprays = await service.getSpraysForUser(id, limit, offset)

        res.status(200).json(sprays)
    }))
}