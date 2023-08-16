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
            const fileCount = req.headers['x-total-files']
            const payload = {
                event: 'PROCESS',
                data: {
                    id,
                    fileCount
                }
            }
            publishMessage(channel, PROCESSING_ROUTING_KEY, payload)
            res.sendStatus(200)
        })
    )
}