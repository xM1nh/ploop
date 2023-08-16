import express, {Express} from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { auth } from '../api'
import { corsOptions } from '../config'
import { Channel } from 'amqplib'

export default (app :Express, channel: Channel) => {

    app.use(express.json())
    app.use(cors(corsOptions))
    app.use(express.static(__dirname + '/public'))
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())

    auth(app, channel)
}