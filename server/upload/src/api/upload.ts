import { Channel } from "amqplib";
import { Express, Request, Response } from "express";
import asyncHandler from 'express-async-handler'
import { publishMessage } from "../utils";
import { PROCESSING_ROUTING_KEY } from "../config";
import { upload } from "../config";

export default (app: Express, channel: Channel) => {
    app.post('/upload', 
        upload.array('sprays[]'),

        asyncHandler(async (req: Request, res: Response) => {
            const id = req.headers['x-upload-id']
            publishMessage(channel, PROCESSING_ROUTING_KEY, Buffer.from(id as string))
            res.sendStatus(200)
        })
    )
}