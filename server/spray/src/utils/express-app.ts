import express, {Express} from 'express'
import cors from 'cors'
import { Channel } from 'amqplib'
import { comment, edit, like, save, share, spray } from '../features'

export default (app :Express, channel: Channel) => {

    app.use(express.json())
    app.use(cors())
    app.use(express.static(__dirname + '/public'))

    comment(app, channel)
    edit(app, channel)
    like(app, channel)
    save(app, channel)
    share(app, channel)
    spray(app, channel)
}