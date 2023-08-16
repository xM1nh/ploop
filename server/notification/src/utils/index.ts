import amqp, {Channel} from 'amqplib'
import NotificationService from '../services/notification-services'
import { MESSAGE_BROKER_URL, EXCHANGE_NAME } from '../config'

export const stringToDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US')
}

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

export const publishMessage = async (
    channel: Channel,
    routingKey: string, 
    message: any,
) => {
    message = JSON.stringify(message)
        try {
            channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(message))
        } catch (e) {
            throw e
        }
}

export const subscribeMessage = async (channel: Channel, queueName: string, service: NotificationService, routingKey: string) => {
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