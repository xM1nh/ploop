import amqp, { Channel } from "amqplib";
import { MESSAGE_BROKER_URL, EXCHANGE_NAME } from "../config";
import UserService from "../services/user-services";

export const connect = async () => {
  try {
    const connection = await amqp.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", {
      durable: true,
    });

    return channel;
  } catch (e) {
    throw e;
  }
};

export const publishMessage = async (
  channel: Channel,
  routingKey: string,
  message: any,
) => {
  message = JSON.stringify(message);
  try {
    channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(message));
  } catch (e) {
    throw e;
  }
};

export const subscribeMessage = async (
  channel: Channel,
  queueName: string,
  service: UserService,
  routingKey: string,
) => {
  const appQueue = await channel.assertQueue(queueName);

  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, routingKey);

  channel.consume(appQueue.queue, async (data) => {
    if (data) {
      await service.subscribeEvents(data.content.toString());
      channel.ack(data);
    }
  });
};
