import express, {Express} from 'express'
import cors from 'cors'
import { corsOptions } from '../config'
import { Channel } from 'amqplib'
import EncodingService from '../services/encoding-service'
import { subscribeMessage } from '.'
import { QUEUE_NAME } from '../config'
import { PROCESSING_ROUTING_KEY } from '../config'
import cluster from 'cluster'

export default (app :Express, channel: Channel) => {
    app.use(express.json())
    app.use(cors(corsOptions))
    app.use(express.static(__dirname + '/public'))

    const service = new EncodingService()

    subscribeMessage(channel, QUEUE_NAME, PROCESSING_ROUTING_KEY, service.encode)
}