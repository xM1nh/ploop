import { Express } from "express"
import { Channel } from "amqplib"
import { subscribeMessage } from "../utils"
import { QUEUE_NAME, PROCESSING_ROUTING_KEY } from "../config"
import EncodingService from "../services/encoding-service"

export default (app: Express, channel: Channel) => {
    const service = new EncodingService()

    subscribeMessage(channel, QUEUE_NAME, service, PROCESSING_ROUTING_KEY)
}