import AuthService from "../services/auth-services";
import { Express, Request, Response } from "express";
import asyncHandler from 'express-async-handler'
import { publishMessage } from "../utils";
import { Channel } from "amqplib";
import { USER_ROUTING_KEY } from "../config";

const auth = (app: Express, channel: Channel) => {
    const service = new AuthService()

    app.post('/signup', asyncHandler(async (req: Request, res: Response) => {
        const {email, password, nickname} = req.body

        const data = await service.signUp(email, password)
        if (!data.id) res.sendStatus(409) //Conflict
        else {
            const message = {
                event: 'SIGN_UP',
                data: {
                    id: data.id,
                    username: data.username,
                    nickname
                }
            }

            publishMessage(channel, USER_ROUTING_KEY, message)

            res.status(200).json({userId: data.id})
        }
    }))

    app.post('/login', asyncHandler(async (req: Request, res: Response) => {
        const {email, password} = req.body

        let data
        if (email) data = await service.signInByEmail(email, password)
        //if (username) data = await service.signInByUsername(username, password)

        if (data) {
            res.cookie('jwt', data.newRefreshToken, {
                httpOnly: true, 
                sameSite: 'none', 
                secure: true
            })
            res.status(200).json({id: data.id, accessToken: data.accessToken})
        } else {
            res.sendStatus(401)
        }
    }))

    app.post('/logout', asyncHandler(async (req: Request, res: Response) => {
        const cookies = req.cookies
        if (!cookies.jwt) res.status(204)
        const refreshToken = cookies.jwt
        res.clearCookie('jwt', {
            httpOnly: true, 
            sameSite: 'none', 
            secure: true
        })
        const response = await service.signOut(refreshToken)
        res.json({message: 'Logged out'})
    }))

    app.get('/refresh', asyncHandler(async (req: Request, res: Response) => {
        const cookies = req.cookies
        if (!cookies?.jwt) res.sendStatus(401)
        const refreshToken = cookies.jwt

        const response = await service.refresh(refreshToken)
        if (response === 403) res.sendStatus(403)
        else {
            const {accessToken ,newRefreshToken} = response
            res.clearCookie('jwt', {
                httpOnly: true, 
                sameSite: 'none', 
                secure: true
            })
            res.cookie('jwt', newRefreshToken, {
                httpOnly: true, 
                sameSite: 'none', 
                secure: true
            })
            res.status(200).json(accessToken)
        }
    }))

    app.post('/password', asyncHandler(async (req: Request, res: Response) => {
        const cookies = req.cookies
        if (!cookies?.jwt) res.sendStatus(401)
        const {id, newPassword} = req.body

        const newRefreshToken = await service.changePassword(id, newPassword)

        res.clearCookie('jwt', {
            httpOnly: true, 
            sameSite: 'none', 
            secure: true
        })

        res.cookie('jwt', newRefreshToken, {
            httpOnly: true, 
            sameSite: 'none', 
            secure: true
        })
        res.sendStatus(200)
    }))

    app.post('/username', asyncHandler(async (req: Request, res: Response) => {
        const cookies = req.cookies
        if (!cookies?.jwt) res.status(401)

        const {id, newUsername} = req.body
        const refreshToken = cookies.jwt

        const newRefreshToken = await service.changeUsername(id, newUsername, refreshToken)

        res.clearCookie('jwt', {
            httpOnly: true, 
            sameSite: 'none', 
            secure: true
        })

        res.cookie('jwt', newRefreshToken, {
            httpOnly: true, 
            sameSite: 'none', 
            secure: true
        })
        res.sendStatus(200)
    }))
}

export default auth