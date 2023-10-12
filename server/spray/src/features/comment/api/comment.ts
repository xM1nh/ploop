import { Channel } from "amqplib";
import { Express, Request, Response, NextFunction } from "express";
import CommentService from "../services/comment-services";
import asyncHandler from 'express-async-handler'
import { publishMessage } from "../../../utils";
import { NOTIFICATION_ROUTING_KEY } from "../../../config";

export default (app: Express, channel: Channel) => {
    const service = new CommentService()

    app.get('/comments', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const sprayId = parseInt(req.query.sprayId as string)
        const limit = parseInt(req.query.count as string)
        const offset = limit * (parseInt(req.query.page as string) - 1)

        const comments = await service.getComments(sprayId, limit, offset)

        res.status(200).json(comments)
    }))

    app.get('/comments/:commentId', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.commentId)

        const comment = await service.getComment(id)

        res.status(200).json(comment)
    }))

    app.post('/comments', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const {sprayId, userId, notifierId, comment} = req.body

        const response = await service.comment(sprayId, userId, comment)

        if (userId !== notifierId) {
            const message = {
                event: 'CREATE_NOTIFICATION',
                data: {
                    entityTypeId: 301,
                    entityId: sprayId,
                    actorId: userId,
                    notifierId
                }
            }
    
            publishMessage(channel, NOTIFICATION_ROUTING_KEY, message)
        }

        res.status(200).json(response)
    }))

    app.put('/comments/:commentId', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.commentId)
        const {newComment} = req.body

        const response = await service.editComment(id, newComment)

        res.status(200).json(response)
    }))

    app.delete('/comments/:commentId', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.commentId)
        const sprayId = parseInt(req.query.sprayId as string)

        const response = await service.deleteComment(sprayId, id)

        res.status(200).json(response)
    }))
}