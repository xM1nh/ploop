import { Express } from "express";
import { Channel } from "amqplib";
import { subscribeMessage } from "../utils";
import { PROCESSING_QUEUE, PROCESSING_ROUTING_KEY } from "../config";
import EncodingService from "../services/encoding-service";

export default (app: Express, channel: Channel) => {
  const service = new EncodingService(channel);

  subscribeMessage(channel, PROCESSING_QUEUE, service, PROCESSING_ROUTING_KEY);
};
