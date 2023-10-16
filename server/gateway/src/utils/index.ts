import amqp from "amqplib";
import { MESSAGE_BROKER_URL } from "../config";

export const connect = async () => {
  try {
    const connection = await amqp.connect(MESSAGE_BROKER_URL);

    return connection;
  } catch (e) {
    throw e;
  }
};
