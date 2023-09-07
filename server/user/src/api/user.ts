import UserService from "../services/user-services";
import { Express, Request, Response, NextFunction } from "express";
import { Channel } from "amqplib";
import { publishMessage, subscribeMessage } from "../utils";
import { upload, USER_QUEUE, USER_ROUTING_KEY, AUTH_ROUTING_KEY, CLOUDFLARE_ACCOUNT_ID } from "../config";
import asyncHandler from 'express-async-handler'

const user = (app: Express, channel: Channel) => {
    const service = new UserService()

    subscribeMessage(channel, USER_QUEUE, service, USER_ROUTING_KEY)

    app.get('/users/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)

        const user = await service.getProfile(id)

        res.status(200).json(user)
    }))

    app.delete('/users/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)

        const user = await service.deleteAccount(id)

        const message = {
            event: 'DELETE_ACCOUNT',
            data: {
                id
            }
        }

        publishMessage(channel, AUTH_ROUTING_KEY, message)
        
        res.status(200).json(user)
    }))

    app.put('/users/:id', 
        upload.single('avatar'),

        asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
            const id = parseInt(req.params.id)

            const filename = req.file?.filename
            if (filename) {
                const fileLocation = `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/ploop/${req.file?.filename}`
                await service.changeAvatar(id, fileLocation)
            }

            const {username, nickname, bio} = req.body

            if (username) {
                await service.changeUsername(id, username)
                const message = {
                    event: 'CHANGE_USERNAME',
                    data: {
                        id,
                        username
                    }
                }
                publishMessage(channel, AUTH_ROUTING_KEY, message)
            }
            if (nickname) await service.changeNickname(id, nickname)
            if (bio) await service.changeBio(id, bio)

            res.sendStatus(200)
        })
    )

    app.get('/users/:id/follow', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const followerId = parseInt(req.params.id)
        const followeeId = parseInt(req.query.followeeId as string)

        const follow = await service.getFollow(followerId, followeeId)

        res.status(200).json(follow)
    }))

    app.post('/users/:id/follow', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const followerId = parseInt(req.params.id)
        const {followeeId} = req.body

        const response = await service.follow(followerId, parseInt(followeeId))

        if (!response) res.sendStatus(500)
        else res.status(200).json(response)
    }))

    app.delete('/users/:id/follow', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const followerId = parseInt(req.params.id)
        const followeeId = parseInt(req.query.followeeId as string)

        const response = await service.unfollow(followerId, followeeId)

        if (!response) res.sendStatus(500)
        else res.status(200).json(response)
    }))

    app.get('/users/:id/followers', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const limit = parseInt(req.query.count as string)
        const page = parseInt(req.query.page as string)

        const followers = await service.getFollowers(id, limit, page)
        res.status(200).json(followers)
    }))

    app.get('/users/:id/followings', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id)
        const limit = parseInt(req.query.count as string)
        const page = parseInt(req.query.page as string)

        const followings = await service.getFollowings(id, limit, page)
        res.status(200).json(followings)
    }))
}

export default user