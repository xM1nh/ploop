import { Channel } from "amqplib";
import { Express, Request, Response, NextFunction } from "express";
import CommentService from "../services/comment-services";
import asyncHandler from 'express-async-handler'
import { subscribeMessage, publishMessage } from "../../../utils";
import { SPRAY_QUEUE, SPRAY_ROUTING_KEY, NOTIFICATION_ROUTING_KEY } from "../../../config";

export default (app: Express, channel: Channel) => {
    const service = new CommentService()

    //subscribeMessage(channel, service, SPRAY_QUEUE, SPRAY_ROUTING_KEY)

    app.get('/comment/:sprayId', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.sprayId)
        const limit = parseInt(req.query.count as string)
        const offset = limit * parseInt(req.query.page as string)

        const comments = await service.getComments(id, limit, offset)

        res.status(200).json(comments)
    }))

    app.post('/comment/:sprayId', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.sprayId)
        const {actorId, notifierId, comment} = req.body

        const commentId = await service.comment(id, actorId, comment)

        const message = {
            event: 'CREATE_NOTIFICATION',
            data: {
                entityTypeId: 301,
                entityId: id,
                actorId,
                notifierId
            }
        }

        publishMessage(channel, NOTIFICATION_ROUTING_KEY, message)

        res.status(200).json(commentId)
    }))

    app.put('/comment/:commentId', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.commentId)
        const {newComment} = req.body

        await service.editComment(id, newComment)

        res.sendStatus(200)
    }))

    app.delete('/comment/:commentId', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.commentId)
        const {commentId} = req.body

        await service.deleteComment(id, commentId)

        res.sendStatus(200)
    }))
}