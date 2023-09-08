import { Channel } from "amqplib";
import { Express, Request, Response, NextFunction } from "express";
import SprayService from "../services/spray-services";
import asyncHandler from 'express-async-handler'
import { subscribeMessage } from "../../../utils";
import { SPRAY_QUEUE, SPRAY_ROUTING_KEY } from "../../../config";

export default (app: Express, channel: Channel) => {
    const service = new SprayService()

    subscribeMessage(channel, service, SPRAY_QUEUE, SPRAY_ROUTING_KEY)

    app.get('/sprays', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const limit = parseInt(req.query.count as string)
        const offset = limit * (parseInt(req.query.page as string) - 1)
        const sprays = await service.getSprays(limit, offset)

        res.status(200).json(sprays)
    }))

    app.get('/sprays/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const spray = await service.getSpray(id)

        res.status(200).json(spray)
    }))

    app.get('/sprays/users/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const limit = parseInt(req.query.count as string)
        const offset = limit * parseInt(req.query.page as string)

        const sprays = await service.getSpraysForUser(id, limit, offset)

        res.status(200).json(sprays)
    }))

    app.delete('/sprays/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)

        const spray = await service.deleteSpray(id)
        res.status(200).json(spray)
    }))

    app.put('/sprays/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        console.log(req.body)
        const {
            caption, 
            viewPermission, 
            drawPermission, 
            limited, 
            deadline
        } = req.body

        let spray

        if (caption) spray = await service.updateCaption(id, caption)
        if (viewPermission) spray = await service.updateViewPermission(id, viewPermission)
        if (drawPermission) spray = await service.updateDrawPermission(id, drawPermission)
        if (limited) spray = await service.updateLimitation(id, limited, deadline)

        res.status(200).json(spray)
    }))
}