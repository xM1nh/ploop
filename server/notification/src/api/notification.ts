import { Express, NextFunction, Request, Response } from "express"
import { Channel } from "amqplib"
import { subscribeMessage } from "../utils"
import { QUEUE_NAME, NOTIFICATION_ROUTING_KEY } from "../config"
import asyncHandler from 'express-async-handler'
import NotificationService from "../services/notification-services"

export default (app: Express, channel: Channel) => {
    const service = new NotificationService(channel)

    subscribeMessage(channel, QUEUE_NAME, service, NOTIFICATION_ROUTING_KEY)

    app.get('/notifications', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = parseInt(req.query.userId as string)
        const limit = parseInt(req.query.count as string)
        const offset = limit * (parseInt(req.query.page as string) - 1)
        const status = req.query.status

        switch (status) {
            case 'unread':
                const count = await service.getUnreadNotificationCountOfUser(userId)
                res.status(200).json(count)
                break
            case 'all':
                const notifications = await service.getNotificationsOfUser(userId, limit, offset)
                res.status(200).json(notifications)
                break
            default:
                break
        }
    }))

    app.put('/notifications/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const action = req.query.action
        const isAll = Boolean(req.query.all)

        switch (action) {
            case 'read':
                if (isAll) {
                    await service.markAllAsRead(id)
                    res.sendStatus(200)
                } else {
                    const notification = await service.markAsRead(id)
                    res.status(200).json(notification)
                }
                break
            case 'unread':
                if (isAll) {
                    await service.markAllAsUnread(id)
                    res.sendStatus(200)
                } else {
                    const notification = await service.markAsUnread(id)
                    res.status(200).json(notification)
                }
                break
            default:
                break
        }
    }))
}