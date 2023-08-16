import { Express, NextFunction, Request, Response } from "express"
import { Channel } from "amqplib"
import { subscribeMessage } from "../utils"
import { QUEUE_NAME, NOTIFICATION_ROUTING_KEY } from "../config"
import asyncHandler from 'express-async-handler'
import NotificationService from "../services/notification-services"

export default (app: Express, channel: Channel) => {
    const service = new NotificationService()

    subscribeMessage(channel, QUEUE_NAME, service, NOTIFICATION_ROUTING_KEY)

    app.get('/notification', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const {id} = req.body
        const {page} = req.query

        const notifications = await service.getNotificationsOfUser(id, parseInt(page as string))

        const response = notifications.map(async (notification) => {
            service.generateNotificationPackage(notification.entity_type_id, notification.actor_username, notification.created_on)
        })

        res.status(200).json({response, notifications})
    }))
}