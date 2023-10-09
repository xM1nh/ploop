import { Express, NextFunction, Request, Response } from "express"
import { Channel } from "amqplib"
import { subscribeMessage } from "../utils"
import { QUEUE_NAME, NOTIFICATION_ROUTING_KEY } from "../config"
import asyncHandler from 'express-async-handler'
import NotificationService from "../services/notification-services"

export default (app: Express, channel: Channel) => {
    const service = new NotificationService()

    subscribeMessage(channel, QUEUE_NAME, service, NOTIFICATION_ROUTING_KEY)

    app.get('/notifications', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = parseInt(req.query.userId as string)
        const limit = parseInt(req.query.count as string)
        const offset = limit * (parseInt(req.query.page as string) - 1)

        const notifications = await service.getNotificationsOfUser(userId, limit, offset)

        res.status(200).json(notifications)
    }))

    app.post('/notifications/:id/read', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)

        const notification = await service.markAsRead(id)

        res.status(200).json(notification)
    }))

    app.post('/notifications/:id/unread', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)

        const notification = await service.markAsUnread(id)

        res.status(200).json(notification)
    }))
}