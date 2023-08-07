import express, {Express} from 'express'
import cors from 'cors'
import { Channel } from 'amqplib'
import upload from '../api/upload'
import { corsOptions } from '../config'
import errorHandler from './errorHandler'

export default (app :Express, channel: Channel) => {

    app.use(express.json())
    app.use(cors(corsOptions))
    app.use(express.static(__dirname + '/public'))

    upload(app, channel)

    app.use(errorHandler)

}