import { Request } from 'express'
import bcrypt from 'bcrypt'
import {v4 as uuidv4} from 'uuid'
import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../config'

export const generateSalt = async () => {
    return await bcrypt.genSalt()
}

export const generatePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}

export const validatePassword = async (password: string, savedPassword: string, salt: string) => {
    return (await generatePassword(password, salt)) === savedPassword
}

export const generateUsername = async () => {
    const hexString = uuidv4()
    return `user${Buffer.from(hexString.replace(/-/g, ''), 'hex').toString('base64url')}`
}

export const formatData = (data: any) => {
    if (data) return data
    else throw new Error('Data not found')
}

export const generateAccessToken = (username: string) => {
    return jwt.sign(
        {
            username: username
        },
        `${ACCESS_TOKEN_SECRET}`,
        {expiresIn: '15m'}
    )
}

export const generateRefreshToken = (username: string) => {
    return jwt.sign(
        {
            username: username
        },
        `${REFRESH_TOKEN_SECRET}`,
        {expiresIn: '7d'}
    )
}

export const verifyAccessToken = (req: Request) => {
    try {
        const authHeader = req.get('authorization') || req.get('Authorization')
        const token = authHeader?.split(' ')[1]
        const payload = jwt.verify(token as string, ACCESS_TOKEN_SECRET as string)
        return payload
    } catch (err) {
        return null
    }
}