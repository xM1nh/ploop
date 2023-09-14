import amqp, {Channel} from 'amqplib'
import EncodingService from '../services/encoding-service'
import { MESSAGE_BROKER_URL, EXCHANGE_NAME } from '../config'

export const connect = async () => {
    try {
        const connection = await amqp.connect(MESSAGE_BROKER_URL as string)
        const channel = await connection.createChannel()
        await channel.assertExchange(EXCHANGE_NAME, 'direct', {
            durable: true
        })
        return channel
    } catch (e) {
        throw e
    }
}

export const publishMessage = (channel: Channel, routingKey: string, message: any) => {
    const payload = JSON.stringify(message)
    try {
        channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(payload))
    } catch (e) {
        throw e
    }
}

export const subscribeMessage = async (channel: Channel, queueName: string, service: EncodingService, routingKey: string) => {
    const appQueue = await channel.assertQueue(queueName)

    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, routingKey)

    channel.consume(appQueue.queue, data => {
        if (data) {
            //console.log('received data')
            service.subscribeEvents(data.content.toString())
            channel.ack(data)
        }
    })
}