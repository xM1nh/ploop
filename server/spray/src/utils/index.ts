import amqp, { Channel } from "amqplib";
import { MESSAGE_BROKER_URL, EXCHANGE_NAME } from "../config";
import PositionalList from "./positional-list";

export const connect = async () => {
  try {
    const connection = await amqp.connect(MESSAGE_BROKER_URL as string);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", {
      durable: true,
    });
    await channel.assertExchange("graphql_subscriptions", "topic", {
      durable: false,
      autoDelete: false,
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
  exchangeName?: string,
) => {
  message = Buffer.from(JSON.stringify(message));
  try {
    if (!exchangeName) {
      channel.publish(EXCHANGE_NAME, routingKey, message);
    } else {
      channel.publish(exchangeName, routingKey, message);
    }
  } catch (e) {
    throw e;
  }
};

export const subscribeMessage = async (
  channel: Channel,
  service: any,
  queueName: string,
  routingKey: string,
) => {
  const appQueue = await channel.assertQueue(queueName);

  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, routingKey);

  channel.consume(appQueue.queue, (data) => {
    if (data) {
      service.subscribeEvents(data.content.toString());
      channel.ack(data);
    }
  });
};

export { PositionalList };
