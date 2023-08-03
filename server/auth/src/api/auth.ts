import AuthService from "../services/auth-services";
import { Express, Request, Response } from "express";
import asyncHandler from 'express-async-handler'

const auth = (app: Express) => {
    const service = new AuthService()

    app.post('/signup', asyncHandler(async (req: Request, res: Response) => {
        const {email, password} = req.body

        const data = await service.signUp(email, password)
        console.log(data)
        if (!data.existingUser) res.sendStatus(409) //Conflict
        else {
            res.cookie('jwt', data.refreshToken, {
                httpOnly: true, 
                sameSite: 'none', 
                secure: true
            })
        }
    }))

    app.post('/login', asyncHandler(async (req: Request, res: Response) => {
        const cookies = req.cookies
        const {email, password} = req.body

        let username
        if (res.locals.newUsername) username = res.locals.newUsername
        else username = req.body.username

        const refreshToken = cookies.jwt
        if (refreshToken) res.clearCookie('jwt', {
            httpOnly: true, 
            sameSite: 'none', 
            secure: true
        })

        let data
        if (email) data = await service.signInByEmail(email, password, refreshToken)
        if (username) data = await service.signInByUsername(username, password, refreshToken)

        if (data) {
            res.cookie('jwt', data.newRefreshToken, {
                httpOnly: true, 
                sameSite: 'none', 
                secure: true
            })
            res.status(200).json({id: data.id, accessToken: data.accessToken})
        } else {
            res.status(401)
        }
    }))

    app.post('/logout', asyncHandler(async (req: Request, res: Response) => {
        const cookies = req.cookies
        if (!cookies.jwt) res.status(204)
        res.clearCookie('jwt', {
            httpOnly: true, 
            sameSite: 'none', 
            secure: true
        })
        res.json({message: 'Logged out'})
    }))

    app.get('/refresh', asyncHandler(async (req: Request, res: Response) => {
        const cookies = req.cookies
        if (!cookies?.jwt) res.status(401)
        const refreshToken = cookies.jwt

        const response = await service.refresh(refreshToken)
        if (response === 403) res.status(403)
        else {
            const {accessToken, newRefreshToken} = response
        }
    }))

    app.post('/password', asyncHandler(async (req: Request, res: Response) => {
        const cookies = req.cookies
        if (!cookies?.jwt) res.status(401)
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
    }))
}

export default auth