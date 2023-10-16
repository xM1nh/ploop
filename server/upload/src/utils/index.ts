import amqp, { Channel } from "amqplib";
import { MESSAGE_BROKER_URL, EXCHANGE_NAME } from "../config";

export const serialize = (data: string) => {
  return Buffer.from(data);
};

export const deserialize = (data: Buffer) => {
  return JSON.parse(data.toString());
};

export const connect = async () => {
  try {
    const connection = await amqp.connect(MESSAGE_BROKER_URL as string);
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
  const requestMessage = JSON.stringify(message);
  try {
    channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(requestMessage));
  } catch (e) {
    throw e;
  }
};

export const subscribeMessage = async (
  channel: Channel,
  queueName: string,
  routingKey: string,
) => {
  const appQueue = await channel.assertQueue(queueName);

  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, routingKey);

  channel.consume(appQueue.queue, (data) => {
    if (data) {
      //console.log('received data')
      console.log(data?.content.toString());
      channel.ack(data);
    }
  });
};
