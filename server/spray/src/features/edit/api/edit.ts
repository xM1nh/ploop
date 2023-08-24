import { Channel } from "amqplib";
import { Express, Request, Response, NextFunction } from "express";
import EditService from "../services/edit-services";
import asyncHandler from 'express-async-handler'
import { subscribeMessage } from "../../../utils";
import { SPRAY_QUEUE, SPRAY_ROUTING_KEY } from "../../../config";

export default (app: Express, channel: Channel) => {
    const service = new EditService()
}